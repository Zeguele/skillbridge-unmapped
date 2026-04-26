import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

const SKILLS = [
  { name: "Mobile device repair", level: 92, tag: "5 yrs experience" },
  { name: "Customer service", level: 80, tag: "Self-taught" },
  { name: "Bookkeeping (small business)", level: 65, tag: "Self-taught" },
  { name: "Basic web coding (HTML/CSS/JS)", level: 55, tag: "YouTube · self-taught" },
];

export default function Profile() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 22 } });
  const fadeOut = interpolate(frame, [255, 270], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "60px 120px",
      display: "flex", flexDirection: "column", gap: 22, opacity: fadeOut,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 22, color: COLORS.muted, letterSpacing: 1.5, fontWeight: 600 }}>SKILLS PROFILE · AMARA</div>
          <div style={{ fontSize: 54, color: COLORS.ink, fontFamily: "DM Serif Display", letterSpacing: -1, marginTop: 6 }}>
            Your verified skills profile
          </div>
        </div>
        <div style={{
          padding: "12px 22px", borderRadius: 999,
          background: `${COLORS.primary}1a`, color: COLORS.primaryDeep,
          fontSize: 22, fontWeight: 600, opacity: spring({ frame: frame - 18, fps, config: { damping: 20 } }),
        }}>
          ISCO-08 · 7412 — Electrical Mechanics
        </div>
      </div>

      <div style={{
        padding: 44, borderRadius: 24, background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 30px 60px -30px rgba(14,30,26,0.18)",
        transform: `translateY(${(1 - card) * 30}px)`, opacity: card,
        display: "flex", flexDirection: "column", gap: 26,
      }}>
        {SKILLS.map((s, i) => {
          const reveal = spring({ frame: frame - 25 - i * 12, fps, config: { damping: 22 } });
          const fillStart = 30 + i * 12;
          const fill = interpolate(frame, [fillStart, fillStart + 35], [0, s.level], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div key={s.name} style={{ opacity: reveal, transform: `translateX(${(1 - reveal) * 20}px)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 26, color: COLORS.ink, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 20, color: COLORS.muted }}>{s.tag} · <span style={{ color: COLORS.primary, fontWeight: 600 }}>{Math.round(fill)}%</span></div>
              </div>
              <div style={{ height: 12, borderRadius: 999, background: COLORS.bg, overflow: "hidden" }}>
                <div style={{
                  width: `${fill}%`, height: "100%",
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDeep})`,
                  borderRadius: 999,
                }} />
              </div>
            </div>
          );
        })}

        <div style={{
          marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap",
          opacity: spring({ frame: frame - 130, fps, config: { damping: 22 } }),
        }}>
          {["English", "Twi", "French"].map((l) => (
            <div key={l} style={{
              padding: "10px 20px", borderRadius: 999,
              border: `1.5px solid ${COLORS.border}`, background: COLORS.bg,
              fontSize: 20, color: COLORS.ink2, fontWeight: 500,
            }}>🌐 {l}</div>
          ))}
        </div>

        <div style={{
          marginTop: 8, padding: 22, borderRadius: 16,
          background: `${COLORS.accent}14`, border: `1px solid ${COLORS.accent}55`,
          fontSize: 22, color: COLORS.ink, lineHeight: 1.5,
          opacity: spring({ frame: frame - 160, fps, config: { damping: 22 } }),
        }}>
          <span style={{ color: COLORS.accent, fontWeight: 700 }}>Portability:</span>{" "}
          These skills are recognized across Sub-Saharan Africa, South Asia, and the Gulf labor markets — mapped to ISCO-08 7412 and ESCO competencies.
        </div>
      </div>
    </div>
  );
}
