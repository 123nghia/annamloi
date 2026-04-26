import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { updateConsultStatus } from "@/lib/content-store";
import { ConsultRequest } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const payload = (await request.json()) as { status?: ConsultRequest["status"] };
    const status = payload.status;

    if (!status || !["new", "contacted", "closed"].includes(status)) {
      return NextResponse.json({ ok: false, error: "Trang thai khong hop le." }, { status: 400 });
    }

    await updateConsultStatus(id, status);
    return NextResponse.json({ ok: true, message: "Da cap nhat trang thai lead." });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Khong the cap nhat trang thai lead."
      },
      { status: 500 }
    );
  }
}
