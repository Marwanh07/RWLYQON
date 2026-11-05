const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 5;
const maxRateLimitEntries = 10_000;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type JsonPayloadResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; status: 400 | 413; message: string };

export async function readJsonPayload(request: Request): Promise<JsonPayloadResult> {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();

  if (contentType !== "application/json") {
    return { ok: false, status: 400, message: "Please submit the form using the supported format." };
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > 24_000) {
    return { ok: false, status: 413, message: "The submitted form is too large." };
  }

  const reader = request.body?.getReader();

  if (!reader) {
    return { ok: false, status: 400, message: "The request payload is invalid." };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > 24_000) {
        await reader.cancel();
        return { ok: false, status: 413, message: "The submitted form is too large." };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400, message: "The request payload is invalid." };
  }

  let payload: unknown;

  try {
    const body = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    payload = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return { ok: false, status: 400, message: "The request payload is invalid." };
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return { ok: false, status: 400, message: "The request payload is invalid." };
  }

  return { ok: true, value: payload as Record<string, unknown> };
}

export function consumeFormRateLimit(request: Request) {
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = realIp || forwardedIp || "unknown";
  const now = Date.now();

  for (const [ip, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip);
    }
  }

  const existing = rateLimitStore.get(clientIp);

  if (existing && existing.count >= rateLimitMaxRequests) {
    return false;
  }

  if (existing) {
    existing.count += 1;
    return true;
  }

  if (rateLimitStore.size >= maxRateLimitEntries) {
    return false;
  }

  rateLimitStore.set(clientIp, { count: 1, resetAt: now + rateLimitWindowMs });
  return true;
}

export function getFormText(value: unknown) {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim()
    : "";
}

export function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export function getEmailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !fromAddress || !isValidEmail(fromAddress)) {
    return null;
  }

  return { apiKey, fromAddress };
}
