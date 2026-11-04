import React, { useState } from 'react';
import { TYPOGRAPHY_SCALE, MULTILINGUAL_SAMPLES, BRAND_ICONS } from '../../data/brandData';
import { Download, Globe, BookOpen, Sparkles, Check, Copy } from 'lucide-react';

export const TypographyStudio: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [isRtlMode, setIsRtlMode] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('Make AI feel like an open door, not a locked lab.');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const activeLangSample = MULTILINGUAL_SAMPLES.find((s) => s.lang === selectedLang) || MULTILINGUAL_SAMPLES[0];

  const handleCopySvg = (iconId: string, path: string) => {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2A44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
    navigator.clipboard.writeText(svgCode);
    setCopiedIcon(iconId);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: TYPOGRAPHY PHILOSOPHY & PAIRING */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-6 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-semibold">
            Typography System · Humanist & Accessible
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Atkinson Hyperlegible & Plus Jakarta Sans
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-3xl">
            We reject cold, sterile neo-grotesques in favor of fonts engineered for maximum accessibility and human warmth. Atkinson Hyperlegible was developed by the Braille Institute of America specifically for readers with low vision.
          </p>
        </div>

        {/* Font Specimen Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Card 1: Plus Jakarta Sans */}
          <div className="p-5 rounded-xl border border-slate-200 bg-[#FFF6EC]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#FF8A3D]">Brand & Display Face</span>
              <span className="text-xs text-slate-500 font-mono">Google Fonts · OFL</span>
            </div>
            <h4 className="text-2xl font-brand font-bold text-[#1F2A44]">Plus Jakarta Sans</h4>
            <p className="text-xs text-slate-600 font-readable">
              Modern humanist sans-serif with open apertures and clean geometric proportions. Carries warmth and quiet authority without tech aloofness.
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-sm font-brand text-[#1F2A44]">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz 0123456789
            </div>
          </div>

          {/* Card 2: Atkinson Hyperlegible */}
          <div className="p-5 rounded-xl border border-slate-200 bg-[#FFF6EC]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#187F72]">Accessible Body Face</span>
              <span className="text-xs text-slate-500 font-mono">Braille Institute · Free</span>
            </div>
            <h4 className="text-2xl font-hyperlegible font-bold text-[#1F2A44]">Atkinson Hyperlegible</h4>
            <p className="text-xs text-slate-600 font-readable">
              Sculpted letterforms designed to eliminate character ambiguity (distinguishing I, l, 1 and O, 0). Recommended for curriculum and community handouts.
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-sm font-hyperlegible text-[#1F2A44]">
              Il1 O0 8B 5S &middot; Unambiguous low-vision legibility<br />
              abcdefghijklmnopqrstuvwxyz 0123456789
            </div>
          </div>
        </div>

        {/* Interactive Type Tester */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Live Type Specimen Tester
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-[#1F2A44] focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
            placeholder="Type custom specimen..."
          />
          <div className="mt-4 space-y-3">
            <div>
              <span className="text-[11px] font-mono text-slate-400">Plus Jakarta Sans (Display):</span>
              <p className="text-2xl font-brand font-bold text-[#1F2A44] leading-tight mt-0.5">
                {customText}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400">Atkinson Hyperlegible (Reading Body):</span>
              <p className="text-base font-hyperlegible text-[#1F2A44] leading-relaxed mt-0.5">
                {customText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TYPE HIERARCHY SCALE TABLE */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
            Typographic Scale & Specifications
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Harmonic Type Scale
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1">
            Rigorous scale defining rem, px, leading, tracking, weight, and editorial usage notes.
          </p>
        </div>

        <div className="divide-y divide-slate-100 mt-6">
          {TYPOGRAPHY_SCALE.map((level) => (
            <div key={level.name} className="py-5 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="lg:w-1/4">
                <span className="font-brand font-bold text-base text-[#1F2A44]">{level.name}</span>
                <p className="text-xs text-slate-500 mt-0.5">{level.role}</p>
                <div className="font-mono text-[11px] text-[#187F72] mt-2 space-y-0.5">
                  <div>Size: {level.size}</div>
                  <div>Leading: {level.lineHeight}</div>
                  <div>Tracking: {level.tracking}</div>
                  <div>Weight: {level.weight}</div>
                </div>
              </div>

              <div className="lg:w-3/4 space-y-2">
                <p
                  style={{
                    fontSize: `${Math.min(36, level.fontSizePx)}px`,
                    lineHeight: level.lineHeight,
                    letterSpacing: level.tracking,
                  }}
                  className={`text-[#1F2A44] ${level.name === 'Body' ? 'font-hyperlegible' : 'font-brand'} font-medium`}
                >
                  {level.sampleText}
                </p>
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                  <strong className="text-slate-700">Usage Rule:</strong> {level.usageRules}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: MULTILINGUAL & RIGHT-TO-LEFT (RTL) STUDIO */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F2A44]/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Multilingual Global Script Support
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              Global Language & Script Adapters
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1">
              The brand translates seamlessly across Latin, Arabic (RTL), Devanagari, Greek, Swahili, and CJK.
            </p>
          </div>

          {/* Language Switcher Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {MULTILINGUAL_SAMPLES.map((s) => (
              <button
                key={s.lang}
                onClick={() => {
                  setSelectedLang(s.lang);
                  setIsRtlMode(s.isRtl);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedLang === s.lang
                    ? 'bg-[#1F2A44] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Live Multilingual Specimen Container */}
        <div
          dir={isRtlMode ? 'rtl' : 'ltr'}
          className={`mt-6 p-8 rounded-xl border border-slate-200 bg-[#FFF6EC]/50 transition-all ${
            isRtlMode ? 'text-right' : 'text-left'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-slate-500">
            <span>Script: <strong>{activeLangSample.script}</strong></span>
            <span>·</span>
            <span>Font: <strong>{activeLangSample.fontFamily}</strong></span>
            {isRtlMode && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                Active RTL Layout
              </span>
            )}
          </div>

          <h4
            className={`text-2xl sm:text-3xl font-bold text-[#1F2A44] leading-tight mb-3 ${
              activeLangSample.isRtl ? 'font-arabic' : 'font-brand'
            }`}
          >
            {activeLangSample.headline}
          </h4>

          <p
            className={`text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl ${
              activeLangSample.isRtl ? 'font-arabic' : 'font-readable'
            }`}
          >
            {activeLangSample.body}
          </p>

          <div className="mt-6 pt-4 border-t border-[#1F2A44]/10 text-xs text-slate-500">
            {isRtlMode ? (
              <p>
                <strong>قواعد التنسيق العربي:</strong> في التخطيط من اليمين إلى اليسار، يوضع الشعار في اليمين وأزرار العمل في اليسار. يظل رمز &quot;الباب المفتوح&quot; كما هو بدون عكس ليحافظ على هويته العالمية.
              </p>
            ) : (
              <p>
                <strong>Typographic Note:</strong> In non-Latin scripts, use Google Noto Sans family at 1.05x Latin size with 1.6x leading to prevent diacritical collision.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: ICONOGRAPHY SUITE */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
            Visual Language · Friendly Line Iconography
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Icon Suite for Plain-English Tech Concepts
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1">
            Simple 2px rounded line icons that replace confusing sci-fi symbols with relatable everyday concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {BRAND_ICONS.map((icon) => (
            <div
              key={icon.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#FF8A3D]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#FFF6EC] flex items-center justify-center text-[#1F2A44] mb-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1F2A44"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={icon.svgPath} />
                  </svg>
                </div>
                <h5 className="font-brand font-bold text-sm text-[#1F2A44]">{icon.name}</h5>
                <p className="text-xs text-[#FF8A3D] font-medium mt-0.5">{icon.concept}</p>
                <p className="text-[11px] text-slate-500 mt-2 font-readable leading-relaxed">
                  {icon.explanation}
                </p>
              </div>

              <button
                onClick={() => handleCopySvg(icon.id, icon.svgPath)}
                className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 hover:text-[#1F2A44] cursor-pointer"
              >
                <span>{copiedIcon === icon.id ? 'Copied SVG!' : 'Copy SVG'}</span>
                {copiedIcon === icon.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
