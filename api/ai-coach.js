/* global process */
// api/ai-coach.js

function getAllowedOrigins() {
  const raw = process.env.AI_COACH_ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveCorsOrigin(req) {
  const requestOrigin = req.headers.origin || '';
  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.length === 0) return '*';
  if (allowedOrigins.includes(requestOrigin)) return requestOrigin;
  return '';
}

function isAuthorized(req) {
  const requiredSecret = process.env.AI_COACH_SHARED_SECRET;
  if (!requiredSecret) return true;
  const provided = req.headers['x-ai-coach-key'];
  return typeof provided === 'string' && provided === requiredSecret;
}

export default async function handler(req, res) {
  // --- CORS ---
  const corsOrigin = resolveCorsOrigin(req);
  if (!corsOrigin) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-AI-COACH-KEY");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { stepId, data } = req.body || {};
  if (!stepId || !data) {
    return res.status(400).json({ error: "Missing stepId or data" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const systemPrompt = `
You are an internal portfolio-manager coach helping prepare a future retrospective
for foundation leadership / board review.

Be skeptical, concise, and decision-oriented.
Do NOT invent numbers, evidence, partners, or outcomes.
Only critique what is present; if information is missing, flag it.

Return JSON ONLY, matching this schema exactly:
{
  "score": number,
  "improvements": string[],
  "risks": string[],
  "questions": string[]
}
`.trim();

  const userPrompt = `
STEP: ${stepId}

INPUT (JSON):
${JSON.stringify(data, null, 2)}

Tasks:
1. Score decision quality (0–100): clarity, measurability, plausibility, cost/scale realism, evidence alignment.
2. List up to 3 highest-leverage improvements.
3. List up to 3 risks or overclaims leadership would challenge.
4. List up to 3 board-level questions.
`.trim();

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 600,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error("OpenAI error:", errText);
      return res.status(500).json({ error: "OpenAI request failed" });
    }

    const result = await openaiResponse.json();
    const content = result.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { score: 50, improvements: [], risks: [], questions: [] };
    }

    return res.status(200).json({
      score: Number.isFinite(parsed.score) ? parsed.score : 50,
      improvements: (parsed.improvements || []).slice(0, 3),
      risks: (parsed.risks || []).slice(0, 3),
      questions: (parsed.questions || []).slice(0, 3)
    });

  } catch (err) {
    console.error("AI coach exception:", err);
    return res.status(500).json({ error: "AI coach failed" });
  }
}
