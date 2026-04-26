import { promises as fs } from "fs";
import path from "path";
import { get as getBlob, put as putBlob } from "@vercel/blob";
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

const SITE_CONTENT_BLOB = "cms/site-content.json";
const ADMIN_USERS_BLOB = "cms/admin-users.json";
const CONSULT_REQUESTS_BLOB = "cms/consult-requests.json";

const defaultAdminUsers: AdminUser[] = [
  {
    id: "admin-main",
    name: "An Nam Loi Admin",
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

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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

async function readBundledJson<T>(filePath: string, fallback: T): Promise<T> {
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

async function loadBlobJson<T>(pathname: string): Promise<T | null> {
  try {
    const result = await getBlob(pathname, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return null;
    }

    const raw = await new Response(result.stream).text();
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeBlobJson<T>(pathname: string, value: T) {
  await putBlob(pathname, JSON.stringify(value, null, 2) + "\n", {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json"
  });
}

function buildEnvAdminUsers() {
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!envEmail || !envPassword) {
    return null;
  }

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
  ] satisfies AdminUser[];
}

export function getStorageMode() {
  if (getRedis()) {
    return "redis";
  }

  if (hasBlobStorage()) {
    return "blob";
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

  if (hasBlobStorage()) {
    const content = await loadBlobJson<SiteContent>(SITE_CONTENT_BLOB);
    if (content) {
      return content;
    }

    await writeBlobJson(SITE_CONTENT_BLOB, defaultSiteContent);
    return defaultSiteContent;
  }

  if (isVercelRuntime()) {
    return readBundledJson(SITE_CONTENT_FILE, defaultSiteContent);
  }

  return readLocalJson(SITE_CONTENT_FILE, defaultSiteContent);
}

export async function saveSiteContent(content: SiteContent) {
  const redis = getRedis();

  if (redis) {
    await redis.set(SITE_CONTENT_KEY, content);
    return;
  }

  if (hasBlobStorage()) {
    await writeBlobJson(SITE_CONTENT_BLOB, content);
    return;
  }

  if (isVercelRuntime()) {
    throw new Error("Thieu storage tren Vercel. Hay cau hinh KV hoac Blob de luu noi dung.");
  }

  await writeLocalJson(SITE_CONTENT_FILE, content);
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const envUsers = buildEnvAdminUsers();
  const redis = getRedis();

  if (redis) {
    const users = await redis.get<AdminUser[]>(ADMIN_USERS_KEY);
    if (users?.length) {
      return users;
    }

    const initialUsers = envUsers ?? defaultAdminUsers;
    await redis.set(ADMIN_USERS_KEY, initialUsers);
    return initialUsers;
  }

  if (hasBlobStorage()) {
    const users = await loadBlobJson<AdminUser[]>(ADMIN_USERS_BLOB);
    if (users?.length) {
      return users;
    }

    const initialUsers = envUsers ?? defaultAdminUsers;
    await writeBlobJson(ADMIN_USERS_BLOB, initialUsers);
    return initialUsers;
  }

  if (envUsers) {
    return envUsers;
  }

  if (isVercelRuntime()) {
    return readBundledJson(ADMIN_USERS_FILE, defaultAdminUsers);
  }

  return readLocalJson(ADMIN_USERS_FILE, defaultAdminUsers);
}

export async function saveAdminUsers(users: AdminUser[]) {
  const redis = getRedis();

  if (redis) {
    await redis.set(ADMIN_USERS_KEY, users);
    return;
  }

  if (hasBlobStorage()) {
    await writeBlobJson(ADMIN_USERS_BLOB, users);
    return;
  }

  if (isVercelRuntime()) {
    throw new Error("Thieu storage tren Vercel. Khong the luu thay doi tai khoan admin.");
  }

  await writeLocalJson(ADMIN_USERS_FILE, users);
}

export async function getConsultRequests(): Promise<ConsultRequest[]> {
  const redis = getRedis();

  if (redis) {
    const requests = await redis.get<ConsultRequest[]>(CONSULT_REQUESTS_KEY);
    return (requests ?? []).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  if (hasBlobStorage()) {
    const requests = (await loadBlobJson<ConsultRequest[]>(CONSULT_REQUESTS_BLOB)) ?? [];
    return requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  if (isVercelRuntime()) {
    const requests = await readBundledJson<ConsultRequest[]>(CONSULT_FILE, []);
    return requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
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

  if (hasBlobStorage()) {
    await writeBlobJson(CONSULT_REQUESTS_BLOB, next);
    return entry;
  }

  if (isVercelRuntime()) {
    throw new Error("Thieu storage tren Vercel. Khong the luu yeu cau tu van.");
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

  if (hasBlobStorage()) {
    await writeBlobJson(CONSULT_REQUESTS_BLOB, next);
    return;
  }

  if (isVercelRuntime()) {
    throw new Error("Thieu storage tren Vercel. Khong the cap nhat lead.");
  }

  await writeLocalJson(CONSULT_FILE, next);
}
