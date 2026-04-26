import type { CountryKey } from "./countryData";

export interface PolicyIntakeData {
  country: CountryKey;
  segments: string[];
  sectors: string[];
  priority: string;
  additionalObjective?: string;
  languagePref: string;
}

export interface IntakeData {
  name: string;
  country: CountryKey;
  languagePref: string;
  education: string;
  fieldOfStudy: string;
  experience: string;
  selfTaughtSkills: string[];
  languages: string[];
  digitalLevel: string;
  digitalSkills: string[];
  hasCertifications: boolean;
  certificationsDescription: string;
  other: string;
}

export interface TrainingRecommendation {
  title: string;
  why: string;
  duration: string;
  format: string;
  impact: string;
}

export interface ProfileSkill {
  name: string;
  type: "durable" | "developing" | "informal";
  description: string;
  resilience: number; // 0-100
}

export interface Opportunity {
  title: string;
  type: "formal" | "self-employment" | "gig/freelance" | "training pathway";
  wageRange: string;
  sectorGrowth: "High" | "Medium" | "Low";
  barrier: "Low" | "Medium" | "High";
  description: string;
  matchScore: number; // 0-100
}

export interface Profile {
  summary: string;
  isco: { code: string; title: string };
  esco: { label: string };
  onet: { code: string; title: string };
  skills: ProfileSkill[];
  portability: "High" | "Medium" | "Low";
  portabilityReason: string;
  marketContext: string;
  opportunities: Opportunity[];
  signal1: string;
  signal2: string;
  wittgensteinSignal: string;
  policySkillsGap: string;
  policySkillsGapSummary?: string;
  policyInterventions: string;
  policyInterventionsSummary?: string;
  policyDataLimits: string;
  policyDataLimitsSummary?: string;
  recommendedTraining: TrainingRecommendation[];
}
