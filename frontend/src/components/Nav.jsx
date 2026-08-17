import { scrollStore } from "../lib/scrollStore";

const links = [
  { label: "Services", href: "#ch-01" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const go = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    if (scrollStore.lenis) scrollStore.lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <header
      data-testid="site-nav"
      className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#09090B]/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          data-testid="nav-logo"
          onClick={(e) => go(e, "#top")}
          className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-[#FAFAFA]"
        >
          Oak Park<span className="text-[#F5A623]">&nbsp;Co.</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              onClick={(e) => go(e, l.href)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[#A1A1AA] transition-colors duration-300 hover:text-[#FAFAFA]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          data-testid="nav-cta"
          onClick={(e) => go(e, "#contact")}
          className="border border-[#F5A623] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#F5A623] transition-colors duration-300 hover:bg-[#F5A623] hover:text-[#09090B]"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}
