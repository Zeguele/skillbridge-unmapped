import type { ProfileSkill } from "@/lib/types";

const DOT: Record<ProfileSkill["type"], string> = {
  durable: "bg-[hsl(var(--skill-durable))]",
  developing: "bg-[hsl(var(--skill-developing))]",
  informal: "bg-[hsl(var(--skill-informal))]",
};

const TYPE_LABEL: Record<ProfileSkill["type"], string> = {
  durable: "Strong",
  developing: "Growing",
  informal: "Life skill",
};

function barColor(r: number) {
  if (r >= 67) return "bg-[hsl(var(--resilience-high))]";
  if (r >= 34) return "bg-[hsl(var(--resilience-med))]";
  return "bg-[hsl(var(--resilience-low))]";
}

export default function SkillRow({ skill }: { skill: ProfileSkill }) {
  return (
    <div className="border-b border-border py-3 last:border-0">
      <div className="mb-1 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${DOT[skill.type]}`} />
        <span className="font-medium">{skill.name}</span>
        <span className="text-xs text-muted-foreground">· {TYPE_LABEL[skill.type]}</span>
      </div>
      <p className="mb-2 pl-4 text-sm text-muted-foreground">{skill.description}</p>
      <div className="pl-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted-foreground">How future-proof is this skill</span>
          <span className="tabular-nums">{skill.resilience}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full ${barColor(skill.resilience)}`} style={{ width: `${skill.resilience}%` }} />
        </div>
      </div>
    </div>
  );
}
