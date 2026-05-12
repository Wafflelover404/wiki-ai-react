"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "WikiAI reduced our employee onboarding time by 60%. New hires get answers instantly instead of waiting for HR.",
    author: "Sarah Chen",
    role: "Head of People, TechCorp",
    rating: 5,
  },
  {
    quote: "Our support team went from answering 200+ repetitive questions daily to focusing on complex cases. Game changer.",
    author: "Marcus Rivera",
    role: "VP Operations, ScaleUp Inc",
    rating: 5,
  },
  {
    quote: "The Bitrix24 integration is seamless. All our CRM knowledge is now instantly searchable by the sales team.",
    author: "Elena Kowalski",
    role: "CTO, RetailPro",
    rating: 5,
  },
  {
    quote: "We connected WikiAI to our SharePoint and Slack. Knowledge that used to take days to find now takes seconds.",
    author: "David Park",
    role: "IT Director, FinServ Group",
    rating: 5,
  },
  {
    quote: "The AI agent understands context better than any search tool we've tried. It feels like asking a colleague.",
    author: "Anna Johansson",
    role: "Knowledge Manager, Nordic Solutions",
    rating: 5,
  },
  {
    quote: "Deployment was surprisingly fast. We had WikiAI indexing our Confluence and answering employee questions in under a week.",
    author: "James Liu",
    role: "Engineering Lead, CloudBase",
    rating: 5,
  },
];

const logoItems = [
  "TechCorp", "ScaleUp", "RetailPro", "FinServ", "Nordic", "CloudBase",
  "DataFlow", "InnovateX", "Atlas AI", "NexGen",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} fill="#f59e0b" stroke="#f59e0b" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="px-[6%] py-20 overflow-hidden">
      {/* Logo marquee */}
      <div className="max-w-[1060px] mx-auto mb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-sm font-medium uppercase tracking-[0.1em] mb-8"
        >
          Trusted by innovative teams
        </motion.p>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-12 items-center justify-center flex-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {logoItems.map((name, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="text-muted-foreground/40 font-bold text-lg tracking-tight hover:text-muted-foreground/70 transition-colors cursor-default select-none"
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-16" />

      {/* Testimonial cards */}
      <div className="max-w-[1060px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-3.5">
            What our{" "}
            <span className="text-gradient-blue">customers</span> say
          </h2>
          <p className="text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
            Teams of all sizes trust WikiAI to make knowledge accessible, searchable, and actionable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="text-sm font-semibold text-foreground">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
