import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import type { IntakeData } from "@/lib/types";
import { matchJobs, skillTypeLabel } from "@/lib/jobMatching";

interface Props {
  intake: IntakeData;
}

const PAGE_SIZE = 6;
const MAX = 18;

export default function JobsNearYou({ intake }: Props) {
  const result = useMemo(() => matchJobs(intake), [intake]);
  const [activeSector, setActiveSector] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const allTop = result.jobs.slice(0, MAX);

  const sectorCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const { job } of allTop) m.set(job.sector, (m.get(job.sector) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [allTop]);

  const filtered = activeSector === "All"
    ? allTop
    : allTop.filter(({ job }) => job.sector === activeSector);

  const shown = filtered.slice(0, visible);

  if (result.jobs.length === 0) {
    return null;
  }

  const headerLocation = result.expandedToRegion
    ? `across ${result.regionName}`
    : `in ${intake.country}`;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold">Matching job openings {headerLocation}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          These roles match your current skills and education level. You could pursue any of them today.
        </p>
        {result.expandedToRegion && (
          <p className="mt-1 text-xs text-muted-foreground">
            We expanded the search to show opportunities across {result.regionName}.
          </p>
        )}
      </div>

      {/* Sector chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveSector("All"); setVisible(PAGE_SIZE); }}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            activeSector === "All"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({allTop.length})
        </button>
        {sectorCounts.map(([sector, count]) => (
          <button
            key={sector}
            onClick={() => { setActiveSector(sector); setVisible(PAGE_SIZE); }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeSector === sector
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {sector} ({count})
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {shown.map(({ job }, i) => {
          const demandClasses =
            job.demandLevel === "High"
              ? "bg-[hsl(var(--skill-durable))]/15 text-[hsl(var(--skill-durable))]"
              : job.demandLevel === "Medium"
                ? "bg-muted text-muted-foreground"
                : "bg-muted/60 text-muted-foreground";

          return (
            <Card key={`${job.jobRole}-${i}`} className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {job.sector}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <h4 className="text-sm font-semibold">{job.jobRole}</h4>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold">${job.avgMonthlyIncomeUsd}</span>
                <span className="text-xs text-muted-foreground">/month avg.</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${demandClasses}`}>
                  {job.demandLevel} demand
                </span>
                {job.informalFriendly && (
                  <span className="rounded-full bg-[hsl(var(--skill-informal))]/15 px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--skill-informal))]">
                    Available in informal sector
                  </span>
                )}
                {result.expandedToRegion && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {job.country}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground">{skillTypeLabel(job.skillType)}</p>
              <p className="text-xs text-muted-foreground">Requires: {job.educationRequired} or above</p>
            </Card>
          );
        })}
      </div>

      {visible < filtered.length && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setVisible(v => Math.min(v + PAGE_SIZE, MAX))}>
            Show more jobs
          </Button>
        </div>
      )}
    </div>
  );
}
