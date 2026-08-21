// Which cut of the portfolio hero montage to serve.
//
// DEFAULT is the reviewed cut: portfolio-hero-intro-v5.mp4, which removes the
// children's playroom (original 11.6s-19.6s) and all three spans where the
// person filming is reflected in the bathroom mirrors (42.8-46.7s, 55.8-57.2s,
// 59.9-60.7s). 45.50s, down from 63.79s.
//
// The untouched original is preserved as portfolio-hero-intro-v2.mp4 and can be
// served again by setting REACT_APP_PORTFOLIO_HERO=full at build time, so the
// decision stays reversible without restoring a file.
const FULL = process.env.REACT_APP_PORTFOLIO_HERO === "full";

export const PORTFOLIO_HERO_VIDEO = FULL
  ? "/video/portfolio-hero-intro-v2.mp4"
  : "/video/portfolio-hero-intro-v5.mp4";

// A clean kitchen frame, verified free of both issues. This is what phones and
// reduced-motion visitors see, so it is deliberately not pulled from the video.
export const PORTFOLIO_HERO_POSTER = "/video/portfolio-hero-poster-v2.jpg";
export const PORTFOLIO_HERO_CUT = FULL ? "full" : "reviewed";
