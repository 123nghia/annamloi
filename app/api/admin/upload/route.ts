import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { slugifyName } from "@/lib/site-utils";

function sanitizeFolder(input: string) {
  return input.replace(/[^a-z0-9/_-]/gi, "").replace(/^\//, "") || "misc";
}

function getExtension(fileName: string, mimeType: string) {
  const ext = path.extname(fileName);
  if (ext) return ext.toLowerCase();

  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/svg+xml") return ".svg";
  return ".bin";
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const folder = sanitizeFolder(String(data.get("folder") || "misc"));
    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Thiếu file upload." }, { status: 400 });
    }

    const extension = getExtension(file.name, file.type);
    const safeBase = slugifyName(file.name.replace(path.extname(file.name), "")) || "upload";
    const pathname = `${folder}/${Date.now()}-${safeBase}${extension}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(pathname, file, {
        access: "public",
        addRandomSuffix: false
      });
      return NextResponse.json({ ok: true, url: blob.url });
    }

    if (process.env.VERCEL === "1") {
      return NextResponse.json(
        {
          ok: false,
          error: "Thiếu Blob storage trên Vercel. Hãy cấu hình BLOB_READ_WRITE_TOKEN để upload ảnh."
        },
        { status: 500 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(uploadDir, { recursive: true });
    const diskPath = path.join(uploadDir, path.basename(pathname));
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(diskPath, Buffer.from(arrayBuffer));

    return NextResponse.json({
      ok: true,
      url: `/uploads/${folder}/${path.basename(pathname)}`
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Không thể upload ảnh." }, { status: 500 });
  }
}
