import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES, COUNTRY_DATA, type CountryKey } from "@/lib/countryData";
import type { IntakeData, PolicyIntakeData, Profile } from "@/lib/types";
import { toSecondPerson } from "@/lib/voice";
import MetricsGrid from "./MetricsGrid";
import OpportunityCard from "./OpportunityCard";
import SkillRow from "./SkillRow";
import JobsNearYou from "./JobsNearYou";
import LaborDemandPanel from "./LaborDemandPanel";
import RecommendedTraining from "./RecommendedTraining";
import SectorGrowthChart from "./SectorGrowthChart";
import MappedWorkforceIntelligence from "./MappedWorkforceIntelligence";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, AlertTriangle, Printer, Loader2 } from "lucide-react";

interface Props {
  intake: IntakeData;
  policyIntake?: PolicyIntakeData;
  profile: Profile;
  isDemo?: boolean;
  userType?: "job_seeker" | "policy_officer";
  onRestart: () => void;
  onCountryChange?: (country: CountryKey) => void;
  isReloading?: boolean;
}

const initials = (name: string) =>
  (name?.trim() || "Y N").split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join("");

function copyAsText(intake: IntakeData, profile: Profile) {
  const lines = [
    `Skill Bridge Profile — ${intake.name || "Anonymous"} (${intake.country})`,
    `Date: ${new Date().toLocaleDateString()}`,
    "",
    `Summary: ${profile.summary}`,
    "",
    `ISCO-08: ${profile.isco.code} — ${profile.isco.title}`,
    `ESCO: ${profile.esco.label}`,
    `O*NET: ${profile.onet.code} — ${profile.onet.title}`,
    "",
    `Portability: ${profile.portability} — ${profile.portabilityReason}`,
    "",
    "Skills:",
    ...profile.skills.map(s => `  • ${s.name} (${s.type}, resilience ${s.resilience}%) — ${s.description}`),
    "",
    "Opportunities:",
    ...profile.opportunities.map(o =>
      `  • ${o.title} [${o.type}] ${o.wageRange} — match ${o.matchScore}%\n    ${o.description}`,
    ),
    "",
    `Signal 1 (ILO ILOSTAT): ${profile.signal1}`,
    `Signal 2 (World Bank STEP / ILO): ${profile.signal2}`,
  ].join("\n");
  navigator.clipboard.writeText(lines);
  toast.success("Profile copied to clipboard");
}

