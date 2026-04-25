import { Card } from "@/components/ui/card";
import type { CountryStats } from "@/lib/countryData";

interface Props { stats: CountryStats; country: string; }

const Metric = ({ label, value, source }: { label: string; value: string; source: string }) => (
  <Card className="bg-[hsl(var(--metric-bg))] p-4">
    <div className="text-xs font-medium text-muted-foreground">{label}</div>
    <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">Source: {source}</div>
  </Card>
);

export default function MetricsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Metric label="Youth unemployment" value={`${stats.youthUnemployment}%`} source="ILO ILOSTAT" />
      <Metric label="Informal economy" value={`${stats.informalEconomy}%`} source="ILO ILOSTAT" />
      <Metric label="GDP growth" value={`${stats.gdpGrowth}%`} source="World Bank WDI" />
      <Metric label="Wage floor" value={`$${stats.wageFloor}/hr`} source="ILO ILOSTAT" />
    </div>
  );
}
