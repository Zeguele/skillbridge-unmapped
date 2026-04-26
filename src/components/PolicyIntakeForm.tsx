import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  COUNTRIES,
  POLICY_SEGMENTS,
  POLICY_SECTORS,
  POLICY_PRIORITIES,
  type CountryKey,
} from "@/lib/countryData";
import type { PolicyIntakeData } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface Props {
  initial?: PolicyIntakeData;
  onSubmit: (data: PolicyIntakeData) => void;
}

const EMPTY: PolicyIntakeData = {
  country: "Ghana",
  segments: [],
  sectors: [],
  priority: "",
  additionalObjective: "",
  languagePref: "English",
};

export default function PolicyIntakeForm({ initial, onSubmit }: Props) {
  const [data, setData] = useState<PolicyIntakeData>(initial ?? EMPTY);

  const update = <K extends keyof PolicyIntakeData>(k: K, v: PolicyIntakeData[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const toggleMulti = (key: "segments" | "sectors", val: string) => {
    setData(d => {
      const arr = d[key];
      return { ...d, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const canSubmit = !!data.country && data.segments.length > 0 && !!data.priority;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Configure your analysis</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Select a country and target population to explore labor market signals,
          skills gaps, and intervention opportunities.
        </p>
      </div>

      <Card className="space-y-6 p-6 sm:p-8">
        {/* Country */}
        <div className="space-y-2">
          <Label>Country or region to analyze</Label>
          <Select value={data.country} onValueChange={v => update("country", v as CountryKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Segments */}
        <div className="space-y-2">
          <Label>Who are you designing programs for?</Label>
          <p className="text-xs text-muted-foreground">Select all that apply.</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {POLICY_SEGMENTS.map(s => {
              const active = data.segments.includes(s);
              return (
                <button
                  type="button" key={s}
                  onClick={() => toggleMulti("segments", s)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                  }`}
                >{s}</button>
              );
            })}
          </div>
        </div>

        {/* Sectors */}
        <div className="space-y-2">
          <Label>Which sectors are you focused on?</Label>
          <p className="text-xs text-muted-foreground">Select all that apply, or leave blank to see all sectors.</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {POLICY_SECTORS.map(s => {
              const active = data.sectors.includes(s);
              return (
                <button
                  type="button" key={s}
                  onClick={() => toggleMulti("sectors", s)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                  }`}
                >{s}</button>
              );
            })}
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>What is your primary objective?</Label>
          <div className="flex flex-wrap gap-2 pt-1">
            {POLICY_PRIORITIES.map(p => {
              const active = data.priority === p;
              return (
                <button
                  type="button" key={p}
                  onClick={() => update("priority", p)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
                  }`}
                >{p}</button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={() => onSubmit(data)} disabled={!canSubmit}>
            Generate analysis <ArrowRight className="ms-1 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
