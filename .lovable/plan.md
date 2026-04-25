## Goal
Eliminate the color overlap between the skill-type **dot** (green/blue/amber) and the "How future-proof is this skill" **bar** (currently also green/blue/red). The bar will become a single neutral color so its meaning is carried by the % number, not by hue.

## Change

**File: `src/components/SkillRow.tsx`**

1. Remove the `barColor(r)` helper function (no longer needed).
2. Change the bar fill from the dynamic class to a single neutral color using the existing primary teal token: `bg-primary`.

Before:
```tsx
<div className={`h-full rounded-full ${barColor(skill.resilience)}`} style={{ width: `${skill.resilience}%` }} />
```

After:
```tsx
<div className="h-full rounded-full bg-primary" style={{ width: `${skill.resilience}%` }} />
```

## Why this works
- The dots keep their meaningful color coding (Strong = green, Growing = blue, Life skill = amber) — explained by the existing legend.
- The bar's length + the `{resilience}%` number already communicate "how future-proof" without needing color tiers.
- Using `bg-primary` (the teal `#1D9E75` brand color) keeps the visual consistent with the rest of the app.

## Out of scope
- No changes to dots, labels, legend, or any other component.
- No changes to the AI prompt or data shape.
- Policymaker view untouched.