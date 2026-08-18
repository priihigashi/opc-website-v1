import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { scrollStore } from "@/lib/scrollStore";
import HouseScene from "@/three/HouseScene";
import Nav from "@/components/Nav";
import StoryV2 from "@/components/StoryV2";
import Marquee from "@/components/Marquee";
import AboutV2 from "@/components/AboutV2";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Services from "@/pages/Services";
import ServicesScene from "@/pages/ServicesScene";

const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth01 = (v) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

// Mobile has much less unobstructed canvas than desktop. These plateaus deliberately
// pause the HOUSE animation at each completed chapter while the DOM copy keeps moving.
// The result is: build -> copy clears -> clean beauty hold -> transition/disassembly.
const MOBILE_STORY_WARP = [
  [0, 0],
  [0.205, 0.205],
  [0.225, 0.225],
  [0.27, 0.225],
  [0.3, 0.295],
  [0.375, 0.375],
  [0.395, 0.395],
  [0.44, 0.395],
  [0.47, 0.465],
  [0.52, 0.52],
  [0.54, 0.54],
  [0.6, 0.54],
  [0.625, 0.615],
  [0.695, 0.695],
  [0.715, 0.715],
  [0.77, 0.715],
  [0.8, 0.78],
  [0.86, 0.86],
  [0.88, 0.88],
  [0.93, 0.88],
  [0.955, 0.945],
  [1, 1],
];

function warpMobileStoryProgress(raw) {
  const p = clamp01(raw);
  for (let i = 1; i < MOBILE_STORY_WARP.length; i++) {
    const [x1, y1] = MOBILE_STORY_WARP[i];
    if (p <= x1) {
      const [x0, y0] = MOBILE_STORY_WARP[i - 1];
      if (x1 === x0) return y1;
      const t = smooth01((p - x0) / (x1 - x0));
      return y0 + (y1 - y0) * t;
    }
  }
  return 1;
}

function Landing() {
  const storyRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;
    let raf = 0;

    const update = () => {
      const el = storyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = clamp01(-rect.top / Math.max(1, total));
      scrollStore.rawP = raw;
      scrollStore.p = window.innerWidth < 768 ? warpMobileStoryProgress(raw) : raw;
    };

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09 });
      scrollStore.lenis = lenis;
      lenis.on("scroll", update);
      const loop = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const t0 = performance.now();
      const intro = (t) => {
        const k = Math.min(1, (t - t0) / 2400);
        scrollStore.intro = 1 - Math.pow(1 - k, 3);
        if (k < 1) requestAnimationFrame(intro);
      };
      requestAnimationFrame(intro);
    } else {
      scrollStore.intro = 1;
      window.addEventListener("scroll", update, { passive: true });
    }

    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      lenis?.destroy();
      scrollStore.lenis = null;
    };
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = location.state.scrollTo;
      const timer = setTimeout(() => {
        const el = document.querySelector(target);
        if (el) {
          if (scrollStore.lenis) scrollStore.lenis.scrollTo(el, { offset: 0 });
          else el.scrollIntoView();
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="bg-[#09090B] font-body text-[#FAFAFA] antialiased">
      <div className="noise-overlay" aria-hidden />
      <HouseScene />
      <main className="relative z-10">
        <StoryV2 storyRef={storyRef} />
        <div className="relative border-t border-white/10 bg-[#09090B]">
          <Marquee />
          <AboutV2 />
          <Gallery />
          <Testimonials />
          <Contact />
          <Footer />
        </div>
      </main>
    </div>
  );
}

function ServicesStageGate() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/services");
  const [show, setShow] = useState(active);
  useEffect(() => {
    if (active) {
      setShow(true);
      return;
    }
    const id = setTimeout(() => setShow(false), 800);
    return () => clearTimeout(id);
  }, [active]);
  if (!show) return null;
  return <ServicesScene />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <ServicesStageGate />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:slug"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
              <ServiceDetail />
            </Suspense>
          }
        />
        <Route
          path="/portfolio"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
              <Portfolio />
            </Suspense>
          }
        />
      </Routes>
      <Toaster position="bottom-right" theme="dark" />
    </BrowserRouter>
  );
}