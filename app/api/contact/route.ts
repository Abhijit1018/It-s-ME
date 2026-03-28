import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(3000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  // Resend integration (requires RESEND_API_KEY env var)
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // Dev mode: log and return success
    console.log("Contact form submission:", { name, email, subject });
    return NextResponse.json({ ok: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@portfolio.dev",
      to: process.env.RESEND_FROM_EMAIL ?? "hello@example.com",
      replyTo: email,
      subject: `[Portfolio] ${subject} — from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
