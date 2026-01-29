// api/ai-coach.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Keep responses small + deterministic.
function clampList(arr, max = 3) {
  return Array.isArray(arr) ? arr.slice(0, max) : [];
}

export default async function handler(req, res) {
  // CORS (safe default). Tighten origins later if you want.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { stepId, data } = req.body ?? {};
    if (!stepId || !data) {
      return res.status(400).json({ error: "Missing stepId or data" });
    }

    // Prompt: "skeptical PM for internal board audience"
    const system = `
You are an internal portfolio manager coach helping a foundation PM prepare an internal future retrospective.
Be skeptical, concise, and decision-oriented. Do NOT invent facts, numbers, partners, or evidence.
Only use numbers that appear in the user's input. If missing, recommend placeholders.
Return JSON only, matching the schema exactly.
`;

    const user = `
STEP: ${stepId}
INPUT JSON:
${JSON.stringify(data, null, 2)}

Task:
1) Give a score 0-100 for decision-quality (clarity, measurability, plausibility, cost/scale realism, evidence alignment).
2) List up to 3 improvements (highest leverage).
3) List up to 3 risks/overclaims (what leadership would challenge).
4) List up to 3 board-level questions.
Return JSON with keys: score (number), improvements (string[]), risks (string[]), questions (string[]).
`;

    // Use a current, stable model name that your account supports.
    // If you prefer another model, swap it here.
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system.trim() },
        { role: "user", content: user.trim() },
      ],
      response_format: { type: "json_object" },
      max_tokens: 700,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // If the model ever fails JSON, return a safe fallback.
      parsed = { score: 50, improvements: [], risks: [], questions: [] };
    }

    return res.status(200).json({
      score: Number.isFinite(parsed.score) ? parsed.score : 50,
      improvements: clampList(parsed.improvements, 3),
      risks: clampList(parsed.risks, 3),
      questions: clampList(parsed.questions, 3),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI coach failed" });
  }
}
