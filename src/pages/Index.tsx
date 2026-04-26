import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IntakeForm from "@/components/IntakeForm";
import PolicyIntakeForm from "@/components/PolicyIntakeForm";
import LoadingScreen from "@/components/LoadingScreen";
import ResultsView from "@/components/ResultsView";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRY_DATA } from "@/lib/countryData";
import { DEMO_INTAKE } from "@/lib/demoData";
import type { IntakeData, PolicyIntakeData, Profile } from "@/lib/types";
import type { CountryKey } from "@/lib/countryData";
import { toast } from "sonner";
import { Compass, ArrowLeft, UserRound, BarChart3, ArrowRight, Globe } from "lucide-react";
import { LANGUAGES, useLang, type LanguageCode } from "@/lib/i18n";

type Stage = "role" | "form" | "loading" | "results";
export type UserType = "job_seeker" | "policy_officer";

function policyToIntake(p: PolicyIntakeData, languagePref: string): IntakeData {
  // Synthesize a minimal IntakeData so downstream components that expect it
  // (LaborDemandPanel uses country, ResultsView reads intake.country) keep working.
  return {
    name: "",
    country: p.country,
    languagePref,
    education: "",
    fieldOfStudy: "",
    experience: "",
    selfTaughtSkills: [],
    languages: [],
    digitalLevel: "",
    digitalSkills: [],
    hasCertifications: false,
    certificationsDescription: "",
    other: "",
  };
}

