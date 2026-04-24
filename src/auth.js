import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { config } from "./config.js";
import { query } from "./db.js";

const cookieName = "annamloi_admin";
const maxAgeSeconds = 60 * 60 * 24 * 7;

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload) {
  return crypto.createHmac("sha256", config.cookieSecret).update(payload).digest("base64url");
}

export async function loginAdmin(email, password) {
  const result = await query("SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1", [email.trim().toLowerCase()]);
  const admin = result.rows[0];
  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) return null;

  return { id: admin.id, email: admin.email };
}

export function setAdminCookie(res, admin) {
  const payload = base64url(JSON.stringify({
    id: admin.id,
    email: admin.email,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds
  }));
  const token = `${payload}.${sign(payload)}`;

  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: Boolean(process.env.VERCEL),
    maxAge: maxAgeSeconds * 1000,
    path: "/"
  });
}

export function clearAdminCookie(res) {
  res.clearCookie(cookieName, { path: "/" });
}

export function getAdminFromRequest(req) {
  const token = req.cookies?.[cookieName];
  if (!token || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: data.id, email: data.email };
  } catch {
    return null;
  }
}

export function requireAdmin(req, res, next) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    res.redirect(`/admin/login?next=${encodeURIComponent(req.originalUrl)}`);
    return;
  }

  req.admin = admin;
  next();
}
