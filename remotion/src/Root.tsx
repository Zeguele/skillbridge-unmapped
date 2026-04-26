import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { FPS } from "./theme";

// 57 seconds @ 30fps = 1710 frames
export const RemotionRoot: React.FC = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={57 * FPS}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
