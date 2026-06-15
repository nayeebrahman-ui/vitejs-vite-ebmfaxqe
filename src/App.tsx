import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction, MouseEvent as ReactMouseEvent } from "react";
import {
  ArrowUpRight, Award, CheckCircle2, ChevronDown,
  Globe, Mail, MapPin, MessageCircle,
  Phone, Sparkles, TrendingUp, ExternalLink,
  Building2, Megaphone,
  SunMedium, MoonStar
} from "lucide-react";

// ─── FONT + GLOBAL STYLES ────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cabinet+Grotesk:wght@300;400;500;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:      #0A0A0F;
      --surface:  #111118;
      --panel:    #16161F;
      --border:   rgba(255,255,255,0.07);
      --volt:     #C8FF00;
      --ember:    #FF4D1C;
      --ice:      #A8D8FF;
      --magenta:  #FF3DAA;
      --text:     #E8E8F0;
      --muted:    rgba(232,232,240,0.45);
      --shadow:   rgba(0,0,0,0.45);
      --soft-title: rgba(232,232,240,0.72);
      --f-display: 'Bebas Neue', sans-serif;
      --f-body:    'Cabinet Grotesk', sans-serif;
      --f-serif:   'Instrument Serif', serif;
    }

    html { scroll-behavior: smooth; }

    html[data-theme="light"] {
      --ink:      #F8F8FA;
      --surface:  #FFFFFF;
      --panel:    #F2F4F8;
      --border:   rgba(10,10,15,0.10);
      --volt:     #7CB800;
      --ember:    #E24A24;
      --ice:      #5B9BD5;
      --magenta:  #D4388B;
      --text:     #111118;
      --muted:    rgba(17,17,24,0.58);
      --shadow:   rgba(0,0,0,0.10);
      --soft-title: rgba(17,17,24,0.64);
    }

    body {
      background: var(--ink);
      color: var(--text);
      font-family: var(--f-body);
      overflow-x: hidden;
      cursor: none;
      transition: background 0.35s ease, color 0.35s ease;
    }

    ::selection { background: var(--volt); color: #000; }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: var(--volt); }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }

    .reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left  { transform: translateX(-40px); }
    .reveal-right { transform: translateX(40px); }
    .reveal-left.visible, .reveal-right.visible { transform: translateX(0); opacity: 1; }

    .stagger-1 { transition-delay: 0.1s; }
    .stagger-2 { transition-delay: 0.2s; }
    .stagger-3 { transition-delay: 0.3s; }
    .stagger-4 { transition-delay: 0.4s; }

    .volt-glow { box-shadow: 0 0 40px rgba(200,255,0,0.15); }

    .noise-bg { position: relative; }
    .noise-bg::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    .avatar-3d {
      transition: transform 0.15s ease-out;
      transform-style: preserve-3d;
    }

    .card-3d {
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.3s ease;
      transform-style: preserve-3d;
      will-change: transform;
    }
    .card-3d:hover {
      transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) translateY(-8px) translateZ(10px);
      box-shadow: 0 24px 60px var(--shadow);
    }

    .hover-volt:hover { color: var(--volt); }

    .tag {
      display: inline-block;
      padding: 4px 12px;
      border: 1px solid var(--border);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-family: var(--f-body);
      font-weight: 700;
      color: var(--muted);
      border-radius: 2px;
      transition: transform 0.25s ease, border-color 0.25s ease, color 0.25s ease;
    }
    .tag:hover { transform: translateY(-1px); }

    .tag-volt { border-color: rgba(200,255,0,0.3); color: var(--volt); }
    .tag-ember { border-color: rgba(255,77,28,0.3); color: var(--ember); }
    .tag-ice { border-color: rgba(168,216,255,0.3); color: var(--ice); }
    .tag-magenta { border-color: rgba(255,61,170,0.3); color: var(--magenta); }

    .section-label {
      font-family: var(--f-body);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--volt);
    }

    .display-xl { font-family: var(--f-display); font-size: clamp(72px, 10vw, 140px); line-height: 0.92; letter-spacing: 0.01em; }
    .display-lg { font-family: var(--f-display); font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: 0.01em; }
    .display-md { font-family: var(--f-display); font-size: clamp(32px, 4vw, 56px); line-height: 1; }

    .serif-italic { font-family: var(--f-serif); font-style: italic; }
    .soft-title { color: var(--soft-title); }

    .body-lg { font-size: 18px; line-height: 1.7; }
    .body-md { font-size: 16px; line-height: 1.65; }
    .body-sm { font-size: 14px; line-height: 1.6; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 28px; background: var(--volt); color: #000;
      font-family: var(--f-body); font-weight: 800; font-size: 13px;
      letter-spacing: 0.06em; text-transform: uppercase;
      border: none; border-radius: 2px; cursor: none;
      text-decoration: none;
      transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
      box-shadow: 0 8px 24px rgba(200,255,0,0.18);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(200,255,0,0.28); }

    .btn-outline {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 28px; background: transparent; color: var(--text);
      font-family: var(--f-body); font-weight: 800; font-size: 13px;
      letter-spacing: 0.06em; text-transform: uppercase;
      border: 1px solid var(--border); border-radius: 2px; cursor: none;
      text-decoration: none;
      transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
    }
    .btn-outline:hover { border-color: var(--volt); color: var(--volt); }

    .divider { width: 100%; height: 1px; background: var(--border); }

    /* Cursor */
    #cursor-dot {
      width: 8px; height: 8px; background: var(--volt); border-radius: 50%;
      position: fixed; pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background 0.2s;
    }
    #cursor-ring {
      width: 36px; height: 36px; border: 1px solid rgba(200,255,0,0.5);
      border-radius: 50%; position: fixed; pointer-events: none; z-index: 9998;
      transform: translate(-50%, -50%);
      transition: transform 0.12s ease-out, width 0.3s, height 0.3s, opacity 0.3s, border-color 0.3s;
    }

    .nav-link {
      font-family: var(--f-body); font-weight: 700; font-size: 11px;
      letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted);
      text-decoration: none; transition: color 0.2s, transform 0.2s; cursor: none;
    }
    .nav-link:hover { color: var(--volt); transform: translateY(-1px); }

    .stat-num { font-family: var(--f-display); font-size: clamp(40px, 5vw, 72px); color: var(--volt); line-height: 1; }

    .experience-item {
      border-left: 1px solid var(--border);
      padding-left: 28px;
      position: relative;
      transition: border-color 0.3s;
    }
    .experience-item::before {
      content: '';
      position: absolute; left: -4px; top: 8px;
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--panel); border: 1px solid var(--muted);
      transition: border-color 0.3s, background 0.3s;
    }
    .experience-item:hover { border-color: var(--volt); }
    .experience-item:hover::before { border-color: var(--volt); background: var(--volt); }

    .skill-bar-track { height: 2px; background: var(--border); border-radius: 1px; overflow: hidden; }
    .skill-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--volt), var(--ice));
      border-radius: 1px;
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 1.2s cubic-bezier(0.22,1,0.36,1);
    }
    .skill-bar-fill.animate { transform: scaleX(1); }

    .floating-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      backdrop-filter: blur(20px);
      padding: 16px 20px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.14);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .floating-card:hover {
      transform: translateY(-3px) translateZ(0);
      border-color: rgba(200,255,0,0.2);
      box-shadow: 0 20px 50px rgba(0,0,0,0.18);
    }

    /* ── GLOW PORTRAIT (hero) ── */
    .hero-image-shell {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      border-radius: inherit;
      background: radial-gradient(120% 100% at 50% 100%, rgba(255,61,170,0.22) 0%, rgba(16,16,28,0.9) 48%, rgba(6,6,12,1) 100%);
      transform-style: preserve-3d;
      isolation: isolate;
    }

    .hero-image-shell::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(255,255,255,0.04), transparent 18%, transparent 68%, rgba(0,0,0,0.26));
      pointer-events: none;
      z-index: 6;
    }

    .hero-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      mix-blend-mode: screen;
      opacity: 0.85;
      pointer-events: none;
      z-index: 0;
      animation: driftOrb 10s ease-in-out infinite;
    }

    .hero-orb-1 {
      width: 240px; height: 240px;
      background: rgba(200,255,0,0.22);
      top: 8%;
      left: -10%;
      animation-duration: 12s;
    }

    .hero-orb-2 {
      width: 220px; height: 220px;
      background: rgba(255,61,170,0.24);
      bottom: 10%;
      right: -8%;
      animation-duration: 14s;
      animation-delay: 1s;
    }

    .hero-orb-3 {
      width: 170px; height: 170px;
      background: rgba(168,216,255,0.22);
      bottom: 24%;
      left: 24%;
      animation-duration: 16s;
      animation-delay: 0.5s;
    }

    @keyframes driftOrb {
      0%,100% { transform: translate3d(0,0,0) scale(1); }
      50% { transform: translate3d(18px,-16px,0) scale(1.05); }
    }

    .glow-portrait {
      width: 100%; height: 100%;
      position: relative;
      background: radial-gradient(120% 100% at 50% 100%, #1a0a2e 0%, #0a0a18 55%, #060608 100%);
      overflow: hidden;
      border-radius: inherit;
    }
    .glow-portrait .ring {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      mix-blend-mode: screen;
      opacity: 0.55;
    }
    .glow-portrait .ring-magenta {
      width: 260px; height: 260px;
      background: var(--magenta);
      top: 8%; right: -15%;
      animation: drift1 9s ease-in-out infinite;
    }
    .glow-portrait .ring-volt {
      width: 220px; height: 220px;
      background: var(--volt);
      bottom: 8%; left: -12%;
      animation: drift2 11s ease-in-out infinite;
    }
    .glow-portrait .ring-ice {
      width: 180px; height: 180px;
      background: var(--ice);
      bottom: 30%; right: 5%;
      animation: drift3 13s ease-in-out infinite;
    }
    @keyframes drift1 { 0%,100%{ transform: translate(0,0) } 50%{ transform: translate(-20px, 24px) } }
    @keyframes drift2 { 0%,100%{ transform: translate(0,0) } 50%{ transform: translate(24px, -18px) } }
    @keyframes drift3 { 0%,100%{ transform: translate(0,0) } 50%{ transform: translate(-16px, -22px) } }

    .glow-portrait .silhouette {
      position: absolute;
      bottom: 0; left: 50%; transform: translateX(-50%);
      width: 78%; height: 88%;
      z-index: 2;
    }
    .glow-portrait .silhouette-head {
      position: absolute; top: 6%; left: 50%; transform: translateX(-50%);
      width: 42%; height: 42%;
      border-radius: 48% 48% 46% 46%;
      background: linear-gradient(150deg, #3a2c52 0%, #241c38 60%, #14101f 100%);
      box-shadow:
        inset -8px -8px 24px rgba(0,0,0,0.5),
        inset 6px 6px 20px rgba(255,61,170,0.12),
        0 0 50px rgba(255,61,170,0.18);
    }
    .glow-portrait .silhouette-body {
      position: absolute; top: 38%; left: 50%; transform: translateX(-50%);
      width: 100%; height: 70%;
      border-radius: 38% 38% 0 0;
      background: linear-gradient(165deg, #2a2240 0%, #1c1830 55%, #0e0c18 100%);
      box-shadow:
        inset 10px 0 30px rgba(200,255,0,0.07),
        inset -10px 0 30px rgba(168,216,255,0.06),
        0 0 60px rgba(200,255,0,0.08);
      animation: breatheBody 7s ease-in-out infinite;
    }
    .glow-portrait .collar {
      position: absolute; top: 36%; left: 50%; transform: translateX(-50%);
      width: 46%; height: 16%;
      z-index: 3;
    }
    .glow-portrait .collar::before, .glow-portrait .collar::after {
      content: '';
      position: absolute; top: 0; width: 50%; height: 100%;
      background: linear-gradient(160deg, #3a3050 0%, #1a1628 100%);
    }
    .glow-portrait .collar::before { left: 0; clip-path: polygon(20% 0, 100% 0, 60% 100%, 0 100%); }
    .glow-portrait .collar::after  { right: 0; clip-path: polygon(80% 0, 0 0, 40% 100%, 100% 100%); left:auto; }
    .glow-portrait .rim-light {
      position: absolute; inset: 0; border-radius: inherit;
      box-shadow: inset 0 -100px 120px rgba(255,61,170,0.06), inset 0 60px 100px rgba(168,216,255,0.05);
      pointer-events: none; z-index: 4;
      animation: rimPulse 6s ease-in-out infinite;
    }
    .glow-portrait .grain { position: absolute; inset: 0; opacity: 0.5; z-index: 1; }
    .glow-portrait .label {
      position: absolute; bottom: 16px; left: 0; right: 0; text-align: center; z-index: 5;
      font-family: var(--f-body); font-weight: 700; font-size: 11px;
      letter-spacing: 0.22em; text-transform: uppercase; color: rgba(200,255,0,0.6);
    }
    .glow-portrait .scan-line {
      position: absolute; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(200,255,0,0.5), transparent);
      animation: scan 5s linear infinite;
      z-index: 5;
    }
    @keyframes scan { 0% { top: -5%; } 100% { top: 105%; } }

    .hero-name-bg {
      position: absolute;
      font-family: var(--f-display);
      font-size: clamp(80px, 15vw, 200px);
      line-height: 1;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,0.04);
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
      letter-spacing: 0.02em;
    }

    .grid-lines {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .role-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px;
      background: rgba(200,255,0,0.08);
      border: 1px solid rgba(200,255,0,0.2);
      border-radius: 2px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--volt);
      box-shadow: 0 10px 22px rgba(0,0,0,0.08);
      backdrop-filter: blur(12px);
    }
    .role-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--volt); animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

    @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
    .float-anim { animation: float 6s ease-in-out infinite; }
    .float-anim-delay { animation: float 6s ease-in-out 2s infinite; }
    .floating-stat { animation: float 5s ease-in-out infinite; }
    .floating-stat:nth-child(2) { animation-delay: .6s; }
    .floating-stat:nth-child(3) { animation-delay: 1.2s; }
    .floating-stat:nth-child(4) { animation-delay: 1.8s; }

    @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: slide-up 0.9s cubic-bezier(0.22,1,0.36,1) both; }
    .animate-in-d1 { animation-delay: 0.15s; }
    .animate-in-d2 { animation-delay: 0.3s; }
    .animate-in-d3 { animation-delay: 0.45s; }
    .animate-in-d4 { animation-delay: 0.6s; }

    .hero-title {
      transform-style: preserve-3d;
      animation: titleFloat 6s ease-in-out infinite;
      text-shadow:
        0 1px 0 rgba(255,255,255,0.04),
        0 8px 22px rgba(0,0,0,0.38),
        0 0 22px rgba(200,255,0,0.12);
      letter-spacing: 0.02em;
    }

    @keyframes titleFloat {
      0%,100% { transform: translateY(0px) rotateX(0deg); }
      50% { transform: translateY(-6px) rotateX(3deg); }
    }

    @keyframes breatheBody {
      0%,100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-3px); }
    }

    @keyframes rimPulse {
      0%,100% { opacity: .9; }
      50% { opacity: 1; }
    }

    .marquee-wrapper { overflow: hidden; }
    .marquee-track { display: flex; gap: 48px; white-space: nowrap; animation: marquee 22s linear infinite; }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    .section-num {
      font-family: var(--f-display); font-size: 96px; color: rgba(255,255,255,0.03);
      line-height: 1; position: absolute; right: 0; top: -16px;
      pointer-events: none; user-select: none;
    }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text);
      border-radius: 2px;
      font-family: var(--f-body);
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: none;
      transition: border-color 0.25s ease, color 0.25s ease, transform 0.25s ease, background 0.25s ease;
    }
    .theme-toggle:hover {
      border-color: var(--volt);
      color: var(--volt);
      transform: translateY(-1px);
    }

    .footer-links a { transition: color 0.2s ease, transform 0.2s ease; }
    .footer-links a:hover { color: var(--volt); transform: translateY(-1px); }

    .contact-focus {
      background: linear-gradient(180deg, rgba(200,255,0,0.05), rgba(255,61,170,0.03));
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
      position: relative;
      overflow: hidden;
    }

    .contact-focus::before {
      content: "";
      position: absolute;
      inset: -20% -20% auto auto;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(200,255,0,0.16) 0%, transparent 68%);
      filter: blur(12px);
      pointer-events: none;
      animation: driftOrb 14s ease-in-out infinite;
    }

    .contact-focus-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 20px;
      box-shadow: 0 14px 34px rgba(0,0,0,0.14);
    }

    .focus-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap: 14px;
    }

    .focus-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(200,255,0,0.22);
      color: var(--volt);
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 800;
      width: fit-content;
    }

    @media (max-width: 1100px) {
      .hide-mobile { display: none !important; }
      .grid-2 { grid-template-columns: 1fr !important; }
      .grid-3 { grid-template-columns: 1fr !important; }
      .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
    }

    @media (max-width: 900px) {
      .hero-title { animation: none; }
      .floating-stat { animation: none; }
      .hero-image-shell { margin-top: 30px; }
    }
  `}</style>
);

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
const Cursor = () => {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
    };
    let raf = 0;
    const lerp = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ring.current) {
        ring.current.style.left = ringPos.current.x + "px";
        ring.current.style.top = ringPos.current.y + "px";
      }
      raf = requestAnimationFrame(lerp);
    };
    window.addEventListener("mousemove", move);
    lerp();
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dot} />
      <div id="cursor-ring" ref={ring} />
    </>
  );
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrollY;
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = ({
  scrollY,
  theme,
  setTheme,
}: {
  scrollY: number;
  theme: "dark" | "light";
  setTheme: Dispatch<SetStateAction<"dark" | "light">>;
}) => {
  const past = scrollY > 80;
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "14px 0",
      background: past ? "rgba(10,10,15,0.70)" : "transparent",
      backdropFilter: past ? "blur(20px)" : "none",
      borderBottom: past ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.4s ease"
    }}>
      <div style={{
        maxWidth: 1800,
        width: "100%",
        margin: "0 auto",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16
      }}>
        <div style={{ fontFamily: "var(--f-display)", fontSize: 28, letterSpacing: "0.05em", color: "var(--volt)" }}>MNR.</div>

        <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[["#about","About"],["#work","Work"],["#expertise","Expertise"],["#projects","Ventures"],["#contact","Contact"]].map(([href, label]) => (
            <a key={href} href={href} className="nav-link">{label}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="theme-toggle"
            aria-label="Toggle dark and light mode"
          >
            {theme === "dark" ? <><SunMedium size={14} /> Light Mode</> : <><MoonStar size={14} /> Dark Mode</>}
          </button>
          <a href="#contact" className="btn-primary" style={{ padding: "10px 22px", fontSize: 11 }}>
            Hire Me <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </nav>
  );
};

// ─── GLOW PORTRAIT (avatar w/ neon backdrop) ─────────────────────────────────
const GlowPortrait = () => (
  <div className="glow-portrait">
    <div className="ring ring-magenta" />
    <div className="ring ring-volt" />
    <div className="ring ring-ice" />
    <div className="grid-lines grain" />
    <div className="silhouette">
      <div className="silhouette-head" />
      <div className="collar" />
      <div className="silhouette-body" />
    </div>
    <div className="scan-line" />
    <div className="rim-light" />
    <div className="label">Nayeeb Rahman — Dhaka, BD</div>
  </div>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ scrollY }: { scrollY: number }) => {
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!avatarRef.current) return;
    const r = avatarRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
    setTilt({ x, y });
  };
  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="hero" className="noise-bg" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      paddingTop: 110, paddingBottom: 60, position: "relative", overflow: "hidden"
    }}>
      <div className="grid-lines" />

      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,61,170,0.06) 0%, transparent 70%)",
        transform: `translateY(${scrollY * 0.08}px)`, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-15%",
        width: "40vw", height: "40vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,216,255,0.05) 0%, transparent 70%)",
        transform: `translateY(${scrollY * -0.06}px)`, pointerEvents: "none"
      }} />

      <div className="parallax-text" style={{
        position: "absolute", bottom: "5%", left: 0, right: 0,
        display: "flex", gap: "5vw", justifyContent: "center",
        transform: `translateY(${scrollY * 0.15}px)`, pointerEvents: "none"
      }}>
        <span className="hero-name-bg">NAYEEB</span>
        <span className="hero-name-bg" style={{ opacity: 0.4 }}>RAHMAN</span>
      </div>

      <div style={{
        maxWidth: 1800,
        margin: "0 auto",
        padding: "0 16px",
        width: "100%",
        position: "relative",
        zIndex: 2
      }}>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.12fr) minmax(520px, 0.88fr)", gap: 48, alignItems: "center" }}>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="animate-in" style={{ marginBottom: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div className="role-badge"><span className="dot" />&nbsp; Open to Lead & Senior Manager Roles</div>
              <div className="role-badge" style={{ background: "rgba(255,61,170,0.08)", borderColor: "rgba(255,61,170,0.2)", color: "var(--magenta)" }}>
                Dhaka & Global Remote
              </div>
            </div>

            <h1 className="animate-in animate-in-d1 hero-title" style={{
              fontFamily: "var(--f-display)", lineHeight: 0.9,
              fontSize: "clamp(64px, 9vw, 124px)", marginBottom: 0,
              color: "var(--text)"
            }}>
              MD<br />
              <span style={{ color: "var(--volt)" }}>NAYEEB</span><br />
              RAHMAN
            </h1>

            <p className="animate-in animate-in-d2 serif-italic soft-title" style={{
              fontSize: "clamp(18px, 2vw, 24px)",
              margin: "24px 0 32px",
              lineHeight: 1.5,
              maxWidth: 560
            }}>
              Senior Product Manager · Strategy & Pre-Sales Lead · OTA Distribution Specialist · AI Platform Builder.
              <br />Seven years turning ambiguous problems into shipped products, scaled teams, and revenue-ready operations.
            </p>

            <div className="animate-in animate-in-d3" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <a href="#contact" className="btn-primary">Let's Work Together <ArrowUpRight size={16} /></a>
              <a href="#work" className="btn-outline">See My Work <ChevronDown size={16} /></a>
            </div>

            <div className="animate-in animate-in-d4" style={{
              display: "flex",
              gap: 24,
              flexWrap: "nowrap",
              justifyContent: "space-between",
              paddingTop: 32,
              borderTop: "1px solid var(--border)",
              width: "100%"
            }}>
              {[["7+", "Years Experience"], ["100K+", "Users Served"], ["73", "Team Members Led"], ["170+", "KPI Dashboards Built"]].map(([num, label]) => (
                <div key={label} className="floating-stat" style={{ flex: "1 1 0", minWidth: 0, textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 32, color: "var(--volt)", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={avatarRef}
            className="animate-in animate-in-d2 hide-mobile"
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ position: "relative", perspective: 1400 }}
          >
            <div
              className="avatar-3d"
              style={{
                transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0px)`,
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 560,
                  borderRadius: "4px 120px 4px 4px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  position: "relative",
                  boxShadow: "0 24px 70px rgba(0,0,0,0.28)"
                }}
                className="volt-glow hero-image-shell"
              >
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
                <div className="hero-orb hero-orb-3" />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.12), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent 20%, transparent 75%, rgba(0,0,0,0.20))",
                  zIndex: 5,
                  pointerEvents: "none"
                }} />
                <img
                  src="https://i.ibb.co.com/pr5Nw6fb/website-pic.png"
                  alt="Website"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    transform: "translateZ(20px) scale(1.02)",
                    filter: "contrast(1.05) saturate(1.05)"
                  }}
                />
              </div>

              <div className="floating-card float-anim" style={{
                position: "absolute", top: 32, left: -92, width: 210, zIndex: 10,
                transform: "perspective(1000px) translateZ(40px)",
                textAlign: "left"
              }}>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Current Role</div>
                <div style={{ fontFamily: "var(--f-body)", fontWeight: 800, fontSize: 13, color: "var(--text)" }}>Sr. Business Analyst</div>
                <div style={{ fontSize: 11, color: "var(--volt)", marginTop: 2 }}>BRAC IT Services</div>
              </div>

              <div className="floating-card float-anim-delay" style={{
                position: "absolute", bottom: 82, right: -82, width: 210, zIndex: 10,
                transform: "perspective(1000px) translateZ(60px)",
                textAlign: "left"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--magenta)" }} />
                  <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Co-Founder</span>
                </div>
                <div style={{ fontFamily: "var(--f-body)", fontWeight: 800, fontSize: 13 }}>NexAI Analytics</div>
                <div style={{ fontSize: 11, color: "var(--ice)", marginTop: 2 }}>GenAI · OTA · Analytics</div>
              </div>

              <div style={{
                position: "absolute", bottom: -20, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent, var(--volt), transparent)"
              }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)"
      }}>
        <span>Scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, var(--muted), transparent)" }} />
      </div>
    </section>
  );
};

