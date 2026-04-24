import express from "express";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { clearAdminCookie, getAdminFromRequest, loginAdmin, requireAdmin, setAdminCookie } from "./auth.js";
import { ensureDatabase, getSettings, query, updateSettings } from "./db.js";
import { renderHome, renderLeadThanks } from "./views.js";
import {
  renderContentBlockForm,
  renderContentBlocks,
  renderDashboard,
  renderFaqForm,
  renderFaqs,
  renderLeads,
  renderLogin,
  renderProjectForm,
  renderProjects,
  renderSettings
} from "./adminViews.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const uploadsDir = path.join(rootDir, "public", "uploads");

const imageMimeExtensions = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"]
]);

const upload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, callback) {
      fs.mkdir(uploadsDir, { recursive: true }, (error) => callback(error, uploadsDir));
    },
    filename(_req, file, callback) {
      const fallbackExt = imageMimeExtensions.get(file.mimetype) || ".jpg";
      const originalExt = path.extname(file.originalname || "").toLowerCase();
      const ext = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(originalExt) ? originalExt : fallbackExt;
      callback(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
    }
  }),
  fileFilter(_req, file, callback) {
    if (!imageMimeExtensions.has(file.mimetype)) {
      callback(new Error("Chỉ hỗ trợ JPG, PNG, WebP hoặc GIF."));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 12
  }
});

function uploadImages(fields) {
  const middleware = upload.fields(fields);
  return (req, res, next) => {
    middleware(req, res, (error) => {
      if (error) {
        res.status(400).send(`Upload ảnh không hợp lệ: ${error.message}`);
        return;
      }

      next();
    });
  };
}

const app = express();

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(rootDir, "public"), { maxAge: "1h" }));

