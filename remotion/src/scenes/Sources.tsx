import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

export default function Sources() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = spring({ frame, fps, config: { damping: 24 } });
  const scale = interpolate(zoom, [0, 1], [0.9, 1.05]);
  const fadeOut = interpolate(frame, [135, 150], [1, 0], { extrapolateRight: "clamp" });

  const callouts = [
    { y: 40, label: "Wage source", value: "ILOSTAT 2024 · Series EAR_4MTH_SEX_OCU_NB_A", at: 30 },
    { y: 220, label: "Growth source", value: "World Bank WDI · NV.IND.MANF.KD.ZG", at: 60 },
    { y: 400, label: "Data freshness", value: "Last sync 2 days ago · auto-refresh weekly", at: 90 },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "60px 120px",
      display: "flex", gap: 60, opacity: fadeOut,
      alignItems: "center",
    }}>
      <div style={{
        flex: "0 0 720px", padding: 36, borderRadius: 24,
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        boxShadow: "0 40px 80px -30px rgba(14,30,26,0.25)",
        transform: `scale(${scale})`,
      }}>
        <div style={{ fontSize: 22, color: COLORS.muted, fontWeight: 600 }}>OPPORTUNITY · ACCRA</div>
        <div style={{ fontSize: 36, color: COLORS.ink, fontWeight: 700, marginTop: 8, fontFamily: "DM Serif Display" }}>
          Mobile Phone Repair Technician
        </div>

        <div style={{ marginTop: 28, padding: 20, borderRadius: 14, background: `${COLORS.accent}1a`, border: `2px solid ${COLORS.accent}` }}>
          <div style={{ fontSize: 14, color: COLORS.muted, fontWeight: 600, letterSpacing: 1 }}>WAGE RANGE</div>
          <div style={{ fontSize: 28, color: COLORS.ink, fontWeight: 700, marginTop: 4 }}>600 – 800 GHS / week</div>
          <div style={{ fontSize: 14, color: COLORS.primary, marginTop: 4, fontWeight: 600 }}>← ILOSTAT 2024</div>
        </div>

        <div style={{ marginTop: 18, padding: 20, borderRadius: 14, background: `${COLORS.accent}1a`, border: `2px solid ${COLORS.accent}` }}>
          <div style={{ fontSize: 14, color: COLORS.muted, fontWeight: 600, letterSpacing: 1 }}>SECTOR GROWTH</div>
          <div style={{ fontSize: 28, color: COLORS.primary, fontWeight: 700, marginTop: 4 }}>+3.2% YoY</div>
          <div style={{ fontSize: 14, color: COLORS.primary, marginTop: 4, fontWeight: 600 }}>← World Bank WDI</div>
        </div>

        <div style={{
          marginTop: 24, paddingTop: 18, borderTop: `1px dashed ${COLORS.border}`,
          display: "flex", justifyContent: "space-between",
          fontSize: 14, color: COLORS.muted,
        }}>
          <span>Sources: ILOSTAT · World Bank WDI · ESCO</span>
          <span>Sync: 2d ago</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28, position: "relative" }}>
        {callouts.map((c) => {
          const r = spring({ frame: frame - c.at, fps, config: { damping: 22 } });
          return (
            <div key={c.label} style={{
              padding: "18px 24px", borderRadius: 14,
              background: COLORS.ink, color: COLORS.bg,
              fontSize: 22, lineHeight: 1.4,
              opacity: r, transform: `translateX(${(1 - r) * -30}px)`,
              boxShadow: "0 20px 40px -20px rgba(0,0,0,0.4)",
            }}>
              <div style={{ color: COLORS.accent, fontSize: 14, fontWeight: 700, letterSpacing: 1.5 }}>{c.label.toUpperCase()}</div>
              <div style={{ marginTop: 4 }}>{c.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
