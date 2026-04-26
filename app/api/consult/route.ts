import { NextRequest, NextResponse } from "next/server";
import { appendConsultRequest } from "@/lib/content-store";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      phone?: string;
      role?: string;
      need?: string;
    };

    const name = String(payload.name || "").trim();
    const phone = String(payload.phone || "").trim();
    const role = String(payload.role || "").trim();
    const need = String(payload.need || "").trim();

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, error: "Vui long nhap ho ten va so dien thoai/Zalo." },
        { status: 400 }
      );
    }

    const entry = await appendConsultRequest({
      name,
      phone,
      role,
      need,
      source: "landing-page"
    });

    return NextResponse.json({
      ok: true,
      id: entry.id,
      message: "Da luu yeu cau tu van. Doi van hanh se lien he lai som."
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Khong the luu yeu cau tu van."
      },
      { status: 500 }
    );
  }
}
