import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

const CARDS = [
  {
    title: "Mobile Phone Repair Technician",
    sector: "Repair & Maintenance",
    wage: "600 – 800 GHS / week",
    wageUsd: "~ USD 100 – 130",
    wageSrc: "ILOSTAT 2024",
    growth: "+3.2% YoY",
    growthSrc: "World Bank WDI",
    match: 96,
  },
  {
    title: "Junior Web Developer (Remote)",
    sector: "Creative & Digital",
    wage: "1,800 – 2,400 GHS / week",
    wageUsd: "~ USD 300 – 400",
    wageSrc: "ILOSTAT 2024",
    growth: "+11.4% YoY",
    growthSrc: "World Bank WDI",
    match: 78,
  },
  {
    title: "Electronics Retail Assistant",
    sector: "Retail & Sales",
    wage: "450 – 600 GHS / week",
    wageUsd: "~ USD 75 – 100",
    wageSrc: "ILOSTAT 2024",
    growth: "+1.8% YoY",
    growthSrc: "World Bank WDI",
    match: 71,
  },
];

export default function Opportunities() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeOut = interpolate(frame, [465, 480], [1, 0], { extrapolateRight: "clamp" });

  // Highlight pulses
  const wagePulse = frame > 180 && frame < 260;
  const growthPulse = frame > 270 && frame < 360;
  const narrate = spring({ frame: frame - 360, fps, config: { damping: 22 } });

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "60px 100px",
      display: "flex", flexDirection: "column", gap: 24, opacity: fadeOut,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 22, color: COLORS.muted, letterSpacing: 1.5, fontWeight: 600 }}>OPPORTUNITIES IN ACCRA · GHANA</div>
          <div style={{ fontSize: 52, color: COLORS.ink, fontFamily: "DM Serif Display", letterSpacing: -1, marginTop: 4 }}>
            Matched to your skills
          </div>
        </div>
        <div style={{ fontSize: 22, color: COLORS.muted }}>3 of 27 matches shown</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
        {CARDS.map((c, i) => {
          const reveal = spring({ frame: frame - 10 - i * 18, fps, config: { damping: 22 } });
          const isFirst = i === 0;
          return (
            <div key={c.title} style={{
              padding: 32, borderRadius: 22, background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 20px 40px -25px rgba(14,30,26,0.2)",
              opacity: reveal, transform: `translateX(${(1 - reveal) * 30}px)`,
              display: "flex", alignItems: "center", gap: 28,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: 16,
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDeep})`,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, fontWeight: 700, fontFamily: "DM Serif Display",
              }}>{c.match}</div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 28, color: COLORS.ink, fontWeight: 600 }}>{c.title}</div>
                <div style={{ fontSize: 20, color: COLORS.muted }}>{c.sector} · Match {c.match}%</div>
              </div>

              <div style={{
                minWidth: 320, padding: 16, borderRadius: 14,
                background: isFirst && wagePulse ? `${COLORS.accent}22` : COLORS.bg,
                border: `2px solid ${isFirst && wagePulse ? COLORS.accent : "transparent"}`,
                transition: "none",
              }}>
                <div style={{ fontSize: 16, color: COLORS.muted, letterSpacing: 1, fontWeight: 600 }}>WAGE RANGE</div>
                <div style={{ fontSize: 24, color: COLORS.ink, fontWeight: 700, marginTop: 4 }}>{c.wage}</div>
                <div style={{ fontSize: 18, color: COLORS.ink2 }}>{c.wageUsd}</div>
                <div style={{ fontSize: 14, color: COLORS.primary, marginTop: 4, fontWeight: 600 }}>{c.wageSrc}</div>
              </div>

              <div style={{
                minWidth: 220, padding: 16, borderRadius: 14,
                background: isFirst && growthPulse ? `${COLORS.accent}22` : COLORS.bg,
                border: `2px solid ${isFirst && growthPulse ? COLORS.accent : "transparent"}`,
              }}>
                <div style={{ fontSize: 16, color: COLORS.muted, letterSpacing: 1, fontWeight: 600 }}>SECTOR GROWTH</div>
                <div style={{ fontSize: 24, color: COLORS.primary, fontWeight: 700, marginTop: 4 }}>{c.growth}</div>
                <div style={{ fontSize: 14, color: COLORS.primary, marginTop: 4, fontWeight: 600 }}>{c.growthSrc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: "auto", padding: "22px 32px", borderRadius: 18,
        background: COLORS.ink, color: COLORS.bg,
        fontSize: 28, fontFamily: "DM Serif Display",
        opacity: narrate, transform: `translateY(${(1 - narrate) * 16}px)`,
        textAlign: "center",
      }}>
        “Every number comes from real data.”
      </div>
    </div>
  );
}
