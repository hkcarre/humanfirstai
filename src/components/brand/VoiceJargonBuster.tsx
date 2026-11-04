import React, { useState } from 'react';
import { COPY_DELIVERABLES, JARGON_BUSTER_ENTRIES } from '../../data/brandData';
import { ArrowRight, Sparkles, Check, MessageSquare, Heart, Shield, Users } from 'lucide-react';

export const VoiceJargonBuster: React.FC = () => {
  const [selectedJargonIdx, setSelectedJargonIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [customOutput, setCustomOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'headlines' | 'social' | 'workshop' | 'volunteer'>('headlines');

  const handleTranslateCustom = () => {
    if (!customInput.trim()) return;
    // Heuristic translation based on keywords or friendly plain language transformation
    const lower = customInput.toLowerCase();
    let translated = "A simple tool that helps you do your daily tasks faster and with less stress.";
    if (lower.includes('neural') || lower.includes('llm') || lower.includes('model') || lower.includes('transformer')) {
      translated = "A computer program that learns from examples to help you write, calculate, or organize information in plain language.";
    } else if (lower.includes('democratiz') || lower.includes('access')) {
      translated = "Making sure everyday tools are free, easy to understand, and available in every local neighborhood.";
    } else if (lower.includes('synerg') || lower.includes('optimize') || lower.includes('heuristic')) {
      translated = "Helping people save time and get real work done without confusing steps.";
    } else if (lower.includes('autonomous') || lower.includes('agent')) {
      translated = "A practical digital assistant that takes care of repetitive tasks so you have time for your family and community.";
    }
    setCustomOutput(translated);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: VOICE PRINCIPLES & PHILOSOPHY */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-6 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
            Editorial Guidelines · Tone & Voice
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            The Community Teacher Everyone Trusts
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-3xl font-readable">
            If Human First AI were a person, they would be the patient neighborhood teacher with tea in hand, listening twice as much as they speak. We never talk down, hype tech breakthroughs, or use gatekeeping jargon.
          </p>
        </div>

        {/* 4 Tone Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center font-bold">
              <Heart className="w-4 h-4" />
            </div>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Warm & Welcoming</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              We greet learners with open arms. We replace cold tech distance with gentle encouragement and safety.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#187F72]/10 text-[#187F72] flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Grounded & Plain</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              We anchor every conversation in daily life: crop prices, job resumes, doctor notes, and family budgets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F2A44]/10 text-[#1F2A44] flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Quietly Confident</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              No breathless exclamation points or hype. We state plain truths with calm, authoritative grace.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#7CC4F2]/20 text-[#1F2A44] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Community-Anchored</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              We say &quot;we&quot; and &quot;our community,&quot; never &quot;our platform&quot; or &quot;end-users.&quot; People own the tools.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE JARGON BUSTER */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Plain-Language Engine
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              Interactive Jargon Buster
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1">
              Translating Silicon Valley buzzwords into clear, Grade 6 reading level English.
            </p>
          </div>

          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-semibold border border-emerald-200 self-start md:self-auto">
            Target Reading Age: 12 Years Old
          </span>
        </div>

        {/* Preset Selector */}
        <div className="my-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Sample Industry Buzzwords (Click to Translate):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {JARGON_BUSTER_ENTRIES.map((entry, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedJargonIdx(idx);
                  setCustomOutput(null);
                }}
                className={`p-3 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                  selectedJargonIdx === idx && !customOutput
                    ? 'border-[#FF8A3D] bg-[#FFF6EC] shadow-2xs font-medium text-[#1F2A44]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-[10px] font-mono text-[#FF8A3D] uppercase font-bold mb-1">
                  {entry.category}
                </div>
                <div className="line-clamp-2 italic">&quot;{entry.jargon}&quot;</div>
              </button>
            ))}
          </div>
        </div>

        {/* Translation Comparison Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-xl bg-slate-50 border border-slate-200/80">
          {/* Tech Jargon Side */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-rose-600 flex items-center gap-1">
              ✕ Tech Cliché / Gatekeeping Jargon
            </span>
            <div className="p-4 bg-white rounded-lg border border-rose-200 text-sm text-slate-700 italic font-mono leading-relaxed">
              &quot;{JARGON_BUSTER_ENTRIES[selectedJargonIdx].jargon}&quot;
            </div>
            <p className="text-[11px] text-slate-500">
              Alienates first-time learners and makes AI feel like a mysterious, guarded laboratory.
            </p>
          </div>

          {/* Plain English Side */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-emerald-700 flex items-center gap-1">
              ✓ Human First AI (Plain English)
            </span>
            <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 text-base font-brand font-semibold text-[#1F2A44] leading-relaxed">
              {JARGON_BUSTER_ENTRIES[selectedJargonIdx].plainEnglish}
            </div>
            <p className="text-[11px] text-emerald-700">
              Clear, practical, and focuses directly on human benefit and real everyday agency.
            </p>
          </div>
        </div>

        {/* Custom Input Sandbox */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Test Your Own Tech Phrase:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., Leveraging multi-modal transformer architectures for accelerated synergy..."
              className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-[#1F2A44] focus:outline-none focus:ring-1 focus:ring-[#FF8A3D]"
            />
            <button
              onClick={handleTranslateCustom}
              className="px-4 py-2 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Translate
            </button>
          </div>

          {customOutput && (
            <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
              <span className="font-bold text-emerald-800">Human First Translation:</span>
              <p className="text-slate-800 mt-1 font-semibold text-sm">{customOutput}</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: REAL COPYWRITING DELIVERABLES (The 4 Brief Requirements) */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
              Application Specimens · 4 Real Deliverables
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              Sample Copy Library
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1">
              Vetted copy templates ready for immediate grassroots deployment.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto">
            {(['headlines', 'social', 'workshop', 'volunteer'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs rounded-md font-medium capitalize transition-colors cursor-pointer ${
                  activeTab === tab ? 'bg-white text-[#1F2A44] shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'headlines' ? 'Headlines' : tab === 'social' ? 'Social Post' : tab === 'workshop' ? 'Workshop Invite' : 'Volunteer Callout'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content 1: Headlines */}
        {activeTab === 'headlines' && (
          <div className="mt-6 space-y-4">
            <p className="text-xs text-slate-500">
              Tested campaign headlines crafted to turn tech fear into confidence and invitation:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COPY_DELIVERABLES.headlines.map((hl, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-[#FFF6EC]/40 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
                    {hl.role}
                  </span>
                  <h4 className="text-lg font-brand font-bold text-[#1F2A44]">
                    &quot;{hl.text}&quot;
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Social Media Post */}
        {activeTab === 'social' && (
          <div className="mt-6 max-w-2xl mx-auto p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1F2A44] text-white flex items-center justify-center font-bold text-xs">
                  HF
                </div>
                <div>
                  <div className="font-bold text-[#1F2A44]">{COPY_DELIVERABLES.socialPost.handle}</div>
                  <div className="text-[11px] text-slate-500">Official Movement Account</div>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-400">Instagram / LinkedIn</span>
            </div>

            <p className="text-sm font-readable text-[#1F2A44] leading-relaxed whitespace-pre-line">
              {COPY_DELIVERABLES.socialPost.body}
            </p>

            <div className="text-xs text-[#187F72] font-medium">
              {COPY_DELIVERABLES.socialPost.hashtags}
            </div>
          </div>
        )}

        {/* Tab Content 3: Workshop Invite */}
        {activeTab === 'workshop' && (
          <div className="mt-6 p-6 bg-[#FFF6EC]/50 rounded-xl border border-[#FF8A3D]/30 space-y-4 max-w-2xl mx-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
              {COPY_DELIVERABLES.workshopInvite.kicker}
            </div>
            <h4 className="text-2xl font-brand font-bold text-[#1F2A44]">
              {COPY_DELIVERABLES.workshopInvite.title}
            </h4>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1 font-readable">
              <div><strong>When:</strong> {COPY_DELIVERABLES.workshopInvite.date}</div>
              <div><strong>Where:</strong> {COPY_DELIVERABLES.workshopInvite.location}</div>
              <div><strong>Cost:</strong> {COPY_DELIVERABLES.workshopInvite.cost}</div>
            </div>

            <p className="text-sm text-[#1F2A44]/90 font-readable whitespace-pre-line leading-relaxed">
              {COPY_DELIVERABLES.workshopInvite.description}
            </p>

            <div className="pt-3 border-t border-slate-200 text-xs text-[#187F72] font-semibold">
              {COPY_DELIVERABLES.workshopInvite.rsvp}
            </div>
          </div>
        )}

        {/* Tab Content 4: Volunteer Call-out */}
        {activeTab === 'volunteer' && (
          <div className="mt-6 p-6 bg-white rounded-xl border border-slate-200 space-y-4 max-w-2xl mx-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#187F72] font-bold">
              {COPY_DELIVERABLES.volunteerCallout.kicker}
            </div>
            <h4 className="text-2xl font-brand font-bold text-[#1F2A44]">
              {COPY_DELIVERABLES.volunteerCallout.title}
            </h4>

            <p className="text-sm text-[#1F2A44]/90 font-readable whitespace-pre-line leading-relaxed">
              {COPY_DELIVERABLES.volunteerCallout.body}
            </p>

            <div className="pt-3 border-t border-slate-200 text-xs font-bold text-[#FF8A3D]">
              {COPY_DELIVERABLES.volunteerCallout.cta}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
