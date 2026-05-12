"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/src/i18n";

interface TermLine { d: number; c: string; tKey: string; }

export default function TerminalDemo() {
  const { t } = useTranslation();
  const [shown, setShown] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const TERM_LINES: TermLine[] = [
    { d: 0, c: "text-muted-foreground", tKey: "landing.aiAgentBridge.terminal.logs.0" },
    { d: 500, c: "text-muted-foreground/60", tKey: "landing.aiAgentBridge.terminal.logs.1" },
    { d: 1100, c: "text-blue-400", tKey: "landing.aiAgentBridge.terminal.logs.2" },
    { d: 1700, c: "text-muted-foreground", tKey: "landing.aiAgentBridge.terminal.logs.3" },
    { d: 2200, c: "text-blue-400", tKey: "landing.aiAgentBridge.terminal.logs.4" },
    { d: 2800, c: "text-green-400", tKey: "landing.aiAgentBridge.terminal.logs.5" },
    { d: 3300, c: "text-foreground", tKey: "landing.aiAgentBridge.terminal.logs.6" },
    { d: 3400, c: "text-foreground", tKey: "landing.aiAgentBridge.terminal.logs.7" },
    { d: 3900, c: "text-muted-foreground/60", tKey: "landing.aiAgentBridge.terminal.logs.8" },
    { d: 4400, c: "text-amber-300", tKey: "landing.aiAgentBridge.terminal.logs.9" },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          TERM_LINES.forEach((l, i) =>
            setTimeout(() => setShown((v) => [...v, i]), l.d)
          );
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const restart = () => {
    setShown([]);
    started.current = false;
    setTimeout(() => {
      started.current = true;
      TERM_LINES.forEach((l, i) =>
        setTimeout(() => setShown((v) => [...v, i]), l.d)
      );
    }, 100);
  };

  return (
    <div
      ref={ref}
      className="bg-[#06080f] dark:bg-[#06080f] border border-primary/20 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] font-mono"
    >
      {/* Title bar */}
      <div className="bg-[#0b0f1c] px-4 py-2.5 flex items-center gap-2 border-b border-primary/8">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
        <span className="ml-2.5 text-[11px] text-muted-foreground">
          {t("landing.aiAgentBridge.terminal.title")}
        </span>
        <button
          onClick={restart}
          className="ml-auto bg-transparent border-none text-muted-foreground cursor-pointer text-[11px] hover:text-foreground transition-colors"
        >
          {t("landing.aiAgentBridge.terminal.replay")}
        </button>
      </div>

      {/* Lines */}
      <div className="px-5 py-4 min-h-[280px]">
        {TERM_LINES.map((l, i) => (
          <div
            key={i}
            className={`text-[12.5px] leading-relaxed whitespace-pre-wrap transition-all duration-[280ms] ${
              shown.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            } ${l.c}`}
          >
            {t(l.tKey)}
            {i === TERM_LINES.length - 1 && shown.includes(i) && (
              <span className="animate-pulse ml-0.5" style={{ animationDuration: "1s" }}>
                █
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
