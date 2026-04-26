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
        { ok: false, error: "Vui lòng nhập họ tên và số điện thoại/Zalo." },
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
      message: "Đã lưu yêu cầu tư vấn. Đội vận hành sẽ liên hệ lại sớm."
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Không thể lưu yêu cầu tư vấn." },
      { status: 500 }
    );
  }
}
