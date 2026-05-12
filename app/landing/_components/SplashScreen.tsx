"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

export default function SplashScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-background text-center px-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-[68px] h-[68px] rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.45)]">
              <Brain size={30} color="white" />
            </div>
            <motion.div
              className="absolute -inset-2.5 rounded-3xl border border-blue-400/25"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <div className="text-[22px] font-extrabold tracking-[-0.02em] mb-1.5">
            <span className="text-gradient-blue">Wiki</span>
            <span className="text-foreground">AI</span>
          </div>

          <p className="text-xs text-muted-foreground font-mono mb-8">
            loading knowledge engine...
          </p>

          <div className="w-[200px] h-[2px] bg-border rounded-sm overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-sm"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.9, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
