// Auto-generated seed data for the Policymaker "Youth skills mapping — live data" dashboard.
// 87 profiles total: 48 Ghana + 39 Bangladesh, distributed across the last 6 months.

export interface SeedProfile {
  id: string;
  country: string;
  education_level: string;
  field_of_study: string;
  experience: string;
  self_taught: string[];
  languages: string[];
  digital_level: string;
  digital_skills: string[];
  has_certifications: boolean;
  certifications_description: string | null;
  sectors_matched: string[];
  top_match_score: number;
  created_at: string; // ISO
}

const GHANA_NAMES = [
  "Kwame", "Ama", "Kofi", "Akua", "Yaw", "Abena", "Kwesi", "Afia", "Mensah", "Osei",
  "Emmanuel", "Grace", "Daniel", "Comfort", "Isaac", "Patience", "Samuel", "Mercy", "David", "Felicia",
  "Peter", "Joyce", "Michael", "Beatrice", "Joseph", "Agnes", "Francis", "Lucy", "George", "Esther",
  "Prince", "Rita", "Frank", "Doris", "Gifty", "Nana", "Efua", "Kojo", "Esi", "Adwoa",
  "Akosua", "Badu", "Richard", "Sarah", "Gloria", "Priscilla", "Solomon", "Hannah",
];

const BANGLADESH_NAMES = [
  "Rahim", "Fatima", "Karim", "Aisha", "Hassan", "Nadia", "Omar", "Yasmin", "Tariq", "Salma",
  "Jamal", "Razia", "Imran", "Sultana", "Farhan", "Nasreen", "Zahid", "Shahnaz", "Rafiq", "Taslima",
  "Mahbub", "Halima", "Arif", "Kulsum", "Shakil", "Rehana", "Masud", "Parveen", "Habib", "Morsheda",
  "Billal", "Asma", "Shafiq", "Nurjahan", "Mostafa", "Shahida", "Kamrul", "Rashida", "Sohel",
];

const GHANA_LANGS = ["English", "Twi", "Hausa", "French", "Ewe", "Ga"];
const BANGLADESH_LANGS = ["English", "Hindi", "Arabic", "Urdu"];

const GHANA_EXPERIENCES = [
  "I sell phone accessories at Makola Market and fix basic phone issues for customers.",
  "I work on my family's cocoa farm, managing harvest schedules and workers.",
  "I run a small food stall near Kaneshie market, preparing banku and tilapia.",
  "I repair motorcycles and bicycles at a roadside shop in Kumasi.",
  "I do hairdressing and braiding from my home for women in my neighborhood.",
  "I help my uncle with his construction projects, mixing cement and laying blocks.",
  "I buy and sell used clothing at Kantamanto market.",
  "I drive a trotro and manage the daily route between Accra and Tema.",
  "I sew school uniforms and church dresses from my mother's sewing shop.",
  "I teach younger children in my community after school.",
  "I work at a mobile money agent point, handling transactions for customers.",
  "I keep records for a local savings group and help members track contributions.",
  "I do carpentry work, making furniture and door frames for local homes.",
  "I manage social media pages for two small businesses in my area.",
  "I farm vegetables on a small plot and sell at the local market twice a week.",
];

const BANGLADESH_EXPERIENCES = [
  "I work in a garment factory operating sewing machines for export clothing.",
  "I repair mobile phones and tablets at a small shop in Dhaka.",
  "I do freelance data entry work online through Upwork and Fiverr.",
  "I drive a rickshaw and sometimes do delivery work for local shops.",
  "I help my family with rice paddy farming and manage irrigation equipment.",
  "I run a small tea stall near the bus station and handle all the accounting.",
  "I do tailoring and alterations from home, mostly salwar kameez and blouses.",
  "I work as a helper at a construction site carrying materials and mixing concrete.",
  "I cook and sell street food, specializing in fuchka and chotpoti.",
  "I tutor school children in mathematics and English in my neighborhood.",
  "I work at a fish market helping with cleaning, sorting, and weighing.",
  "I do basic electrical wiring for homes in my village.",
  "I manage a small grocery shop and keep track of inventory and credit sales.",
  "I do embroidery work — nakshi kantha — and sell through Facebook.",
  "I assist at a local pharmacy, helping customers and managing stock.",
];

const ALL_SKILLS = [
  "Basic coding",
  "Social media",
  "Accounting/bookkeeping",
  "Machine/device repair",
  "Construction/building",
  "Farming/agriculture",
  "Food preparation",
  "Sewing/tailoring",
  "Healthcare/first aid",
  "Customer service",
  "Teaching/tutoring",
  "Transport/driving",
];

const DIGITAL_SKILLS = [
  "Basic phone use (calls, SMS)",
  "Social media and messaging apps",
  "Basic computer use (email, documents)",
  "Spreadsheets and data tools",
  "Basic coding / web development",
  "Video editing / content creation",
  "AI tools (ChatGPT, translation apps, etc.)",
];

const DIGITAL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const FIELDS = ["", "General", "Agriculture", "Business", "Health", "Technology"];

const CUSTOM_COMPETENCIES = [
  "",
  "I help at my church youth group.",
  "I organize community events.",
  "I keep records for a local savings group.",
  "I volunteer at a health clinic.",
];

const CERT_DESCRIPTIONS = [
  "Completed a 3-month mobile phone repair course.",
  "Basic first aid certificate from Red Cross.",
  "Motorcycle driving permit.",
  "Short course in bookkeeping from local training center.",
  "Certificate in basic computer skills from community center.",
  "Completed online course in digital marketing.",
  "Vocational welding certificate.",
  "Tailoring and fashion design certificate from local institute.",
];

