// Optional AI coach integration.
//
// This is intentionally provider-agnostic.
// Configure a secure backend endpoint that accepts JSON and returns JSON.
//
// Env var:
//   VITE_AI_COACH_ENDPOINT=https://.../ai-coach
//
// Request payload:
// {
//   stepId: string,
//   data: Record<string, any>
// }
//
// Suggested response shape (flexible):
// {
//   score: number (0-100),
//   strengths: string[],
//   risks: string[],
//   improvements: string[],
//   rewrite?: {
//     headline?: string,
//     subheadline?: string,
//     ...
//   }
// }

const ENDPOINT = import.meta.env.VITE_AI_COACH_ENDPOINT;

export function isAICoachEnabled() {
  return typeof ENDPOINT === 'string' && ENDPOINT.trim().length > 0;
}

export async function fetchAICoachFeedback({ stepId, data }) {
  if (!isAICoachEnabled()) {
    throw new Error('AI coach endpoint not configured. Set VITE_AI_COACH_ENDPOINT.');
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stepId, data })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AI coach request failed (${res.status}). ${text}`);
  }

  return res.json();
}
