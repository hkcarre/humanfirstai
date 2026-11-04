import React, { useState } from 'react';
import { LogoMark } from './components/brand/LogoMark';
import { BrandStory } from './components/brand/BrandStory';
import { LogoStudio } from './components/brand/LogoStudio';
import { ColorMatrix } from './components/brand/ColorMatrix';
import { TypographyStudio } from './components/brand/TypographyStudio';
import { VoiceJargonBuster } from './components/brand/VoiceJargonBuster';
import { MockupGallery } from './components/brand/MockupGallery';
import { BrandGuidelinesBook } from './components/brand/BrandGuidelinesBook';
import { VolunteerQuickSheet } from './components/brand/VolunteerQuickSheet';
import { ChapterGenerator } from './components/brand/ChapterGenerator';
import {
  Download,
  BookOpen,
  Printer,
  Sparkles,
  Layers,
  Palette,
  Type,
  FileCheck,
  Globe,
  MessageSquare,
  ShieldAlert,
  Check,
  X,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('story');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [downloadBatchNotice, setDownloadBatchNotice] = useState<string | null>(null);

  const navLinks = [
    { id: 'story', label: 'Story & Essence' },
    { id: 'logo', label: 'Logo Studio' },
    { id: 'colors', label: 'Color & Contrast' },
    { id: 'typography', label: 'Typography & Icons' },
    { id: 'voice', label: 'Voice & Jargon Buster' },
    { id: 'mockups', label: 'Applications (10)' },
    { id: 'chapters', label: 'Chapters & Co-Brand' },
    { id: 'guidelines', label: 'Brand Book (30p)' },
    { id: 'volunteer', label: 'Volunteer Cheat Sheet' },
  ];

  const handleDownloadAllAssets = () => {
    // Generate master JSON asset manifest and trigger comprehensive download notice
    const manifest = {
      brand: "Human First AI",
      version: "2026.1",
      brief: "Make AI feel like an open door, not a locked lab.",
      colors: {
        warmCream: "#FFF6EC",
        deepInk: "#1F2A44",
        sunrise: "#FF8A3D",
        communityTeal: "#187F72",
        sky: "#7CC4F2",
      },
      fonts: ["Atkinson Hyperlegible", "Plus Jakarta Sans", "Noto Sans"],
      approvedLockups: ["horizontal", "stacked", "symbol", "descriptor", "chapter"],
      licensing: "Creative Commons Attribution-NonCommercial 4.0 International",
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `human-first-ai-brand-tokens-v2026.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadBatchNotice("Brand Tokens & Design Kit Manifest downloaded successfully.");
    setTimeout(() => setDownloadBatchNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFF6EC] text-[#1F2A44] flex flex-col font-sans selection:bg-[#FF8A3D]/25 selection:text-[#1F2A44]">
      {/* ============================================================== */}
      {/* 3-ZONE TOP BAR CONTRACT */}
      {/* ============================================================== */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#1F2A44]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand element (One line) */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#story"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('story');
              }}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <LogoMark route="open-door" lockup="horizontal" size={28} colorScheme="full" />
            </a>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line text links) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-[#1F2A44]/80 overflow-x-auto py-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#FF8A3D] cursor-pointer py-1 ${
                    isActive
                      ? 'text-[#FF8A3D] font-bold border-b-2 border-[#FF8A3D]'
                      : 'text-[#1F2A44]/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F2A44] hover:bg-[#1F2A44]/90 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Brand Kit</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Navigation Rail */}
        <div className="xl:hidden flex items-center gap-2 px-4 py-2.5 overflow-x-auto bg-slate-50 border-t border-slate-200 text-xs font-medium no-scrollbar">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1F2A44] text-white font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* GLOBAL BANNER / NOTICE IF ANY */}
      {downloadBatchNotice && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2 text-xs text-center font-medium flex items-center justify-center gap-2">
          <span>✓ {downloadBatchNotice}</span>
          <button onClick={() => setDownloadBatchNotice(null)} className="ml-2 underline font-bold">Close</button>
        </div>
      )}

      {/* ============================================================== */}
      {/* MAIN VIEWPORT CONTENT */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {activeTab === 'story' && <BrandStory />}
        {activeTab === 'logo' && <LogoStudio />}
        {activeTab === 'colors' && <ColorMatrix />}
        {activeTab === 'typography' && <TypographyStudio />}
        {activeTab === 'voice' && <VoiceJargonBuster />}
        {activeTab === 'mockups' && <MockupGallery />}
        {activeTab === 'chapters' && <ChapterGenerator />}
        {activeTab === 'guidelines' && <BrandGuidelinesBook />}
        {activeTab === 'volunteer' && <VolunteerQuickSheet />}
      </main>

      {/* ============================================================== */}
      {/* BRAND FOOTER (CLEAN RESTRAINED PROSE) */}
      {/* ============================================================== */}
      <footer className="no-print bg-white border-t border-[#1F2A44]/10 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#1F2A44]/70 font-readable">
          <div className="flex items-center gap-3">
            <LogoMark route="open-door" lockup="symbol" size={24} colorScheme="full" />
            <div>
              <span className="font-brand font-bold text-[#1F2A44]">Human First AI</span>
              <span className="text-slate-400"> · </span>
              <span>The future belongs to all of us.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-slate-600">
            <button onClick={() => setActiveTab('guidelines')} className="hover:text-[#FF8A3D] cursor-pointer">
              30-Page Brand Manual
            </button>
            <button onClick={() => setActiveTab('volunteer')} className="hover:text-[#FF8A3D] cursor-pointer">
              Volunteer Quick Sheet
            </button>
            <button onClick={() => setActiveTab('chapters')} className="hover:text-[#FF8A3D] cursor-pointer">
              Global Chapters
            </button>
            <button onClick={() => window.print()} className="hover:text-[#FF8A3D] cursor-pointer flex items-center gap-1">
              <Printer className="w-3.5 h-3.5" /> Print View
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            CC BY-NC 4.0 · Open to all communities
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* EXPORT BRAND KIT MODAL */}
      {/* ============================================================== */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <LogoMark route="open-door" lockup="symbol" size={24} colorScheme="full" />
                <h3 className="font-brand font-bold text-lg text-[#1F2A44]">
                  Export Brand Assets Kit
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-readable">
              Download official vector assets, print-calibrated color tokens, typography guides, and curriculum templates for Human First AI.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1F2A44]">SVG Vector Logo Suite</div>
                  <div className="text-[11px] text-slate-500">All 4 concept routes, horizontal, stacked, and chapter lockups</div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('logo');
                    setShowExportModal(false);
                  }}
                  className="px-2.5 py-1 bg-[#1F2A44] text-white rounded text-[11px] font-semibold cursor-pointer"
                >
                  Go to Studio
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1F2A44]">30-Page Brand Guidelines PDF</div>
                  <div className="text-[11px] text-slate-500">Complete institutional handbook formatted for printing & saving</div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('guidelines');
                    setShowExportModal(false);
                  }}
                  className="px-2.5 py-1 bg-[#1F2A44] text-white rounded text-[11px] font-semibold cursor-pointer"
                >
                  View Book
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1F2A44]">Design Tokens (JSON)</div>
                  <div className="text-[11px] text-slate-500">HEX, RGB, CMYK, Pantone, and typographic math</div>
                </div>
                <button
                  onClick={handleDownloadAllAssets}
                  className="px-2.5 py-1 bg-[#FF8A3D] text-[#1F2A44] font-bold rounded text-[11px] cursor-pointer"
                >
                  Download JSON
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
