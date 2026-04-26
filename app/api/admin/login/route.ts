import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, buildSessionCookie, createSessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { email?: string; password?: string };
    const email = String(payload.email || "").trim();
    const password = String(payload.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng nhập email và mật khẩu." },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Thông tin đăng nhập không đúng." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      admin: {
        name: admin.name,
        email: admin.email
      }
    });
    const cookie = buildSessionCookie(createSessionToken({ email: admin.email, name: admin.name }));
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Không thể đăng nhập." }, { status: 500 });
  }
}