const Index = () => {
  const { t, lang, setLang, option } = useLang();
  const [stage, setStage] = useState<Stage>("role");
  const [userType, setUserType] = useState<UserType>("job_seeker");
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [policyIntake, setPolicyIntake] = useState<PolicyIntakeData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [prefill, setPrefill] = useState<IntakeData | undefined>(undefined);

  async function generateJobSeeker(data: IntakeData, demo: boolean) {
    const enriched: IntakeData = { ...data, languagePref: option.promptName };
    setIntake(enriched);
    setPolicyIntake(null);
    setIsDemo(demo);
    setStage("loading");
    try {
      const { data: res, error } = await supabase.functions.invoke("generate-profile", {
        body: {
          mode: "job_seeker",
          intake: enriched,
          countryStats: COUNTRY_DATA[enriched.country],
          languagePromptName: option.promptName,
          languageCode: lang,
        },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      if (!res?.profile) throw new Error("No profile returned");
      const generated = res.profile as Profile;
      setProfile(generated);
      setStage("results");

      // Persist anonymized profile for Policymaker dashboard aggregates.
      // Skip the demo profile so demo runs don't pollute real data.
      if (!demo) {
        try {
          const matchScores = (generated.opportunities || []).map(o => o.matchScore || 0);
          const topMatchScore = matchScores.length ? Math.max(...matchScores) : null;
          const sectorsMatched = Array.from(new Set((generated.opportunities || []).map(o => o.title))).slice(0, 10);
          await supabase.from("profiles").insert({
            country: enriched.country,
            education_level: enriched.education,
            field_of_study: enriched.fieldOfStudy,
            experience: enriched.experience,
            self_taught: enriched.selfTaughtSkills || [],
            languages: enriched.languages || [],
            digital_level: enriched.digitalLevel,
            digital_skills: enriched.digitalSkills || [],
            has_certifications: !!enriched.hasCertifications,
            sectors_matched: sectorsMatched,
            top_match_score: topMatchScore,
          });
        } catch (persistErr) {
          // Non-fatal: aggregate persistence failure shouldn't block the user's results.
          console.warn("Profile persistence failed (non-fatal):", persistErr);
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate profile";
      toast.error(msg);
      setStage("form");
    }
  }

  async function generatePolicy(data: PolicyIntakeData) {
    const enriched: PolicyIntakeData = { ...data, languagePref: option.promptName };
    const synthIntake = policyToIntake(enriched, option.promptName);
    setIntake(synthIntake);
    setPolicyIntake(enriched);
    setIsDemo(false);
    setStage("loading");
    try {
      const { data: res, error } = await supabase.functions.invoke("generate-profile", {
        body: {
          mode: "policy",
          policyIntake: enriched,
          countryStats: COUNTRY_DATA[enriched.country],
          languagePromptName: option.promptName,
          languageCode: lang,
        },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      if (!res?.profile) throw new Error("No analysis returned");
      setProfile(res.profile as Profile);
      setStage("results");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate analysis";
      toast.error(msg);
      setStage("form");
    }
  }

  const restart = () => {
    setStage("role");
    setProfile(null);
    setIntake(null);
    setPolicyIntake(null);
    setIsDemo(false);
    setPrefill(undefined);
  };

  const pickRole = (type: UserType) => {
    setUserType(type);
    setPrefill(undefined);
    setStage("form");
  };

  const startDemo = () => {
    setUserType("job_seeker");
    generateJobSeeker(DEMO_INTAKE, true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={restart} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold tracking-tight">SKILL BRIDGE</span>
            </button>
            {stage === "results" && (
              <button
                onClick={restart}
                className="ms-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> {t("nav.changeRole")}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Select value={lang} onValueChange={(v) => setLang(v as LanguageCode)}>
              <SelectTrigger
                className="h-8 w-auto gap-1.5 rounded-full border-border bg-background px-3 text-xs font-medium"
                aria-label="Language"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold tracking-wide">{option.short}</span>
              </SelectTrigger>
              <SelectContent align="end">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    <span className="font-mono text-xs text-muted-foreground me-2">{l.short}</span>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="hidden text-xs text-muted-foreground sm:inline">{t("nav.hackathon")}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {stage === "role" && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Compass className="h-6 w-6" />
              </div>
              <div className="text-lg font-semibold tracking-tight">SKILL BRIDGE</div>
              <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("landing.who")}
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
                {t("landing.subtitle")}
              </p>
            </div>

            <div className="mx-auto mb-6 max-w-sm rounded-lg border border-border bg-muted/40 p-3">
              <label className="mb-1.5 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                {t("landing.languageLabel")}
              </label>
              <Select value={lang} onValueChange={(v) => setLang(v as LanguageCode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      <span className="font-mono text-xs text-muted-foreground me-2">{l.short}</span>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-center text-[11px] leading-snug text-muted-foreground">
                {t("landing.languageHint")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                onClick={() => pickRole("job_seeker")}
                className="group flex cursor-pointer flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">{t("landing.jobSeeker")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("landing.jobSeekerDesc")}
                </p>
                <div className="mt-6">
                  <Button className="w-full" onClick={(e) => { e.stopPropagation(); pickRole("job_seeker"); }}>
                    {t("landing.getStarted")} <ArrowRight className="ms-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card
                onClick={() => pickRole("policy_officer")}
                className="group flex cursor-pointer flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">{t("landing.policymaker")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("landing.policymakerDesc")}
                </p>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => { e.stopPropagation(); pickRole("policy_officer"); }}
                  >
                    {t("landing.exploreData")} <ArrowRight className="ms-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {t("landing.notSure")}
            </p>

            <div className="mt-8 text-center">
              <Button variant="ghost" size="sm" onClick={startDemo}>
                {t("landing.demo")}
              </Button>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t("landing.dataSources")}
            </p>
          </div>
        )}

        {stage === "form" && userType === "job_seeker" && (
          <IntakeForm initial={prefill} onSubmit={d => generateJobSeeker(d, false)} />
        )}

        {stage === "form" && userType === "policy_officer" && (
          <PolicyIntakeForm onSubmit={generatePolicy} />
        )}

        {stage === "loading" && <LoadingScreen />}

        {stage === "results" && profile && intake && (
          <ResultsView
            intake={intake}
            policyIntake={policyIntake ?? undefined}
            profile={profile}
            isDemo={isDemo}
            userType={userType}
            onRestart={restart}
          />
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
          {t("footer.tagline")}
        </div>
      </footer>
    </div>
  );
};

export default Index;
