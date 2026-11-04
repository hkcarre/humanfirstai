import React from 'react';
import { IMAGES, BRAND_ONE_LINER, BRAND_PROMISE, BRAND_CORE_IDEA } from '../../data/brandData';
import { Users, Heart, Sparkles, Shield, Compass, BookOpen, ArrowRight } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* SECTION 1: THE CORE BRIEF & ESSENCE */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
            The Brand Foundation · Core Mandate
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-brand font-bold text-[#1F2A44] leading-tight">
            {BRAND_ONE_LINER}
          </h2>
          <p className="text-base sm:text-lg text-slate-700 font-readable leading-relaxed">
            Human First AI is a global non-profit movement dedicated to making artificial intelligence understandable, accessible, and immediately useful to everyone — especially the billions of people historically left out of technological progress.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
            <span className="px-3 py-1 bg-[#FFF6EC] text-[#1F2A44] font-semibold rounded-lg border border-[#1F2A44]/10">
              Core Idea: {BRAND_CORE_IDEA}
            </span>
            <span className="px-3 py-1 bg-[#187F72]/10 text-[#187F72] font-semibold rounded-lg">
              Promise: {BRAND_PROMISE}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE EMOTIONAL SHIFT & PERSONA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotional Shift Card */}
        <div className="p-6 lg:p-8 bg-white border border-[#1F2A44]/10 rounded-2xl shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-brand font-bold text-[#1F2A44]">
              The Emotional Shift We Create
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              From defensive anxiety to confident agency
            </p>
          </div>

          <div className="space-y-3 pt-2 font-readable text-xs sm:text-sm">
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80 flex items-start gap-2.5">
              <span className="font-bold text-rose-700 uppercase font-mono text-[10px] mt-0.5">Before:</span>
              <p className="text-slate-700">
                <strong>Fear & Alienation:</strong> Feeling that AI is an elite corporate black-box built to replace workers, render life unrecognizable, and demand high-level computer science knowledge.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start gap-2.5">
              <span className="font-bold text-emerald-800 uppercase font-mono text-[10px] mt-0.5">After:</span>
              <p className="text-slate-700">
                <strong>Confidence, Curiosity & Opportunity:</strong> Recognizing AI as a humble, everyday tool — like a flashlight or a pencil — that belongs to you and works under your command.
              </p>
            </div>
          </div>
        </div>

        {/* If The Brand Were a Person */}
        <div className="p-6 lg:p-8 bg-white border border-[#1F2A44]/10 rounded-2xl shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#187F72]/10 text-[#187F72] flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-brand font-bold text-[#1F2A44]">
              If The Brand Were a Person
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              The community teacher everyone trusts
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-readable leading-relaxed">
            Not the Silicon Valley founder wearing a fleece vest talking about disruption. Human First AI is the beloved neighborhood teacher who has lived on your street for twenty years.
          </p>

          <div className="space-y-2 text-xs font-readable text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#187F72]" />
              <span>Listens with patient, undivided attention before offering guidance.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#187F72]" />
              <span>Translates dense, intimidating jargon into crystal-clear everyday metaphors.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#187F72]" />
              <span>Believes wholeheartedly in the inherent wisdom and dignity of every learner.</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: THE FOUR AUDIENCES */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
            Universal Inclusivity · Four Audiences
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Designing for All Four Communities
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-2xl font-readable">
            The brand must feel trustworthy to an institutional funder in London, and welcoming to a first-time learner in Lagos, Lima, or Lahore.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Audience 1 */}
          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#FF8A3D] font-bold">Audience 01</span>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Anxious First-Time Learners</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              Older adults, low-income families, migrants, and workers without higher degrees.
            </p>
            <div className="text-[11px] font-semibold text-[#1F2A44] pt-1 border-t border-slate-200">
              Needs: Hospitality, patience, zero jargon, and immediate practical utility.
            </div>
          </div>

          {/* Audience 2 */}
          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#187F72] font-bold">Audience 02</span>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Volunteer Educators</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              Community librarians, local organizers, and professionals who give their weekends.
            </p>
            <div className="text-[11px] font-semibold text-[#1F2A44] pt-1 border-t border-slate-200">
              Needs: Turnkey curriculum slides, pride of uniform, and simple print sheets.
            </div>
          </div>

          {/* Audience 3 */}
          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#1F2A44] font-bold">Audience 03</span>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Foundations & Funders</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              Philanthropic foundations, universities, NGOs, and ethical corporate sponsors.
            </p>
            <div className="text-[11px] font-semibold text-[#1F2A44] pt-1 border-t border-slate-200">
              Needs: Transparent governance, institutional gravity, and audited impact.
            </div>
          </div>

          {/* Audience 4 */}
          <div className="p-4 rounded-xl bg-[#FFF6EC]/50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#7CC4F2] font-bold">Audience 04</span>
            <h4 className="font-brand font-bold text-sm text-[#1F2A44]">Policymakers & Press</h4>
            <p className="text-xs text-slate-600 font-readable leading-relaxed">
              Civil servants, journalists, educators, and legislative researchers.
            </p>
            <div className="text-[11px] font-semibold text-[#1F2A44] pt-1 border-t border-slate-200">
              Needs: Non-partisan data, human case studies, and clear policy briefs.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: AUTHENTIC DOCUMENTARY PHOTOGRAPHY SHOWCASE */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="pb-4 border-b border-[#1F2A44]/10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-bold">
            Photography Direction · Grounded Documentary
          </span>
          <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
            Real People in Real Places Under Natural Daylight
          </h3>
          <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-2xl font-readable">
            Strict brand rule: Zero corporate stock models. Zero faces lit by ominous glowing blue sci-fi screens. Only authentic community collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Photo 1: Workshop */}
          <div className="group rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
            <div className="h-44 overflow-hidden bg-slate-100">
              <img
                src={IMAGES.workshop}
                alt="Community workshop in session with mentor and senior learner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-xs">
              <h5 className="font-bold text-[#1F2A44]">Community Workshop</h5>
              <p className="text-[11px] text-slate-500 font-readable mt-0.5">
                Generations learning side-by-side with patient guidance and shared laughter.
              </p>
            </div>
          </div>

          {/* Photo 2: Farmer */}
          <div className="group rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
            <div className="h-44 overflow-hidden bg-slate-100">
              <img
                src={IMAGES.farmer}
                alt="Farmer in the Andes using tablet weather tool"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-xs">
              <h5 className="font-bold text-[#1F2A44]">Agricultural Utility</h5>
              <p className="text-[11px] text-slate-500 font-readable mt-0.5">
                Andean farmer reviewing frost alerts to protect food security and harvest.
              </p>
            </div>
          </div>

          {/* Photo 3: Artisan */}
          <div className="group rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
            <div className="h-44 overflow-hidden bg-slate-100">
              <img
                src={IMAGES.artisan}
                alt="Textile artisan and volunteer reviewing digital designs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-xs">
              <h5 className="font-bold text-[#1F2A44]">Craft & Livelihood</h5>
              <p className="text-[11px] text-slate-500 font-readable mt-0.5">
                Independent textile craftswoman digitizing patterns and inventory.
              </p>
            </div>
          </div>

          {/* Photo 4: Gathering Hall */}
          <div className="group rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
            <div className="h-44 overflow-hidden bg-slate-100">
              <img
                src={IMAGES.hall}
                alt="Open community gathering hall with learners and open doors"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-xs">
              <h5 className="font-bold text-[#1F2A44]">Grassroots Hub</h5>
              <p className="text-[11px] text-slate-500 font-readable mt-0.5">
                Neighborhood gathering with doors swung wide open to the public street.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
