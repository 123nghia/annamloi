import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, updateAdminPassword, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    const currentPassword = String(payload.currentPassword || "");
    const newPassword = String(payload.newPassword || "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng nhập đủ mật khẩu hiện tại và mật khẩu mới." },
        { status: 400 }
      );
    }

    if (!verifyPassword(currentPassword, admin.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "Mật khẩu hiện tại không đúng." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Mật khẩu mới phải có ít nhất 8 ký tự." },
        { status: 400 }
      );
    }

    await updateAdminPassword(admin.id, newPassword);
    return NextResponse.json({ ok: true, message: "Đã cập nhật mật khẩu admin." });
  } catch {
    return NextResponse.json({ ok: false, error: "Không thể đổi mật khẩu." }, { status: 500 });
  }
}
