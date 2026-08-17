import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  {
    text: "They framed our addition like it was load-bearing for their own family. Same crew from dig day to the final walkthrough.",
    name: "Dana & Miguel R.",
    project: "Two-storey addition",
  },
  {
    text: "The kitchen remodel ran a week ahead of schedule. When they opened the wall, they showed us everything — nothing hidden, ever.",
    name: "Priya S.",
    project: "Kitchen + bath remodel",
  },
  {
    text: "Pergola, barbecue counter, pavers — our backyard went from dirt to the room we live in all summer.",
    name: "Tom W.",
    project: "Outdoor living build",
  },
];

export default function Testimonials() {
  return (
    <section data-testid="testimonials" className="relative border-b border-white/10 bg-[#0C0C0E]">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#CBCC10]">Word on the Street</p>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.blockquote
              key={i}
              data-testid={`testimonial-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
              className="flex flex-col justify-between border border-white/10 bg-[#121214] p-8 transition-colors duration-300 hover:border-[#CBCC10]/40"
            >
              <div>
                <Quote className="h-5 w-5 text-[#CBCC10]" strokeWidth={1.5} />
                <p className="mt-6 text-base leading-relaxed text-[#FAFAFA]">“{q.text}”</p>
              </div>
              <footer className="mt-8 border-t border-white/10 pt-5">
                <p className="font-head font-bold text-[#FAFAFA]">{q.name}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A1A1AA]">{q.project}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
