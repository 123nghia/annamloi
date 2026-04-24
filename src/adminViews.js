import { escapeAttr, escapeHtml } from "./utils.js";

function adminLayout({ title, admin, body }) {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Admin An Nam Lợi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/admin.css">
  <script src="/admin.js" defer></script>
</head>
<body class="${admin ? "admin-body" : "login-body"}">
  ${admin ? `<div class="admin-shell">
    <aside class="admin-sidebar">
      <a href="/admin" class="admin-brand"><span>An Nam Lợi</span><small>CMS</small></a>
      <nav class="admin-nav" aria-label="Điều hướng admin">
        <a href="/admin" data-nav-link>Dashboard</a>
        <a href="/admin/settings" data-nav-link>SEO & Hero</a>
        <a href="/admin/content" data-nav-link>Nội dung</a>
        <a href="/admin/projects" data-nav-link>Dự án</a>
        <a href="/admin/faqs" data-nav-link>FAQ</a>
        <a href="/admin/leads" data-nav-link>Lead</a>
      </nav>
      <div class="sidebar-footer">
        <div class="admin-user"><span>Admin</span><strong>${escapeHtml(admin.email || "")}</strong></div>
        <a class="sidebar-link" href="/" target="_blank" rel="noopener">Xem site</a>
        <form method="post" action="/admin/logout"><button type="submit">Đăng xuất</button></form>
      </div>
    </aside>
    <div class="admin-content">
      <header class="admin-topbar">
        <div><span>Admin panel</span><strong>${escapeHtml(title)}</strong></div>
        <a href="/" target="_blank" rel="noopener">Xem frontend</a>
      </header>
      <main class="admin-main">${body}</main>
    </div>
  </div>` : `<main class="login-main">${body}</main>`}
</body>
</html>`;
}

export function renderLogin({ error = "", next = "/admin" }) {
  return adminLayout({
    title: "Đăng nhập",
    body: `<section class="login-box">
      <h1>Đăng nhập admin</h1>
      ${error ? `<div class="alert">${escapeHtml(error)}</div>` : ""}
      <form method="post" action="/admin/login">
        <input type="hidden" name="next" value="${escapeAttr(next)}">
        <label>Email<input name="email" type="email" autocomplete="username" required></label>
        <label>Mật khẩu<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="primary" type="submit">Đăng nhập</button>
      </form>
      <p class="hint">Local mặc định: admin@annamloi.vn / admin123456. Khi deploy Vercel, đặt ADMIN_EMAIL và ADMIN_PASSWORD.</p>
    </section>`
  });
}

export function renderDashboard({ admin, stats }) {
  return adminLayout({
    title: "Dashboard",
    admin,
    body: `<section class="page-head"><h1>Dashboard</h1><p>Quản lý toàn bộ nội dung frontend render bằng Node.js và dữ liệu Turso SQLite.</p></section>
    <section class="stats">
      <a href="/admin/settings"><strong>SEO & Hero</strong><span>Meta title, description, hero, công ty, liên hệ</span></a>
      <a href="/admin/content"><strong>${stats.contentBlocks}</strong><span>Section nội dung trên frontend</span></a>
      <a href="/admin/projects"><strong>${stats.projects}</strong><span>Dự án/nhà máy đang quản lý</span></a>
      <a href="/admin/faqs"><strong>${stats.faqs}</strong><span>Câu hỏi FAQ đang bật</span></a>
      <a href="/admin/leads"><strong>${stats.leads}</strong><span>Lead đã gửi từ website</span></a>
    </section>
    <section class="panel"><h2>Luồng quản trị</h2><ol><li>Cập nhật SEO và hero trước.</li><li>Thêm/sửa dự án, trạng thái mở hoặc đã chốt.</li><li>Rà lại FAQ và form liên hệ.</li><li>Mở trang frontend để kiểm tra hiển thị.</li></ol></section>`
  });
}

const settingGroups = [
  ["SEO", ["site_name", "site_url", "seo_title", "seo_description", "seo_keywords", "og_image"]],
  ["Hero", ["hero_eyebrow", "hero_title", "hero_copy", "hero_image"]],
  ["Công ty & liên hệ", ["company_name", "tax_code", "address", "hotline", "phone_href", "zalo_url", "email", "logo_url", "footer_note"]]
];

const labels = {
  site_name: "Tên site",
  site_url: "URL public",
  seo_title: "SEO title",
  seo_description: "SEO description",
  seo_keywords: "SEO keywords",
  og_image: "Ảnh OG",
  hero_eyebrow: "Hero eyebrow",
  hero_title: "Hero title",
  hero_copy: "Hero mô tả",
  hero_image: "Hero image",
  company_name: "Tên công ty",
  tax_code: "Mã số thuế",
  address: "Địa chỉ",
  hotline: "Hotline hiển thị",
  phone_href: "Số gọi tel",
  zalo_url: "Zalo URL",
  email: "Email",
  logo_url: "Logo URL",
  footer_note: "Ghi chú footer"
};

export function renderSettings({ admin, settings, saved = false }) {
  return adminLayout({
    title: "SEO & Hero",
    admin,
    body: `<section class="page-head"><h1>SEO, Hero, thông tin công ty</h1><p>Những trường này ảnh hưởng trực tiếp đến frontend và SEO metadata.</p></section>
    ${saved ? `<div class="success">Đã lưu thay đổi.</div>` : ""}
    <form class="admin-form" method="post" action="/admin/settings" enctype="multipart/form-data">
      ${settingGroups.map(([group, keys]) => `<fieldset><legend>${escapeHtml(group)}</legend>${keys.map((key) => field(key, settings[key] || "")).join("")}</fieldset>`).join("")}
      <div class="form-actions"><button class="primary" type="submit">Lưu thay đổi</button><a class="button" href="/">Xem frontend</a></div>
    </form>`
  });
}

export function renderContentBlocks({ admin, blocks }) {
  return adminLayout({
    title: "Nội dung",
    admin,
    body: `<section class="page-head"><h1>Nội dung section</h1><p>Chỉnh các block nội dung động đang render trên frontend như nhu cầu, rủi ro và quy trình.</p></section>
    <section class="table-panel"><table><thead><tr><th>Slug</th><th>Tiêu đề</th><th>Mô tả</th><th>Cập nhật</th><th></th></tr></thead><tbody>
      ${blocks.map((block) => `<tr><td><strong>${escapeHtml(block.slug)}</strong><span>${escapeHtml(block.kicker || "")}</span></td><td>${escapeHtml(block.title)}</td><td><span>${escapeHtml(block.description || "")}</span></td><td>${escapeHtml(block.updated_at || "")}</td><td><a href="/admin/content/${encodeURIComponent(block.slug)}/edit">Sửa</a></td></tr>`).join("")}
    </tbody></table></section>`
  });
}

export function renderContentBlockForm({ admin, block, action, error = "" }) {
  return adminLayout({
    title: `Sửa ${block.slug}`,
    admin,
    body: `<section class="page-head"><h1>Sửa nội dung: ${escapeHtml(block.slug)}</h1><p>Phần Content JSON cần là JSON hợp lệ vì frontend dùng dữ liệu này để render danh sách/card.</p></section>
    ${error ? `<div class="alert">${escapeHtml(error)}</div>` : ""}
    <form class="admin-form" method="post" action="${escapeAttr(action)}">
      <fieldset><legend>Nội dung section</legend>
        ${input("kicker", "Kicker", block.kicker)}
        ${input("title", "Tiêu đề", block.title)}
        ${textarea("description", "Mô tả", block.description, 4)}
        ${textarea("content_json", "Content JSON", prettyJson(block.content_json), 14)}
      </fieldset>
      <div class="form-actions"><button class="primary" type="submit">Lưu nội dung</button><a class="button" href="/admin/content">Quay lại</a><a class="button" href="/">Xem frontend</a></div>
    </form>`
  });
}

function prettyJson(value) {
  try {
    return JSON.stringify(JSON.parse(value || "{}"), null, 2);
  } catch {
    return value || "{}";
  }
}

const imageSettingKeys = new Set(["og_image", "hero_image", "logo_url"]);

function field(name, value) {
  if (imageSettingKeys.has(name)) {
    return imageUploadField(name, labels[name] || name, value, `${name}_file`);
  }

  const isLong = ["seo_description", "hero_copy", "address", "footer_note", "seo_keywords"].includes(name);
  return `<label>${escapeHtml(labels[name] || name)}${isLong
    ? `<textarea name="${escapeAttr(name)}" rows="${name === "footer_note" ? 4 : 3}">${escapeHtml(value)}</textarea>`
    : `<input name="${escapeAttr(name)}" value="${escapeAttr(value)}">`}</label>`;
}

function imageUploadField(name, label, value, fileName) {
  return `<div class="image-upload-field">
    <span class="field-label">${escapeHtml(label)}</span>
    <div class="image-upload-row">
      <div class="image-upload-preview">${imageThumb(value, label)}</div>
      <label class="file-picker">
        <input type="file" name="${escapeAttr(fileName)}" accept="image/*" data-image-input>
        <span>Chọn ảnh</span>
      </label>
    </div>
    <input type="hidden" name="${escapeAttr(name)}" value="${escapeAttr(value ?? "")}">
  </div>`;
}

function imageThumb(src, alt) {
  return src
    ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}">`
    : `<span class="empty-thumb">Chưa có ảnh</span>`;
}

