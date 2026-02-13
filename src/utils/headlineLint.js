const compact = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');
const hasText = (value) => compact(value).length > 0;
const containsNumber = (value) => /\d/.test(compact(value));
const digitsOnly = (value) => (compact(value).match(/\d+/g) || []).join(' ');
const wordCount = (value) => {
  const text = compact(value);
  return text ? text.split(' ').length : 0;
};

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

const yearFromDate = (value) => {
  const date = compact(value);
  if (!date) return '';
  const year = new Date(date).getFullYear();
  return Number.isFinite(year) ? String(year) : '';
};

const buildSubject = (problemScope, beneficiary) => {
  const subject = [compact(problemScope), compact(beneficiary)].filter(Boolean).join(' ');
  return subject || '';
};

const appendLocation = (headline, location) => {
  const loc = compact(location);
  if (!loc) return headline;
  return `${headline} in ${loc}`;
};

const maybeTrimToWords = (headline, limit = 20) => {
  const words = compact(headline).split(' ').filter(Boolean);
  if (words.length <= limit) return words.join(' ');
  return `${words.slice(0, limit).join(' ')}...`;
};

export function headlineLint({
  headline,
  successMetric,
  beneficiary,
  problemScope,
  futureDate,
  location,
  baselineMetric,
  comparatorMetric,
  metricTimeframe
}) {
  const flags = [];
  const rewrites = [];
  const h = compact(headline);
  const lower = h.toLowerCase();
  const wc = wordCount(h);
  const hasProcess = PROCESS_TERMS.some((term) => lower.includes(term));
  const hasNumber = containsNumber(h);
  const metricDigits = digitsOnly(successMetric);
  const baselineDigits = digitsOnly(baselineMetric);
  const comparatorText = compact(comparatorMetric);
  const timeframeText = compact(metricTimeframe);
  const subject = buildSubject(problemScope, beneficiary);
  const year = yearFromDate(futureDate);
  const clauseCount = (h.match(/[,:;]| and | but /gi) || []).length;

  if (hasProcess && !hasNumber) {
    flags.push({
      id: 'process-no-outcome',
      title: 'Process headline; missing outcome.',
      detail: 'Avoid activity headlines without a measurable result.',
      severity: 'warn'
    });
  }

  if (!hasNumber) {
    flags.push({
      id: 'missing-number',
      title: 'Headline lacks a number.',
      detail: 'Board audiences expect a clear threshold or metric.',
      severity: 'warn'
    });
  }

  if (wc > 20) {
    flags.push({
      id: 'word-count-high',
      title: 'Headline is too long.',
      detail: `Current length is ${wc} words; target is about 10-20.`,
      severity: 'warn'
    });
  }

  if (clauseCount >= 3) {
    flags.push({
      id: 'too-many-clauses',
      title: 'Headline has too many clauses.',
      detail: 'Try one big idea with fewer commas/connectors.',
      severity: 'warn'
    });
  }

  if (metricDigits && !metricDigits.split(' ').every((digit) => h.includes(digit))) {
    flags.push({
      id: 'metric-mismatch',
      title: 'Metric not in headline.',
      detail: 'Pull the success metric into the headline for clarity.',
      severity: 'warn'
    });
  }

  if (!hasText(baselineMetric)) {
    flags.push({
      id: 'baseline-missing',
      title: 'Baseline is missing.',
      detail: 'Add a starting value to make the outcome credible.',
      severity: 'warn'
    });
  }

  if (!hasText(comparatorMetric)) {
    flags.push({
      id: 'comparator-missing',
      title: 'Comparator is missing.',
      detail: 'Specify what this is being compared against.',
      severity: 'warn'
    });
  }

  if (!hasText(metricTimeframe)) {
    flags.push({
      id: 'timeframe-missing',
      title: 'Metric timeframe is missing.',
      detail: 'State when this outcome is expected to hold.',
      severity: 'warn'
    });
  }

  if (hasText(beneficiary)) {
    const beneficiaryToken = compact(beneficiary).split(' ')[0]?.toLowerCase();
    if (beneficiaryToken && !lower.includes(beneficiaryToken)) {
      flags.push({
        id: 'population-missing',
        title: 'Population not in headline.',
        detail: 'Name who benefits so the outcome feels grounded.',
        severity: 'warn'
      });
    }
  }

  if (hasText(successMetric) && subject && year) {
    rewrites.push({
      label: 'Outcome-first',
      headline: maybeTrimToWords(appendLocation(`${compact(successMetric)} for ${subject} by ${year}`, location))
    });
    rewrites.push({
      label: 'Population-first',
      headline: maybeTrimToWords(appendLocation(`${subject} reach ${compact(successMetric)} by ${year}`, location))
    });
  }

  if (hasText(successMetric) && subject && !year) {
    rewrites.push({
      label: 'Outcome-first',
      headline: maybeTrimToWords(appendLocation(`${compact(successMetric)} for ${subject}`, location))
    });
  }

  if (hasText(successMetric) && hasText(baselineMetric) && hasText(metricTimeframe)) {
    rewrites.push({
      label: 'Delta framing',
      headline: maybeTrimToWords(
        appendLocation(`${subject} move from ${compact(baselineMetric)} to ${compact(successMetric)} in ${timeframeText}`, location)
      )
    });
  }

  if (hasText(successMetric) && hasText(comparatorMetric)) {
    rewrites.push({
      label: 'Comparator framing',
      headline: maybeTrimToWords(
        appendLocation(`${compact(successMetric)} for ${subject} versus ${comparatorText}`, location)
      )
    });
  }

  if (baselineDigits && !baselineDigits.split(' ').every((digit) => h.includes(digit))) {
    flags.push({
      id: 'baseline-not-visible',
      title: 'Baseline is not visible in headline.',
      detail: 'If possible, include the start value to clarify the magnitude of change.',
      severity: 'warn'
    });
  }

  return { flags, rewrites };
}
