import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { scrollStore } from "@/lib/scrollStore";
import HouseSceneV9 from "@/three/HouseSceneV9";
import Nav from "@/components/NavV3";
import StoryV9 from "@/components/StoryV9";
import MarqueeV2 from "@/components/MarqueeV2";
import AboutV3 from "@/components/AboutV3";
import GalleryV3 from "@/components/GalleryV3";
import TestimonialsV3 from "@/components/TestimonialsV3";
import ContactV2 from "@/components/ContactV2";
import Footer from "@/components/Footer";
import Services from "@/pages/Services";
import ServicesScene from "@/pages/ServicesScene";

const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Portfolio = lazy(() => import("@/pages/PortfolioV2"));

const clamp01 = (v) => Math.min(1, Math.max(0, v));

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
      scrollStore.p = clamp01(-rect.top / Math.max(1, total));
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
      <HouseSceneV9 />
      <main className="relative z-10">
        <StoryV9 storyRef={storyRef} />
        <div className="relative border-t border-white/10 bg-[#09090B]">
          <MarqueeV2 />
          <AboutV3 />
          <GalleryV3 />
          <TestimonialsV3 />
          <ContactV2 />
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