function galleryUploadField(value) {
  const gallery = parseArray(value);
  return `<div class="image-upload-field gallery-field">
    <span class="field-label">Gallery</span>
    <div class="thumb-grid">${gallery.length ? gallery.map((src, index) => `<img src="${escapeAttr(src)}" alt="Ảnh gallery ${index + 1}">`).join("") : `<span class="empty-thumb">Chưa có ảnh</span>`}</div>
    <label class="file-picker">
      <input type="file" name="gallery_files" accept="image/*" multiple data-image-input>
      <span>Chọn nhiều ảnh</span>
    </label>
    <input type="hidden" name="gallery_json" value="${escapeAttr(value || "[]")}">
  </div>`;
}

function parseArray(value) {
  try {
    const data = JSON.parse(value || "[]");
    return Array.isArray(data) ? data.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function renderProjects({ admin, projects }) {
  return adminLayout({
    title: "Dự án",
    admin,
    body: `<section class="page-head row"><div><h1>Dự án</h1><p>Quản lý nhà máy thuê điện, trạng thái deal, ảnh và thông số hiển thị.</p></div><a class="primary button" href="/admin/projects/new">Thêm dự án</a></section>
    <section class="table-panel"><table><thead><tr><th>Ảnh</th><th>Dự án</th><th>Trạng thái</th><th>Công suất</th><th>Giá thuê</th><th>Thứ tự</th><th></th></tr></thead><tbody>
      ${projects.map((project) => `<tr><td><img class="table-thumb" src="${escapeAttr(project.image_url || "/image.jpg")}" alt="${escapeAttr(project.name)}"></td><td><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.location)} | ${escapeHtml(project.summary)}</span></td><td><span class="status-pill ${project.status === "closed" ? "is-closed" : "is-open"}">${project.status === "closed" ? "Đã chốt" : "Còn mở"}</span></td><td>${escapeHtml(project.capacity)}</td><td>${escapeHtml(project.price)}</td><td>${Number(project.sort_order || 0)}</td><td><a href="/admin/projects/${project.id}/edit">Sửa</a></td></tr>`).join("")}
    </tbody></table></section>`
  });
}

