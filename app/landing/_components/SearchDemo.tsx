"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/src/i18n";
import type { QAItem } from "../_data/search-qa";

export default function SearchDemo({ qa }: { qa: QAItem[] }) {
  const { t } = useTranslation();
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState("");
  const [searching, setSearching] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const cycleRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const cycle = () => {
      const nextQi = (qi + 1) % qa.length;
      setResultsVisible(false);
      setSearching(false);
      setTimeout(() => {
        setTyped("");
        const q = t(qa[nextQi].qKey);
        let i = 0;
        const typeIv = setInterval(() => {
          i++;
          setTyped(q.slice(0, i));
          if (i >= q.length) {
            clearInterval(typeIv);
            setSearching(true);
            setTimeout(() => {
              setSearching(false);
              setQi(nextQi);
              setResultsVisible(true);
            }, 900);
          }
        }, 38);
      }, 300);
    };
    cycleRef.current = setTimeout(cycle, 3600);
    return () => clearTimeout(cycleRef.current);
  }, [qi]);

  useEffect(() => {
    const q = t(qa[0].qKey);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(q.slice(0, i));
      if (i >= q.length) {
        clearInterval(iv);
        setResultsVisible(true);
      }
    }, 40);
    return () => clearInterval(iv);
  }, []);

  const cur = qa[qi];

  return (
    <div className="w-[580px] max-w-full mx-auto relative" style={{ height: 400 }}>
      {/* Search bar */}
      <div className="flex items-center gap-3 bg-card border border-primary/20 rounded-xl px-4 py-3 mb-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 min-h-[48px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="flex-1 text-[13px] text-foreground font-mono leading-relaxed min-h-[1.5em] flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
          {typed}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "steps(1)" }}
          >
            |
          </motion.span>
        </span>
        {searching ? (
          <motion.div
            className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <span className="text-[10px] bg-primary/10 text-blue-400 rounded-md px-2 py-0.5 font-mono font-semibold tracking-[0.05em] whitespace-nowrap">
            AI AGENT
          </span>
        )}
      </div>

      {/* Results */}
      <div
        className="flex flex-col gap-2 overflow-hidden relative w-full"
        style={{ height: 380, opacity: resultsVisible ? 1 : 0, transition: "opacity 0.25s ease" }}
      >
        <AnimatePresence mode="wait">
          {resultsVisible &&
            cur.results.map((r, i) => (
              <motion.div
                key={`${qi}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-3.5"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <span className="text-[13px] font-semibold text-foreground">
                      {t(r.docKey)}
                    </span>
                    <span className="text-[11px] text-muted-foreground ml-2 font-mono">
                      {r.pageKey}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-9 h-[3px] bg-primary/15 rounded-sm">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm"
                        initial={{ width: 0 }}
                        animate={{ width: `${r.score}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[11px] text-blue-400 font-mono">{r.score}%</span>
                  </div>
                </div>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                  {t(r.snippetKey)}
                </p>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
