import React, { useState, useRef } from 'react';
import { LogoMark } from './LogoMark';
import { CONCEPT_ROUTES, LOGO_MISUSE_RULES, NAMING_DECISION } from '../../data/brandData';
import { LogoRoute } from '../../types/brand';
import { Download, Copy, Check, Eye, AlertTriangle, ShieldCheck, Printer } from 'lucide-react';

export const LogoStudio: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<LogoRoute>('open-door');
  const [colorScheme, setColorScheme] = useState<'full' | 'ink' | 'teal' | 'sunrise' | 'white' | 'black' | 'photocopy'>('full');
  const [lockup, setLockup] = useState<'horizontal' | 'stacked' | 'symbol' | 'descriptor' | 'chapter'>('horizontal');
  const [chapterCity, setChapterCity] = useState<string>('Nairobi');
  const [showClearSpace, setShowClearSpace] = useState<boolean>(false);
  const [copiedEps, setCopiedEps] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const activeRouteData = CONCEPT_ROUTES.find((r) => r.id === selectedRoute) || CONCEPT_ROUTES[0];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate SVG string for download
  const handleDownloadSvg = () => {
    const isWhite = colorScheme === 'white';
    const bgAttr = isWhite ? ' style="background-color: #1F2A44; padding: 20px;"' : '';
    const svgCode = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Human First AI - ${activeRouteData.name} (${lockup}) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120"${bgAttr}>
  <g id="symbol">
    <polygon points="38,36 78,82 28,82 38,76" fill="${colorScheme === 'full' ? 'rgba(255,138,61,0.28)' : 'rgba(31,42,68,0.1)'}" />
    <line x1="14" y1="82" x2="86" y2="82" stroke="${isWhite ? '#FFFFFF' : '#1F2A44'}" stroke-width="5" stroke-linecap="round" />
    <path d="M 30 82 V 38 C 30 20, 70 20, 70 38 V 82" stroke="${isWhite ? '#FFFFFF' : '#1F2A44'}" stroke-width="6" stroke-linecap="round" fill="none" />
    <path d="M 50 24 L 38 32 V 78 L 50 82 Z" fill="${colorScheme === 'full' ? '#FF8A3D' : (isWhite ? '#FFFFFF' : '#1F2A44')}" />
    <circle cx="50" cy="46" r="4.5" fill="${colorScheme === 'full' ? '#187F72' : (isWhite ? '#7CC4F2' : '#1F2A44')}" />
  </g>
  <text x="110" y="74" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="34" fill="${isWhite ? '#FFFFFF' : '#1F2A44'}">Human</text>
  <text x="216" y="74" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" font-size="34" fill="${isWhite ? '#FFFFFF' : '#1F2A44'}">First</text>
  <text x="290" y="74" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="30" fill="${colorScheme === 'full' ? '#FF8A3D' : (isWhite ? '#FFFFFF' : '#1F2A44')}">AI</text>
</svg>`;

    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `human-first-ai-${selectedRoute}-${colorScheme}-${lockup}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('SVG vector downloaded');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // High-Resolution 2000px PNG export using HTML5 Canvas
  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = colorScheme === 'white';
    ctx.fillStyle = isDark ? '#1F2A44' : (colorScheme === 'photocopy' ? '#F4F2EC' : '#FFFFFF');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw symbol and text onto canvas
    const pColor = isDark ? '#FFFFFF' : (colorScheme === 'photocopy' || colorScheme === 'black' ? '#000000' : '#1F2A44');
    const aColor = colorScheme === 'full' ? '#FF8A3D' : pColor;
    const tColor = colorScheme === 'full' ? '#187F72' : pColor;

    ctx.save();
    ctx.translate(250, 400);

    // Baseline
    ctx.strokeStyle = pColor;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-100, 100);
    ctx.lineTo(100, 100);
    ctx.stroke();

    // Archway
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(-60, 100);
    ctx.lineTo(-60, -20);
    ctx.bezierCurveTo(-60, -80, 60, -80, 60, -20);
    ctx.lineTo(60, 100);
    ctx.stroke();

    // Open Door Leaf
    ctx.fillStyle = aColor;
    ctx.beginPath();
    ctx.moveTo(0, -65);
    ctx.lineTo(-40, -40);
    ctx.lineTo(-40, 90);
    ctx.lineTo(0, 100);
    ctx.closePath();
    ctx.fill();

    // Circular Keystone
    ctx.fillStyle = tColor;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Wordmark
    ctx.font = 'bold 96px sans-serif';
    ctx.fillStyle = pColor;
    ctx.fillText('Human', 450, 420);

    ctx.font = '500 96px sans-serif';
    ctx.fillText('First', 790, 420);

    ctx.font = 'bold 88px sans-serif';
    ctx.fillStyle = aColor;
    ctx.fillText('AI', 1000, 420);

    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUri;
    link.download = `human-first-ai-hi-res-${selectedRoute}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('High-Res 300 DPI PNG downloaded');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Copy EPS Vector Header Code
  const handleCopyEps = () => {
    const epsText = `%!PS-Adobe-3.0 EPSF-3.0
