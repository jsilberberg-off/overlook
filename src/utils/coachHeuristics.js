import { JARGON_LIST } from '../constants/data';

const compact = (s) => (typeof s === 'string' ? s.trim().replace(/\s+/g, ' ') : '');
const hasText = (s) => compact(s).length > 0;
const containsNumber = (s) => /\d/.test(compact(s));

const findJargon = (text) => {
  const t = compact(text).toLowerCase();
  if (!t) return [];
  return JARGON_LIST.filter((w) => t.includes(w));
};

const yearFromDate = (dateStr) => {
  const d = compact(dateStr);
  if (!d) return '';
  const year = new Date(d).getFullYear();
  return Number.isFinite(year) ? String(year) : '';
};

/**
 * Returns deterministic, step-aware feedback that does NOT invent facts.
 *
 * Shape:
 * {
 *   score: number (0-100),
 *   warnings: Array<{ title: string, detail?: string }>,
 *   suggestions: Array<{ title: string, detail?: string }>
 * }
 */
export function getHeuristicCoachFeedback(stepId, data) {
  const warnings = [];
  const suggestions = [];

  // Baseline score starts high; subtract for clarity/credibility issues.
  let score = 100;

  const futureYear = yearFromDate(data?.futureDate);

  const addWarn = (title, detail, penalty = 6) => {
    warnings.push({ title, detail });
    score = Math.max(0, score - penalty);
  };

  const addSug = (title, detail) => {
    suggestions.push({ title, detail });
  };

  // Global checks (apply to most steps)
  const jargonHits = [
    ...findJargon(data?.problem),
    ...findJargon(data?.solution),
    ...findJargon(data?.scaleMechanism),
    ...findJargon(data?.evidence)
  ];
  if (jargonHits.length > 0) {
    addWarn(
      'Some language reads like corporate jargon.',
      `Consider replacing: ${Array.from(new Set(jargonHits)).slice(0, 6).join(', ')}`,
      4
    );
  }

  switch (stepId) {
    case 'context': {
      if (!hasText(data?.futureDate)) addWarn('Missing target success date.', 'Pick a concrete date to anchor “winning.”');
      if (!hasText(data?.location)) addWarn('Missing location / context.', 'Leadership will ask “where is this true?”');
      if (futureYear) addSug('Board-friendly framing tip.', `Use “By ${futureYear}…” language for clarity and accountability.`);
      break;
    }

    case 'problem': {
      if (!hasText(data?.problem)) addWarn('The “old reality” is empty.', 'State the friction clearly and concretely.');
      if (hasText(data?.problem) && !containsNumber(data?.problem)) {
        addWarn('Problem statement lacks a number.', 'Consider adding a baseline rate, gap, or count (even approximate).', 8);
      }
      if (!hasText(data?.beneficiary)) addWarn('Beneficiary is unclear.', 'Name who experiences the problem (segment + setting).');
      if (!hasText(data?.problemScope)) addWarn('Scope is missing.', 'Board audiences tend to anchor on scale (how many / how big).');
      if (hasText(data?.problemScope) && !containsNumber(data?.problemScope)) {
        addWarn('Scope field does not include a number.', 'Use a number + unit (e.g., “120 schools”, “45K students”).', 6);
      }
      if (!hasText(data?.denominatorIncluded)) {
        addWarn('Denominator is missing.', 'Define the full population that must be different by the success date.', 10);
      }
      addSug('Credibility tip.', 'Write the denominator in “All X in Y” form. It reduces ambiguity.');
      break;
    }

    case 'solution': {
      if (!hasText(data?.solution)) addWarn('Mechanism of change is empty.', 'Describe the single change that made outcomes move.');
      if (hasText(data?.solution) && compact(data?.solution).split(/\s+/).length < 10) {
        addWarn('Mechanism is very short.', 'Add 1–2 sentences on how it changes behavior or incentives.', 5);
      }
      if (!hasText(data?.scaleMechanism)) {
        addWarn('Mechanism of scale is missing.', 'Name the distribution channel: policy, procurement, partner, platform, etc.', 10);
      }
      if (!hasText(data?.programName)) addSug('Clarity option.', 'Give the initiative a working name so leadership can refer to it consistently.');
      break;
    }

    case 'evidence': {
      if (!hasText(data?.successMetric)) {
        addWarn('Headline success metric is missing.', 'Without a headline metric, it’s hard to judge whether the strategy is real.', 12);
      } else if (!containsNumber(data?.successMetric)) {
        addWarn('Success metric does not include a number.', 'Board audiences need an explicit threshold (%, points, dollars, etc.).', 8);
      }
      if (!hasText(data?.evidence)) {
        addWarn('Sinatra proof is missing.', 'Name the single result that would convince a skeptic.', 10);
      } else if (!containsNumber(data?.evidence)) {
        addWarn('Proof point lacks a number.', 'Specify the measured change (baseline → outcome) or a clear benchmark.', 6);
      }
      if (!hasText(data?.sinatraWhyUndeniable)) addWarn('“Why it’s undeniable” is missing.', 'Explain why this result travels beyond one charismatic site.');
      if (!hasText(data?.sinatraSkeptic)) addSug('Stress-test.', 'Name a real skeptic (researcher, operator, policymaker). It sharpens the claim.');
      break;
    }

    case 'stakeholder': {
      if (!hasText(data?.internalQuote)) addWarn('Internal quote is missing.', 'Leadership voice should connect results to strategy and inevitability.');
      if (!hasText(data?.externalQuote)) addWarn('Beneficiary quote is missing.', 'A concrete lived example makes the narrative believable.');
      if (hasText(data?.externalQuote) && compact(data?.externalQuote).split(/\s+/).length < 10) {
        addWarn('Beneficiary quote is very short.', 'Add a “before → after” detail (what changed, when, how it felt).', 4);
      }
      addSug('Tone check.', 'Avoid generic praise; quotes should contain a specific change or trade-off.');
      break;
    }

    case 'headline': {
      const h = compact(data?.headline);
      const s = compact(data?.subheadline);
      if (!h) {
        addWarn('Headline is empty.', 'Use the draft suggestions as a starting point.', 12);
      } else {
        if (h.length > 120) addWarn('Headline is long.', 'Try to keep it under ~120 characters for scannability.', 4);
        if (hasText(data?.successMetric) && !h.toLowerCase().includes(compact(data?.successMetric).toLowerCase().slice(0, 10))) {
          addWarn('Headline may not reflect the metric.', 'Consider pulling the headline metric into the headline itself.', 5);
        }
        if (hasText(data?.beneficiary) && !h.toLowerCase().includes(compact(data?.beneficiary).toLowerCase().split(' ')[0])) {
          addWarn('Headline may not name the population.', 'Board audiences need to know “for whom” at a glance.', 4);
        }
      }
      if (!s) addSug('Subheadline option.', 'Use the subheadline to add scale + mechanism + time window (without adding new claims).');
      break;
    }

    case 'review': {
      // A lightweight overall check.
      if (!hasText(data?.denominatorIncluded)) addWarn('Denominator is still missing.', 'This is a common source of downstream confusion.', 10);
      if (!hasText(data?.scaleMechanism)) addWarn('Scale mechanism is still missing.', 'Board will ask “how does this move beyond pilots?”', 10);
      if (!hasText(data?.successMetric)) addWarn('Success metric is still missing.', 'The strategy will be hard to judge without it.', 12);
      addSug('Decision-use tip.', 'Add “what we would do next if this is true” to keep the artifact strategy-relevant.');
      break;
    }

    default:
      break;
  }

  // Keep score in a helpful band.
  score = Math.max(0, Math.min(100, score));

  // If very few warnings, add a “next level” suggestion.
  if (warnings.length <= 1) {
    addSug('Make it decision-grade.', 'Add one constraint: cost, implementation burden, or a “kill criteria” checkpoint.');
  }

  return { score, warnings, suggestions };
}