app.use(async (_req, _res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

app.get("/", asyncRoute(async (_req, res) => {
  const settings = await getSettings();
  const [projects, faqs, blocks] = await Promise.all([
    query("SELECT * FROM projects WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM content_blocks")
  ]);

  res.send(renderHome({
    settings,
    projects: projects.rows,
    faqs: faqs.rows,
    blocks: blocks.rows
  }));
}));

app.post("/lead", asyncRoute(async (req, res) => {
  const { name = "", phone = "", role = "", province = "", scale = "", note = "" } = req.body;
  if (!name.trim() || !phone.trim()) {
    res.redirect("/#cta");
    return;
  }

  await query(
    `INSERT INTO leads(name, phone, role, province, scale, note)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name.trim(), phone.trim(), role.trim(), province.trim(), scale.trim(), note.trim()]
  );

  const settings = await getSettings();
  res.send(renderLeadThanks(settings));
}));

app.get("/robots.txt", asyncRoute(async (_req, res) => {
  const settings = await getSettings();
  res.type("text/plain").send(`User-agent: *
Allow: /
Sitemap: ${settings.site_url || ""}/sitemap.xml
`);
}));

app.get("/sitemap.xml", asyncRoute(async (_req, res) => {
  const settings = await getSettings();
  const now = new Date().toISOString();
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${settings.site_url || ""}/</loc><lastmod>${now}</lastmod><priority>1.0</priority></url>
</urlset>`);
}));

app.get("/admin/login", (req, res) => {
  if (getAdminFromRequest(req)) {
    res.redirect("/admin");
    return;
  }

  res.send(renderLogin({ next: req.query.next || "/admin" }));
});

app.post("/admin/login", asyncRoute(async (req, res) => {
  const admin = await loginAdmin(req.body.email || "", req.body.password || "");
  if (!admin) {
    res.status(401).send(renderLogin({
      error: "Email hoặc mật khẩu không đúng.",
      next: req.body.next || "/admin"
    }));
    return;
  }

  setAdminCookie(res, admin);
  res.redirect(req.body.next || "/admin");
}));

app.post("/admin/logout", (req, res) => {
  clearAdminCookie(res);
  res.redirect("/admin/login");
});

app.get("/admin", requireAdmin, asyncRoute(async (req, res) => {
  const [projects, faqs, leads, contentBlocks] = await Promise.all([
    query("SELECT COUNT(*) AS total FROM projects"),
    query("SELECT COUNT(*) AS total FROM faqs WHERE is_active = 1"),
    query("SELECT COUNT(*) AS total FROM leads"),
    query("SELECT COUNT(*) AS total FROM content_blocks")
  ]);

  res.send(renderDashboard({
    admin: req.admin,
    stats: {
      projects: projects.rows[0].total,
      faqs: faqs.rows[0].total,
      leads: leads.rows[0].total,
      contentBlocks: contentBlocks.rows[0].total
    }
  }));
}));

app.get("/admin/settings", requireAdmin, asyncRoute(async (req, res) => {
  res.send(renderSettings({
    admin: req.admin,
    settings: await getSettings(),
    saved: req.query.saved === "1"
  }));
}));

app.post("/admin/settings", requireAdmin, uploadImages([
  { name: "og_image_file", maxCount: 1 },
  { name: "hero_image_file", maxCount: 1 },
  { name: "logo_url_file", maxCount: 1 }
]), asyncRoute(async (req, res) => {
  await updateSettings(withUploadedSettings(req.body, req.files));
  res.redirect("/admin/settings?saved=1");
}));

app.get("/admin/content", requireAdmin, asyncRoute(async (req, res) => {
  const blocks = await query("SELECT * FROM content_blocks ORDER BY slug ASC");
  res.send(renderContentBlocks({ admin: req.admin, blocks: blocks.rows }));
}));

app.get("/admin/content/:slug/edit", requireAdmin, asyncRoute(async (req, res) => {
  const result = await query("SELECT * FROM content_blocks WHERE slug = ? LIMIT 1", [req.params.slug]);
  if (!result.rows[0]) {
    res.status(404).send("Content block not found");
    return;
  }

  res.send(renderContentBlockForm({
    admin: req.admin,
    block: result.rows[0],
    action: `/admin/content/${encodeURIComponent(req.params.slug)}`
  }));
}));

app.post("/admin/content/:slug", requireAdmin, asyncRoute(async (req, res) => {
  const existing = await query("SELECT * FROM content_blocks WHERE slug = ? LIMIT 1", [req.params.slug]);
  if (!existing.rows[0]) {
    res.status(404).send("Content block not found");
    return;
  }

  let contentJson;
  try {
    contentJson = normalizeContentJson(req.body.content_json);
  } catch {
    res.status(400).send(renderContentBlockForm({
      admin: req.admin,
      block: { ...existing.rows[0], ...req.body, slug: req.params.slug },
      action: `/admin/content/${encodeURIComponent(req.params.slug)}`,
      error: "Content JSON không hợp lệ. Vui lòng kiểm tra dấu ngoặc, dấu phẩy và chuỗi trong JSON."
    }));
    return;
  }

  await query(
    `UPDATE content_blocks
     SET title = ?, kicker = ?, description = ?, content_json = ?, updated_at = CURRENT_TIMESTAMP
     WHERE slug = ?`,
    [req.body.title || "", req.body.kicker || "", req.body.description || "", contentJson, req.params.slug]
  );
  res.redirect("/admin/content");
}));

app.get("/admin/projects", requireAdmin, asyncRoute(async (req, res) => {
  const projects = await query("SELECT * FROM projects ORDER BY sort_order ASC, id ASC");
  res.send(renderProjects({ admin: req.admin, projects: projects.rows }));
}));

app.get("/admin/projects/new", requireAdmin, (req, res) => {
  res.send(renderProjectForm({ admin: req.admin, action: "/admin/projects", title: "Thêm dự án" }));
});

app.post("/admin/projects", requireAdmin, uploadImages([
  { name: "image_file", maxCount: 1 },
  { name: "gallery_files", maxCount: 8 }
]), asyncRoute(async (req, res) => {
  await saveProject(withUploadedProjectImages(req.body, req.files));
  res.redirect("/admin/projects");
}));

app.get("/admin/projects/:id/edit", requireAdmin, asyncRoute(async (req, res) => {
  const result = await query("SELECT * FROM projects WHERE id = ?", [req.params.id]);
  if (!result.rows[0]) {
    res.status(404).send("Project not found");
    return;
  }

  res.send(renderProjectForm({
    admin: req.admin,
    project: result.rows[0],
    action: `/admin/projects/${req.params.id}`,
    title: "Sửa dự án"
  }));
}));

app.post("/admin/projects/:id", requireAdmin, uploadImages([
  { name: "image_file", maxCount: 1 },
  { name: "gallery_files", maxCount: 8 }
]), asyncRoute(async (req, res) => {
  await saveProject(withUploadedProjectImages(req.body, req.files), req.params.id);
  res.redirect("/admin/projects");
}));

app.post("/admin/projects/:id/delete", requireAdmin, asyncRoute(async (req, res) => {
  await query("DELETE FROM projects WHERE id = ?", [req.params.id]);
  res.redirect("/admin/projects");
}));

app.get("/admin/faqs", requireAdmin, asyncRoute(async (req, res) => {
  const faqs = await query("SELECT * FROM faqs ORDER BY sort_order ASC, id ASC");
  res.send(renderFaqs({ admin: req.admin, faqs: faqs.rows }));
}));

app.get("/admin/faqs/new", requireAdmin, (req, res) => {
  res.send(renderFaqForm({ admin: req.admin, action: "/admin/faqs", title: "Thêm FAQ" }));
});

app.post("/admin/faqs", requireAdmin, asyncRoute(async (req, res) => {
  await saveFaq(req.body);
  res.redirect("/admin/faqs");
}));

app.get("/admin/faqs/:id/edit", requireAdmin, asyncRoute(async (req, res) => {
  const result = await query("SELECT * FROM faqs WHERE id = ?", [req.params.id]);
  if (!result.rows[0]) {
    res.status(404).send("FAQ not found");
    return;
  }

  res.send(renderFaqForm({
    admin: req.admin,
    faq: result.rows[0],
    action: `/admin/faqs/${req.params.id}`,
    title: "Sửa FAQ"
  }));
}));

app.post("/admin/faqs/:id", requireAdmin, asyncRoute(async (req, res) => {
  await saveFaq(req.body, req.params.id);
  res.redirect("/admin/faqs");
}));

app.post("/admin/faqs/:id/delete", requireAdmin, asyncRoute(async (req, res) => {
  await query("DELETE FROM faqs WHERE id = ?", [req.params.id]);
  res.redirect("/admin/faqs");
}));

app.get("/admin/leads", requireAdmin, asyncRoute(async (req, res) => {
  const leads = await query("SELECT * FROM leads ORDER BY id DESC LIMIT 200");
  res.send(renderLeads({ admin: req.admin, leads: leads.rows }));
}));

function uploadedUrl(file) {
  return `/uploads/${file.filename}`;
}

function withUploadedSettings(body, files = {}) {
  const next = { ...body };
  const fieldMap = {
    og_image_file: "og_image",
    hero_image_file: "hero_image",
    logo_url_file: "logo_url"
  };

  for (const [fileField, settingField] of Object.entries(fieldMap)) {
    const file = files[fileField]?.[0];
    if (file) next[settingField] = uploadedUrl(file);
  }

  return next;
}

function withUploadedProjectImages(body, files = {}) {
  const next = { ...body };
  const mainImage = files.image_file?.[0];
  const galleryFiles = files.gallery_files || [];

  if (mainImage) next.image_url = uploadedUrl(mainImage);
  if (galleryFiles.length) next.gallery_json = JSON.stringify(galleryFiles.map(uploadedUrl));

  return next;
}

async function saveProject(body, id = null) {
  const args = [
    body.name || "",
    body.status === "closed" ? "closed" : "open",
    body.location || "",
    body.capacity || "",
    body.factory_type || "",
    body.lease_term || "",
    body.price || "",
    body.annual_increase || "",
    Number(body.progress || 0),
    body.summary || "",
    body.note || "",
    body.image_url || "/image.jpg",
    normalizeGalleryJson(body.gallery_json),
    Number(body.sort_order || 0),
    body.is_active ? 1 : 0
  ];

  if (id) {
    await query(
      `UPDATE projects SET
        name = ?, status = ?, location = ?, capacity = ?, factory_type = ?, lease_term = ?,
        price = ?, annual_increase = ?, progress = ?, summary = ?, note = ?, image_url = ?,
        gallery_json = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [...args, id]
    );
    return;
  }

  await query(
    `INSERT INTO projects
      (name, status, location, capacity, factory_type, lease_term, price, annual_increase, progress, summary, note, image_url, gallery_json, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args
  );
}

function normalizeContentJson(value) {
  return JSON.stringify(JSON.parse(value || "{}"));
}

function normalizeGalleryJson(value) {
  try {
    const data = JSON.parse(value || "[]");
    return JSON.stringify(Array.isArray(data) ? data.filter(Boolean) : []);
  } catch {
    return "[]";
  }
}

async function saveFaq(body, id = null) {
  const args = [
    body.question || "",
    body.answer || "",
    Number(body.sort_order || 0),
    body.is_active ? 1 : 0
  ];

  if (id) {
    await query(
      "UPDATE faqs SET question = ?, answer = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [...args, id]
    );
    return;
  }

  await query("INSERT INTO faqs(question, answer, sort_order, is_active) VALUES (?, ?, ?, ?)", args);
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send(`<h1>Server error</h1><pre>${String(err.message || err)}</pre>`);
});

export default app;
