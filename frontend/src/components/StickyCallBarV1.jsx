import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollStore } from "../lib/scrollStore";
import { trackCtaClick, trackPhoneClick } from "@/lib/analytics";

// Backlog M56 (P0): most visitors are on phones, so the call button stays on
// screen there. Phones only (hidden from md up, where the nav pill is visible).
// On the home page it steps aside while the build story is on screen (the
// story has its own chapter dock at the bottom, ChapterRailV3) and while the
// Contact section is on screen, so it never covers the form or doubles the
// phone number that is already there.
export default function StickyCallBarV1() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [storyVisible, setStoryVisible] = useState(pathname === "/");
  const [contactVisible, setContactVisible] = useState(false);
  const hidden = storyVisible || contactVisible;

  useEffect(() => {
    setStoryVisible(pathname === "/");
    setContactVisible(false);
    if (pathname !== "/" || typeof IntersectionObserver === "undefined") {
      setStoryVisible(false);
      return undefined;
    }
    const observers = [];
    const watch = (selector, setter, threshold) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const observer = new IntersectionObserver(([entry]) => setter(entry.isIntersecting), { threshold });
      observer.observe(element);
      observers.push(observer);
      return true;
    };
    // Both sections mount after the house stage, so look for them briefly.
    let storyFound = false;
    let contactFound = false;
    const attach = () => {
      storyFound = storyFound || watch('[data-testid="story"]', setStoryVisible, 0);
      contactFound = contactFound || watch("#contact", setContactVisible, 0.15);
      return storyFound && contactFound;
    };
    let tries = 0;
    const timer = attach() ? null : setInterval(() => {
      tries += 1;
      if (attach() || tries > 20) {
        clearInterval(timer);
        if (!storyFound) setStoryVisible(false);
      }
    }, 500);
    return () => { if (timer) clearInterval(timer); observers.forEach((observer) => observer.disconnect()); };
  }, [pathname]);

  const goContact = (event) => {
    event.preventDefault();
    trackCtaClick("sticky-mobile");
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: "#contact" } });
      return;
    }
    const element = document.getElementById("contact");
    if (!element) return;
    if (scrollStore.lenis) scrollStore.lenis.scrollTo(element, { offset: 0 });
    else element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Keeps the last lines of every page (footer, privacy link) above the bar. */}
      <div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-[#09090B] md:hidden" />
      <div
        data-testid="sticky-call-bar"
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#09090B]/95 px-4 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-transform duration-300 md:hidden ${hidden ? "pointer-events-none translate-y-full" : "translate-y-0"}`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        aria-hidden={hidden}
      >
        <div className="mx-auto flex max-w-md gap-3">
          <a
            data-testid="sticky-call-phone"
            onClick={() => trackPhoneClick("sticky-mobile")}
            href="tel:+19542586769"
            tabIndex={hidden ? -1 : 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#CBCC10] px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#09090B]"
          >
            <Phone aria-hidden className="h-4 w-4" />
            Call Now
          </a>
          <a
            data-testid="sticky-call-quote"
            href={pathname === "/" ? "#contact" : "/#contact"}
            onClick={goContact}
            tabIndex={hidden ? -1 : 0}
            className="flex flex-1 items-center justify-center rounded-full border border-[#CBCC10]/70 px-4 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#CBCC10]"
          >
            Free Estimate
          </a>
        </div>
      </div>
    </>
  );
}
