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
    return NextResponse.json({ message: "Too many requests. Please wait a moment before submitting again." }, { status: 429 });
  }

  const payload = await readJsonPayload(request);

  if (!payload.ok) {
    return NextResponse.json({ message: payload.message }, { status: payload.status });
  }

  const name = getFormText(payload.value.name);
  const email = getFormText(payload.value.email);
  const problem = getFormText(payload.value.problem);
  const honeypot = getFormText(payload.value.website);

  if (honeypot) {
    return NextResponse.json({ message: "Submission rejected." }, { status: 400 });
  }

  if (!name || !email || !problem) {
    return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
  }

  if (name.length > 120) {
    return NextResponse.json({ message: "Your name must be 120 characters or fewer." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }

  if (problem.length > 5_000) {
    return NextResponse.json({ message: "Your problem description must be 5,000 characters or fewer." }, { status: 400 });
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
      to: ["relyqonteam@gmail.com"],
      replyTo: email,
      subject: "New Support Request — RELYQON",
      html: `
        <h2>New Support Request — RELYQON</h2>
        <p><strong>Full Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Problem Description:</strong></p>
        <p>${escapeHtml(problem).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (data.error) {
      throw new Error(data.error.message ?? "Email delivery failed.");
    }

    return NextResponse.json({ message: "Your support request was submitted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Support email error:", error);

    return NextResponse.json(
      { message: "We could not submit your support request right now. Please try again later." },
      { status: 500 },
    );
  }
}
