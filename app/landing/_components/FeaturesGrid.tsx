"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import type { FeatureItem } from "../_data/features";
import { renderRichText } from "./rich-text";

const tagStyles: Record<string, string> = {
  "": "bg-primary/10 text-blue-400 border-primary/20",
  "tag-indigo": "bg-indigo-500/8 text-indigo-300 border-indigo-500/20",
  "tag-green": "bg-green-500/8 text-green-400 border-green-500/20",
  "tag-amber": "bg-amber-500/8 text-amber-300 border-amber-500/20",
};

export default function FeaturesGrid({ features }: { features: FeatureItem[] }) {
  const { t } = useTranslation();

  return (
    <section id="features" className="px-[6%] py-20">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20" />
      <div className="max-w-[1060px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-primary/10 text-blue-400 border border-primary/20 mb-3.5">
            {t("landing.features.tag")}
          </span>
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-3.5"
            dangerouslySetInnerHTML={renderRichText(t("landing.features.title"))}
          />
          <p className="text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
            {t("landing.features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -3, boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}
              className="relative overflow-hidden bg-card border border-border rounded-2xl p-7 transition-colors duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="mb-4"><f.icon size={30} color="#60a5fa" /></div>
                <div className="flex items-center gap-2 mb-2.5">
                  <h3 className="text-base font-bold text-foreground">{t(f.titleKey)}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border ${tagStyles[f.tagStyle] || tagStyles[""]}`}>
                    {t(f.tagKey)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
