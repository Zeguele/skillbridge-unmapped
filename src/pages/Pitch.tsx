import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Compass,
  Download,
  Layers,
  Link2,
  Network,
  QrCode,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

/**
 * Skill Bridge — Hackathon pitch deck.
 * Standalone full-viewport slide deck at /pitch. Dark theme, teal accent.
 */

const ACCENT = "#14B8A6"; // teal
const ACCENT_SOFT = "rgba(20,184,166,0.12)";
const BG = "#0A1628"; // deep navy

type SlideProps = { active: boolean };

const SlideShell: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <div
    className={`absolute inset-0 flex items-center justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-500 ${
      active ? "opacity-100" : "pointer-events-none opacity-0"
    }`}
  >
    <div
      key={active ? "in" : "out"}
      className={`w-full max-w-6xl ${active ? "animate-[slideIn_0.6s_ease-out_both]" : ""}`}
    >
      {children}
    </div>
  </div>
);

const SectionTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-widest"
    style={{ borderColor: ACCENT, color: ACCENT, background: ACCENT_SOFT }}
  >
    <Sparkles className="h-3 w-3" />
    {children}
  </div>
);

/* ---------- Slide 1: Title ---------- */
const Slide1: React.FC<SlideProps> = ({ active }) => (
  <SlideShell active={active}>
    <div className="flex flex-col items-center text-center">
      {/* Animated bridge logo */}
      <div className="relative mb-10 h-28 w-72">
        <div
          className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ background: ACCENT, boxShadow: `0 0 30px ${ACCENT}` }}
        />
        <div
          className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ background: ACCENT, boxShadow: `0 0 30px ${ACCENT}` }}
        />
        <svg viewBox="0 0 280 100" className="absolute inset-0 h-full w-full">
          <path
            d="M 14 50 Q 140 -10 266 50"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2.5"
            strokeDasharray="600"
            strokeDashoffset="600"
            style={{ animation: active ? "drawBridge 1.6s ease-out 0.2s forwards" : "none" }}
          />
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((t) => {
            const x = 14 + (266 - 14) * t;
            const y = 50 - 60 * t * (1 - t) * 4 * 0.5;
            return (
              <line
                key={t}
                x1={x}
                y1={y}
                x2={x}
                y2="50"
                stroke={ACCENT}
                strokeOpacity="0.5"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>

      <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white">
        Skill <span style={{ color: ACCENT }}>Bridge</span>
      </h1>
      <p className="mt-6 text-xl sm:text-2xl text-slate-300">Portable Skills, Real Opportunities</p>
      <p className="mt-10 text-sm uppercase tracking-[0.3em] text-slate-500">
        Hack-Nation · Built in 8 hours
      </p>
    </div>
  </SlideShell>
);

/* ---------- Slide 2: Problem ---------- */
const Slide2: React.FC<SlideProps> = ({ active }) => (
  <SlideShell active={active}>
    <div>
      <SectionTag>The Problem</SectionTag>
      <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
        Skills don't travel. Opportunity doesn't either.
      </h2>
      <p className="mt-4 max-w-3xl text-lg text-slate-400">
        When workers switch jobs, industries, or countries, what they actually know gets lost in
        translation. The bridge between proven ability and the labor market is broken.
      </p>

      <div className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
          <div className="text-xs uppercase tracking-widest text-slate-500">Your Skills</div>
          <div className="mt-3 text-2xl font-semibold text-white">Real, learned, proven</div>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>• Repaired phones for 5 years</li>
            <li>• Self-taught coding</li>
            <li>• 3 languages spoken</li>
            <li>• Informal apprenticeships</li>
          </ul>
        </div>

        {/* Broken bridge */}
        <div className="flex items-center justify-center px-2">
          <svg viewBox="0 0 120 60" className="h-20 w-32">
            <path d="M 0 30 Q 30 5 50 28" fill="none" stroke={ACCENT} strokeWidth="3" />
            <path d="M 70 28 Q 90 5 120 30" fill="none" stroke={ACCENT} strokeWidth="3" />
            <path
              d="M 50 28 L 55 38 L 50 48"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 70 28 L 65 38 L 70 48"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
          <div className="text-xs uppercase tracking-widest text-slate-500">Job Market</div>
          <div className="mt-3 text-2xl font-semibold text-white">Wants formal credentials</div>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>• Degrees & certifications</li>
            <li>• ISCO / O*NET codes</li>
            <li>• "Years of experience" filters</li>
            <li>• Recognized employers</li>
          </ul>
        </div>
      </div>
    </div>
  </SlideShell>
);

/* ---------- Slide 3: Solution ---------- */
const Slide3: React.FC<SlideProps> = ({ active }) => {
  const steps = [
    { icon: Target, title: "Assess", desc: "Capture informal & self-taught skills via voice or form." },
    { icon: Network, title: "Map", desc: "Translate to ISCO-08, ESCO, and proficiency levels." },
    { icon: Link2, title: "Match", desc: "Surface opportunities in the local labor market." },
  ];
  return (
    <SlideShell active={active}>
      <div>
        <SectionTag>Our Solution</SectionTag>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
          We make skills portable across contexts.
        </h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-400">
          Skill Bridge translates lived experience into the language of the global labor market — so
          one profile unlocks opportunities anywhere.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-slate-700 bg-slate-900/60 p-6"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: ACCENT_SOFT, color: ACCENT }}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 text-xs uppercase tracking-widest text-slate-500">
                Step {i + 1}
              </div>
              <div className="mt-1 text-2xl font-semibold text-white">{s.title}</div>
              <p className="mt-3 text-slate-400">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight
                  className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 md:block"
                  style={{ color: ACCENT }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
};

/* ---------- Slide 4: How It Works ---------- */
const Slide4: React.FC<SlideProps> = ({ active }) => (
  <SlideShell active={active}>
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
      <div>
        <SectionTag>How It Works</SectionTag>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
          From a 2-minute intake to a real match.
        </h2>
        <ul className="mt-8 space-y-4 text-lg">
          {[
            "Skill verification from informal & self-taught experience",
            "Cross-industry mapping using ISCO-08 and ESCO frameworks",
            "Country-aware matching with live wage and demand signals",
            "Employer-ready profiles in seconds",
          ].map((b) => (
            <li key={b} className="flex items-start gap-3 text-slate-300">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0" style={{ color: ACCENT }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mock UI card */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="ml-2">skillbridge.app</span>
          </div>
          <span className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
            Live
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: ACCENT }}
          >
            A
          </div>
          <div>
            <div className="text-lg font-semibold text-white">Amara · Mobile Phone Repairer</div>
            <div className="text-sm text-slate-400">ISCO-08 · 7412 · Accra, Ghana</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { label: "Electronics troubleshooting", level: 88 },
            { label: "Customer communication", level: 76 },
            { label: "Self-taught coding (HTML/JS)", level: 62 },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm text-slate-300">
                <span>{s.label}</span>
                <span style={{ color: ACCENT }}>{s.level}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.level}%`, background: ACCENT }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 flex items-center justify-between rounded-xl p-4"
          style={{ background: ACCENT_SOFT }}
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-300">Top Match</div>
            <div className="text-lg font-semibold text-white">Electronics Service Technician</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" style={{ color: ACCENT }}>
              92%
            </div>
            <div className="text-xs text-slate-400">match score</div>
          </div>
        </div>
      </div>
    </div>
  </SlideShell>
);

/* ---------- Slide 5: Market ---------- */
const Slide5: React.FC<SlideProps> = ({ active }) => {
  const stats = [
    { num: "1.8B", label: "workers globally lack recognized credentials" },
    { num: "$360B", label: "annual upskilling & reskilling market" },
    { num: "72%", label: "of employers struggle to find skilled workers" },
  ];
  return (
    <SlideShell active={active}>
      <div>
        <SectionTag>Market Opportunity</SectionTag>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
          A massive, urgent, global gap.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8 text-center"
            >
              <div
                className="text-6xl sm:text-7xl font-bold"
                style={{ color: ACCENT }}
              >
                {s.num}
              </div>
              <p className="mt-4 text-slate-300">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          Sources: ILO ILOSTAT · World Bank WDI · McKinsey Global Institute (illustrative)
        </p>
      </div>
    </SlideShell>
  );
};

/* ---------- Slide 6: Traction / Demo ---------- */
const Slide6: React.FC<SlideProps> = ({ active }) => (
  <SlideShell active={active}>
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]">
      <div>
        <SectionTag>Live Demo</SectionTag>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
          It's already live. Try it now.
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Built end-to-end at <span className="font-semibold text-white">Hack-Nation</span> in just{" "}
          <span className="font-semibold text-white">8 hours</span> — including a job-seeker flow, a
          policymaker dashboard, and a rendered demo video.
        </p>
        <div
          className="mt-8 inline-flex items-center gap-3 rounded-xl border px-5 py-3 font-mono text-lg text-white"
          style={{ borderColor: ACCENT, background: ACCENT_SOFT }}
        >
          skillbridge-unmapped.lovable.app
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://skillbridge-unmapped.lovable.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-slate-900 transition-transform hover:scale-105"
            style={{ background: ACCENT }}
          >
            Try it live <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://skillbridge-unmapped.lovable.app/demo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white hover:border-slate-400"
          >
            Watch Amara demo
          </a>
        </div>
      </div>

      {/* QR placeholder */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-44 w-44 items-center justify-center rounded-2xl bg-white"
          aria-label="QR code placeholder"
        >
          <QrCode className="h-32 w-32 text-slate-900" />
        </div>
        <div className="mt-3 text-xs uppercase tracking-widest text-slate-500">Scan to open</div>
      </div>
    </div>
  </SlideShell>
);

/* ---------- Slide 7: Team ---------- */
const Slide7: React.FC<SlideProps> = ({ active }) => {
  const team = [
    { name: "Team Member", role: "Product & Design" },
    { name: "Team Member", role: "Engineering" },
    { name: "Team Member", role: "Data & Research" },
    { name: "Team Member", role: "Strategy" },
  ];
  return (
    <SlideShell active={active}>
      <div>
        <SectionTag>The Team</SectionTag>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">Built by people who've lived it.</h2>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {team.map((t, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-slate-700 bg-slate-900/60 p-6 text-center"
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ background: ACCENT_SOFT, color: ACCENT }}
              >
                <Users className="h-10 w-10" />
              </div>
              <div className="mt-4 text-lg font-semibold text-white">{t.name}</div>
              <div className="text-sm text-slate-400">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
};

/* ---------- Slide 8: Ask / CTA ---------- */
const Slide8: React.FC<SlideProps> = ({ active }) => (
  <SlideShell active={active}>
    <div className="text-center">
      <Compass className="mx-auto h-14 w-14" style={{ color: ACCENT }} />
      <h2 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-bold text-white">
        Let's <span style={{ color: ACCENT }}>bridge</span> the skills gap together.
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
        Partner with us. Invest. Or join the beta. Wherever you stand, there's a role in turning
        invisible skills into real opportunity.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a
          href="mailto:hello@skillbridge.app"
          className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold text-slate-900 transition-transform hover:scale-105"
          style={{ background: ACCENT }}
        >
          Partner with us <ArrowRight className="h-5 w-5" />
        </a>
        <a
          href="https://skillbridge-unmapped.lovable.app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-4 text-lg font-semibold text-white hover:border-slate-400"
        >
          Join the beta
        </a>
      </div>
      <div className="mt-12 flex flex-col items-center gap-1 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" /> hello@skillbridge.app
        </div>
        <div>skillbridge-unmapped.lovable.app</div>
      </div>
    </div>
  </SlideShell>
);

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8];

const Pitch = () => {
  const [i, setI] = useState(0);
  const total = SLIDES.length;

  const go = useCallback(
    (n: number) => setI((c) => Math.max(0, Math.min(total - 1, typeof n === "function" ? (n as any)(c) : n))),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setI((c) => Math.min(total - 1, c + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setI((c) => Math.max(0, c - 1));
      } else if (e.key === "Home") {
        setI(0);
      } else if (e.key === "End") {
        setI(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div
      className="pitch-root relative h-screen w-screen overflow-hidden font-sans text-white"
      style={{ background: BG, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Inline keyframes + print styles */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawBridge {
          to { stroke-dashoffset: 0; }
        }
        .pitch-print-tree { display: none; }
        @media print {
          @page { size: 13.333in 7.5in; margin: 0; }
          html, body { background: ${BG} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
          body * { visibility: hidden; }
          .pitch-print-tree, .pitch-print-tree * { visibility: visible; }
          .pitch-print-tree {
            display: block !important;
            position: absolute; left: 0; top: 0; width: 100%;
            background: ${BG};
          }
          .pitch-print-slide {
            width: 13.333in;
            height: 7.5in;
            page-break-after: always;
            break-after: page;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.6in 0.9in;
            background: ${BG};
            color: white;
            box-sizing: border-box;
            overflow: hidden;
          }
          .pitch-print-slide:last-child { page-break-after: auto; }
          .pitch-print-slide > div { width: 100%; max-width: 11.5in; }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[40rem] w-[40rem] rounded-full opacity-20 blur-3xl"
        style={{ background: ACCENT }}
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full opacity-10 blur-3xl"
        style={{ background: ACCENT }}
      />

      {/* Progress bar */}
      <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/5">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${((i + 1) / total) * 100}%`, background: ACCENT }}
        />
      </div>

      {/* Brand */}
      <div className="absolute left-6 top-5 z-20 flex items-center gap-2 text-sm font-semibold tracking-wide">
        <Compass className="h-4 w-4" style={{ color: ACCENT }} />
        Skill Bridge
      </div>

      {/* Download PDF */}
      <button
        onClick={handleDownloadPdf}
        className="absolute right-6 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/10"
        aria-label="Download deck as PDF"
        title="Opens print dialog — choose 'Save as PDF'"
      >
        <Download className="h-4 w-4" />
        Download PDF
      </button>

      {/* Slides */}
      <div className="relative h-full w-full">
        {SLIDES.map((S, idx) => (
          <S key={idx} active={idx === i} />
        ))}
      </div>

      {/* Nav arrows */}
      <button
        aria-label="Previous slide"
        onClick={() => go(i - 1)}
        disabled={i === 0}
        className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go(i + 1)}
        disabled={i === total - 1}
        className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-white/10 disabled:opacity-30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Counter + dots */}
      <div className="absolute inset-x-0 bottom-5 z-20 flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => go(idx)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: idx === i ? 24 : 8,
                background: idx === i ? ACCENT : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
        <div className="text-xs tracking-widest text-slate-400">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* Print-only tree: every slide as its own page */}
      <div className="pitch-print-tree" aria-hidden="true">
        {SLIDES.map((S, idx) => (
          <section key={`p-${idx}`} className="pitch-print-slide">
            <S active={true} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default Pitch;
