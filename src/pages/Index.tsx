import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import IntakeForm from "@/components/IntakeForm";
import LoadingScreen from "@/components/LoadingScreen";
import ResultsView from "@/components/ResultsView";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRY_DATA } from "@/lib/countryData";
import { DEMO_INTAKE } from "@/lib/demoData";
import type { IntakeData, Profile } from "@/lib/types";
import { toast } from "sonner";
import { Compass, ArrowLeft, UserRound, BarChart3, ArrowRight } from "lucide-react";

type Stage = "role" | "form" | "loading" | "results";
export type UserType = "job_seeker" | "policy_officer";

const Index = () => {
  const [stage, setStage] = useState<Stage>("role");
  const [userType, setUserType] = useState<UserType>("job_seeker");
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [prefill, setPrefill] = useState<IntakeData | undefined>(undefined);

  async function generate(data: IntakeData, demo: boolean) {
    setIntake(data);
    setIsDemo(demo);
    setStage("loading");
    try {
      const { data: res, error } = await supabase.functions.invoke("generate-profile", {
        body: { intake: data, countryStats: COUNTRY_DATA[data.country] },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      if (!res?.profile) throw new Error("No profile returned");
      setProfile(res.profile as Profile);
      setStage("results");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate profile";
      toast.error(msg);
      setStage("form");
    }
  }

  const restart = () => {
    setStage("role");
    setProfile(null);
    setIntake(null);
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
    generate(DEMO_INTAKE, true);
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
                className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> Change role
              </button>
            )}
          </div>
          <span className="hidden text-xs text-muted-foreground sm:inline">World Bank hackathon</span>
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
                Who are you?
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
                Skill Bridge works differently depending on who you are. Pick the option that fits you best.
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
                <h2 className="text-lg font-semibold">Job Seeker</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  I'm looking for work. Find out what your skills are worth, discover career paths that match
                  your experience, and see real job openings near you.
                </p>
                <div className="mt-6">
                  <Button className="w-full" onClick={(e) => { e.stopPropagation(); pickRole("job_seeker"); }}>
                    Get started <ArrowRight className="ml-1 h-4 w-4" />
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
                <h2 className="text-lg font-semibold">Program Officer / Policymaker</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Analyze labor market signals, assess skills gaps, evaluate intervention strategies, and explore
                  workforce data across regions to inform policy decisions and program design.
                </p>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => { e.stopPropagation(); pickRole("policy_officer"); }}
                  >
                    Explore data <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Not sure? Most people choose Job Seeker.
            </p>

            <div className="mt-8 text-center">
              <Button variant="ghost" size="sm" onClick={startDemo}>
                Or see a demo — meet Amara
              </Button>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              Data sources: ILO ILOSTAT · World Bank WDI / STEP · ESCO · O*NET · Wittgenstein Centre
            </p>
          </div>
        )}

        {stage === "form" && (
          <IntakeForm initial={prefill} onSubmit={d => generate(d, false)} />
        )}

        {stage === "loading" && <LoadingScreen />}

        {stage === "results" && profile && intake && (
          <ResultsView
            intake={intake}
            profile={profile}
            isDemo={isDemo}
            userType={userType}
            onRestart={restart}
          />
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
          Skill Bridge · designed for low-bandwidth contexts · honest, grounded, plain language
        </div>
      </footer>
    </div>
  );
};

export default Index;
