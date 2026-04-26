import { JOB_OPENINGS, type JobOpening } from "@/data/jobs";
import type { IntakeData } from "@/lib/types";
import type { CountryKey } from "@/lib/countryData";

// Education hierarchy (low -> high). Dataset values.
const EDU_LEVELS = [
  "No formal education",
  "Primary school",
  "Short certificate",
  "High school",
  "Diploma",
] as const;
type EduLevel = (typeof EDU_LEVELS)[number];

const EDU_RANK: Record<EduLevel, number> = {
  "No formal education": 0,
  "Primary school": 1,
  "Short certificate": 2,
  "High school": 3,
  Diploma: 4,
};

// Map intake form education to dataset education
export function mapIntakeEducation(intake: string): EduLevel {
  const s = (intake || "").toLowerCase();
  if (s.includes("no formal")) return "No formal education";
  if (s.includes("primary")) return "Primary school";
  if (s.includes("vocational") || s.includes("post-secondary") || s.includes("diploma") && s.includes("post")) return "Short certificate";
  if (s.includes("junior") || s.includes("senior") || s.includes("secondary") || s.includes("high school") || s.includes("middle")) return "High school";
  if (s.includes("university") || s.includes("bachelor") || s.includes("postgraduate") || s.includes("degree") || s.includes("diploma")) return "Diploma";
  return "High school"; // safe default
}

// Region grouping for fallback
const SSA = new Set([
  "Ghana","Nigeria","Kenya","Senegal","Côte d'Ivoire","Uganda","Rwanda","Ethiopia","Tanzania",
  "Other Sub-Saharan Africa","Egypt","Morocco",
]);
const SOUTH_ASIA = new Set(["Bangladesh","Pakistan","Nepal","India","Other South Asia"]);
const SE_ASIA = new Set(["Indonesia","Philippines","Vietnam","Cambodia"]);

function regionOf(country: string): { name: string; members: Set<string> } {
  if (SSA.has(country)) return { name: "Sub-Saharan Africa & North Africa", members: SSA };
  if (SOUTH_ASIA.has(country)) return { name: "South Asia", members: SOUTH_ASIA };
  if (SE_ASIA.has(country)) return { name: "Southeast Asia", members: SE_ASIA };
  return { name: "your region", members: new Set([country]) };
}

// Map self-taught skills + experience text to dataset sectors
const SKILL_TO_SECTORS: Record<string, string[]> = {
  "Basic coding": ["Creative & Digital", "ICT Services"],
  "Social media": ["Creative & Digital", "ICT Services"],
  "Accounting/bookkeeping": ["Retail & Sales", "ICT Services"],
  "Machine/device repair": ["Repair & Maintenance"],
  "Construction/building": ["Construction"],
  "Farming/agriculture": ["Agriculture"],
  "Food preparation": ["Hospitality"],
  "Sewing/tailoring": ["Personal Services", "Manufacturing"],
  "Healthcare/first aid": ["Personal Services"],
  "Customer service": ["Retail & Sales", "Hospitality"],
  "Teaching/tutoring": [], // generic — counted as partial
  "Transport/driving": ["Transportation"],
};

const EXPERIENCE_KEYWORDS: Array<{ re: RegExp; sectors: string[] }> = [
  { re: /\b(farm|agri|crop|livestock|harvest)/i, sectors: ["Agriculture"] },
  { re: /\b(repair|mechanic|technician|fix)/i, sectors: ["Repair & Maintenance"] },
  { re: /\b(cook|chef|kitchen|restaurant|hotel|waiter|hospitality)/i, sectors: ["Hospitality"] },
  { re: /\b(sew|tailor|garment|stitch|cloth)/i, sectors: ["Personal Services", "Manufacturing"] },
  { re: /\b(driv|courier|delivery|transport|motorbike|truck)/i, sectors: ["Transportation"] },
  { re: /\b(constr|mason|build|carpent|electric|plumb)/i, sectors: ["Construction"] },
  { re: /\b(sales|shop|retail|cashier|market|trade)/i, sectors: ["Retail & Sales"] },
  { re: /\b(cod|web|software|app|developer|it |ict|computer)/i, sectors: ["ICT Services", "Creative & Digital"] },
  { re: /\b(design|video|photo|edit|content|social media|creative)/i, sectors: ["Creative & Digital"] },
  { re: /\b(beauty|hair|salon|nurse|caregiver|teach|tutor)/i, sectors: ["Personal Services"] },
  { re: /\b(factory|assembl|manufactur|packag|textile)/i, sectors: ["Manufacturing"] },
];

