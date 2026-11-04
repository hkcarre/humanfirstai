import React, { useState } from 'react';
import { GUIDELINES_BOOK_PAGES, IMAGES } from '../../data/brandData';
import { LogoMark } from './LogoMark';
import { Book, ChevronLeft, ChevronRight, Printer, Search, CheckCircle2, Bookmark } from 'lucide-react';

export const BrandGuidelinesBook: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'reader' | 'all-pages'>('reader');

  const filteredPages = searchQuery.trim()
    ? GUIDELINES_BOOK_PAGES.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : GUIDELINES_BOOK_PAGES;

  const activePage = GUIDELINES_BOOK_PAGES.find((p) => p.pageNumber === currentPage) || GUIDELINES_BOOK_PAGES[0];

  return (
    <div className="space-y-8">
      {/* TOOLBAR & CONTROLS (Hidden during printing) */}
      <div className="no-print bg-white border border-[#1F2A44]/10 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
              Official Master Publication
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-[#187F72]">30 Comprehensive Thematic Pages</span>
          </div>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1 flex items-center gap-2">
            <Book className="w-5 h-5 text-[#FF8A3D]" />
            Human First AI Brand Guidelines (30-Page Manual)
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-0.5">
            Complete institutional standards covering identity, voice, accessibility, typography, co-branding, and applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('reader')}
              className={`px-3 py-1.5 rounded-md cursor-pointer ${
                viewMode === 'reader' ? 'bg-white text-[#1F2A44] shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Paginated Reader
            </button>
            <button
              onClick={() => setViewMode('all-pages')}
              className={`px-3 py-1.5 rounded-md cursor-pointer ${
                viewMode === 'all-pages' ? 'bg-white text-[#1F2A44] shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Unroll All 30 Pages
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 text-xs font-semibold rounded-lg cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF (30 Pages)
          </button>
        </div>
      </div>

      {/* SEARCH & QUICK CHAPTER JUMP (Hidden in print) */}
      <div className="no-print bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guidelines (e.g. typography, clear space)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#1F2A44] focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
          />
        </div>

        {viewMode === 'reader' && (
          <div className="flex items-center gap-2 text-xs">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-600 font-semibold">
              Page {currentPage} of 30
            </span>
            <button
              disabled={currentPage >= 30}
              onClick={() => setCurrentPage((p) => Math.min(30, p + 1))}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* READER VIEW (SINGLE PAGE BEAUTIFULLY LAID OUT) */}
      {viewMode === 'reader' && (
        <div className="bg-white border border-[#1F2A44]/15 rounded-2xl shadow-lg p-8 sm:p-14 max-w-4xl mx-auto space-y-8 min-h-[640px] flex flex-col justify-between">
          {/* Page Running Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1F2A44]/10 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <LogoMark route="open-door" lockup="symbol" size={20} colorScheme="full" />
              <span className="font-bold text-[#1F2A44]">HUMAN FIRST AI BRAND GUIDELINES</span>
            </div>
            <span>{activePage.chapter} · Page {activePage.pageNumber}</span>
          </div>

          {/* Page Body Content */}
          <div className="space-y-6 my-auto">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
                {activePage.chapter}
              </span>
              <h2 className="text-3xl sm:text-4xl font-brand font-bold text-[#1F2A44] leading-tight mt-1">
                {activePage.title}
              </h2>
              <p className="text-sm text-[#187F72] font-medium mt-1">
                {activePage.subtitle}
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-readable">
              {activePage.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Rules or Metrics if present */}
            {activePage.keyRules && (
              <div className="p-4 bg-[#FFF6EC] border border-[#FF8A3D]/30 rounded-xl space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-[#FF8A3D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Non-Negotiable Rules:
                </span>
                <ul className="space-y-1 text-xs sm:text-sm text-[#1F2A44] font-readable font-medium">
                  {activePage.keyRules.map((rule, idx) => (
                    <li key={idx}>• {rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {activePage.metrics && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                {activePage.metrics.map((m, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-brand font-bold text-[#1F2A44]">{m.value}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Page Running Footer */}
          <div className="pt-4 border-t border-[#1F2A44]/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Confidential & Open-Source · Human First AI Global</span>
            <span>Ref: DOC-HF-2026-v2.4</span>
          </div>
        </div>
      )}

      {/* UNROLL ALL 30 PAGES VIEW (Also used for clean multi-page printing) */}
      {(viewMode === 'all-pages' || true) && (
        <div className={viewMode === 'reader' ? 'hidden print:block' : 'space-y-10'}>
          {filteredPages.map((page) => (
            <div
              key={page.pageNumber}
              className="bg-white border border-[#1F2A44]/15 rounded-2xl shadow-sm p-8 sm:p-12 max-w-4xl mx-auto space-y-6 page-break"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2A44]/10 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <LogoMark route="open-door" lockup="symbol" size={18} colorScheme="full" />
                  <span className="font-bold text-[#1F2A44]">HUMAN FIRST AI BRAND GUIDELINES</span>
                </div>
                <span>{page.chapter} · Page {page.pageNumber} of 30</span>
              </div>

              {/* Title */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
                  {page.chapter}
                </span>
                <h3 className="text-2xl sm:text-3xl font-brand font-bold text-[#1F2A44] mt-0.5">
                  {page.title}
                </h3>
                <p className="text-xs text-[#187F72] font-medium mt-0.5">{page.subtitle}</p>
              </div>

              {/* Text */}
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-readable">
                {page.content.map((c, i) => (
                  <p key={i}>{c}</p>
                ))}
              </div>

              {page.keyRules && (
                <div className="p-3 bg-[#FFF6EC] border border-[#FF8A3D]/30 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-[#FF8A3D] font-mono uppercase">Key Rules:</div>
                  {page.keyRules.map((r, i) => (
                    <div key={i} className="text-[#1F2A44] font-medium">• {r}</div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-[#1F2A44]/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Human First AI · Making AI feel like an open door</span>
                <span>Page {page.pageNumber}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