const emptyProject = {
  name: "",
  status: "open",
  location: "",
  capacity: "",
  factory_type: "",
  lease_term: "10 năm + gia hạn 5 năm",
  price: "+1.780 đ/kWh",
  annual_increase: "3%/năm",
  progress: 0,
  summary: "Hồ sơ đang cập nhật",
  note: "",
  image_url: "/image.jpg",
  gallery_json: "[\"/image.jpg\",\"/image.jpg\",\"/image.jpg\"]",
  sort_order: 0,
  is_active: 1
};

export function renderProjectForm({ admin, project = emptyProject, action, title }) {
  const p = { ...emptyProject, ...project };
  return adminLayout({
    title,
    admin,
    body: `<section class="page-head"><h1>${escapeHtml(title)}</h1><p>Upload ảnh chính và gallery để hiển thị thumbnail trong admin và frontend.</p></section>
    <form class="admin-form" method="post" action="${escapeAttr(action)}" enctype="multipart/form-data">
      <fieldset><legend>Thông tin dự án</legend>
        ${input("name", "Tên dự án", p.name)}
        <label>Trạng thái<select name="status"><option value="open" ${p.status === "open" ? "selected" : ""}>Còn mở</option><option value="closed" ${p.status === "closed" ? "selected" : ""}>Đã chốt</option></select></label>
        ${input("location", "Khu vực", p.location)}
        ${input("capacity", "Công suất", p.capacity)}
        ${input("factory_type", "Loại nhà máy", p.factory_type)}
        ${input("lease_term", "Thời gian thuê", p.lease_term)}
        ${input("price", "Giá thuê", p.price)}
        ${input("annual_increase", "Tăng hằng năm", p.annual_increase)}
        ${input("progress", "Tiến độ deal (%)", p.progress, "number")}
        ${input("summary", "Tóm tắt", p.summary)}
        ${textarea("note", "Ghi chú", p.note)}
      </fieldset>
      <fieldset><legend>Ảnh & hiển thị</legend>
        ${imageUploadField("image_url", "Ảnh chính", p.image_url, "image_file")}
        ${galleryUploadField(p.gallery_json)}
        ${input("sort_order", "Thứ tự", p.sort_order, "number")}
        <label class="inline"><input type="checkbox" name="is_active" value="1" ${Number(p.is_active) ? "checked" : ""}> Hiển thị trên frontend</label>
      </fieldset>
      <div class="form-actions"><button class="primary" type="submit">Lưu dự án</button><a class="button" href="/admin/projects">Quay lại</a></div>
    </form>
    ${project.id ? `<form class="danger-form" method="post" action="/admin/projects/${project.id}/delete" onsubmit="return confirm('Xóa dự án này?')"><button type="submit">Xóa dự án</button></form>` : ""}`
  });
}

