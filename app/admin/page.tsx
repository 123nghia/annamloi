import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin/admin-console";
import { getCurrentAdmin } from "@/lib/auth";
import { getConsultRequests, getSiteContent, getStorageMode } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const [content, consults] = await Promise.all([getSiteContent(), getConsultRequests()]);

  return (
    <AdminConsole
      initialContent={content}
      consults={consults}
      admin={{ name: admin.name, email: admin.email }}
      storageMode={getStorageMode()}
    />
  );
}
