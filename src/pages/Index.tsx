import { useState } from "react";
import { Button } from "@/components/ui/button";
import IntakeForm from "@/components/IntakeForm";
import LoadingScreen from "@/components/LoadingScreen";
import ResultsView from "@/components/ResultsView";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRY_DATA } from "@/lib/countryData";
import { DEMO_INTAKE } from "@/lib/demoData";
import type { IntakeData, Profile } from "@/lib/types";
import { toast } from "sonner";
import { Compass, Sparkles } from "lucide-react";

type Stage = "landing" | "form" | "loading" | "results";

const Index = () => {
  const [stage, setStage] = useState<Stage>("landing");
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

  const restart = () => { setStage("landing"); setProfile(null); setIntake(null); setIsDemo(false); setPrefill(undefined); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <button onClick={restart} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">UNMAPPED</span>
          </button>
          <span className="hidden text-xs text-muted-foreground sm:inline">World Bank hackathon</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {stage === "landing" && (
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <Sparkles className="h-3 w-3" /> Portable skills, real opportunities
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Closing the distance between real skills and economic opportunity.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              UNMAPPED maps your background — formal and informal — to international skill standards
              and shows you realistic local opportunities backed by labor-market data.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => { setPrefill(undefined); setStage("form"); }}>
                Build my profile
              </Button>
              <Button size="lg" variant="outline" onClick={() => generate(DEMO_INTAKE, true)}>
                See a demo — meet Amara
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Data sources: ILO ILOSTAT · World Bank WDI / STEP · ESCO · O*NET · Wittgenstein Centre
            </p>
          </div>
        )}

        {stage === "form" && (
          <IntakeForm initial={prefill} onSubmit={d => generate(d, false)} />
        )}

        {stage === "loading" && <LoadingScreen />}

        {stage === "results" && profile && intake && (
          <ResultsView intake={intake} profile={profile} isDemo={isDemo} onRestart={restart} />
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
          UNMAPPED · designed for low-bandwidth contexts · honest, grounded, plain language
        </div>
      </footer>
    </div>
  );
};

export default Index;
