import HeroV9 from "./HeroV9";
import StoryV11 from "./StoryV11";

export default function StoryV12({ storyRef }) {
  return <StoryV11 storyRef={storyRef} HeroComponent={HeroV9} />;
}
