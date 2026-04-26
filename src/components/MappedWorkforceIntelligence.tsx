import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { JOB_OPENINGS } from "@/data/jobs";
import type { CountryKey } from "@/lib/countryData";
import type { Profile } from "@/lib/types";

interface AggregatedRow {
  id: string;
  country: string;
  education_level: string | null;
  self_taught: string[];
  top_match_score: number | null;
  created_at: string;
}

const SKILL_TO_SECTORS: Record<string, string[]> = {
  "Basic coding": ["Creative & Digital", "ICT Services"],
  "Social media": ["Creative & Digital", "ICT Services"],
  "Accounting/bookkeeping": ["Retail & Sales", "ICT Services"],
  "Machine/device repair": ["Repair & Maintenance"],
  "Construction/building": ["Construction"],
  "Farming/agriculture": ["Agriculture"],
  "Food preparation": ["Hospitality"],
  "Sewing/tailoring": ["Personal Services", "Manufacturing"],
  "Healthcare/first aid": ["Personal Services"],
  "Customer service": ["Retail & Sales", "Hospitality"],
  "Teaching/tutoring": [],
  "Transport/driving": ["Transportation"],
};

const EDU_BUCKETS: Array<{ key: string; label: string; color: string; match: (e: string) => boolean }> = [
  { key: "none", label: "No formal", color: "#D85A30", match: (e) => /no formal/i.test(e) },
  { key: "primary", label: "Primary", color: "#EF9F27", match: (e) => /primary/i.test(e) },
  { key: "secondary", label: "Junior secondary", color: "#378ADD", match: (e) => /junior secondary/i.test(e) },
  { key: "senior", label: "Senior secondary", color: "#1D9E75", match: (e) => /senior secondary|high school/i.test(e) },
  { key: "voc", label: "Vocational/diploma+", color: "#7F77DD", match: (e) => /vocational|diploma|university|postgraduate|degree/i.test(e) },
];

interface Props {
  country: CountryKey;
  profile: Profile;
}

const SAMPLE_ROWS: AggregatedRow[] = [
  // Sample data so the dashboard never looks empty on a fresh deployment.
  // These will be ignored once real profiles exist.
];

