import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SERVICE_AREA_LINE, SERVICE_CONTENT_V3, SERVICE_PROCESS } from "./serviceContentV3";

export default function ServiceDetailV3() {
  const { slug } = useParams();
  const service = SERVICE_CONTENT_V3[slug];

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-[#FAFAFA]">
        <p className="font-mono text-sm uppercase tracking-widest">Unknown service — <Link to="/services" className="text-[#CBCC10]">back to the house</Link></p>
      </div>
    );
  }

  return (
    <div data-testid={`service-${slug}`} className="relative z-10 min-h-screen bg-[#09090B] pt-16 text-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <Link to="/services" data-testid="service-back" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#A1A1AA] transition-colors hover:text-[#CBCC10]">
          <ArrowLeft className="h-4 w-4" /> Back to the house
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-12 items-center gap-y-12 px-6 pb-16 md:px-10">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="col-span-12 md:col-span-5">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">{service.tag}</p>
          <h1 className="mt-4 font-head text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">{service.title}</h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#D4D4D8]">{service.body}</p>
          <p className="mt-4 max-w-md border-l border-[#CBCC10] pl-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[#B8B8BC]">{SERVICE_AREA_LINE}</p>
          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
            {service.bullets.map((bullet, index) => (
              <li key={bullet} data-testid={`service-bullet-${index}`} className="flex items-center gap-3 text-sm">
                <span className="h-px w-6 bg-[#CBCC10]" />{bullet}
              </li>
            ))}
          </ul>
          <a href="/#contact" data-testid="service-cta" className="mt-10 inline-flex items-center gap-3 bg-[#CBCC10] px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[#09090B] transition-colors hover:bg-[#b5b80e]">
            Discuss this project <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.figure initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="col-span-12 overflow-hidden rounded-[10px] border border-white/10 md:col-span-6 md:col-start-7">
          <div className="relative">
            <img src={service.image} alt={service.imageAlt} width="1800" height="1350" className="aspect-[4/3] w-full object-cover" loading="eager" decoding="async" />
            <figcaption className="absolute bottom-0 left-0 bg-[#09090B]/90 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#CBCC10]">{service.phase}</figcaption>
          </div>
        </motion.figure>
      </div>

      <section aria-labelledby="service-proof" className="border-t border-white/10 bg-[#111113]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10 md:py-16">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">Real Oak Park work</p>
            <h2 id="service-proof" className="mt-3 font-head text-3xl uppercase sm:text-4xl">Proof in the work.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">Browse Oak Park Construction project photography and related work before discussing your property and scope.</p>
          </div>
          <Link to={service.proofHref} data-testid="service-proof-link" className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-[#CBCC10] transition-colors hover:text-[#EEEDE9]">
            View related projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="service-process" className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CBCC10]">What happens next</p>
          <h2 id="service-process" className="mt-4 font-head text-3xl uppercase sm:text-4xl">A clear start before construction.</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {SERVICE_PROCESS.map((step, index) => (
              <li key={step} className="border-t border-white/15 py-5 text-sm leading-relaxed text-white/70">
                <span className="mr-3 font-mono text-[10px] text-[#CBCC10]">0{index + 1}</span>{step}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
