-- Add rigor, denominator, and decision-support fields to cloud drafts.
-- Safe to run once in Supabase SQL editor.

alter table public.press_releases
  add column if not exists grantee_org text,
  add column if not exists grantee_focus text,
  add column if not exists evidence_summary text,
  add column if not exists evidence_strength text default 'none',
  add column if not exists key_uncertainties text,
  add column if not exists evidence_sources text,
  add column if not exists effect_range text,
  add column if not exists denominator_included text,
  add column if not exists denominator_excluded text,
  add column if not exists denominator_unit text,
  add column if not exists denominator_source text,
  add column if not exists baseline_metric text,
  add column if not exists comparator_metric text,
  add column if not exists metric_timeframe text,
  add column if not exists cost_per_outcome text,
  add column if not exists decision_to_inform text,
  add column if not exists key_risks text,
  add column if not exists kill_criteria text,
  add column if not exists next_experiment text,
  add column if not exists sinatra_skeptic text,
  add column if not exists sinatra_why_undeniable text,
  add column if not exists confidence integer default 70;
