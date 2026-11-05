# RELYQON website

Premium, responsive RELYQON company website built with Next.js App Router, TypeScript, and Tailwind CSS.

## Local development

1. Install the project dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env.local` and configure the email service:

   ```dotenv
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=hello@your-verified-domain.com
   ```

   Create an API key in Resend and verify the sender domain there first. Do not use a made-up sender or put the API key in a `NEXT_PUBLIC_` variable. The sender must be an address on the domain verified with Resend.

3. Start the development server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Email forms

- Idea submissions are sent to `relyqon@gmail.com`.
- Support requests are sent to `relyqonteam@gmail.com`.
- Both forms use the configured verified sender address and set the visitor's address as `Reply-To`.
- Requests are validated on the server, limited to five per IP per minute per running process, bounded in size, and protected by a honeypot.

The in-memory rate limit is best-effort and resets when a serverless instance restarts. For higher-traffic deployments, configure an edge/WAF or shared rate-limit store in addition to the application checks.

## Checks and production

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Deploy to Vercel or another Node.js hosting provider and set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in that environment's server-side variables before enabling the live forms.
