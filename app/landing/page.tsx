"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "@/src/i18n";

/* ═══════════════════════════════════════════════════════════
   SCOPED CSS  —  shadcn/ui dark palette + custom animations
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap');

.wiki-ai-landing *, .wiki-ai-landing *::before, .wiki-ai-landing *::after { box-sizing: border-box; margin: 0; padding: 0; }
.wiki-ai-landing { scroll-behavior: smooth; }

/* ── shadcn dark token map ── */
:root {
  --bg:              #09090b;
  --bg2:             #0f1117;
  --card:            #111318;
  --card2:           #161b26;
  --border:          rgba(255,255,255,0.06);
  --border-hi:       rgba(59,130,246,0.35);
  --blue:            #3b82f6;
  --blue-light:      #60a5fa;
  --blue-dim:        rgba(59,130,246,0.12);
  --sky:             #0ea5e9;
  --indigo:          #6366f1;
  --text:            #f1f5f9;
  --text-muted:      #64748b;
  --text-subtle:     #334155;
  --green:           #22c55e;
  --amber:           #f59e0b;
  --rose:            #f43f5e;
  --radius:          10px;
  --text-dim:        #94a3b8;
  --text-faint:      #475569;
  --footer-link:     #334155;
  --footer-link-h:   #64748b;
  --footer-copy:     #1e293b;
  --nav-scrolled-bg: rgba(9,9,11,0.82);
  --drawer-bg:       rgba(9,9,11,0.97);
  --terminal-bg:     #06080f;
  --terminal-bar:    #0b0f1c;
  --terminal-border: rgba(59,130,246,0.18);
  --terminal-divider:rgba(59,130,246,0.08);
  --terminal-btn:    #334155;
  --search-bg:       #161b26;
  --search-text:     #f1f5f9;
  --result-doc:      #f1f5f9;
  --result-page:     #334155;
  --result-snippet:  #64748b;
  --journey-role:    #94a3b8;
  --journey-q-text:  #94a3b8;
  --journey-a-text:  #86efac;
  --compare-hi-text: #f1f5f9;
  --compare-lo-text: #64748b;
  --compare-lo-mark: #334155;
  --stat-num:        #334155;
}