function inferSectors(intake: IntakeData): { strong: Set<string>; partial: Set<string> } {
  const strong = new Set<string>();
  const partial = new Set<string>();
  for (const sk of intake.selfTaughtSkills || []) {
    const sectors = SKILL_TO_SECTORS[sk];
    if (!sectors) continue;
    if (sectors.length === 0) {
      // generic -> partial for all
      ["Agriculture","Construction","Creative & Digital","Hospitality","ICT Services","Manufacturing","Personal Services","Repair & Maintenance","Retail & Sales","Transportation"]
        .forEach(s => partial.add(s));
    } else sectors.forEach(s => strong.add(s));
  }
  const text = `${intake.experience || ""} ${intake.other || ""} ${intake.fieldOfStudy || ""}`;
  for (const { re, sectors } of EXPERIENCE_KEYWORDS) {
    if (re.test(text)) sectors.forEach(s => strong.add(s));
  }
  return { strong, partial };
}

// Infer the user's likely "skill type" learning style from intake
function inferSkillTypes(intake: IntakeData): Set<string> {
  const out = new Set<string>();
  if ((intake.selfTaughtSkills || []).length > 0) out.add("Self-taught");
  const text = `${intake.experience || ""} ${intake.other || ""}`.toLowerCase();
  if (/apprentice|under a master|learned from/.test(text)) out.add("Apprenticeship");
  if (/on the job|at work|workplace|job training/.test(text)) out.add("On-the-job Training");
  if (/community|ngo|youth program|church|mosque/.test(text)) out.add("Community Training");
  if (/vocational|technical school|tvet|certificate/.test(text)) out.add("Vocational Training");
  return out;
}

const ADJACENT_SKILL_TYPES: Record<string, string[]> = {
  "Self-taught": ["On-the-job Training", "Community Training"],
  "Apprenticeship": ["On-the-job Training", "Vocational Training"],
  "On-the-job Training": ["Self-taught", "Apprenticeship"],
  "Community Training": ["Self-taught", "On-the-job Training"],
  "Vocational Training": ["Apprenticeship", "On-the-job Training"],
};

export interface ScoredJob {
  job: JobOpening;
  score: number;
}

export interface MatchResult {
  jobs: ScoredJob[];
  expandedToRegion: boolean;
  regionName: string;
}

export function matchJobs(intake: IntakeData): MatchResult {
  const userEdu = mapIntakeEducation(intake.education);
  const userEduRank = EDU_RANK[userEdu];
  const region = regionOf(intake.country);
  const userSkillTypes = inferSkillTypes(intake);
  const { strong: strongSectors, partial: partialSectors } = inferSectors(intake);

  const eduOk = (j: JobOpening) =>
    EDU_RANK[j.educationRequired as EduLevel] <= userEduRank;

  // First pass: country
  const isOtherBucket = intake.country.startsWith("Other ");
  let countryFilter: (j: JobOpening) => boolean = isOtherBucket
    ? (j) => region.members.has(j.country)
    : (j) => j.country === intake.country;

  let pool = JOB_OPENINGS.filter(j => countryFilter(j) && eduOk(j));
  let expandedToRegion = false;

  if (pool.length < 3) {
    expandedToRegion = true;
    pool = JOB_OPENINGS.filter(j => region.members.has(j.country) && eduOk(j));
  }

  const score = (j: JobOpening): number => {
    let s = 0;
    // Skill type match (40)
    if (userSkillTypes.has(j.skillType)) s += 40;
    else if ([...userSkillTypes].some(t => ADJACENT_SKILL_TYPES[t]?.includes(j.skillType))) s += 20;

    // Sector relevance (35)
    if (strongSectors.has(j.sector)) s += 35;
    else if (partialSectors.has(j.sector)) s += 15;

    // Demand (15)
    if (j.demandLevel === "High") s += 15;
    else if (j.demandLevel === "Medium") s += 10;

    // Informal-friendly bonus (10) — for users below high school
    if (userEduRank < EDU_RANK["High school"] && j.informalFriendly) s += 10;

    return s;
  };

  let scored: ScoredJob[] = pool
    .map(job => ({ job, score: score(job) }))
    .filter(s => s.score >= 70)
    .sort((a, b) => b.score - a.score);

  // If too few good-fit jobs, expand to region and re-score
  if (scored.length < 3 && !expandedToRegion) {
    const regionPool = JOB_OPENINGS.filter(j => region.members.has(j.country) && eduOk(j));
    const regionScored = regionPool
      .map(job => ({ job, score: score(job) }))
      .filter(s => s.score >= 70)
      .sort((a, b) => b.score - a.score);
    if (regionScored.length > scored.length) {
      scored = regionScored;
      expandedToRegion = true;
    }
  }

  return { jobs: scored, expandedToRegion, regionName: region.name };
}

