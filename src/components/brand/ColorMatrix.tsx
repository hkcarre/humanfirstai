import React, { useState } from 'react';
import { BRAND_COLORS, WCAG_CONTRAST_MATRIX } from '../../data/brandData';
import { Copy, Check, Eye, AlertOctagon, Sparkles } from 'lucide-react';

export const ColorMatrix: React.FC = () => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [colorBlindMode, setColorBlindMode] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'>('normal');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(`${label}: ${text}`);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const getFilterClass = () => {
    switch (colorBlindMode) {
      case 'protanopia':
        return 'filter-protanopia';
      case 'deuteranopia':
        return 'filter-deuteranopia';
      case 'tritanopia':
        return 'filter-tritanopia';
      case 'achromatopsia':
        return 'filter-achromatopsia';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-12">
      {/* SVG Filters for Accurate Color Blindness Simulation */}
      <svg className="hidden" aria-hidden="true">
        <filter id="protanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0, 0, 0
                    0.558, 0.442, 0, 0, 0
                    0, 0.242, 0.758, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        <filter id="deuteranopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0, 0, 0
                    0.7, 0.3, 0, 0, 0
                    0, 0.3, 0.7, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        <filter id="tritanopia-filter">
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05, 0, 0, 0
                    0, 0.433, 0.567, 0, 0
                    0, 0.475, 0.525, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
      </svg>

      {/* SECTION 1: PALETTE SWATCH CARDS */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F2A44]/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-semibold">
              Color Architecture & Production Tokens
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              The Human Palette
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-2xl">
              Deliberately departing from cold technocratic blues and neon gradients. Built from paper warmth, deep ink, and solar optimism.
            </p>
          </div>

          {/* Colorblindness Simulator Toggle */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <span className="text-xs font-semibold px-2 text-slate-500 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Vision:
            </span>
            {(['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setColorBlindMode(mode)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-colors cursor-pointer ${
                  colorBlindMode === mode
                    ? 'bg-white text-[#1F2A44] shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'achromatopsia' ? 'Mono' : mode}
              </button>
            ))}
          </div>
        </div>

        {copiedValue && (
          <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Copied to clipboard: <strong>{copiedValue}</strong></span>
          </div>
        )}

        {/* 60 / 30 / 10 Allocation Bar */}
        <div className="my-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-[#1F2A44]">60-30-10 Proportional Distribution System</span>
            <span>Balanced Visual Hierarchy</span>
          </div>
          <div className="h-5 rounded-lg overflow-hidden flex border border-slate-200 shadow-2xs">
            <div style={{ width: '60%', backgroundColor: '#FFF6EC' }} title="60% Neutral Canvas (Warm Cream)" className="border-r border-slate-300" />
            <div style={{ width: '25%', backgroundColor: '#1F2A44' }} title="25% Structure & Typography (Deep Ink)" />
            <div style={{ width: '8%', backgroundColor: '#FF8A3D' }} title="8% Hope & Invitation (Sunrise)" />
            <div style={{ width: '5%', backgroundColor: '#187F72' }} title="5% Growth & Calm (Teal)" />
            <div style={{ width: '2%', backgroundColor: '#7CC4F2' }} title="2% Openness (Sky)" />
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFF6EC] border border-slate-300" /> 60% Canvas</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1F2A44]" /> 25% Text & Structure</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF8A3D]" /> 8% Sunrise Accent</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#187F72]" /> 5% Community Teal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7CC4F2]" /> 2% Sky</span>
          </div>
        </div>

        {/* The Color Swatch Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 transition-all ${getFilterClass()}`}>
          {BRAND_COLORS.map((color) => (
            <div
              key={color.name}
              className="border border-[#1F2A44]/10 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Color Block */}
              <div
                style={{ backgroundColor: color.hex }}
                className="h-28 p-3 flex flex-col justify-between border-b border-[#1F2A44]/10 relative group"
              >
                <span
                  style={{ color: color.textColor }}
                  className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 backdrop-blur-xs self-start"
                >
                  {color.hex}
                </span>
                <span
                  style={{ color: color.textColor }}
                  className="text-[10px] uppercase font-bold tracking-wider self-end"
                >
                  {color.role}
                </span>
              </div>

              {/* Data Specifications */}
              <div className="p-3.5 space-y-2.5 text-xs">
                <div>
                  <h4 className="font-bold text-[#1F2A44] font-brand text-sm">{color.name}</h4>
                  <p className="text-[11px] text-[#1F2A44]/70 mt-0.5 line-clamp-2">{color.description}</p>
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-600 bg-slate-50 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span>RGB:</span>
                    <button
                      onClick={() => handleCopy(color.rgb, `${color.name} RGB`)}
                      className="hover:text-[#FF8A3D] flex items-center gap-1 cursor-pointer"
                    >
                      {color.rgb} <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CMYK:</span>
                    <button
                      onClick={() => handleCopy(color.cmyk, `${color.name} CMYK`)}
                      className="hover:text-[#FF8A3D] flex items-center gap-1 cursor-pointer"
                    >
                      {color.cmyk} <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>PMS:</span>
                    <button
                      onClick={() => handleCopy(color.pantone, `${color.name} Pantone`)}
                      className="hover:text-[#FF8A3D] flex items-center gap-1 cursor-pointer"
                    >
                      {color.pantone} <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-100">
                  {color.culturalNote}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: WCAG 2.2 CONTRAST AUDIT MATRIX */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
              WCAG 2.2 AA / AAA Accessibility Matrix
            </span>
          </div>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Approved & Forbidden Pairings
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-2xl">
            Accessibility is a strict design law. We test every text and background pairing for legibility and enforce zero ambiguity for volunteer educators and designers.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                <th className="py-3 px-4">Live Preview</th>
                <th className="py-3 px-4">Foreground / Text</th>
                <th className="py-3 px-4">Background</th>
                <th className="py-3 px-4">Contrast Ratio</th>
                <th className="py-3 px-4">WCAG Standard</th>
                <th className="py-3 px-4">Status & Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-readable">
              {WCAG_CONTRAST_MATRIX.map((pair, idx) => (
                <tr key={idx} className={pair.isApproved ? 'hover:bg-slate-50/60' : 'bg-rose-50/30'}>
                  {/* Live Render Cell */}
                  <td className="py-3 px-4">
                    <div
                      style={{ backgroundColor: pair.bgHex, color: pair.fgHex }}
                      className="px-3 py-1.5 rounded text-xs font-bold font-brand inline-block shadow-2xs border border-black/10"
                    >
                      Aa Text Specimen
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1F2A44]">{pair.fgName} ({pair.fgHex})</td>
                  <td className="py-3 px-4 text-slate-700">{pair.bgName} ({pair.bgHex})</td>
                  <td className="py-3 px-4 font-mono font-bold text-sm">
                    {pair.ratio.toFixed(2)}:1
                  </td>
                  <td className="py-3 px-4">
                    {pair.status === 'AAA' && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px] rounded">
                        WCAG AAA Pass
                      </span>
                    )}
                    {pair.status === 'AA' && (
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold font-mono text-[10px] rounded">
                        WCAG AA Pass
                      </span>
                    )}
                    {pair.status === 'Fail' && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold font-mono text-[10px] rounded flex items-center gap-1 w-fit">
                        <AlertOctagon className="w-3 h-3" /> Fails Standard
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${pair.isApproved ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {pair.isApproved ? '✓ Approved' : '✕ FORBIDDEN'}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{pair.notes}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: CULTURAL COLOR SENSITIVITY GUIDE */}
      <div className="bg-[#FFF6EC]/60 border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8">
        <h4 className="font-brand font-bold text-lg text-[#1F2A44] mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF8A3D]" />
          Global Cultural Sensitivity Notes
        </h4>
        <p className="text-xs text-[#1F2A44]/80 max-w-3xl mb-4 font-readable">
          Because Human First AI operates across 38 global chapters from Nairobi and Lima to Lahore and Tokyo, colors carry specific historic, spiritual, and civil meanings:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-readable">
          <div className="p-4 bg-white rounded-xl border border-[#1F2A44]/8 space-y-1">
            <h5 className="font-bold text-[#FF8A3D]">Sunrise (#FF8A3D)</h5>
            <p className="text-slate-600">
              In South Asia, saffron and warm orange denote spiritual awakening, selfless service, and auspicious beginnings. In West Africa, it mirrors rich laterite earth and harvest bounty.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#1F2A44]/8 space-y-1">
            <h5 className="font-bold text-[#187F72]">Community Teal (#187F72)</h5>
            <p className="text-slate-600">
              In Islamic traditions and across North Africa and the Middle East, green-teal signifies peace, wisdom, paradise, and life-giving oasis waters. It fosters deep serenity.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#1F2A44]/8 space-y-1">
            <h5 className="font-bold text-[#1F2A44]">Deep Ink (#1F2A44)</h5>
            <p className="text-slate-600">
              Unlike harsh pitch black (which can carry funerary weight in several cultures), deep indigo and ink blue denote learning, scholarship, official honesty, and constitutional dignity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
