import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  COUNTRIES, SELF_TAUGHT_SKILLS, LANGUAGES, EDUCATION_LEVELS,
  DIGITAL_SKILLS, type CountryKey,
} from "@/lib/countryData";
import type { IntakeData } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface Props {
  initial?: IntakeData;
  onSubmit: (data: IntakeData) => void;
}

const EMPTY: IntakeData = {
  name: "", country: "Ghana", languagePref: "English",
  education: "", fieldOfStudy: "", experience: "",
  selfTaughtSkills: [], languages: [], digitalLevel: "",
  digitalSkills: [], hasCertifications: false, certificationsDescription: "",
  other: "",
};

export default function IntakeForm({ initial, onSubmit }: Props) {
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IntakeData>(initial ?? EMPTY);

  const update = <K extends keyof IntakeData>(k: K, v: IntakeData[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const toggle = (key: "selfTaughtSkills" | "languages" | "digitalSkills", val: string) => {
    setData(d => {
      const arr = d[key];
      return { ...d, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const canNext =
    (step === 1 && data.country) ||
    (step === 2 && data.education) ||
    (step === 3) ||
    (step === 4);

  const next = () => step < 4 ? setStep(step + 1) : onSubmit(data);
  const back = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>{t("form.step")} {step} {t("form.of")} 4</span>
          <span>{[t("form.context"), t("form.education"), t("form.experience"), t("form.skills")][step-1]}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-2 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">{t("form.tellUs")}</h2>
            <div className="space-y-2">
              <Label>{t("form.name")}</Label>
              <Input value={data.name} onChange={e => update("name", e.target.value)} placeholder={t("form.namePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label>{t("form.country")}</Label>
              <Select value={data.country} onValueChange={v => update("country", v as CountryKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Your education</h2>
            <div className="space-y-2">
              <Label>Highest level completed</Label>
              <Select value={data.education} onValueChange={v => update("education", v)}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{EDUCATION_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Field of study (optional)</Label>
              <Input value={data.fieldOfStudy} onChange={e => update("fieldOfStudy", e.target.value)} placeholder="e.g. business, engineering" />
            </div>
            <div className="space-y-2">
              <Label>Do you have any formal certifications, licenses, or training courses?</Label>
              <p className="text-xs text-muted-foreground">
                This includes vocational certificates, online course completions, trade licenses, driving permits, first aid training, or anything with a certificate — even if it's not from a school.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: "Yes", val: true },
                  { label: "No", val: false },
                ].map(opt => {
                  const active = data.hasCertifications === opt.val;
                  return (
                    <button
                      type="button" key={opt.label}
                      onClick={() => update("hasCertifications", opt.val)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                      }`}
                    >{opt.label}</button>
                  );
                })}
              </div>
            </div>
            {data.hasCertifications && (
              <div className="space-y-2">
                <Label>Describe your certifications or training</Label>
                <Textarea
                  rows={3}
                  value={data.certificationsDescription}
                  onChange={e => update("certificationsDescription", e.target.value)}
                  placeholder="e.g. I completed a 3-month mobile phone repair course at a local training centre. I also have a motorcycle driving permit."
                />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Your experience</h2>
            <div className="space-y-2">
              <Label>Describe your work in a few sentences</Label>
              <Textarea
                rows={4}
                value={data.experience}
                onChange={e => update("experience", e.target.value)}
                placeholder="Paid work, business, family work — anything counts."
              />
            </div>
            <div className="space-y-2">
              <Label>Self-taught skills (tap any that apply)</Label>
              <div className="flex flex-wrap gap-2">
                {SELF_TAUGHT_SKILLS.map(s => {
                  const active = data.selfTaughtSkills.includes(s);
                  return (
                    <button
                      type="button" key={s}
                      onClick={() => toggle("selfTaughtSkills", s)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                      }`}
                    >{s}</button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Your skills</h2>
            <div className="space-y-2">
              <Label>Languages spoken</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => {
                  const active = data.languages.includes(l);
                  return (
                    <button
                      type="button" key={l}
                      onClick={() => toggle("languages", l)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                      }`}
                    >{l}</button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>What digital tools do you use?</Label>
              <p className="text-xs text-muted-foreground">
                Select all that apply — even if you learned on your own.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {DIGITAL_SKILLS.map(s => {
                  const active = data.digitalSkills.includes(s);
                  return (
                    <button
                      type="button" key={s}
                      onClick={() => toggle("digitalSkills", s)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                      }`}
                    >{s}</button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Anything else? Community roles, caregiving, leadership</Label>
              <Textarea rows={3} value={data.other} onChange={e => update("other", e.target.value)} />
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 1}>
            <ArrowLeft className="me-1 h-4 w-4" /> {t("form.back")}
          </Button>
          <Badge variant="secondary" className="hidden sm:inline-flex">{step}/4</Badge>
          <Button onClick={next} disabled={!canNext}>
            {step === 4 ? t("form.generate") : t("form.next")} <ArrowRight className="ms-1 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
