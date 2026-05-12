"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import { useCounter } from "../_hooks/use-counter";
import type { StatItem } from "../_data/stats";

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const { value, ref } = useCounter({ to: stat.n, decimals: stat.dec });
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-card text-center py-10 px-5"
    >
      <div className="text-[2.8rem] font-black tracking-[-0.03em] text-blue-400 leading-none mb-2 font-sans">
        <span ref={ref}>
          {stat.dec ? value.toFixed(stat.dec) : Math.round(value).toLocaleString()}
        </span>
        {stat.s}
      </div>
      <div className="text-[15px] font-semibold text-foreground mb-1">
        {t(stat.labelKey)}
      </div>
      <div className="text-xs text-muted-foreground">{t(stat.descKey)}</div>
    </motion.div>
  );
}

export default function StatsCounter({ stats }: { stats: StatItem[] }) {
  return (
    <section className="px-[6%] py-18 bg-gradient-to-br from-primary/[0.04] to-indigo-500/[0.03]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px max-w-[900px] mx-auto bg-border rounded-2xl overflow-hidden">
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} />
        ))}
      </div>
    </section>
  );
}
