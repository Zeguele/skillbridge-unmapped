## Goal
Stop the AI from leaking third-person language ("Omar has...", "His skills...") into Omar's view. Every youth-facing string must address the user as "you/your".

## Root cause
The system prompt in `supabase/functions/generate-profile/index.ts` already says "use second person", but Gemini still slips into third person — especially when the user's name is provided in the input. The instruction needs to be more aggressive (explicit forbidden examples, name-removal directive), and we need a small client-side safety net so a bad generation never breaks the UX.

## Changes

### 1. Harden the AI prompt — `supabase/functions/generate-profile/index.ts`
Tighten the `CRITICAL VOICE RULES` block in the system message:
- Add a non-negotiable rule: the person's name **must not appear** in any youth-facing field. No "Omar", no "he/she/they", no "the user", no "this person".
- Add concrete BAD vs GOOD examples directly in the prompt so the model pattern-matches:
  - BAD: "Omar has strong practical skills..." → GOOD: "You have strong practical skills..."
  - BAD: "His experience in farming gives him an edge." → GOOD: "Your experience in farming gives you an edge."
- Apply explicitly to: `summary`, every `skills[].description`, every `opportunities[].description`, and `portabilityReason`.
- Keep policymaker-only fields (`signal1`, `signal2`, `wittgensteinSignal`, `policySkillsGap`, `policyInterventions`, `policyDataLimits`) in third-person analytical voice — unchanged.
- In the user prompt, stop feeding the name as something to echo. Replace `Name: ${intake.name}` with `Name: (internal only — never use in youth-facing text)` so the model is less tempted to insert it.

### 2. Defensive client-side sanitizer — `src/components/ResultsView.tsx`
Add a small pure helper `toSecondPerson(text, name)` used when rendering `profile.summary`, each `skill.description`, each `opportunity.description`, and `profile.portabilityReason`. Light regex safety net only:
- Replace the user's first name (case-insensitive, word-boundary) with "You".
- Replace sentence-leading "He/She/They " with "You ".
- Replace " his / her / their " with " your ".
- Replace " him / her / them " with " you ".
- Fix common verb-agreement leaks introduced by the rewrite: "You has " → "You have ", "You is " → "You are ", "You was " → "You were ".

This is belt-and-suspenders — the prompt change is the primary fix; the sanitizer just guarantees the rendered UI is always in second person.

### 3. Out of scope
- Policymaker view: unchanged.
- No schema, type, or layout changes.
- No new dependencies.

## Verification
After changes, regenerate Omar's profile and confirm:
- Summary, skill descriptions, opportunity descriptions, and the portability sentence all read in "you/your" voice.
- His name never appears inside any of those strings.
- Policymaker view still shows third-person analytical text with citations.