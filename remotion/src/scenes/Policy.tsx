import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

const HEAT_ROWS = ["Repair", "Digital", "Retail", "Agri", "Construction"];
const HEAT_COLS = ["Accra", "Kumasi", "Tamale", "Cape Coast"];
const HEAT = [
  [9, 7, 4, 5],
  [8, 6, 3, 4],
  [7, 6, 5, 6],
  [4, 5, 8, 6],
  [6, 7, 5, 7],
];

const TREND = [55, 58, 62, 66, 65, 70, 76, 82, 88, 92];

export default function Policy() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 22 } });
  const fadeOut = interpolate(frame, [78, 90], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", inset: 0, padding: "50px 90px",
      display: "flex", flexDirection: "column", gap: 18, opacity: fadeOut,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, color: COLORS.muted, letterSpacing: 1.5, fontWeight: 600 }}>POLICYMAKER VIEW · GHANA</div>
          <div style={{ fontSize: 46, color: COLORS.ink, fontFamily: "DM Serif Display" }}>Workforce intelligence</div>
        </div>
        <div style={{ display: "flex", padding: 8, borderRadius: 999, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <div style={{ padding: "10px 22px", color: COLORS.muted, fontSize: 18 }}>Job Seeker</div>
          <div style={{ padding: "10px 22px", borderRadius: 999, background: COLORS.primary, color: "#fff", fontSize: 18, fontWeight: 600 }}>Policymaker</div>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 20, flex: 1,
        opacity: card, transform: `translateY(${(1 - card) * 16}px)`,
      }}>
        {/* Heatmap */}
        <div style={{ padding: 22, borderRadius: 18, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.ink }}>Skill density · region</div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: `120px repeat(${HEAT_COLS.length}, 1fr)`, gap: 6 }}>
            <div />
            {HEAT_COLS.map((c) => <div key={c} style={{ fontSize: 14, color: COLORS.muted, textAlign: "center" }}>{c}</div>)}
            {HEAT_ROWS.map((r, ri) => (
              <>
                <div key={r} style={{ fontSize: 14, color: COLORS.ink2, alignSelf: "center" }}>{r}</div>
                {HEAT[ri].map((v, ci) => (
                  <div key={ci} style={{
                    aspectRatio: "1", borderRadius: 6,
                    background: `rgba(29,158,117,${0.12 + (v / 9) * 0.78})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: v > 6 ? "#fff" : COLORS.ink, fontSize: 14, fontWeight: 600,
                  }}>{v}</div>
                ))}
              </>
            ))}
          </div>
        </div>

        {/* Wage trend */}
        <div style={{ padding: 22, borderRadius: 18, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.ink }}>Wage trend · weekly</div>
          <div style={{ marginTop: 24, height: 200, display: "flex", alignItems: "flex-end", gap: 8 }}>
            {TREND.map((v, i) => {
              const grow = spring({ frame: frame - 10 - i * 3, fps, config: { damping: 22 } });
              return (
                <div key={i} style={{
                  flex: 1, height: `${v * grow}%`,
                  background: `linear-gradient(180deg, ${COLORS.primary}, ${COLORS.primaryDeep})`,
                  borderRadius: 4,
                }} />
              );
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: COLORS.muted }}>2014 → 2024 · ILOSTAT</div>
        </div>

        {/* Sectors table */}
        <div style={{ padding: 22, borderRadius: 18, background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.ink }}>Sector growth</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { s: "Digital", g: "+11.4%", c: COLORS.primary },
              { s: "Construction", g: "+5.6%", c: COLORS.blue },
              { s: "Repair", g: "+3.2%", c: COLORS.purple },
              { s: "Agriculture", g: "+2.1%", c: COLORS.accent },
            ].map((row, i) => {
              const r = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 22 } });
              return (
                <div key={row.s} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 14px", borderRadius: 10, background: COLORS.bg,
                  opacity: r, transform: `translateX(${(1 - r) * 10}px)`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 24, borderRadius: 4, background: row.c }} />
                    <span style={{ fontSize: 16, color: COLORS.ink }}>{row.s}</span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 700, color: row.c }}>{row.g}</span>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 14, padding: 14, borderRadius: 12,
            background: `${COLORS.accent}1a`, border: `1px solid ${COLORS.accent}55`,
            fontSize: 14, color: COLORS.ink,
          }}>
            <strong style={{ color: COLORS.accent }}>Insight:</strong> Digital outpaces all sectors — invest in last-mile training.
          </div>
        </div>
      </div>
    </div>
  );
}
