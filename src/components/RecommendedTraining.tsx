import { Card } from "@/components/ui/card";
import type { TrainingRecommendation } from "@/lib/types";
import { Clock, MapPin, TrendingUp } from "lucide-react";

interface Props {
  items: TrainingRecommendation[];
}

export default function RecommendedTraining({ items }: Props) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold">Training that could help you grow</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on your current skills, here are areas where short training could open new doors.
        </p>
      </div>
      <div className="space-y-3">
        {items.map((t, i) => (
          <Card key={i} className="bg-muted/40 p-4 sm:p-5">
            <h4 className="text-sm font-semibold sm:text-base">{t.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed">{t.why}</p>
            <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span><span className="font-medium text-foreground">Duration:</span> {t.duration}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span><span className="font-medium text-foreground">Format:</span> {t.format}</span>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <span className="font-semibold text-primary">{t.impact}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
