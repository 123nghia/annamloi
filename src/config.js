export const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

export const config = {
  databaseUrl: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || (isProduction ? "" : "file:local.db"),
  databaseAuthToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || undefined,
  adminEmail: process.env.ADMIN_EMAIL || "admin@annamloi.vn",
  adminPassword: process.env.ADMIN_PASSWORD || (isProduction ? "" : "admin123456"),
  cookieSecret: process.env.COOKIE_SECRET || (isProduction ? "" : "dev-secret-change-me"),
  publicSiteUrl: process.env.PUBLIC_SITE_URL || "http://localhost:3000"
};

export function assertRuntimeConfig() {
  if (!config.databaseUrl) {
    throw new Error("Missing TURSO_DATABASE_URL. Add it in Vercel Environment Variables.");
  }

  if (isProduction && !config.adminPassword) {
    throw new Error("Missing ADMIN_PASSWORD. Add it before first deploy so the admin account can be seeded.");
  }

  if (isProduction && !process.env.COOKIE_SECRET) {
    throw new Error("Missing COOKIE_SECRET. Add a long random value in Vercel Environment Variables.");
  }
}
