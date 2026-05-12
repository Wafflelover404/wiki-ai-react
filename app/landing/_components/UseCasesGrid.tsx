"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import { Sparkles, ShoppingCart, Phone, Handshake, LucideIcon } from "lucide-react";
import { renderRichText } from "./rich-text";

export default function UseCasesGrid() {
  const { t } = useTranslation();

  const useCases = [
    { icon: Sparkles, titleKey: "landing.useCases.onboarding.title", descKey: "landing.useCases.onboarding.desc" },
    { icon: ShoppingCart, titleKey: "landing.useCases.ecommerce.title", descKey: "landing.useCases.ecommerce.desc" },
    { icon: Phone, titleKey: "landing.useCases.callCenter.title", descKey: "landing.useCases.callCenter.desc" },
    { icon: Handshake, titleKey: "landing.useCases.sales.title", descKey: "landing.useCases.sales.desc" },
  ];

  return (
    <section className="px-[6%] py-20">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20" />
      <div className="max-w-[1060px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-primary/10 text-blue-400 border border-primary/20 mb-3.5">
            {t("landing.useCases.tag")}
          </span>
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-3.5"
            dangerouslySetInnerHTML={renderRichText(t("landing.useCases.title"))}
          />
          <p className="text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
            {t("landing.useCases.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {useCases.map((u, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden bg-card border border-border rounded-2xl p-7 group"
            >
              <div className="mb-4"><u.icon size={32} color="#60a5fa" /></div>
              <h3 className="text-base font-bold text-foreground mb-2.5">{t(u.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(u.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