function input(name, label, value, type = "text") {
  return `<label>${escapeHtml(label)}<input type="${escapeAttr(type)}" name="${escapeAttr(name)}" value="${escapeAttr(value ?? "")}"></label>`;
}

function textarea(name, label, value, rows = 3) {
  return `<label>${escapeHtml(label)}<textarea name="${escapeAttr(name)}" rows="${rows}">${escapeHtml(value ?? "")}</textarea></label>`;
}

export function renderFaqs({ admin, faqs }) {
  return adminLayout({
    title: "FAQ",
    admin,
    body: `<section class="page-head row"><div><h1>FAQ</h1><p>Quản lý câu hỏi thường gặp hiển thị ở frontend và FAQPage schema.</p></div><a class="primary button" href="/admin/faqs/new">Thêm FAQ</a></section>
    <section class="table-panel"><table><thead><tr><th>Câu hỏi</th><th>Thứ tự</th><th>Hiển thị</th><th></th></tr></thead><tbody>
      ${faqs.map((faq) => `<tr><td><strong>${escapeHtml(faq.question)}</strong><span>${escapeHtml(faq.answer)}</span></td><td>${Number(faq.sort_order || 0)}</td><td>${Number(faq.is_active) ? "Bật" : "Tắt"}</td><td><a href="/admin/faqs/${faq.id}/edit">Sửa</a></td></tr>`).join("")}
    </tbody></table></section>`
  });
}

const emptyFaq = { question: "", answer: "", sort_order: 0, is_active: 1 };

export function renderFaqForm({ admin, faq = emptyFaq, action, title }) {
  const f = { ...emptyFaq, ...faq };
  return adminLayout({
    title,
    admin,
    body: `<section class="page-head"><h1>${escapeHtml(title)}</h1></section>
    <form class="admin-form" method="post" action="${escapeAttr(action)}">
      <fieldset><legend>Nội dung FAQ</legend>
        ${input("question", "Câu hỏi", f.question)}
        ${textarea("answer", "Câu trả lời", f.answer, 5)}
        ${input("sort_order", "Thứ tự", f.sort_order, "number")}
        <label class="inline"><input type="checkbox" name="is_active" value="1" ${Number(f.is_active) ? "checked" : ""}> Hiển thị</label>
      </fieldset>
      <div class="form-actions"><button class="primary" type="submit">Lưu FAQ</button><a class="button" href="/admin/faqs">Quay lại</a></div>
    </form>
    ${faq.id ? `<form class="danger-form" method="post" action="/admin/faqs/${faq.id}/delete" onsubmit="return confirm('Xóa FAQ này?')"><button type="submit">Xóa FAQ</button></form>` : ""}`
  });
}

export function renderLeads({ admin, leads }) {
  return adminLayout({
    title: "Lead",
    admin,
    body: `<section class="page-head"><h1>Lead từ website</h1><p>Thông tin khách gửi từ form frontend được lưu trực tiếp vào Turso SQLite.</p></section>
    <section class="table-panel"><table><thead><tr><th>Khách</th><th>Vai trò</th><th>Khu vực</th><th>Nhu cầu</th><th>Thời gian</th></tr></thead><tbody>
      ${leads.map((lead) => `<tr><td><strong>${escapeHtml(lead.name)}</strong><span>${escapeHtml(lead.phone)}</span></td><td>${escapeHtml(lead.role || "Chưa chọn")}</td><td>${escapeHtml(lead.province || "")}</td><td><span>${escapeHtml(lead.scale || "")}</span><span>${escapeHtml(lead.note || "")}</span></td><td>${escapeHtml(lead.created_at)}</td></tr>`).join("")}
    </tbody></table></section>`
  });
}
