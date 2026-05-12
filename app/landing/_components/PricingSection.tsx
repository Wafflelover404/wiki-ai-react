"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/i18n";
import type { PlanItem } from "../_data/plans";
import { renderRichText } from "./rich-text";

export default function PricingSection({ plans }: { plans: PlanItem[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="px-[6%] py-24">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20" />

      <div className="max-w-[1060px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-primary/10 text-blue-400 border border-primary/20 mb-3.5">
            {t("landing.pricing.tag")}
          </span>
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-3.5"
            dangerouslySetInnerHTML={renderRichText(t("landing.pricing.title"))}
          />
          <p className="text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
            {t("landing.pricing.subtitle")}
          </p>
        </motion.div>

        {/* Toggle — wider gap, equal button widths */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center rounded-full bg-muted p-1 gap-1">
            <button
              onClick={() => setAnnual(false)}
              className={`relative z-10 rounded-full px-7 py-2.5 text-sm font-medium transition-colors min-w-[110px] ${
                !annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`relative z-10 rounded-full px-7 py-2.5 text-sm font-medium transition-colors min-w-[150px] ${
                annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="hidden sm:inline ml-1.5 text-xs opacity-70">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 max-w-[980px] mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: p.hi ? -4 : 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className={`relative flex flex-col bg-card border rounded-2xl p-9 transition-shadow ${
                p.hi ? "border-primary/40 bg-gradient-to-br from-primary/[0.06] to-card" : "border-border"
              }`}
            >
              {p.hi && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-sky-400 text-white text-[10px] font-bold px-4 py-1 rounded-b-lg font-mono tracking-[0.08em] whitespace-nowrap">
                  {t("landing.pricing.mostPopular")}
                </div>
              )}
              <div className="text-lg font-bold text-foreground mb-1">{t(p.nameKey)}</div>
              <div className="text-[13px] text-muted-foreground/60 mb-5">{t(p.descKey)}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-[40px] font-black tracking-[-0.03em] ${p.hi ? "text-blue-400" : "text-foreground"}`}>
                  {t(p.priceKey)}
                </span>
                {p.perKey && <span className="text-sm text-muted-foreground/60">{t(p.perKey)}</span>}
              </div>
              <div className="h-px bg-border my-5" />
              <div className="mb-7 flex-1">
                {p.featuresKeys.map((key, j) => (
                  <div key={j} className="flex items-center gap-2 mb-2.5 text-sm text-muted-foreground">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {t(key)}
                  </div>
                ))}
              </div>

              {/* CTA pushed to bottom */}
              <div className="mt-auto">
                <button
                  onClick={() => router.push("/login")}
                  className={`w-full justify-center py-3 rounded-lg text-sm font-semibold transition-all ${
                    p.hi ? "bg-primary text-primary-foreground hover:shadow-[0_8px_28px_rgba(59,130,246,0.35)]" : "border border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  {t(p.ctaKey)}
                </button>
                <p className="text-center text-xs text-muted-foreground/50 mt-3">
                  Try free for 14 days
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
