import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

export default function Intro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const sub = spring({ frame: frame - 18, fps, config: { damping: 22 } });
  const out = interpolate(frame, [70, 90], [1, 0.92], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [78, 90], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex",
      alignItems: "center", justifyContent: "center", flexDirection: "column",
      background: `radial-gradient(circle at 30% 40%, ${COLORS.primary}22, transparent 60%), ${COLORS.bg}`,
      opacity: fadeOut,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 22,
        transform: `scale(${0.8 + s * 0.2}) scale(${out})`,
        opacity: s,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDeep})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 38, fontWeight: 700, fontFamily: "DM Serif Display",
        }}>S</div>
        <div style={{ fontSize: 84, fontWeight: 700, color: COLORS.ink, letterSpacing: -2, fontFamily: "DM Serif Display" }}>
          SkillBridge
        </div>
      </div>
      <div style={{
        marginTop: 36, fontSize: 30, color: COLORS.ink2, maxWidth: 1100, textAlign: "center",
        opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`,
      }}>
        Mapping informal skills into opportunities. <span style={{ color: COLORS.primary, fontWeight: 600 }}>Meet Amara.</span>
      </div>
    </div>
  );
}
