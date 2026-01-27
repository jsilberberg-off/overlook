import { 
  Telescope, Target, Zap, BarChart3, Users, Sparkles, ShieldCheck, CalendarClock, FileText 
} from 'lucide-react';

export const JARGON_LIST = ['leverage', 'synergy', 'holistic', 'paradigm', 'ecosystem', 'optimize', 'capacity building', 'stakeholders', 'utilize', 'robust'];

export const STEPS = [
  { id: 'frame', title: 'What Game Is This?', icon: <Telescope className="w-5 h-5" /> },
  { id: 'context', title: 'Set the Date', icon: <CalendarClock className="w-5 h-5" /> },
  { id: 'problem', title: 'Stuck like Velcro', icon: <Target className="w-5 h-5" /> },
  { id: 'solution', title: 'The Catalyst', icon: <Zap className="w-5 h-5" /> }, 
  { id: 'evidence', title: 'The Sinatra Test', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'stakeholder', title: 'The Human Story', icon: <Users className="w-5 h-5" /> },
  { id: 'headline', title: 'The Headline Lab', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'review', title: 'Final Polish', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'next', title: 'What Now?', icon: <FileText className="w-5 h-5" /> },
];

export const INITIAL_DATA = {
  programName: "", headline: "", subheadline: "", location: "NEW YORK",
  futureDate: "2031-01-27", problem: "", problemScope: "", solution: "", 
  scaleMechanism: "", evidence: "", successMetric: "", beneficiary: "[Rural students]",

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

  archetype: "tech"
};

export const GOLD_STANDARDS = {
  tech: {
    label: "Tech-Enabled",
    data: {
      problem: "In 2024, rural students were 2 years behind their urban peers in math.",
      solution: "We deployed an AI-driven personal tutor that adapted to local dialects and worked offline.",
      evidence: "A longitudinal study showed students in these districts outpaced the national math average by 40%.",
      headline: "Offline-First 'Socrates' AI App Eradicates Math Mastery Gap for 2M Rural Students",
      beneficiary: "Rural Students",
      archetype: 'tech'
    }
  },
  educator: {
    label: "Educator Support",
    data: {
      problem: "The Retention Crisis: 40% of new teachers were leaving within three years.",
      solution: "We built a national 'Mentor-Network' that paired every new teacher with a veteran 'Master Coach'.",
      evidence: "Turnover dropped by $12M annually, allowing for a 10% base salary increase.",
      headline: "Master-Coach 'Check-In' Model Drives Historic 95% Teacher Retention",
      beneficiary: "New Teachers",
      archetype: 'educator'
    }
  }
};