export default function MappedWorkforceIntelligence({ country, profile }: Props) {
  const [rows, setRows] = useState<AggregatedRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, country, education_level, self_taught, top_match_score, created_at")
        .eq("country", country)
        .order("created_at", { ascending: true })
        .limit(5000);
      if (!active) return;
      if (error) {
        console.warn("Profiles fetch failed:", error.message);
        setRows([]);
      } else {
        setRows((data as AggregatedRow[]) || []);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [country]);

  const isEmpty = !loading && (!rows || rows.length === 0);
  const effectiveRows = isEmpty ? SAMPLE_ROWS : rows || [];

  // ---- Top metrics ----
  const metrics = useMemo(() => {
    const total = effectiveRows.length;
    const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const newThisWeek = effectiveRows.filter(r => new Date(r.created_at).getTime() >= oneWeekAgo).length;

    const unmappedCount = effectiveRows.filter(r => {
      const edu = (r.education_level || "").toLowerCase();
      const lowEdu = !/senior secondary|high school|vocational|diploma|university|postgraduate|degree/.test(edu);
      return lowEdu;
    }).length;
    const unmappedPct = total ? Math.round((unmappedCount / total) * 100) : 0;

    const matched = effectiveRows.filter(r => (r.top_match_score ?? 0) >= 70).length;
    const matchRate = total ? Math.round((matched / total) * 100) : 0;

    const skillSet = new Set<string>();
    const sectorSet = new Set<string>();
    effectiveRows.forEach(r => {
      (r.self_taught || []).forEach(s => {
        skillSet.add(s);
        (SKILL_TO_SECTORS[s] || []).forEach(sec => sectorSet.add(sec));
      });
    });

    return {
      total,
      newThisWeek,
      unmappedPct,
      matched,
      matchRate,
      uniqueSkills: skillSet.size,
      sectorCount: sectorSet.size,
    };
  }, [effectiveRows]);

  // ---- Top skills ----
  const topSkills = useMemo(() => {
    const counts = new Map<string, number>();
    effectiveRows.forEach(r => (r.self_taught || []).forEach(s => counts.set(s, (counts.get(s) || 0) + 1)));
    const sorted = [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6);
    const max = sorted[0]?.count || 1;
    const colors = ["#1D9E75", "#1D9E75", "#378ADD", "#378ADD", "#EF9F27", "#D85A30"];
    return sorted.map((s, i) => ({ ...s, pct: (s.count / max) * 100, color: colors[i] }));
  }, [effectiveRows]);

  // ---- Education distribution ----
  const eduDist = useMemo(() => {
    const counts = EDU_BUCKETS.map(b => ({ name: b.label, value: 0, color: b.color, key: b.key }));
    effectiveRows.forEach(r => {
      const edu = r.education_level || "";
      const bucket = EDU_BUCKETS.findIndex(b => b.match(edu));
      if (bucket >= 0) counts[bucket].value++;
    });
    const total = counts.reduce((a, b) => a + b.value, 0);
    return { data: counts.filter(c => c.value > 0), total };
  }, [effectiveRows]);

  // ---- Supply vs demand by sector ----
  const supplyDemand = useMemo(() => {
    const SECTORS = ["Agriculture","Construction","Creative & Digital","Hospitality","ICT Services","Manufacturing","Personal Services","Repair & Maintenance","Retail & Sales","Transportation"];
    const supply = new Map<string, number>();
    effectiveRows.forEach(r => {
      const userSectors = new Set<string>();
      (r.self_taught || []).forEach(s => (SKILL_TO_SECTORS[s] || []).forEach(sec => userSectors.add(sec)));
      userSectors.forEach(sec => supply.set(sec, (supply.get(sec) || 0) + 1));
    });
    const demand = new Map<string, number>();
    JOB_OPENINGS.filter(j => j.country === country).forEach(j => {
      demand.set(j.sector, (demand.get(j.sector) || 0) + 1);
    });
    const rowsOut = SECTORS.map(s => ({
      sector: s,
      supply: supply.get(s) || 0,
      demand: demand.get(s) || 0,
    })).filter(r => r.supply > 0 || r.demand > 0);
    const max = Math.max(1, ...rowsOut.map(r => Math.max(r.supply, r.demand)));
    return rowsOut.map(r => ({ ...r, supplyPct: (r.supply / max) * 100, demandPct: (r.demand / max) * 100 }));
  }, [effectiveRows, country]);

  // ---- Mapping over time (cumulative by month) ----
  const overTime = useMemo(() => {
    if (!effectiveRows.length) return [] as Array<{ month: string; total: number }>;
    const buckets = new Map<string, number>();
    effectiveRows.forEach(r => {
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    const sorted = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b));
    let running = 0;
    return sorted.map(([month, count]) => {
      running += count;
      return { month, total: running };
    });
  }, [effectiveRows]);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Youth skills mapping — live data</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Aggregated from Skill Bridge user profiles · {country}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[hsl(var(--signal-bg))] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1D9E75] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1D9E75]" />
          </span>
          Live
        </div>
      </div>

      {isEmpty && (
        <div className="mt-4 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-[12px] text-muted-foreground">
          Showing sample data — real numbers will appear as youth create profiles.
        </div>
      )}

      {/* Top metrics row */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricBox
          label="Total profiled"
          value={metrics.total.toLocaleString()}
          subtitle={
            metrics.newThisWeek > 0 ? (
              <span className="text-[#1D9E75]">+{metrics.newThisWeek} this week</span>
            ) : (
              <span>No new this week</span>
            )
          }
        />
        <MetricBox
          label="Previously unmapped"
          value={`${metrics.unmappedPct}%`}
          subtitle="No prior credentials"
        />
        <MetricBox
          label="Matched to jobs"
          value={metrics.matched.toLocaleString()}
          subtitle={`${metrics.matchRate}% match rate`}
        />
        <MetricBox
          label="Unique skills mapped"
          value={metrics.uniqueSkills.toLocaleString()}
          subtitle={`Across ${metrics.sectorCount} sectors`}
        />
      </div>

      {/* Two-column row: top skills + education */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <h4 className="mb-3 text-[13px] font-medium">Top skills discovered</h4>
          {topSkills.length === 0 ? (
            <EmptyHint text="No skills logged yet." />
          ) : (
            <div className="space-y-2">
              {topSkills.map(s => (
                <div key={s.name} className="flex items-center gap-3 text-[12px]">
                  <div className="w-[110px] shrink-0 truncate text-muted-foreground" title={s.name}>{s.name}</div>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-sm bg-muted">
                    <div className="h-full rounded-sm" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                  <div className="w-8 shrink-0 text-right tabular-nums text-muted-foreground">{s.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-3 text-[13px] font-medium">Education level distribution</h4>
          {eduDist.total === 0 ? (
            <EmptyHint text="No education data yet." />
          ) : (
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eduDist.data}
                    dataKey="value"
                    nameKey="name"
                    cx="40%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={1}
                  >
                    {eduDist.data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <RTooltip
                    formatter={(value: number, name: string) => {
                      const pct = Math.round((value / eduDist.total) * 100);
                      return [`${value} (${pct}%)`, name];
                    }}
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, lineHeight: "16px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Two-column row: supply/demand + over time */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <h4 className="mb-3 text-[13px] font-medium">Skills supply vs. job demand</h4>
          {supplyDemand.length === 0 ? (
            <EmptyHint text="Not enough data to compare yet." />
          ) : (
            <div className="space-y-3">
              {supplyDemand.map(r => {
                const surplusDemand = r.demand > r.supply;
                return (
                  <div key={r.sector}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="font-medium">{r.sector}</span>
                      <span
                        className="text-[11px]"
                        style={{ color: surplusDemand ? "#1D9E75" : "#EF9F27" }}
                      >
                        {surplusDemand ? "Surplus demand" : "Oversupply"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="relative h-2.5 overflow-hidden rounded-sm bg-muted">
                        <div className="h-full" style={{ width: `${r.supplyPct}%`, backgroundColor: "#1D9E75" }} />
                      </div>
                      <div className="relative h-2.5 overflow-hidden rounded-sm bg-muted">
                        <div className="h-full" style={{ width: `${r.demandPct}%`, backgroundColor: "#B5D4F4" }} />
                      </div>
                    </div>
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>Supply: {r.supply}</span>
                      <span>Demand: {r.demand}</span>
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: "#1D9E75" }} />
                  Profiled youth (supply)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: "#B5D4F4" }} />
                  Job openings (demand)
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-3 text-[13px] font-medium">Mapping progress over time</h4>
          {overTime.length === 0 ? (
            <EmptyHint text="Mapping data will appear here as profiles accumulate." />
          ) : (
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}`}
                  />
                  <RTooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }}
                    formatter={(v: number) => [`${v} profiles`, "Cumulative"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#1D9E75"
                    strokeWidth={2}
                    fill="rgba(29,158,117,0.1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bottom insight */}
      <MappingInsightBox text={profile.mappingInsight} />
    </Card>
  );
}

function MetricBox({ label, value, subtitle }: { label: string; value: string; subtitle: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius)] border border-border px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-6 text-center text-[12px] text-muted-foreground">{text}</div>
  );
}

function MappingInsightBox({ text }: { text?: string }) {
  const [open, setOpen] = useState(false);
  if (!text || !text.trim()) return null;
  const trimmed = text.trim();
  const match = trimmed.match(/^[\s\S]*?[.!?](?:\s|$)/);
  const first = match ? match[0].trim() : trimmed;
  const rest = trimmed.slice(first.length).trim();
  const hasMore = rest.length > 0;
  return (
    <div className="mt-6 rounded-[var(--radius)] px-4 py-3" style={{ background: "hsl(var(--signal-bg))" }}>
      <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
        What this data tells us
      </div>
      <p className="text-[13px] leading-[1.55] text-muted-foreground">{first}</p>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[13px] leading-[1.55] text-muted-foreground">{rest}</p>
        </div>
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="mt-2 cursor-pointer text-[13px] font-medium text-primary hover:underline"
        >
          {open ? "Show less ↑" : "Read more →"}
        </button>
      )}
    </div>
  );
}
