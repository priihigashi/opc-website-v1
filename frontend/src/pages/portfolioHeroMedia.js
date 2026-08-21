// Which cut of the portfolio hero montage to serve.
//
// Defaults to the CURRENT approved montage. Setting
// REACT_APP_PORTFOLIO_HERO=trimmed at build time serves the variant with the
// children's playroom section removed (v2 11.6s–19.6s), so both cuts can be
// deployed side by side for review without duplicating the page component.
//
// Neither file is destructive: portfolio-hero-intro-v2.mp4 is untouched.
const TRIMMED = process.env.REACT_APP_PORTFOLIO_HERO === "trimmed";

export const PORTFOLIO_HERO_VIDEO = TRIMMED
  ? "/video/portfolio-hero-intro-v3.mp4"
  : "/video/portfolio-hero-intro-v2.mp4";

export const PORTFOLIO_HERO_POSTER = "/video/portfolio-hero-poster-v2.jpg";
export const PORTFOLIO_HERO_CUT = TRIMMED ? "trimmed" : "full";
