import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { INITIAL_DATA } from '../constants/data';

const DRAFT_STORAGE_KEY = 'overlook_draft';

function safeParseDraft(raw) {
  if (!raw) return INITIAL_DATA;
  try {
    const parsed = JSON.parse(raw);
    return { ...INITIAL_DATA, ...parsed };
  } catch {
    return INITIAL_DATA;
  }
}

function mapSupabaseToDraft(draft) {
  return {
    ...INITIAL_DATA,
    programName: draft.program_name ?? INITIAL_DATA.programName,
    headline: draft.headline ?? INITIAL_DATA.headline,
    subheadline: draft.subheadline ?? INITIAL_DATA.subheadline,
    location: draft.location ?? INITIAL_DATA.location,
    futureDate: draft.future_date ?? INITIAL_DATA.futureDate,
    problem: draft.problem ?? INITIAL_DATA.problem,
    problemScope: draft.problem_scope ?? INITIAL_DATA.problemScope,
    solution: draft.solution ?? INITIAL_DATA.solution,
    scaleMechanism: draft.scale_mechanism ?? INITIAL_DATA.scaleMechanism,
    evidence: draft.evidence ?? INITIAL_DATA.evidence,
    successMetric: draft.success_metric ?? INITIAL_DATA.successMetric,
    beneficiary: draft.beneficiary ?? INITIAL_DATA.beneficiary,
    granteeOrg: draft.grantee_org ?? INITIAL_DATA.granteeOrg,
    granteeFocus: draft.grantee_focus ?? INITIAL_DATA.granteeFocus,
    evidenceSummary: draft.evidence_summary ?? INITIAL_DATA.evidenceSummary,
    evidenceStrength: draft.evidence_strength ?? INITIAL_DATA.evidenceStrength,
    keyUncertainties: draft.key_uncertainties ?? INITIAL_DATA.keyUncertainties,
    evidenceSources: draft.evidence_sources ?? INITIAL_DATA.evidenceSources,
    effectRange: draft.effect_range ?? INITIAL_DATA.effectRange,
    denominatorUnit: draft.denominator_unit ?? INITIAL_DATA.denominatorUnit,
    denominatorSource: draft.denominator_source ?? INITIAL_DATA.denominatorSource,
    baselineMetric: draft.baseline_metric ?? INITIAL_DATA.baselineMetric,
    comparatorMetric: draft.comparator_metric ?? INITIAL_DATA.comparatorMetric,
    metricTimeframe: draft.metric_timeframe ?? INITIAL_DATA.metricTimeframe,
    costPerOutcome: draft.cost_per_outcome ?? INITIAL_DATA.costPerOutcome,
    internalQuote: draft.internal_quote ?? INITIAL_DATA.internalQuote,
    internalSpeaker: draft.internal_speaker ?? INITIAL_DATA.internalSpeaker,
    externalQuote: draft.external_quote ?? INITIAL_DATA.externalQuote,
    externalSpeaker: draft.external_speaker ?? INITIAL_DATA.externalSpeaker,
    archetype: draft.archetype ?? INITIAL_DATA.archetype,
    decisionToInform: draft.decision_to_inform ?? INITIAL_DATA.decisionToInform,
    keyRisks: draft.key_risks ?? INITIAL_DATA.keyRisks,
    killCriteria: draft.kill_criteria ?? INITIAL_DATA.killCriteria,
    nextExperiment: draft.next_experiment ?? INITIAL_DATA.nextExperiment,
    denominatorIncluded: draft.denominator_included ?? INITIAL_DATA.denominatorIncluded,
    denominatorExcluded: draft.denominator_excluded ?? INITIAL_DATA.denominatorExcluded,
    sinatraSkeptic: draft.sinatra_skeptic ?? INITIAL_DATA.sinatraSkeptic,
    sinatraWhyUndeniable: draft.sinatra_why_undeniable ?? INITIAL_DATA.sinatraWhyUndeniable,
    confidence: typeof draft.confidence === 'number' ? draft.confidence : INITIAL_DATA.confidence
  };
}

export function useStrategyDraft({ onToast } = {}) {
  const [data, setData] = useState(() => {
    const local = localStorage.getItem(DRAFT_STORAGE_KEY);
    return safeParseDraft(local);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [draftId, setDraftId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  });

  // Load from URL or LocalStorage on mount
  useEffect(() => {
    if (!draftId || !supabase) return;
    let isActive = true;
    const loadFromSupabase = async (id) => {
      const { data: draft, error } = await supabase.from('press_releases').select('*').eq('id', id).single();
      if (!isActive) return;
      if (error) {
        onToast?.('Could not load cloud draft. Using browser draft.', 'error');
        return;
      }
      if (!draft) return;
      setData((prev) => ({ ...prev, ...mapSupabaseToDraft(draft) }));
    };
    loadFromSupabase(draftId);
    return () => {
      isActive = false;
    };
  }, [draftId]);

  useEffect(() => {
    if (!draftId) return;
    const newUrl = `${window.location.pathname}?id=${draftId}`;
    if (window.location.search !== `?id=${draftId}`) {
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [draftId]);

  // Save to LocalStorage on every change (Safety net)
  useEffect(() => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateField = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const loadTemplate = (templateData) => {
    setData(prev => ({ ...prev, ...templateData }));
  };

  const saveStrategy = async () => {
    if (!supabase) {
      onToast?.('Supabase not configured. Saved to browser storage only.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...(draftId ? { id: draftId } : {}),
        program_name: data.programName,
        headline: data.headline,
        subheadline: data.subheadline,
        location: data.location,
        future_date: data.futureDate,
        problem: data.problem,
        problem_scope: data.problemScope,
        solution: data.solution,
        scale_mechanism: data.scaleMechanism,
        evidence: data.evidence,
        success_metric: data.successMetric,
        evidence_summary: data.evidenceSummary,
        evidence_strength: data.evidenceStrength,
        key_uncertainties: data.keyUncertainties,
        evidence_sources: data.evidenceSources,
        effect_range: data.effectRange,
        denominator_unit: data.denominatorUnit,
        denominator_source: data.denominatorSource,
        baseline_metric: data.baselineMetric,
        comparator_metric: data.comparatorMetric,
        metric_timeframe: data.metricTimeframe,
        cost_per_outcome: data.costPerOutcome,
        beneficiary: data.beneficiary,
        grantee_org: data.granteeOrg,
        grantee_focus: data.granteeFocus,
        decision_to_inform: data.decisionToInform,
        key_risks: data.keyRisks,
        kill_criteria: data.killCriteria,
        next_experiment: data.nextExperiment,
        denominator_included: data.denominatorIncluded,
        denominator_excluded: data.denominatorExcluded,
        sinatra_skeptic: data.sinatraSkeptic,
        sinatra_why_undeniable: data.sinatraWhyUndeniable,
        confidence: data.confidence,
        internal_quote: data.internalQuote,
        internal_speaker: data.internalSpeaker,
        external_quote: data.externalQuote,
        external_speaker: data.externalSpeaker,
        archetype: data.archetype
      };

      const { data: saved, error } = await supabase
        .from('press_releases')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (!error && saved?.[0]) {
        setDraftId(saved[0].id);
        setLastSaved(new Date());
        onToast?.('Saved to cloud.', 'success');
      } else {
        console.error('Save Error', error);
        onToast?.('Failed to save to cloud.', 'error');
      }
    } catch (error) {
      console.error('Save Exception', error);
      onToast?.('Failed to save to cloud.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return { data, updateField, saveStrategy, loadTemplate, isSaving, lastSaved };
}
