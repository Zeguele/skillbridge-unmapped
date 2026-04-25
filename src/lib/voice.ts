// Defensive client-side safety net to keep youth-facing text in second person,
// in case the AI slips into third-person despite the prompt rules.

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function toSecondPerson(text: string, name?: string | null): string {
  if (!text) return text;
  let out = text;

  // 1) Remove the user's first name entirely (replace with "You")
  const first = (name ?? "").trim().split(/\s+/)[0];
  if (first && first.length >= 2) {
    const re = new RegExp(`\\b${escapeRegex(first)}(?:'s)?\\b`, "gi");
    out = out.replace(re, (match) => (match.endsWith("s") || match.endsWith("S") ? "Your" : "You"));
  }

  // 2) Generic third-person noun phrases
  out = out
    .replace(/\bthe (user|candidate|youth|person|individual|applicant)\b/gi, "you")
    .replace(/\bthis (user|candidate|youth|person|individual|applicant)\b/gi, "you");

  // 3) Pronoun rewrites (case-aware where it matters)
  // Subject pronouns at any position
  out = out
    .replace(/\b(He|She|They)\b/g, "You")
    .replace(/\b(he|she|they)\b/g, "you")
    // Possessive determiners
    .replace(/\b(His|Her|Their)\b/g, "Your")
    .replace(/\b(his|her|their)\b/g, "your")
    // Object pronouns — careful: "her" as object handled above already; "him/them"
    .replace(/\b(Him|Them)\b/g, "You")
    .replace(/\b(him|them)\b/g, "you")
    // Possessive pronouns
    .replace(/\b(His|Hers|Theirs)\b/g, "Yours")
    .replace(/\b(hers|theirs)\b/g, "yours");

  // 4) Verb agreement after a forced "You" rewrite
  out = out
    .replace(/\bYou has\b/g, "You have")
    .replace(/\byou has\b/g, "you have")
    .replace(/\bYou is\b/g, "You are")
    .replace(/\byou is\b/g, "you are")
    .replace(/\bYou was\b/g, "You were")
    .replace(/\byou was\b/g, "you were")
    .replace(/\bYou does\b/g, "You do")
    .replace(/\byou does\b/g, "you do")
    .replace(/\bYou goes\b/g, "You go")
    .replace(/\byou goes\b/g, "you go");

  return out;
}