// ─── MARQUEE STRIP ────────────────────────────────────────────────────────────
const MarqueeStrip = () => {
  const items = [
    "Product Strategy", "AI Platforms", "OTA Distribution", "Pre-Sales & Demos",
    "Team Leadership", "KPI Systems", "Marketing Strategy", "Stakeholder Management",
    "GenAI · RAG", "Process Excellence", "BRAC IT", "NexAI Analytics", "Triploy.travel"
  ];
  const doubled = [...items, ...items];
  return (
    <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "16px 0", overflow: "hidden", background: "var(--surface)" }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: "var(--f-display)", fontSize: 18, letterSpacing: "0.08em",
            color: i % 4 === 0 ? "var(--volt)" : "var(--muted)", flexShrink: 0
          }}>
            {item} <span style={{ color: "rgba(255,255,255,0.1)", marginRight: 48 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const About = () => (
  <section id="about" style={{ padding: "120px 16px", maxWidth: 1800, margin: "0 auto", position: "relative" }}>
    <div className="section-num">01</div>

    <div className="reveal" style={{ marginBottom: 64 }}>
      <div className="section-label" style={{ marginBottom: 16 }}>// Who I Am</div>
      <h2 className="display-lg" style={{ textAlign: "left" }}>
        The <span className="serif-italic" style={{ color: "var(--volt)" }}>operator</span><br />
        behind the product.
      </h2>
    </div>

    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
      <div>
        <p className="reveal body-lg" style={{ color: "var(--muted)", marginBottom: 28 }}>
          I am a Senior Product Manager and Operations Leader based in Dhaka, Bangladesh, with seven years of experience building enterprise platforms, leading large-scale cross-functional teams, and translating complex business problems into shipped, scalable digital products.
        </p>
        <p className="reveal body-lg stagger-1" style={{ color: "var(--muted)", marginBottom: 28 }}>
          My work spans the full stack of business operations — from owning product vision and roadmap at BRAC IT Services, to managing OTA distribution channels at Triploy.travel, to co-founding NexAI Analytics where I build AI-driven enterprise solutions and an AI-powered OTA platform called NexNomad.
        </p>
        <p className="reveal body-lg stagger-2" style={{ color: "var(--muted)", marginBottom: 28 }}>
          I hold an MBA in Marketing from the Institute of Business Administration (IBA), University of Dhaka — one of the most competitive business schools in South Asia — and a BSc in Electrical and Electronics Engineering. That combination gives me an edge most operators don't have: I think like a marketer, plan like a strategist, and execute like an engineer.
        </p>
        <p className="reveal body-lg stagger-2" style={{ color: "var(--muted)", marginBottom: 40 }}>
          A large part of my work has also been commercial — supporting pre-sales conversations, running solution demos for enterprise clients, and leading cross-functional teams of up to 73 people through daily operations, coaching, and performance accountability. I don't just plan strategy — I've stood in front of stakeholders and sold it.
        </p>

        <div className="reveal stagger-3" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span className="tag tag-volt"><Award size={10} style={{ display: "inline", marginRight: 4 }} />IBA DU — MBA Marketing</span>
          <span className="tag tag-ice">IELTS 7.5</span>
          <span className="tag tag-magenta">Qualtrics Certified</span>
          <span className="tag">EEE — AUST</span>
        </div>
      </div>

      <div className="reveal reveal-right" style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
        {[
          { icon: <MapPin size={18} style={{ color: "var(--volt)" }} />, label: "Location", value: "Dhaka, Bangladesh", sub: "Open to global remote roles" },
          { icon: <Building2 size={18} style={{ color: "var(--ice)" }} />, label: "Current", value: "BRAC IT Services Ltd.", sub: "Senior Business Analyst (Acting Sr. PM)" },
          { icon: <Sparkles size={18} style={{ color: "var(--magenta)" }} />, label: "Venture", value: "NexAI Analytics", sub: "Co-Founder — GenAI & OTA Platform" },
          { icon: <Megaphone size={18} style={{ color: "var(--volt)" }} />, label: "Commercial Edge", value: "Pre-Sales & Marketing Strategy", sub: "MBA Marketing + live client demos" },
        ].map((item, i) => (
          <div key={i} className={`floating-card card-3d stagger-${i+1}`} style={{ display: "flex", gap: 16, alignItems: "flex-start", textAlign: "left" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 4, background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>{item.icon}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{item.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── WORK / EXPERIENCE ────────────────────────────────────────────────────────
const Work = ({ scrollY }: { scrollY: number }) => {
  const jobs = [
    {
      period: "Jan 2025 – Present",
      title: "Senior Business Analyst",
      subtitle: "Acting Senior Product Manager",
      company: "BRAC IT Services Ltd.",
      location: "Dhaka, Bangladesh",
      color: "volt",
      tags: ["Product Ownership", "Agile", "Roadmap", "19-Person Squads", "Pre-Sales Support"],
      highlights: [
        "Product Owner for MF LMS (35,000+ users) and OneLMS — defining roadmaps, epics, and sprint delivery for squads of up to 19.",
        "Built 170+ KPI dashboards giving C-suite real-time visibility of platform health, OKR progress, and operational efficiency.",
        "Line management of 11 direct reports: 6 BAs, 2 Associate BAs, 3 Interns — weekly 1:1s and performance reviews.",
        "Supported pre-sales and solution demos for Agent Banking and Microfinance LMS — translating client needs into proposals.",
        "Eliminated recurring process defects through structured VoC workshops, translating pain points into prioritised user stories.",
      ]
    },
    {
      period: "Mar 2023 – Dec 2024",
      title: "Business Analyst",
      subtitle: "Promoted from BA in 22 months — fastest in team",
      company: "BRAC IT Services Ltd.",
      location: "Dhaka, Bangladesh",
      color: "ice",
      tags: ["Digital Transformation", "Multi-client", "Agile & Waterfall", "SOP Authoring"],
      highlights: [
        "Shipped full product lifecycle for BRAC Bank Agent Banking (1,108 outlets) — 11-person squad, zero escalations.",
        "Delivered BRACU Connect for ~65,000 users — zero client escalation incidents across 22 months of operations.",
        "Authored 100+ user stories, epics, PRDs, and SOPs used across 5 enterprise clients simultaneously.",
        "Managed 8-person delivery team (4 BAs, 4 QA) — new analysts executing independently within first sprint.",
      ]
    },
    {
      period: "Oct 2018 – Feb 2023",
      title: "Data Artist — Executive",
      subtitle: "Market Intelligence & Team Operations",
      company: "Catalyst Solutions (DBA Adiva Graphics)",
      location: "Dhaka & Chittagong",
      color: "ember",
      tags: ["73-Person Team", "Apple · Google · Walmart", "Multi-city Ops", "98% Accuracy"],
      highlights: [
        "Managed 73 people across Dhaka & Chittagong — Pre-Sales, Data Analysts, QA, Social Media CS teams.",
        "3,500+ data analysis and market research projects delivered at 98% accuracy for Apple, Google, and Walmart.",
        "Built team culture of accountability and inclusion sustaining quality delivery for 3.5 years at scale.",
      ]
    },
    {
      period: "Consulting",
      title: "OTA Distribution Consultant",
      subtitle: "Flight & Property Channel Management",
      company: "Triploy.travel",
      location: "Remote",
      color: "magenta",
      tags: ["Airbnb", "Booking.com", "Rentals United", "SiteMinder", "Rate Parity"],
      highlights: [
        "Owned full distribution function for Triploy's in-house flight OTA — rate plans, listings, channel managers.",
        "Configured Rentals United and SiteMinder integrations — parity management, inventory sync, calendar error resolution.",
        "Designed performance dashboards covering channel mix, pickup, listing health, and campaign impact.",
        "Managed operational relationships with OTA account managers across Airbnb and Booking.com extranets.",
      ]
    },
  ];

  const colorMap = { volt: "var(--volt)", ice: "var(--ice)", ember: "var(--ember)", magenta: "var(--magenta)" };

  return (
    <section id="work" style={{ padding: "120px 16px", background: "var(--surface)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "10%", right: "-8%", width: "30vw", height: "30vw", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,61,170,0.05) 0%, transparent 70%)",
        transform: `translateY(${(scrollY - 600) * 0.08}px)`, pointerEvents: "none"
      }} />

      <div style={{ maxWidth: 1800, width: "100%", margin: "0 auto", position: "relative" }}>
        <div className="section-num" style={{ right: 8 }}>02</div>

        <div className="reveal" style={{ marginBottom: 72, textAlign: "left" }}>
          <div className="section-label" style={{ marginBottom: 16 }}>// Experience</div>
          <h2 className="display-lg" style={{ maxWidth: 760, textAlign: "left" }}>
            Seven years of <span className="serif-italic" style={{ color: "var(--volt)" }}>proof.</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 44, textAlign: "left" }}>
          {jobs.map((job, i) => (
            <div key={i} className={`reveal experience-item stagger-${Math.min(i+1,4)}`} style={{ paddingBottom: 36 }}>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 36, alignItems: "start" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "var(--f-body)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{job.period}</div>
                  <div style={{ fontFamily: "var(--f-body)", fontWeight: 700, fontSize: 12, color: colorMap[job.color], letterSpacing: "0.08em" }}>{job.location}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "var(--f-display)", fontSize: 28, color: "var(--text)", display: "inline" }}>{job.title} </h3>
                    <span style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 16, color: "var(--muted)" }}> @ {job.company}</span>
                  </div>
                  <div style={{ fontSize: 12, color: colorMap[job.color], marginBottom: 16, fontWeight: 700, letterSpacing: "0.06em" }}>{job.subtitle}</div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {job.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>

                  <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {job.highlights.map((h, j) => (
                      <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start", textAlign: "left" }}>
                        <span style={{ color: colorMap[job.color], flexShrink: 0, marginTop: 3 }}>→</span>
                        <span className="body-sm" style={{ color: "var(--muted)" }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── EXPERTISE ─────────────────────────────────────────────────────────────────
const Expertise = () => {
  const skillGroups = [
    {
      title: "Product & AI Strategy",
      color: "volt",
      skills: [
        ["Product Vision & Roadmap", 95],
        ["Backlog & Sprint Management", 92],
        ["User Stories & PRD Authoring", 95],
        ["Generative AI & Agentic Workflows", 80],
        ["Data Analytics (Python, SQL, KPI Systems)", 92],
      ]
    },
    {
      title: "OTA & Distribution",
      color: "ice",
      skills: [
        ["Airbnb & Booking.com Extranets", 85],
        ["Rentals United / SiteMinder", 80],
        ["Rate Plan Configuration", 82],
        ["Channel Mix & Parity Management", 78],
        ["Distribution Dashboard Design", 88],
      ]
    },
    {
      title: "Marketing, Pre-Sales & Leadership",
      color: "magenta",
      skills: [
        ["Pre-Sales & Solution Demos", 88],
        ["Market Research & Positioning", 90],
        ["Stakeholder & Client Management", 92],
        ["Team Leadership (up to 73 people)", 94],
        ["Coaching, 1:1s & Performance Reviews", 90],
      ]
    },
  ];

  const colorMap = { volt: "var(--volt)", ice: "var(--ice)", magenta: "var(--magenta)" };

  useEffect(() => {
    const bars = document.querySelectorAll(".skill-bar-fill");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("animate"); });
    }, { threshold: 0.3 });
    bars.forEach(b => obs.observe(b));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="expertise" style={{ padding: "120px 16px", maxWidth: 1800, margin: "0 auto", position: "relative" }}>
      <div className="section-num">03</div>

      <div className="reveal" style={{ marginBottom: 72 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>// Core Expertise</div>
        <h2 className="display-lg">
          Where I <span className="serif-italic" style={{ color: "var(--volt)" }}>excel.</span>
        </h2>
        <p className="body-md reveal stagger-1" style={{ color: "var(--muted)", marginTop: 16, maxWidth: 760 }}>
          Three pillars that work together: building the product, distributing it through the right channels, and selling the story behind it to the people who matter.
        </p>
      </div>

      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
        {skillGroups.map((group, i) => (
          <div key={i} className={`reveal stagger-${i+1}`} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div>
              <span className="tag" style={{ borderColor: `${colorMap[group.color]}40`, color: colorMap[group.color] }}>
                {group.title}
              </span>
            </div>
            {group.skills.map(([name, pct]) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{name}</span>
                  <span style={{ fontSize: 11, color: colorMap[group.color], fontWeight: 700 }}>{pct}%</span>
                </div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="reveal" style={{ marginTop: 80, paddingTop: 60, borderTop: "1px solid var(--border)" }}>
        <div className="section-label" style={{ marginBottom: 24 }}>// Tools & Platforms</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Jira", "ClickUp", "Salesforce", "HubSpot", "Rentals United", "SiteMinder", "Airbnb Extranet", "Booking.com", "PriceLabs", "Python", "SQL", "Claude AI", "Gemini", "NotebookLM", "Excel", "Qualtrics"].map(tool => (
            <span key={tool} className="tag">{tool}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── VENTURES ─────────────────────────────────────────────────────────────────
const Ventures = () => (
  <section id="projects" style={{ padding: "120px 16px", background: "var(--surface)", position: "relative" }}>
    <div style={{ maxWidth: 1800, width: "100%", margin: "0 auto" }}>
      <div className="section-num" style={{ right: 8 }}>04</div>

      <div className="reveal" style={{ marginBottom: 72 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>// Ventures & Projects</div>
        <h2 className="display-lg" style={{ maxWidth: 820, color: "var(--soft-title)" }}>
          Building things that <span className="serif-italic" style={{ color: "var(--volt)" }}>don't exist yet.</span>
        </h2>
      </div>

      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        <div className="reveal card-3d" style={{
          gridRow: "span 2", background: "var(--panel)", border: "1px solid rgba(200,255,0,0.15)",
          borderRadius: 4, padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div>
            <div style={{
              width: 48, height: 48, borderRadius: 4, background: "rgba(200,255,0,0.1)",
              border: "1px solid rgba(200,255,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24
            }}><Sparkles size={22} style={{ color: "var(--volt)" }} /></div>
            <span className="tag tag-volt" style={{ marginBottom: 16, display: "inline-block" }}>Co-Founder & Product Lead</span>
            <h3 className="display-md" style={{ marginBottom: 16 }}>NexAI Analytics</h3>
            <p className="body-md" style={{ color: "var(--muted)", marginBottom: 24 }}>
              An AI-first analytics and product studio building enterprise-grade Generative AI, Agentic AI, and RAG-based solutions. Our flagship product — NexNomad — is an AI-powered OTA platform enabling users to book hotels, flights, and trips with AI-assisted discovery.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Generative AI pipelines for enterprise workflow automation",
                "RAG-based document intelligence and compliance systems",
                "NexNomad: AI-powered hotel, flight & trip OTA (in development)",
                "Tax intelligence platform with agentic compliance review",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--volt)", flexShrink: 0, marginTop: 2 }} />
                  <span className="body-sm" style={{ color: "var(--muted)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 32 }}>
            <span className="tag tag-volt">GenAI</span>
            <span className="tag tag-volt">Agentic AI</span>
            <span className="tag tag-volt">RAG</span>
            <span className="tag tag-volt">OTA Platform</span>
          </div>
        </div>

        <div className="reveal stagger-1 card-3d" style={{ background: "var(--panel)", border: "1px solid rgba(168,216,255,0.12)", borderRadius: 4, padding: 36 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4, background: "rgba(168,216,255,0.08)",
            border: "1px solid rgba(168,216,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
          }}><Globe size={20} style={{ color: "var(--ice)" }} /></div>
          <span className="tag tag-ice" style={{ marginBottom: 12, display: "inline-block" }}>In Development</span>
          <h3 style={{ fontFamily: "var(--f-display)", fontSize: 32, marginBottom: 12, color: "var(--soft-title)" }}>NexNomad</h3>
          <p className="body-sm" style={{ color: "var(--muted)", marginBottom: 20 }}>
            AI-powered OTA platform where users can book hotels, flights, and trips using intelligent AI agents for discovery, comparison, and recommendation — with automated rate monitoring and dynamic pricing logic built in.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="tag tag-ice">OTA Architecture</span>
            <span className="tag tag-ice">Dynamic Pricing</span>
            <span className="tag tag-ice">AI Agents</span>
          </div>
        </div>

        <div className="reveal stagger-2 card-3d" style={{ background: "var(--panel)", border: "1px solid rgba(255,61,170,0.12)", borderRadius: 4, padding: 36 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 4, background: "rgba(255,61,170,0.08)",
            border: "1px solid rgba(255,61,170,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
          }}><TrendingUp size={20} style={{ color: "var(--magenta)" }} /></div>
          <span className="tag tag-magenta" style={{ marginBottom: 12, display: "inline-block" }}>Consulting</span>
          <h3 style={{ fontFamily: "var(--f-display)", fontSize: 32, marginBottom: 12, color: "var(--soft-title)" }}>Triploy.travel</h3>
          <p className="body-sm" style={{ color: "var(--muted)", marginBottom: 20 }}>
            OTA Distribution Consultant — owned the full channel function for Triploy's in-house flight OTA, from Rentals United and SiteMinder integrations to listing health dashboards and OTA account management.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="tag tag-magenta">Rentals United</span>
            <span className="tag tag-magenta">SiteMinder</span>
            <span className="tag tag-magenta">Rate Parity</span>
          </div>
        </div>

      </div>
    </div>
  </section>
);

// ─── SOCIAL PROOF ─────────────────────────────────────────────────────────────
const SocialProof = ({ scrollY }: { scrollY: number }) => (
  <section style={{ padding: "80px 16px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
    <div style={{
      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--f-display)", fontSize: "25vw", color: "rgba(255,255,255,0.015)",
      pointerEvents: "none", userSelect: "none",
      transform: `translateX(${scrollY * 0.05}px)`
    }}>100K+</div>

    <div className="grid-4" style={{ maxWidth: 1800, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, position: "relative", zIndex: 1 }}>
      {[
        { num: "100K+", label: "Platform Users Served", sub: "BRAC ERP, LMS, Agent Banking", color: "volt" },
        { num: "19",    label: "Largest Squad Led",     sub: "OneLMS cross-functional team", color: "ice" },
        { num: "170+",  label: "KPI Dashboards Built",  sub: "Zero manual reporting overhead", color: "magenta" },
        { num: "3",     label: "OTA Platforms",         sub: "Airbnb · Booking.com · Rentals United", color: "volt" },
      ].map((s, i) => (
        <div key={i} className={`reveal stagger-${i+1}`} style={{ textAlign: "left" }}>
          <div className="stat-num" style={{
            color: s.color === "volt" ? "var(--volt)" : s.color === "ice" ? "var(--ice)" : "var(--magenta)"
          }}>{s.num}</div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginTop: 8, marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  </section>
);

// ─── CONTACT ─────────────────────────────────────────────────────────────────
const Contact = () => (
  <section id="contact" style={{ padding: "120px 16px", maxWidth: 1800, margin: "0 auto", position: "relative" }}>
    <div className="section-num">05</div>

    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(520px, 680px)", gap: 72, alignItems: "start" }}>
      <div>
        <div className="reveal" style={{ marginBottom: 32 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>// Let's Talk</div>
          <h2 className="display-lg" style={{ marginBottom: 24, color: "var(--soft-title)" }}>
            Ready to <span className="serif-italic" style={{ color: "var(--volt)" }}>build</span><br />
            something?
          </h2>
          <p className="body-lg reveal stagger-1" style={{ color: "var(--muted)", maxWidth: 440 }}>
            Whether you're hiring for a Lead PM, Senior Manager, AI PM, CS Manager, Market Research Lead, or General Manager role — or you have a venture that needs an experienced operator — I'm ready to talk.
          </p>
        </div>

        <div className="reveal stagger-2" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {[
            { icon: <Mail size={18} style={{ color: "var(--volt)" }} />, label: "Email", value: "nayeebrahman@gmail.com", href: "mailto:nayeebrahman@gmail.com" },
            { icon: <Phone size={18} style={{ color: "var(--ice)" }} />, label: "Phone / WhatsApp", value: "+880 1624 373686", href: "https://wa.me/8801624373686" },
            { icon: <Phone size={18} style={{ color: "var(--magenta)" }} />, label: "Secondary Phone", value: "+880 1787 680648", href: "tel:+8801787680648" },
            { icon: <Globe size={18} style={{ color: "var(--ice)" }} />, label: "LinkedIn", value: "md-nayeeb-rahman-b3a90a136", href: "https://www.linkedin.com/in/md-nayeeb-rahman-b3a90a136/" },
            { icon: <MapPin size={18} style={{ color: "var(--volt)" }} />, label: "Location", value: "Mirpur-2, Dhaka, Bangladesh 1216", href: null },
          ].map((item, i) => (
            <a key={i} href={item.href || undefined} target={item.href && item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
               className={`floating-card stagger-${i+1} card-3d`}
               style={{ display: "flex", gap: 16, alignItems: "center", textDecoration: "none", transition: "border-color 0.25s", cursor: item.href ? "none" : "default" }}
               onMouseEnter={e => { if (item.href) e.currentTarget.style.borderColor = "rgba(200,255,0,0.3)"; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 4, background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>{item.icon}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{item.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="reveal stagger-3">
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Open to roles such as:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Senior Manager", "Lead BA", "Lead PM / AI PM", "CS Manager", "Market Research Lead", "General Manager", "Remote · Hybrid · Dhaka"].map(r => (
              <span key={r} className="tag tag-volt">{r}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="reveal reveal-right" style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: "100%" }}>

        <a href="mailto:nayeebrahman@gmail.com" style={{
          background: "var(--volt)", borderRadius: 4, padding: 40,
          display: "flex", flexDirection: "column", gap: 16, textDecoration: "none", cursor: "none",
          boxShadow: "0 24px 60px rgba(200,255,0,0.16)"
        }} className="card-3d">
          <Mail size={28} style={{ color: "#000" }} />
          <h3 style={{ fontFamily: "var(--f-display)", fontSize: 36, color: "#000", lineHeight: 1 }}>Email Me Direct</h3>
          <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.6 }}>
            For job opportunities, consulting engagements, or project discussions. I respond within 24 hours.
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content",
            padding: "12px 24px", background: "#000", color: "#fff",
            fontFamily: "var(--f-body)", fontWeight: 800, fontSize: 12,
            letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2
          }}>
            nayeebrahman@gmail.com <ArrowUpRight size={14} />
          </span>
        </a>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <a href="https://wa.me/8801624373686" target="_blank" rel="noopener noreferrer" style={{
            background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 4, padding: 24, textDecoration: "none", transition: "border-color 0.25s"
          }} className="card-3d">
            <MessageCircle size={22} style={{ color: "var(--volt)", marginBottom: 12 }} />
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>WhatsApp</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>+880 1624 373686</div>
          </a>

          <a href="https://www.linkedin.com/in/md-nayeeb-rahman-b3a90a136/" target="_blank" rel="noopener noreferrer" style={{
            background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 4, padding: 24, textDecoration: "none", transition: "border-color 0.25s"
          }} className="card-3d">
            <ExternalLink size={22} style={{ color: "var(--ice)", marginBottom: 12 }} />
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>LinkedIn</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>View full profile →</div>
          </a>
        </div>

        <a href="tel:+8801787680648" style={{
          background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 4, padding: 24, textDecoration: "none", transition: "border-color 0.25s",
          display: "flex", alignItems: "center", gap: 16
        }} className="card-3d">
          <Phone size={22} style={{ color: "var(--magenta)" }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Call — Secondary Line</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>+880 1787 680648</div>
          </div>
        </a>

        <div className="contact-focus card-3d" style={{ marginTop: 8 }}>
          <div>
            <div className="focus-pill" style={{ marginBottom: 14 }}>What I am focused on</div>
            <h3 style={{ fontFamily: "var(--f-display)", fontSize: 38, lineHeight: 0.95, color: "var(--soft-title)", marginBottom: 14 }}>
              Product systems that
              <br />ship, scale, and sell.
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.75, maxWidth: 620 }}>
              I build at the intersection of product, operations, analytics, and commercial execution — with enough structure to scale and enough motion to feel alive.
            </p>
          </div>

          <div className="focus-grid">
            <div className="contact-focus-card">
              <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Current Stack</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Jira", "Excel", "SQL", "Python", "Claude AI", "Gemini"].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="contact-focus-card">
              <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Open To</div>
              <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 14, lineHeight: 1.6 }}>
                Senior Manager
                <br />Lead PM / AI PM
                <br />CS Manager
              </div>
            </div>
            <div className="contact-focus-card" style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Ways to work together</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Remote", "Hybrid", "Dhaka", "Consulting", "Full-time"].map(t => <span key={t} className="tag tag-volt">{t}</span>)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ borderTop: "1px solid var(--border)", padding: "36px 16px" }}>
    <div style={{
      maxWidth: 1800,
      width: "100%",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      gap: 24
    }}>
      <div style={{ fontFamily: "var(--f-display)", fontSize: 28, color: "var(--volt)" }}>MNR.</div>

      <div style={{
        fontSize: 11,
        color: "var(--muted)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textAlign: "center",
        whiteSpace: "nowrap"
      }}>
        © 2026 Md Nayeeb Rahman · Dhaka, Bangladesh
      </div>

      <div className="footer-links" style={{ display: "flex", justifyContent: "flex-end", gap: 18, flexWrap: "wrap" }}>
        {[
          ["LinkedIn", "https://www.linkedin.com/in/md-nayeeb-rahman-b3a90a136/"],
          ["Email", "mailto:nayeebrahman@gmail.com"],
          ["WhatsApp", "https://wa.me/8801624373686"],
          ["Call", "tel:+8801787680648"],
        ].map(([label, href]) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
             style={{ fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}
             className="hover-volt">{label}</a>
        ))}
      </div>
    </div>
  </footer>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const scrollY = useScrollY();
  useReveal();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return (
    <>
      <GlobalStyles />
      <Cursor />
      <Nav scrollY={scrollY} theme={theme} setTheme={setTheme} />
      <main>
        <Hero scrollY={scrollY} />
        <MarqueeStrip />
        <About />
        <Work scrollY={scrollY} />
        <SocialProof scrollY={scrollY} />
        <Expertise />
        <Ventures />
        <Contact />
      </main>
      <Footer />
    </>
  );
}