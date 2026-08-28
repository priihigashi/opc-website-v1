import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollStore } from "../lib/scrollStore";
import { trackCtaClick } from "@/lib/analytics";

const pageLinks = [
  { label: "Home", to: "/", exact: true },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
];

const anchors = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const isCurrentPage = (pathname, link) =>
  link.exact ? pathname === link.to : pathname.startsWith(link.to);

export default function NavV4() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const goAnchor = (event, href) => {
    event.preventDefault();
    setOpen(false);
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: href } });
      return;
    }
    const element = document.querySelector(href);
    if (!element) return;
    if (scrollStore.lenis) scrollStore.lenis.scrollTo(element, { offset: 0 });
    else element.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = (event) => {
    event.preventDefault();
    setOpen(false);
    if (pathname !== "/") navigate("/");
    else if (scrollStore.lenis) scrollStore.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPage = (event, to) => {
    event.preventDefault();
    setOpen(false);
    if (to === "/") {
      goHome(event);
      return;
    }
    navigate(to);
  };

  return (
    <header data-testid="site-nav" className="fixed inset-x-0 top-0 z-40 border-b border-[#EEEDE9]/10 bg-[#09090B]/95 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 md:px-10">
        <a href="/" data-testid="nav-logo" onClick={goHome} aria-label="Oak Park Construction — Home" className="flex items-center">
          <img src="/images/opc/logo-white-tight-v1.png" alt="" width="956" height="302" className="h-10 w-auto opacity-100 md:h-12" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Primary navigation">
          {pageLinks.map((link) => {
            const current = isCurrentPage(pathname, link);
            return (
              <a
                key={link.to}
                href={link.to}
                onClick={(event) => goPage(event, link.to)}
                aria-current={current ? "page" : undefined}
                className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${current ? "text-[#CBCC10]" : "text-[#A1A1AA] hover:text-white"}`}
              >
                {link.label}
              </a>
            );
          })}
          {anchors.map((link) => (
            <a key={link.href} href={link.href} onClick={(event) => goAnchor(event, link.href)} className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA] transition-colors duration-300 hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#contact" data-testid="nav-cta" onClick={(event) => { trackCtaClick("nav-desktop"); goAnchor(event, "#contact"); }} className="luxury-pill hidden border border-[#CBCC10]/70 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#CBCC10] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#CBCC10] hover:text-[#09090B] sm:inline-flex">
            Start a project
          </a>
          <button type="button" data-testid="mobile-menu-toggle" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 text-white lg:hidden">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Menu</span>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-white/10 bg-[#09090B]/98 px-5 py-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {pageLinks.map((link) => {
              const current = isCurrentPage(pathname, link);
              return (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={(event) => goPage(event, link.to)}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-[14px] border px-4 py-4 font-mono text-[11px] uppercase tracking-[0.22em] ${current ? "border-[#CBCC10]/50 bg-[#CBCC10]/10 text-[#CBCC10]" : "border-white/10 bg-white/[0.03] text-white"}`}
                >
                  {link.label}
                </a>
              );
            })}
            {anchors.map((link) => (
              <a key={link.href} href={link.href} onClick={(event) => goAnchor(event, link.href)} className="rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white">
                {link.label}
              </a>
            ))}
            <a href="#contact" data-testid="nav-cta-mobile" onClick={(event) => { trackCtaClick("nav-mobile"); goAnchor(event, "#contact"); }} className="mt-2 rounded-full bg-[#CBCC10] px-5 py-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#09090B] sm:hidden">
              Start a project
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
