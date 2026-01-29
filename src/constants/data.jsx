import { 
  Telescope, Target, Zap, BarChart3, Users, Sparkles, ShieldCheck, CalendarClock
} from 'lucide-react';

export const JARGON_LIST = ['leverage', 'synergy', 'holistic', 'paradigm', 'ecosystem', 'optimize', 'capacity building', 'stakeholders', 'utilize', 'robust'];

export const STEPS = [
  { id: 'frame', title: 'Setup', icon: <Telescope className="w-5 h-5" /> },
  { id: 'context', title: 'Horizon', icon: <CalendarClock className="w-5 h-5" /> },
  { id: 'problem', title: 'Current reality', icon: <Target className="w-5 h-5" /> },
  { id: 'solution', title: 'Mechanism', icon: <Zap className="w-5 h-5" /> }, 
  { id: 'evidence', title: 'Proof', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'stakeholder', title: 'Voices (optional)', icon: <Users className="w-5 h-5" /> },
  { id: 'headline', title: 'Headline', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'review', title: 'Finalize', icon: <ShieldCheck className="w-5 h-5" /> }
];

const defaultFutureDate = new Date();
defaultFutureDate.setFullYear(defaultFutureDate.getFullYear() + 5);
const defaultFutureDateIso = defaultFutureDate.toISOString().slice(0, 10);

export const ARCHETYPES = [
  {
    id: 'portfolio',
    label: 'Portfolio strategy',
    description: 'Define the outcome the portfolio must deliver and the system-level mechanism that makes it inevitable.'
  },
  {
    id: 'grant',
    label: 'Grant investment',
    description: 'Anchor on one investment and the outcome it creates, then show how it scales beyond a single grantee.'
  }
];

export const INITIAL_DATA = {
  programName: "", headline: "", subheadline: "", location: "NEW YORK",
  futureDate: defaultFutureDateIso, problem: "", problemScope: "", solution: "", 
  scaleMechanism: "", evidence: "", successMetric: "", beneficiary: "",

  // Decision-grade additions (internal use; optional)
  decisionToInform: "",
  keyRisks: "",
  killCriteria: "",
  nextExperiment: "",

  // Denominator hardening
  denominatorIncluded: "",
  denominatorExcluded: "",

  // Sinatra adversarial check
  sinatraSkeptic: "",
  sinatraWhyUndeniable: "",

  // Human story
  internalQuote: "", internalSpeaker: "Foundation Leadership",
  externalQuote: "", externalSpeaker: "Program Partner",

  // Final confidence check (0–100)
  confidence: 70,

  archetype: "portfolio"
};