export default function ResultsView({ intake, policyIntake, profile, isDemo, userType = "job_seeker", onRestart, onCountryChange, isReloading }: Props) {
  const view: "my" | "policy" = userType === "policy_officer" ? "policy" : "my";
  const stats = COUNTRY_DATA[intake.country];

  // Defensive sanitization: ensure youth-facing text is always in second person.
  const youth = useMemo(() => {
    const name = intake.name;
    return {
      summary: toSecondPerson(profile.summary, name),
      portabilityReason: toSecondPerson(profile.portabilityReason, name),
      skills: profile.skills.map(s => ({ ...s, description: toSecondPerson(s.description, name) })),
      opportunities: profile.opportunities.map(o => ({ ...o, description: toSecondPerson(o.description, name) })),
    };
  }, [profile, intake.name]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {isDemo && (
        <div className="flex items-start gap-2 rounded-lg border border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--warning))]" />
          <span>This is a demo — meet Amara, the person this tool was built for.</span>
        </div>
      )}

      {view === "my" ? (
        <>
          {/* Personal greeting */}
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight">
              Hi {intake.name?.trim() ? intake.name.trim().split(/\s+/)[0] : "there"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here's what your skills say about you — and what's out there for you.
            </p>
          </div>

          {/* Profile card */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                {initials(intake.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold">{intake.name || "Your profile"}</h2>
                <p className="text-sm text-muted-foreground">{intake.country} · {new Date().toLocaleDateString()}</p>
                <p className="mt-3 text-sm leading-relaxed">{youth.summary}</p>
              </div>
            </div>
            <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
              Your skills are mapped to international standards — any employer or program that uses these systems can verify them.
            </p>
          </Card>

          {/* Skills */}
          <Card className="p-5 sm:p-6">
            <h3 className="mb-3 text-base font-semibold">Your skills</h3>

            {/* Color legend */}
            <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 rounded-md bg-muted/50 p-3 text-xs">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--skill-durable))]" />
                <span>Strong skill — you're ready to use this</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--skill-developing))]" />
                <span>Growing skill — you're building this</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--skill-informal))]" />
                <span>Life skill — you learned this outside school or work</span>
              </span>
            </div>

            <p className="mb-2 text-xs text-muted-foreground">
              "How future-proof is this skill" shows how likely it is to stay valuable as technology changes.
            </p>

            <div className="-mt-1">
              {youth.skills.map((s, i) => <SkillRow key={i} skill={s} />)}
            </div>

            {/* Portability — simplified */}
            <div className="mt-5 rounded-md bg-accent p-4 text-sm">
              Your skills can travel with you. This profile is mapped to standards used in 150+ countries — so if you move or apply elsewhere, your experience still counts.
            </div>
          </Card>

          {/* Opportunities */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Your career opportunities</h3>
            {youth.opportunities.map((o, i) => <OpportunityCard key={i} op={o} />)}
          </div>

          {/* Real job openings from dataset */}
          <JobsNearYou intake={intake} />

          {/* Recommended training */}
          <RecommendedTraining items={profile.recommendedTraining ?? []} />

          <div className="no-print flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => copyAsText(intake, profile)}>
              <Copy className="mr-2 h-4 w-4" /> Copy profile as plain text
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print report
            </Button>
            <Button variant="ghost" onClick={onRestart}>
              <RefreshCw className="mr-2 h-4 w-4" /> Start over
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Policy analysis summary */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h2 className="text-xl font-semibold">
                    Policy analysis —
                  </h2>
                  {onCountryChange ? (
                    <Select
                      value={intake.country}
                      onValueChange={(v) => onCountryChange(v as CountryKey)}
                      disabled={isReloading}
                    >
                      <SelectTrigger
                        className="no-print h-8 w-auto gap-1.5 rounded-md border-border bg-background px-2.5 text-base font-semibold"
                        aria-label="Select country"
                      >
                        <SelectValue />
                        {isReloading && <Loader2 className="ml-1 h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                      </SelectTrigger>
                      <SelectContent align="start">
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xl font-semibold">{intake.country}</span>
                  )}
                  {/* Print-only static label for the country */}
                  <span className="hidden text-xl font-semibold print:inline">{intake.country}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()} · aggregate signals for program officers and policymakers
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="no-print flex-shrink-0"
              >
                <Printer className="mr-2 h-4 w-4" /> Print report
              </Button>
            </div>

            {policyIntake && (
              <div className="mt-4 space-y-3">
                {policyIntake.segments.length > 0 && (
                  <div>
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Population segments
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {policyIntake.segments.map(s => (
                        <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {policyIntake.sectors.length > 0 && (
                  <div>
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sectors of interest
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {policyIntake.sectors.map(s => (
                        <Badge key={s} className="bg-primary/10 text-primary hover:bg-primary/10 font-normal">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {policyIntake.priority && (
                  <div>
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Primary objective
                    </div>
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                      {policyIntake.priority}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
              You are viewing aggregate signals for this profile type. To see the youth-facing version, start over and select Job Seeker on the home page.
            </p>
          </Card>

          <MetricsGrid stats={stats} country={intake.country} />

          <Card className="p-5">
            <h3 className="mb-2 text-sm font-semibold">High-growth sectors</h3>
            <div className="flex flex-wrap gap-2">
              {stats.sectors.map(s => (
                <Badge key={s} className="bg-primary/10 text-primary hover:bg-primary/10">{s}</Badge>
              ))}
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-3">
            <ExpandableAnalysisCard
              title="Skills gap diagnosis"
              summary={profile.policySkillsGapSummary}
              full={profile.policySkillsGap}
            />
            <ExpandableAnalysisCard
              title="Recommended interventions"
              summary={profile.policyInterventionsSummary}
              full={profile.policyInterventions}
            />
            <ExpandableAnalysisCard
              title="Data limitations"
              summary={profile.policyDataLimitsSummary}
              full={profile.policyDataLimits}
            />
          </div>

          <div className="pt-3">
            <h3 className="mb-4 text-sm font-medium">Econometric signals</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <ExpandableSignalCard
                label="Signal 1 · ILO ILOSTAT"
                text={profile.signal1}
              />
              <ExpandableSignalCard
                label="Signal 2 · World Bank STEP / ILO"
                text={profile.signal2}
              />
              <ExpandableSignalCard
                label="Signal 3 · Wittgenstein Centre 2025–2035"
                text={profile.wittgensteinSignal}
              />
            </div>
          </div>

          {/* NEW: Sector employment growth chart */}
          <SectorGrowthChart
            country={intake.country}
            selectedSectors={policyIntake?.sectors || []}
            profile={profile}
          />

          {/* NEW: Aggregate workforce intelligence from real profiles */}
          <MappedWorkforceIntelligence country={intake.country} profile={profile} />

          {/* Aggregate labor demand from dataset, filtered to selected sectors when present */}
          <LaborDemandPanel
            country={intake.country}
            sectorFilter={policyIntake?.sectors}
          />

          <div className="no-print flex justify-center pt-2">
            <Button variant="ghost" onClick={onRestart}>
              <RefreshCw className="mr-2 h-4 w-4" /> Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ExpandableAnalysisCard({ title, summary, full }: { title: string; summary?: string; full: string }) {
  const [open, setOpen] = useState(false);
  const hasSummary = !!(summary && summary.trim());
  const fullTrimmed = (full || "").trim();
  const summaryTrimmed = (summary || "").trim();
  const showToggle = hasSummary && fullTrimmed && fullTrimmed !== summaryTrimmed;
  const displaySummary = hasSummary ? summaryTrimmed : fullTrimmed;
  return (
    <Card className="px-5 py-4">
      <h4 className="mb-2 text-sm font-medium">{title}</h4>
      <p className="text-[13px] leading-[1.55] text-muted-foreground">{displaySummary}</p>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border pt-3">
            <p className="text-[13px] leading-[1.55] text-muted-foreground">{fullTrimmed}</p>
          </div>
        </div>
      </div>
      {showToggle && (
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="mt-3 cursor-pointer text-[13px] font-medium text-primary hover:underline"
        >
          {open ? "Show less ↑" : "Read full analysis →"}
        </button>
      )}
    </Card>
  );
}

function ExpandableSignalCard({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const trimmed = (text || "").trim();
  const match = trimmed.match(/^[\s\S]*?[.!?](?:\s|$)/);
  const firstSentence = match ? match[0].trim() : trimmed;
  const rest = trimmed.slice(firstSentence.length).trim();
  const hasMore = rest.length > 0;
  return (
    <Card className="border-0 bg-[hsl(var(--signal-bg))] px-5 py-4 shadow-none">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">{label}</div>
      <p className="text-[13px] leading-[1.55] text-muted-foreground">{firstSentence}</p>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border pt-3">
            <p className="text-[13px] leading-[1.55] text-muted-foreground">{rest}</p>
          </div>
        </div>
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="mt-3 cursor-pointer text-[13px] font-medium text-primary hover:underline"
        >
          {open ? "Show less ↑" : "Read more →"}
        </button>
      )}
    </Card>
  );
}

