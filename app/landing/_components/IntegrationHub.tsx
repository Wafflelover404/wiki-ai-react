"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import {
  Brain, Diamond, BarChart3, Folder, Globe, Mail,
  MessageSquare, ShoppingCart, Smartphone, Phone, Plug,
  Database, Cpu, Server, FileText, PenTool,
} from "lucide-react";
import { renderRichText } from "./rich-text";

/* ──────────────────────────────────────────────
   DIAGONAL PIPELINE BLOCK
────────────────────────────────────────────── */
function PipelineBlock({
  index,
  icon: Icon,
  title,
  subtitle,
  color,
  accentBg,
  children,
}: {
  index: number;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle: string;
  color: string;
  accentBg: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, x: -20 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      className="group relative flex items-start gap-4 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-300"
    >
      {/* Stage number badge */}
      <span className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold font-mono text-muted-foreground group-hover:border-primary/40 group-hover:text-blue-400 transition-colors">
        {index + 1}
      </span>

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accentBg }}
      >
        <Icon size={22} color={color} />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <div className="text-[15px] font-bold text-foreground mb-1">{title}</div>
        <div className="text-[12px] text-muted-foreground leading-relaxed">{subtitle}</div>
        {children}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   SOURCE / CLIENT MINI-CARD
────────────────────────────────────────────── */
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
    <div
      className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
    >
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

