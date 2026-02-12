# OverLook - Future Retrospective Lab

OverLook is a lightweight "write from the future" tool for pressure-testing strategies and grant ideas.

## Key features

1. Auto-drafted headline and subheadline
- The Headline step generates options from prior inputs.
- If headline/subheadline are empty, the top draft is auto-filled.

2. Coach panel
- Deterministic quality checks (numbers, denominator clarity, scale mechanism, and more).
- Optional AI feedback through a configurable backend endpoint.

## Environment variables

Client-side:

```bash
VITE_AI_COACH_ENDPOINT=https://your-domain.com/ai-coach
VITE_AI_COACH_KEY=optional-client-key
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
```

Server-side (`api/ai-coach.js`):

```bash
OPENAI_API_KEY=...
AI_COACH_ALLOWED_ORIGINS=https://your-app-domain.com,http://localhost:5173
AI_COACH_SHARED_SECRET=optional-server-secret
```

Notes:
- If `AI_COACH_ALLOWED_ORIGINS` is unset, the endpoint allows all origins.
- If `AI_COACH_SHARED_SECRET` is set, requests must include `X-AI-COACH-KEY`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
