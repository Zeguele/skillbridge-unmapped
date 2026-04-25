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

  // 4) Verb agreement after a forced "You" / "Your" rewrite.
  // After "you" we need base-form verbs (you have, NOT you has).

  // 4a) Irregular high-frequency verbs
  const irregulars: Array<[RegExp, string]> = [
    [/\bhas\b/g, "have"],
    [/\bis\b/g, "are"],
    [/\bwas\b/g, "were"],
    [/\bdoes\b/g, "do"],
    [/\bgoes\b/g, "go"],
    [/\bhasn't\b/g, "haven't"],
    [/\bisn't\b/g, "aren't"],
    [/\bwasn't\b/g, "weren't"],
    [/\bdoesn't\b/g, "don't"],
    [/\bhas not\b/g, "have not"],
    [/\bis not\b/g, "are not"],
    [/\bwas not\b/g, "were not"],
    [/\bdoes not\b/g, "do not"],
  ];

  // 4b) Regular -s / -es / -ies third-person verb endings.
  // We strip the trailing s when the verb directly follows "you".
  // Conservative: only fire when preceded by " you " / " You " (not "your").
  const fixAfterYou = (s: string) =>
    s.replace(
      /\b(You|you)\s+([a-z]+?)(ies|es|s)\b/g,
      (_m, pron: string, stem: string, suffix: string) => {
        // Reconstruct the base form from the stripped suffix
        let base = stem;
        if (suffix === "ies") base = stem + "y";          // tries -> try
        else if (suffix === "es") {
          // Only "es" verbs that need the "e" gone: -sh/-ch/-x/-z/-s/-o stems keep nothing extra.
          // For most: works -> work, watches -> watch, fixes -> fix, goes handled above.
          if (/(sh|ch|x|z|ss|o)$/.test(stem)) base = stem;
          else base = stem + "e"; // e.g. "likes" -> stem "lik" + "e" = "like"
        }
        // suffix === "s": just drop it (works -> work, runs -> run)
        // Avoid mangling words like "yes", "this", "plus" which aren't verbs —
        // but those won't appear right after "you" in normal sentences.
        return `${pron} ${base}`;
      },
    );

  // Apply irregulars only in the "you <verb>" position, not globally.
  out = out.replace(/\b(You|you)\s+([A-Za-z']+(?:\s+not)?)\b/g, (m, pron: string, verb: string) => {
    let v = verb;
    for (const [re, repl] of irregulars) v = v.replace(re, repl);
    return `${pron} ${v}`;
  });

  out = fixAfterYou(out);

  return out;
}
