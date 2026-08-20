"use client"

import { useState, useEffect, useRef } from "react"

/* ─────────────────────────────────────────────────────────────
   ANIMATION STYLES  (injected once, scoped to this page)
───────────────────────────────────────────────────────────── */
const ANIMATIONS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap');

  /* ── tokens that extend shadcn's existing dark palette ── */
  :root {
    --blue:       #3b82f6;
    --blue-light: #60a5fa;
    --blue-dim:   rgba(59,130,246,0.1);
    --sky:        #0ea5e9;
    --green:      #22c55e;
    --amber:      #f59e0b;
    --muted-fg:   #64748b;
    --subtle-fg:  #334155;
    --card-hi:    rgba(59,130,246,0.06);
  }

  /* ── typeface override ── */
  .wai-root, .wai-root * { font-family: 'Geist', system-ui, sans-serif; }
  .wai-mono { font-family: 'Geist Mono', monospace !important; }

  /* ── keyframes ── */
  @keyframes wai-fadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
  @keyframes wai-fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes wai-floatY   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes wai-shimmer  { 0%   { background-position:-300% center; }
                            100% { background-position: 300% center; } }
  @keyframes wai-blink    { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes wai-spin     { from{transform:rotate(0deg);}   to{transform:rotate(360deg);} }
  @keyframes wai-spin-r   { from{transform:rotate(0deg);}   to{transform:rotate(-360deg);} }
  @keyframes wai-pulseDot { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.45;transform:scale(.75);} }
  @keyframes wai-typing   { from{width:0;} to{width:100%;} }
  @keyframes wai-countUp  { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }

  /* ── scroll reveal ── */
  .wai-r, .wai-rl, .wai-rr {
    opacity: 0;
    transition: opacity .6s ease, transform .6s ease;
  }
  .wai-r  { transform: translateY(22px); }
  .wai-rl { transform: translateX(-28px); }
  .wai-rr { transform: translateX(28px); }
  .wai-r.on, .wai-rl.on, .wai-rr.on { opacity:1; transform:none; }

  /* ── gradient text ── */
  .wai-g-blue {
    background: linear-gradient(135deg,#60a5fa 0%,#0ea5e9 60%,#38bdf8 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .wai-g-shimmer {
    background: linear-gradient(90deg,#f1f5f9 0%,#60a5fa 30%,#0ea5e9 50%,#60a5fa 70%,#f1f5f9 100%);
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation: wai-shimmer 4s linear infinite;
  }

  /* ── tag pill ── */
  .wai-tag {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 12px; border-radius:9999px;
    font-size:11px; font-weight:600; letter-spacing:.07em; text-transform:uppercase;
    font-family:'Geist Mono',monospace;
    background:rgba(59,130,246,.1); color:#60a5fa;
    border:1px solid rgba(59,130,246,.22);
  }
  .wai-tag-green  { background:rgba(34,197,94,.08); color:#4ade80; border-color:rgba(34,197,94,.2); }
  .wai-tag-indigo { background:rgba(99,102,241,.1); color:#a5b4fc; border-color:rgba(99,102,241,.25); }
  .wai-tag-amber  { background:rgba(245,158,11,.08); color:#fbbf24; border-color:rgba(245,158,11,.2); }

  /* ── glass card surface ── */
  .wai-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius) + 2px);
  }
  .wai-card-hi {
    background: var(--card-hi);
    border: 1px solid rgba(59,130,246,.3);
    border-radius: calc(var(--radius) + 2px);
    box-shadow: 0 0 40px rgba(59,130,246,.07);
  }

  /* ── feature card hover ── */
  .wai-feat {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius) + 4px);
    padding: 28px;
    transition: border-color .25s, transform .28s, box-shadow .28s;
    position: relative; overflow: hidden;
  }
  .wai-feat::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(59,130,246,.05),transparent 55%);
    opacity:0; transition:opacity .3s;
  }
  .wai-feat:hover { border-color:rgba(59,130,246,.3); transform:translateY(-3px); box-shadow:0 20px 50px rgba(0,0,0,.4); }
  .wai-feat:hover::before { opacity:1; }

  /* ── integration card ── */
  .wai-int {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius) + 2px);
    padding:14px 16px;
    display:flex; align-items:center; gap:10px;
    transition: border-color .35s, transform .25s, box-shadow .25s;
  }
  .wai-int:hover { border-color:rgba(59,130,246,.3); transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,.35); }

  /* ── buttons ── */
  .wai-btn {
    display:inline-flex; align-items:center; gap:8px;
    border:none; border-radius:8px; cursor:pointer;
    font-family:'Geist',sans-serif; font-weight:600; font-size:14px;
    letter-spacing:-.01em; transition:all .2s;
    padding:11px 24px;
  }
  .wai-btn-blue { background:var(--blue); color:#fff; }
  .wai-btn-blue:hover { background:#2563eb; box-shadow:0 8px 28px rgba(59,130,246,.38); transform:translateY(-1px); }
  .wai-btn-outline { background:transparent; color:hsl(var(--foreground)); border:1px solid hsl(var(--border)); }
  .wai-btn-outline:hover { border-color:rgba(255,255,255,.15); background:rgba(255,255,255,.03); }
  .wai-btn-lg { padding:14px 32px; font-size:15px; border-radius:10px; }

  /* ── grid background ── */
  .wai-grid-bg {
    background-image:
      linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px),
      linear-gradient(90deg,rgba(59,130,246,.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ── dividers ── */
  .wai-divider      { height:1px; background:hsl(var(--border)); }
  .wai-divider-glow { height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,.3),transparent); }

  /* ── terminal ── */
  .wai-term {
    background:#06080f;
    border:1px solid rgba(59,130,246,.18);
    border-radius:14px; overflow:hidden;
    font-family:'Geist Mono',monospace;
    box-shadow:0 40px 80px rgba(0,0,0,.6),0 0 0 1px rgba(59,130,246,.05);
  }
  .wai-term-bar {
    background:#0b0f1c; padding:11px 16px;
    display:flex; align-items:center; gap:8px;
    border-bottom:1px solid rgba(59,130,246,.08);
  }

  /* ── search pill ── */
  .wai-search {
    display:flex; align-items:center; gap:12px;
    background:hsl(var(--card)); border:1px solid rgba(59,130,246,.2);
    border-radius:12px; padding:13px 18px; margin-bottom:14px;
    box-shadow:0 20px 50px rgba(0,0,0,.38);
    transition:border-color .3s, box-shadow .3s;
  }
  .wai-search:focus-within { border-color:rgba(59,130,246,.45); box-shadow:0 20px 50px rgba(59,130,246,.1); }

  /* ── pricing ── */
  .wai-price {
    background:hsl(var(--card)); border:1px solid hsl(var(--border));
    border-radius:16px; padding:36px 30px; position:relative;
    transition:transform .3s, box-shadow .3s, border-color .3s;
  }
  .wai-price:hover { transform:translateY(-4px); box-shadow:0 28px 70px rgba(0,0,0,.5); }
  .wai-price.featured { border-color:rgba(59,130,246,.4); background:linear-gradient(160deg,rgba(59,130,246,.06),hsl(var(--card))); }
  .wai-price.featured:hover { box-shadow:0 28px 70px rgba(59,130,246,.12); }

  /* ── splash ── */
  .wai-splash {
    position:fixed; inset:0; z-index:9998;
    background:hsl(var(--background));
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    animation: wai-fadeIn .3s ease;
  }
  .wai-splash-bar { width:200px; height:2px; background:hsl(var(--border)); border-radius:2px; overflow:hidden; margin-top:32px; }
  .wai-splash-fill { height:100%; background:linear-gradient(90deg,var(--blue),var(--sky)); border-radius:2px; animation:wai-typing 1.9s ease forwards; }

  /* ── noise overlay ── */
  .wai-noise {
    position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.02;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* ── nav ── */
  .wai-nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 6%; height:60px;
    transition:background .3s, border-color .3s;
  }
  .wai-nav.scrolled {
    background:rgba(9,9,11,.82);
    backdrop-filter:blur(20px);
    border-bottom:1px solid hsl(var(--border));
  }

  /* ── float animation utility ── */
  .wai-float { animation: wai-floatY 3s ease-in-out infinite; }
  .wai-float-2 { animation: wai-floatY 3s ease-in-out infinite; animation-delay:.9s; }
  .wai-float-3 { animation: wai-floatY 3s ease-in-out infinite; animation-delay:1.8s; }

  @media(max-width:768px){
    .wai-hide-mobile{display:none!important;}
    .wai-col-2{grid-template-columns:1fr!important;}
  }
`

/* ─────────────────────────────────────────────────────────────
   HOOK: scroll reveals
───────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".wai-r,.wai-rl,.wai-rr")
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────────── */
function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true
        const steps = 50, dur = 1600
        let i = 0
        const t = setInterval(() => {
          i++
          const p = i / steps
          setN(parseFloat((to * (1 - Math.pow(1 - p, 3))).toFixed(decimals)))
          if (i >= steps) { setN(to); clearInterval(t) }
        }, dur / steps)
      }
    }, { threshold: 0.3 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to, decimals])
  return <span ref={ref}>{decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString()}{suffix}</span>
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED TERMINAL
───────────────────────────────────────────────────────────── */
const TERM_LINES = [
  { d: 0,    c: "#64748b", t: "# Employee asks a question in Telegram" },
  { d: 500,  c: "#94a3b8", t: "→ Received: \"What's the refund policy for B2B clients?\"" },
  { d: 1100, c: "#60a5fa", t: "→ Querying WikiAI knowledge base..." },
  { d: 1700, c: "#64748b", t: "→ Searching: contracts_2024.pdf, policy_manual.docx" },
  { d: 2200, c: "#60a5fa", t: "→ Cross-referencing Bitrix CRM client segment..." },
  { d: 2800, c: "#22c55e", t: "✓ Answer found — confidence 96.2%" },
  { d: 3300, c: "#f1f5f9", t: "  \"B2B clients with Enterprise tier receive 30-day" },
  { d: 3400, c: "#f1f5f9", t: "   full refund window. See §4.2 of Contract Terms.\"" },
  { d: 3900, c: "#94a3b8", t: "→ Sources: policy_manual.docx §4.2, crm_tier_rules.json" },
  { d: 4400, c: "#f59e0b", t: "⚡ Total response time: 0.9s" },
]

function AnimatedTerminal() {
  const [shown, setShown] = useState<number[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const play = () => {
    started.current = true
    setShown([])
    TERM_LINES.forEach((l, i) => setTimeout(() => setShown((v) => [...v, i]), l.d))
  }

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) play()
    }, { threshold: 0.25 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="wai-term">
      {/* window bar */}
      <div className="wai-term-bar">
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444", display: "block" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b", display: "block" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#22c55e", display: "block" }} />
        <span style={{ marginLeft: 10, fontSize: 11, color: "#334155" }}>wikiai — ai-agent bridge</span>
        <button
          onClick={() => { started.current = false; setTimeout(play, 80) }}
          style={{ marginLeft: "auto", background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 11 }}
        >↺ replay</button>
      </div>
      {/* output lines */}
      <div style={{ padding: "18px 20px", minHeight: 280 }}>
        {TERM_LINES.map((l, i) => (
          <div
            key={i}
            className="wai-mono"
            style={{
              opacity: shown.includes(i) ? 1 : 0,
              transform: shown.includes(i) ? "none" : "translateY(4px)",
              transition: "opacity .28s ease, transform .28s ease",
              color: l.c,
              fontSize: 12.5,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {l.t}
            {i === TERM_LINES.length - 1 && shown.includes(i) && (
              <span style={{ animation: "wai-blink 1s step-end infinite", marginLeft: 1 }}>█</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   INTEGRATION HUB DIAGRAM
───────────────────────────────────────────────────────────── */
const SOURCES = [
  { icon: "🔷", label: "Bitrix24",    sub: "CRM / Tasks" },
  { icon: "📊", label: "1C ERP",      sub: "Operations" },
  { icon: "📁", label: "Google Drive",sub: "Documents" },
  { icon: "🔗", label: "Confluence",  sub: "Wiki pages" },
  { icon: "📬", label: "Email / IMAP",sub: "Mail archive" },
  { icon: "🗃️", label: "SharePoint",  sub: "Corp files" },
]
const CHANNELS = [
  { icon: "💬", label: "Telegram Bot",  sub: "Team messenger" },
  { icon: "🛒", label: "Online Shop",   sub: "Customer AI chat" },
  { icon: "📱", label: "Slack",         sub: "Workspace chat" },
  { icon: "🌐", label: "Website Widget",sub: "Support chat" },
  { icon: "📞", label: "Call Center",   sub: "Agent assistant" },
  { icon: "🔌", label: "REST API",      sub: "Any integration" },
]

function HubDiagram() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const iv = setInterval(() => setTick((t) => t + 1), 1200); return () => clearInterval(iv) }, [])
  const aIn = tick % SOURCES.length
  const aOut = tick % CHANNELS.length

  const col = (items: typeof SOURCES, active: number, flip: boolean, activeColor: string) => (
    <div className="flex flex-col gap-2.5">
      {items.map((s, i) => (
        <div
          key={i}
          className="wai-int"
          style={{
            flexDirection: flip ? "row-reverse" : "row",
            borderColor: i === active ? activeColor : undefined,
            boxShadow: i === active ? `0 0 18px ${activeColor}22` : undefined,
            transition: "all .4s ease",
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: i === active ? `${activeColor}18` : "rgba(255,255,255,0.04)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, flexShrink: 0, transition: "background .4s",
          }}>{s.icon}</div>
          <div style={{ textAlign: flip ? "right" : "left" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: i === active ? "#f1f5f9" : "#94a3b8", transition: "color .4s" }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#334155" }}>{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, alignItems: "center", maxWidth: 880, margin: "0 auto" }}>
      {/* sources */}
      <div>
        <div className="wai-mono" style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10, textAlign: "right" }}>Data Sources</div>
        {col(SOURCES, aIn, true, "rgba(59,130,246,.6)")}
      </div>

      {/* hub orb */}
      <div className="flex flex-col items-center gap-2" style={{ padding: "0 8px" }}>
        <div style={{ width: 1, height: 56, background: "linear-gradient(to top,rgba(59,130,246,.5),transparent)" }} />
        <div style={{ position: "relative", width: 96, height: 96 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(59,130,246,.2)", animation: "wai-spin 12s linear infinite" }} />
          <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: "1px solid rgba(59,130,246,.12)", animation: "wai-spin-r 8s linear infinite" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.16),transparent 70%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>🧠</span>
            <span className="wai-mono" style={{ fontSize: 9, color: "#60a5fa", fontWeight: 600, letterSpacing: ".08em", marginTop: 3 }}>WikiAI</span>
          </div>
        </div>
        <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom,rgba(59,130,246,.5),transparent)" }} />
        <span className="wai-mono" style={{ fontSize: 9, color: "#1e3a5f", letterSpacing: ".1em", textTransform: "uppercase" }}>Knowledge Hub</span>
      </div>

      {/* channels */}
      <div>
        <div className="wai-mono" style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>Delivery Channels</div>
        {col(CHANNELS, aOut, false, "rgba(34,197,94,.6)")}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SEARCH DEMO
───────────────────────────────────────────────────────────── */
const DEMOS = [
  {
    q: "What is our vacation policy for remote employees?",
    results: [
      { doc: "HR Policy Manual 2024",     page: "§8.3",     score: 98, snippet: "Remote employees are entitled to 28 calendar days of paid vacation, applicable from first day of employment..." },
      { doc: "Employment Contract Template", page: "Clause 12", score: 87, snippet: "Vacation scheduling must be agreed with direct manager 14 days in advance via the HR portal..." },
    ],
  },
  {
    q: "How to process a B2B refund in Bitrix?",
    results: [
      { doc: "Bitrix CRM Guide",  page: "Ch.6",  score: 96, snippet: "Navigate to CRM → Deals → Refund Requests. Select client segment 'B2B Enterprise' and initiate refund workflow..." },
      { doc: "Finance SOP v3",   page: "p.14",   score: 82, snippet: "B2B refunds require approval from Finance Manager and must be logged in 1C within 2 business days..." },
    ],
  },
  {
    q: "What servers are in production right now?",
    results: [
      { doc: "Infrastructure Registry", page: "Live",  score: 99, snippet: "Current production: app-srv-01 (Berlin), app-srv-02 (Frankfurt), db-master-01, cdn-edge-04..." },
      { doc: "Deployment Runbook",       page: "§2",    score: 78, snippet: "All production changes require DevOps lead sign-off. Maintenance window: Sundays 02:00–04:00 UTC..." },
    ],
  },
]

function SearchDemo() {
  const [qi, setQi] = useState(0)
  const [typed, setTyped] = useState("")
  const [searching, setSearching] = useState(false)
  const [show, setShow] = useState(true)

  // initial type-in
  useEffect(() => {
    const q = DEMOS[0].q; let i = 0
    const iv = setInterval(() => { i++; setTyped(q.slice(0, i)); if (i >= q.length) clearInterval(iv) }, 40)
    return () => clearInterval(iv)
  }, [])

  // cycle
  useEffect(() => {
    const t = setTimeout(() => {
      const next = (qi + 1) % DEMOS.length
      setShow(false); setSearching(false); setTyped("")
      const q = DEMOS[next].q; let i = 0
      const iv = setInterval(() => {
        i++; setTyped(q.slice(0, i))
        if (i >= q.length) {
          clearInterval(iv); setSearching(true)
          setTimeout(() => { setSearching(false); setShow(true); setQi(next) }, 900)
        }
      }, 38)
    }, 3600)
    return () => clearTimeout(t)
  }, [qi])

  const cur = DEMOS[qi]
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="wai-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span className="wai-mono" style={{ flex: 1, fontSize: 13, color: "#f1f5f9" }}>
          {typed}<span style={{ animation: "wai-blink .85s step-end infinite" }}>|</span>
        </span>
        {searching
          ? <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(59,130,246,.3)", borderTopColor: "#3b82f6", animation: "wai-spin .7s linear infinite" }} />
          : <span className="wai-mono" style={{ fontSize: 10, background: "rgba(59,130,246,.1)", color: "#60a5fa", borderRadius: 5, padding: "3px 8px", fontWeight: 600, letterSpacing: ".05em" }}>AI AGENT</span>
        }
      </div>

      <div className="flex flex-col gap-2.5">
        {show && cur.results.map((r, i) => (
          <div
            key={`${qi}-${i}`}
            className="wai-card"
            style={{ padding: "14px 16px", animation: `wai-fadeUp .35s ease both`, animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{r.doc}</span>
                <span className="wai-mono" style={{ fontSize: 11, color: "#334155", marginLeft: 8 }}>{r.page}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div style={{ width: 36, height: 3, background: "rgba(59,130,246,.15)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${r.score}%`, background: "linear-gradient(90deg,#3b82f6,#60a5fa)", borderRadius: 2 }} />
                </div>
                <span className="wai-mono" style={{ fontSize: 11, color: "#60a5fa" }}>{r.score}%</span>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55 }}>{r.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   EMPLOYEE JOURNEY
───────────────────────────────────────────────────────────── */
const JOURNEYS = [
  { who: "👤", role: "New Employee",  q: '"What\'s our expense reimbursement process?"',  a: "Found in Finance SOP §3.1 — submit via HR portal within 30 days with receipts.", color: "#3b82f6" },
  { who: "🧑‍💼", role: "Sales Manager", q: '"What\'s the discount ceiling for SMB clients?"', a: "Max 15% without VP approval. Source: Pricing Policy 2024, updated Jan 15.", color: "#6366f1" },
  { who: "🧑‍🔧", role: "Support Agent", q: '"How to reset 2FA for a client account?"',        a: "Use admin panel → Users → Security. Requires ticket logged in Bitrix first.", color: "#0ea5e9" },
]

function EmployeeJourney() {
  return (
    <div className="flex flex-col gap-3.5">
      {JOURNEYS.map((s, i) => (
        <div key={i} className="wai-r wai-card" style={{ padding: "18px 20px", transitionDelay: `${i * 110}ms` }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{s.who}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{s.role}</span>
          </div>
          <div style={{ background: `${s.color}0d`, border: `1px solid ${s.color}1f`, borderRadius: 8, padding: "9px 13px", marginBottom: 8, fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>{s.q}</div>
          <div style={{ background: "rgba(34,197,94,.04)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "#86efac" }}>🧠 {s.a}</div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "🧠", title: "Single Knowledge Hub",   desc: "All company documents, policies, CRM data and wikis in one AI-searchable place. No more hunting through folders.",                    tag: "Core",         tc: "" },
  { icon: "🔌", title: "Deep Integrations",       desc: "Pull data live from Bitrix24, 1C ERP, Confluence, SharePoint, Google Drive. Knowledge stays automatically fresh.",                  tag: "Integrations", tc: "wai-tag-indigo" },
  { icon: "🤖", title: "AI Agent Delivery",       desc: "Deploy WikiAI as an AI agent in Telegram, website chat, Slack or online store. Answers driven by your real company data.",          tag: "Delivery",     tc: "wai-tag-green" },
  { icon: "🔍", title: "Semantic Search",         desc: "Ask questions in natural language. Vector embeddings understand meaning, not keywords. Ranked answers with source citations.",       tag: "Search",       tc: "" },
  { icon: "🏢", title: "Multi-Department",        desc: "Separate knowledge bases per department with full data isolation. Marketing, Sales, Tech — each with their own space.",              tag: "Multi-tenant", tc: "wai-tag-indigo" },
  { icon: "📊", title: "Usage Analytics",         desc: "See what questions employees ask most. Identify knowledge gaps. Track adoption and measure ROI of your knowledge base.",            tag: "Analytics",    tc: "wai-tag-amber" },
]

const STATS = [
  { n: 10,   s: "x",  label: "Faster answers",       desc: "vs searching manually",           dec: 0 },
  { n: 40,   s: "%",  label: "Fewer interruptions",   desc: "colleagues stop asking each other", dec: 0 },
  { n: 0.9,  s: "s",  label: "Avg response time",     desc: "AI query to answer",               dec: 1 },
  { n: 99.9, s: "%",  label: "Uptime SLA",            desc: "enterprise reliability",            dec: 1 },
]

const PLANS = [
  {
    name: "Starter", price: "$79", per: "/mo", desc: "Small teams, single department",
    features: ["1 department workspace", "Up to 25 users", "10 GB document storage", "Standard AI search", "1 channel (Telegram/Web)", "Basic analytics"],
    hi: false, cta: "Start Free",
  },
  {
    name: "Business", price: "$249", per: "/mo", desc: "Growing companies, multiple sources",
    features: ["5 department workspaces", "Unlimited users", "100 GB storage", "AI Agent mode + commands", "Bitrix24 & CRM integration", "3 external channels", "Advanced analytics", "API access"],
    hi: true, cta: "Try Free 14 Days",
  },
  {
    name: "Enterprise", price: "Custom", per: "", desc: "Large-scale or self-hosted",
    features: ["Unlimited workspaces", "Any data source", "Self-hosted option", "SSO / SAML / LDAP", "Custom LLM providers", "Unlimited channels", "White-label bot", "SLA + Dedicated support"],
    hi: false, cta: "Talk to Us",
  },
]

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
// Hoisted to module scope (not defined inside LandingPage's render body) so
// their identity is stable across renders instead of remounting on every
// LandingPage re-render.
const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const Divider = ({ glow = false }: { glow?: boolean }) => (
  <div className={glow ? "wai-divider-glow" : "wai-divider"} style={{ marginBottom: 80 }} />
)

const SectionHead = ({
  tag, tagCls = "", title, sub, center = true,
}: { tag: string; tagCls?: string; title: string; sub?: string; center?: boolean }) => (
  <div className={`wai-r ${center ? "text-center" : ""}`} style={{ marginBottom: 52 }}>
    <span className={`wai-tag ${tagCls}`} style={{ marginBottom: 14, display: "inline-flex" }}>{tag}</span>
    <h2
      style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 750, lineHeight: 1.12, letterSpacing: "-.025em", marginBottom: 14 }}
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {sub && (
      <p style={{ color: "var(--muted-fg)", maxWidth: 480, margin: center ? "0 auto" : "0", lineHeight: 1.7, fontSize: 16 }}>
        {sub}
      </p>
    )}
  </div>
)

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [splash, setSplash] = useState(true)
  useReveal()

  useEffect(() => { const t = setTimeout(() => setSplash(false), 2100); return () => clearTimeout(t) }, [])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <>
      {/* inject animation styles */}
      <style>{ANIMATIONS}</style>

      <div className="wai-root min-h-screen bg-background">
        {/* noise */}
        <div className="wai-noise" />

        {/* ── SPLASH ─────────────────────────── */}
        {splash && (
          <div className="wai-splash">
            <div style={{ position: "relative", marginBottom: 24 }}>
              <div
                className="wai-float"
                style={{ width: 68, height: 68, borderRadius: 18, background: "linear-gradient(135deg,#3b82f6,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, boxShadow: "0 0 60px rgba(59,130,246,.45)" }}
              >🧠</div>
              <div style={{ position: "absolute", inset: -10, borderRadius: 24, border: "1px solid rgba(59,130,246,.25)", animation: "wai-spin 6s linear infinite" }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 6 }}>
              <span className="wai-g-blue">Wiki</span>AI
            </div>
            <div className="wai-mono" style={{ fontSize: 12, color: "#334155" }}>loading knowledge engine...</div>
            <div className="wai-splash-bar"><div className="wai-splash-fill" /></div>
          </div>
        )}

        {/* ── NAV ────────────────────────────── */}
        <nav className={`wai-nav ${scrolled ? "scrolled" : ""}`}>
          <div className="flex items-center gap-2.5">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧠</div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em" }}><span className="wai-g-blue">Wiki</span>AI</span>
          </div>

          <div className="wai-hide-mobile flex items-center gap-7">
            {["Features", "How It Works", "Integrations", "Pricing"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                style={{ textDecoration: "none" }}
              >{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button className="wai-btn wai-btn-outline" style={{ padding: "8px 18px", fontSize: 13 }}>Sign In</button>
            <button className="wai-btn wai-btn-blue"    style={{ padding: "8px 18px", fontSize: 13 }}>Get Started →</button>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────── */}
        <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh", paddingTop: 80 }}>
          <div className="wai-grid-bg absolute inset-0" style={{ opacity: .55 }} />

          {/* glow orbs */}
          <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.1),transparent 65%)", top: "5%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.07),transparent 70%)", top: "60%", left: "8%", pointerEvents: "none" }} />

          <div
            className="relative text-center"
            style={{ maxWidth: 860, padding: "0 5%", animation: "wai-fadeUp .9s ease .25s both" }}
          >
            <div className="flex justify-center mb-5">
              <span className="wai-tag">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "wai-pulseDot 1.8s ease-in-out infinite" }} />
                Company Knowledge Platform
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.6rem,6vw,5rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-.03em", marginBottom: 22 }}>
              All Company Knowledge.<br />
              <span className="wai-g-shimmer">One Intelligent Hub.</span>
            </h1>

            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--muted-fg)", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}>
              WikiAI centralises everything your company knows — from CRM records to policy docs — and makes it instantly searchable by every employee, and deliverable through any channel.
            </p>

            {/* value pills */}
            <div className="flex gap-5 justify-center flex-wrap mb-9">
              {["Connects to Bitrix, ERP, Drive", "Answers in any messenger or chat", "Employees find answers in seconds"].map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Check />{p}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center flex-wrap mb-16">
              <button className="wai-btn wai-btn-blue wai-btn-lg">🚀 Start for Free</button>
              <button className="wai-btn wai-btn-outline wai-btn-lg">▶ Watch Demo</button>
            </div>

            {/* proof bar */}
            <div
              className="wai-card flex flex-wrap"
              style={{ maxWidth: 680, margin: "0 auto", borderRadius: 12, overflow: "hidden" }}
            >
              {[
                { n: "500+", label: "Companies" },
                { n: "<1s",  label: "AI Response" },
                { n: "10+",  label: "Integrations" },
                { n: "99.9%",label: "Uptime" },
              ].map((s, i, arr) => (
                <div
                  key={i}
                  className="flex-1 text-center"
                  style={{ padding: "18px 10px", borderRight: i < arr.length - 1 ? "1px solid hsl(var(--border))" : "none", minWidth: 120 }}
                >
                  <div className="wai-g-blue" style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-.02em" }}>{s.n}</div>
                  <div className="wai-mono text-muted-foreground" style={{ fontSize: 11, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* scroll hint */}
          <div
            className="wai-float absolute"
            style={{ bottom: 28, left: "50%", transform: "translateX(-50%)", opacity: .35, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </section>

        {/* ── PROBLEM / VALUE ────────────────── */}
        <section className="px-[6%] py-20">
          <Divider glow />
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            <div className="wai-r text-center mb-12">
              <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 750, letterSpacing: "-.025em", marginBottom: 14 }}>
                Your team is <span className="wai-g-blue">drowning in tabs</span> looking for answers
              </h2>
              <p className="text-muted-foreground" style={{ maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Knowledge scattered across Google Drive, Confluence, email threads, Bitrix tasks, and human brains. WikiAI fixes that.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "hsl(var(--border))", borderRadius: 14, overflow: "hidden" }}>
              {[
                { icon: "😤", title: "Before WikiAI",   items: ["Ask a colleague, interrupt their flow", "Search 5 different systems manually", "Wait for email reply that never comes", "Onboarding takes weeks, not days"], hi: false },
                { icon: "⚡", title: "With WikiAI",     items: ["Ask in Telegram, get answer in 1 second", "One search across all company data", "AI cites the exact source document",   "New hires self-serve from day one"], hi: true },
                { icon: "📈", title: "The Result",      items: ["40% fewer interruption requests",          "10× faster information retrieval",     "Consistent answers across the team",   "Knowledge gaps become visible"],       hi: false },
              ].map((col, i) => (
                <div
                  key={i}
                  className="wai-r"
                  style={{ background: col.hi ? "var(--card-hi)" : "hsl(var(--card))", padding: "30px 26px", transitionDelay: `${i * 90}ms` }}
                >
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{col.icon}</div>
                  <div className="wai-mono" style={{ fontSize: 13, fontWeight: 700, color: col.hi ? "#60a5fa" : "#475569", marginBottom: 16, letterSpacing: ".04em", textTransform: "uppercase" }}>{col.title}</div>
                  {col.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 mb-3" style={{ fontSize: 14, color: col.hi ? "#f1f5f9" : "#475569", lineHeight: 1.5 }}>
                      <span style={{ color: col.hi ? "#22c55e" : "#334155", marginTop: 2, flexShrink: 0 }}>{col.hi ? "✓" : "–"}</span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LIVE SEARCH DEMO ───────────────── */}
        <section id="how-it-works" className="px-[6%] py-20">
          <Divider glow />
          <SectionHead
            tag="Live Demo"
            title={`Employees <span class="wai-g-blue">find answers instantly</span>`}
            sub="Real questions from real roles — answered in under a second from your company's actual knowledge base."
          />
          <div className="wai-r" style={{ transitionDelay: "80ms" }}>
            <SearchDemo />
          </div>
        </section>

        {/* ── FEATURES ───────────────────────── */}
        <section id="features" className="px-[6%] py-20">
          <Divider glow />
          <SectionHead
            tag="Platform"
            title={`Everything in one place,<br/><span class="wai-g-blue">delivered everywhere</span>`}
            sub="A complete knowledge infrastructure — from ingestion to delivery."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18, maxWidth: 1060, margin: "0 auto" }}>
            {FEATURES.map((f, i) => (
              <div key={i} className={`wai-feat wai-r`} style={{ transitionDelay: `${i * 70}ms` }}>
                <div style={{ fontSize: 30, marginBottom: 16 }}>{f.icon}</div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{f.title}</h3>
                  <span className={`wai-tag ${f.tc}`} style={{ fontSize: 10, padding: "2px 8px" }}>{f.tag}</span>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EMPLOYEE JOURNEY ───────────────── */}
        <section className="px-[6%] py-20" style={{ background: "linear-gradient(180deg,transparent,rgba(59,130,246,.025),transparent)" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="wai-col-2 items-center">
            <div className="wai-rl">
              <span className="wai-tag" style={{ marginBottom: 18, display: "inline-flex" }}>Employee Experience</span>
              <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.5rem)", fontWeight: 750, lineHeight: 1.15, letterSpacing: "-.025em", marginBottom: 18 }}>
                Every role gets answers <span className="wai-g-blue">in seconds</span>
              </h2>
              <p className="text-muted-foreground mb-7" style={{ fontSize: 15, lineHeight: 1.75 }}>
                From a first-day hire to a seasoned VP — WikiAI understands the context of the question and searches across every document, database, and system your company uses.
              </p>
              <div className="flex flex-col gap-2.5">
                {["HR policies, contracts, and onboarding guides", "Sales playbooks and pricing rules", "Technical runbooks and infrastructure docs", "Live CRM and ERP data via integrations"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="wai-rr"><EmployeeJourney /></div>
          </div>
        </section>

        {/* ── INTEGRATION HUB ────────────────── */}
        <section id="integrations" className="px-[6%] py-20">
          <Divider glow />
          <SectionHead
            tag="Integrations"
            title={`Connect your systems.<br/><span class="wai-g-blue">Deliver anywhere.</span>`}
            sub="WikiAI sits at the center of your tech stack — pulling from every source, pushing answers to every channel."
          />
          <div className="wai-r"><HubDiagram /></div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, maxWidth: 900, margin: "48px auto 0" }}>
            {[
              { icon: "🔷", title: "Bitrix24",    desc: "Sync CRM contacts, deals, tasks and company wikis in real-time." },
              { icon: "📊", title: "1C / ERP",    desc: "Pull product catalogs, pricing, inventory and order data automatically." },
              { icon: "💬", title: "Telegram & Slack", desc: "Deploy a bot that answers in your team chats, powered by company knowledge." },
              { icon: "🛒", title: "Online Store",desc: "Embed a support agent that answers product and policy questions on your shop." },
            ].map((c, i) => (
              <div key={i} className={`wai-feat wai-r`} style={{ transitionDelay: `${i * 80}ms` }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 7 }}>{c.title}</div>
                <p className="text-muted-foreground" style={{ fontSize: 13, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TERMINAL ───────────────────────── */}
        <section className="px-[6%] py-20" style={{ background: "linear-gradient(180deg,transparent,rgba(59,130,246,.025),transparent)" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="wai-col-2 items-center">
            <div className="wai-rl" style={{ order: 1 }}><AnimatedTerminal /></div>
            <div className="wai-rr" style={{ order: 2 }}>
              <span className="wai-tag wai-tag-green" style={{ marginBottom: 18, display: "inline-flex" }}>AI Agent Bridge</span>
              <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.5rem)", fontWeight: 750, lineHeight: 1.15, letterSpacing: "-.025em", marginBottom: 18 }}>
                Your Telegram bot, <span className="wai-g-blue">powered by real company data</span>
              </h2>
              <p className="text-muted-foreground mb-7" style={{ fontSize: 15, lineHeight: 1.75 }}>
                Deploy WikiAI as the brain behind your internal Telegram bot, Slack assistant, or website widget. It doesn&apos;t hallucinate — it cites the exact document and section.
              </p>
              <div className="flex flex-col gap-3">
                {["Answers sourced from actual company docs", "Cites exact file name and paragraph", "Queries Bitrix CRM context on the fly", "Works in Russian, English, any language", "Escalates to human when confidence is low"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check />{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ──────────────────────────── */}
        <section className="px-[6%] py-16" style={{ background: "linear-gradient(135deg,rgba(59,130,246,.04),rgba(99,102,241,.03))" }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, maxWidth: 900, margin: "0 auto", background: "hsl(var(--border))", borderRadius: 16, overflow: "hidden" }}
          >
            {STATS.map((s, i) => (
              <div key={i} className="wai-r text-center" style={{ background: "hsl(var(--card))", padding: "38px 20px", transitionDelay: `${i * 80}ms` }}>
                <div className="wai-g-blue" style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1, marginBottom: 8 }}>
                  <Counter to={s.n} suffix={s.s} decimals={s.dec} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>{s.label}</div>
                <div className="text-muted-foreground" style={{ fontSize: 12 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ────────────────────────── */}
        <section id="pricing" className="px-[6%] py-24">
          <Divider glow />
          <SectionHead
            tag="Pricing"
            title={`Simple pricing,<br/><span class="wai-g-blue">no surprises</span>`}
            sub="Start small, scale to enterprise. All plans include a 14-day free trial."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, maxWidth: 980, margin: "0 auto" }}>
            {PLANS.map((p, i) => (
              <div key={i} className={`wai-price wai-r ${p.hi ? "featured" : ""}`} style={{ transitionDelay: `${i * 80}ms` }}>
                {p.hi && (
                  <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#3b82f6,#0ea5e9)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 16px", borderRadius: "0 0 8px 8px", fontFamily: "'Geist Mono',monospace", letterSpacing: ".08em", whiteSpace: "nowrap" }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                <div className="text-muted-foreground" style={{ fontSize: 13, marginBottom: 22 }}>{p.desc}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={p.hi ? "wai-g-blue" : ""} style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-.03em" }}>{p.price}</span>
                  <span className="text-muted-foreground" style={{ fontSize: 14 }}>{p.per}</span>
                </div>
                <div className="wai-divider my-5" />
                <div className="mb-7">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5 mb-3 text-muted-foreground text-sm">
                      <Check />{f}
                    </div>
                  ))}
                </div>
                <button className={`wai-btn ${p.hi ? "wai-btn-blue" : "wai-btn-outline"} w-full justify-center`} style={{ padding: 13, width: "100%" }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────── */}
        <section className="px-[6%] pb-24">
          <div className="wai-r" style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(59,130,246,.1),rgba(14,165,233,.07),rgba(99,102,241,.06))", border: "1px solid rgba(59,130,246,.2)", borderRadius: 22, padding: "64px 48px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.12),transparent 70%)", top: "-30%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 44, marginBottom: 18 }}>🧠</div>
              <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 750, letterSpacing: "-.025em", marginBottom: 16 }}>
                Ready to unite your<br /><span className="wai-g-blue">company&apos;s knowledge?</span>
              </h2>
              <p className="text-muted-foreground" style={{ maxWidth: 440, margin: "0 auto 34px", lineHeight: 1.7 }}>
                Join hundreds of companies who&apos;ve replaced scattered wikis, folders, and endless colleague interruptions with WikiAI.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button className="wai-btn wai-btn-blue wai-btn-lg">🚀 Start Free — No Card Needed</button>
                <button className="wai-btn wai-btn-outline wai-btn-lg">📅 Book a Demo</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────── */}
        <footer className="border-t px-[6%] pt-12 pb-8">
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            <div className="flex justify-between flex-wrap gap-9 mb-12">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🧠</div>
                  <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-.02em" }}><span className="wai-g-blue">Wiki</span>AI</span>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: 13, maxWidth: 210, lineHeight: 1.65 }}>Centralised AI knowledge hub for modern companies.</p>
              </div>
              {[
                { title: "Product",   links: ["Features", "Integrations", "Pricing", "Changelog"] },
                { title: "Use Cases", links: ["Onboarding", "Sales", "Call Centers", "E-commerce"] },
                { title: "Company",   links: ["About", "Blog", "Careers", "Contact"] },
              ].map((col, i) => (
                <div key={i}>
                  <div className="wai-mono text-foreground" style={{ fontSize: 11, fontWeight: 700, marginBottom: 14, letterSpacing: ".06em", textTransform: "uppercase" }}>{col.title}</div>
                  <div className="flex flex-col gap-2.5">
                    {col.links.map((l) => (
                      <a key={l} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm" style={{ textDecoration: "none" }}>{l}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="wai-divider mb-6" />
            <div className="flex justify-between items-center flex-wrap gap-3">
              <span className="wai-mono text-muted-foreground" style={{ fontSize: 12 }}>© 2025 WikiAI. All rights reserved.</span>
              <div className="flex gap-5">
                {["Privacy", "Terms", "Security"].map((l) => (
                  <a key={l} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm" style={{ textDecoration: "none" }}>{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}