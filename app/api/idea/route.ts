import { NextResponse } from "next/server";
import {
  consumeFormRateLimit,
  getFormText,
  isValidEmail,
  readJsonPayload,
  submitFormToFormSubmit,
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

  try {
    await submitFormToFormSubmit({
      email,
      message,
      _replyto: email,
      _subject: "New Project Idea — RELYQON",
      _template: "table",
    });

    return NextResponse.json({ message: "Your idea has been sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Idea email error:", error);

    return NextResponse.json(
      { message: "We could not send your idea at this time. Please try again later or contact relyqon@gmail.com directly." },
      { status: 500 },
    );
  }
}
