import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Opportunity } from "@/lib/types";

const TYPE_LABEL: Record<Opportunity["type"], string> = {
  formal: "Formal",
  "self-employment": "Self-employment",
  "gig/freelance": "Gig / freelance",
  "training pathway": "Training pathway",
};

export default function OpportunityCard({ op }: { op: Opportunity }) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-tight">{op.title}</h3>
        <Badge variant="secondary">{TYPE_LABEL[op.type]}</Badge>
      </div>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span><span className="font-medium text-foreground">{op.wageRange}</span></span>
        <span>Sector growth: <span className="font-medium text-foreground">{op.sectorGrowth}</span></span>
        <span>Entry barrier: <span className="font-medium text-foreground">{op.barrier}</span></span>
      </div>
      <p className="mb-4 text-sm">{op.description}</p>
      <div>
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted-foreground">Skills match</span>
          <span className="font-medium tabular-nums">{op.matchScore}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, op.matchScore))}%` }} />
        </div>
      </div>
    </Card>
  );
}
