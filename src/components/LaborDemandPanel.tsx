import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CountryKey } from "@/lib/countryData";
import { aggregateForCountry } from "@/lib/jobMatching";

interface Props {
  country: CountryKey;
  sectorFilter?: string[];
}

export default function LaborDemandPanel({ country, sectorFilter }: Props) {
  const data = useMemo(() => aggregateForCountry(country, sectorFilter), [country, sectorFilter]);
  const maxSector = data.bySector[0]?.count || 1;

  if (data.total === 0) return null;

  const scopeLabel = data.isRegional ? data.regionName : country;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold">Labor demand signals from job data</h3>
        <p className="text-xs text-muted-foreground">
          Aggregated from a dataset of real roles in {scopeLabel} ({data.total} openings
          {sectorFilter && sectorFilter.length > 0 ? ` · filtered to ${sectorFilter.length} selected sector${sectorFilter.length === 1 ? "" : "s"}` : ""}).
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Sector breakdown */}
        <Card className="p-5">
          <h4 className="mb-3 text-sm font-semibold">Openings by sector</h4>
          <div className="space-y-2">
            {data.bySector.map(({ sector, count }) => (
              <div key={sector}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{sector}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(count / maxSector) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top roles */}
        <Card className="p-5">
          <h4 className="mb-3 text-sm font-semibold">Top high-demand roles</h4>
          {data.topRoles.length === 0 ? (
            <p className="text-xs text-muted-foreground">No high-demand roles in this scope.</p>
          ) : (
            <ul className="space-y-2">
              {data.topRoles.map(r => (
                <li key={r.role} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="font-medium">{r.role}</div>
                    <div className="text-xs text-muted-foreground">{r.sector}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-semibold">${r.avgIncome}</div>
                    <div className="text-[10px] text-muted-foreground">/month avg.</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <h4 className="mb-2 text-sm font-semibold">Informal economy share</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{data.informalPct}%</span>
            <span className="text-xs text-muted-foreground">of roles available informally</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Indicates how accessible the labor market is for youth without formal credentials.
          </p>
        </Card>

        <Card className="p-5">
          <h4 className="mb-3 text-sm font-semibold">Education required across roles</h4>
          <div className="space-y-1.5">
            {data.eduDist.map(e => (
              <div key={e.level} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{e.level}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-muted">
                    <div className="h-1.5 rounded-full bg-primary" style={{ width: `${e.pct}%` }} />
                  </div>
                  <Badge variant="secondary" className="min-w-[44px] justify-center text-[10px]">{e.pct}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
