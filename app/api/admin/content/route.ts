import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";
import { SiteContent } from "@/lib/types";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();

  const content = await getSiteContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized();

  try {
    const payload = (await request.json()) as SiteContent;
    await saveSiteContent(payload);
    return NextResponse.json({ ok: true, message: "Đã lưu nội dung landing page." });
  } catch {
    return NextResponse.json({ ok: false, error: "Không thể lưu nội dung." }, { status: 500 });
  }
}
