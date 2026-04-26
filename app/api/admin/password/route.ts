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
        { ok: false, error: "Vui long nhap du mat khau hien tai va mat khau moi." },
        { status: 400 }
      );
    }

    if (!verifyPassword(currentPassword, admin.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "Mat khau hien tai khong dung." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Mat khau moi phai co it nhat 8 ky tu." },
        { status: 400 }
      );
    }

    await updateAdminPassword(admin.id, newPassword);
    return NextResponse.json({ ok: true, message: "Da cap nhat mat khau admin." });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Khong the doi mat khau."
      },
      { status: 500 }
    );
  }
}
