"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import {
  Brain, Diamond, BarChart3, Folder, Globe, Mail,
  MessageSquare, ShoppingCart, Smartphone, Phone, Plug,
  Database, Cpu, Server, FileText, PenTool,
} from "lucide-react";
import { renderRichText } from "./rich-text";

function MiniCard({
  icon: Icon,
  label,
  sub,
  color,
  bgClass,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  sub: string;
  color: string;
  bgClass: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${bgClass}`}>
        <Icon size={14} color={color} />
      </div>
      <div>
        <div className="text-[11px] font-semibold text-foreground whitespace-nowrap">{label}</div>
        <div className="text-[9px] text-muted-foreground/50 whitespace-nowrap">{sub}</div>
      </div>
    </div>
  );
}

function DataBars() {
  const bars = [
    { w: "80%", c: "#60a5fa" },
    { w: "55%", c: "#818cf8" },
    { w: "90%", c: "#38bdf8" },
    { w: "45%", c: "#a78bfa" },
  ];

  return (
    <div className="mt-3 space-y-1.5">
      {bars.map((b, i) => (
        <div
          key={i}
          className="h-1 rounded-sm"
          style={{ width: b.w, background: b.c, opacity: 0.5 }}
        />
      ))}
    </div>
  );
}

export default function IntegrationHub({ isMobile }: { isMobile: boolean }) {
  const { t } = useTranslation();

  if (isMobile) return <MobileHub t={t} />;

  const sourceCards = [
    { icon: Diamond, label: t("landing.integrationHub.sources.bitrix"), sub: t("landing.integrationHub.sources.bitrixSub") },
    { icon: BarChart3, label: t("landing.integrationHub.sources.erp"), sub: t("landing.integrationHub.sources.erpSub") },
    { icon: Folder, label: t("landing.integrationHub.sources.drive"), sub: t("landing.integrationHub.sources.driveSub") },
    { icon: Globe, label: t("landing.integrationHub.sources.confluence"), sub: t("landing.integrationHub.sources.confluenceSub") },
  ];

  const outputCards = [
    { icon: MessageSquare, label: t("landing.integrationHub.outputs.telegram"), sub: t("landing.integrationHub.outputs.telegramSub") },
    { icon: ShoppingCart, label: t("landing.integrationHub.outputs.shop"), sub: t("landing.integrationHub.outputs.shopSub") },
    { icon: Smartphone, label: t("landing.integrationHub.outputs.slack"), sub: t("landing.integrationHub.outputs.slackSub") },
    { icon: Plug, label: t("landing.integrationHub.outputs.api"), sub: t("landing.integrationHub.outputs.apiSub") },
  ];

  const pipelineSteps = [
    {
      icon: Database,
      title: t("landing.integrationHub.steps.sources.title"),
      subtitle: t("landing.integrationHub.steps.sources.subtitle"),
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.1)",
      children: (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {sourceCards.map((s, i) => (
            <MiniCard key={i} {...s} color="#60a5fa" bgClass="bg-blue-500/8" />
          ))}
        </div>
      ),
    },
    {
      icon: FileText,
      title: t("landing.integrationHub.steps.extraction.title"),
      subtitle: t("landing.integrationHub.steps.extraction.subtitle"),
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
    },
    {
      icon: Folder,
      title: t("landing.integrationHub.steps.structuring.title"),
      subtitle: t("landing.integrationHub.steps.structuring.subtitle"),
      color: "#818cf8",
      bg: "rgba(129,140,248,0.1)",
      children: <DataBars />,
    },
    {
      icon: Cpu,
      title: t("landing.integrationHub.steps.embedding.title"),
      subtitle: t("landing.integrationHub.steps.embedding.subtitle"),
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
    },
    {
      icon: Brain,
      title: t("landing.integrationHub.steps.engine.title"),
      subtitle: t("landing.integrationHub.steps.engine.subtitle"),
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.15)",
      children: (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] font-mono text-blue-400">&lt; 0.4s response time</span>
        </div>
      ),
    },
    {
      icon: Server,
      title: t("landing.integrationHub.steps.delivery.title"),
      subtitle: t("landing.integrationHub.steps.delivery.subtitle"),
      color: "#4ade80",
      bg: "rgba(34,197,94,0.1)",
      children: (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {outputCards.map((s, i) => (
            <MiniCard key={i} {...s} color="#4ade80" bgClass="bg-green-500/8" />
          ))}
        </div>
      ),
    },
  ];

  const detailCards = [
    { icon: Diamond, title: "Bitrix24", descKey: "landing.integrationHub.detailCards.bitrix24" },
    { icon: BarChart3, title: "1C / ERP", descKey: "landing.integrationHub.detailCards.erp" },
    { icon: MessageSquare, title: "Telegram & Slack", descKey: "landing.integrationHub.detailCards.messaging" },
    { icon: ShoppingCart, title: "Online Store", descKey: "landing.integrationHub.detailCards.store" },
  ];

  return (
    <section id="integrations" className="px-[6%] py-20">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20" />
      <div className="max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-indigo-500/8 text-indigo-300 border border-indigo-500/20 mb-3.5">
            {t("landing.integrationHub.tag")}
          </span>
          <h2
            className="text-[clamp(1.75rem,4vw,2.75rem)] font-[750] leading-[1.12] tracking-[-0.025em] mb-3.5"
            dangerouslySetInnerHTML={renderRichText(t("landing.integrationHub.title"))}
          />
          <p className="text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
            {t("landing.integrationHub.subtitle")}
          </p>
        </motion.div>

        <div className="relative" style={{ paddingLeft: 40 }}>
          <svg
            className="absolute inset-0 pointer-events-none z-0"
            style={{ overflow: "visible", width: "100%", height: "100%" }}
          >
            <line x1="30" y1="45" x2="30" y2="135" stroke="rgba(59,130,246,0.2)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="30" y1="215" x2="30" y2="305" stroke="rgba(245,158,11,0.2)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="30" y1="385" x2="30" y2="475" stroke="rgba(139,92,246,0.2)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="30" y1="555" x2="30" y2="645" stroke="rgba(59,130,246,0.25)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="30" y1="725" x2="30" y2="815" stroke="rgba(34,197,94,0.2)" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {pipelineSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative flex items-start gap-4 bg-card border border-border rounded-2xl p-5 mb-8"
            >
              <span className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold font-mono text-muted-foreground">
                {i + 1}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: step.bg }}
              >
                <step.icon size={22} color={step.color} />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-foreground mb-1">{step.title}</div>
                <div className="text-[12px] text-muted-foreground leading-relaxed">{step.subtitle}</div>
                {step.children}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 max-w-[900px] mx-auto mt-16">
          {detailCards.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-7 relative overflow-hidden"
            >
              <div className="relative">
                <div className="mb-3"><d.icon size={24} color="#60a5fa" /></div>
                <div className="text-[15px] font-bold text-foreground mb-1.5">{d.title}</div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{t(d.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileHub({ t }: { t: (k: string) => string }) {
  const steps = [
    { icon: Database, title: t("landing.integrationHub.dataSources"), sub: "Bitrix24, 1C, Drive, Confluence, Email, SharePoint", color: "#60a5fa", bg: "rgba(59,130,246,0.1)" },
    { icon: FileText, title: t("landing.integrationHub.steps.extraction.title"), sub: t("landing.integrationHub.steps.extraction.subtitle"), color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { icon: Cpu, title: t("landing.integrationHub.steps.embedding.title"), sub: "Embeddings, indexing, knowledge graph linking", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    { icon: Brain, title: t("landing.integrationHub.steps.engine.title"), sub: "Semantic search & AI agent responses", color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
    { icon: Server, title: t("landing.integrationHub.deliveryChannels"), sub: "Telegram, Slack, Widget, API, Call Center", color: "#4ade80", bg: "rgba(34,197,94,0.1)" },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-[420px] mx-auto">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: s.bg }}
          >
            <s.icon size={20} color={s.color} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{s.title}</div>
            <div className="text-[11px] text-muted-foreground leading-relaxed">{s.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
