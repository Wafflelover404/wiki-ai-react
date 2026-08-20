"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/i18n";
import { Brain, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LandingNavProps {
  scrolled: boolean;
}

export default function LandingNav({ scrolled }: LandingNavProps) {
  const { t, locale, changeLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Standard hydration-safety mount flag (defers client-only rendering
  // until after the initial SSR-matching render).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const links = [
    { href: "#features", label: t("landing.nav.features") },
    { href: "#how-it-works", label: t("landing.nav.howItWorks") },
    { href: "#integrations", label: t("landing.nav.integrations") },
    { href: "#pricing", label: t("landing.nav.pricing") },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5%] h-[60px] transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Brain size={16} color="white" />
          </div>
          <span className="font-extrabold text-lg tracking-[-0.02em]">
            <span className="text-gradient-blue">Wiki</span>
            <span className="text-foreground">AI</span>
          </span>
        </a>

        {/* Center links (desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-7 items-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex gap-2.5 items-center">
          {/* Lang toggle */}
          <button
            onClick={() => changeLanguage(locale === "en" ? "ru" : "en")}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-transparent text-foreground text-xs hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <Globe size={14} />
            {locale.toUpperCase()}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-border bg-transparent text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
            title="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun size={14} /> : <Moon size={14} />)}
          </button>

          {/* CTA (desktop) */}
          <button
            onClick={() => router.push("/login")}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:shadow-[0_8px_28px_rgba(59,130,246,0.35)] hover:-translate-y-px transition-all"
          >
            {t("landing.nav.getStarted")}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer z-[200]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-[22px] h-[2px] bg-foreground rounded-sm"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-[22px] h-[2px] bg-foreground rounded-sm"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-[22px] h-[2px] bg-foreground rounded-sm"
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] z-[90] bg-background/97 backdrop-blur-xl border-t border-border flex flex-col px-[6%] py-8 gap-0 overflow-y-auto md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-[18px] border-b border-border text-foreground no-underline text-lg font-semibold tracking-[-0.01em]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={() => { setMobileOpen(false); router.push("/login"); }}
                className="w-full justify-center py-3.5 text-[15px] font-semibold rounded-lg bg-primary text-primary-foreground hover:shadow-[0_8px_28px_rgba(59,130,246,0.35)] transition-all"
              >
                {t("landing.nav.getStarted")}
              </button>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex-1 justify-center flex items-center gap-1.5 py-3 rounded-lg border border-border text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all text-sm"
                >
                  {mounted && (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
                  <span>{mounted && (theme === "dark" ? "Light" : "Dark")}</span>
                </button>
                <button
                  onClick={() => changeLanguage(locale === "en" ? "ru" : "en")}
                  className="flex-1 justify-center flex items-center gap-1.5 py-3 rounded-lg border border-border text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all text-sm"
                >
                  <Globe size={14} /> {locale.toUpperCase()}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
