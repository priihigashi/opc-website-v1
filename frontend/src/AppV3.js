import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { scrollStore } from "@/lib/scrollStore";
import DeferredHouseStageV5 from "@/components/DeferredHouseStageV5";
import HouseSceneV28 from "@/three/HouseSceneV28";
import NavV4 from "@/components/NavV4";
import StoryV13 from "@/components/StoryV13";
import MarqueeV2 from "@/components/MarqueeV2";
import AboutV3 from "@/components/AboutV3";
import GalleryV4 from "@/components/GalleryV4";
import TestimonialsV3 from "@/components/TestimonialsV3";
import ContactV6 from "@/components/ContactV6";
import FooterV2 from "@/components/FooterV2";
import SeoV1 from "@/components/SeoV1";
import TitleCaseAuditV1 from "@/components/TitleCaseAuditV1";
import PortfolioRouteBoundaryV1 from "@/components/PortfolioRouteBoundaryV1";
import ServicesV8 from "@/pages/ServicesV8";
import AnalyticsBoundaryV1 from "@/components/AnalyticsBoundaryV1";

const ServiceDetail = lazy(() => import("@/pages/ServiceDetailV3"));
const Portfolio = lazy(() => import("@/pages/PortfolioV7"));
const ProjectGallery = lazy(() => import("@/pages/ProjectGalleryV3"));
const Privacy = lazy(() => import("@/pages/PrivacyV3"));
const ServiceAreas = lazy(() => import("@/pages/ServiceAreasV1"));

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function Landing({ Stage = null }) {
  const storyRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;
    let raf = 0;

    const update = () => {
      const element = storyRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      scrollStore.p = clamp01(-rect.top / Math.max(1, total));
    };

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09 });
      scrollStore.lenis = lenis;
      lenis.on("scroll", update);
      const loop = (time) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const startedAt = performance.now();
      const intro = (time) => {
        const progress = Math.min(1, (time - startedAt) / 2400);
        scrollStore.intro = 1 - Math.pow(1 - progress, 3);
        if (progress < 1) requestAnimationFrame(intro);
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
    if (!location.state?.scrollTo) return undefined;
    const target = location.state.scrollTo;
    const timer = setTimeout(() => {
      const element = document.querySelector(target);
      if (element) {
        if (scrollStore.lenis) scrollStore.lenis.scrollTo(element, { offset: 0 });
        else element.scrollIntoView();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <div className="bg-[#09090B] font-body text-[#FAFAFA] antialiased">
      <div className="noise-overlay" aria-hidden />
      {Stage ? <Stage /> : <DeferredHouseStageV5 />}
      <main className="relative z-10">
        <StoryV13 storyRef={storyRef} />
        <div className="relative border-t border-white/10 bg-[#09090B]">
          <MarqueeV2 />
          <AboutV3 />
          <GalleryV4 />
          <TestimonialsV3 />
          <ContactV6 />
          <FooterV2 />
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
      return undefined;
    }
    const id = setTimeout(() => setShow(false), 800);
    return () => clearTimeout(id);
  }, [active]);

  if (!show) return null;
  return <DeferredHouseStageV5 scene="services" />;
}

export default function AppV3() {
  return (
    <BrowserRouter>
      <SeoV1 />
      <AnalyticsBoundaryV1 />
      <TitleCaseAuditV1>
        <NavV4 />
        <ServicesStageGate />
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* T-245 centred-composition preview. Production route untouched. */}
          <Route path="/preview/centered-house" element={<Landing Stage={HouseSceneV28} />} />
          <Route path="/services" element={<ServicesV8 />} />
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
              <PortfolioRouteBoundaryV1>
                <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
                  <Portfolio />
                </Suspense>
              </PortfolioRouteBoundaryV1>
            }
          />
          <Route path="/portfolio/1270-harbor-court" element={<Navigate to="/portfolio/harbor-court-residence" replace />} />
          <Route
            path="/portfolio/:projectId"
            element={
              <PortfolioRouteBoundaryV1>
                <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
                  <ProjectGallery />
                </Suspense>
              </PortfolioRouteBoundaryV1>
            }
          />
          <Route
            path="/service-areas"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
                <ServiceAreas />
              </Suspense>
            }
          />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#09090B]" />}>
                <Privacy />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" theme="dark" />
      </TitleCaseAuditV1>
    </BrowserRouter>
  );
}