// Aggregate stats for policymaker view, scoped to country (or region fallback)
// Optionally filter by a set of sectors of interest.
export function aggregateForCountry(country: CountryKey, sectorFilter?: string[]) {
  const isOther = country.startsWith("Other ");
  const region = regionOf(country);
  const basePool = isOther
    ? JOB_OPENINGS.filter(j => region.members.has(j.country))
    : JOB_OPENINGS.filter(j => j.country === country);
  const pool = sectorFilter && sectorFilter.length > 0
    ? basePool.filter(j => sectorFilter.includes(j.sector))
    : basePool;

  const total = pool.length;
  const bySectorMap = new Map<string, number>();
  const byEduMap = new Map<string, number>();
  let informalCount = 0;

  for (const j of pool) {
    bySectorMap.set(j.sector, (bySectorMap.get(j.sector) || 0) + 1);
    byEduMap.set(j.educationRequired, (byEduMap.get(j.educationRequired) || 0) + 1);
    if (j.informalFriendly) informalCount++;
  }
  const bySector = [...bySectorMap.entries()]
    .map(([sector, count]) => ({ sector, count }))
    .sort((a, b) => b.count - a.count);

  // Top 5 high-demand roles by avg income
  const highDemand = pool.filter(j => j.demandLevel === "High");
  const roleMap = new Map<string, { incomes: number[]; sector: string }>();
  for (const j of highDemand) {
    const e = roleMap.get(j.jobRole) || { incomes: [], sector: j.sector };
    e.incomes.push(j.avgMonthlyIncomeUsd);
    roleMap.set(j.jobRole, e);
  }
  const topRoles = [...roleMap.entries()]
    .map(([role, v]) => ({
      role,
      sector: v.sector,
      count: v.incomes.length,
      avgIncome: Math.round(v.incomes.reduce((a, b) => a + b, 0) / v.incomes.length),
    }))
    .sort((a, b) => b.count - a.count || b.avgIncome - a.avgIncome)
    .slice(0, 5);

  const eduDist = EDU_LEVELS.map(level => ({
    level,
    count: byEduMap.get(level) || 0,
    pct: total ? Math.round(((byEduMap.get(level) || 0) / total) * 100) : 0,
  }));

  return {
    total,
    bySector,
    topRoles,
    informalPct: total ? Math.round((informalCount / total) * 100) : 0,
    eduDist,
    isRegional: isOther,
    regionName: region.name,
  };
}

export function fitTag(score: number): { label: string; tone: "good" | "ok" | "stretch" } {
  if (score >= 70) return { label: "Good fit for you", tone: "good" };
  if (score >= 50) return { label: "Possible with some learning", tone: "ok" };
  return { label: "Stretch — would need training", tone: "stretch" };
}

export function skillTypeLabel(t: string): string {
  switch (t) {
    case "Self-taught": return "Typically self-taught";
    case "Apprenticeship": return "Usually requires an apprenticeship";
    case "On-the-job Training": return "Typically learned on the job";
    case "Community Training": return "Community training available";
    case "Vocational Training": return "Vocational training recommended";
    default: return t;
  }
}
