"use client";

import { useState } from "react";

const subjects = [
  "Freelance project",
  "Full-time opportunity",
  "Speaking / consulting",
  "Just saying hello",
  "Other",
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: subjects[0], message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function update(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  if (status === "success") {
    return (
      <div
        className="rounded-xl p-10 text-center"
        style={{ border: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "var(--accent-sage)", color: "#F7F4EF" }}
        >
          ✓
        </div>
        <h2
          className="font-serif text-2xl mb-3"
          style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
        >
          Message sent
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          I'll get back to you within a couple of days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm"
          style={{ color: "var(--accent-sage)" }}
        >
          Send another →
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "transparent",
    border: "1px solid var(--border-medium)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 200ms",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-tertiary)",
    fontFamily: "var(--font-mono)",
    marginBottom: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-label="Contact form">
      <div>
        <label htmlFor="contact-name" style={labelStyle}>Name</label>
        <input
          id="contact-name"
          type="text"
          required
          value={form.name}
          onChange={update("name")}
          placeholder="Your name"
          autoComplete="name"
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; }}
        />
      </div>

      <div>
        <label htmlFor="contact-email" style={labelStyle}>Email</label>
        <input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={update("email")}
          placeholder="your@email.com"
          autoComplete="email"
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; }}
        />
      </div>

      <div>
        <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
        <select
          id="contact-subject"
          value={form.subject}
          onChange={update("subject")}
          style={{ ...inputStyle, cursor: "pointer" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; }}
        >
          {subjects.map((s) => (
            <option key={s} value={s} style={{ background: "var(--bg-primary)" }}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" style={labelStyle}>Message</label>
        <textarea
          id="contact-message"
          required
          value={form.message}
          onChange={update("message")}
          placeholder="What's on your mind?"
          rows={6}
          style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-sage)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; }}
        />
      </div>

      {status === "error" && (
        <p className="text-sm" style={{ color: "var(--accent-rose)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
        style={{
          background: "var(--accent-sage)",
          color: "#F7F4EF",
          fontFamily: "var(--font-sans)",
        }}
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