.wiki-ai-landing {
  background: var(--bg);
  color: var(--text);
  font-family: 'Geist', system-ui, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.wiki-ai-landing ::-webkit-scrollbar { width: 3px; }
.wiki-ai-landing ::-webkit-scrollbar-track { background: var(--bg); }
.wiki-ai-landing ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

/* ── Keyframes ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes floatY   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
@keyframes shimmer  { 0% { background-position:-300% center; } 100% { background-position:300% center; } }
@keyframes blink    { 0%,100%{opacity:1;} 50%{opacity:0;} }
@keyframes spin     { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
@keyframes spin-r   { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} }
@keyframes pulse-dot{ 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(.8);} }
@keyframes flow-x   { 0%{transform:translateX(-100%);} 100%{transform:translateX(300%);} }
@keyframes flow-y   { 0%{transform:translateY(-100%);} 100%{transform:translateY(300%);} }
@keyframes count    { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
@keyframes typing   { from{width:0;} to{width:100%;} }
@keyframes bar-grow { from{width:0;} to{width:var(--w);} }

/* ── Scroll reveal ── */
.wiki-ai-landing .r   { opacity:0; transform:translateY(22px); transition:opacity .6s ease,transform .6s ease; }
.wiki-ai-landing .r-l { opacity:0; transform:translateX(-28px); transition:opacity .6s ease,transform .6s ease; }
.wiki-ai-landing .r-r { opacity:0; transform:translateX(28px);  transition:opacity .6s ease,transform .6s ease; }
.wiki-ai-landing .r.on,.wiki-ai-landing .r-l.on,.wiki-ai-landing .r-r.on { opacity:1; transform:none; }

/* ── Typography ── */
.wiki-ai-landing .display {
  font-size: clamp(2.6rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
}
.wiki-ai-landing .h2 {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 750;
  line-height: 1.12;
  letter-spacing: -0.025em;
}
.wiki-ai-landing .mono { font-family: 'Geist Mono', monospace; }

/* ── Gradient text ── */
.wiki-ai-landing .g-blue {
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--sky) 60%, #38bdf8 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.wiki-ai-landing .g-indigo {
  background: linear-gradient(135deg, #818cf8, var(--indigo), var(--blue));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.wiki-ai-landing .g-shimmer {
  background: linear-gradient(90deg, var(--text) 0%, var(--blue-light) 30%, var(--sky) 50%, var(--blue-light) 70%, var(--text) 100%);
  background-size: 300% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  animation: shimmer 4s linear infinite;
}

/* ── Surface / glass ── */
.wiki-ai-landing .card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.wiki-ai-landing .card-hi {
  background: var(--card2);
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  box-shadow: 0 0 40px rgba(59,130,246,0.08);
}
.wiki-ai-landing .glass {
  background: var(--nav-scrolled-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

/* ── Buttons ── */
.wiki-ai-landing .btn {
  display: inline-flex; align-items:center; gap:8px;
  padding: 11px 24px; border-radius: 8px; border:none;
  font-family:'Geist',sans-serif; font-size:14px; font-weight:600;
  cursor:pointer; transition:all .2s; letter-spacing:-.01em;
}
.wiki-ai-landing .btn-blue {
  background: var(--blue); color:#fff;
}
.wiki-ai-landing .btn-blue:hover { background:#2563eb; box-shadow:0 8px 28px rgba(59,130,246,0.35); transform:translateY(-1px); }
.wiki-ai-landing .btn-outline {
  background:transparent; color:var(--text);
  border:1px solid var(--border); padding:11px 24px;
}
.wiki-ai-landing .btn-outline:hover { border-color:var(--border-hi); background:var(--blue-dim); }
.wiki-ai-landing .btn-lg { padding:14px 32px; font-size:15px; border-radius:10px; }

/* ── Tag / badge ── */
.wiki-ai-landing .tag {
  display:inline-flex; align-items:center; gap:6px;
  padding:4px 12px; border-radius:100px;
  font-size:11px; font-weight:600; letter-spacing:.07em; text-transform:uppercase;
  font-family:'Geist Mono',monospace;
  background: var(--blue-dim); color:var(--blue-light);
  border:1px solid rgba(59,130,246,0.22);
}
.wiki-ai-landing .tag-blue-large { 
  display:inline-flex; align-items:center; gap:6px;
  padding:8px 16px; border-radius:100px;
  font-size:18px; font-weight:600; letter-spacing:.07em; text-transform:uppercase;
  background: var(--blue-dim); color:var(--blue-light);
  border:1px solid rgba(59,130,246,0.22);
}
.wiki-ai-landing .tag-green { background:rgba(34,197,94,0.08); color:#4ade80; border-color:rgba(34,197,94,0.2); }
.wiki-ai-landing .tag-amber { background:rgba(245,158,11,0.08); color:#fbbf24; border-color:rgba(245,158,11,0.2); }
.wiki-ai-landing .tag-indigo{ background:rgba(99,102,241,0.1); color:#a5b4fc; border-color:rgba(99,102,241,0.25); }

/* ── Grid bg ── */
.wiki-ai-landing .grid-bg {
  background-image:
    linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ── Divider ── */
.wiki-ai-landing .divider { height:1px; background:var(--border); width:100%; }
.wiki-ai-landing .divider-glow { height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,0.3),transparent); width:100%; }

/* ── Integration card ── */
.wiki-ai-landing .int-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:12px; padding:16px 18px;
  display:flex; align-items:center; gap:12px;
  transition: border-color .25s, transform .25s, box-shadow .25s;
  cursor:default;
}
.wiki-ai-landing .int-card:hover {
  border-color:rgba(59,130,246,0.3);
  transform:translateY(-2px);
  box-shadow:0 12px 32px rgba(0,0,0,0.4);
}

/* ── Feature card ── */
.wiki-ai-landing .feat-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:14px; padding:28px;
  transition:border-color .25s, transform .3s, box-shadow .3s;
  position:relative; overflow:hidden;
}
.wiki-ai-landing .feat-card::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(135deg,rgba(59,130,246,0.05),transparent 55%);
  opacity:0; transition:opacity .3s;
}
.wiki-ai-landing .feat-card:hover { border-color:rgba(59,130,246,0.28); transform:translateY(-3px); box-shadow:0 20px 50px rgba(0,0,0,0.45); }
.wiki-ai-landing .feat-card:hover::before { opacity:1; }

/* ── Noise ── */
.wiki-ai-landing .noise {
  position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── Splash ── */
.wiki-ai-landing .splash {
  position:fixed; inset:0; z-index:9998;
  background:var(--bg);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center;
  padding:0 24px;
}
.wiki-ai-landing .splash-bar { width:200px; height:2px; background:var(--border); border-radius:2px; overflow:hidden; margin-top:32px; }
.wiki-ai-landing .splash-bar-fill { height:100%; background:linear-gradient(90deg,var(--blue),var(--sky)); border-radius:2px; animation:typing 1.9s ease forwards; }

/* ── Nav ── */
.wiki-ai-landing .nav {
  position:fixed; top:0; left:0; right:0; z-index:100;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 5%; height:60px;
  transition:background .3s, border-color .3s;
}
.wiki-ai-landing .nav.scrolled {
  background:var(--nav-scrolled-bg);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}

/* ── Pricing ── */
.wiki-ai-landing .price-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:16px; padding:36px 30px;
  transition:transform .3s, box-shadow .3s, border-color .3s;
  position:relative;
}
.wiki-ai-landing .price-card:hover { transform:translateY(-4px); box-shadow:0 28px 70px rgba(0,0,0,0.5); }
.wiki-ai-landing .price-card.featured { border-color:rgba(59,130,246,0.4); background:linear-gradient(160deg,rgba(59,130,246,0.06),var(--card)); }
.wiki-ai-landing .price-card.featured:hover { box-shadow:0 28px 70px rgba(59,130,246,0.12); }

/* ── Hide/show helpers ── */
.wiki-ai-landing .mobile-only { display:none; }

@media (max-width:768px) {
  .wiki-ai-landing .display { font-size:2rem; line-height:1.1; }
  .wiki-ai-landing .h2 { font-size:1.5rem; }
  .wiki-ai-landing .hide-mobile { display:none !important; }
  .wiki-ai-landing .mobile-only { display:block; }
  .wiki-ai-landing .mobile-menu-btn { display:flex; }
  /* Hide language button in nav on mobile — it lives in the drawer */
  .wiki-ai-landing .lang-btn-nav { display:none !important; }

  /* Section padding */
  .wiki-ai-landing section { padding-left:5% !important; padding-right:5% !important; }
  .wiki-ai-landing section[style*="padding:96px"] { padding-top:52px !important; padding-bottom:52px !important; }
  .wiki-ai-landing section[style*="padding:80px"] { padding-top:44px !important; padding-bottom:44px !important; }
  .wiki-ai-landing section[style*="padding:72px"] { padding-top:40px !important; padding-bottom:40px !important; }
  .wiki-ai-landing section[style*="padding:80px 6% 100px"] { padding-top:44px !important; padding-bottom:56px !important; }

  /* Shrink the divider-glow spacer */
  .wiki-ai-landing .section-divider { margin-bottom:36px !important; }

  /* Two-col → single col */
  .wiki-ai-landing .two-col-grid {
    grid-template-columns:1fr !important;
    gap:32px !important;
  }
  .wiki-ai-landing .two-col-grid .r-l,
  .wiki-ai-landing .two-col-grid .r-r { order:unset !important; }

  /* Three-col comparison → single col */
  .wiki-ai-landing .three-col-grid { grid-template-columns:1fr !important; }
  .wiki-ai-landing .three-col-grid > div { padding:22px 18px !important; }

  /* Cards */
  .wiki-ai-landing .price-card { padding:24px 18px; }
  .wiki-ai-landing .feat-card  { padding:20px 18px; }

  /* CTA box */
  .wiki-ai-landing .mobile-cta-box { padding:36px 22px !important; }

  /* Social proof bar → 2x2 grid */
  .wiki-ai-landing .social-proof-bar {
    display:grid !important;
    grid-template-columns:1fr 1fr !important;
    max-width:100% !important;
  }
  .wiki-ai-landing .social-proof-bar > div { border-right:none !important; border-bottom:1px solid var(--border); }
  .wiki-ai-landing .social-proof-bar > div:nth-child(odd)  { border-right:1px solid var(--border) !important; }
  .wiki-ai-landing .social-proof-bar > div:nth-child(3),
  .wiki-ai-landing .social-proof-bar > div:nth-child(4)    { border-bottom:none !important; }

  /* SearchDemo — compact height */
  .wiki-ai-landing .search-demo-wrap    { height:auto !important; }
  .wiki-ai-landing .search-results-wrap { height:auto !important; overflow:visible !important; }

  /* Footer */
  .wiki-ai-landing footer { padding:36px 5% 24px !important; }
  .wiki-ai-landing .footer-top-row { flex-direction:column !important; gap:24px !important; }
  .wiki-ai-landing .footer-link-cols {
    display:grid !important;
    grid-template-columns:repeat(3,1fr) !important;
    gap:18px !important;
    width:100% !important;
  }

  /* Nav */
  .wiki-ai-landing .nav { padding:0 4% !important; }
  .wiki-ai-landing .btn-lg { padding:12px 22px !important; font-size:14px !important; }

  /* Stats grid */
  .wiki-ai-landing .stats-grid { grid-template-columns:1fr 1fr !important; }

  /* Use-cases / integrations detail row */
  .wiki-ai-landing .auto-grid-240 { grid-template-columns:1fr 1fr !important; }
}

/* ── Mobile nav button ── */
.wiki-ai-landing .mobile-menu-btn {
  display:none;
  flex-direction:column;
  gap:5px;
  padding:8px;
  cursor:pointer;
  background:transparent;
  border:none;
  z-index:200;
}
.wiki-ai-landing .mobile-menu-btn span {
  display:block;
  width:22px;
  height:2px;
  background:var(--text);
  border-radius:2px;
  transition:all .3s;
}
.wiki-ai-landing .mobile-menu-btn.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.wiki-ai-landing .mobile-menu-btn.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.wiki-ai-landing .mobile-menu-btn.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

/* ── Mobile drawer ── */
.wiki-ai-landing .mobile-drawer {
  display:none;
  position:fixed;
  inset:0;
  top:60px;
  z-index:90;
  background:var(--drawer-bg);
  backdrop-filter:blur(20px);
  border-top:1px solid var(--border);
  flex-direction:column;
  padding:32px 6%;
  gap:0;
  overflow-y:auto;
  animation:fadeIn .2s ease;
}
.wiki-ai-landing .mobile-drawer.open { display:flex; }
.wiki-ai-landing .mobile-drawer a {
  display:block;
  padding:18px 0;
  border-bottom:1px solid var(--border);
  color:var(--text);
  text-decoration:none;
  font-size:18px;
  font-weight:600;
  letter-spacing:-.01em;
  transition:color .2s;
}
.wiki-ai-landing .mobile-drawer a:last-of-type { border-bottom:none; }

/* ── Responsive layout classes ── */
.wiki-ai-landing .two-col-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:64px;
  align-items:center;
}
.wiki-ai-landing .three-col-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1px;
  background:var(--border);
  border-radius:14px;
  overflow:hidden;
}
.wiki-ai-landing .mobile-cta-box { padding:64px 48px; }
.wiki-ai-landing .social-proof-bar {
  display:flex;
  gap:0;
  justify-content:center;
  border-radius:12px;
  overflow:hidden;
  border:1px solid var(--border);
  max-width:700px;
  margin:0 auto;
  background:var(--card);
}
`;

/* ═══════════════════════════════════════════════════════════
   MOBILE HOOK
═══════════════════════════════════════════════════════════ */
function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".r,.r-l,.r-r");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
      { threshold: 0.01, rootMargin: '50px' }
    );
    
    // Check elements already in viewport
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        el.classList.add("on");
      } else {
        io.observe(el);
      }
    });
    
    // Fallback: make any remaining elements visible after 1 second
    const fallback = setTimeout(() => {
      document.querySelectorAll(".r:not(.on), .r-l:not(.on), .r-r:not(.on)").forEach((el) => el.classList.add("on"));
    }, 1000);
    
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);
}

/* ═══════════════════════════════════════════════════════════
   COUNTER
═══════════════════════════════════════════════════════════ */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [n, setN] = useState<number>(0);
  const ref = useRef<HTMLElement | null>(null);
  const fired = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const dur = 1600, steps = 50;
        let i = 0;
        const t = setInterval(() => {
          i++; const p = i / steps;
          setN(parseFloat((to * (1 - Math.pow(1 - p, 3))).toFixed(decimals)));
          if (i >= steps) { setN(to); clearInterval(t); }
        }, dur / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, decimals]);
  return <span ref={ref}>{decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED TERMINAL
═══════════════════════════════════════════════════════════ */
function Terminal() {
  const { t } = useTranslation();
  const [shown, setShown] = useState<number[]>([]);
  const ref = useRef(null);
  const started = useRef(false);
  const TERM = [
    { d:0,    c:"#64748b", t:t('landing.aiAgentBridge.terminal.logs.0') },
    { d:500,  c:"#94a3b8", t:t('landing.aiAgentBridge.terminal.logs.1') },
    { d:1100, c:"#60a5fa", t:t('landing.aiAgentBridge.terminal.logs.2') },
    { d:1700, c:"#64748b", t:t('landing.aiAgentBridge.terminal.logs.3') },
    { d:2200, c:"#60a5fa", t:t('landing.aiAgentBridge.terminal.logs.4') },
    { d:2800, c:"#22c55e", t:t('landing.aiAgentBridge.terminal.logs.5') },
    { d:3300, c:"#f1f5f9", t:t('landing.aiAgentBridge.terminal.logs.6') },
    { d:3400, c:"#f1f5f9", t:t('landing.aiAgentBridge.terminal.logs.7') },
    { d:3900, c:"#94a3b8", t:t('landing.aiAgentBridge.terminal.logs.8') },
    { d:4400, c:"#f59e0b", t:t('landing.aiAgentBridge.terminal.logs.9') },
  ];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        TERM.forEach((l, i) => setTimeout(() => setShown((v) => [...v, i]), l.d));
      }
    }, { threshold: 0.25 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const restart = () => {
    setShown([]);
    started.current = false;
    setTimeout(() => {
      started.current = true;
      TERM.forEach((l, i) => setTimeout(() => setShown((v) => [...v, i]), l.d));
    }, 100);
  };

  return (
    <div ref={ref} style={{ background:"var(--terminal-bg)", border:"1px solid var(--terminal-border)", borderRadius:14, overflow:"hidden", boxShadow:"0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.06)", fontFamily:"'Geist Mono',monospace" }}>
      {/* Bar */}
      <div style={{ background:"var(--terminal-bar)", padding:"11px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid var(--terminal-divider)" }}>
        <span style={{ width:11,height:11,borderRadius:"50%",background:"#ef4444",display:"block" }} />
        <span style={{ width:11,height:11,borderRadius:"50%",background:"#f59e0b",display:"block" }} />
        <span style={{ width:11,height:11,borderRadius:"50%",background:"#22c55e",display:"block" }} />
        <span style={{ marginLeft:10,fontSize:11,color:"var(--terminal-btn)" }}>{t('landing.aiAgentBridge.terminal.title')}</span>
        <button onClick={restart} style={{ marginLeft:"auto",background:"none",border:"none",color:"var(--terminal-btn)",cursor:"pointer",fontSize:11 }}>{t('landing.aiAgentBridge.terminal.replay')}</button>
      </div>
      {/* Lines */}
      <div style={{ padding:"18px 20px", minHeight:280 }}>
        {TERM.map((l, i) => (
          <div key={i} style={{ opacity:shown.includes(i)?1:0, transform:shown.includes(i)?"none":"translateY(4px)", transition:"opacity .28s ease,transform .28s ease", color:l.c, fontSize:12.5, lineHeight:1.7, whiteSpace:"pre-wrap" }}>
            {l.t}
            {i===TERM.length-1&&shown.includes(i)&&<span style={{ animation:"blink 1s step-end infinite", marginLeft:1 }}>█</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HubDiagram() {
  const { t } = useTranslation();
  const [tick, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 1200); return () => clearInterval(iv); }, []);
  
  const sources = [
    { icon:"🔷", label:t('landing.integrationHub.sources.bitrix'), sub:t('landing.integrationHub.sources.bitrixSub'), color:"#3b82f6" },
    { icon:"�", label:t('landing.integrationHub.sources.erp'), sub:t('landing.integrationHub.sources.erpSub'), color:"#3b82f6" },
    { icon:"�", label:t('landing.integrationHub.sources.drive'), sub:t('landing.integrationHub.sources.driveSub'), color:"#3b82f6" },
    { icon:"�", label:t('landing.integrationHub.sources.confluence'), sub:t('landing.integrationHub.sources.confluenceSub'), color:"#3b82f6" },
    { icon:"�", label:t('landing.integrationHub.sources.email'), sub:t('landing.integrationHub.sources.emailSub'), color:"#3b82f6" },
    { icon:"�", label:t('landing.integrationHub.sources.sharepoint'), sub:t('landing.integrationHub.sources.sharepointSub'), color:"#3b82f6" },
  ];
  const outputs = [
    { icon:"💬", label:t('landing.integrationHub.outputs.telegram'), sub:t('landing.integrationHub.outputs.telegramSub'), color:"#22c55e" },
    { icon:"🛒", label:t('landing.integrationHub.outputs.shop'), sub:t('landing.integrationHub.outputs.shopSub'), color:"#22c55e" },
    { icon:"📱", label:t('landing.integrationHub.outputs.slack'), sub:t('landing.integrationHub.outputs.slackSub'), color:"#22c55e" },
    { icon:"🌐", label:t('landing.integrationHub.outputs.website'), sub:t('landing.integrationHub.outputs.websiteSub'), color:"#22c55e" },
    { icon:"📞", label:t('landing.integrationHub.outputs.callCenter'), sub:t('landing.integrationHub.outputs.callCenterSub'), color:"#22c55e" },
    { icon:"🔌", label:t('landing.integrationHub.outputs.api'), sub:t('landing.integrationHub.outputs.apiSub'), color:"#22c55e" },
  ];

  const activeIn = tick % sources.length;
  const activeOut = tick % outputs.length;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:20, alignItems:"center", maxWidth:900, margin:"0 auto" }}>
      {/* INPUTS */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ fontSize:11, color:"var(--stat-num)", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:4, textAlign:"right" }}>{t('landing.integrationHub.dataSources')}</div>
        {sources.map((s, i) => (
          <div key={i} className="int-card" style={{
            justifyContent:"flex-end",
            borderColor: i===activeIn ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.06)",
            boxShadow: i===activeIn ? "0 0 20px rgba(59,130,246,0.15)" : "none",
            transition:"all .4s ease"
          }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, fontWeight:600, color: i===activeIn ? "var(--text)" : "var(--text-dim)" }}>{s.label}</div>
              <div style={{ fontSize:11, color:"var(--stat-num)" }}>{s.sub}</div>
            </div>
            <div style={{ width:36,height:36,borderRadius:9,background:"rgba(59,130,246,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18, flexShrink:0 }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* CENTER HUB */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"0 8px" }}>
        {/* Lines up */}
        <div style={{ width:1,height:60,background:"linear-gradient(to top,rgba(59,130,246,0.5),transparent)" }} />
        {/* Core orb */}
        <div style={{ position:"relative", width:100, height:100 }}>
          {/* Outer ring */}
          <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(59,130,246,0.2)", animation:"spin 12s linear infinite" }} />
          {/* Inner ring */}
          <div style={{ position:"absolute",inset:10,borderRadius:"50%",border:"1px solid rgba(59,130,246,0.15)", animation:"spin-r 8s linear infinite" }} />
          {/* Glow */}
          <div style={{ position:"absolute",inset:0,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.18),transparent 70%)" }} />
          {/* Center */}
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <div style={{ fontSize:28, lineHeight:1 }}>🧠</div>
            <div style={{ fontSize:9, color:"#60a5fa", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", marginTop:3 }}>WikiAI</div>
          </div>
        </div>
        {/* Lines down */}
        <div style={{ width:1,height:60,background:"linear-gradient(to bottom,rgba(59,130,246,0.5),transparent)" }} />
        <div style={{ fontSize:9, color:"var(--text-muted)", fontFamily:"'Geist Mono',monospace", letterSpacing:".1em", textTransform:"uppercase" }}>{t('landing.integrationHub.knowledgeHub')}</div>
      </div>

      {/* OUTPUTS */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ fontSize:11, color:"var(--stat-num)", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:4 }}>{t('landing.integrationHub.deliveryChannels')}</div>
        {outputs.map((s, i) => (
          <div key={i} className="int-card" style={{
            borderColor: i===activeOut ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.06)",
            boxShadow: i===activeOut ? "0 0 20px rgba(34,197,94,0.12)" : "none",
            transition:"all .4s ease"
          }}>
            <div style={{ width:36,height:36,borderRadius:9,background:"rgba(34,197,94,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color: i===activeOut ? "var(--text)" : "var(--text-dim)" }}>{s.label}</div>
              <div style={{ fontSize:11, color:"var(--stat-num)" }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE INTEGRATION HUB (compact stack layout)
═══════════════════════════════════════════════════════════ */
function MobileHubDiagram() {
  const { t } = useTranslation();
  const [tick, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 1200); return () => clearInterval(iv); }, []);
  
  const sources = [
    { icon:"📄", label:t('landing.integrationHub.sources.pdf'), sub:t('landing.integrationHub.sources.pdfSub'), color:"#3b82f6" },
    { icon:"📝", label:t('landing.integrationHub.sources.docx'), sub:t('landing.integrationHub.sources.docxSub'), color:"#3b82f6" },
    { icon:"🌐", label:t('landing.integrationHub.sources.website'), sub:t('landing.integrationHub.sources.websiteSub'), color:"#3b82f6" },
    { icon:"📧", label:t('landing.integrationHub.sources.email'), sub:t('landing.integrationHub.sources.emailSub'), color:"#3b82f6" },
    { icon:"📂", label:t('landing.integrationHub.sources.sharepoint'), sub:t('landing.integrationHub.sources.sharepointSub'), color:"#3b82f6" },
  ];
  
  const outputs = [
    { icon:"💬", label:t('landing.integrationHub.outputs.telegram'), sub:t('landing.integrationHub.outputs.telegramSub'), color:"#22c55e" },
    { icon:"🛒", label:t('landing.integrationHub.outputs.shop'), sub:t('landing.integrationHub.outputs.shopSub'), color:"#22c55e" },
    { icon:"📱", label:t('landing.integrationHub.outputs.slack'), sub:t('landing.integrationHub.outputs.slackSub'), color:"#22c55e" },
    { icon:"🌐", label:t('landing.integrationHub.outputs.website'), sub:t('landing.integrationHub.outputs.websiteSub'), color:"#22c55e" },
    { icon:"📞", label:t('landing.integrationHub.outputs.callCenter'), sub:t('landing.integrationHub.outputs.callCenterSub'), color:"#22c55e" },
    { icon:"🔌", label:t('landing.integrationHub.outputs.api'), sub:t('landing.integrationHub.outputs.apiSub'), color:"#22c55e" },
  ];
  
  const activeIn  = tick % sources.length;
  const activeOut = tick % outputs.length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:420, margin:"0 auto" }}>
      {/* Sources label */}
      <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", textAlign:"center" }}>Data Sources</div>
      {/* Sources grid 2-col */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {sources.map((s: any, i: number) => (
          <div key={i} style={{
            background:"var(--card)", border:`1px solid ${i===activeIn?"rgba(59,130,246,0.5)":"var(--border)"}`,
            borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:8,
            boxShadow: i===activeIn ? "0 0 16px rgba(59,130,246,0.12)" : "none",
            transition:"all .4s ease"
          }}>
            <div style={{ width:30,height:30,borderRadius:8,background:"rgba(59,130,246,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color: i===activeIn ? "var(--text)" : "var(--text-dim)" }}>{s.label}</div>
              <div style={{ fontSize:10, color:"var(--text-muted)" }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Center hub */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
        <div style={{ width:1, height:24, background:"linear-gradient(to bottom,rgba(59,130,246,0.5),transparent)" }} />
        <div style={{ position:"relative", width:80, height:80 }}>
          <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(59,130,246,0.2)",animation:"spin 12s linear infinite" }} />
          <div style={{ position:"absolute",inset:8,borderRadius:"50%",border:"1px solid rgba(59,130,246,0.15)",animation:"spin-r 8s linear infinite" }} />
          <div style={{ position:"absolute",inset:0,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.18),transparent 70%)" }} />
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <div style={{ fontSize:22, lineHeight:1 }}>🧠</div>
            <div style={{ fontSize:8, color:"#60a5fa", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", marginTop:2 }}>WikiAI</div>
          </div>
        </div>
        <div style={{ width:1, height:24, background:"linear-gradient(to bottom,rgba(59,130,246,0.5),transparent)" }} />
      </div>
      {/* Delivery label */}
      <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", textAlign:"center" }}>Delivery Channels</div>
      {/* Outputs grid 2-col */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {outputs.map((s: any, i: number) => (
          <div key={i} style={{
            background:"var(--card)", border:`1px solid ${i===activeOut?"rgba(34,197,94,0.4)":"var(--border)"}`,
            borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:8,
            boxShadow: i===activeOut ? "0 0 16px rgba(34,197,94,0.10)" : "none",
            transition:"all .4s ease"
          }}>
            <div style={{ width:30,height:30,borderRadius:8,background:"rgba(34,197,94,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color: i===activeOut ? "var(--text)" : "var(--text-dim)" }}>{s.label}</div>
              <div style={{ fontSize:10, color:"var(--text-muted)" }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SEARCH DEMO
═══════════════════════════════════════════════════════════ */
function SearchDemo({ qa }: { qa: any[] }) {
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState("");
  const [searching, setSearching] = useState(false);
  // Instead of toggling mount/unmount (which collapses height), track opacity
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    const cycle = () => {
      const nextQi = (qi + 1) % qa.length;
      // Fade out results, then clear & retype
      setResultsVisible(false);
      setSearching(false);
      setTimeout(() => {
        setTyped("");
        const q = qa[nextQi].q;
        let i = 0;
        const typeIv = setInterval(() => {
          i++;
          setTyped(q.slice(0, i));
          if (i >= q.length) {
            clearInterval(typeIv);
            setSearching(true);
            setTimeout(() => { setSearching(false); setQi(nextQi); setResultsVisible(true); }, 900);
          }
        }, 38);
      }, 300); // wait for fade-out before retyping
    };
    const iv = setTimeout(cycle, 3600);
    return () => clearTimeout(iv);
  }, [qi]);

  // initial type
  useEffect(() => {
    const q = qa[0].q;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(q.slice(0,i));
      if (i >= q.length) {
        clearInterval(iv);
        setResultsVisible(true);
      }
    }, 40);
    return () => clearInterval(iv);
  }, []);

  const cur = qa[qi];
  return (
    <div className="search-demo-wrap" style={{ width:580, maxWidth:"100%", margin:"0 auto", height:400, position:"relative" }}>
      {/* Search bar */}
      <div style={{ display:"flex", alignItems:"center", gap:12, background:"var(--search-bg)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:12, padding:"13px 18px", marginBottom:14, boxShadow:"0 20px 50px rgba(0,0,0,0.15)", position:"relative", zIndex:10, minHeight:48 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ flex:1, fontSize:13, color:"var(--search-text)", fontFamily:"'Geist Mono',monospace", lineHeight:1.5, minHeight:"1.5em", display:"flex", alignItems:"center", wordWrap:"break-word", overflowWrap:"break-word", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {typed}<span style={{ animation:"blink .85s step-end infinite" }}>|</span>
        </span>
        {searching
          ? <div style={{ width:16,height:16,borderRadius:"50%",border:"2px solid rgba(59,130,246,0.3)",borderTopColor:"#3b82f6",animation:"spin .7s linear infinite" }} />
          : <span style={{ fontSize:10, background:"rgba(59,130,246,0.1)", color:"#60a5fa", borderRadius:5, padding:"3px 8px", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".05em", whiteSpace:"nowrap" }}>AI AGENT</span>
        }
      </div>
      {/* Results — always rendered at fixed height to prevent layout shifts */}
      <div
        className="search-results-wrap"
        style={{
          display:"flex", flexDirection:"column", gap:9,
          /* Fixed height to prevent resizing */
          height:380,
          opacity: resultsVisible ? 1 : 0,
          transition:"opacity 0.25s ease",
          /* Prevent layout shift during typing animations */
          position:"relative",
          width:"100%",
          overflow:"hidden"
        }}
      >
        {cur.results.map((r: any, i: number) => (
          <div key={`${qi}-${i}`} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:11, padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
              <div>
                <span style={{ fontSize:13, fontWeight:600, color:"var(--result-doc)" }}>{r.doc}</span>
                <span style={{ fontSize:11, color:"var(--result-page)", marginLeft:8, fontFamily:"'Geist Mono',monospace" }}>{r.page}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <div style={{ width:36, height:3, background:"rgba(59,130,246,0.15)", borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${r.score}%`, background:"linear-gradient(90deg,#3b82f6,#60a5fa)", borderRadius:2, transition:"width .6s ease" }} />
                </div>
                <span style={{ fontSize:11, color:"#60a5fa", fontFamily:"'Geist Mono',monospace" }}>{r.score}%</span>
              </div>
            </div>
            <p style={{ fontSize:12.5, color:"var(--result-snippet)", lineHeight:1.55 }}>{r.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPLOYEE JOURNEY VISUAL
═══════════════════════════════════════════════════════════ */
function EmployeeJourney() {
  const { t } = useTranslation();
  const steps = [
    { who:"👤", role:t('landing.employeeJourney.roles.newEmployee'), q:t('landing.employeeJourney.roles.questions.vacation'), a:t('landing.employeeJourney.roles.answers.vacation'), color:"#3b82f6" },
    { who:"🧑‍💼", role:t('landing.employeeJourney.roles.salesManager'), q:t('landing.employeeJourney.roles.questions.discount'), a:t('landing.employeeJourney.roles.answers.discount'), color:"#6366f1" },
    { who:"🧑‍🔧", role:t('landing.employeeJourney.roles.supportAgent'), q:t('landing.employeeJourney.roles.questions.reset2fa'), a:t('landing.employeeJourney.roles.answers.reset2fa'), color:"#8b5cf6" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {steps.map((s, i) => (
        <div key={i} className="r" style={{ transitionDelay:`${i*120}ms`, background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{s.who}</div>
            <span style={{ fontSize:13,fontWeight:600,color:"var(--journey-role)" }}>{s.role}</span>
          </div>
          {/* Question bubble */}
          <div style={{ background:"rgba(59,130,246,0.06)",border:`1px solid ${s.color}22`,borderRadius:8,padding:"10px 14px",marginBottom:10,fontSize:13,color:"var(--journey-q-text)",fontStyle:"italic" }}>
            {s.q}
          </div>
          {/* Answer bubble */}
          <div style={{ background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"var(--journey-a-text)" }}>
            🧠 {s.a}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════ */
export default function WikiAILanding() {
  const translationHook = useTranslation();
  const { t, locale, changeLanguage, availableLanguages } = translationHook;
  
  // Define data arrays inside component where t function is available
  const FEATURES = [
    { icon:"🧠", title:t('landing.features.singleHub.title'), desc:t('landing.features.singleHub.desc'), tag:t('landing.features.singleHub.tag'), tagStyle:"" },
    { icon:"🔌", title:t('landing.features.integrations.title'), desc:t('landing.features.integrations.desc'), tag:t('landing.features.integrations.tag'), tagStyle:"tag-indigo" },
    { icon:"🤖", title:t('landing.features.aiAgent.title'), desc:t('landing.features.aiAgent.desc'), tag:t('landing.features.aiAgent.tag'), tagStyle:"tag-green" },
    { icon:"🔍", title:t('landing.features.semanticSearch.title'), desc:t('landing.features.semanticSearch.desc'), tag:t('landing.features.semanticSearch.tag'), tagStyle:"" },
    { icon:"🏢", title:t('landing.features.multiDepartment.title'), desc:t('landing.features.multiDepartment.desc'), tag:t('landing.features.multiDepartment.tag'), tagStyle:"tag-indigo" },
    { icon:"📊", title:t('landing.features.analytics.title'), desc:t('landing.features.analytics.desc'), tag:t('landing.features.analytics.tag'), tagStyle:"tag-amber" },
  ];
  
  const STATS = [
    { n:10, s:"x", label:t('landing.stats.faster'), desc:t('landing.stats.vsManual'), dec:0 },
    { n:40, s:"%", label:t('landing.stats.interruptions'), desc:t('landing.stats.colleaguesStop'), dec:0 },
    { n:0.4, s:"s", label:t('landing.stats.responseTime'), desc:t('landing.stats.aiQuery'), dec:1 },
    { n:99.9, s:"%", label:t('landing.stats.uptime'), desc:t('landing.stats.reliability'), dec:1 },
  ];
  
  // Define QA array inside component where t function is available
  const QA = [
    {
      q: t('landing.searchDemo.questions.vacation'),
      results: [
        { doc:t('landing.searchDemo.results.hrPolicy'), page:"§8.3", score:98, snippet:t('landing.searchDemo.results.vacationSnippet') },
        { doc:t('landing.searchDemo.results.employmentContract'), page:"Clause 12", score:87, snippet:t('landing.searchDemo.results.refundSnippet') },
      ]
    },
    {
      q: t('landing.searchDemo.questions.refund'),
      results: [
        { doc:t('landing.searchDemo.results.bitrixCrm'), page:"Ch.6", score:96, snippet:t('landing.searchDemo.results.processSnippet') },
        { doc:t('landing.searchDemo.results.financeSop'), page:"p.14", score:82, snippet:t('landing.searchDemo.results.approvalSnippet') },
      ]
    },
    {
      q: t('landing.searchDemo.questions.servers'),
      results: [
        { doc:t('landing.searchDemo.results.infrastructure'), page:"Live", score:99, snippet:t('landing.searchDemo.results.productionSnippet') },
        { doc:t('landing.searchDemo.results.deploymentRunbook'), page:"§2", score:78, snippet:t('landing.searchDemo.results.maintenanceSnippet') },
      ]
    },
  ];
  
  const USECASES = [
    { icon:"🆕", title:t('landing.useCases.onboarding.title'), desc:t('landing.useCases.onboarding.desc') },
    { icon:"🛒", title:t('landing.useCases.ecommerce.title'), desc:t('landing.useCases.ecommerce.desc') },
    { icon:"📞", title:t('landing.useCases.callCenter.title'), desc:t('landing.useCases.callCenter.desc') },
    { icon:"🤝", title:t('landing.useCases.sales.title'), desc:t('landing.useCases.sales.desc') },
  ];
  
  const KNOWLEDGE_TYPES = [
    t('landing.employeeJourney.knowledgeTypes.0'),
    t('landing.employeeJourney.knowledgeTypes.1'),
    t('landing.employeeJourney.knowledgeTypes.2'),
    t('landing.employeeJourney.knowledgeTypes.3'),
  ];
  
  const AI_AGENT_FEATURES = [
    t('landing.aiAgentBridge.features.0'),
    t('landing.aiAgentBridge.features.1'),
    t('landing.aiAgentBridge.features.2'),
    t('landing.aiAgentBridge.features.3'),
    t('landing.aiAgentBridge.features.4'),
  ];
  
  const PLANS = [
    { 
      name:t('landing.pricing.plans.starter.name'), 
      price:t('landing.pricing.plans.starter.price'), 
      per:t('landing.pricing.plans.starter.per'), 
      desc:t('landing.pricing.plans.starter.desc'), 
      features:[
        t('landing.pricing.plans.starter.features.0'),
        t('landing.pricing.plans.starter.features.1'),
        t('landing.pricing.plans.starter.features.2'),
        t('landing.pricing.plans.starter.features.3'),
        t('landing.pricing.plans.starter.features.4'),
        t('landing.pricing.plans.starter.features.5')
      ], 
      hi:false, 
      cta:t('landing.pricing.plans.starter.cta') 
    },
    { 
      name:t('landing.pricing.plans.business.name'), 
      price:t('landing.pricing.plans.business.price'), 
      per:t('landing.pricing.plans.business.per'), 
      desc:t('landing.pricing.plans.business.desc'), 
      features:[
        t('landing.pricing.plans.business.features.0'),
        t('landing.pricing.plans.business.features.1'),
        t('landing.pricing.plans.business.features.2'),
        t('landing.pricing.plans.business.features.3'),
        t('landing.pricing.plans.business.features.4'),
        t('landing.pricing.plans.business.features.5'),
        t('landing.pricing.plans.business.features.6'),
        t('landing.pricing.plans.business.features.7')
      ], 
      hi:true, 
      cta:t('landing.pricing.plans.business.cta') 
    },
    { 
      name:t('landing.pricing.plans.enterprise.name'), 
      price:t('landing.pricing.plans.enterprise.price'), 
      per:"", 
      desc:t('landing.pricing.plans.enterprise.desc'), 
      features:[
        t('landing.pricing.plans.enterprise.features.0'),
        t('landing.pricing.plans.enterprise.features.1'),
        t('landing.pricing.plans.enterprise.features.2'),
        t('landing.pricing.plans.enterprise.features.3'),
        t('landing.pricing.plans.enterprise.features.4'),
        t('landing.pricing.plans.enterprise.features.5'),
        t('landing.pricing.plans.enterprise.features.6'),
        t('landing.pricing.plans.enterprise.features.7')
      ], 
      hi:false, 
      cta:t('landing.pricing.plans.enterprise.cta') 
    },
  ];
  
  const LANGUAGES = [
    { code: 'en', name: 'EN' },
    { code: 'ru', name: 'RU' },
  ];
  
  const [scrolled, setScrolled] = useState(false);
  const [splash, setSplash] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMobile();
  useReveal();

  useEffect(() => { const t = setTimeout(() => setSplash(false), 2100); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLangDropdown) {
        const target = event.target as Element;
        if (!target.closest('.language-dropdown')) {
          setShowLangDropdown(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showLangDropdown]);

  // Apply theme changes
  useEffect(() => {
    const r = document.documentElement;
    if (theme === 'light') {
      r.style.setProperty('--bg',              '#f8fafc');
      r.style.setProperty('--bg2',             '#f1f5f9');
      r.style.setProperty('--card',            '#ffffff');
      r.style.setProperty('--card2',           '#f1f5f9');
      r.style.setProperty('--border',          'rgba(0,0,0,0.09)');
      r.style.setProperty('--text',            '#0f172a');
      r.style.setProperty('--text-muted',      '#475569');
      r.style.setProperty('--text-subtle',     '#94a3b8');
      r.style.setProperty('--text-dim',        '#64748b');
      r.style.setProperty('--text-faint',      '#94a3b8');
      r.style.setProperty('--footer-link',     '#64748b');
      r.style.setProperty('--footer-link-h',   '#0f172a');
      r.style.setProperty('--footer-copy',     '#94a3b8');
      r.style.setProperty('--nav-scrolled-bg', 'rgba(248,250,252,0.9)');
      r.style.setProperty('--drawer-bg',       'rgba(248,250,252,0.98)');
      r.style.setProperty('--terminal-bg',     '#1e293b');
      r.style.setProperty('--terminal-bar',    '#0f172a');
      r.style.setProperty('--terminal-border', 'rgba(59,130,246,0.25)');
      r.style.setProperty('--terminal-divider','rgba(59,130,246,0.12)');
      r.style.setProperty('--terminal-btn',    '#64748b');
      r.style.setProperty('--search-bg',       '#f1f5f9');
      r.style.setProperty('--search-text',     '#0f172a');
      r.style.setProperty('--result-doc',      '#0f172a');
      r.style.setProperty('--result-page',     '#64748b');
      r.style.setProperty('--result-snippet',  '#475569');
      r.style.setProperty('--journey-role',    '#475569');
      r.style.setProperty('--journey-q-text',  '#475569');
      r.style.setProperty('--journey-a-text',  '#15803d');
      r.style.setProperty('--compare-hi-text', '#0f172a');
      r.style.setProperty('--compare-lo-text', '#64748b');
      r.style.setProperty('--compare-lo-mark', '#94a3b8');
      r.style.setProperty('--stat-num',        '#94a3b8');
    } else {
      r.style.setProperty('--bg',              '#09090b');
      r.style.setProperty('--bg2',             '#0f1117');
      r.style.setProperty('--card',            '#111318');
      r.style.setProperty('--card2',           '#161b26');
      r.style.setProperty('--border',          'rgba(255,255,255,0.06)');
      r.style.setProperty('--text',            '#f1f5f9');
      r.style.setProperty('--text-muted',      '#64748b');
      r.style.setProperty('--text-subtle',     '#334155');
      r.style.setProperty('--text-dim',        '#94a3b8');
      r.style.setProperty('--text-faint',      '#475569');
      r.style.setProperty('--footer-link',     '#334155');
      r.style.setProperty('--footer-link-h',   '#64748b');
      r.style.setProperty('--footer-copy',     '#1e293b');
      r.style.setProperty('--nav-scrolled-bg', 'rgba(9,9,11,0.82)');
      r.style.setProperty('--drawer-bg',       'rgba(9,9,11,0.97)');
      r.style.setProperty('--terminal-bg',     '#06080f');
      r.style.setProperty('--terminal-bar',    '#0b0f1c');
      r.style.setProperty('--terminal-border', 'rgba(59,130,246,0.18)');
      r.style.setProperty('--terminal-divider','rgba(59,130,246,0.08)');
      r.style.setProperty('--terminal-btn',    '#334155');
      r.style.setProperty('--search-bg',       '#161b26');
      r.style.setProperty('--search-text',     '#f1f5f9');
      r.style.setProperty('--result-doc',      '#f1f5f9');
      r.style.setProperty('--result-page',     '#334155');
      r.style.setProperty('--result-snippet',  '#64748b');
      r.style.setProperty('--journey-role',    '#94a3b8');
      r.style.setProperty('--journey-q-text',  '#94a3b8');
      r.style.setProperty('--journey-a-text',  '#86efac');
      r.style.setProperty('--compare-hi-text', '#f1f5f9');
      r.style.setProperty('--compare-lo-text', '#64748b');
      r.style.setProperty('--compare-lo-mark', '#334155');
      r.style.setProperty('--stat-num',        '#334155');
    }
  }, [theme]);

  const Check = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
  );

  const sec = (id: string, children: React.ReactNode, extraStyle: React.CSSProperties = {}) => (
    <section id={id} style={{ padding:"96px 6%", ...extraStyle }}>{children}</section>
  );

  const SectionHead = ({ tag, tagStyle, title, sub, center=true }: { tag: string; tagStyle?: string; title: string; sub?: string; center?: boolean }) => (
    <div className="r" style={{ textAlign:center?"center":"left", marginBottom:52, opacity:1, transform:"none" }}>
      <span className={`tag ${tagStyle||""}`} style={{ marginBottom:14, display:"inline-flex" }}>{tag}</span>
      <h2 className="h2" style={{ marginBottom:14 }} dangerouslySetInnerHTML={{ __html:title }} />
      {sub && <p style={{ color:"var(--text-muted)", maxWidth:480, margin:center?"0 auto":"0", lineHeight:1.7, fontSize:16 }}>{sub}</p>}
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="wiki-ai-landing">
        <div className="noise" />

      {/* ── SPLASH ─────────────────────────────── */}
      {splash && (
        <div className="splash" style={{ animation:"fadeIn .3s ease" }}>
          <div style={{ position:"relative", marginBottom:24 }}>
            <div style={{ width:68,height:68,borderRadius:18,background:"linear-gradient(135deg,#3b82f6,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:"0 0 60px rgba(59,130,246,0.45)",animation:"floatY 2s ease-in-out infinite" }}>🧠</div>
            <div style={{ position:"absolute",inset:-10,borderRadius:24,border:"1px solid rgba(59,130,246,0.25)",animation:"spin 6s linear infinite" }} />
          </div>
          <div style={{ fontSize:22,fontWeight:800,letterSpacing:"-.02em",marginBottom:6 }}>
            <span className="g-blue">Wiki</span><span>AI</span>
          </div>
          <div style={{ fontSize:12,color:"var(--stat-num)",fontFamily:"'Geist Mono',monospace" }}>loading knowledge engine...</div>
          <div className="splash-bar"><div className="splash-bar-fill" /></div>
        </div>
      )}

      {/* ── NAV ─────────────────────────────────── */}
      <nav className={`nav ${scrolled?"scrolled":""}`}>
        <div style={{ display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#3b82f6,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>🧠</div>
          <span style={{ fontWeight:800,fontSize:18,letterSpacing:"-.02em" }}>
            <span className="g-blue">Wiki</span>AI
          </span>
        </div>
        
        {/* Center Navigation Links */}
        <div className="hide-mobile" style={{ position:"absolute",left:"50%",transform:"translateX(-50%)",display:"flex",gap:28,alignItems:"center" }}>
          {[
            { key: "features", text: t('landing.nav.features') },
            { key: "how-it-works", text: t('landing.nav.howItWorks') },
            { key: "integrations", text: t('landing.nav.integrations') },
            { key: "pricing", text: t('landing.nav.pricing') }
          ].map(l => (
            <a key={l.key} href={`#${l.key}`}
              style={{ color:"var(--text-muted)",textDecoration:"none",fontSize:14,fontWeight:500,transition:"color .2s" }}
              onMouseEnter={e=>(e.target as HTMLElement).style.color="var(--text)"}
              onMouseLeave={e=>(e.target as HTMLElement).style.color="var(--text-muted)"}
            >{l.text}</a>
          ))}
        </div>
        
        {/* Right Side Controls */}
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          {/* Language Dropdown */}
          <div className="language-dropdown" style={{ position:"relative" }}>
            <button 
              className="btn btn-outline" 
              style={{ padding:"8px 12px",fontSize:13,display:"flex",alignItems:"center",gap:6 }}
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              {availableLanguages ? Object.entries(availableLanguages).find(([code]) => code === locale)?.[1]?.name : 'EN'} ▼
            </button>
            {showLangDropdown && (
              <div style={{ 
                position:"absolute",top:"100%",right:0,marginTop:4,
                background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,
                boxShadow:"0 8px 24px rgba(0,0,0,0.4)",zIndex:1000,minWidth:80
              }}>
                {availableLanguages && Object.entries(availableLanguages).map(([code, lang]: [string, any]) => (
                  <button
                    key={code}
                    style={{
                      width:"100%",padding:"8px 12px",border:"none",background:"none",
                      textAlign:"left",fontSize:13,color:"var(--text)",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:8,
                      transition:"background .2s"
                    }}
                    onMouseEnter={e=>(e.target as HTMLElement).style.background="rgba(59,130,246,0.1)"}
                    onMouseLeave={e=>(e.target as HTMLElement).style.background="none"}
                    onClick={() => {
                      changeLanguage(code);
                      setShowLangDropdown(false);
                    }}
                  >
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Theme Toggle */}
          <button 
            className="btn btn-outline" 
            style={{ padding:"8px 12px",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center" }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button 
            className="btn btn-blue hide-mobile" 
            style={{ padding:"8px 18px",fontSize:13 }}
            onClick={() => router.push('/login')}
          >
            {t('landing.nav.getStarted')}
          </button>

          {/* Hamburger */}
          <button
            className={`mobile-menu-btn ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ───────────────────────── */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        {[
          { key: "features", text: t('landing.nav.features') },
          { key: "how-it-works", text: t('landing.nav.howItWorks') },
          { key: "integrations", text: t('landing.nav.integrations') },
          { key: "pricing", text: t('landing.nav.pricing') }
        ].map(l => (
          <a key={l.key}
            href={`#${l.key}`}
            onClick={() => setMobileMenuOpen(false)}
          >{l.text}</a>
        ))}
        <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:12 }}>
          <button
            className="btn btn-blue"
            style={{ width:"100%", justifyContent:"center", padding:"14px", fontSize:15 }}
            onClick={() => { setMobileMenuOpen(false); router.push('/login'); }}
          >
            🚀 {t('landing.nav.getStarted')}
          </button>
          <div style={{ display:"flex", gap:10 }}>
            <button
              className="btn btn-outline"
              style={{ flex:1, justifyContent:"center", padding:"12px" }}
              onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span style={{ marginLeft:6 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              className="btn btn-outline"
              style={{ flex:1, justifyContent:"center", padding:"12px", fontSize:13 }}
              onClick={() => changeLanguage(locale === 'en' ? 'ru' : 'en')}
            >
              🌐 {locale.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",paddingTop:80 }}>
        <div className="grid-bg" style={{ position:"absolute",inset:0,opacity:.55 }} />
        {/* Glow blobs */}
        <div style={{ position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.1),transparent 65%)",top:"5%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%)",top:"60%",left:"8%",pointerEvents:"none" }} />
        <div style={{ position:"absolute",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,0.08),transparent 70%)",top:"15%",right:"10%",pointerEvents:"none" }} />

        <div style={{ position:"relative",textAlign:"center",maxWidth:860,padding:"0 5%",animation:"fadeUp .9s ease .25s both" }}>
          {/* Top label */}
          <div style={{ marginBottom:22,display:"flex",justifyContent:"center",alignItems:"center",gap:10 }}>
            <span className="tag">
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"pulse-dot 1.8s ease-in-out infinite" }} />
              {t('landing.hero.badge')}
            </span>
          </div>

          <h1 className="display" style={{ marginBottom:22 }}>
            {t('landing.hero.title')}<br />
            <span className="g-shimmer">{t('landing.hero.titleHighlight')}</span>
          </h1>

          <p style={{ fontSize:"clamp(15px,2vw,18px)",color:"var(--text-muted)",maxWidth:560,margin:"0 auto 36px",lineHeight:1.7 }}>
            {t('landing.hero.subtitle')}
          </p>

          {/* Value props */}
          <div style={{ display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:40 }}>
            {[
              t('landing.hero.valueProps.connects'),
              t('landing.hero.valueProps.answers'),
              t('landing.hero.valueProps.seconds')
            ].map((p,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--text-muted)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {p}
              </div>
            ))}
          </div>

          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:64 }}>
            <button 
              className="btn btn-blue btn-lg"
              onClick={() => router.push('/login')}
            >
              {t('landing.hero.getStarted')}
            </button>
            <button 
              className="btn btn-outline btn-lg"
              onClick={() => window.open('https://demo.wikiai.com', '_blank')}
            >
              {t('landing.hero.learnMore')}
            </button>
          </div>

          {/* Social proof bar */}
          <div className="social-proof-bar" style={{ gap:0,justifyContent:"center",borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",maxWidth:700,margin:"0 auto",background:"var(--card)" }}>
            {[
              { n:t('landing.hero.socialProof.ai'), label:t('landing.hero.socialProof.powered') },
              { n:"<0.5s", label:t('landing.hero.socialProof.searchTime') },
              { n:"10+", label:t('landing.hero.socialProof.integrations') },
              { n:"99.9%", label:t('landing.hero.socialProof.uptime') },
            ].map((s,i,arr)=>(
              <div key={i} style={{ flex:1,textAlign:"center",padding:"18px 10px",borderRight:i<arr.length-1?"1px solid var(--border)":"none" }}>
                <div style={{ fontWeight:800,fontSize:20,letterSpacing:"-.02em",color:"#60a5fa",fontFamily:"'Geist',sans-serif" }}>{s.n}</div>
                <div style={{ fontSize:11,color:"var(--stat-num)",marginTop:2,fontFamily:"'Geist Mono',monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        {/* <div style={{ position:"absolute",bottom:60,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:5,opacity:.35,animation:"floatY 2.5s ease-in-out infinite" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div> */}
      </section>

      {/* ── PROBLEM / VALUE PROP ─────────────────── */}
      <section style={{ padding:"80px 6%" }}>
        <div className="divider-glow section-divider" style={{ height:"1px", marginBottom:80 }} />
        <div style={{ maxWidth:1060,margin:"0 auto" }}>
          <div className="r" style={{ textAlign:"center",marginBottom:52 }}>
            <h2 className="h2" style={{ marginBottom:16 }} dangerouslySetInnerHTML={{ __html: t('landing.problem.title') }} />
            <p style={{ color:"var(--text-muted)",maxWidth:520,margin:"0 auto",lineHeight:1.7 }}>
              {t('landing.problem.subtitle')}
            </p>
          </div>

          <div className="three-col-grid">
            {[
              { icon:"😤", title:t('landing.problem.before.title'), items:[
                t('landing.problem.before.items.0'),
                t('landing.problem.before.items.1'),
                t('landing.problem.before.items.2'),
                t('landing.problem.before.items.3')
              ] },
              { icon:"⚡", title:t('landing.problem.with.title'), items:[
                t('landing.problem.with.items.0'),
                t('landing.problem.with.items.1'),
                t('landing.problem.with.items.2'),
                t('landing.problem.with.items.3')
              ], hi:true },
              { icon:"📈", title:t('landing.problem.result.title'), items:[
                t('landing.problem.result.items.0'),
                t('landing.problem.result.items.1'),
                t('landing.problem.result.items.2'),
                t('landing.problem.result.items.3')
              ] },
            ].map((col,i)=>(
              <div key={i} className="r" style={{ background:col.hi?"rgba(59,130,246,0.05)":"var(--card)",padding:"32px 28px",transitionDelay:`${i*90}ms` }}>
                <div style={{ fontSize:28,marginBottom:14 }}>{col.icon}</div>
                <div style={{ fontSize:14,fontWeight:700,color:col.hi?"#60a5fa":"var(--compare-lo-text)",marginBottom:18,fontFamily:"'Geist Mono',monospace",letterSpacing:".04em",textTransform:"uppercase" }}>{col.title}</div>
                {col.items.map((item,j)=>(
                  <div key={j} style={{ display:"flex",alignItems:"flex-start",gap:9,marginBottom:12,fontSize:14,color:col.hi?"var(--compare-hi-text)":"var(--compare-lo-text)",lineHeight:1.5 }}>
                    <span style={{ color:col.hi?"#22c55e":"var(--compare-lo-mark)",marginTop:2,flexShrink:0 }}>{col.hi?"✓":"–"}</span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE SEARCH DEMO ─────────────────────── */}
      <section id="how-it-works" style={{ padding:"80px 6%" }}>
        <div className="divider-glow section-divider" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag={t('landing.searchDemo.tag')}
          tagStyle="tag-blue"
          title={t('landing.searchDemo.title')}
          sub={t('landing.searchDemo.subtitle')}
        />
        <div className="r" style={{ transitionDelay:"80ms" }}>
          <SearchDemo qa={QA} />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section id="features" style={{ padding:"80px 6%" }}>
        <div className="divider-glow section-divider" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag={t('landing.features.tag')}
          tagStyle=""
          title={`${t('landing.features.title')}`}
          sub={t('landing.features.subtitle')}
        />
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:18,maxWidth:1060,margin:"0 auto" }}>
          {FEATURES.map((f,i)=>(
            <div key={i} className={`feat-card r`} style={{ transitionDelay:`${i*70}ms` }}>
              <div style={{ fontSize:30,marginBottom:16 }}>{f.icon}</div>
              <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:10 }}>
                <h3 style={{ fontSize:16,fontWeight:700,color:"var(--text)" }}>{f.title}</h3>
                <span className={`tag ${f.tagStyle}`} style={{ fontSize:10,padding:"2px 8px" }}>{f.tag}</span>
              </div>
              <p style={{ color:"var(--text-muted)",fontSize:14,lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EMPLOYEE JOURNEY ─────────────────────── */}
      <section style={{ padding:"80px 6%",background:"linear-gradient(180deg,transparent,rgba(59,130,246,0.025),transparent)" }}>
        <div className="two-col-grid" style={{ maxWidth:1060,margin:"0 auto" }}>
          <div className="r-l">
            <SectionHead
              tag={t('landing.employeeJourney.tag')}
              tagStyle="tag-blue"
              title={t('landing.employeeJourney.title')}
              sub={t('landing.employeeJourney.subtitle')}
            />
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {KNOWLEDGE_TYPES.map((item: string, i: number) => (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:14,color:"var(--text-dim)" }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:"#3b82f6",flexShrink:0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="r-r">
            <EmployeeJourney />
          </div>
        </div>
      </section>

      {/* ── INTEGRATION HUB ──────────────────────── */}
      <section id="integrations" style={{ padding:"80px 6%" }}>
        <div className="divider-glow section-divider" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag={t('landing.integrationHub.tag')}
          tagStyle="tag-indigo"
          title={`${t('landing.integrationHub.title')}`}
          sub={t('landing.integrationHub.subtitle')}
        />
        <div className="r" style={{ transitionDelay:"60ms" }}>
          {isMobile ? <MobileHubDiagram /> : <HubDiagram />}
        </div>
        {/* Extra detail row */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,maxWidth:900,margin:"48px auto 0" }}>
          {[
            { icon:"🔷", title:"Bitrix24", desc:t('landing.integrationHub.detailCards.bitrix24') },
            { icon:"📊", title:"1C / ERP", desc:t('landing.integrationHub.detailCards.erp') },
            { icon:"💬", title:"Telegram & Slack", desc:t('landing.integrationHub.detailCards.messaging') },
            { icon:"🛒", title:"Online Store", desc:t('landing.integrationHub.detailCards.store') },
          ].map((d,i)=>(
            <div key={i} className={`r feat-card`} style={{ transitionDelay:`${i*80}ms` }}>
              <div style={{ fontSize:24,marginBottom:12 }}>{d.icon}</div>
              <div style={{ fontSize:15,fontWeight:700,color:"var(--text)",marginBottom:7 }}>{d.title}</div>
              <p style={{ fontSize:13,color:"var(--text-muted)",lineHeight:1.6 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TERMINAL ─────────────────────────────── */}
      <section style={{ padding:"80px 6%",background:"linear-gradient(180deg,transparent,rgba(59,130,246,0.025),transparent)" }}>
        <div className="two-col-grid" style={{ maxWidth:1060,margin:"0 auto" }}>
          <div className="r-r" style={{ order:2 }}>
            <span className="tag tag-green" style={{ marginBottom:18,display:"inline-flex" }}>{t('landing.aiAgentBridge.tag')}</span>
            <h2 className="h2" style={{ marginBottom:18 }} dangerouslySetInnerHTML={{ __html: t('landing.aiAgentBridge.title') }} />
            <p style={{ color:"var(--text-muted)",fontSize:15,lineHeight:1.75,marginBottom:24 }}>
              {t('landing.aiAgentBridge.subtitle')}
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {AI_AGENT_FEATURES.map((item: string, i: number) => (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:14,color:"var(--text-dim)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="r-l" style={{ order:1 }}>
            <Terminal />
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────── */}
      <section style={{ padding:"80px 6%" }}>
        <div className="divider-glow section-divider" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag={t('landing.useCases.tag')}
          tagStyle="tag-blue"
          title={`${t('landing.useCases.title')}`}
          sub={t('landing.useCases.subtitle')}
        />
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18,maxWidth:1060,margin:"0 auto" }}>
          {USECASES.map((u,i)=>(
            <div key={i} className={`r feat-card`} style={{ transitionDelay:`${i*80}ms` }}>
              <div style={{ fontSize:32,marginBottom:16 }}>{u.icon}</div>
              <h3 style={{ fontSize:16,fontWeight:700,color:"var(--text)",marginBottom:10 }}>{u.title}</h3>
              <p style={{ fontSize:14,color:"var(--text-muted)",lineHeight:1.65 }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section style={{ padding:"72px 6%",background:"linear-gradient(135deg,rgba(59,130,246,0.04),rgba(99,102,241,0.03))" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:1,maxWidth:900,margin:"0 auto",background:"var(--border)",borderRadius:16,overflow:"hidden" }}>
          {STATS.map((s,i)=>(
            <div key={i} className="r" style={{ background:"var(--card)",textAlign:"center",padding:"40px 20px",transitionDelay:`${i*80}ms` }}>
              <div style={{ fontSize:"2.8rem",fontWeight:900,letterSpacing:"-.03em",color:"#60a5fa",lineHeight:1,marginBottom:8,fontFamily:"'Geist',sans-serif" }}>
                <Counter to={s.n} suffix={s.s} decimals={s.dec} />
              </div>
              <div style={{ fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:12,color:"var(--stat-num)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────── */}
      <section id="pricing" style={{ padding:"96px 6%" }}>
        <div className="divider-glow section-divider" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag={t('landing.pricing.tag')}
          tagStyle="tag-blue"
          title={`${t('landing.pricing.title')}`}
          sub={t('landing.pricing.subtitle')}
        />
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20,maxWidth:980,margin:"0 auto" }}>
          {PLANS.map((p,i)=>(
            <div key={i} className={`price-card r ${p.hi?"featured":""}`} style={{ transitionDelay:`${i*80}ms` }}>
              {p.hi && (
                <div style={{ position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#3b82f6,#0ea5e9)",color:"#fff",fontSize:10,fontWeight:700,padding:"4px 16px",borderRadius:"0 0 8px 8px",fontFamily:"'Geist Mono',monospace",letterSpacing:".08em",whiteSpace:"nowrap" }}>
                  {t('landing.pricing.mostPopular')}
                </div>
              )}
              <div style={{ fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:13,color:"var(--text-faint)",marginBottom:22 }}>{p.desc}</div>
              <div style={{ display:"flex",alignItems:"baseline",gap:4,marginBottom:8 }}>
                <span style={{ fontSize:40,fontWeight:900,letterSpacing:"-.03em",color:p.hi?"#60a5fa":"var(--text)" }}>{p.price}</span>
                <span style={{ color:"var(--text-faint)",fontSize:14 }}>{p.per}</span>
              </div>
              <div className="divider" style={{ height:"1px", margin:"20px 0" }} />
              <div style={{ marginBottom:28 }}>
                {p.features.map((f,j)=>(
                  <div key={j} style={{ display:"flex",alignItems:"center",gap:9,marginBottom:11,fontSize:14,color:"var(--text-dim)" }}>
                    <Check />{f}
                  </div>
                ))}
              </div>
              <button 
                className={`btn ${p.hi?"btn-blue":"btn-outline"}`} 
                style={{ width:"100%",justifyContent:"center",padding:"13px" }}
                onClick={() => router.push('/login')}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section style={{ padding:"80px 6% 100px" }}>
        <div className="r" style={{ maxWidth:780,margin:"0 auto",textAlign:"center" }}>
          <div className="mobile-cta-box" style={{ background:"linear-gradient(135deg,rgba(59,130,246,0.1),rgba(14,165,233,0.07),rgba(99,102,241,0.06))",border:"1px solid rgba(59,130,246,0.2)",borderRadius:22,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)",top:"-30%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none" }} />
            <SectionHead
              tag="🧠"
              tagStyle="tag-blue-large"
              title={`${t('landing.cta.title')}`}
              sub={t('landing.cta.subtitle')}
            />
            <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              <button 
                className="btn btn-blue btn-lg"
                onClick={() => router.push('/login')}
              >
                {t('landing.cta.startNow')}
              </button>
              {/* <button 
                className="btn btn-outline btn-lg"
                onClick={() => window.open('mailto:demo@wikiai.com?subject=WikiAI Demo Request', '_blank')}
              >
                📅 Book a Demo
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer style={{ borderTop:"1px solid var(--border)",padding:"52px 6% 32px" }}>
        <div style={{ maxWidth:1060,margin:"0 auto" }}>
          <p style={{ color:"var(--footer-copy)",fontSize:12,marginBottom:20 }}>
            {t('landing.footer.description')}
          </p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:24,marginBottom:32 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:"var(--text)",marginBottom:12,textTransform:"uppercase",letterSpacing:".05em" }}>{t('landing.footer.product')}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[
                  { key:"features", text:t('landing.footer.links.features') },
                  { key:"integrations", text:t('landing.footer.links.integrations') },
                  { key:"pricing", text:t('landing.footer.links.pricing') },
                  { key:"changelog", text:t('landing.footer.links.changelog') },
                  { key:"roadmap", text:t('landing.footer.links.roadmap') },
                ].map(l => (
                  <a key={l.key} href={`#${l.key}`} style={{ color:"var(--footer-link)",textDecoration:"none",fontSize:12,transition:"color .2s" }}
                    onMouseEnter={e=>(e.target as HTMLElement).style.color="var(--footer-link-h)"}
                    onMouseLeave={e=>(e.target as HTMLElement).style.color="var(--footer-link)"}
                  >{l.text}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:"var(--text)",marginBottom:12,textTransform:"uppercase",letterSpacing:".05em" }}>{t('landing.footer.useCases')}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[
                  { key:"onboarding", text:t('landing.footer.links.onboarding') },
                  { key:"sales", text:t('landing.footer.links.sales') },
                  { key:"call-centers", text:t('landing.footer.links.callCenters') },
                  { key:"ecommerce", text:t('landing.footer.links.ecommerce') },
                ].map(l => (
                  <a key={l.key} href={`#${l.key}`} style={{ color:"var(--footer-link)",textDecoration:"none",fontSize:12,transition:"color .2s" }}
                    onMouseEnter={e=>(e.target as HTMLElement).style.color="var(--footer-link-h)"}
                    onMouseLeave={e=>(e.target as HTMLElement).style.color="var(--footer-link)"}
                  >{l.text}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:"var(--text)",marginBottom:12,textTransform:"uppercase",letterSpacing:".05em" }}>{t('landing.footer.company')}</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {[
                  { key:"about", text:t('landing.footer.links.about') },
                  { key:"blog", text:t('landing.footer.links.blog') },
                  { key:"careers", text:t('landing.footer.links.careers') },
                  { key:"contact", text:t('landing.footer.links.contact') },
                  { key:"privacy", text:t('landing.footer.links.privacy') },
                ].map(l => (
                  <a key={l.key} href={`#${l.key}`} style={{ color:"var(--footer-link)",textDecoration:"none",fontSize:12,transition:"color .2s" }}
                    onMouseEnter={e=>(e.target as HTMLElement).style.color="var(--footer-link-h)"}
                    onMouseLeave={e=>(e.target as HTMLElement).style.color="var(--footer-link)"}
                  >{l.text}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:24,borderTop:"1px solid var(--border)",flexWrap:"wrap",gap:12 }}>
            <div style={{ fontSize:12,color:"var(--footer-copy)" }}>
              {t('landing.footer.copyright')}
            </div>
            <div style={{ display:"flex",gap:20 }}>
              {[
                { key:"privacy", text:t('landing.footer.bottomLinks.privacy') },
                { key:"terms", text:t('landing.footer.bottomLinks.terms') },
                { key:"security", text:t('landing.footer.bottomLinks.security') },
              ].map(l => (
                <a key={l.key} href={`#${l.key}`} style={{ color:"var(--footer-link)",textDecoration:"none",fontSize:12,transition:"color .2s" }}
                  onMouseEnter={e=>(e.target as HTMLElement).style.color="var(--footer-link-h)"}
                  onMouseLeave={e=>(e.target as HTMLElement).style.color="var(--footer-link)"}
                >{l.text}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}