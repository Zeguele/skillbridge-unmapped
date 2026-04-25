import { useEffect, useState } from "react";

const MESSAGES = [
  "Mapping to ILO ISCO-08 occupation codes…",
  "Cross-referencing ESCO multilingual taxonomy…",
  "Pulling real labor market signals from ILO ILOSTAT and World Bank WDI…",
  "Matching your skills to realistic local opportunities…",
  "Generating your portable profile…",
];

export default function LoadingScreen() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => Math.min(i + 1, MESSAGES.length - 1)), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <h2 className="mb-6 text-lg font-medium">Building your profile</h2>
      <ul className="w-full space-y-2 text-left">
        {MESSAGES.slice(0, idx + 1).map((m, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm transition-opacity ${i === idx ? "text-foreground" : "text-muted-foreground"}`}>
            <span className={`mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${i < idx ? "bg-primary" : "bg-primary animate-pulse"}`} />
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
