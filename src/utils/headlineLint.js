const compact = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');
const hasText = (value) => compact(value).length > 0;
const containsNumber = (value) => /\d/.test(compact(value));
const digitsOnly = (value) => (compact(value).match(/\d+/g) || []).join(' ');

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

const containsTerm = (text, term) => text.includes(term);

const buildSubject = (problemScope, beneficiary) => {
  const subject = [compact(problemScope), compact(beneficiary)].filter(Boolean).join(' ');
  return subject || '';
};

const appendLocation = (headline, location) => {
  const loc = compact(location);
  if (!loc) return headline;
  return `${headline} in ${loc}`;
};

export function headlineLint({ headline, successMetric, beneficiary, problemScope, futureDate, location }) {
  const flags = [];
  const rewrites = [];
  const h = compact(headline);
  const lower = h.toLowerCase();
  const hasProcess = PROCESS_TERMS.some((term) => containsTerm(lower, term));
  const hasNumber = containsNumber(h);
  const metricDigits = digitsOnly(successMetric);
  const subject = buildSubject(problemScope, beneficiary);
  const year = yearFromDate(futureDate);

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

  if (metricDigits && !metricDigits.split(' ').every((digit) => h.includes(digit))) {
    flags.push({
      id: 'metric-mismatch',
      title: 'Metric not in headline.',
      detail: 'Pull the success metric into the headline for clarity.',
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
      headline: appendLocation(`${compact(successMetric)} for ${subject} by ${year}`, location)
    });
    rewrites.push({
      label: 'Population-first',
      headline: appendLocation(`${subject} reach ${compact(successMetric)} by ${year}`, location)
    });
  }

  if (hasText(successMetric) && subject && !year) {
    rewrites.push({
      label: 'Outcome-first',
      headline: appendLocation(`${compact(successMetric)} for ${subject}`, location)
    });
  }

  return { flags, rewrites };
}
