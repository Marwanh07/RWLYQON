# RELYQON website

Premium, responsive RELYQON company website built with Next.js App Router, TypeScript, and Tailwind CSS.

## Local development

1. Install the project dependencies:

   ```sh
   npm install
   ```

2. No email credentials are required. The forms forward submissions through FormSubmit.

3. Start the development server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Email forms

- Idea submissions are sent to `relyqonteam@gmail.com`.
- Support requests are sent to `relyqonteam@gmail.com`.
- Both forms set the visitor's address as `Reply-To`.
- Requests are validated on the server, limited to five per IP per minute per running process, bounded in size, and protected by a honeypot.
- The first submission may require confirming the recipient address with FormSubmit before email delivery is activated.

The in-memory rate limit is best-effort and resets when a serverless instance restarts. For higher-traffic deployments, configure an edge/WAF or shared rate-limit store in addition to the application checks.

## Checks and production

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Deploy to Vercel or another Node.js hosting provider. No email-service credentials are required in the deployment environment.
