import { useLocation, useNavigate } from "react-router-dom";
import { scrollStore } from "../lib/scrollStore";

const pageLinks = [
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
];
const anchors = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goAnchor = (e, href) => {
    e.preventDefault();
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: href } });
      return;
    }
    const el = document.querySelector(href);
    if (!el) return;
    if (scrollStore.lenis) scrollStore.lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = (e) => {
    e.preventDefault();
    if (pathname !== "/") navigate("/");
    else if (scrollStore.lenis) scrollStore.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      data-testid="site-nav"
      className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#09090B]/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a
          href="/"
          data-testid="nav-logo"
          onClick={goHome}
          className="flex items-center"
        >
          <img
            src="/images/opc/logo-white.png"
            alt="Oak Park Construction"
            width="124"
            height="74"
            className="h-10 w-auto opacity-95"
          />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {pageLinks.map((l) => (
            <a
              key={l.to}
              href={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(l.to);
              }}
              className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                pathname.startsWith(l.to) ? "text-[#CBCC10]" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
              }`}
            >
              {l.label}
            </a>
          ))}
          {anchors.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              onClick={(e) => goAnchor(e, l.href)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#A1A1AA] transition-colors duration-300 hover:text-[#FAFAFA]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          data-testid="nav-cta"
          onClick={(e) => goAnchor(e, "#contact")}
          className="border border-[#CBCC10] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#CBCC10] transition-colors duration-300 hover:bg-[#CBCC10] hover:text-[#09090B] sm:px-4 sm:text-xs sm:tracking-[0.2em]"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}
