import React, { useState } from 'react';
import { LogoMark } from './LogoMark';
import { Download, Sparkles, Building2, Globe2, ShieldCheck, Check } from 'lucide-react';

export const ChapterGenerator: React.FC = () => {
  const [cityInput, setCityInput] = useState<string>('Nairobi');
  const [partnerInput, setPartnerInput] = useState<string>('UNESCO Digital Literacy');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const popularChapters = ['Nairobi', 'Lima', 'Lahore', 'Jakarta', 'Detroit', 'Oaxaca', 'London', 'Tokyo'];

  const handleDownloadChapterSvg = () => {
    const svgCode = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120" width="520" height="120">
  <g id="symbol">
    <polygon points="38,36 78,82 28,82 38,76" fill="rgba(255,138,61,0.28)" />
    <line x1="14" y1="82" x2="86" y2="82" stroke="#1F2A44" stroke-width="5" stroke-linecap="round" />
    <path d="M 30 82 V 38 C 30 20, 70 20, 70 38 V 82" stroke="#1F2A44" stroke-width="6" stroke-linecap="round" fill="none" />
    <path d="M 50 24 L 38 32 V 78 L 50 82 Z" fill="#FF8A3D" />
    <circle cx="50" cy="46" r="4.5" fill="#187F72" />
  </g>
  <text x="105" y="74" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="34" fill="#1F2A44">Human</text>
  <text x="212" y="74" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" font-size="34" fill="#1F2A44">First</text>
  <text x="286" y="74" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="30" fill="#FF8A3D">AI</text>
  <line x1="334" y1="46" x2="334" y2="76" stroke="#1F2A44" stroke-opacity="0.25" stroke-width="2" />
  <text x="350" y="74" font-family="Plus Jakarta Sans, sans-serif" font-weight="500" font-size="30" fill="#187F72">${cityInput}</text>
</svg>`;

    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `human-first-ai-chapter-${cityInput.toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Chapter lockup downloaded for ${cityInput}`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: CHAPTER LOCKUP GENERATOR */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2A44]/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-bold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" /> Local Chapter Identity Generator
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              Custom Chapter Lockups
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1">
              Generate standardized official vector assets for any city, region, or university chapter worldwide.
            </p>
          </div>

          <button
            onClick={handleDownloadChapterSvg}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 text-xs font-semibold rounded-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Chapter SVG
          </button>
        </div>

        {downloadNotice && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Input & Quick Cities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1F2A44]">
              Enter Chapter Location:
            </label>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g., Nairobi, Lima, Karachi"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-[#1F2A44] focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Global Chapters:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {popularChapters.map((c) => (
                <button
                  key={c}
                  onClick={() => setCityInput(c)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    cityInput === c
                      ? 'bg-[#187F72] text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chapter Stage Preview */}
        <div className="p-8 rounded-xl bg-[#FFF6EC]/60 border border-slate-200 flex items-center justify-center min-h-[160px] overflow-x-auto">
          <LogoMark
            route="open-door"
            lockup="chapter"
            chapterName={cityInput || 'Global'}
            size={56}
            colorScheme="full"
          />
        </div>

        <div className="mt-4 text-xs text-slate-500 font-readable">
          <strong>Chapter Lockup Formula:</strong> The vertical divider is 1.5px solid at 25% opacity of Deep Ink. The city name is rendered in Community Teal at 500 Medium weight.
        </div>
      </div>

      {/* SECTION 2: CO-BRANDING WITH PARTNERS & SPONSORS */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Institutional Co-Branding Standards
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Partner, Sponsor & Foundation Lockups
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-2xl font-readable">
            Equal optical height, neutral hairline dividers, and mutual respect. When co-branding with universities, UNESCO, or community foundations, our mark maintains strict autonomy.
          </p>
        </div>

        <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Partner Name (Test Specimen):
          </label>
          <input
            type="text"
            value={partnerInput}
            onChange={(e) => setPartnerInput(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-[#1F2A44]"
          />
        </div>

        {/* Co-Branded Live Lockup Preview */}
        <div className="p-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center gap-8 flex-wrap">
          {/* Human First AI */}
          <LogoMark route="open-door" lockup="horizontal" size={44} colorScheme="full" />

          {/* Divider */}
          <div className="h-10 w-px bg-slate-300" />

          {/* Simulated Partner Logo */}
          <div className="flex items-center gap-2 text-[#1F2A44]">
            <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs font-mono">
              PT
            </div>
            <div>
              <div className="font-brand font-bold text-sm text-[#1F2A44] leading-tight">{partnerInput}</div>
              <div className="text-[10px] text-slate-500 font-mono">Official Community Partner</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs font-readable">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong>1. Proportional Parity:</strong> Neither mark shall visually overpower the other. Both logos share equal optical prominence (approx. 36–44px height).
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong>2. Clear Space Buffer:</strong> A minimum distance equal to 1.5X of the capital &apos;H&apos; must separate both logos and the vertical divider.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong>3. Contrast Integrity:</strong> On colored or photographic partner backgrounds, Human First AI switches to solid Deep Ink or reversed Pure White.
          </div>
        </div>
      </div>
    </div>
  );
};
