# OverLook — Future Retrospective Lab

OverLook is a lightweight “write from the future” tool for pressure-testing strategies and grant ideas.

## V2 changes included in this repo

### 1) Auto-drafted headline and subheadline
When you enter **The Headline Lab**, the app now generates draft headline/subheadline options from earlier inputs (no invented facts).

- If your headline/subheadline are empty, the top draft is auto-filled.
- You can click any suggested headline/subheadline to apply it.

Draft logic lives in:
- `src/utils/pressReleaseDrafts.js`

### 2) Coach panel (quality checks + optional AI)
Each step now has a **Coach** panel:

- Deterministic “lint” checks (numbers, denominator clarity, scale mechanism, etc.)
- Optional AI feedback if you configure an endpoint

Heuristic checks live in:
- `src/utils/coachHeuristics.js`

#### Enable AI feedback
Set an environment variable:

```bash
VITE_AI_COACH_ENDPOINT=https://your-domain.com/ai-coach
```

Your endpoint should accept:

```json
{ "stepId": "problem", "data": { "...": "..." } }
```

And return JSON (recommended shape):

```json
{
  "score": 78,
  "improvements": ["..."],
  "risks": ["..."]
}
```

The client integration is in:
- `src/services/aiCoach.js`

## Development

```bash
npm install
npm run dev
```
