import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { AdminUser } from "@/lib/types";
import { getAdminUsers, saveAdminUsers } from "@/lib/content-store";

const SESSION_COOKIE = "annamloi_admin_session";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "annamloi-dev-secret";
}

function encodeBase64Url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function decodeBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function hashPassword(password: string, salt?: string) {
  const currentSalt = salt || randomBytes(16).toString("hex");
  const iterations = 210000;
  const hash = pbkdf2Sync(password, currentSalt, iterations, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$${iterations}$${currentSalt}$${hash}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  if (passwordHash.startsWith("pbkdf2_sha256$")) {
    const [, iterationsText, salt, storedHash] = passwordHash.split("$");
    const hash = pbkdf2Sync(password, salt, Number(iterationsText), 32, "sha256").toString("hex");
    const incoming = Buffer.from(hash, "hex");
    const stored = Buffer.from(storedHash, "hex");
    return incoming.length === stored.length && timingSafeEqual(incoming, stored);
  }

  return password === passwordHash;
}

export function createSessionToken(payload: { email: string; name: string }) {
  const body = encodeBase64Url(
    JSON.stringify({
      ...payload,
      exp: Date.now() + 1000 * 60 * 60 * 12
    })
  );
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function parseSessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature || sign(body) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(body)) as {
      email: string;
      name: string;
      exp: number;
    };

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const session = parseSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  const users = await getAdminUsers();
  return users.find((item) => item.email === session.email) ?? null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}

export async function authenticateAdmin(email: string, password: string) {
  const users = await getAdminUsers();
  const admin = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return null;
  }

  const updatedUsers = users.map((item) =>
    item.id === admin.id ? { ...item, lastLoginAt: new Date().toISOString() } : item
  );
  await saveAdminUsers(updatedUsers);
  return admin;
}

export async function updateAdminPassword(adminId: string, password: string) {
  const users = await getAdminUsers();
  const next = users.map((item) =>
    item.id === adminId
      ? {
          ...item,
          passwordHash: hashPassword(password),
          updatedAt: new Date().toISOString()
        }
      : item
  );
  await saveAdminUsers(next);
}

export function buildSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.VERCEL === "1",
      path: "/",
      maxAge: 60 * 60 * 12
    }
  };
}

export function buildExpiredSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.VERCEL === "1",
      path: "/",
      maxAge: 0
    }
  };
}
