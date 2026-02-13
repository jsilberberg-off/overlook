import { JARGON_LIST } from '../constants/data';

const compact = (s) => (typeof s === 'string' ? s.trim().replace(/\s+/g, ' ') : '');
const hasText = (s) => compact(s).length > 0;
const containsNumber = (s) => /\d/.test(compact(s));

const PROCESS_TERMS = [
  'launch',
  'announce',
  'partner',
  'partnership',
  'convene',
  'coalition',
  'initiative',
  'pilot',
  'rollout',
  'collaborate',
  'capacity building',
  'empower',
  'support',
  'strengthen',
  'invest',
  'investment',
  'grant',
  'funding'
];

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

export function getHeuristicCoachFeedback(stepId, data) {
  const warnings = [];
  const suggestions = [];
  let score = 100;

  const addWarn = (title, detail, penalty = 6) => {
    warnings.push({ title, detail });
    score = Math.max(0, score - penalty);
  };

  const addSug = (title, detail) => {
    suggestions.push({ title, detail });
  };

  const jargonHits = [
    ...findJargon(data?.problem),
    ...findJargon(data?.solution),
    ...findJargon(data?.scaleMechanism),
    ...findJargon(data?.evidence),
    ...findJargon(data?.evidenceSummary)
  ];

  if (jargonHits.length > 0) {
    addWarn(
      'Some language reads as jargon.',
      `Consider replacing: ${Array.from(new Set(jargonHits)).slice(0, 6).join(', ')}`,
      4
    );
  }

  const futureYear = yearFromDate(data?.futureDate);

  switch (stepId) {
    case 'context': {
      if (!hasText(data?.futureDate)) addWarn('Missing target success date.', 'Pick a concrete date to anchor the strategy.');
      if (!hasText(data?.location)) addWarn('Missing location.', 'Leadership will ask where this is true.');
      if (!hasText(data?.granteeOrg)) addWarn('Missing grantee organization.', 'Name who is delivering this work.');
      if (!hasText(data?.granteeFocus)) addWarn('Missing grantee focus area.', 'State what they are trying to change.');
      if (futureYear) addSug('Board framing tip.', `Use "By ${futureYear}..." language for accountability.`);
      break;
    }

    case 'problem': {
      if (!hasText(data?.problem)) addWarn('Current reality is empty.', 'State the friction clearly and concretely.');
      if (hasText(data?.problem) && !containsNumber(data?.problem)) {
        addWarn('Current reality lacks a number.', 'Add a baseline rate, gap, or count.', 8);
      }
      if (!hasText(data?.beneficiary)) addWarn('Beneficiary is unclear.', 'Name who experiences the problem.');
      if (!hasText(data?.problemScope)) addWarn('Scope is missing.', 'Board audiences need scale.');
      if (hasText(data?.problemScope) && !containsNumber(data?.problemScope)) {
        addWarn('Scope field does not include a number.', 'Use a number plus unit (for example, 120 schools).', 6);
      }
      if (!hasText(data?.denominatorIncluded)) {
        addWarn('Denominator is missing.', 'Define the full population that must be different.', 10);
      }
      if (!hasText(data?.denominatorUnit)) {
        addWarn('Denominator unit is missing.', 'Specify units such as students, teachers, or schools.', 8);
      }
      if (!hasText(data?.denominatorSource)) {
        addWarn('Denominator source is missing.', 'Cite where the denominator estimate comes from.', 8);
      }
      addSug('Credibility tip.', 'Use "All X in Y" wording for denominator clarity.');
      break;
    }

    case 'solution': {
      if (!hasText(data?.solution)) addWarn('Mechanism of change is empty.', 'Describe the single change that made outcomes move.');
      if (hasText(data?.solution) && compact(data?.solution).split(/\s+/).length < 10) {
        addWarn('Mechanism is very short.', 'Add how this changes behavior or incentives.', 5);
      }
      if (!hasText(data?.scaleMechanism)) {
        addWarn('Mechanism of scale is missing.', 'Name the distribution path: policy, partner, procurement, or platform.', 10);
      }
      if (!hasText(data?.evidenceSummary)) {
        addWarn('Evidence summary is missing.', 'Summarize the strongest evidence and sample context.', 10);
      }
      if (!hasText(data?.evidenceStrength) || data?.evidenceStrength === 'none') {
        addWarn('Evidence strength is not selected.', 'Classify evidence type for decision confidence.', 8);
      }
      if (!hasText(data?.keyUncertainties)) {
        addWarn('Key uncertainties are missing.', 'List what could break transferability or confidence.', 8);
      }
      if (!hasText(data?.evidence)) {
        addWarn('Undeniable proof is missing.', 'Name the single result that would convince a skeptic.', 10);
      } else if (!containsNumber(data?.evidence)) {
        addWarn('Proof point lacks a number.', 'Specify measured change or benchmark.', 6);
      }
      if (!hasText(data?.sinatraWhyUndeniable)) {
        addWarn('Why this is undeniable is missing.', 'Explain why this result travels beyond one site.');
      }
      break;
    }

    case 'stakeholder': {
      if (!hasText(data?.internalQuote)) addWarn('Internal quote is missing.', 'Connect results to strategy and inevitability.');
      if (!hasText(data?.externalQuote)) addWarn('Beneficiary quote is missing.', 'Add a lived before and after signal.');
      if (hasText(data?.externalQuote) && compact(data?.externalQuote).split(/\s+/).length < 10) {
        addWarn('Beneficiary quote is very short.', 'Add a specific before-to-after detail.', 4);
      }
      addSug('Tone check.', 'Avoid generic praise; include a specific observed change.');
      break;
    }

    case 'headline': {
      const h = compact(data?.headline);
      const successMetric = compact(data?.successMetric);
      const beneficiary = compact(data?.beneficiary);
      const baselineMetric = compact(data?.baselineMetric);
      const comparatorMetric = compact(data?.comparatorMetric);
      const metricTimeframe = compact(data?.metricTimeframe);

      if (!h) {
        addWarn('Headline is empty.', 'Use the generated options as a starting point.', 12);
      } else {
        if (h.length > 120) addWarn('Headline is long.', 'Aim for under 120 characters.', 4);
        if (h.split(/\s+/).length > 20) addWarn('Headline is wordy.', 'Aim for 10-20 words.', 4);
        const hasProcess = PROCESS_TERMS.some((term) => h.toLowerCase().includes(term));
        if (hasProcess && !containsNumber(h)) {
          addWarn('Headline reads like process, not outcome.', 'Replace activity language with a measurable result.', 6);
        }
      }

      if (!hasText(successMetric)) {
        addWarn('Success metric is missing.', 'Include a measurable threshold.', 10);
      } else if (!containsNumber(successMetric)) {
        addWarn('Success metric lacks a number.', 'Add explicit magnitude (percent, points, dollars).', 8);
      }

      if (!hasText(baselineMetric)) addWarn('Baseline metric is missing.', 'State where the population starts.', 8);
      if (!hasText(comparatorMetric)) addWarn('Comparator metric is missing.', 'State compared to what.', 8);
      if (!hasText(metricTimeframe)) addWarn('Metric timeframe is missing.', 'State when this outcome should hold.', 8);
      if (!hasText(beneficiary)) addWarn('Beneficiary is missing.', 'Name who benefits at a glance.', 6);

      addSug('Drafting tip.', 'A strong pattern is: metric + population + date + location.');
      break;
    }

    case 'review': {
      if (!hasText(data?.denominatorIncluded)) addWarn('Denominator is missing.', 'Common source of decision confusion.', 10);
      if (!hasText(data?.scaleMechanism)) addWarn('Scale mechanism is missing.', 'Board will ask how this moves beyond pilots.', 10);
      if (!hasText(data?.successMetric)) addWarn('Success metric is missing.', 'Without it, strategy quality is hard to judge.', 12);
      if (!hasText(data?.decisionToInform)) addSug('Decision-use boost.', 'Specify the funding or strategy decision this should inform.');
      if (!hasText(data?.keyRisks)) addSug('Risk clarity.', 'Add top risks or failure modes to improve realism.');
      if (!hasText(data?.killCriteria)) addSug('Discipline check.', 'Add kill criteria for faster course correction.');
      break;
    }

    default:
      break;
  }

  score = Math.max(0, Math.min(100, score));
  if (warnings.length <= 1) {
    addSug('Make it decision-grade.', 'Add a cost or implementation constraint to tighten decision relevance.');
  }

  return { score, warnings, suggestions };
}
