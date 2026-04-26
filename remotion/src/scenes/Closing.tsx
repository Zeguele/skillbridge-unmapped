import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

export default function Closing() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 150 } });
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(circle at 50% 50%, ${COLORS.primary}22, transparent 60%), ${COLORS.ink}`,
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18,
      color: COLORS.bg,
    }}>
      <div style={{
        fontSize: 64, fontFamily: "DM Serif Display", letterSpacing: -1,
        opacity: s, transform: `scale(${0.9 + s * 0.1})`,
      }}>
        SkillBridge
      </div>
      <div style={{ fontSize: 30, color: COLORS.accent, opacity: s }}>
        Skills Visibility → Economic Opportunity
      </div>
      <div style={{ fontSize: 18, color: COLORS.muted, marginTop: 12, opacity: s }}>
        Modules 1 & 3 · UNMAPPED Challenge
      </div>
    </div>
  );
}
