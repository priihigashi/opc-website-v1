import HeroV8 from "./HeroV8";

const SOFT_BRIDGE = "linear-gradient(180deg, rgba(9,9,11,0) 0%, rgba(9,9,11,0.12) 28%, rgba(9,9,11,0.34) 55%, rgba(9,9,11,0.2) 77%, rgba(9,9,11,0) 100%)";

export default function HeroV9() {
  return <HeroV8 haloClassName="hero-halo-v9" bridgeBackground={SOFT_BRIDGE} />;
}
