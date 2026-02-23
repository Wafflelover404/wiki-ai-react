"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS  —  shadcn/ui dark palette + custom animations
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

/* ── shadcn dark token map ── */
:root {
  --bg:           #09090b;
  --bg2:          #0f1117;
  --card:         #111318;
  --card2:        #161b26;
  --border:       rgba(255,255,255,0.06);
  --border-hi:    rgba(59,130,246,0.35);
  --blue:         #3b82f6;
  --blue-light:   #60a5fa;
  --blue-dim:     rgba(59,130,246,0.12);
  --sky:          #0ea5e9;
  --indigo:       #6366f1;
  --text:         #f1f5f9;
  --text-muted:   #64748b;
  --text-subtle:  #334155;
  --green:        #22c55e;
  --amber:        #f59e0b;
  --rose:         #f43f5e;
  --radius:       10px;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Geist', system-ui, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

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
.r   { opacity:0; transform:translateY(22px); transition:opacity .6s ease,transform .6s ease; }
.r-l { opacity:0; transform:translateX(-28px); transition:opacity .6s ease,transform .6s ease; }
.r-r { opacity:0; transform:translateX(28px);  transition:opacity .6s ease,transform .6s ease; }
.r.on,.r-l.on,.r-r.on { opacity:1; transform:none; }

/* ── Typography ── */
.display {
  font-size: clamp(2.6rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
}
.h2 {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 750;
  line-height: 1.12;
  letter-spacing: -0.025em;
}
.mono { font-family: 'Geist Mono', monospace; }

/* ── Gradient text ── */
.g-blue {
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--sky) 60%, #38bdf8 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.g-indigo {
  background: linear-gradient(135deg, #818cf8, var(--indigo), var(--blue));
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.g-shimmer {
  background: linear-gradient(90deg, var(--text) 0%, var(--blue-light) 30%, var(--sky) 50%, var(--blue-light) 70%, var(--text) 100%);
  background-size: 300% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  animation: shimmer 4s linear infinite;
}

/* ── Surface / glass ── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.card-hi {
  background: var(--card2);
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  box-shadow: 0 0 40px rgba(59,130,246,0.08);
}
.glass {
  background: rgba(15,17,23,0.7);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items:center; gap:8px;
  padding: 11px 24px; border-radius: 8px; border:none;
  font-family:'Geist',sans-serif; font-size:14px; font-weight:600;
  cursor:pointer; transition:all .2s; letter-spacing:-.01em;
}
.btn-blue {
  background: var(--blue); color:#fff;
}
.btn-blue:hover { background:#2563eb; box-shadow:0 8px 28px rgba(59,130,246,0.35); transform:translateY(-1px); }
.btn-outline {
  background:transparent; color:var(--text);
  border:1px solid var(--border); padding:11px 24px;
}
.btn-outline:hover { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.03); }
.btn-lg { padding:14px 32px; font-size:15px; border-radius:10px; }

/* ── Tag / badge ── */
.tag {
  display:inline-flex; align-items:center; gap:6px;
  padding:4px 12px; border-radius:100px;
  font-size:11px; font-weight:600; letter-spacing:.07em; text-transform:uppercase;
  font-family:'Geist Mono',monospace;
  background: var(--blue-dim); color:var(--blue-light);
  border:1px solid rgba(59,130,246,0.22);
}
.tag-green { background:rgba(34,197,94,0.08); color:#4ade80; border-color:rgba(34,197,94,0.2); }
.tag-amber { background:rgba(245,158,11,0.08); color:#fbbf24; border-color:rgba(245,158,11,0.2); }
.tag-indigo{ background:rgba(99,102,241,0.1); color:#a5b4fc; border-color:rgba(99,102,241,0.25); }

/* ── Grid bg ── */
.grid-bg {
  background-image:
    linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ── Divider ── */
.divider { height:1px; background:var(--border); width:100%; }
.divider-glow { height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,0.3),transparent); width:100%; }

/* ── Integration card ── */
.int-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:12px; padding:16px 18px;
  display:flex; align-items:center; gap:12px;
  transition: border-color .25s, transform .25s, box-shadow .25s;
  cursor:default;
}
.int-card:hover {
  border-color:rgba(59,130,246,0.3);
  transform:translateY(-2px);
  box-shadow:0 12px 32px rgba(0,0,0,0.4);
}

/* ── Feature card ── */
.feat-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:14px; padding:28px;
  transition:border-color .25s, transform .3s, box-shadow .3s;
  position:relative; overflow:hidden;
}
.feat-card::before {
  content:''; position:absolute; inset:0;
  background:linear-gradient(135deg,rgba(59,130,246,0.05),transparent 55%);
  opacity:0; transition:opacity .3s;
}
.feat-card:hover { border-color:rgba(59,130,246,0.28); transform:translateY(-3px); box-shadow:0 20px 50px rgba(0,0,0,0.45); }
.feat-card:hover::before { opacity:1; }

/* ── Noise ── */
.noise {
  position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.022;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── Splash ── */
.splash {
  position:fixed; inset:0; z-index:9998;
  background:var(--bg);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
}
.splash-bar { width:200px; height:2px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; margin-top:32px; }
.splash-bar-fill { height:100%; background:linear-gradient(90deg,var(--blue),var(--sky)); border-radius:2px; animation:typing 1.9s ease forwards; }

/* ── Nav ── */
.nav {
  position:fixed; top:0; left:0; right:0; z-index:100;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 5%; height:60px;
  transition:background .3s, border-color .3s;
}
.nav.scrolled {
  background:rgba(9,9,11,0.82);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}

/* ── Pricing ── */
.price-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:16px; padding:36px 30px;
  transition:transform .3s, box-shadow .3s, border-color .3s;
  position:relative;
}
.price-card:hover { transform:translateY(-4px); box-shadow:0 28px 70px rgba(0,0,0,0.5); }
.price-card.featured { border-color:rgba(59,130,246,0.4); background:linear-gradient(160deg,rgba(59,130,246,0.06),var(--card)); }
.price-card.featured:hover { box-shadow:0 28px 70px rgba(59,130,246,0.12); }

@media (max-width:768px) {
  .display { font-size:2.4rem; }
  .h2 { font-size:1.7rem; }
  .hide-mobile { display:none !important; }
}
`;

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".r,.r-l,.r-r");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
const TERM = [
  { d:0,    c:"#64748b", t:"# Employee asks a question in Telegram" },
  { d:500,  c:"#94a3b8", t:"→ Received: \"What's the refund policy for B2B clients?\"" },
  { d:1100, c:"#60a5fa", t:"→ Querying WikiAI knowledge base..." },
  { d:1700, c:"#64748b", t:"→ Searching: contracts_2024.pdf, policy_manual.docx" },
  { d:2200, c:"#60a5fa", t:"→ Cross-referencing Bitrix CRM client segment..." },
  { d:2800, c:"#22c55e", t:"✓ Answer found — confidence 96.2%" },
  { d:3300, c:"#f1f5f9", t:"  \"B2B clients with Enterprise tier receive 30-day" },
  { d:3400, c:"#f1f5f9", t:"   full refund window. See §4.2 of Contract Terms.\"" },
  { d:3900, c:"#94a3b8", t:"→ Sources: policy_manual.docx §4.2, crm_tier_rules.json" },
  { d:4400, c:"#f59e0b", t:"⚡ Total response time: 0.4s" },
];

function Terminal() {
  const [shown, setShown] = useState<number[]>([]);
  const ref = useRef(null);
  const started = useRef(false);
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
    <div ref={ref} style={{ background:"#06080f", border:"1px solid rgba(59,130,246,0.18)", borderRadius:14, overflow:"hidden", boxShadow:"0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.06)", fontFamily:"'Geist Mono',monospace" }}>
      {/* Bar */}
      <div style={{ background:"#0b0f1c", padding:"11px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(59,130,246,0.08)" }}>
        <span style={{ width:11,height:11,borderRadius:"50%",background:"#ef4444",display:"block" }} />
        <span style={{ width:11,height:11,borderRadius:"50%",background:"#f59e0b",display:"block" }} />
        <span style={{ width:11,height:11,borderRadius:"50%",background:"#22c55e",display:"block" }} />
        <span style={{ marginLeft:10,fontSize:11,color:"#334155" }}>wikiai — ai-agent bridge</span>
        <button onClick={restart} style={{ marginLeft:"auto",background:"none",border:"none",color:"#334155",cursor:"pointer",fontSize:11 }}>↺ replay</button>
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

/* ═══════════════════════════════════════════════════════════
   INTEGRATION HUB DIAGRAM
═══════════════════════════════════════════════════════════ */
const INPUTS = [
  { icon:"🔷", label:"Bitrix24", sub:"CRM / Tasks" },
  { icon:"📊", label:"1C ERP", sub:"Operations" },
  { icon:"📁", label:"Google Drive", sub:"Documents" },
  { icon:"🔗", label:"Confluence", sub:"Wiki pages" },
  { icon:"📬", label:"Email / IMAP", sub:"Mail archive" },
  { icon:"🗃️", label:"SharePoint", sub:"Corp files" },
];
const OUTPUTS = [
  { icon:"💬", label:"Telegram Bot", sub:"Team messenger" },
  { icon:"🛒", label:"Online Shop", sub:"Customer AI chat" },
  { icon:"📱", label:"Slack", sub:"Workspace chat" },
  { icon:"🌐", label:"Website Widget", sub:"Support chat" },
  { icon:"📞", label:"Call Center", sub:"Agent assistant" },
  { icon:"🔌", label:"REST API", sub:"Any integration" },
];

function HubDiagram() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 1200); return () => clearInterval(iv); }, []);

  const activeIn = tick % INPUTS.length;
  const activeOut = tick % OUTPUTS.length;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:20, alignItems:"center", maxWidth:900, margin:"0 auto" }}>
      {/* INPUTS */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ fontSize:11, color:"#334155", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:4, textAlign:"right" }}>Data Sources</div>
        {INPUTS.map((s, i) => (
          <div key={i} className="int-card" style={{
            justifyContent:"flex-end",
            borderColor: i===activeIn ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.06)",
            boxShadow: i===activeIn ? "0 0 20px rgba(59,130,246,0.15)" : "none",
            transition:"all .4s ease"
          }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, fontWeight:600, color: i===activeIn ? "#f1f5f9" : "#94a3b8" }}>{s.label}</div>
              <div style={{ fontSize:11, color:"#334155" }}>{s.sub}</div>
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
        <div style={{ fontSize:9, color:"#1e3a5f", fontFamily:"'Geist Mono',monospace", letterSpacing:".1em", textTransform:"uppercase" }}>Knowledge Hub</div>
      </div>

      {/* OUTPUTS */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ fontSize:11, color:"#334155", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", marginBottom:4 }}>Delivery Channels</div>
        {OUTPUTS.map((s, i) => (
          <div key={i} className="int-card" style={{
            borderColor: i===activeOut ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.06)",
            boxShadow: i===activeOut ? "0 0 20px rgba(34,197,94,0.12)" : "none",
            transition:"all .4s ease"
          }}>
            <div style={{ width:36,height:36,borderRadius:9,background:"rgba(34,197,94,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color: i===activeOut ? "#f1f5f9" : "#94a3b8" }}>{s.label}</div>
              <div style={{ fontSize:11, color:"#334155" }}>{s.sub}</div>
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
const QA = [
  {
    q: "What is our vacation policy for remote employees?",
    results: [
      { doc:"HR Policy Manual 2024", page:"§8.3", score:98, snippet:"Remote employees are entitled to 28 calendar days of paid vacation, applicable from first day of employment..." },
      { doc:"Employment Contract Template", page:"Clause 12", score:87, snippet:"Vacation scheduling must be agreed with direct manager 14 days in advance via the HR portal..." },
    ]
  },
  {
    q: "How to process a B2B refund in Bitrix?",
    results: [
      { doc:"Bitrix CRM Guide", page:"Ch.6", score:96, snippet:"Navigate to CRM → Deals → Refund Requests. Select client segment 'B2B Enterprise' and initiate refund workflow..." },
      { doc:"Finance SOP v3", page:"p.14", score:82, snippet:"B2B refunds require approval from Finance Manager and must be logged in 1C within 2 business days..." },
    ]
  },
  {
    q: "What servers are in production right now?",
    results: [
      { doc:"Infrastructure Registry", page:"Live", score:99, snippet:"Current production: app-srv-01 (Berlin), app-srv-02 (Frankfurt), db-master-01, cdn-edge-04..." },
      { doc:"Deployment Runbook", page:"§2", score:78, snippet:"All production changes require DevOps lead sign-off. Maintenance window: Sundays 02:00–04:00 UTC..." },
    ]
  },
];

function SearchDemo() {
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState("");
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    const cycle = () => {
      const nextQi = (qi + 1) % QA.length;
      setShowResults(false);
      setSearching(false);
      setTyped("");
      // Type query
      const q = QA[nextQi].q;
      let i = 0;
      const typeIv = setInterval(() => {
        i++;
        setTyped(q.slice(0, i));
        if (i >= q.length) {
          clearInterval(typeIv);
          setSearching(true);
          setTimeout(() => { setSearching(false); setShowResults(true); setQi(nextQi); }, 900);
        }
      }, 38);
    };
    const iv = setTimeout(cycle, 3600);
    return () => clearTimeout(iv);
  }, [qi]);

  // initial type
  useEffect(() => {
    const q = QA[0].q;
    let i = 0;
    const iv = setInterval(() => { i++; setTyped(q.slice(0,i)); if(i>=q.length) clearInterval(iv); }, 40);
    return () => clearInterval(iv);
  }, []);

  const cur = QA[qi];
  return (
    <div style={{ maxWidth:580, margin:"0 auto", height:"400px" }}>
      {/* Search bar */}
      <div style={{ display:"flex", alignItems:"center", gap:12, background:"var(--card2)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:12, padding:"13px 18px", marginBottom:14, boxShadow:"0 20px 50px rgba(0,0,0,0.4)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ flex:1, fontSize:13, color:"#f1f5f9", fontFamily:"'Geist Mono',monospace" }}>
          {typed}<span style={{ animation:"blink .85s step-end infinite" }}>|</span>
        </span>
        {searching
          ? <div style={{ width:16,height:16,borderRadius:"50%",border:"2px solid rgba(59,130,246,0.3)",borderTopColor:"#3b82f6",animation:"spin .7s linear infinite" }} />
          : <span style={{ fontSize:10, background:"rgba(59,130,246,0.1)", color:"#60a5fa", borderRadius:5, padding:"3px 8px", fontFamily:"'Geist Mono',monospace", fontWeight:600, letterSpacing:".05em" }}>AI AGENT</span>
        }
      </div>
      {/* Results */}
      <div style={{ display:"flex", flexDirection:"column", gap:9, height:"300px", overflow:"hidden" }}>
        {showResults && cur.results.map((r, i) => (
          <div key={`${qi}-${i}`} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:11, padding:"14px 16px", animation:"fadeUp .35s ease both", animationDelay:`${i*100}ms`, minHeight:"80px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
              <div>
                <span style={{ fontSize:13, fontWeight:600, color:"#f1f5f9" }}>{r.doc}</span>
                <span style={{ fontSize:11, color:"#334155", marginLeft:8, fontFamily:"'Geist Mono',monospace" }}>{r.page}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <div style={{ width:36, height:3, background:"rgba(59,130,246,0.15)", borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${r.score}%`, background:"linear-gradient(90deg,#3b82f6,#60a5fa)", borderRadius:2, transition:"width .6s ease" }} />
                </div>
                <span style={{ fontSize:11, color:"#60a5fa", fontFamily:"'Geist Mono',monospace" }}>{r.score}%</span>
              </div>
            </div>
            <p style={{ fontSize:12.5, color:"#64748b", lineHeight:1.55 }}>{r.snippet}</p>
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
  const steps = [
    { who:"👤", role:"New Employee", q:"\"What's our expense reimbursement process?\"", a:"Found in Finance SOP §3.1 — submit via HR portal within 30 days with receipts.", color:"#3b82f6" },
    { who:"🧑‍💼", role:"Sales Manager", q:"\"What's the discount ceiling for SMB clients?\"", a:"Max 15% without VP approval. Source: Pricing Policy 2024, updated Jan 15.", color:"#6366f1" },
    { who:"🧑‍🔧", role:"Support Agent", q:"\"How to reset 2FA for a client account?\"", a:"Use admin panel → Users → Security. Requires ticket logged in Bitrix first.", color:"#0ea5e9" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {steps.map((s, i) => (
        <div key={i} className="r" style={{ transitionDelay:`${i*120}ms`, background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{s.who}</div>
            <span style={{ fontSize:13,fontWeight:600,color:"#94a3b8" }}>{s.role}</span>
          </div>
          {/* Question bubble */}
          <div style={{ background:"rgba(59,130,246,0.06)",border:`1px solid ${s.color}22`,borderRadius:8,padding:"10px 14px",marginBottom:10,fontSize:13,color:"#94a3b8",fontStyle:"italic" }}>
            {s.q}
          </div>
          {/* Answer bubble */}
          <div style={{ background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#86efac" }}>
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
const FEATURES = [
  { icon:"🧠", title:"Single Knowledge Hub", desc:"All company documents, policies, CRM data and wikis unified in one AI-searchable place. No more hunting through folders or asking colleagues.", tag:"Core", tagStyle:"" },
  { icon:"🔌", title:"Deep Integrations", desc:"Pull data live from Bitrix24, 1C ERP, Confluence, SharePoint, Google Drive and any REST source. Knowledge stays fresh automatically.", tag:"Integrations", tagStyle:"tag-indigo" },
  { icon:"🤖", title:"AI Agent Delivery", desc:"Deploy WikiAI as an AI agent in your Telegram bot, website chat, Slack workspace, or online store. Answers driven by your real company data.", tag:"Delivery", tagStyle:"tag-green" },
  { icon:"🔍", title:"Semantic Search", desc:"Ask questions in natural language. Vector embeddings understand meaning, not just keywords. Get ranked answers with source citations.", tag:"Search", tagStyle:"" },
  { icon:"🏢", title:"Multi-Department", desc:"Separate knowledge bases per department or subsidiary with full data isolation. Marketing, Sales, Tech — each with their own space.", tag:"Multi-tenant", tagStyle:"tag-indigo" },
  { icon:"📊", title:"Usage Analytics", desc:"See which questions employees ask most. Identify knowledge gaps. Track adoption and measure ROI of your knowledge base investment.", tag:"Analytics", tagStyle:"tag-amber" },
];

const STATS = [
  { n:10, s:"x", label:"Faster answers", desc:"vs searching manually", dec:0 },
  { n:40, s:"%", label:"Less interruptions", desc:"colleagues stop asking each other", dec:0 },
  { n:0.4, s:"s", label:"Avg response time", desc:"AI query to answer", dec:1 },
  { n:99.9, s:"%", label:"Uptime SLA", desc:"enterprise reliability", dec:1 },
];

const USECASES = [
  { icon:"🆕", title:"Employee Onboarding", desc:"New hires get instant answers about processes, tools, and company policies without overwhelming their manager." },
  { icon:"🛒", title:"E-commerce Support", desc:"Deploy WikiAI as your online store's support chat. It answers product questions, return policies, and shipping info from your actual docs." },
  { icon:"📞", title:"Call Center Assist", desc:"Agents get real-time suggested answers pulled from your knowledge base while on a call. Shorter handle time, higher CSAT." },
  { icon:"🤝", title:"Sales Enablement", desc:"Sales reps instantly find pricing rules, competitor comparisons, and product specs. No more 'let me check with the team'." },
];

const PLANS = [
  { name:"Starter", price:"$N/A", per:"/mo", desc:"Small teams, single department", features:["1 department workspace","Up to 25 users","10 GB document storage","Standard AI search","1 external channel (Telegram/Web)","Basic analytics"], hi:false, cta:"Start Free" },
  { name:"Business", price:"$N/A", per:"/mo", desc:"Growing companies, multiple sources", features:["5 department workspaces","Unlimited users","100 GB storage","AI Agent mode + commands","Bitrix24 & CRM integration","3 external channels","Advanced analytics","API access"], hi:true, cta:"Try Free 14 Days" },
  { name:"Enterprise", price:"Custom", per:"", desc:"Large-scale or self-hosted", features:["Unlimited workspaces","Any data source","Self-hosted option","SSO / SAML / LDAP","Custom LLM providers","Unlimited channels","White-label bot","SLA + Dedicated support"], hi:false, cta:"Talk to Us" },
];

const LANGUAGES = [
  { code: 'en', name: 'EN' },
  { code: 'ru', name: 'RU' },
];

/* ═══════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════ */
export default function WikiAILanding() {
  const [scrolled, setScrolled] = useState(false);
  const [splash, setSplash] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const router = useRouter();
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
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg', '#ffffff');
      document.documentElement.style.setProperty('--bg2', '#f8fafc');
      document.documentElement.style.setProperty('--card', '#ffffff');
      document.documentElement.style.setProperty('--card2', '#f1f5f9');
      document.documentElement.style.setProperty('--text', '#1e293b');
      document.documentElement.style.setProperty('--text-muted', '#64748b');
      document.documentElement.style.setProperty('--text-subtle', '#94a3b8');
      document.documentElement.style.setProperty('--border', 'rgba(0,0,0,0.08)');
    } else {
      // Reset to dark theme defaults
      document.documentElement.style.setProperty('--bg', '#09090b');
      document.documentElement.style.setProperty('--bg2', '#0f1117');
      document.documentElement.style.setProperty('--card', '#111318');
      document.documentElement.style.setProperty('--card2', '#161b26');
      document.documentElement.style.setProperty('--text', '#f1f5f9');
      document.documentElement.style.setProperty('--text-muted', '#64748b');
      document.documentElement.style.setProperty('--text-subtle', '#334155');
      document.documentElement.style.setProperty('--border', 'rgba(255,255,255,0.06)');
    }
  }, [theme]);

  const Check = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
  );

  const sec = (id: string, children: React.ReactNode, extraStyle: React.CSSProperties = {}) => (
    <section id={id} style={{ padding:"96px 6%", ...extraStyle }}>{children}</section>
  );

  const SectionHead = ({ tag, tagStyle, title, sub, center=true }: { tag: string; tagStyle?: string; title: string; sub?: string; center?: boolean }) => (
    <div className="r" style={{ textAlign:center?"center":"left", marginBottom:52 }}>
      <span className={`tag ${tagStyle||""}`} style={{ marginBottom:14, display:"inline-flex" }}>{tag}</span>
      <h2 className="h2" style={{ marginBottom:14 }} dangerouslySetInnerHTML={{ __html:title }} />
      {sub && <p style={{ color:"var(--text-muted)", maxWidth:480, margin:center?"0 auto":"0", lineHeight:1.7, fontSize:16 }}>{sub}</p>}
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
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
          <div style={{ fontSize:12,color:"#334155",fontFamily:"'Geist Mono',monospace" }}>loading knowledge engine...</div>
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
          {["Features","How It Works","Integrations","Pricing"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`}
              style={{ color:"var(--text-muted)",textDecoration:"none",fontSize:14,fontWeight:500,transition:"color .2s" }}
              onMouseEnter={e=>(e.target as HTMLElement).style.color="#f1f5f9"}
              onMouseLeave={e=>(e.target as HTMLElement).style.color="var(--text-muted)"}
            >{l}</a>
          ))}
        </div>
        
        {/* Right Side Controls */}
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          {/* Theme Toggle */}
          <button 
            className="btn btn-outline" 
            style={{ padding:"8px 12px",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center" }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          {/* Language Dropdown */}
          <div className="language-dropdown" style={{ position:"relative" }}>
            <button 
              className="btn btn-outline" 
              style={{ padding:"8px 12px",fontSize:13,display:"flex",alignItems:"center",gap:6 }}
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              {LANGUAGES.find(l => l.code === language)?.name} ▼
            </button>
            {showLangDropdown && (
              <div style={{ 
                position:"absolute",top:"100%",right:0,marginTop:4,
                background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,
                boxShadow:"0 8px 24px rgba(0,0,0,0.4)",zIndex:1000,minWidth:80
              }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    style={{
                      width:"100%",padding:"8px 12px",border:"none",background:"none",
                      textAlign:"left",fontSize:13,color:"var(--text)",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:8,
                      transition:"background .2s"
                    }}
                    onMouseEnter={e=>(e.target as HTMLElement).style.background="rgba(59,130,246,0.1)"}
                    onMouseLeave={e=>(e.target as HTMLElement).style.background="none"}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangDropdown(false);
                    }}
                  >
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="btn btn-blue" 
            style={{ padding:"8px 18px",fontSize:13 }}
            onClick={() => router.push('/login')}
          >
            Get Started →
          </button>
        </div>
      </nav>

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
              Company Knowledge Platform
            </span>
          </div>

          <h1 className="display" style={{ marginBottom:22 }}>
            All Company Knowledge.<br />
            <span className="g-shimmer">One Intelligent Hub.</span>
          </h1>

          <p style={{ fontSize:"clamp(15px,2vw,18px)",color:"var(--text-muted)",maxWidth:560,margin:"0 auto 36px",lineHeight:1.7 }}>
            WikiAI centralises everything your company knows — from CRM records to policy docs — and makes it instantly searchable by every employee, and deliverable through any channel.
          </p>

          {/* Value props */}
          <div style={{ display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:40 }}>
            {["Connects to Bitrix, ERP, Drive","Answers in any messenger or chat","Employees find answers in seconds"].map((p,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:7,fontSize:13,color:"#64748b" }}>
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
              🚀 Start for Free
            </button>
            <button 
              className="btn btn-outline btn-lg"
              onClick={() => window.open('https://demo.wikiai.com', '_blank')}
            >
              ▶ Watch Demo
            </button>
          </div>

          {/* Social proof bar */}
          <div style={{ display:"flex",gap:0,justifyContent:"center",borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",maxWidth:700,margin:"0 auto",background:"var(--card)" }}>
            {[
              { n:"Ai", label:"Powered" },
              { n:"<0.5s", label:"Search time" },
              { n:"10+", label:"Integrations" },
              { n:"99.9%", label:"Uptime" },
            ].map((s,i,arr)=>(
              <div key={i} style={{ flex:1,textAlign:"center",padding:"18px 10px",borderRight:i<arr.length-1?"1px solid var(--border)":"none" }}>
                <div style={{ fontWeight:800,fontSize:20,letterSpacing:"-.02em",color:"#60a5fa",fontFamily:"'Geist',sans-serif" }}>{s.n}</div>
                <div style={{ fontSize:11,color:"#334155",marginTop:2,fontFamily:"'Geist Mono',monospace" }}>{s.label}</div>
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
      <section style={{ padding:"80px 6%", minHeight:"600px" }}>
        <div className="divider-glow" style={{ height:"1px", marginBottom:80 }} />
        <div style={{ maxWidth:1060,margin:"0 auto" }}>
          <div className="r" style={{ textAlign:"center",marginBottom:52 }}>
            <h2 className="h2" style={{ marginBottom:16 }}>
              Your team is <span className="g-blue">drowning in tabs</span> looking for answers
            </h2>
            <p style={{ color:"var(--text-muted)",maxWidth:520,margin:"0 auto",lineHeight:1.7 }}>
              Knowledge scattered across Google Drive, Confluence, email threads, Bitrix tasks, and human brains. WikiAI fixes that.
            </p>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"var(--border)",borderRadius:14,overflow:"hidden" }}>
            {[
              { icon:"😤", title:"Before WikiAI", items:["Ask a colleague, interrupt their flow","Search 5 different systems manually","Wait for email reply that never comes","Onboarding takes weeks, not days"] },
              { icon:"⚡", title:"With WikiAI", items:["Ask in Telegram, get answer in 1 second","One search across all company data","AI cites the exact source document","New hires self-serve from day one"], hi:true },
              { icon:"📈", title:"The Result", items:["40% fewer interruption requests","10× faster information retrieval","Consistent answers across the team","Knowledge gaps become visible"] },
            ].map((col,i)=>(
              <div key={i} className="r" style={{ background:col.hi?"rgba(59,130,246,0.05)":"var(--card)",padding:"32px 28px",transitionDelay:`${i*90}ms` }}>
                <div style={{ fontSize:28,marginBottom:14 }}>{col.icon}</div>
                <div style={{ fontSize:14,fontWeight:700,color:col.hi?"#60a5fa":"#64748b",marginBottom:18,fontFamily:"'Geist Mono',monospace",letterSpacing:".04em",textTransform:"uppercase" }}>{col.title}</div>
                {col.items.map((item,j)=>(
                  <div key={j} style={{ display:"flex",alignItems:"flex-start",gap:9,marginBottom:12,fontSize:14,color:col.hi?"#f1f5f9":"#64748b",lineHeight:1.5 }}>
                    <span style={{ color:col.hi?"#22c55e":"#334155",marginTop:2,flexShrink:0 }}>{col.hi?"✓":"–"}</span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE SEARCH DEMO ─────────────────────── */}
      <section id="how-it-works" style={{ padding:"80px 6%", minHeight:"600px" }}>
        <div className="divider-glow" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag="Live Demo"
          tagStyle="blue"
          title={`Employees <span class="g-blue">find answers instantly</span>`}
          sub="Real questions from real roles — answered in under a second from your company's actual knowledge base."
        />
        <div className="r" style={{ transitionDelay:"80ms" }}>
          <SearchDemo />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section id="features" style={{ padding:"80px 6%", minHeight:"600px" }}>
        <div className="divider-glow" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag="Platform"
          tagStyle=""
          title={`Everything in one place,<br/><span class="g-blue">delivered everywhere</span>`}
          sub="A complete knowledge infrastructure — from ingestion to delivery."
        />
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:18,maxWidth:1060,margin:"0 auto" }}>
          {FEATURES.map((f,i)=>(
            <div key={i} className={`feat-card r`} style={{ transitionDelay:`${i*70}ms` }}>
              <div style={{ fontSize:30,marginBottom:16 }}>{f.icon}</div>
              <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:10 }}>
                <h3 style={{ fontSize:16,fontWeight:700,color:"#f1f5f9" }}>{f.title}</h3>
                <span className={`tag ${f.tagStyle}`} style={{ fontSize:10,padding:"2px 8px" }}>{f.tag}</span>
              </div>
              <p style={{ color:"var(--text-muted)",fontSize:14,lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EMPLOYEE JOURNEY ─────────────────────── */}
      <section style={{ padding:"80px 6%",background:"linear-gradient(180deg,transparent,rgba(59,130,246,0.025),transparent)" }}>
        <div style={{ maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center" }}>
          <div className="r-l">
            <span className="tag" style={{ marginBottom:18,display:"inline-flex" }}>Employee Experience</span>
            <h2 className="h2" style={{ marginBottom:18,lineHeight:1.15 }}>
              Every role gets answers <span className="g-blue">in seconds</span>
            </h2>
            <p style={{ color:"var(--text-muted)",fontSize:15,lineHeight:1.75,marginBottom:28 }}>
              From a first-day hire to a seasoned VP — WikiAI understands the context of the question and searches across every document, database, and system your company uses.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {["HR policies, contracts, and onboarding guides","Sales playbooks and pricing rules","Technical runbooks and infrastructure docs","Live CRM and ERP data via integrations"].map((item,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:14,color:"#94a3b8" }}>
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
      <section id="integrations" style={{ padding:"80px 6%", minHeight:"700px" }}>
        <div className="divider-glow" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag="Integrations"
          tagStyle=""
          title={`Connect your systems. <span class="g-blue">Deliver anywhere.</span>`}
          sub="WikiAI sits at the center of your tech stack — pulling from every source, pushing answers to every channel."
        />
        <div className="r" style={{ transitionDelay:"60ms" }}>
          <HubDiagram />
        </div>
        {/* Extra detail row */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,maxWidth:900,margin:"48px auto 0" }}>
          {[
            { icon:"🔷", title:"Bitrix24", desc:"Sync CRM contacts, deals, tasks and company wikis in real-time." },
            { icon:"📊", title:"1C / ERP", desc:"Pull product catalogs, pricing, inventory and order data automatically." },
            { icon:"💬", title:"Telegram & Slack", desc:"Deploy a bot that answers in your team chats, powered by company knowledge." },
            { icon:"🛒", title:"Online Store", desc:"Embed a support agent that answers product and policy questions on your shop." },
          ].map((c,i)=>(
            <div key={i} className={`r feat-card`} style={{ transitionDelay:`${i*80}ms` }}>
              <div style={{ fontSize:24,marginBottom:12 }}>{c.icon}</div>
              <div style={{ fontSize:15,fontWeight:700,color:"#f1f5f9",marginBottom:7 }}>{c.title}</div>
              <p style={{ fontSize:13,color:"var(--text-muted)",lineHeight:1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TERMINAL ─────────────────────────────── */}
      <section style={{ padding:"80px 6%",background:"linear-gradient(180deg,transparent,rgba(59,130,246,0.025),transparent)" }}>
        <div style={{ maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center" }}>
          <div className="r-r" style={{ order:2 }}>
            <span className="tag tag-green" style={{ marginBottom:18,display:"inline-flex" }}>AI Agent Bridge</span>
            <h2 className="h2" style={{ marginBottom:18,lineHeight:1.15 }}>
              Your Telegram bot, <span className="g-blue">powered by real company data</span>
            </h2>
            <p style={{ color:"var(--text-muted)",fontSize:15,lineHeight:1.75,marginBottom:28 }}>
              Deploy WikiAI as the brain behind your internal Telegram bot, Slack assistant, or website widget. It doesn't hallucinate — it cites the exact document and section.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {[
                "Answers sourced from actual company docs",
                "Cites exact file name and paragraph",
                "Queries Bitrix CRM context on the fly",
                "Works in Russian, English, any language",
                "Escalates to human when confidence is low",
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,fontSize:14,color:"#94a3b8" }}>
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
      <section style={{ padding:"80px 6%", minHeight:"600px" }}>
        <div className="divider-glow" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag="Use Cases"
          tagStyle=""
          title={`Built for how <span class="g-blue">real teams work</span>`}
          sub="WikiAI adapts to your business — not the other way around."
        />
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18,maxWidth:1060,margin:"0 auto" }}>
          {USECASES.map((u,i)=>(
            <div key={i} className={`r feat-card`} style={{ transitionDelay:`${i*80}ms` }}>
              <div style={{ fontSize:32,marginBottom:16 }}>{u.icon}</div>
              <h3 style={{ fontSize:16,fontWeight:700,color:"#f1f5f9",marginBottom:10 }}>{u.title}</h3>
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
              <div style={{ fontSize:15,fontWeight:600,color:"#f1f5f9",marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:12,color:"#334155" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────── */}
      <section id="pricing" style={{ padding:"96px 6%", minHeight:"800px" }}>
        <div className="divider-glow" style={{ height:"1px", marginBottom:80 }} />
        <SectionHead
          tag="Pricing"
          tagStyle=""
          title={`Simple pricing, <span class="g-blue">no surprises</span>`}
          sub="Start small, scale to enterprise. All plans include a 14-day free trial."
        />
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20,maxWidth:980,margin:"0 auto" }}>
          {PLANS.map((p,i)=>(
            <div key={i} className={`price-card r ${p.hi?"featured":""}`} style={{ transitionDelay:`${i*80}ms` }}>
              {p.hi && (
                <div style={{ position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#3b82f6,#0ea5e9)",color:"#fff",fontSize:10,fontWeight:700,padding:"4px 16px",borderRadius:"0 0 8px 8px",fontFamily:"'Geist Mono',monospace",letterSpacing:".08em",whiteSpace:"nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize:18,fontWeight:700,color:"#f1f5f9",marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:13,color:"#475569",marginBottom:22 }}>{p.desc}</div>
              <div style={{ display:"flex",alignItems:"baseline",gap:4,marginBottom:8 }}>
                <span style={{ fontSize:40,fontWeight:900,letterSpacing:"-.03em",color:p.hi?"#60a5fa":"#f1f5f9" }}>{p.price}</span>
                <span style={{ color:"#475569",fontSize:14 }}>{p.per}</span>
              </div>
              <div className="divider" style={{ height:"1px", margin:"20px 0" }} />
              <div style={{ marginBottom:28 }}>
                {p.features.map((f,j)=>(
                  <div key={j} style={{ display:"flex",alignItems:"center",gap:9,marginBottom:11,fontSize:14,color:"#94a3b8" }}>
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
          <div style={{ background:"linear-gradient(135deg,rgba(59,130,246,0.1),rgba(14,165,233,0.07),rgba(99,102,241,0.06))",border:"1px solid rgba(59,130,246,0.2)",borderRadius:22,padding:"64px 48px",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)",top:"-30%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none" }} />
            <div style={{ fontSize:46,marginBottom:18 }}>🧠</div>
            <h2 className="h2" style={{ marginBottom:16 }}>
              Ready to unite your<br /><span className="g-blue">company's knowledge?</span>
            </h2>
            <p style={{ color:"var(--text-muted)",fontSize:15,maxWidth:440,margin:"0 auto 36px",lineHeight:1.7 }}>
              Join hundreds of companies who've replaced scattered wikis, folders, and endless colleague interruptions with WikiAI.
            </p>
            <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              <button 
                className="btn btn-blue btn-lg"
                onClick={() => router.push('/login')}
              >
                🚀 Start Now
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
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:36,marginBottom:52 }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:12 }}>
                <div style={{ width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#3b82f6,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>🧠</div>
                <span style={{ fontWeight:800,fontSize:17,letterSpacing:"-.02em" }}><span className="g-blue">Wiki</span>AI</span>
              </div>
              <p style={{ color:"#334155",fontSize:13,maxWidth:210,lineHeight:1.65 }}>Centralised AI knowledge hub for modern companies and their teams.</p>
            </div>
            {[
              { title:"Product", links:["Features","Integrations","Pricing","Changelog","Roadmap"] },
              { title:"Use Cases", links:["Employee Onboarding","Sales Enablement","Call Centers","E-commerce"] },
              { title:"Company", links:["About","Blog","Careers","Contact","Privacy"] },
            ].map((col,i)=>(
              <div key={i}>
                <div style={{ fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:16,letterSpacing:".06em",textTransform:"uppercase",fontFamily:"'Geist Mono',monospace" }}>{col.title}</div>
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {col.links.map(l=>(
                    <a key={l} href="#" style={{ color:"#334155",fontSize:14,textDecoration:"none",transition:"color .2s" }}
                      onMouseEnter={e=>(e.target as HTMLElement).style.color="#64748b"}
                      onMouseLeave={e=>(e.target as HTMLElement).style.color="#334155"}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="divider" style={{ height:"1px", marginBottom:24 }} />
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
            <span style={{ color:"#1e293b",fontSize:13,fontFamily:"'Geist Mono',monospace" }}>© 2025 WikiAI. All rights reserved.</span>
            <div style={{ display:"flex",gap:20 }}>
              {["Privacy","Terms","Security"].map(l=>(
                <a key={l} href="#" style={{ color:"#1e293b",fontSize:13,textDecoration:"none",transition:"color .2s" }}
                  onMouseEnter={e=>(e.target as HTMLElement).style.color="#334155"}
                  onMouseLeave={e=>(e.target as HTMLElement).style.color="#1e293b"}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}