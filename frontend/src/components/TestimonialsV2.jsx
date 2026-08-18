import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";

const GOOGLE_PROFILE = "https://www.google.com/maps/place/Oak+Park+Construction/@26.274191,-80.1013505,17z/data=!4m8!3m7!1s0x8d5912b6498d4d2d:0xff621d01ac4d539d!8m2!3d26.274191!4d-80.1013505!9m1!1b1!16s%2Fg%2F11xzjcs8hj";

const reviews = [
  { quote: "Very detailed, professional, clean and prompt company!", name: "Ryan Schmidt", project: "Home addition" },
  { quote: "Always on time, clean, and professional.", name: "Ghazal Nabavi", project: "Courtyard construction" },
  { quote: "Love my new kitchen! I get many compliments.", name: "Kristina Vitale", project: "Kitchen remodel" },
];

export default function TestimonialsV2() {
  return (
    <section data-testid="testimonials" className="relative border-b border-white/10 bg-[#0C0C0E]">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="luxury-kicker font-mono text-[10px] uppercase tracking-[0.28em]">Client perspective</p>
            <h2 className="mt-6 max-w-3xl leading-[0.96] tracking-tight text-[#EEEDE9]">
              <span className="font-head block text-4xl uppercase sm:text-5xl">The work speaks</span>
              <span className="font-editorial block text-4xl sm:text-5xl">through the people who live with it.</span>
            </h2>
          </div>
          <div className="shrink-0 border-l border-[#CBCC10] pl-5">
            <div className="flex items-center gap-1 text-[#CBCC10]" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-4 w-4 fill-current" strokeWidth={1.2} />)}
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[#EEEDE9]">5.0 · 9 Google reviews</p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 border-y border-white/10 md:grid-cols-3">
          {reviews.map(({ quote, name, project }, i) => (
            <motion.article key={name} data-testid={`testimonial-${i}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }} className="flex min-h-[15rem] flex-col justify-between border-b border-white/10 py-9 md:border-b-0 md:border-r md:px-9 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <p className="font-editorial text-3xl leading-[1.1] text-[#EEEDE9]">“{quote}”</p>
              <div className="mt-10 border-t border-white/10 pt-5">
                <p className="font-head text-lg uppercase tracking-wide text-[#EEEDE9]">{name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Google review · {project}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <a href={GOOGLE_PROFILE} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 border-b border-[#CBCC10]/70 pb-2 font-mono text-xs uppercase tracking-[0.22em] text-[#EEEDE9] transition-colors hover:text-[#CBCC10]">
          Read all reviews on Google <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
