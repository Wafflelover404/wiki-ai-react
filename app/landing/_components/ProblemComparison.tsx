"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import { Frown, Zap, TrendingUp, LucideIcon } from "lucide-react";
import { renderRichText } from "./rich-text";

interface ColData {
  icon: LucideIcon;
  titleKey: string;
  itemsKeys: string[];
  hi?: boolean;
}

export default function ProblemComparison() {
  const { t } = useTranslation();

  const cols: ColData[] = [
    {
      icon: Frown,
      titleKey: "landing.problem.before.title",
      itemsKeys: ["landing.problem.before.items.0","landing.problem.before.items.1","landing.problem.before.items.2","landing.problem.before.items.3"],
    },
    {
      icon: Zap,
      titleKey: "landing.problem.with.title",
      itemsKeys: ["landing.problem.with.items.0","landing.problem.with.items.1","landing.problem.with.items.2","landing.problem.with.items.3"],
      hi: true,
    },
    {
      icon: TrendingUp,
      titleKey: "landing.problem.result.title",
      itemsKeys: ["landing.problem.result.items.0","landing.problem.result.items.1","landing.problem.result.items.2","landing.problem.result.items.3"],
    },
  ];

  return (
    <section className="px-[6%] py-20">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20" />
      <div className="max-w-[1060px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-4"
            dangerouslySetInnerHTML={renderRichText(t("landing.problem.title"))}
          />
          <p className="text-muted-foreground max-w-[520px] mx-auto leading-relaxed">
            {t("landing.problem.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {cols.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-8 ${col.hi ? "bg-primary/5" : "bg-card"}`}
            >
              <div className="mb-3.5"><col.icon size={28} color={col.hi ? "#60a5fa" : "#64748b"} /></div>
              <div className={`text-sm font-bold font-mono uppercase tracking-[0.04em] mb-4 ${col.hi ? "text-blue-400" : "text-muted-foreground"}`}>
                {t(col.titleKey)}
              </div>
              {col.itemsKeys.map((key, j) => (
                <div key={j} className={`flex items-start gap-2 mb-3 text-sm leading-relaxed ${col.hi ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className={`mt-0.5 shrink-0 ${col.hi ? "text-green-500" : "text-muted-foreground/40"}`}>
                    {col.hi ? "\u2713" : "\u2013"}
                  </span>
                  {t(key)}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
