import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

export default function Context() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 22 } });
  const select = frame > 40;
  const loadStart = 70;
  const loadProgress = interpolate(frame, [loadStart, 145], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [140, 150], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "80px 120px",
      display: "flex", flexDirection: "column", gap: 28, opacity: fadeOut,
    }}>
      <div style={{ fontSize: 22, color: COLORS.muted, letterSpacing: 1.5, fontWeight: 600 }}>STEP 3 · CHOOSE YOUR LABOR MARKET</div>
      <div style={{ fontSize: 56, color: COLORS.ink, fontFamily: "DM Serif Display", letterSpacing: -1 }}>
        Where do you want to look?
      </div>

      <div style={{
        padding: 36, borderRadius: 24, background: COLORS.surface,
        border: `1.5px solid ${select ? COLORS.primary : COLORS.border}`,
        boxShadow: select ? `0 0 0 6px ${COLORS.primary}22` : "0 30px 60px -30px rgba(14,30,26,0.18)",
        transform: `translateY(${(1 - card) * 20}px)`, opacity: card,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            background: `linear-gradient(180deg, #006B3F 0%, #006B3F 33%, #FCD116 33%, #FCD116 66%, #CE1126 66%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: 1,
            border: "1px solid rgba(0,0,0,0.1)",
          }}>GH</div>
          <div>
            <div style={{ fontSize: 32, color: COLORS.ink, fontWeight: 600 }}>Ghana — Accra</div>
            <div style={{ fontSize: 22, color: COLORS.muted, marginTop: 4 }}>Urban Informal Economy</div>
          </div>
        </div>
        <div style={{ fontSize: 28, color: select ? COLORS.primary : COLORS.muted }}>✓</div>
      </div>

      {frame > loadStart && (
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 22, color: COLORS.ink2 }}>
            Matching skills to live ILOSTAT, World Bank WDI & ESCO data…
          </div>
          <div style={{ height: 8, borderRadius: 999, background: COLORS.surface, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
            <div style={{
              width: `${loadProgress}%`, height: "100%",
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
              borderRadius: 999,
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
