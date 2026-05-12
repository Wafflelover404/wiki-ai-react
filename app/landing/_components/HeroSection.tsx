"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/i18n";
import { SafeHtml } from "./rich-text";

function FloatingShapes() {
  const shapes = [
    { size: 300, color: "rgba(59,130,246,0.08)", x: "15%", y: "20%", dur: 20, delay: 0 },
    { size: 220, color: "rgba(99,102,241,0.06)", x: "75%", y: "35%", dur: 24, delay: 4 },
    { size: 260, color: "rgba(14,165,233,0.05)", x: "60%", y: "60%", dur: 22, delay: 7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-60"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            background: `radial-gradient(circle, ${s.color}, transparent 70%)`,
            willChange: "transform",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function GeometricOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: "transform" }}>
      <motion.div
        className="absolute rounded-full border border-blue-400/10"
        style={{ width: 80, height: 80, left: "10%", top: "30%", willChange: "transform" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full border border-indigo-400/8"
        style={{ width: 50, height: 50, right: "18%", top: "45%", willChange: "transform" }}
        animate={{ rotate: -360, scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const valueProps = [
    t("landing.hero.valueProps.connects"),
    t("landing.hero.valueProps.answers"),
    t("landing.hero.valueProps.seconds"),
  ];

  const socialProof = [
    { n: t("landing.hero.socialProof.ai"), label: t("landing.hero.socialProof.powered") },
    { n: "<0.5s", label: t("landing.hero.socialProof.searchTime") },
    { n: "10+", label: t("landing.hero.socialProof.integrations") },
    { n: "99.9%", label: t("landing.hero.socialProof.uptime") },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.55] dark:opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Central glow */}
      <div className="absolute w-[700px] h-[700px] rounded-full top-[5%] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 65%)" }}
      />

      <FloatingShapes />
      <GeometricOrbs />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative text-center max-w-[860px] px-[5%]"
      >
        <motion.div variants={item} className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.07em] font-mono bg-primary/10 text-blue-400 border border-primary/20">
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"
              style={{ animation: "landing-pulse-dot 1.8s ease-in-out infinite" }}
            />
            {t("landing.hero.badge")}
          </span>
        </motion.div>

        <motion.h1 variants={item} className="text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[1.06] tracking-[-0.03em] mb-5">
          {t("landing.hero.title")}
          <br />
          <span className="text-gradient-shimmer">
            {t("landing.hero.titleHighlight")}
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-[clamp(15px,2vw,18px)] text-muted-foreground max-w-[560px] mx-auto mb-9 leading-relaxed">
          {t("landing.hero.subtitle")}
        </motion.p>

        <motion.div variants={item} className="flex gap-5 justify-center flex-wrap mb-10">
          {valueProps.map((p, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {p}
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="flex gap-3 justify-center flex-wrap mb-16">
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold hover:shadow-[0_8px_28px_rgba(59,130,246,0.35)] hover:-translate-y-px transition-all"
          >
            {t("landing.hero.getStarted")}
          </button>
          <button
            onClick={() => window.open("https://demo.wikiai.com", "_blank")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-foreground text-[15px] font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            {t("landing.hero.learnMore")}
          </button>
        </motion.div>

        <motion.div variants={item} className="flex gap-0 justify-center rounded-xl overflow-hidden border border-border max-w-[700px] mx-auto bg-card">
          {socialProof.map((s, i, arr) => (
            <div
              key={i}
              className="flex-1 text-center py-4 px-2.5"
              style={{ borderRight: i < arr.length - 1 ? "1px solid hsl(var(--border))" : "none" }}
            >
              <div className="font-extrabold text-xl tracking-[-0.02em] text-blue-400">{s.n}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
