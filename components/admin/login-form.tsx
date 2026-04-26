"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: String(data.get("email") || "").trim(),
          password: String(data.get("password") || "")
        })
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Không thể đăng nhập.");
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đăng nhập.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-login-card" onSubmit={onSubmit}>
      <div className="admin-login-copy">
        <span className="admin-chip">Admin CMS</span>
        <h1>Quản trị nội dung An Nam Lợi</h1>
        <p>
          Đăng nhập để chỉnh hero, deal list, dashboard, footer, ảnh minh họa và inbox
          yêu cầu tư vấn.
        </p>
      </div>

      <label htmlFor="email">Email admin</label>
      <input id="email" name="email" type="email" placeholder="admin@annamloi.vn" required />

      <label htmlFor="password">Mật khẩu</label>
      <input id="password" name="password" type="password" placeholder="••••••••" required />

      <button className="button button-primary full" type="submit" disabled={submitting}>
        {submitting ? "Đang đăng nhập..." : "Đăng nhập quản trị"}
      </button>

      {error ? <p className="admin-form-message is-error">{error}</p> : null}
    </form>
  );
}
