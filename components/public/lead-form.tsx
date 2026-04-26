"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { SiteContent } from "@/lib/types";

interface LeadFormProps {
  content: SiteContent["lead"];
}

export function LeadForm({ content }: LeadFormProps) {
  const [status, setStatus] = useState<string>("");
  const [statusTone, setStatusTone] = useState<"idle" | "error" | "success">("idle");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      role: String(data.get("role") || "").trim(),
      need: String(data.get("need") || "").trim()
    };

    if (!payload.name || !payload.phone) {
      setStatus("Vui lòng nhập họ tên và số điện thoại/Zalo.");
      setStatusTone("error");
      return;
    }

    setSubmitting(true);
    setStatus("Đang gửi yêu cầu tư vấn...");
    setStatusTone("idle");

    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { ok?: boolean; error?: string; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Không thể lưu yêu cầu tư vấn.");
      }

      setStatus(result.message || content.successMessage);
      setStatusTone("success");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không thể gửi yêu cầu tư vấn.");
      setStatusTone("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="lead-form" id="leadForm" onSubmit={onSubmit}>
      <label htmlFor="name">{content.nameLabel}</label>
      <input id="name" name="name" autoComplete="name" placeholder="Nguyễn Văn A" required />

      <label htmlFor="phone">{content.phoneLabel}</label>
      <input id="phone" name="phone" autoComplete="tel" placeholder="09xx xxx xxx" required />

      <label htmlFor="role">{content.roleLabel}</label>
      <select id="role" name="role">
        {content.roles.map((role) => (
          <option key={role}>{role}</option>
        ))}
      </select>

      <label htmlFor="need">{content.needLabel}</label>
      <textarea id="need" name="need" placeholder={content.needPlaceholder} />

      <button className="button button-primary full" type="submit" disabled={submitting}>
        <Send aria-hidden="true" size={18} />
        {submitting ? "Đang gửi..." : content.submitLabel}
      </button>

      <p className={`form-status ${statusTone !== "idle" ? `is-${statusTone}` : ""}`} role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
