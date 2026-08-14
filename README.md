# Job Match AI

Fullstack demo app for AI-powered resume and job description matching. Built with **Next.js 15**, **React 19**, and **Google Gemini**.

Upload a resume (PDF or text), paste a vacancy URL or description, and get a structured report: match score, skills gap, recommendations, resume tips, and interview questions.

---

## Features

- **Demo access** — shared access code unlocks a guest session (`httpOnly` cookie)
- **Resume input** — PDF upload (client-side parsing via `pdfjs-dist`) or editable extracted text
- **Vacancy input** — plain text or URL (server-side scraping with basic SSRF protection)
- **AI analysis** — Gemini returns structured JSON validated with **Zod**
- **Streaming progress** — step-by-step status during analysis (`ReadableStream` from `/api/analyze`)
- **Analysis report** — match %, matched/missing skills, recommendations, bullet suggestions, interview questions
- **Session limits** — up to **3 analyses** per guest session; UI guard via server-side HOC
- **Data retention** — analysis records older than **2 hours** are removed by a Vercel Cron job
- **i18n** — Russian and English (`next-intl`, locale prefix `/ru`, `/en`)
- **Regional awareness** — UI warning and server-side handling when Gemini is unavailable in the user's region

---

## User flow

```
Landing → Demo access (code) → Workspace → Analyze → Report
                ↓
         httpOnly guest_session_id cookie
```

1. User enters a demo code on `/access`.
2. Server sets a UUID in an `httpOnly`, `sameSite: lax` cookie.
3. On `/workspace`, user uploads a resume and enters vacancy text or URL.
4. Client POSTs to `/api/analyze`; server streams progress steps, calls Gemini, saves result to PostgreSQL.
5. On success, user is redirected to `/analysis` with the saved report.

---

## Tech stack

| Layer     | Technologies                                       |
| --------- | -------------------------------------------------- |
| Framework | Next.js 15 (App Router), React 19, React Compiler  |
| Language  | TypeScript (strict)                                |
| AI        | Google Gemini (`gemini-3.6-flash`), Zod validation |
| Database  | PostgreSQL (Neon), Prisma ORM                      |
| State     | Zustand (workspace form state, `entities` layer)   |
| UI        | Tailwind CSS, Base UI / shadcn-style components    |
| i18n      | next-intl                                          |
| Deploy    | Vercel (Cron for session cleanup)                  |

**Architecture:** [Feature-Sliced Design (FSD)](https://feature-sliced.design/) — `app` → `widgets` → `features` → `entities` → `shared`.

---

## Project structure

```
src/
├── app/                  # Next.js routes, API handlers
├── widgets/              # Page compositions (landing, workspace, analysis)
├── features/             # User actions (analyze, upload, demo access, guards)
├── entities/             # Domain models (analysis store, report UI)
├── shared/               # UI kit, hooks, Prisma client, HOCs
├── messages/             # i18n JSON (en, ru)
└── i18n/                 # next-intl config
```

---

## Key implementation notes

**Streaming API** — Long-running AI calls use a streaming response so the client shows live progress instead of a blocking spinner.

**LLM boundary** — Gemini responses are parsed as JSON and validated with `aiAnalysisSchema` (Zod) before saving to the database.

**Guest sessions** — No user auth. Session ID doubles as the analysis record key in PostgreSQL. Cookie is session-scoped (no `maxAge`); DB records expire after 2 hours via cron.

**Vacancy scraping** — URLs are fetched server-side with timeout, size limits, and blocks for localhost/private IPs. Many job sites block bots; users can paste plain text instead.

**Access guard** — `withServerAccess` HOC checks the cookie and attempt count before rendering protected pages.

---

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL database (e.g. [Neon](https://neon.tech))
- Google Gemini API key

### Environment variables

Create `.env.local`:

```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="..."
PROJECT_DEMO_CODE="your-demo-code"
CRON_SECRET="random-secret-for-cron"
```

### Install and run

```bash
npm install
npx prisma migrate deploy   # or: npx prisma db push (local dev)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command            | Description         |
| ------------------ | ------------------- |
| `npm run dev`      | Development server  |
| `npm run build`    | Production build    |
| `npm run lint`     | ESLint              |
| `npm run format`   | Prettier            |
| `npm run test:run` | Vitest (unit tests) |

---

## Deploy to Vercel

1. Push the repo to GitHub and import into Vercel.
2. Set environment variables: `DATABASE_URL`, `GEMINI_API_KEY`, `PROJECT_DEMO_CODE`, `CRON_SECRET`.
3. Add a build step for Prisma — either:

   ```json
   "postinstall": "prisma generate"
   ```

   in `package.json`, or run `prisma generate` in the Vercel build command.

4. Run migrations against the production database once: `npx prisma migrate deploy`.
5. Use Neon's **pooled** connection string for serverless.
6. Cron is configured in `vercel.json` (`/api/cron/cleanup-sessions`, hourly).

---

## Known limitations

- **Demo-only access** — single shared code, not production auth.
- **Attempt limit** — enforced in page guards; should also be enforced in `/api/analyze` for production hardening.
- **Scraping** — does not work reliably on SPAs and bot-protected job boards.
- **Gemini geo-restrictions** — API may be unavailable in some regions (VPN required).
- **Resume data** — sent to Google Gemini; no formal privacy policy in the demo.
- **No real-time session cleanup on tab close** — cookie persists until the browser session ends; DB cleanup is time-based (cron).

---

## License

Private / portfolio project.
