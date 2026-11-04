import React, { useState } from 'react';
import { LogoMark } from './LogoMark';
import { IMAGES } from '../../data/brandData';
import {
  Monitor,
  Smartphone,
  Share2,
  Presentation,
  Shirt,
  FileText,
  Award,
  Mail,
  Flag,
  Tag,
  Printer,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

export const MockupGallery: React.FC = () => {
  const [selectedMockup, setSelectedMockup] = useState<string>('flyer');
  const [flyerMode, setFlyerMode] = useState<'color' | 'photocopy'>('photocopy');
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [certName, setCertName] = useState<string>('Amara Okafor');
  const [certCourse, setCertCourse] = useState<string>('Practical AI for Small Business & Agriculture');
  const [copiedSignature, setCopiedSignature] = useState<boolean>(false);

  const mockupsList = [
    { id: 'website', label: 'Website Homepage', icon: Monitor },
    { id: 'appicon', label: 'Mobile App Icon', icon: Smartphone },
    { id: 'social', label: 'Social Media Kit', icon: Share2 },
    { id: 'slides', label: 'Workshop Slides', icon: Presentation },
    { id: 'apparel', label: 'T-Shirt & Lanyard', icon: Shirt },
    { id: 'flyer', label: 'Community Flyer (B&W)', icon: FileText },
    { id: 'certificate', label: 'Certificate of Completion', icon: Award },
    { id: 'email', label: 'Email Signature', icon: Mail },
    { id: 'banner', label: 'Event Pull-Up Banner', icon: Flag },
    { id: 'sticker', label: 'Enamel Pin & Sticker', icon: Tag },
  ];

  const slidesData = [
    {
      title: 'Make AI an open door, not a locked lab.',
      subtitle: 'Free Community Workshop Series · Session 1',
      bullets: [
        'What AI actually is (and what it isn’t)',
        'How plain English prompts create real tools',
        'Protecting your privacy and family information',
      ],
      footnote: 'Human First AI Global Movement · Session 01',
    },
    {
      title: 'AI is a bicycle for the mind, not an artificial brain.',
      subtitle: 'Understanding the Tool in Real Life',
      bullets: [
        'It cannot think, feel, or make moral choices',
        'It is a pattern tool that summarizes and organizes',
        'Human judgment always drives the final decision',
      ],
      footnote: 'Human First AI · Module: Grounded Concepts',
    },
    {
      title: 'Practice: 3 Everyday Prompts for Your Family & Work',
      subtitle: 'Hands-on Practice with Volunteer Mentors',
      bullets: [
        'Prompt 1: Drafting an official letter to local council',
        'Prompt 2: Calculating market crop pricing and storage',
        'Prompt 3: Summarizing complex health and medicine leaflets',
      ],
      footnote: 'Human First AI · Hands-on Exercise 1.3',
    },
  ];

  const handleCopyEmail = () => {
    const text = `Elena Rostova | Volunteer Educator
Human First AI — Global Movement
Making AI accessible to all.
Website: humanfirst.ai | Chapter: Lima, Peru`;
    navigator.clipboard.writeText(text);
    setCopiedSignature(true);
    setTimeout(() => setCopiedSignature(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* HEADER & APPLICATION SELECTOR */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F2A44]/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
              Brand Applications Studio
            </span>
            <h3 className="text-2xl font-brand font-bold text-[#1F2A44] mt-1">
              Ten Real-World Brand Touchpoints
            </h3>
            <p className="text-sm text-[#1F2A44]/70 mt-1 max-w-2xl">
              From physical community flyers printed on cheap copiers to high-visibility websites, certificates, and event merchandise.
            </p>
          </div>
        </div>

        {/* Mockup Tab Ribbon */}
        <div className="flex flex-wrap gap-2 mt-6">
          {mockupsList.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMockup === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMockup(m.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F2A44] text-white shadow-xs font-semibold ring-2 ring-[#FF8A3D]/40'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MOCKUP DISPLAY STAGE */}
      <div className="bg-white border border-[#1F2A44]/10 rounded-2xl p-6 lg:p-8 shadow-xs min-h-[500px]">
        {/* 1. WEBSITE HOMEPAGE MOCKUP */}
        {selectedMockup === 'website' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
              <span>Application 01 · Responsive Web Interface</span>
              <span>Desktop baseline: 1440px contract</span>
            </div>

            {/* Browser Chrome Container */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-md bg-white">
              {/* Browser Bar */}
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-white px-3 py-1 rounded text-[11px] font-mono text-slate-600 border border-slate-200 text-center">
                  https://humanfirst.ai
                </div>
              </div>

              {/* Website Content */}
              <div className="bg-[#FFF6EC]/40">
                {/* 3-Zone Top Bar Contract */}
                <header className="flex items-center justify-between gap-8 px-8 py-5 border-b border-[#1F2A44]/10 bg-white">
                  <a href="#" className="flex items-center gap-2">
                    <LogoMark route="open-door" lockup="horizontal" size={32} colorScheme="full" />
                  </a>
                  <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#1F2A44]">
                    <a href="#" className="hover:text-[#FF8A3D] transition-colors">Our Mission</a>
                    <a href="#" className="hover:text-[#FF8A3D] transition-colors">Free Workshops</a>
                    <a href="#" className="hover:text-[#FF8A3D] transition-colors">Curriculum</a>
                    <a href="#" className="hover:text-[#FF8A3D] transition-colors">Chapters</a>
                  </nav>
                  <div>
                    <button className="px-4 py-2 text-xs font-semibold text-white bg-[#1F2A44] hover:bg-[#1F2A44]/90 rounded-lg">
                      Find a Workshop
                    </button>
                  </div>
                </header>

                {/* Hero Section */}
                <div className="p-8 lg:p-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#187F72] font-bold">
                      Global Movement For Everyone
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-brand font-bold text-[#1F2A44] leading-tight">
                      Make AI feel like an open door, not a locked lab.
                    </h1>
                    <p className="text-sm font-readable text-slate-700 leading-relaxed">
                      Free, friendly hands-on workshops in your neighborhood library or community center. Learn practical AI in plain language with trusted volunteer mentors.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button className="px-5 py-2.5 bg-[#FF8A3D] hover:bg-[#FF8A3D]/90 text-[#1F2A44] text-xs font-bold rounded-lg shadow-xs">
                        Join Free Workshop
                      </button>
                      <button className="px-5 py-2.5 border border-[#1F2A44]/30 hover:bg-white text-[#1F2A44] text-xs font-semibold rounded-lg">
                        Download Starter Kit
                      </button>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                    <img
                      src={IMAGES.hall}
                      alt="Diverse community members learning in an open workshop hall"
                      className="w-full h-72 object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                      <p className="text-xs font-medium">Workshop in Session · Nairobi Community Chapter</p>
                      <p className="text-[10px] text-slate-300">All ages, all backgrounds, zero fees.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MOBILE APP ICON */}
        {selectedMockup === 'appicon' && (
          <div className="space-y-4 max-w-xl mx-auto text-center">
            <div className="pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
              Application 02 · iOS & Android App Store Grid System
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-8">
              {/* Dark App Icon (Squircle) */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-[28px] bg-[#1F2A44] shadow-xl border border-white/20 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <LogoMark route="open-door" lockup="symbol" size={68} colorScheme="white" />
                </div>
                <span className="text-xs font-brand font-bold text-[#1F2A44]">Primary Ink Squircle</span>
                <span className="text-[11px] text-slate-500 font-mono">180×180px Retina</span>
              </div>

              {/* Light App Icon (Squircle) */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-[28px] bg-[#FFF6EC] shadow-xl border border-slate-300 flex items-center justify-center relative overflow-hidden">
                  <LogoMark route="open-door" lockup="symbol" size={68} colorScheme="full" />
                </div>
                <span className="text-xs font-brand font-bold text-[#1F2A44]">Warm Cream Squircle</span>
                <span className="text-[11px] text-slate-500 font-mono">Adaptive Android</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto font-readable">
              No text inside the symbol allows the app icon to sit comfortably on smartphones across Tokyo, Cairo, or São Paulo without localization friction.
            </p>
          </div>
        )}

        {/* 3. SOCIAL MEDIA TEMPLATES */}
        {selectedMockup === 'social' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono flex justify-between">
              <span>Application 03 · Multi-Platform Social Media Templates</span>
              <span>Instagram (1:1) · WhatsApp Card · LinkedIn</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Instagram Square (1:1) */}
              <div className="aspect-square bg-[#1F2A44] text-white p-6 rounded-2xl flex flex-col justify-between shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <LogoMark route="open-door" lockup="horizontal" size={26} colorScheme="white" />
                  <span className="text-[10px] font-mono text-[#FF8A3D] font-bold uppercase tracking-wider">
                    Tip 01
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-brand font-bold leading-tight">
                    &quot;Explain this crop disease like I am a 12-year-old.&quot;
                  </h4>
                  <p className="text-xs text-slate-300 font-readable">
                    How adding five simple words transforms confusing AI output into plain, actionable advice.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Swipe for practical examples →</span>
                  <span className="font-mono">@HumanFirstAI</span>
                </div>
              </div>

              {/* LinkedIn Thought Leadership */}
              <div className="aspect-square bg-white text-[#1F2A44] p-6 rounded-2xl flex flex-col justify-between shadow-md border border-slate-200">
                <div className="flex justify-between items-center">
                  <LogoMark route="open-door" lockup="descriptor" size={28} colorScheme="full" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#187F72] font-bold">Policy & Workforce</span>
                  <h4 className="text-lg font-brand font-bold leading-snug">
                    Why tech literacy must precede regulatory frameworks.
                  </h4>
                  <p className="text-xs text-slate-600 font-readable">
                    Research from 38 grassroots community chapters on what frontline workers actually need.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Read 4-min Policy Brief</span>
                  <span className="font-bold text-[#FF8A3D]">humanfirst.ai/policy</span>
                </div>
              </div>

              {/* WhatsApp Community Card */}
              <div className="aspect-square bg-[#FFF6EC] text-[#1F2A44] p-6 rounded-2xl flex flex-col justify-between shadow-md border border-[#FF8A3D]/30">
                <div className="flex items-center gap-2">
                  <LogoMark route="open-door" lockup="chapter" chapterName="Lagos" size={26} colorScheme="full" />
                </div>

                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-[#FF8A3D] uppercase">Saturday Free Workshop</div>
                  <h5 className="text-sm font-bold font-brand">AI for Market Traders & Artisans</h5>
                  <p className="text-[11px] text-slate-600">
                    Bring your smartphone! Free tea & snacks provided. 10:00 AM at City Library.
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 text-center font-semibold">
                  Share this invite to your WhatsApp family group
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. WORKSHOP SLIDE DECK */}
        {selectedMockup === 'slides' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
              <span>Application 04 · 16:9 Workshop Presentation Deck</span>
              <span>Slide {slideIndex + 1} of {slidesData.length}</span>
            </div>

            {/* 16:9 Presentation Frame */}
            <div className="aspect-video bg-[#1F2A44] text-white p-8 lg:p-12 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden border border-slate-700">
              {/* Slide Header */}
              <div className="flex justify-between items-center">
                <LogoMark route="open-door" lockup="horizontal" size={32} colorScheme="white" />
                <span className="text-xs font-mono text-[#7CC4F2]">{slidesData[slideIndex].footnote}</span>
              </div>

              {/* Slide Body */}
              <div className="space-y-4 max-w-2xl my-auto">
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A3D] font-bold">
                  {slidesData[slideIndex].subtitle}
                </span>
                <h3 className="text-2xl lg:text-4xl font-brand font-bold leading-tight text-[#FFF6EC]">
                  {slidesData[slideIndex].title}
                </h3>
                <ul className="space-y-2.5 pt-2">
                  {slidesData[slideIndex].bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm lg:text-base text-slate-200 font-readable">
                      <span className="w-2 h-2 rounded-full bg-[#187F72]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Slide Footer */}
              <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-white/10">
                <span>Free Open-Source Curriculum</span>
                <span>CC BY-NC 4.0 Human First AI</span>
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                disabled={slideIndex === 0}
                onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-semibold rounded-lg cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Slide
              </button>
              <button
                disabled={slideIndex === slidesData.length - 1}
                onClick={() => setSlideIndex((prev) => Math.min(slidesData.length - 1, prev + 1))}
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#1F2A44] hover:bg-[#1F2A44]/90 text-white disabled:opacity-40 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Next Slide <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 5. VOLUNTEER T-SHIRT & LANYARD BADGE */}
        {selectedMockup === 'apparel' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
              Application 05 · Volunteer Apparel & Approchable Identity
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* T-Shirt Mockup */}
              <div className="p-8 bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200">
                <span className="text-xs font-mono text-slate-500 mb-4">Front & Back Volunteer Uniform</span>
                <div className="w-64 h-64 bg-[#1F2A44] rounded-t-3xl rounded-b-xl shadow-lg relative p-6 flex flex-col justify-between text-white border border-slate-700">
                  {/* Crewneck cutout */}
                  <div className="w-20 h-8 rounded-b-full bg-slate-100 absolute top-0 left-1/2 -translate-x-1/2 border-b-2 border-slate-300" />

                  {/* Left Chest Pocket Logo */}
                  <div className="mt-8 self-start">
                    <LogoMark route="open-door" lockup="horizontal" size={24} colorScheme="white" />
                  </div>

                  {/* Back Slogan Print */}
                  <div className="text-center space-y-1 mb-4">
                    <p className="text-xs font-brand font-bold text-[#FF8A3D] uppercase tracking-wide">
                      Volunteer Educator
                    </p>
                    <p className="text-sm font-brand font-semibold text-white">
                      Ask me anything about AI.<br />We will figure it out together.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lanyard & Badge Mockup */}
              <div className="p-8 bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200">
                <span className="text-xs font-mono text-slate-500 mb-4">Volunteer Identification Badge</span>
                <div className="flex flex-col items-center">
                  {/* Lanyard Strap */}
                  <div className="w-8 h-20 bg-[#187F72] flex items-center justify-center text-white text-[9px] font-mono tracking-widest font-bold rotate-180 uppercase [writing-mode:vertical-rl]">
                    HUMAN FIRST AI
                  </div>
                  <div className="w-4 h-3 bg-slate-400 rounded-b" />

                  {/* Plastic Badge Holder */}
                  <div className="w-56 bg-white border border-slate-300 rounded-xl p-5 shadow-lg text-center space-y-3 -mt-1">
                    <LogoMark route="open-door" lockup="chapter" chapterName="Nairobi Chapter" size={26} colorScheme="full" />
                    <div className="w-16 h-16 rounded-full bg-[#FFF6EC] border-2 border-[#FF8A3D] mx-auto flex items-center justify-center text-xl font-bold text-[#1F2A44]">
                      AO
                    </div>
                    <div>
                      <h4 className="font-brand font-bold text-base text-[#1F2A44]">Amara Okafor</h4>
                      <p className="text-xs text-[#187F72] font-medium">Community Educator</p>
                      <p className="text-[10px] text-slate-500 mt-1">Languages: English · Swahili · Yoruba</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[9px] font-mono text-slate-400">
                      ID: HFAI-2026-0842 · Verified Mentor
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. COMMUNITY FLYER (COLOR AND PHOTOCOPY TEST) */}
        {selectedMockup === 'flyer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-mono">Application 06 · Grassroots Community Flyer</span>
                <h4 className="font-brand font-bold text-lg text-[#1F2A44]">
                  {flyerMode === 'photocopy' ? 'B&W Photocopy Stress-Test' : 'Full-Color Print Version'}
                </h4>
              </div>

              {/* Mode Toggle Button */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setFlyerMode('photocopy')}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    flyerMode === 'photocopy'
                      ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Photocopied B&W (Cheap Toner)
                </button>
                <button
                  onClick={() => setFlyerMode('color')}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    flyerMode === 'color'
                      ? 'bg-white text-[#1F2A44] shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full Color Original
                </button>
              </div>
            </div>

            {/* Flyer Simulation Container */}
            <div
              className={`max-w-xl mx-auto p-8 rounded-xl shadow-xl transition-all border ${
                flyerMode === 'photocopy'
                  ? 'bg-[#F3EFE7] border-neutral-400 contrast-150 grayscale'
                  : 'bg-[#FFF6EC] border-[#FF8A3D]/40'
              }`}
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
                <LogoMark
                  route="open-door"
                  lockup="horizontal"
                  size={36}
                  colorScheme={flyerMode === 'photocopy' ? 'black' : 'full'}
                />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  100% Free Workshop
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-brand font-bold text-black leading-tight">
                  Curious about AI?<br />Join your neighbors this Saturday.
                </h2>

                <p className="text-sm font-readable leading-relaxed text-black/90">
                  You do not need a computer science degree, expensive equipment, or high-tech experience. We provide the tablets, friendly volunteer teachers, and tea.
                </p>

                {/* High Contrast Boxed Info */}
                <div className="p-4 bg-white border-2 border-black rounded-lg space-y-1.5 text-xs font-bold text-black">
                  <div className="flex justify-between">
                    <span>DATE: Saturday, November 7</span>
                    <span>TIME: 10:00 AM – 12:30 PM</span>
                  </div>
                  <div>LOCATION: St. Jude Community Library · Room 4</div>
                  <div>COST: FREE · All ages welcome (Bring a friend!)</div>
                </div>

                <div className="space-y-1 text-xs text-black/80 font-readable">
                  <p className="font-bold">What we will learn in 2 hours:</p>
                  <p>• What AI really is (and what it isn&apos;t, in simple words)</p>
                  <p>• Writing clearer resumes, market signs, and official letters</p>
                  <p>• Keeping your family&apos;s personal information safe online</p>
                </div>

                {/* Tear-off slip preview */}
                <div className="pt-6 mt-6 border-t-2 border-dashed border-black/60 flex justify-between text-[11px] font-mono text-center">
                  <div className="p-1 border border-black/40">AI WORKSHOP<br />Nov 7 · 10AM<br />0712-345-678</div>
                  <div className="p-1 border border-black/40">AI WORKSHOP<br />Nov 7 · 10AM<br />0712-345-678</div>
                  <div className="p-1 border border-black/40">AI WORKSHOP<br />Nov 7 · 10AM<br />0712-345-678</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. CERTIFICATE OF COMPLETION */}
        {selectedMockup === 'certificate' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-mono">Application 07 · Learner Recognition</span>
                <h4 className="font-brand font-bold text-lg text-[#1F2A44]">
                  Certificate of Technology Literacy & Completion
                </h4>
              </div>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 text-xs font-semibold rounded-lg cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save Certificate
              </button>
            </div>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Learner Full Name:</label>
                <input
                  type="text"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-[#1F2A44]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Curriculum Completed:</label>
                <input
                  type="text"
                  value={certCourse}
                  onChange={(e) => setCertCourse(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-[#1F2A44]"
                />
              </div>
            </div>

            {/* Dignified Frame-Ready Certificate */}
            <div className="p-8 sm:p-12 bg-[#FFF6EC] border-8 border-double border-[#1F2A44] rounded-2xl shadow-xl text-center space-y-6 max-w-3xl mx-auto relative">
              <div className="flex justify-center">
                <LogoMark route="open-door" lockup="horizontal" size={44} colorScheme="full" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D] font-bold">
                  Certificate of Achievement
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif text-[#1F2A44] font-bold">
                  {certName}
                </h3>
                <p className="text-xs text-slate-600 font-readable max-w-lg mx-auto">
                  Has successfully completed the hands-on curriculum in plain-language practical artificial intelligence and community digital empowerment.
                </p>
                <div className="text-sm font-brand font-bold text-[#187F72]">
                  &quot;{certCourse}&quot;
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 border-t border-[#1F2A44]/20 flex justify-between items-end text-xs text-[#1F2A44]">
                <div className="text-left">
                  <div className="font-serif italic text-base border-b border-slate-400 pb-1">Dr. Kofi Mensah</div>
                  <div className="text-[10px] text-slate-500 font-mono">Volunteer Chapter Lead</div>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#FF8A3D] flex items-center justify-center bg-white shadow-2xs">
                  <div className="text-[9px] font-bold text-[#FF8A3D] font-mono text-center">
                    VERIFIED<br />CREDENTIAL
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base border-b border-slate-400 pb-1">Sarah Jenkins</div>
                  <div className="text-[10px] text-slate-500 font-mono">Global Movement Director</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. PROFESSIONAL EMAIL SIGNATURE */}
        {selectedMockup === 'email' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
              <span>Application 08 · Standardized Email Signature</span>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 text-[#FF8A3D] font-bold hover:underline cursor-pointer"
              >
                {copiedSignature ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSignature ? 'Copied' : 'Copy HTML Signature'}
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 font-readable">
              <p className="text-sm text-slate-600">
                Hi Maria,<br /><br />
                Thank you so much for offering to host our weekend workshop at the central branch. We have confirmed 30 tablets and three volunteer educators.<br /><br />
                Warm regards,
              </p>

              {/* The Signature */}
              <div className="pt-4 border-t border-slate-300 flex items-start gap-4">
                <LogoMark route="open-door" lockup="symbol" size={36} colorScheme="full" />
                <div className="text-xs space-y-0.5">
                  <div className="font-brand font-bold text-[#1F2A44] text-sm">Elena Rostova</div>
                  <div className="text-slate-600">Volunteer Community Lead · Lima Chapter</div>
                  <div className="font-semibold text-[#FF8A3D]">Human First AI</div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Web: <a href="#" className="underline text-[#187F72]">humanfirst.ai</a> · Making AI feel like an open door.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. EVENT PULL-UP BANNER */}
        {selectedMockup === 'banner' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
              Application 09 · 2m × 0.85m Roll-up Event Banner
            </div>

            <div className="flex justify-center py-4">
              <div className="w-64 h-[520px] bg-[#1F2A44] text-white rounded-t-xl shadow-2xl p-6 flex flex-col justify-between border-4 border-slate-300 relative">
                {/* Top Lockup */}
                <div className="space-y-2">
                  <LogoMark route="open-door" lockup="horizontal" size={28} colorScheme="white" />
                  <div className="h-1 w-12 bg-[#FF8A3D] rounded-full" />
                </div>

                {/* Center Slogan */}
                <div className="space-y-4 my-auto">
                  <h3 className="text-2xl font-brand font-bold leading-tight text-[#FFF6EC]">
                    The future belongs to all of us.
                  </h3>
                  <p className="text-xs font-readable text-slate-300 leading-relaxed">
                    Free AI workshops in plain language. No jargon. No fees.
                  </p>
                  <div className="p-3 bg-white/10 rounded-lg text-[11px] space-y-1">
                    <div className="font-bold text-[#FF8A3D]">JOIN TODAY:</div>
                    <div>• Weekly Community Labs</div>
                    <div>• Small Business Coaching</div>
                    <div>• Volunteer Mentorship</div>
                  </div>
                </div>

                {/* Bottom QR and URL */}
                <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                  <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-black border-dashed flex items-center justify-center text-[8px] font-mono text-black font-bold">
                      QR CODE
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-300">
                    <div className="font-bold text-white">humanfirst.ai</div>
                    <div>Free curriculum</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. ENAMEL PIN & DIE-CUT STICKER */}
        {selectedMockup === 'sticker' && (
          <div className="space-y-6 text-center">
            <div className="pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
              Application 10 · Tactile Merchandise & Stickers
            </div>

            <div className="flex flex-wrap items-center justify-center gap-12 py-8">
              {/* Die-Cut Enamel Pin */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-700 via-amber-400 to-amber-200 p-1 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#1F2A44] flex items-center justify-center border-2 border-amber-300">
                    <LogoMark route="open-door" lockup="symbol" size={54} colorScheme="sunrise" />
                  </div>
                </div>
                <span className="font-brand font-bold text-xs text-[#1F2A44]">Polished Brass Enamel Pin</span>
                <span className="text-[11px] text-slate-500 font-mono">30mm Die-Cut Badge</span>
              </div>

              {/* Laptop Sticker */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-36 h-36 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 flex flex-col items-center justify-center rotate-3 hover:rotate-0 transition-transform">
                  <LogoMark route="open-door" lockup="stacked" size={42} colorScheme="full" />
                </div>
                <span className="font-brand font-bold text-xs text-[#1F2A44]">Vinyl Matte Laptop Sticker</span>
                <span className="text-[11px] text-slate-500 font-mono">UV-Resistant Die-Cut</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
