"use client";
import { useState, useEffect, useRef } from "react";

export function useCounter({
  to,
  duration = 1600,
  decimals = 0,
  startOnView = true,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  startOnView?: boolean;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);
  const [inView, setInView] = useState(!startOnView);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!inView || fired.current) return;
    fired.current = true;
    const steps = 50;
    let i = 0;
    const t = setInterval(() => {
      i++;
      const p = i / steps;
      setN(parseFloat((to * (1 - Math.pow(1 - p, 3))).toFixed(decimals)));
      if (i >= steps) {
        setN(to);
        clearInterval(t);
      }
    }, duration / steps);
    return () => clearInterval(t);
  }, [inView, to, duration, decimals]);

  return { ref, value: n, decimals };
}
