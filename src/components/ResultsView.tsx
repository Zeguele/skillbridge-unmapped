import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COUNTRY_DATA } from "@/lib/countryData";
import type { IntakeData, Profile } from "@/lib/types";
import MetricsGrid from "./MetricsGrid";
import OpportunityCard from "./OpportunityCard";
import SkillRow from "./SkillRow";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  intake: IntakeData;
  profile: Profile;
  isDemo?: boolean;
  onRestart: () => void;
}

const initials = (name: string) =>
  (name?.trim() || "Y N").split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join("");

const portColor = (p: Profile["portability"]) =>
  p === "High" ? "bg-primary text-primary-foreground"
    : p === "Medium" ? "bg-[hsl(var(--info))] text-white"
    : "bg-muted text-foreground";

function copyAsText(intake: IntakeData, profile: Profile) {
  const lines = [
    `UNMAPPED Profile — ${intake.name || "Anonymous"} (${intake.country})`,
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

export default function ResultsView({ intake, profile, isDemo, onRestart }: Props) {
  const [view, setView] = useState<"my" | "policy">("my");
  const stats = COUNTRY_DATA[intake.country];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {isDemo && (
        <div className="flex items-start gap-2 rounded-lg border border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--warning))]" />
          <span>This is a demo — meet Amara, the person this tool was built for.</span>
        </div>
      )}

      {/* View toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-border p-1">
          {(["my","policy"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >{v === "my" ? "My view" : "Policymaker view"}</button>
          ))}
        </div>
      </div>

      {view === "my" ? (
        <>
          {/* Profile card */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                {initials(intake.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold">{intake.name || "Your profile"}</h2>
                <p className="text-sm text-muted-foreground">{intake.country} · {new Date().toLocaleDateString()}</p>
                <p className="mt-3 text-sm leading-relaxed">{profile.summary}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge className="bg-[hsl(var(--info))] text-white hover:bg-[hsl(var(--info))]">ISCO-08 · {profile.isco.code} · {profile.isco.title}</Badge>
              <Badge className="bg-primary text-primary-foreground hover:bg-primary">ESCO · {profile.esco.label}</Badge>
              <Badge className="bg-[hsl(var(--warning))] text-white hover:bg-[hsl(var(--warning))]">O*NET · {profile.onet.code} · {profile.onet.title}</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              These are international standards. Any employer or training program that uses them can verify your skills across borders.
            </p>
          </Card>

          {/* Skills */}
          <Card className="p-5 sm:p-6">
            <h3 className="mb-2 text-base font-semibold">Your skills</h3>
            <div className="-mt-1">
              {profile.skills.map((s, i) => <SkillRow key={i} skill={s} />)}
            </div>
          </Card>

          {/* Portability */}
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Portability rating:</span>
              <Badge className={portColor(profile.portability)}>{profile.portability}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{profile.portabilityReason}</p>
          </Card>

          {/* Metrics */}
          <div>
            <h3 className="mb-3 text-base font-semibold">{intake.country} — labor market context</h3>
            <MetricsGrid stats={stats} country={intake.country} />
          </div>

          {/* Opportunities */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Realistic opportunities</h3>
            {profile.opportunities.map((o, i) => <OpportunityCard key={i} op={o} />)}
          </div>

          {/* Signals */}
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signal 1 · ILO ILOSTAT</div>
              <p className="text-sm">{profile.signal1}</p>
            </Card>
            <Card className="p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signal 2 · World Bank STEP / ILO task indices</div>
              <p className="text-sm">{profile.signal2}</p>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => copyAsText(intake, profile)}>
              <Copy className="mr-2 h-4 w-4" /> Copy profile as plain text
            </Button>
            <Button variant="ghost" onClick={onRestart}>
              <RefreshCw className="mr-2 h-4 w-4" /> Start over
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-secondary p-3 text-sm">
            Aggregate view for program officers — {intake.country}.
          </div>

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
            <Card className="p-5">
              <h4 className="mb-2 text-sm font-semibold">Skills gap diagnosis</h4>
              <p className="text-sm text-muted-foreground">{profile.policySkillsGap}</p>
            </Card>
            <Card className="p-5">
              <h4 className="mb-2 text-sm font-semibold">Recommended interventions</h4>
              <p className="text-sm text-muted-foreground">{profile.policyInterventions}</p>
            </Card>
            <Card className="p-5">
              <h4 className="mb-2 text-sm font-semibold">Data limitations</h4>
              <p className="text-sm text-muted-foreground">{profile.policyDataLimits}</p>
            </Card>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Card className="p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signal 1 · ILO ILOSTAT</div>
              <p className="text-sm">{profile.signal1}</p>
            </Card>
            <Card className="p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signal 2 · World Bank STEP / ILO</div>
              <p className="text-sm">{profile.signal2}</p>
            </Card>
            <Card className="p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signal 3 · Wittgenstein Centre 2025–2035</div>
              <p className="text-sm">{profile.wittgensteinSignal}</p>
            </Card>
          </div>

          <div className="flex justify-center pt-2">
            <Button variant="ghost" onClick={onRestart}>
              <RefreshCw className="mr-2 h-4 w-4" /> Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
