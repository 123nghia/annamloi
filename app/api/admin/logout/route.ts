import { NextResponse } from "next/server";
import { buildExpiredSessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const cookie = buildExpiredSessionCookie();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
