import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { defaultSiteContent } from "@/lib/default-content";
import { AdminUser, ConsultRequest, SiteContent } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
const ADMIN_USERS_FILE = path.join(DATA_DIR, "admin-users.json");
const CONSULT_FILE = path.join(DATA_DIR, "consult-requests.json");

const SITE_CONTENT_KEY = "annamloi:site-content";
const ADMIN_USERS_KEY = "annamloi:admin-users";
const CONSULT_REQUESTS_KEY = "annamloi:consult-requests";

const defaultAdminUsers: AdminUser[] = [
  {
    id: "admin-main",
    name: "An Nam Lợi Admin",
    email: "admin@annamloi.vn",
    passwordHash:
      "pbkdf2_sha256$210000$17e9a12754938d2e65d517fbed2f5aad$32aab0a4ce0debe5034935aa7ac9f3aa93705771a4b9392982ffecca05017b0b",
    createdAt: "2026-04-26T00:00:00+07:00",
    updatedAt: "2026-04-26T00:00:00+07:00"
  }
];

function getRedis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

function isVercelRuntime() {
  return process.env.VERCEL === "1";
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function ensureFile<T>(filePath: string, initialValue: T) {
  await ensureDataDir();
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(initialValue, null, 2) + "\n", "utf8");
  }
}

async function readLocalJson<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, fallback);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeLocalJson<T>(filePath: string, value: T) {
  await ensureFile(filePath, value);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export function getStorageMode() {
  if (getRedis()) {
    return "redis";
  }

  return isVercelRuntime() ? "vercel-storage-required" : "json";
}

export async function getSiteContent(): Promise<SiteContent> {
  const redis = getRedis();

  if (redis) {
    const content = await redis.get<SiteContent>(SITE_CONTENT_KEY);
    if (content) {
      return content;
    }

    await redis.set(SITE_CONTENT_KEY, defaultSiteContent);
    return defaultSiteContent;
  }

  return readLocalJson(SITE_CONTENT_FILE, defaultSiteContent);
}

export async function saveSiteContent(content: SiteContent) {
  const redis = getRedis();

  if (redis) {
    await redis.set(SITE_CONTENT_KEY, content);
    return;
  }

  if (isVercelRuntime()) {
    throw new Error("Thiếu Redis storage trên Vercel. Hãy cấu hình KV_REST_API_URL và KV_REST_API_TOKEN.");
  }

  await writeLocalJson(SITE_CONTENT_FILE, content);
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();

  if (envEmail && envPassword) {
    const now = new Date().toISOString();
    return [
      {
        id: "env-admin",
        name: "Primary Admin",
        email: envEmail,
        passwordHash: envPassword,
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  const redis = getRedis();

  if (redis) {
    const users = await redis.get<AdminUser[]>(ADMIN_USERS_KEY);
    if (users?.length) {
      return users;
    }

    await redis.set(ADMIN_USERS_KEY, defaultAdminUsers);
    return defaultAdminUsers;
  }

  return readLocalJson(ADMIN_USERS_FILE, defaultAdminUsers);
}

export async function saveAdminUsers(users: AdminUser[]) {
  const redis = getRedis();

  if (redis) {
    await redis.set(ADMIN_USERS_KEY, users);
    return;
  }

  if (isVercelRuntime()) {
    throw new Error("Thiếu Redis storage trên Vercel. Không thể lưu thay đổi tài khoản admin.");
  }

  await writeLocalJson(ADMIN_USERS_FILE, users);
}

export async function getConsultRequests(): Promise<ConsultRequest[]> {
  const redis = getRedis();

  if (redis) {
    const requests = await redis.get<ConsultRequest[]>(CONSULT_REQUESTS_KEY);
    return (requests ?? []).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  const requests = await readLocalJson<ConsultRequest[]>(CONSULT_FILE, []);
  return requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function appendConsultRequest(
  request: Omit<ConsultRequest, "id" | "createdAt" | "status">
) {
  const entry: ConsultRequest = {
    ...request,
    id: `consult_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new"
  };

  const current = await getConsultRequests();
  const next = [entry, ...current];
  const redis = getRedis();

  if (redis) {
    await redis.set(CONSULT_REQUESTS_KEY, next);
    return entry;
  }

  if (isVercelRuntime()) {
    throw new Error("Thiếu Redis storage trên Vercel. Không thể lưu yêu cầu tư vấn.");
  }

  await writeLocalJson(CONSULT_FILE, next);

  return entry;
}

export async function updateConsultStatus(id: string, status: ConsultRequest["status"]) {
  const current = await getConsultRequests();
  const next = current.map((item) => (item.id === id ? { ...item, status } : item));
  const redis = getRedis();

  if (redis) {
    await redis.set(CONSULT_REQUESTS_KEY, next);
    return;
  }

  if (isVercelRuntime()) {
    throw new Error("Thiếu Redis storage trên Vercel. Không thể cập nhật lead.");
  }

  await writeLocalJson(CONSULT_FILE, next);
}
