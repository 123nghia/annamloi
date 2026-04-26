"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { contentSchema, ContentSectionSchema, FieldSchema } from "@/lib/content-schema";
import { ConsultRequest, SiteContent } from "@/lib/types";
import { AppIcon } from "@/components/ui/app-icon";

type PathSegment = string | number;
type AdminTab = "content" | "consults" | "security";

interface AdminConsoleProps {
  initialContent: SiteContent;
  consults: ConsultRequest[];
  admin: {
    name: string;
    email: string;
  };
  storageMode: string;
}

function getValue(source: unknown, path: PathSegment[]) {
  return path.reduce<unknown>((acc, segment) => {
    if (acc == null) return undefined;
    if (typeof segment === "number" && Array.isArray(acc)) {
      return acc[segment];
    }
    if (typeof segment === "string" && typeof acc === "object") {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

function setValue<T>(source: T, path: PathSegment[], nextValue: unknown): T {
  const draft = structuredClone(source) as Record<string, unknown>;
  let cursor: unknown = draft;

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    if (typeof segment === "number") {
      cursor = (cursor as unknown[])[segment];
    } else {
      cursor = (cursor as Record<string, unknown>)[segment];
    }
  }

  const last = path[path.length - 1];
  if (typeof last === "number") {
    (cursor as unknown[])[last] = nextValue;
  } else {
    (cursor as Record<string, unknown>)[last] = nextValue;
  }

  return draft as T;
}

function joinPath(base: PathSegment[], key: string) {
  return [...base, ...key.split(".")];
}

function Message({ message, tone }: { message: string; tone: "success" | "error" | "neutral" }) {
  return <p className={`admin-form-message is-${tone}`}>{message}</p>;
}

function ImageField({
  value,
  onChange,
  folder
}: {
  value: string;
  onChange: (value: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", folder);

    setUploading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: payload
      });

      const result = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !result.ok || !result.url) {
        throw new Error(result.error || "Không thể upload ảnh.");
      }

      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể upload ảnh.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="admin-image-field">
      <input
        className="admin-input"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="/uploads/hero/..."
      />
      <div className="admin-image-actions">
        <label className="admin-upload-button">
          <input type="file" accept="image/*" onChange={onFileChange} hidden />
          {uploading ? "Đang upload..." : "Upload ảnh"}
        </label>
        {value ? <img src={value} alt="Preview upload" className="admin-image-preview" /> : null}
      </div>
      {error ? <Message message={error} tone="error" /> : null}
    </div>
  );
}

function FieldRenderer({
  schema,
  value,
  path,
  onChange
}: {
  schema: FieldSchema;
  value: unknown;
  path: PathSegment[];
  onChange: (path: PathSegment[], value: unknown) => void;
}) {
  if (schema.type === "group") {
    return (
      <div className="admin-field-group">
        <div className="admin-field-head">
          <strong>{schema.label}</strong>
          {schema.description ? <p>{schema.description}</p> : null}
        </div>
        <div className="admin-field-grid">
          {schema.fields.map((field) => (
            <FieldRenderer
              key={`${path.join(".")}-${field.key}`}
              schema={field}
              value={getValue(value, joinPath([], field.key))}
              path={joinPath(path, field.key)}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    );
  }

  if (schema.type === "array") {
    const items = (value as unknown[]) ?? [];

    return (
      <div className="admin-array">
        <div className="admin-array-head">
          <div>
            <strong>{schema.label}</strong>
            {schema.description ? <p>{schema.description}</p> : null}
          </div>
          <button
            type="button"
            className="admin-mini-button"
            onClick={() => onChange(path, [...items, structuredClone(schema.defaultItem)])}
          >
            <AppIcon name="plus" size={16} />
            Thêm
          </button>
        </div>

        <div className="admin-array-list">
          {items.map((item, index) => (
            <div className="admin-array-card" key={`${path.join(".")}-${index}`}>
              <div className="admin-array-card-head">
                <strong>
                  {schema.itemLabel} {index + 1}
                </strong>
                <div className="admin-array-card-actions">
                  <button
                    type="button"
                    className="admin-icon-button"
                    onClick={() => {
                      if (index === 0) return;
                      const next = [...items];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      onChange(path, next);
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-icon-button"
                    onClick={() => {
                      if (index === items.length - 1) return;
                      const next = [...items];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      onChange(path, next);
                    }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="admin-icon-button is-danger"
                    onClick={() => onChange(path, items.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Xóa
                  </button>
                </div>
              </div>

              {schema.of === "text" ? (
                <textarea
                  className="admin-textarea"
                  value={String(item ?? "")}
                  onChange={(event) => {
                    const next = [...items];
                    next[index] = event.target.value;
                    onChange(path, next);
                  }}
                />
              ) : (
                <div className="admin-field-grid">
                  {schema.fields?.map((field) => (
                    <FieldRenderer
                      key={`${path.join(".")}-${index}-${field.key}`}
                      schema={field}
                      value={getValue(item, joinPath([], field.key))}
                      path={[...path, index, ...field.key.split(".")]}
                      onChange={onChange}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const baseClass =
    schema.type === "textarea"
      ? "admin-textarea"
      : schema.type === "number"
        ? "admin-input admin-input-number"
        : "admin-input";

  return (
    <label className="admin-field">
      <span>{schema.label}</span>
      {schema.description ? <small>{schema.description}</small> : null}
      {schema.type === "textarea" ? (
        <textarea
          className={baseClass}
          value={String(value ?? "")}
          placeholder={schema.placeholder}
          onChange={(event) => onChange(path, event.target.value)}
        />
      ) : schema.type === "select" ? (
        <select
          className="admin-input"
          value={String(value ?? "")}
          onChange={(event) => onChange(path, event.target.value)}
        >
          {schema.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : schema.type === "image" ? (
        <ImageField
          value={String(value ?? "")}
          folder={schema.folder}
          onChange={(nextValue) => onChange(path, nextValue)}
        />
      ) : (
        <input
          className={baseClass}
          type={schema.type === "number" ? "number" : schema.type === "date" ? "date" : "text"}
          value={String(value ?? "")}
          placeholder={schema.placeholder}
          onChange={(event) =>
            onChange(
              path,
              schema.type === "number" ? Number(event.target.value || 0) : event.target.value
            )
          }
        />
      )}
    </label>
  );
}

function SectionEditor({
  section,
  content,
  onUpdate
}: {
  section: ContentSectionSchema;
  content: SiteContent;
  onUpdate: (path: PathSegment[], value: unknown) => void;
}) {
  return (
    <section id={section.id} className="admin-section-card">
      <div className="admin-section-head">
        <div>
          <span className="admin-section-kicker">{section.title}</span>
          <h2>{section.description}</h2>
        </div>
      </div>
      <div className="admin-section-body">
        {section.fields.map((field) => (
          <FieldRenderer
            key={field.key}
            schema={field}
            value={getValue(content, field.key.split("."))}
            path={field.key.split(".")}
            onChange={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}

export function AdminConsole({ initialContent, consults, admin, storageMode }: AdminConsoleProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("content");
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveTone, setSaveTone] = useState<"success" | "error" | "neutral">("neutral");
  const [leadItems, setLeadItems] = useState<ConsultRequest[]>(consults);
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityTone, setSecurityTone] = useState<"success" | "error" | "neutral">("neutral");

  function updateContent(path: PathSegment[], nextValue: unknown) {
    setContent((current) => setValue(current, path, nextValue));
  }

  async function saveContent() {
    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(content)
      });

      const result = (await response.json()) as { ok?: boolean; message?: string; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Không thể lưu nội dung.");
      }

      setSaveTone("success");
      setSaveMessage(result.message || "Đã lưu nội dung.");
    } catch (err) {
      setSaveTone("error");
      setSaveMessage(err instanceof Error ? err.message : "Không thể lưu nội dung.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function updateLeadStatus(id: string, status: ConsultRequest["status"]) {
    const response = await fetch(`/api/admin/consult/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    const result = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Không thể cập nhật trạng thái lead.");
    }

    setLeadItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setSecurityMessage("");

    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: String(data.get("currentPassword") || ""),
          newPassword: String(data.get("newPassword") || "")
        })
      });

      const result = (await response.json()) as { ok?: boolean; message?: string; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Không thể đổi mật khẩu.");
      }

      setSecurityTone("success");
      setSecurityMessage(result.message || "Đã cập nhật mật khẩu.");
      form.reset();
    } catch (err) {
      setSecurityTone("error");
      setSecurityMessage(err instanceof Error ? err.message : "Không thể đổi mật khẩu.");
    }
  }

  const tabLabel = useMemo(
    () => ({
      content: "Nội dung",
      consults: `Yêu cầu tư vấn (${leadItems.length})`,
      security: "Bảo mật"
    }),
    [leadItems.length]
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={content.site.logoUrl} alt={`Logo ${content.site.brandName}`} />
          <div>
            <strong>{content.site.brandName}</strong>
            <span>Admin CMS</span>
          </div>
        </div>

        <div className="admin-user-card">
          <span className="admin-chip">Đang đăng nhập</span>
          <strong>{admin.name}</strong>
          <small>{admin.email}</small>
          <small>
            Storage:{" "}
            {storageMode === "redis"
              ? "Vercel Redis"
              : storageMode === "blob"
                ? "Vercel Blob"
                : storageMode === "vercel-storage-required"
                  ? "Can cau hinh Vercel KV/Blob"
                  : "Local JSON"}
          </small>
        </div>

        <nav className="admin-tabs" aria-label="Admin tabs">
          {(["content", "consults", "security"] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "is-active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabel[tab]}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-actions">
          <button
            type="button"
            className="button button-secondary full"
            onClick={() => window.open("/", "_blank")}
          >
            Xem landing page
          </button>
          <button type="button" className="button button-light full" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-toolbar">
          <div>
            <h1>Trang quản trị nội dung</h1>
            <p>
              Chỉnh nội dung landing page, ảnh minh họa, CTA, inbox tư vấn và tài khoản quản
              trị trên cùng một giao diện.
            </p>
          </div>
          {activeTab === "content" ? (
            <button className="button button-primary" type="button" onClick={saveContent} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          ) : null}
        </div>

        {saveMessage && activeTab === "content" ? <Message message={saveMessage} tone={saveTone} /> : null}

        {activeTab === "content" ? (
          <div className="admin-content-grid">
            {contentSchema.map((section) => (
              <SectionEditor key={section.id} section={section} content={content} onUpdate={updateContent} />
            ))}
          </div>
        ) : null}

        {activeTab === "consults" ? (
          <section className="admin-section-card">
            <div className="admin-section-head">
              <div>
                <span className="admin-section-kicker">Inbox tư vấn</span>
                <h2>Tổng hợp lead gửi từ form “Gửi yêu cầu tư vấn”</h2>
              </div>
            </div>

            <div className="admin-consult-list">
              {leadItems.length ? (
                leadItems.map((lead) => (
                  <article className="admin-consult-card" key={lead.id}>
                    <div className="admin-consult-head">
                      <div>
                        <strong>{lead.name}</strong>
                        <span>{new Date(lead.createdAt).toLocaleString("vi-VN")}</span>
                      </div>
                      <span className={`admin-status-pill is-${lead.status}`}>{lead.status}</span>
                    </div>
                    <div className="admin-consult-meta">
                      <span>{lead.phone}</span>
                      <span>{lead.role || "Chưa chọn vai trò"}</span>
                    </div>
                    <p>{lead.need || "Không có ghi chú thêm."}</p>
                    <div className="admin-consult-actions">
                      <button type="button" onClick={() => updateLeadStatus(lead.id, "new")}>
                        Mới
                      </button>
                      <button type="button" onClick={() => updateLeadStatus(lead.id, "contacted")}>
                        Đã liên hệ
                      </button>
                      <button type="button" onClick={() => updateLeadStatus(lead.id, "closed")}>
                        Đã chốt
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="admin-empty-state">Chưa có lead nào được gửi từ landing page.</p>
              )}
            </div>
          </section>
        ) : null}

        {activeTab === "security" ? (
          <section className="admin-section-card">
            <div className="admin-section-head">
              <div>
                <span className="admin-section-kicker">Bảo mật</span>
                <h2>Tài khoản quản trị và thay đổi mật khẩu</h2>
              </div>
            </div>
            <div className="admin-security-grid">
              <div className="admin-user-card admin-user-card-large">
                <strong>{admin.name}</strong>
                <small>{admin.email}</small>
                <p>
                  Tài khoản này có toàn quyền chỉnh sửa nội dung public, upload ảnh và xem inbox
                  yêu cầu tư vấn.
                </p>
              </div>
              <form className="admin-security-form" onSubmit={changePassword}>
                <label>
                  <span>Mật khẩu hiện tại</span>
                  <input className="admin-input" name="currentPassword" type="password" required />
                </label>
                <label>
                  <span>Mật khẩu mới</span>
                  <input className="admin-input" name="newPassword" type="password" required minLength={8} />
                </label>
                <button className="button button-primary" type="submit">
                  Cập nhật mật khẩu
                </button>
                {securityMessage ? <Message message={securityMessage} tone={securityTone} /> : null}
              </form>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
