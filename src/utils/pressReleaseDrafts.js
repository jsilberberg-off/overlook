// Deterministic draft generators.
// Uses only user-provided inputs and prioritizes concise, scannable headlines.

const compact = (s) => (typeof s === 'string' ? s.trim().replace(/\s+/g, ' ') : '');
const hasText = (s) => compact(s).length > 0;
const joinNonEmpty = (parts, sep = ' ') => parts.map(compact).filter(Boolean).join(sep);

const pickYear = (futureDate) => {
  const d = compact(futureDate);
  if (!d) return '';
  const year = new Date(d).getFullYear();
  return Number.isFinite(year) ? String(year) : '';
};

const trimToWords = (text, maxWords = 20) => {
  const words = compact(text).split(' ').filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ')}...`;
};

const deDupe = (items) => {
  const seen = new Set();
  return items
    .map((item) => compact(item))
    .filter((item) => {
      if (!item) return false;
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export function generateHeadlineCandidates(data) {
  const successMetric = compact(data?.successMetric);
  const baselineMetric = compact(data?.baselineMetric);
  const comparatorMetric = compact(data?.comparatorMetric);
  const metricTimeframe = compact(data?.metricTimeframe);
  const beneficiary = compact(data?.beneficiary) || 'students';
  const scope = compact(data?.problemScope);
  const year = pickYear(data?.futureDate);
  const location = compact(data?.location);
  const subject = scope ? joinNonEmpty([scope, beneficiary]) : beneficiary;
  const where = location ? `in ${location}` : '';
  const by = year ? `by ${year}` : '';

  const candidates = [];

  if (hasText(successMetric)) {
    candidates.push(joinNonEmpty([successMetric, 'for', subject, by, where]));
    candidates.push(joinNonEmpty([subject, 'reach', successMetric, by, where]));
    if (year) candidates.push(joinNonEmpty(['By', year, subject, 'reach', successMetric, where]));
  }

  if (!hasText(successMetric)) {
    candidates.push(joinNonEmpty([subject, 'improve reading outcomes', by, where]));
  }

  if (hasText(successMetric) && hasText(baselineMetric)) {
    candidates.push(joinNonEmpty([subject, 'move from', baselineMetric, 'to', successMetric, by]));
  }

  if (hasText(successMetric) && hasText(baselineMetric) && hasText(metricTimeframe)) {
    candidates.push(joinNonEmpty([subject, 'move from', baselineMetric, 'to', successMetric, 'in', metricTimeframe, where]));
  }

  if (hasText(successMetric) && hasText(comparatorMetric)) {
    candidates.push(joinNonEmpty([subject, 'reach', successMetric, 'vs', comparatorMetric, by, where]));
  }

  return deDupe(candidates).map((c) => trimToWords(c, 20));
}

export function generateSubheadlineCandidates(data) {
  const programName = compact(data?.programName) || 'the grant';
  const successMetric = compact(data?.successMetric);
  const beneficiary = compact(data?.beneficiary) || 'students';
  const location = compact(data?.location);
  const scope = compact(data?.problemScope);
  const year = pickYear(data?.futureDate);
  const scale = compact(data?.scaleMechanism);
  const evidence = compact(data?.evidenceSummary || data?.evidence);
  const uncertainties = compact(data?.keyUncertainties);
  const evidenceStrength = compact(data?.evidenceStrength);
  const costPerOutcome = compact(data?.costPerOutcome);
  const pop = scope ? joinNonEmpty([scope, beneficiary]) : beneficiary;
  const where = location ? `in ${location}` : '';
  const by = year ? `by ${year}` : '';

  const candidates = [];

  if (hasText(scale) && hasText(successMetric)) {
    candidates.push(
      joinNonEmpty([programName, 'scaled through', scale + ',', 'helping', pop, where, 'reach', successMetric, by])
    );
  }

  if (hasText(successMetric)) {
    candidates.push(joinNonEmpty([programName, 'aims for', successMetric, 'for', pop, where, by]));
  }

  if (hasText(evidence)) {
    candidates.push(joinNonEmpty(['Evidence to date:', evidence]));
  }

  if (hasText(evidenceStrength) && evidenceStrength !== 'none') {
    candidates.push(joinNonEmpty(['Evidence base:', evidenceStrength.replace(/_/g, ' ')]));
  }

  if (hasText(uncertainties)) {
    candidates.push(joinNonEmpty(['Open uncertainties remain:', uncertainties]));
  }

  if (hasText(costPerOutcome)) {
    candidates.push(joinNonEmpty(['Estimated cost per outcome:', costPerOutcome]));
  }

  candidates.push(joinNonEmpty([programName, 'clarifies what winning looks like for', pop, where, by]));

  return deDupe(candidates).map((c) => trimToWords(c, 28));
}
