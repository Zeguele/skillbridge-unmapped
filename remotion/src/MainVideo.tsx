import { AbsoluteFill, Series } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadDM } from "@remotion/google-fonts/DMSerifDisplay";
import { COLORS } from "./theme";
import Intro from "./scenes/Intro";
import Intake from "./scenes/Intake";
import Profile from "./scenes/Profile";
import Context from "./scenes/Context";
import Opportunities from "./scenes/Opportunities";
import Sources from "./scenes/Sources";
import Switch from "./scenes/Switch";
import Policy from "./scenes/Policy";
import Closing from "./scenes/Closing";

loadInter();
loadDM();

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: "Inter" }}>
      <Series>
        <Series.Sequence durationInFrames={90}><Intro /></Series.Sequence>
        <Series.Sequence durationInFrames={240}><Intake /></Series.Sequence>
        <Series.Sequence durationInFrames={270}><Profile /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><Context /></Series.Sequence>
        <Series.Sequence durationInFrames={480}><Opportunities /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><Sources /></Series.Sequence>
        <Series.Sequence durationInFrames={210}><Switch /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Policy /></Series.Sequence>
        <Series.Sequence durationInFrames={30}><Closing /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
