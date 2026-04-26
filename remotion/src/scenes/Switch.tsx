import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

const GHANA = [
  { title: "Mobile Phone Repair", wage: "600–800 GHS", growth: "+3.2%" },
  { title: "Junior Web Developer", wage: "1,800–2,400 GHS", growth: "+11.4%" },
];
const INDIA = [
  { title: "Mobile Service Technician", wage: "₹14,000–18,000 / mo", growth: "+5.8%" },
  { title: "Frontend Developer (Remote)", wage: "₹35,000–55,000 / mo", growth: "+14.7%" },
];

export default function Switch() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 0-40: Ghana side, 40-90 toggle animates, 90+ India revealed
  const switchPos = spring({ frame: frame - 30, fps, config: { damping: 18 } });
  const indiaIn = spring({ frame: frame - 70, fps, config: { damping: 22 } });
  const ghanaOut = interpolate(frame, [60, 90], [1, 0], { extrapolateRight: "clamp" });
  const narrate = spring({ frame: frame - 120, fps, config: { damping: 22 } });
  const fadeOut = interpolate(frame, [195, 210], [1, 0], { extrapolateRight: "clamp" });

  const cards = frame < 80 ? GHANA : INDIA;
  const isGhana = frame < 60;
  const flagGradient = isGhana
    ? "linear-gradient(180deg, #006B3F 0%, #006B3F 33%, #FCD116 33%, #FCD116 66%, #CE1126 66%)"
    : "linear-gradient(180deg, #FF9933 0%, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)";
  const flagCode = isGhana ? "GH" : "IN";
  const label = isGhana ? "Ghana — Accra" : "India — Bengaluru";

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "60px 120px",
      display: "flex", flexDirection: "column", gap: 28, opacity: fadeOut,
    }}>
      <div style={{ fontSize: 22, color: COLORS.muted, letterSpacing: 1.5, fontWeight: 600 }}>SAME PROFILE · DIFFERENT MARKET</div>

      {/* Country toggle */}
      <div style={{
        padding: 14, borderRadius: 999, background: COLORS.surface,
        border: `1.5px solid ${COLORS.border}`, display: "inline-flex", gap: 8,
        alignSelf: "flex-start", position: "relative", width: 520,
      }}>
        <div style={{
          position: "absolute", top: 8, bottom: 8,
          left: interpolate(switchPos, [0, 1], [10, 270]),
          width: 240, borderRadius: 999, background: COLORS.primary,
        }} />
        <div style={{ flex: 1, padding: "12px 18px", textAlign: "center", color: switchPos < 0.5 ? "#fff" : COLORS.ink, fontWeight: 600, fontSize: 22, position: "relative", zIndex: 1 }}>
          GH · Ghana
        </div>
        <div style={{ flex: 1, padding: "12px 18px", textAlign: "center", color: switchPos > 0.5 ? "#fff" : COLORS.ink, fontWeight: 600, fontSize: 22, position: "relative", zIndex: 1 }}>
          IN · India
        </div>
      </div>

      <div style={{ fontSize: 44, color: COLORS.ink, fontFamily: "DM Serif Display", marginTop: 4, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 10, background: flagGradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 18, fontWeight: 800, letterSpacing: 1,
          border: "1px solid rgba(0,0,0,0.1)",
          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        }}>{flagCode}</div>
        {label}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 8 }}>
        {cards.map((c, i) => {
          const reveal = spring({ frame: frame - 80 - i * 12, fps, config: { damping: 22 } });
          return (
            <div key={c.title + frame} style={{
              padding: 28, borderRadius: 20, background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 20px 40px -25px rgba(14,30,26,0.2)",
              opacity: frame < 70 ? ghanaOut : reveal,
              transform: frame >= 70 ? `translateY(${(1 - reveal) * 20}px)` : undefined,
            }}>
              <div style={{ fontSize: 26, color: COLORS.ink, fontWeight: 600 }}>{c.title}</div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, color: COLORS.muted, fontWeight: 600, letterSpacing: 1 }}>WAGE</div>
                  <div style={{ fontSize: 24, color: COLORS.ink, fontWeight: 700 }}>{c.wage}</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, color: COLORS.muted, fontWeight: 600, letterSpacing: 1 }}>GROWTH</div>
                  <div style={{ fontSize: 24, color: COLORS.primary, fontWeight: 700 }}>{c.growth}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: "auto", padding: "20px 28px", borderRadius: 16,
        background: COLORS.ink, color: COLORS.bg,
        fontSize: 26, fontFamily: "DM Serif Display", textAlign: "center",
        opacity: narrate, transform: `translateY(${(1 - narrate) * 12}px)`,
      }}>
        Same profile, different labor market = different opportunities.{" "}
        <span style={{ color: COLORS.accent }}>No code redeploy.</span>
      </div>
    </div>
  );
}
