import React from 'react';
import { LogoMark } from './LogoMark';
import { BRAND_COLORS } from '../../data/brandData';
import { Printer, CheckCircle, XCircle, HeartHandshake, Shield, Sparkles } from 'lucide-react';

export const VolunteerQuickSheet: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="no-print bg-white border border-[#1F2A44]/10 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-bold">
            Field Kit · Grassroots Chapter Resource
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            2-Page Volunteer Quick-Reference Cheat Sheet
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-0.5">
            Compact double-sided field reference for community educators, workshop leads, and local organizers.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF8A3D] text-[#1F2A44] hover:bg-[#FF8A3D]/90 text-xs font-bold rounded-lg cursor-pointer shrink-0 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          Print 2-Page Volunteer Guide
        </button>
      </div>

      {/* PAGE 1: BRAND IDENTITY & DESIGN QUICK REFERENCE */}
      <div className="bg-white border-2 border-[#1F2A44]/20 rounded-2xl p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-6 page-break">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1F2A44]">
          <LogoMark route="open-door" lockup="horizontal" size={32} colorScheme="full" />
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#FF8A3D] uppercase tracking-wider">
              VOLUNTEER FIELD GUIDE · PAGE 1
            </span>
            <div className="text-[11px] text-slate-500 font-mono">Brand Identity & Visual Standards</div>
          </div>
        </div>

        {/* Core Reminder */}
        <div className="p-4 bg-[#FFF6EC] border border-[#FF8A3D]/40 rounded-xl">
          <h4 className="font-brand font-bold text-base text-[#1F2A44]">
            Our One-Line Brief: Make AI feel like an open door, not a locked lab.
          </h4>
          <p className="text-xs text-slate-700 mt-1 font-readable">
            If you ever wonder how to design a slide or write a flyer, ask yourself: &quot;Does this sound like a warm, patient neighbor, or does it sound like an intimidating corporation?&quot;
          </p>
        </div>

        {/* 3-Column Visual Tokens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Logo Rules */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-[#1F2A44] font-brand uppercase text-[11px] block">
              1. Logo Rules
            </span>
            <div className="space-y-1 font-readable text-slate-600">
              <p className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Use &quot;Human First AI&quot; (no hyphen)
              </p>
              <p className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Leave 1X clear space all around
              </p>
              <p className="flex items-center gap-1.5 text-rose-800 font-medium">
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                Never rotate, stretch, or recolor in neon
              </p>
              <p className="flex items-center gap-1.5 text-rose-800 font-medium">
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                No text inside the door symbol
              </p>
            </div>
          </div>

          {/* Color Tokens */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-[#1F2A44] font-brand uppercase text-[11px] block">
              2. Key Color Tokens
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#1F2A44]" /> Deep Ink:
                </span>
                <span className="text-slate-600">#1F2A44</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#FF8A3D]" /> Sunrise:
                </span>
                <span className="text-slate-600">#FF8A3D</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#187F72]" /> Teal:
                </span>
                <span className="text-slate-600">#187F72</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#FFF6EC] border border-slate-300" /> Cream:
                </span>
                <span className="text-slate-600">#FFF6EC</span>
              </div>
            </div>
            <div className="text-[10px] text-rose-700 font-bold pt-1">
              Never put white text on Sunrise orange!
            </div>
          </div>

          {/* Typography */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-[#1F2A44] font-brand uppercase text-[11px] block">
              3. Approved Fonts
            </span>
            <div className="space-y-1.5 font-readable text-slate-600">
              <p>
                <strong>Headlines:</strong> Plus Jakarta Sans (SemiBold)
              </p>
              <p>
                <strong>Body & Handouts:</strong> Atkinson Hyperlegible (min 16pt for older adults)
              </p>
              <p>
                <strong>Global Languages:</strong> Noto Sans (Arabic, Hindi, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* 5 Field Guardrails */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-[#1F2A44]">
            Five Non-Negotiable Field Guardrails:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-readable">
            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
              ✓ <strong>Always use real photos:</strong> Smiling neighbors in daylight. No blue glowing screens.
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-900 rounded border border-rose-200">
              ✕ <strong>No sci-fi metaphors:</strong> Never use robots, floating brains, or circuit boards.
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
              ✓ <strong>Photocopy test:</strong> Test every handout on a cheap B&W printer before duplicating.
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-900 rounded border border-rose-200">
              ✕ <strong>No pill boxes:</strong> Do not wrap tags in rounded pill capsules or badges.
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Human First AI · volunteer@humanfirst.ai</span>
          <span>Turn sheet over for Workshop Facilitation & Plain English →</span>
        </div>
      </div>

      {/* PAGE 2: FACILITATION & PLAIN-ENGLISH CHEAT SHEET */}
      <div className="bg-white border-2 border-[#1F2A44]/20 rounded-2xl p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-6 page-break">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1F2A44]">
          <LogoMark route="open-door" lockup="horizontal" size={32} colorScheme="full" />
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#187F72] uppercase tracking-wider">
              VOLUNTEER FIELD GUIDE · PAGE 2
            </span>
            <div className="text-[11px] text-slate-500 font-mono">Workshop Facilitation & Plain Language</div>
          </div>
        </div>

        {/* Plain English Translation Table */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-[#FF8A3D]">
            Instant Plain-English Translation Table (Grade 6 Reading Level):
          </span>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 font-mono text-[11px] text-slate-600">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">Tech Jargon (DO NOT SAY)</th>
                  <th className="p-2.5">Human First AI (SAY THIS INSTEAD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-readable">
                <tr>
                  <td className="p-2.5 bg-rose-50/40 text-rose-900 border-r border-slate-200">
                    &quot;Large Language Model (LLM)&quot;
                  </td>
                  <td className="p-2.5 text-emerald-900 font-semibold">
                    &quot;A computer tool that reads patterns and writes text in plain language.&quot;
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 bg-rose-50/40 text-rose-900 border-r border-slate-200">
                    &quot;Prompt Engineering&quot;
                  </td>
                  <td className="p-2.5 text-emerald-900 font-semibold">
                    &quot;Asking clear questions with helpful details, like talking to an assistant.&quot;
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 bg-rose-50/40 text-rose-900 border-r border-slate-200">
                    &quot;Hallucination / Synthetic Output&quot;
                  </td>
                  <td className="p-2.5 text-emerald-900 font-semibold">
                    &quot;A guess or mistake made by the computer that you must double-check.&quot;
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 bg-rose-50/40 text-rose-900 border-r border-slate-200">
                    &quot;Artificial General Intelligence (AGI)&quot;
                  </td>
                  <td className="p-2.5 text-emerald-900 font-semibold">
                    &quot;Theoretical future computer systems; our focus today is practical tools for your real work.&quot;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Answer Fear Questions */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-[#1F2A44]">
            How to Answer Common Learner Fears with Warmth & Dignity:
          </span>
          <div className="space-y-2 text-xs font-readable">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-bold text-[#1F2A44]">Q: &quot;Will AI take my job or replace me?&quot;</p>
              <p className="text-slate-600 mt-1">
                <strong>Your Answer:</strong> &quot;That is a completely understandable fear. Technology changes work, just like phones and tractors did. That is exactly why we are here today: when you know how to use these tools yourself, you stay in control and make technology work for your livelihood, not against it.&quot;
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-bold text-[#1F2A44]">Q: &quot;Is this safe for my family’s private information?&quot;</p>
              <p className="text-slate-600 mt-1">
                <strong>Your Answer:</strong> &quot;Rule number one: treat AI like a bulletin board in a town square. Never share passwords, medical IDs, or bank numbers. We will practice safe, private prompts together today.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Workshop Day Checklist */}
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 text-xs">
          <span className="font-bold text-emerald-900 uppercase font-mono text-[11px] block">
            Workshop Room Checklist (30 Minutes Before Doors Open)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-950 font-readable">
            <p>☑ Tea, water, and fresh fruit placed at the welcome table.</p>
            <p>☑ Paper notepads and pens ready for learners without phones.</p>
            <p>☑ All volunteer educators wearing their Human First AI badges.</p>
            <p>☑ Room arranged in round learning circles, never classroom rows.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Human First AI Volunteer Network · Keep this sheet in your field bag</span>
          <span>humanfirst.ai/volunteer</span>
        </div>
      </div>
    </div>
  );
};