const EDU = {
  none: "No formal schooling",
  primaryPartial: "Primary school (partial)",
  primaryComplete: "Primary school (complete)",
  juniorSec: "Junior secondary / middle school",
  seniorSec: "Senior secondary / high school",
  vocational: "Vocational / technical certificate",
  diploma: "Post-secondary diploma",
};

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260426);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  const take = Math.min(n, copy.length);
  for (let i = 0; i < take; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function uuid(): string {
  const hex = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < 32; i++) {
    let h: number;
    if (i === 12) h = 4;
    else if (i === 16) h = (Math.floor(rand() * 16) & 0x3) | 0x8;
    else h = Math.floor(rand() * 16);
    s += hex[h];
  }
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}

function buildEducationPool(country: "Ghana" | "Bangladesh"): string[] {
  if (country === "Ghana") {
    return [
      ...Array(3).fill(EDU.none),
      ...Array(4).fill(EDU.primaryPartial),
      ...Array(7).fill(EDU.primaryComplete),
      ...Array(8).fill(EDU.juniorSec),
      ...Array(13).fill(EDU.seniorSec),
      ...Array(8).fill(EDU.vocational),
      ...Array(5).fill(EDU.diploma),
    ];
  }
  return [
    ...Array(4).fill(EDU.none),
    ...Array(6).fill(EDU.primaryPartial),
    ...Array(8).fill(EDU.primaryComplete),
    ...Array(8).fill(EDU.juniorSec),
    ...Array(7).fill(EDU.seniorSec),
    ...Array(4).fill(EDU.vocational),
    ...Array(2).fill(EDU.diploma),
  ];
}

function buildDatePool(): string[] {
  const now = Date.now();
  const monthMs = 30 * 24 * 3600 * 1000;
  const counts = [8, 10, 12, 15, 18, 24];
  const out: string[] = [];
  counts.forEach((count, i) => {
    const monthsAgo = 5 - i;
    for (let k = 0; k < count; k++) {
      const offset = monthsAgo * monthMs - Math.floor(rand() * monthMs);
      out.push(new Date(now - offset).toISOString());
    }
  });
  return out;
}

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
  "Teaching/tutoring": [],
  "Transport/driving": ["Transportation"],
};

function pickSkillsEnsuringMin(rowCount: number): string[][] {
  const need = new Map<string, number>(ALL_SKILLS.map(s => [s, 15]));
  const rows: string[][] = [];
  for (let i = 0; i < rowCount; i++) {
    const n = randInt(1, 5);
    const ranked = [...ALL_SKILLS].sort((a, b) => (need.get(b)! - need.get(a)!) + (rand() - 0.5) * 4);
    const chosen = ranked.slice(0, n);
    chosen.forEach(s => need.set(s, Math.max(0, need.get(s)! - 1)));
    rows.push(chosen);
  }
  return rows;
}

function buildCountryProfiles(
  country: "Ghana" | "Bangladesh",
  count: number,
  experiencePool: string[],
  langPool: string[],
  dates: string[],
): SeedProfile[] {
  const eduPool = buildEducationPool(country);
  for (let i = eduPool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [eduPool[i], eduPool[j]] = [eduPool[j], eduPool[i]];
  }
  const skillsByRow = pickSkillsEnsuringMin(count);
  const certCount = Math.round(count * 0.25);
  const certFlags: boolean[] = [...Array(certCount).fill(true), ...Array(count - certCount).fill(false)];
  for (let i = certFlags.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [certFlags[i], certFlags[j]] = [certFlags[j], certFlags[i]];
  }

  const out: SeedProfile[] = [];
  for (let i = 0; i < count; i++) {
    const skills = skillsByRow[i];
    const sectors = Array.from(new Set(skills.flatMap(s => SKILL_TO_SECTORS[s] || [])));
    const hasCert = certFlags[i];
    out.push({
      id: uuid(),
      country,
      education_level: eduPool[i],
      field_of_study: pick(FIELDS),
      experience: pick(experiencePool) + (rand() < 0.3 ? " " + pick(CUSTOM_COMPETENCIES) : ""),
      self_taught: skills,
      languages: pickN(langPool, randInt(1, 3)),
      digital_level: pick(DIGITAL_LEVELS),
      digital_skills: pickN(DIGITAL_SKILLS, randInt(1, 3)),
      has_certifications: hasCert,
      certifications_description: hasCert ? pick(CERT_DESCRIPTIONS) : null,
      sectors_matched: sectors.slice(0, 5),
      top_match_score: randInt(45, 92),
      created_at: dates[i],
    });
  }
  return out;
}

function buildAll(): SeedProfile[] {
  const dates = buildDatePool();
  for (let i = dates.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [dates[i], dates[j]] = [dates[j], dates[i]];
  }
  const ghanaDates = dates.slice(0, 48);
  const bangladeshDates = dates.slice(48, 87);

  const ghana = buildCountryProfiles("Ghana", 48, GHANA_EXPERIENCES, GHANA_LANGS, ghanaDates);
  const bangladesh = buildCountryProfiles("Bangladesh", 39, BANGLADESH_EXPERIENCES, BANGLADESH_LANGS, bangladeshDates);
  void GHANA_NAMES; void BANGLADESH_NAMES;
  return [...ghana, ...bangladesh];
}

export const SEED_PROFILES: SeedProfile[] = buildAll();