/* ──────────────────────────────────────────────
   DATA EXAMPLE BARS
────────────────────────────────────────────── */
function DataBars({ color, delay }: { color: string; delay: number }) {
  const bars = [
    { w: "80%", c: "#60a5fa" },
    { w: "55%", c: "#818cf8" },
    { w: "90%", c: "#38bdf8" },
    { w: "45%", c: "#a78bfa" },
  ];

  return (
    <div className="mt-3 space-y-1.5">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ width: 0 }}
          whileInView={{ width: b.w }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + i * 0.08 }}
          className="h-1 rounded-sm"
          style={{ background: b.c, opacity: 0.5 }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────── */
export default function IntegrationHub({ isMobile }: { isMobile: boolean }) {
  const { t } = useTranslation();

  if (isMobile) return <MobileHub t={t} />;

  const sourceCards = [
    { icon: Diamond, label: "Bitrix24", sub: "CRM / Tasks" },
    { icon: BarChart3, label: "1C ERP", sub: "Operations" },
    { icon: Folder, label: "Google Drive", sub: "Documents" },
    { icon: Globe, label: "Confluence", sub: "Wiki pages" },
  ];

  const outputCards = [
    { icon: MessageSquare, label: "Telegram Bot", sub: "Team messenger" },
    { icon: ShoppingCart, label: "Online Store", sub: "AI chat widget" },
    { icon: Smartphone, label: "Slack", sub: "Workspace chat" },
    { icon: Plug, label: "REST API", sub: "Any integration" },
  ];

  return (
    <section id="integrations" className="px-[6%] py-20 overflow-visible">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20" />
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
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

        {/* ── DIAGONAL PIPELINE ── */}
        <div className="relative" style={{ paddingLeft: 40 }}>
          {/* SVG diagonal connecting lines */}
          <svg
            className="absolute inset-0 pointer-events-none z-0"
            style={{ overflow: "visible", width: "100%", height: "100%" }}
          >
            {/* Line 1→2: Sources → Extraction */}
            <motion.line
              x1="30" y1="45"
              x2="30" y2="135"
              stroke="rgba(59,130,246,0.2)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            {/* Line 2→3: Extraction → Data */}
            <motion.line
              x1="30" y1="215"
              x2="30" y2="305"
              stroke="rgba(245,158,11,0.2)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            />
            {/* Line 3→4: Data → Processing */}
            <motion.line
              x1="30" y1="385"
              x2="30" y2="475"
              stroke="rgba(139,92,246,0.2)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
            />
            {/* Line 4→5: Processing → WikiAI */}
            <motion.line
              x1="30" y1="555"
              x2="30" y2="645"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
            />
            {/* Line 5→6: WikiAI → Delivery */}
            <motion.line
              x1="30" y1="725"
              x2="30" y2="815"
              stroke="rgba(34,197,94,0.2)"
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.5 }}
            />
          </svg>

          {/* Block 1: Data Sources */}
          <div className="mb-8">
            <PipelineBlock
              index={0}
              icon={Database}
              title={t("landing.integrationHub.sources.bitrix")}
              subtitle="Connectors pull structured data from your existing systems — CRM, ERP, drives, wikis, and mail archives."
              color="#60a5fa"
              accentBg="rgba(59,130,246,0.1)"
            >
              <div className="grid grid-cols-2 gap-2 mt-4">
                {sourceCards.map((s, i) => (
                  <MiniCard key={i} {...s} color="#60a5fa" bgClass="bg-blue-500/8" />
                ))}
              </div>
            </PipelineBlock>
          </div>

          {/* Block 2: Extraction */}
          <div className="mb-8">
            <PipelineBlock
              index={1}
              icon={FileText}
              title="Data Extraction"
              subtitle="Raw documents are parsed, cleaned, and converted into structured records ready for AI processing."
              color="#f59e0b"
              accentBg="rgba(245,158,11,0.1)"
            />
          </div>

          {/* Block 3: Structured Data */}
          <div className="mb-8">
            <PipelineBlock
              index={2}
              icon={Folder}
              title="Structured Knowledge"
              subtitle="Documents become searchable chunks with metadata — sections, tags, permissions, and context preserved."
              color="#818cf8"
              accentBg="rgba(129,140,248,0.1)"
            >
              <DataBars color="#818cf8" delay={0.9} />
            </PipelineBlock>
          </div>

          {/* Block 4: Processing */}
          <div className="mb-8">
            <PipelineBlock
              index={3}
              icon={Cpu}
              title="AI Embedding & Indexing"
              subtitle="Text is converted into vector embeddings. The knowledge graph links related concepts across departments."
              color="#a78bfa"
              accentBg="rgba(167,139,250,0.1)"
            />
          </div>

          {/* Block 5: WikiAI Core */}
          <div className="mb-8">
            <PipelineBlock
              index={4}
              icon={Brain}
              title="WikiAI Knowledge Engine"
              subtitle="Semantic search, AI agent responses, and multi-language understanding powered by your company data."
              color="#60a5fa"
              accentBg="rgba(59,130,246,0.15)"
            >
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-mono text-blue-400">
                  &lt; 0.4s response time
                </span>
              </div>
            </PipelineBlock>
          </div>

          {/* Block 6: Delivery Channels */}
          <div className="mb-8">
            <PipelineBlock
              index={5}
              icon={Server}
              title="MCP / API Delivery"
              subtitle="Knowledge reaches teams via Telegram bots, Slack, website widgets, call center tools, and REST API — wherever work happens."
              color="#4ade80"
              accentBg="rgba(34,197,94,0.1)"
            >
              <div className="grid grid-cols-2 gap-2 mt-4">
                {outputCards.map((s, i) => (
                  <MiniCard key={i} {...s} color="#4ade80" bgClass="bg-green-500/8" />
                ))}
              </div>
            </PipelineBlock>
          </div>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 max-w-[900px] mx-auto mt-16">
          {[
            { icon: Diamond, title: "Bitrix24", descKey: "landing.integrationHub.detailCards.bitrix24" },
            { icon: BarChart3, title: "1C / ERP", descKey: "landing.integrationHub.detailCards.erp" },
            { icon: MessageSquare, title: "Telegram & Slack", descKey: "landing.integrationHub.detailCards.messaging" },
            { icon: ShoppingCart, title: "Online Store", descKey: "landing.integrationHub.detailCards.store" },
          ].map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

/* ──────────────────────────────────────────────
   MOBILE LAYOUT
────────────────────────────────────────────── */
function MobileHub({ t }: { t: (k: string) => string }) {
  const steps = [
    { icon: Database, title: "Data Sources", sub: "Bitrix24, 1C, Drive, Confluence, Email, SharePoint", color: "#60a5fa", bg: "rgba(59,130,246,0.1)" },
    { icon: FileText, title: "Extraction", sub: "Parse & structure raw documents into clean records", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { icon: Cpu, title: "AI Processing", sub: "Embeddings, indexing, knowledge graph linking", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    { icon: Brain, title: "WikiAI Engine", sub: "Semantic search & AI agent responses", color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
    { icon: Server, title: "Delivery", sub: "Telegram, Slack, Widget, API, Call Center", color: "#4ade80", bg: "rgba(34,197,94,0.1)" },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-[420px] mx-auto">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16, x: -12 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
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
