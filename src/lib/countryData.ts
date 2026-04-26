export type CountryKey =
  | "Ghana" | "Nigeria" | "Kenya" | "Senegal" | "Côte d'Ivoire"
  | "Uganda" | "Rwanda" | "Ethiopia" | "Tanzania" | "Bangladesh"
  | "Pakistan" | "Other Sub-Saharan Africa" | "Other South Asia";

export interface CountryStats {
  youthUnemployment: number; // %
  informalEconomy: number; // %
  gdpGrowth: number; // %
  wageFloor: number; // USD/hr
  sectors: string[];
}

export const COUNTRIES: CountryKey[] = [
  "Ghana", "Nigeria", "Kenya", "Senegal", "Côte d'Ivoire",
  "Uganda", "Rwanda", "Ethiopia", "Tanzania", "Bangladesh",
  "Pakistan", "Other Sub-Saharan Africa", "Other South Asia",
];

export const COUNTRY_DATA: Record<CountryKey, CountryStats> = {
  Ghana: { youthUnemployment: 12.1, informalEconomy: 80, gdpGrowth: 3.1, wageFloor: 1.75, sectors: ["Agri-business","ICT services","Construction","Retail trade","Financial services"] },
  Nigeria: { youthUnemployment: 33.6, informalEconomy: 83, gdpGrowth: 2.9, wageFloor: 0.82, sectors: ["Fintech","Agriculture","Oil & gas services","Media & creative","Health services"] },
  Kenya: { youthUnemployment: 13.2, informalEconomy: 77, gdpGrowth: 5.0, wageFloor: 2.10, sectors: ["ICT & BPO","Agriculture","Tourism","Financial services","Construction"] },
  Senegal: { youthUnemployment: 19.3, informalEconomy: 85, gdpGrowth: 8.3, wageFloor: 1.42, sectors: ["Fishing & agri-food","Tourism","BPO/call centres","Construction","Retail"] },
  "Côte d'Ivoire": { youthUnemployment: 22.4, informalEconomy: 86, gdpGrowth: 6.7, wageFloor: 1.20, sectors: ["Cocoa & agri-food","Construction","Retail trade","Transport","Financial services"] },
  Uganda: { youthUnemployment: 14.7, informalEconomy: 87, gdpGrowth: 5.2, wageFloor: 0.90, sectors: ["Agriculture","Construction","ICT","Trade","Health"] },
  Rwanda: { youthUnemployment: 20.7, informalEconomy: 78, gdpGrowth: 7.5, wageFloor: 1.10, sectors: ["ICT/tech hubs","Tourism","Agriculture","Construction","Financial services"] },
  Ethiopia: { youthUnemployment: 25.0, informalEconomy: 88, gdpGrowth: 7.7, wageFloor: 0.65, sectors: ["Agri-food processing","Textiles","Construction","Transport","Health"] },
  Tanzania: { youthUnemployment: 13.4, informalEconomy: 76, gdpGrowth: 5.1, wageFloor: 0.88, sectors: ["Agriculture","Tourism","Mining","Construction","Retail"] },
  Bangladesh: { youthUnemployment: 10.6, informalEconomy: 85, gdpGrowth: 6.0, wageFloor: 0.67, sectors: ["Garment & textiles","ICT & freelancing","Agriculture","Construction","Health"] },
  Pakistan: { youthUnemployment: 28.0, informalEconomy: 72, gdpGrowth: 2.4, wageFloor: 0.74, sectors: ["Textiles","ICT services","Agriculture","Construction","Retail"] },
  "Other Sub-Saharan Africa": { youthUnemployment: 18.0, informalEconomy: 82, gdpGrowth: 4.0, wageFloor: 1.00, sectors: ["Agriculture","Trade","Construction","Services","ICT"] },
  "Other South Asia": { youthUnemployment: 17.0, informalEconomy: 80, gdpGrowth: 5.0, wageFloor: 0.80, sectors: ["Agriculture","Textiles","Services","Construction","ICT"] },
};

export const SELF_TAUGHT_SKILLS = [
  "Basic coding","Social media","Accounting/bookkeeping","Machine/device repair",
  "Construction/building","Farming/agriculture","Food preparation","Sewing/tailoring",
  "Healthcare/first aid","Customer service","Teaching/tutoring","Transport/driving",
];

export const LANGUAGES = [
  "English","French","Arabic","Swahili","Hausa","Twi","Wolof","Amharic","Portuguese","Spanish",
];

export const EDUCATION_LEVELS = [
  "No formal schooling","Primary school partial","Primary school complete",
  "Junior secondary","Senior secondary / high school","Vocational certificate",
  "Post-secondary diploma","University degree","Postgraduate degree",
];

export const DIGITAL_LEVELS = [
  "None/very basic","Basic phone use","Social media and messaging",
  "Basic computer use","Spreadsheets and data","Basic coding/web","Advanced digital",
];

export const DIGITAL_SKILLS = [
  "Basic phone use (calls, SMS)",
  "Social media and messaging apps",
  "Basic computer use (email, documents)",
  "Spreadsheets and data tools",
  "Basic coding / web development",
  "Video editing / content creation",
  "AI tools (ChatGPT, translation apps, etc.)",
];

// Note: language preference is now driven by the global LanguageProvider (src/lib/i18n.tsx).
// Kept here as a deprecated alias for any legacy import.
export const LANGUAGE_PREFS = ["English", "Français", "العربية", "Español", "Português", "हिन्दी"] as const;

// ---------------------------------------------------------------------------
// Policymaker intake options
// ---------------------------------------------------------------------------

export const POLICY_SEGMENTS = [
  "Youth with no formal schooling",
  "Youth with primary education only",
  "Youth with secondary education",
  "Youth with vocational / technical training",
  "Youth in the informal economy",
  "Youth in rural areas",
  "Youth in urban areas",
  "Young women specifically",
  "Displaced or migrant youth",
] as const;

// Sectors must match the dataset values used in src/data/jobs.ts
export const POLICY_SECTORS = [
  "Agriculture",
  "Construction",
  "Creative & Digital",
  "Hospitality",
  "ICT Services",
  "Manufacturing",
  "Personal Services",
  "Repair & Maintenance",
  "Retail & Sales",
  "Transportation",
] as const;

export const POLICY_PRIORITIES = [
  "Reduce youth unemployment",
  "Formalize informal workers",
  "Upskill existing workforce",
  "Connect skills to job openings",
  "Design a new training program",
  "Assess automation readiness",
] as const;
