import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { scrollStore } from "@/lib/scrollStore";
import HouseScene from "@/three/HouseScene";
import Nav from "@/components/Nav";
import Story from "@/components/Story";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export default function App() {
  const storyRef = useRef(null);

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

  return (
    <div className="bg-[#09090B] font-body text-[#FAFAFA] antialiased">
      <div className="noise-overlay" aria-hidden />
      <HouseScene />
      <Nav />
      <main className="relative z-10">
        <Story storyRef={storyRef} />
        <div className="relative border-t border-white/10 bg-[#09090B]">
          <Marquee />
          <About />
          <Gallery />
          <Testimonials />
          <Contact />
          <Footer />
        </div>
      </main>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
