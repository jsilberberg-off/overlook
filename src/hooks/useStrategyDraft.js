import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { INITIAL_DATA } from '../constants/data';

export function useStrategyDraft() {
  const [data, setData] = useState(() => {
    const local = localStorage.getItem('overlook_draft');
    return local ? JSON.parse(local) : INITIAL_DATA;
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
      const { data: draft } = await supabase.from('press_releases').select('*').eq('id', id).single();
      if (!isActive || !draft) return;
      // Map snake_case DB to camelCase State
      setData({
        programName: draft.program_name, headline: draft.headline, subheadline: draft.subheadline,
        location: draft.location, futureDate: draft.future_date, problem: draft.problem,
        problemScope: draft.problem_scope, solution: draft.solution, scaleMechanism: draft.scale_mechanism,
        evidence: draft.evidence, successMetric: draft.success_metric, beneficiary: draft.beneficiary,
        internalQuote: draft.internal_quote, internalSpeaker: draft.internal_speaker,
        externalQuote: draft.external_quote, externalSpeaker: draft.external_speaker, archetype: draft.archetype
      });
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
    localStorage.setItem('overlook_draft', JSON.stringify(data));
  }, [data]);

  const updateField = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const loadTemplate = (templateData) => {
    setData(prev => ({ ...prev, ...templateData }));
  };

  const saveStrategy = async () => {
    if (!supabase) {
      alert("Supabase not configured. Saved to browser storage only.");
      return;
    }
    setIsSaving(true);
    const payload = {
      ...(draftId ? { id: draftId } : {}),
      program_name: data.programName, headline: data.headline, subheadline: data.subheadline,
      location: data.location, future_date: data.futureDate, problem: data.problem,
      problem_scope: data.problemScope, solution: data.solution, scale_mechanism: data.scaleMechanism,
      evidence: data.evidence, success_metric: data.successMetric, beneficiary: data.beneficiary,
      internal_quote: data.internalQuote, internal_speaker: data.internalSpeaker,
      external_quote: data.externalQuote, external_speaker: data.externalSpeaker, archetype: data.archetype
    };

    const { data: saved, error } = await supabase
      .from('press_releases')
      .upsert(payload, { onConflict: 'id' })
      .select();
    
    if (!error && saved?.[0]) {
      setDraftId(saved[0].id);
      setLastSaved(new Date());
    } else {
       console.error("Save Error", error);
       alert("Failed to save to cloud.");
    }
    setIsSaving(false);
  };

  return { data, updateField, saveStrategy, loadTemplate, isSaving, lastSaved };
}
