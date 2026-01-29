// Lightweight, deterministic draft generators.
//
// Design goals:
// - Uses only existing user inputs (no invented facts)
// - Produces multiple candidates so the user can choose
// - Stays readable for internal leadership/board audiences

const compact = (s) => (typeof s === 'string' ? s.trim().replace(/\s+/g, ' ') : '');

const hasText = (s) => compact(s).length > 0;

const pickYear = (futureDate) => {
  const d = compact(futureDate);
  if (!d) return '';
  const year = new Date(d).getFullYear();
  return Number.isFinite(year) ? String(year) : '';
};

const shorten = (text, max = 70) => {
  const t = compact(text);
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
};

const joinNonEmpty = (parts, sep = ' ') => parts.map(compact).filter(Boolean).join(sep);

/**
 * Returns headline candidates ordered from most complete to least.
 */
export function generateHeadlineCandidates(data) {
  const programName = compact(data?.programName) || 'New foundation-backed initiative';
  const successMetric = compact(data?.successMetric);
  const beneficiary = compact(data?.beneficiary) || 'learners';
  const location = compact(data?.location);
  const scope = compact(data?.problemScope);
  const year = pickYear(data?.futureDate);
  const catalyst = shorten(compact(data?.solution), 60);

  const pop = scope ? joinNonEmpty([scope, beneficiary]) : beneficiary;
  const where = location ? `in ${location}` : '';
  const by = year ? `by ${year}` : '';

  const candidates = [];

  if (hasText(successMetric)) {
    candidates.push(joinNonEmpty([programName, 'delivers', successMetric, 'for', pop, where]));
    candidates.push(joinNonEmpty([successMetric, 'for', pop, where, by]));
    candidates.push(joinNonEmpty([programName, 'achieves', successMetric, 'for', beneficiary, by]));
  }

  if (hasText(catalyst) && hasText(successMetric)) {
    candidates.push(joinNonEmpty([catalyst, 'drives', successMetric, 'for', pop]));
  }

  // Fallbacks when metric isn't yet defined
  candidates.push(joinNonEmpty([programName, 'improves outcomes for', pop, where, by]));
  if (hasText(catalyst)) {
    candidates.push(joinNonEmpty([programName, 'scales', catalyst, 'for', pop]));
  }

  // De-dupe while preserving order
  const seen = new Set();
  return candidates
    .map((c) => c.replace(/\s+/g, ' ').trim())
    .filter((c) => {
      if (!c) return false;
      const key = c.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/**
 * Returns subheadline candidates ordered from most complete to least.
 */
export function generateSubheadlineCandidates(data) {
  const programName = compact(data?.programName) || 'the initiative';
  const successMetric = compact(data?.successMetric);
  const beneficiary = compact(data?.beneficiary) || 'learners';
  const location = compact(data?.location);
  const scope = compact(data?.problemScope);
  const year = pickYear(data?.futureDate);
  const scale = shorten(compact(data?.scaleMechanism), 80);
  const proof = shorten(compact(data?.evidence), 80);

  const pop = scope ? joinNonEmpty([scope, beneficiary]) : beneficiary;
  const where = location ? `in ${location}` : '';
  const by = year ? `by ${year}` : '';

  const candidates = [];

  if (hasText(scale) && hasText(successMetric)) {
    candidates.push(joinNonEmpty(['Scaled through', scale + ',', programName, 'reached', pop, where, 'and delivered', successMetric, by], ' '));
  }

  if (hasText(successMetric)) {
    candidates.push(joinNonEmpty([programName, 'delivered', successMetric, 'for', pop, where, by]));
  }

  if (hasText(proof) && hasText(successMetric)) {
    candidates.push(joinNonEmpty(['Proof point:', proof + '.', 'Headline metric:', successMetric + '.']));
  }

  // Fallback
  candidates.push(joinNonEmpty([programName, 'clarified what “winning” looks like for', pop, where, by]));

  const seen = new Set();
  return candidates
    .map((c) => c.replace(/\s+/g, ' ').trim())
    .filter((c) => {
      if (!c) return false;
      const key = c.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
