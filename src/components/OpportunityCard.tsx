import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Opportunity } from "@/lib/types";

const TYPE_LABEL: Record<Opportunity["type"], string> = {
  formal: "Formal",
  "self-employment": "Self-employment",
  "gig/freelance": "Gig / freelance",
  "training pathway": "Training pathway",
};

function matchTag(score: number) {
  // Normalize: if AI returns a decimal like 0.75, treat as 75.
  const pct = score <= 1 ? Math.round(score * 100) : Math.round(score);
  if (pct >= 70) {
    return { label: "Good fit for you", className: "bg-primary/15 text-primary hover:bg-primary/15" };
  }
  if (pct >= 50) {
    return { label: "Possible with some learning", className: "bg-[hsl(var(--info))]/15 text-[hsl(var(--info))] hover:bg-[hsl(var(--info))]/15" };
  }
  return { label: "Stretch — would need training", className: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning))]/15" };
}

export default function OpportunityCard({ op }: { op: Opportunity }) {
  const tag = matchTag(op.matchScore);
  return (
    <Card className="p-5">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-tight">{op.title}</h3>
        <Badge variant="secondary">{TYPE_LABEL[op.type]}</Badge>
      </div>
      <div className="mb-3">
        <Badge className={tag.className}>{tag.label}</Badge>
      </div>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span><span className="font-medium text-foreground">{op.wageRange}</span></span>
        <span>Sector growth: <span className="font-medium text-foreground">{op.sectorGrowth}</span></span>
        <span>Entry barrier: <span className="font-medium text-foreground">{op.barrier}</span></span>
      </div>
      <p className="text-sm">{op.description}</p>
    </Card>
  );
}
