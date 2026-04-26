import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

const FIELDS = [
  { label: "Education", value: "Senior secondary / high school", typeStart: 10 },
  { label: "Experience", value: "Repaired phones for 5 years. Self-taught coding from YouTube.", typeStart: 70 },
  { label: "Languages", value: "English · Twi · French", typeStart: 150 },
];

function typed(text: string, frame: number, start: number, perChar = 1.3) {
  const n = Math.max(0, Math.floor((frame - start) / perChar));
  return text.slice(0, Math.min(text.length, n));
}

export default function Intake() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 22 } });
  const btnPress = frame > 200 && frame < 215;
  const btnGlow = spring({ frame: frame - 195, fps, config: { damping: 18 } });

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "70px 120px",
      display: "flex", flexDirection: "column", gap: 28,
      opacity: interpolate(frame, [225, 240], [1, 0], { extrapolateRight: "clamp" }),
    }}>
      <div style={{ fontSize: 22, color: COLORS.muted, letterSpacing: 1.5, fontWeight: 600 }}>STEP 2 / 4 · YOUR INFORMATION</div>
      <div style={{ fontSize: 56, color: COLORS.ink, fontFamily: "DM Serif Display", letterSpacing: -1 }}>
        Tell us about your work
      </div>

      <div style={{
        marginTop: 12, padding: 48, borderRadius: 24, background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 30px 60px -30px rgba(14,30,26,0.18)",
        transform: `translateY(${(1 - card) * 30}px)`, opacity: card,
        display: "flex", flexDirection: "column", gap: 30,
      }}>
        {FIELDS.map((f) => (
          <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 20, color: COLORS.ink2, fontWeight: 600 }}>{f.label}</div>
            <div style={{
              padding: "20px 24px", borderRadius: 14,
              border: `1.5px solid ${frame > f.typeStart && frame < f.typeStart + 80 ? COLORS.primary : COLORS.border}`,
              background: COLORS.bg, fontSize: 26, color: COLORS.ink, minHeight: 36,
            }}>
              {typed(f.value, frame, f.typeStart)}
              {frame > f.typeStart && frame < f.typeStart + (f.value.length * 1.3) && (
                <span style={{ borderRight: `2px solid ${COLORS.primary}`, marginLeft: 2 }}>&nbsp;</span>
              )}
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <div style={{
            padding: "20px 36px", borderRadius: 14,
            background: COLORS.primary, color: "#fff",
            fontSize: 24, fontWeight: 600,
            transform: `scale(${btnPress ? 0.96 : 1})`,
            boxShadow: `0 ${10 + btnGlow * 20}px ${20 + btnGlow * 30}px -10px ${COLORS.primary}66`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            Generate Profile
            <span style={{ fontSize: 22 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
