import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  consumeFormRateLimit,
  escapeHtml,
  getEmailConfiguration,
  getFormText,
  isValidEmail,
  readJsonPayload,
} from "@/lib/form-submissions";

export async function POST(request: Request) {
  if (!consumeFormRateLimit(request)) {
    return NextResponse.json({ message: "Too many submissions. Please wait a moment and try again." }, { status: 429 });
  }

  const payload = await readJsonPayload(request);

  if (!payload.ok) {
    return NextResponse.json({ message: payload.message }, { status: payload.status });
  }

  const email = getFormText(payload.value.email);
  const message = getFormText(payload.value.message);
  const honeypot = getFormText(payload.value.website);

  if (honeypot) {
    return NextResponse.json({ message: "Submission rejected." }, { status: 400 });
  }

  if (!email || !message) {
    return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }

  if (message.length > 5_000) {
    return NextResponse.json({ message: "Your idea must be 5,000 characters or fewer." }, { status: 400 });
  }

  const emailConfiguration = getEmailConfiguration();

  if (!emailConfiguration) {
    return NextResponse.json(
      { message: "The email service is not configured. Set RESEND_API_KEY and a verified-domain RESEND_FROM_EMAIL." },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(emailConfiguration.apiKey);
    const data = await resend.emails.send({
      from: emailConfiguration.fromAddress,
      to: ["relyqon@gmail.com"],
      replyTo: email,
      subject: "New Project Idea — RELYQON Website",
      html: `
        <h2>New Project Idea — RELYQON Website</h2>
        <p><strong>Sender Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Project Idea:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (data.error) {
      throw new Error(data.error.message ?? "Email delivery failed.");
    }

    return NextResponse.json({ message: "Your idea has been sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Idea email error:", error);

    return NextResponse.json(
      { message: "We could not send your idea at this time. Please try again later or contact relyqon@gmail.com directly." },
      { status: 500 },
    );
  }
}