%%Creator: Human First AI Brand Identity System
%%Title: Human First AI - ${activeRouteData.name}
%%BoundingBox: 0 0 400 120
%%LanguageLevel: 2
%%EndComments
/HumanFirstAI {
  % Primary Vector Path Definitions
  gsave
  0.121 0.164 0.266 setrgbcolor % Deep Ink #1F2A44
  14 setlinewidth 1 setlinecap
  newpath 14 82 moveto 86 82 lineto stroke
  % Archway
  newpath 30 82 moveto 30 38 lineto
  30 20 70 20 70 38 curveto
  70 82 lineto stroke
  % Open Door Portal
  1.000 0.541 0.239 setrgbcolor % Sunrise #FF8A3D
  newpath 50 24 moveto 38 32 lineto 38 78 lineto 50 82 lineto closepath fill
  grestore
} def
HumanFirstAI
showpage
%%EOF`;

    navigator.clipboard.writeText(epsText);
    setCopiedEps(true);
    setTimeout(() => setCopiedEps(false), 2500);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: CONCEPT ROUTES EXPLORATION */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1F2A44]/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-semibold">
              Design Exploration · 4 Concept Routes
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              Logo Architecture & Concept Routes
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-2xl">
              We explored four distinct conceptual directions against the core brief: to make AI feel like an open door, not a locked lab.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <span className="text-xs text-[#1F2A44]/60">Recommended Direction:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#187F72]/10 text-[#187F72] text-xs font-semibold rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Route 1: The Open Door
            </span>
          </div>
        </div>

        {/* Route Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {CONCEPT_ROUTES.map((route) => {
            const isSelected = selectedRoute === route.id;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`p-5 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'border-[#FF8A3D] bg-[#FFF6EC]/50 shadow-sm ring-1 ring-[#FF8A3D]/40'
                    : 'border-[#1F2A44]/10 bg-white hover:border-[#1F2A44]/30'
                }`}
              >
                {route.isRecommended && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FF8A3D] text-white rounded-full">
                    Recommended
                  </span>
                )}
                <div className="h-16 flex items-center justify-start mb-3">
                  <LogoMark route={route.id} lockup="symbol" size={44} colorScheme={isSelected ? 'full' : 'ink'} />
                </div>
                <h4 className="font-brand font-bold text-sm text-[#1F2A44]">{route.name}</h4>
                <p className="text-xs text-[#1F2A44]/60 mt-1 line-clamp-2">{route.tagline}</p>
              </button>
            );
          })}
        </div>

        {/* Detailed Concept Rationale Breakdown */}
        <div className="mt-8 p-6 bg-[#FFF6EC]/60 border border-[#1F2A44]/8 rounded-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#FF8A3D]">Design Rationale</span>
                <span className="text-xs text-[#1F2A44]/40">·</span>
                <span className="text-xs text-[#1F2A44]/70 font-medium">{activeRouteData.name}</span>
              </div>
              <p className="text-sm text-[#1F2A44]/90 leading-relaxed font-readable">
                {activeRouteData.rationale}
              </p>
              <div className="pt-2 text-xs text-[#1F2A44]/70">
                <strong className="text-[#1F2A44]">Geometry:</strong> {activeRouteData.symbolsDescription}
              </div>
            </div>

            <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-[#1F2A44]/10 pt-4 lg:pt-0 lg:pl-6 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1F2A44]">How It Conveys Values:</div>
              <div className="text-xs">
                <span className="font-semibold text-[#187F72]">Inclusion:</span>{' '}
                <span className="text-[#1F2A44]/80">{activeRouteData.howItConveysValues.inclusion}</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#FF8A3D]">Hope:</span>{' '}
                <span className="text-[#1F2A44]/80">{activeRouteData.howItConveysValues.hope}</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#1F2A44]">Human Agency:</span>{' '}
                <span className="text-[#1F2A44]/80">{activeRouteData.howItConveysValues.humanAgency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE LOGO STAGE & CONTROLS */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2A44]/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-semibold">
              Live Testing Canvas
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              Interactive Identity Studio
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1">
              Test lockups, colorways, clear-space boundaries, and simulate low-cost community photocopy printouts.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadSvg}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              SVG Vector
            </button>
            <button
              onClick={handleDownloadPng}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#187F72] text-white hover:bg-[#187F72]/90 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              PNG (300 DPI)
            </button>
            <button
              onClick={handleCopyEps}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#1F2A44]/20 text-[#1F2A44] hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              title="Copy EPS Vector header definition"
            >
              {copiedEps ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedEps ? 'Copied EPS' : 'Copy EPS'}
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
            <span>✓ {downloadSuccess}</span>
            <button onClick={() => setDownloadSuccess(null)} className="text-emerald-600 font-bold">✕</button>
          </div>
        )}

        {/* Controls Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
          {/* Lockup Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A44] mb-2">
              Lockup Format
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['horizontal', 'stacked', 'symbol', 'descriptor', 'chapter'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLockup(l)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-colors cursor-pointer ${
                    lockup === l ? 'bg-[#1F2A44] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {lockup === 'chapter' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={chapterCity}
                  onChange={(e) => setChapterCity(e.target.value)}
                  placeholder="Chapter City (e.g. Lima, Lagos)"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-[#1F2A44] focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
                />
              </div>
            )}
          </div>

          {/* Colorway Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A44] mb-2">
              Color Variation
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'full', label: 'Full Brand' },
                { id: 'ink', label: 'Deep Ink' },
                { id: 'teal', label: 'Teal' },
                { id: 'sunrise', label: 'Sunrise' },
                { id: 'white', label: 'Reversed White' },
                { id: 'black', label: 'Black' },
                { id: 'photocopy', label: 'Photocopy Test' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorScheme(c.id as any)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    colorScheme === c.id
                      ? 'bg-[#FF8A3D] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modifiers (Clear space, etc.) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A44] mb-2">
              Inspection Tools
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showClearSpace}
                  onChange={(e) => setShowClearSpace(e.target.checked)}
                  className="rounded text-[#FF8A3D] focus:ring-[#FF8A3D]"
                />
                Show X-Height Clear Space Zone
              </label>
              <div className="text-[11px] text-slate-500">
                Clear space = height of capital &apos;H&apos; in &quot;Human&quot;
              </div>
            </div>
          </div>
        </div>

        {/* Live Presentation Stage */}
        <div
          className={`relative rounded-xl min-h-[300px] flex items-center justify-center p-8 transition-all overflow-hidden ${
            colorScheme === 'white'
              ? 'bg-[#1F2A44]'
              : colorScheme === 'photocopy'
              ? 'bg-[#F2EFE9] border-2 border-dashed border-neutral-400'
              : 'bg-[#FFF6EC]/50 border border-slate-200'
          }`}
        >
          {colorScheme === 'photocopy' && (
            <div className="absolute top-3 left-3 text-[11px] font-mono text-neutral-600 bg-white/90 px-2 py-0.5 rounded border border-neutral-300">
              Low-Cost Toner Photocopy Simulation (50% Contrast Gritty Grain)
            </div>
          )}

          <LogoMark
            route={selectedRoute}
            colorScheme={colorScheme}
            lockup={lockup}
            chapterName={chapterCity}
            size={72}
            showClearSpace={showClearSpace}
          />
        </div>

        {/* SECTION 3: SCALE & RECOGNITION TEST MATRIX */}
        <div className="mt-8 pt-8 border-t border-[#1F2A44]/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-brand font-bold text-base text-[#1F2A44]">
                Scale & Recognition Stress-Test
              </h4>
              <p className="text-xs text-slate-500">
                Verifying optical legibility from 16px favicon up to 128px lockup.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              ✓ Favicon Verified at 16×16px
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 items-end bg-slate-50 p-6 rounded-xl border border-slate-200/60">
            {/* 16px Favicon */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center shadow-2xs">
                <LogoMark route={selectedRoute} lockup="symbol" size={16} colorScheme="full" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">16px Favicon</span>
            </div>

            {/* 24px App toolbar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded border border-slate-200 flex items-center justify-center shadow-2xs">
                <LogoMark route={selectedRoute} lockup="symbol" size={24} colorScheme="full" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">24px Nav Icon</span>
            </div>

            {/* 32px Touch button */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white rounded border border-slate-200 flex items-center justify-center shadow-2xs">
                <LogoMark route={selectedRoute} lockup="symbol" size={32} colorScheme="full" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">32px Badge</span>
            </div>

            {/* 48px Header lockup */}
            <div className="flex flex-col items-center gap-2 col-span-2 sm:col-span-1">
              <div className="h-14 px-3 bg-white rounded border border-slate-200 flex items-center justify-center shadow-2xs">
                <LogoMark route={selectedRoute} lockup="horizontal" size={30} colorScheme="full" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">Header Lockup</span>
            </div>

            {/* 64px Mobile Avatar */}
            <div className="flex flex-col items-center gap-2 col-span-2 sm:col-span-2">
              <div className="h-14 px-4 bg-white rounded border border-slate-200 flex items-center justify-center shadow-2xs">
                <LogoMark route={selectedRoute} lockup="horizontal" size={42} colorScheme="full" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">Medium Display</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: NAMING & VISUAL HIERARCHY DECISION */}
      <div className="bg-[#FFF6EC]/70 border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
          <AlertTriangle className="w-4 h-4" />
          Naming & Visual Hierarchy Decision
        </div>
        <h3 className="text-xl font-brand font-bold text-[#1F2A44] mt-2">
          Why &quot;Human First AI&quot; is Unhyphenated and Human Leads
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="p-4 bg-white rounded-xl border border-[#1F2A44]/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ✓ Approved: {NAMING_DECISION.chosen}
              </span>
            </div>
            <p className="text-xs text-[#1F2A44]/80 leading-relaxed font-readable">
              {NAMING_DECISION.rationale}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#1F2A44]/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                ✕ Rejected: {NAMING_DECISION.rejected}
              </span>
            </div>
            <p className="text-xs text-[#1F2A44]/80 leading-relaxed font-readable">
              Hyphenation reduces &quot;Human-First&quot; into a mechanical modifier like &quot;Mobile-First&quot; or &quot;Cloud-First&quot;. It subordinates humanity to the machine and fails to translate smoothly into multilingual community dialects where natural sentence structure leads with the human subject.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: LOGO MISUSE GUARDRAILS (9 Strict Anti-patterns) */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-rose-600 font-bold">
            Integrity Guardrails · Strictly Forbidden
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Nine Logo Misuse Anti-Patterns
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1">
            Our mark must remain dignified and consistent across all 38 global chapters. The following variations violate brand guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {LOGO_MISUSE_RULES.map((rule) => (
            <div
              key={rule.id}
              className="border border-rose-200/80 bg-rose-50/20 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="h-28 bg-white border border-rose-100 rounded-lg flex items-center justify-center relative overflow-hidden mb-3">
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded">
                    DO NOT
                  </span>

                  {/* Anti-pattern renderers */}
                  {rule.badVisual === 'rotate-45' && (
                    <div className="transform rotate-45 opacity-60">
                      <LogoMark route="open-door" lockup="symbol" size={44} colorScheme="ink" />
                    </div>
                  )}

                  {rule.badVisual === 'tech-gradient' && (
                    <div className="p-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-lg shadow-lg">
                      <LogoMark route="open-door" lockup="symbol" size={40} colorScheme="white" />
                    </div>
                  )}

                  {rule.badVisual === 'text-inside' && (
                    <div className="relative">
                      <LogoMark route="open-door" lockup="symbol" size={54} colorScheme="ink" />
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-rose-600">
                        HFAI
                      </span>
                    </div>
                  )}

                  {rule.badVisual === 'squash-skew' && (
                    <div className="transform scale-x-150 scale-y-60 opacity-60">
                      <LogoMark route="open-door" lockup="symbol" size={44} colorScheme="ink" />
                    </div>
                  )}

                  {rule.badVisual === 'pill-shadow' && (
                    <div className="p-3 bg-slate-100 rounded-full border-2 border-slate-300 shadow-2xl">
                      <LogoMark route="open-door" lockup="symbol" size={36} colorScheme="ink" />
                    </div>
                  )}

                  {rule.badVisual === 'busy-photo' && (
                    <div className="w-full h-full bg-cover bg-center flex items-center justify-center p-2" style={{ backgroundImage: `url('/src/assets/images/community_workshop_learning_1793268558159.jpg')` }}>
                      <LogoMark route="open-door" lockup="symbol" size={40} colorScheme="full" />
                    </div>
                  )}

                  {rule.badVisual === 'inverted-hierarchy' && (
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-xs font-bold text-[#FF8A3D]">AI</span>
                      <span className="text-[10px] text-slate-500">Human First</span>
                    </div>
                  )}

                  {rule.badVisual === 'robot-circuit' && (
                    <div className="relative p-2 border border-cyan-400 bg-slate-900 rounded">
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:6px_6px]" />
                      <LogoMark route="open-door" lockup="symbol" size={36} colorScheme="white" />
                    </div>
                  )}

                  {rule.badVisual === 'neon-color' && (
                    <div className="p-2 bg-black rounded">
                      <div style={{ filter: 'hue-rotate(290deg) saturate(300%)' }}>
                        <LogoMark route="open-door" lockup="symbol" size={36} colorScheme="sunrise" />
                      </div>
                    </div>
                  )}
                </div>

                <h5 className="text-xs font-bold text-[#1F2A44] mb-1">{rule.title}</h5>
                <p className="text-[11px] text-[#1F2A44]/70 leading-relaxed font-readable">{rule.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
