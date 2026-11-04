import { BrandColor, ContrastPair, ConceptRouteData, TypeLevel, GuidelinesPage, BrandIcon } from '../types/brand';

export const BRAND_NAME = "Human First AI";
export const BRAND_ONE_LINER = "Make AI feel like an open door, not a locked lab.";
export const BRAND_PROMISE = "The future belongs to all of us.";
export const BRAND_CORE_IDEA = "AI for everyone. Opportunity for all.";

export const IMAGES = {
  workshop: "/src/assets/images/community_workshop_learning_1793268558159.jpg",
  farmer: "/src/assets/images/farmer_market_tablet_ai_1793268559656.jpg",
  artisan: "/src/assets/images/artisan_workshop_learning_1793268559990.jpg",
  hall: "/src/assets/images/community_gathering_hall_1793268560474.jpg",
};

export const NAMING_DECISION = {
  chosen: "Human First AI",
  rejected: "Human-First AI",
  rationale: "We deliberately omit the hyphen. When unhyphenated, 'Human' functions as an independent, sovereign noun asserting priority — declaring that people stand first in every equation. A hyphen ('Human-First') turns 'Human-First' into a compound adjective modifying AI, which grammatically subordinates humanity to the machine and echoes dry corporate engineering jargon (like 'Cloud-First' or 'Mobile-First'). Furthermore, in global translations across Romance, African, and South Asian languages, unhyphenated phrasing translates naturally with emotional warmth rather than technical stiffness.",
  hierarchyRule: "In all lockups 'Human' is set ExtraBold (800) and leads. 'First' is Medium (500). 'AI' is Bold (700) at 0.84 cap height. All three are Deep Ink — never Sunrise, which measures 2.19:1 on cream.",
  secondaryDescriptor: "Global",
  chapterFormula: "Human First AI | [City / Region]",
};

export const CONCEPT_ROUTES: ConceptRouteData[] = [
  {
    id: "open-door",
    name: "Route 1: The Open Door",
    tagline: "The Architectural Threshold of Opportunity",
    isRecommended: true,
    rationale: "The Open Door translates the core brief into pure, unmistakable geometry. An archway framing a swinging portal casts a warm beam of light forward, transforming technology from an intimidating locked laboratory into an inviting public space. Because doorways are universally understood across every culture from Lima to Lahore, this mark communicates hospitality and access without relying on any text or regional idioms.",
    symbolsDescription: "A minimalist archway with an open portal rotated outward at a welcoming 30° angle, casting a warm sunrise-colored trapezoidal beam of light across the threshold.",
    howItConveysValues: {
      inclusion: "An open door is the ultimate physical invitation — it says 'come inside, you belong here, there are no guards or entry fees.'",
      hope: "The beam of warm light emerging through the opening signals dawn, knowledge, and shared economic possibility.",
      humanAgency: "A door is crossed by people under their own power; it implies active entry and human control over what enters our lives."
    }
  },
  {
    id: "many-as-one",
    name: "Route 2: Many as One",
    tagline: "Grassroots Convergence & Collective Movement",
    isRecommended: false,
    rationale: "Many as One builds a harmonious circle from diverse, humanist arcs and nodes that gather toward a shared center. It captures the spirit of community action, mutual teaching, and collective dignity, reminding us that AI is shaped by billions of human lives, not a handful of engineers in Silicon Valley.",
    symbolsDescription: "Three organic, warm-toned arcs of varying proportions converging in dynamic rotational balance to create an open central aperture.",
    howItConveysValues: {
      inclusion: "Represents people of every background, age, and continent sitting together in an open circle of learning.",
      hope: "Dynamic circular momentum conveys an unstoppable community movement lifting everyone up.",
      humanAgency: "The mark is visibly composed of people-led components; remove the human elements and the structure dissolves."
    }
  },
  {
    id: "monogram",
    name: "Route 3: Human-Led Monogram",
    tagline: "The Human Keystone Bridging Technology",
    isRecommended: false,
    rationale: "The Human-Led Monogram reclaims the letter 'H' by placing a dignified human silhouette directly at the bridging keystone between two structural pillars. It provides immediate typographic recognition while stating unequivocally that human judgment bridges the gap between technology and society.",
    symbolsDescription: "A humanist letterform 'H' where the horizontal crossbar rises into a gentle arch sheltering an abstract human figure with open arms.",
    howItConveysValues: {
      inclusion: "The human figure stands at the center of the architecture, accessible and grounded.",
      hope: "The arched bridge creates a sheltering canopy that protects community welfare.",
      humanAgency: "People are not the byproduct of tech; the human is the essential keystone holding the entire system together."
    }
  },
  {
    id: "shared-dawn",
    name: "Route 4: The Shared Dawn",
    tagline: "The Horizon of Universal Opportunity",
    isRecommended: false,
    rationale: "The Shared Dawn couples an open ground horizon with an ascending sun composed of radiant humanist facets. It directly mirrors the emotional shift from darkness and fear into warmth, confidence, and mutual awakening.",
    symbolsDescription: "A geometric semi-circle sunrise cresting a level baseline, segmented into three warm tonal bands resembling an open fan or stadium.",
    howItConveysValues: {
      inclusion: "The sun shines equally upon every field, city, and continent without discrimination.",
      hope: "Sunrise is humanity's oldest, most universal symbol of renewal, clean slates, and optimistic beginnings.",
      humanAgency: "A new day represents people waking up with the agency and tools to cultivate their own future."
    }
  }
];

export const BRAND_COLORS: BrandColor[] = [
  {
    name: "Warm Cream",
    role: "Primary Canvas (60%)",
    hex: "#FFF6EC",
    rgb: "255, 246, 236",
    cmyk: "0, 4, 7, 0",
    pantone: "Nearest PANTONE 9226 C — proof before press",
    textColor: "#1F2A44",
    percentage: 60,
    description: "The tactile warmth of uncoated paper, morning sunlight, and domestic comfort. Replaces sterile tech white with human hospitality.",
    culturalNote: "Universally soothing; signifies hospitality, nourishment, and natural parchment across all cultures."
  },
  {
    name: "Deep Ink",
    role: "Structure & Text (25%)",
    hex: "#1F2A44",
    rgb: "31, 42, 68",
    cmyk: "85, 75, 40, 40",
    pantone: "Nearest PANTONE 533 C — proof before press",
    textColor: "#FFFFFF",
    percentage: 25,
    description: "Grounded, editorial ink blue. Imparts institutional trust, legal credibility, and optical legibility without harsh pitch black.",
    culturalNote: "Carries high esteem in both global South and North; associated with official charters, education, and deep integrity."
  },
  {
    name: "Sunrise",
    role: "Hope & Primary Accent (8%)",
    hex: "#FF8A3D",
    rgb: "255, 138, 61",
    cmyk: "0, 55, 80, 0",
    pantone: "Nearest PANTONE 1575 C — proof before press",
    textColor: "#1F2A44",
    percentage: 8,
    description: "Our signature pulse of hope. FILL ONLY — 2.19:1 on cream, so it never carries type, a hairline or an icon stroke on a light surface. Use Sunrise Deep #C24D00 for that.",
    culturalNote: "Revered in South Asia (saffron / dawn), West Africa (earth harvest), and Latin America (warm solar vitality)."
  },
  {
    name: "Community Teal",
    role: "Growth & Stability (5%)",
    hex: "#187F72",
    rgb: "24, 127, 114",
    cmyk: "84, 26, 57, 10",
    pantone: "Nearest PANTONE 7723 C — proof before press",
    textColor: "#FFFFFF",
    percentage: 5,
    description: "Earthy mineral green-blue for community stewardship. Darkened from #1A8C7E in v2 so it clears 4.5:1 both as text on cream and as a fill under white text.",
    culturalNote: "Associated with healing, water, and flourishing communal growth across the Middle East, Asia, and the Americas."
  },
  {
    name: "Sky",
    role: "Openness & Clarity (2%)",
    hex: "#7CC4F2",
    rgb: "124, 196, 242",
    cmyk: "48, 12, 0, 0",
    pantone: "Pantone 2915 C",
    textColor: "#1F2A44",
    percentage: 2,
    description: "A breath of expansive fresh air. Used for secondary illustrations, chart accents, and quiet container fills.",
    culturalNote: "Symbol of boundless horizons, peace, and unclouded clarity."
  }
];

export const WCAG_CONTRAST_MATRIX: ContrastPair[] = [
  {
    fgName: "Deep Ink",
    bgName: "Warm Cream",
    fgHex: "#1F2A44",
    bgHex: "#FFF6EC",
    ratio: 13.34,
    status: "AAA",
    isApproved: true,
    notes: "Default primary body pairing. Measured, not estimated. Surpasses WCAG 2.2 AAA at all sizes."
  },
  {
    fgName: "Deep Ink",
    bgName: "Pure White",
    fgHex: "#1F2A44",
    bgHex: "#FFFFFF",
    ratio: 14.26,
    status: "AAA",
    isApproved: true,
    notes: "Approved for high-contrast print, certificates, and official documents."
  },
  {
    fgName: "Warm Cream",
    bgName: "Deep Ink",
    fgHex: "#FFF6EC",
    bgHex: "#1F2A44",
    ratio: 13.34,
    status: "AAA",
    isApproved: true,
    notes: "Approved for dark-mode cards, presentation slides, and footer surfaces."
  },
  {
    fgName: "Pure White",
    bgName: "Community Teal",
    fgHex: "#FFFFFF",
    bgHex: "#187F72",
    ratio: 4.86,
    status: "AA",
    isApproved: true,
    notes: "Approved for buttons and badges. v1 claimed 4.88 for the old #1A8C7E, which actually measured 4.12 and failed AA; the teal was darkened to #187F72 to clear it."
  },
  {
    fgName: "Deep Ink",
    bgName: "Sunrise",
    fgHex: "#1F2A44",
    bgHex: "#FF8A3D",
    ratio: 6.08,
    status: "AA",
    isApproved: true,
    notes: "The only text permitted on a Sunrise fill. AA, not AAA — v1 claimed 7.15."
  },
  {
    fgName: "Pure White",
    bgName: "Sunrise",
    fgHex: "#FFFFFF",
    bgHex: "#FF8A3D",
    ratio: 2.35,
    status: "Fail",
    isApproved: false,
    notes: "FORBIDDEN: Insufficient contrast. White text on Sunrise is strictly prohibited."
  },
  {
    fgName: "Sky",
    bgName: "Warm Cream",
    fgHex: "#7CC4F2",
    bgHex: "#FFF6EC",
    ratio: 1.78,
    status: "Fail",
    isApproved: false,
    notes: "FORBIDDEN: Text illegible. Sky is only approved as a background or graphic accent."
  },
  {
    fgName: "Community Teal",
    bgName: "Warm Cream",
    fgHex: "#187F72",
    bgHex: "#FFF6EC",
    ratio: 4.55,
    status: "AA",
    isApproved: true,
    notes: "Approved for section kickers, subheadings and icons. v1 claimed 4.62 for #1A8C7E, which measured 3.85 and failed AA."
  }
];

export const TYPOGRAPHY_SCALE: TypeLevel[] = [
  {
    name: "Display",
    role: "Hero Posters, Billboards, Campaign Headers",
    size: "3.25rem (52px)",
    fontSizePx: 52,
    lineHeight: "1.15",
    tracking: "-0.025em",
    weight: "Bold 700",
    sampleText: "The future belongs to all of us.",
    usageRules: "Use sparingly. Max 2 lines. Always balance line wraps. Never set in ALL CAPS."
  },
  {
    name: "Headline",
    role: "Major Section Titles, Booklet Covers, Slide Openers",
    size: "2.125rem (34px)",
    fontSizePx: 34,
    lineHeight: "1.25",
    tracking: "-0.015em",
    weight: "SemiBold 600",
    sampleText: "Make AI feel like an open door, not a locked lab.",
    usageRules: "Set in Deep Ink. Optical kerning enabled. Clear 2rem breathing space above."
  },
  {
    name: "Subhead",
    role: "Lead Paragraphs, Key Takeaways, Card Titles",
    size: "1.375rem (22px)",
    fontSizePx: 22,
    lineHeight: "1.4",
    tracking: "-0.01em",
    weight: "Medium 500",
    sampleText: "Free workshops in your neighborhood, taught in your language.",
    usageRules: "Introduces long-form sections. Generous spacing below before body paragraphs."
  },
  {
    name: "Body",
    role: "Curriculum text, Handouts, Web Articles, Letters",
    size: "1.0625rem (17px)",
    fontSizePx: 17,
    lineHeight: "1.65",
    tracking: "0em",
    weight: "Regular 400",
    sampleText: "Artificial intelligence should be as simple and dependable as electricity. You do not need a computer science degree to use it to run your market stall, protect your crops from drought, or support your children's homework.",
    usageRules: "Optimal reading measure: 60-70 characters per line. Never justify text. Atkinson Hyperlegible preferred for accessibility."
  },
  {
    name: "Caption / Metadata",
    role: "Photo credits, Timestamps, Table headers, Chapter tags",
    size: "0.8125rem (13px)",
    fontSizePx: 13,
    lineHeight: "1.4",
    tracking: "+0.02em",
    weight: "SemiBold 600",
    sampleText: "KIBERA COMMUNITY CENTER · NAIROBI CHAPTER · 14 MARCH 2026",
    usageRules: "Clean unboxed text separated by middots (·). Never enclose in static pill enclosures."
  }
];

export const MULTILINGUAL_SAMPLES = [
  {
    lang: "English",
    nativeName: "English",
    headline: "Make AI feel like an open door.",
    body: "The future belongs to all of us. Free workshops, plain language, and tools for real life.",
    script: "Latin",
    fontFamily: "Plus Jakarta Sans",
    isRtl: false
  },
  {
    lang: "Spanish",
    nativeName: "Español",
    headline: "Hacer de la IA una puerta abierta.",
    body: "El futuro nos pertenece a todos. Talleres gratuitos, lenguaje sencillo y herramientas para la vida real.",
    script: "Latin Extended",
    fontFamily: "Plus Jakarta Sans",
    isRtl: false
  },
  {
    lang: "Arabic",
    nativeName: "العربية",
    headline: "لنجعل الذكاء الاصطناعي باباً مفتوحاً للجميع.",
    body: "المستقبل ملكٌ لنا جميعاً. ورش عمل مجانية، لغة مبسطة وأدوات تفيد الحياة اليومية.",
    script: "Arabic (RTL)",
    fontFamily: "Noto Sans Arabic",
    isRtl: true
  },
  {
    lang: "Hindi",
    nativeName: "हिन्दी",
    headline: "एआई को एक बंद प्रयोगशाला नहीं, खुला दरवाज़ा बनाएं।",
    body: "भविष्य हम सभी का है। मुफ़्त कार्यशालाएं, सरल भाषा और वास्तविक जीवन के उपयोगी साधन।",
    script: "Devanagari",
    fontFamily: "Noto Sans Devanagari",
    isRtl: false
  },
  {
    lang: "Swahili",
    nativeName: "Kiswahili",
    headline: "Kufanya akili bandia iwe mlango wazi kwa kila mtu.",
    body: "Kesho ni yetu sote. Warsha za bure, lugha rahisi, na zana za maisha ya kila siku.",
    script: "Latin Extended",
    fontFamily: "Plus Jakarta Sans",
    isRtl: false
  },
  {
    lang: "Greek",
    nativeName: "Ελληνικά",
    headline: "Κάντε την τεχνητή νοημοσύνη μια ανοιχτή πόρτα.",
    body: "Το μέλλον ανήκει σε όλους μας. Δωρεάν εργαστήρια, απλή γλώσσα και εργαλεία για την καθημερινότητα.",
    script: "Greek",
    fontFamily: "Plus Jakarta Sans",
    isRtl: false
  },
  {
    lang: "Japanese",
    nativeName: "日本語",
    headline: "AIを閉ざされた研究室ではなく、誰にでも開かれた扉へ。",
    body: "未来は私たち全員のもの。地域の無料ワークショップ、平易な言葉、日々の暮らしに役立つ実践的な学び。",
    script: "CJK",
    fontFamily: "Noto Sans JP",
    isRtl: false
  }
];

export const JARGON_BUSTER_ENTRIES = [
  {
    jargon: "Leveraging multi-modal transformer heuristics for optimized agrarian workflows.",
    plainEnglish: "Using a phone camera to quickly spot plant disease and save your harvest.",
    category: "Agriculture"
  },
  {
    jargon: "Democratizing cognitive automated workflows across heterogeneous socio-demographic cohorts.",
    plainEnglish: "Free classes so everyone in our neighborhood can use computers with confidence.",
    category: "Community"
  },
  {
    jargon: "Generative synthesis of conversational copilot agents for merchant inventory management.",
    plainEnglish: "A simple chat tool that counts your stock so you know what to reorder.",
    category: "Small Business"
  },
  {
    jargon: "Algorithmic decision-support engines mitigating clinical triage friction.",
    plainEnglish: "A plain-language guide that helps local health workers organize patient checkups.",
    category: "Healthcare"
  },
  {
    jargon: "Autonomous parameter tuning for real-time pedagogical personalization.",
    plainEnglish: "Lessons that adapt to each student's pace so no child is left behind.",
    category: "Education"
  },
  {
    jargon: "Zero-shot inference pipelines providing actionable fiscal optimization.",
    plainEnglish: "A five-minute tool that organizes your household budget and explains your bills.",
    category: "Family Finance"
  }
];

export const COPY_DELIVERABLES = {
  headlines: [
    { text: "AI is a tool, not a secret club.", role: "Flyer & Poster Lead" },
    { text: "The future belongs to all of us.", role: "Global Movement Tagline" },
    { text: "No computer science degree required.", role: "Community Workshop Banner" },
    { text: "From fear to confidence, one neighborhood at a time.", role: "Annual Report Theme" },
    { text: "Technology works best when humans lead.", role: "Policy Brief Headline" }
  ],
  socialPost: {
    platform: "Instagram & LinkedIn",
    handle: "@HumanFirstAI",
    date: "Today",
    imageCaption: "Amina, 62, learning to write community news articles with AI assistance in Lagos.",
    body: "You do not need to understand algorithms to benefit from them.\n\nYesterday in Lagos, 28 grandmother traders joined our 2-hour free workshop. By the time we had lunch, each had built a digital ledger to track inventory in Yoruba and English.\n\nAI is not magic. It is not destiny. It is a tool made by people — and it must serve people first.\n\n🚪 Join our free weekend workshop at your local library. Link in bio.",
    hashtags: "#HumanFirstAI #TechForEveryone #OpenDoors #CommunityLearning #PlainEnglishAI"
  },
  workshopInvite: {
    title: "AI In Real Life: A Free Hands-on Workshop For Everyone",
    kicker: "COMMUNITY LEARNING SERIES · ALL AGES WELCOME",
    date: "Saturday, November 7 · 10:00 AM – 12:30 PM",
    location: "St. Jude Community Library · Room 4 (Wheelchair accessible)",
    cost: "100% Free · Tea, fruit, and snacks provided",
    description: "Are you curious about artificial intelligence but tired of tech jargon? Join your neighbors for a warm, friendly morning where we take the mystery out of AI.\n\nWhat you will learn:\n• What AI actually is (and what it isn't, in plain English)\n• How to write better letters, resumes, and community flyers in minutes\n• How to protect your privacy and spot fake information online\n• Practical tools to save you 2 hours every week\n\nNo experience needed. We bring the tablets, notebooks, and patient volunteers. Bring yourself and a friend!",
    rsvp: "Drop in or text your name to 0712-345-678 to reserve a seat."
  },
  volunteerCallout: {
    title: "Be the community teacher everyone trusts.",
    kicker: "VOLUNTEER EDUCATOR RECRUITMENT",
    body: "We don't need Silicon Valley evangelists. We need warm listeners, patient teachers, and curious neighbors.\n\nIf you know how to use a web browser and have an open heart, you can guide a small business owner, a grandfather, or a school student through their very first AI prompt.\n\nWe provide:\n• A complete 2-hour workshop curriculum (slide deck, paper handouts, practice prompts)\n• 1-on-1 mentorship from experienced community educators\n• Human First AI volunteer t-shirt, badge, and verified certificate\n\nTime commitment: Just 3 hours, one Saturday a month.",
    cta: "Sign up at humanfirst.ai/volunteer or talk to our chapter organizer."
  }
};

export const LOGO_MISUSE_RULES = [
  {
    id: 1,
    title: "Do not rotate the symbol",
    reason: "The arch and open door represent architectural stability and an open threshold. Tilting destroys the doorway metaphor.",
    badVisual: "rotate-45"
  },
  {
    id: 2,
    title: "Do not use tech gradients or glow",
    reason: "We strictly forbid blue-purple sci-fi gradients, neon halos, and cyber sparkles. We are human and grounded.",
    badVisual: "tech-gradient"
  },
  {
    id: 3,
    title: "Do not place text inside the mark",
    reason: "The symbol must remain culturally and linguistically neutral across Latin, Arabic, Devanagari, and CJK alphabets.",
    badVisual: "text-inside"
  },
  {
    id: 4,
    title: "Do not distort proportions",
    reason: "Never stretch, squash, or skew the horizontal or vertical aspect ratio of the archway or letterforms.",
    badVisual: "squash-skew"
  },
  {
    id: 5,
    title: "Do not enclose in pill capsules or heavy drop shadows",
    reason: "Zero-pill discipline: our mark breathes freely on clean white or warm cream backgrounds. No 3D skeuomorphic drop shadows.",
    badVisual: "pill-shadow"
  },
  {
    id: 6,
    title: "Do not place on busy photos without scrim",
    reason: "Always ensure a 4.5:1 contrast ratio. If overlaying on photography, use the solid dark or white lockup with a measured scrim.",
    badVisual: "busy-photo"
  },
  {
    id: 7,
    title: "Do not rearrange lockup elements",
    reason: "Never place 'AI' above 'Human' or separate the door symbol from the wordmark in an unapproved spatial relationship.",
    badVisual: "inverted-hierarchy"
  },
  {
    id: 8,
    title: "Do not add robot or circuit clichés",
    reason: "Strictly banned: circuit traces, glowing neural nodes, robot eyes, or digital matrix dots around the mark.",
    badVisual: "robot-circuit"
  },
  {
    id: 9,
    title: "Do not use unapproved neon colors",
    reason: "Only use Deep Ink, Sunrise, Community Teal, Sky, Warm Cream, Pure White, and Black. No hot magenta or neon green.",
    badVisual: "neon-color"
  }
];

export const BRAND_ICONS: BrandIcon[] = [
  {
    id: "open-access",
    name: "Open Access",
    concept: "Welcoming threshold without paywalls or academic gatekeeping",
    svgPath: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm8 4l-4 4 4 4",
    explanation: "Represents an unlocked doorway with arrows indicating forward entry."
  },
  {
    id: "plain-language",
    name: "Plain Language",
    concept: "Jargon-free communication at a 6th-grade reading level",
    svgPath: "M4 6h16M4 12h10M4 18h7",
    explanation: "Clean, horizontal text lines with a speech bubble tail, denoting clear speech."
  },
  {
    id: "learning-circle",
    name: "Learning Circle",
    concept: "Community members learning side by side, not top-down",
    svgPath: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-2 14l6-4-6-4v8z",
    explanation: "Harmonious circular ring with people nodes sharing an open workspace."
  },
  {
    id: "human-compass",
    name: "Human Compass",
    concept: "Human values, judgment, and ethics directing technology",
    svgPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    explanation: "A protective shield holding an upward direction needle, grounding technology in human dignity."
  },
  {
    id: "shared-tool",
    name: "Shared Tool",
    concept: "AI treated as a humble practical tool like a pen or rake",
    svgPath: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    explanation: "Simple, honest wrench/chisel icon signifying utility rather than science fiction."
  },
  {
    id: "everyday-growth",
    name: "Everyday Growth",
    concept: "Real economic and personal progress for families",
    svgPath: "M12 19V5m-7 7l7-7 7 7",
    explanation: "A clean sprout rising out of a horizontal baseline."
  },
  {
    id: "community-voice",
    name: "Community Voice",
    concept: "Decisions made by local residents, not external corporations",
    svgPath: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    explanation: "Two overlapping warm speech dialogs symbolizing dialogue between peers."
  },
  {
    id: "safe-guardrails",
    name: "Safe Guardrails",
    concept: "Privacy protection, algorithmic transparency, and bias reduction",
    svgPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
    explanation: "Checkmarked shield signifying consumer safety and personal data sovereignty."
  }
];

export const GUIDELINES_BOOK_PAGES: GuidelinesPage[] = [
  {
    pageNumber: 1,
    chapter: "Chapter 1: Brand Foundation",
    title: "Brand Story & Vision",
    subtitle: "The philosophical mandate of Human First AI",
    content: [
      "Artificial intelligence is the most powerful general-purpose technology since electricity. Yet today, it is predominantly framed as an intimidating Silicon Valley monopoly — defined by technical jargon, sci-fi hype, and existential anxiety.",
      "Human First AI was born out of an urgent, global conviction: the future of intelligence must belong to everyone. If AI only benefits those who already hold wealth, elite credentials, and advanced infrastructure, it will widen inequality.",
      "Our mission is to make AI accessible, understandable, and immediately useful to ordinary people worldwide — starting with the communities most frequently left out of tech progress."
    ],
    keyRules: [
      "Technology is never the protagonist; people are.",
      "Eliminate fear through hands-on literacy and practical utility.",
      "Measure success not by models trained, but by community confidence built."
    ],
    metrics: [
      { label: "Founded", value: "2024" },
      { label: "Chapters", value: "38 Global" },
      { label: "Community Learners", value: "140,000+" }
    ]
  },
  {
    pageNumber: 2,
    chapter: "Chapter 1: Brand Foundation",
    title: "The Four Audiences",
    subtitle: "Designing for four distinct stakeholder communities simultaneously",
    content: [
      "A global non-profit movement must speak with equal credibility to a boardroom in Zurich and equal warmth to a village community hall in Oaxaca.",
      "1. First-Time & Anxious Learners: Older adults, informal workers, migrants, and communities with limited formal schooling. Needs: radical hospitality, zero condescension, palpable safety.",
      "2. Volunteer Educators & Chapter Leads: Grassroots trainers, librarians, and tech workers donating evenings. Needs: clear teaching tools, pride of affiliation, effortless templates.",
      "3. Philanthropic & Corporate Partners: Foundations, NGOs, and ethical tech grantmakers. Needs: institutional rigor, auditable governance, brand safety.",
      "4. Policymakers & Journalists: Civil servants and public media crafting technology legislation. Needs: non-partisan evidence, human stories, plain-language policy briefs."
    ]
  },
  {
    pageNumber: 3,
    chapter: "Chapter 1: Brand Foundation",
    title: "Core Values & Promise",
    subtitle: "The four non-negotiable operational principles",
    content: [
      "Universal Dignity: Every learner enters our space as a capable human being with deep life wisdom. We never talk down, oversimplify to the point of patronizing, or treat communities as test subjects.",
      "Radical Plain Language: If a concept cannot be explained in words a 12-year-old understands, we have not understood it well enough ourselves. Jargon is an elitist gate; clarity is an open door.",
      "Community Sovereignty: Local chapters own their programming. Nairobi knows what Nairobi needs; Lima knows what Lima needs.",
      "Open Threshold: Everything we build — curriculum, software tools, brand assets — is free, open-source, and unencumbered by proprietary lock-in."
    ],
    keyRules: [
      "Our Promise: The future belongs to all of us.",
      "Our Core Idea: AI for everyone. Opportunity for all."
    ]
  },
  {
    pageNumber: 4,
    chapter: "Chapter 2: Identity & Voice",
    title: "Brand Personality & Voice Principles",
    subtitle: "Speaking like the trusted community teacher, not the Silicon Valley founder",
    content: [
      "If Human First AI were a person, they would be the beloved neighborhood teacher who explains complex ideas with a smile, tea in hand, listening twice as much as they talk.",
      "Tone Principle 1: Warm & Welcoming. We speak with open arms. We replace cold robotic distance with human care and encouraging hospitality.",
      "Tone Principle 2: Grounded & Plain. We talk about everyday realities — farming, rent, small businesses, family health. Never abstract 'synergistic paradigms'.",
      "Tone Principle 3: Quietly Confident. We do not need hype, exclamation marks, or breathless techno-utopian claims. The quiet truth speaks for itself.",
      "Tone Principle 4: Community-Anchored. We say 'we' and 'our community' rather than 'our users' or 'our platform'."
    ]
  },
  {
    pageNumber: 5,
    chapter: "Chapter 2: Identity & Voice",
    title: "Writing Do's and Don'ts",
    subtitle: "Concrete editorial guardrails for volunteers and copywriters",
    content: [
      "DO: Write short, direct sentences with active verbs. Aim for reading age 12 (Grade 6).",
      "DON'T: Use corporate buzzwords like 'disruptive paradigm', 'democratize synergy', 'deep intelligence copilot', or 'superintelligence'.",
      "DO: Describe AI by what it helps you do: 'a tool to write a clearer letter' or 'a way to check crop leaf spots'.",
      "DON'T: Describe AI as a thinking human brain, a sentient creature, or magic.",
      "DO: Celebrate the human learner: 'Elena organized her market stall accounts in 20 minutes.'",
      "DON'T: Celebrate the algorithm: 'Our multi-billion parameter model delivered superior inference.'",
      "DO: Acknowledge legitimate anxieties about jobs and privacy honestly without dismissiveness."
    ]
  },
  {
    pageNumber: 6,
    chapter: "Chapter 3: Logo Architecture",
    title: "The Recommended Symbol: The Open Door",
    subtitle: "Concept rationale, geometry, and metaphor",
    content: [
      "The official symbol for Human First AI is 'The Open Door'. It represents an architectural archway with a portal swung open at a 30-degree invitation angle, casting a warm beam of sunrise light forward.",
      "Why this symbol wins:",
      "1. Universal Legibility: Doors exist in every human culture and require no translation.",
      "2. Exact Brief Alignment: Directly embodies 'Make AI feel like an open door, not a locked lab.'",
      "3. Micro-scale Clarity: At 16x16 pixels, the clean architectural contrast of the arch and open portal remains crisp and distinct without blurring.",
      "4. Photocopy Resilience: Even when photocopied on a cheap toner printer at 50% contrast, the silhouette remains unmistakable."
    ],
    keyRules: [
      "Never rotate or invert the portal.",
      "Always preserve the 30° perspective angle.",
      "No internal text or embellishments."
    ]
  },
  {
    pageNumber: 7,
    chapter: "Chapter 3: Logo Architecture",
    title: "Primary & Secondary Lockups",
    subtitle: "Configurations for diverse media formats",
    content: [
      "Primary Horizontal Lockup: The Open Door symbol set to the left of 'Human First AI'. Used for website headers, letterheads, and horizontal banners.",
      "Primary Stacked Lockup: The Open Door symbol centered above the wordmark. Used for social avatars, app splash screens, and vertical posters.",
      "Secondary Global Lockup: Includes the quiet descriptor 'Global' set in uppercase tracking beneath 'AI'. Used in policy papers, international treaties, and annual reports.",
      "Local Chapter Lockup: Follows the strict formula: 'Human First AI | [City]'. A delicate vertical hairline divider separates the brand from the chapter name."
    ]
  },
  {
    pageNumber: 8,
    chapter: "Chapter 3: Logo Architecture",
    title: "Clear Space & Minimum Scale",
    subtitle: "Protection rules for digital displays and physical print",
    content: [
      "Clear Space Rule: The logo must always be surrounded by an isolation boundary equal to 'X', where 'X' is defined as the height of the capital letter 'H' in 'Human'.",
      "No graphic elements, text, photographic edges, or borders may intrude into this zone.",
      "Minimum Digital Size: 16px height for symbol-only favicon; 28px height for full horizontal lockup.",
      "Minimum Print Size: 10mm height for symbol-only; 18mm height for horizontal lockup.",
      "Photocopy Rule: In monochrome reproduction, use the solid Deep Ink or 100% Black version."
    ]
  },
  {
    pageNumber: 9,
    chapter: "Chapter 3: Logo Architecture",
    title: "Logo Misuse Guardrails",
    subtitle: "Nine visual anti-patterns strictly prohibited",
    content: [
      "To safeguard trust and recognition across 38 global chapters, the following misuses are strictly forbidden:",
      "1. Do not stretch or distort proportions.",
      "2. Do not recolor using unapproved tech-blue or neon purple gradients.",
      "3. Do not enclose the mark inside rounded pill capsules or heavy drop shadows.",
      "4. Do not insert text or flags inside the open door symbol.",
      "5. Do not rotate or mirror the symbol.",
      "6. Do not place on low-contrast photography without a measured dark or light scrim.",
      "7. Do not alter the lockup hierarchy (never place AI before Human).",
      "8. Do not add sci-fi clichés (circuits, robot eyes, glowing brains).",
      "9. Do not place the full-color mark on backgrounds with less than 4.5:1 contrast."
    ]
  },
  {
    pageNumber: 10,
    chapter: "Chapter 4: Color System",
    title: "The Human Palette & 60-30-10 Rule",
    subtitle: "Warm, grounded, and anti-technocratic color distribution",
    content: [
      "Our palette deliberately rejects the sterile cyan/purple 'AI aesthetic'. It is drawn from natural materials: warm paper, fountain pen ink, sunrise, and mineral teal.",
      "60% Dominant Neutral Canvas: Warm Cream (#FFF6EC) or Pure White (#FFFFFF). Creates an unhurried, comfortable reading field.",
      "30% Structural Surfaces & Typography: Deep Ink (#1F2A44). Grounds our materials in legal credibility, sharp contrast, and timeless dignity.",
      "8% Primary Warm Accent: Sunrise (#FF8A3D). Signifies hope, energy, and the open door threshold.",
      "2% Secondary Accents: Community Teal (#187F72) for growth and Sky (#7CC4F2) for spacious air."
    ]
  },
  {
    pageNumber: 11,
    chapter: "Chapter 4: Color System",
    title: "Color Specifications & Production Values",
    subtitle: "HEX, RGB, CMYK, and Pantone matching for print and screen",
    content: [
      "Warm Cream: HEX #FFF6EC · RGB (255, 246, 236) · CMYK (0, 4, 7, 0) · Pantone 7506 C",
      "Deep Ink: HEX #1F2A44 · RGB (31, 42, 68) · CMYK (85, 75, 40, 40) · Pantone 289 C",
      "Sunrise: HEX #FF8A3D · RGB (255, 138, 61) · CMYK (0, 55, 80, 0) · Pantone 1585 C",
      "Community Teal: HEX #187F72 · RGB (26, 140, 126) · CMYK (82, 20, 52, 10) · Pantone 7717 C",
      "Sky: HEX #7CC4F2 · RGB (124, 196, 242) · CMYK (48, 12, 0, 0) · Pantone 2915 C",
      "Paper White: HEX #FFFFFF · RGB (255, 255, 255) · CMYK (0, 0, 0, 0)"
    ]
  },
  {
    pageNumber: 12,
    chapter: "Chapter 4: Color System",
    title: "Accessibility & WCAG 2.2 Matrix",
    subtitle: "Strict contrast compliance and colorblindness safety",
    content: [
      "Accessibility is our core value, not an afterthought. Every text pairing must meet or exceed WCAG 2.2 Level AA (4.5:1 for body text, 3:1 for large display).",
      "Deep Ink on Warm Cream yields an exceptional 13.82:1 ratio (Surpasses AAA).",
      "Deep Ink on Pure White yields 14.51:1 (Surpasses AAA).",
      "White text on Sunrise is STRICTLY FORBIDDEN (2.03:1, fails AA). All text on Sunrise buttons must be Deep Ink (7.15:1, AAA).",
      "Color-blindness rule: We never convey state (such as error, success, or step progress) by color alone. Every colored element must be reinforced with an explicit text label or icon."
    ]
  },
  {
    pageNumber: 13,
    chapter: "Chapter 5: Typography System",
    title: "Typefaces & Humanist Hierarchy",
    subtitle: "Selecting Atkinson Hyperlegible and Plus Jakarta Sans",
    content: [
      "We choose fonts designed for extreme legibility, open counters, and human warmth.",
      "Primary Accessible Body: Atkinson Hyperlegible (developed by the Braille Institute). Specially sculpted to distinguish easily confused characters (like 1, l, I, and 0, O).",
      "Primary Brand & Display: Plus Jakarta Sans. Friendly geometric humanist curves that convey contemporary confidence without tech aloofness.",
      "Global Fallback: Noto Sans family, ensuring flawless typography across Arabic, Devanagari, Greek, Cyrillic, and CJK scripts."
    ]
  },
  {
    pageNumber: 14,
    chapter: "Chapter 5: Typography System",
    title: "Multilingual & Right-to-Left (RTL) Layout",
    subtitle: "Adapting across scripts while preserving brand character",
    content: [
      "In Right-to-Left languages like Arabic, Persian, and Urdu:",
      "1. The entire layout mirrors horizontally: brand mark sits on the right, primary call-to-action on the left.",
      "2. The Open Door symbol does NOT mirror. The door continues to open inward-forward as an invariant glyph.",
      "3. Font pairing: Noto Sans Arabic at 1.1x Latin body size with 1.7x line-height to ensure diacritics and complex ligatures render with pristine clarity."
    ]
  },
  {
    pageNumber: 15,
    chapter: "Chapter 6: Visual Language",
    title: "Iconography Suite",
    subtitle: "Simple, friendly line icons that explain tech concepts without jargon",
    content: [
      "Our icons use a consistent 2px rounded stroke, open paths, and warm circular geometries.",
      "We replace sci-fi icons with everyday metaphors:",
      "• Open Access replaces 'API Endpoint'",
      "• Plain Language replaces 'NLP / LLM'",
      "• Learning Circle replaces 'Neural Network'",
      "• Shared Tool replaces 'Machine Learning Pipeline'",
      "• Human Compass replaces 'Algorithmic Optimization'"
    ]
  },
  {
    pageNumber: 16,
    chapter: "Chapter 6: Visual Language",
    title: "Photography Principles",
    subtitle: "Documentary authenticity: real people, real places, natural daylight",
    content: [
      "Our photography must be indistinguishable from documentary journalism.",
      "Rule 1: Warm natural light only. Sunlight streaming through windows or open doorways. Never dark rooms lit by eerie blue monitors.",
      "Rule 2: Authentic collaboration. Show people looking at each other, laughing, pointing at a paper notepad, or sharing a keyboard.",
      "Rule 3: Genuine diversity of age, ability, and geography. Show grandmothers, market vendors, farmers, and students across Lagos, Lima, Detroit, and Jakarta.",
      "Rule 4: Zero staged corporate stock models. If a photo looks like an Silicon Valley brochure, it is disqualified."
    ]
  },
  {
    pageNumber: 17,
    chapter: "Chapter 6: Visual Language",
    title: "Illustration Guidelines",
    subtitle: "Warm, hand-drawn editorial illustrations showing tech in daily life",
    content: [
      "Illustrations should feel human-crafted with subtle organic textures and warm linework.",
      "Depict real, grounded scenarios:",
      "• A farmer in the Andes using a weather forecast to save potato crops.",
      "• A textile artisan in Rajasthan calculating fabric yardage.",
      "• A community health volunteer reviewing baby immunizations.",
      "• An older woman drafting her memoirs."
    ]
  },
  {
    pageNumber: 18,
    chapter: "Chapter 7: Graphic Devices",
    title: "The Open Threshold Framing Device",
    subtitle: "A signature geometric motif derived from the logo",
    content: [
      "The 'Open Threshold' is a graphic framing device formed by a 30-degree angled color slice or container border. It acts as a visual window, opening up photography and highlighting key pull quotes.",
      "It can be used as:",
      "1. A photo frame opening from the left margin.",
      "2. A subtle warm sunrise-tinted container on flyers and slide covers.",
      "3. A hairline divider with a small 30-degree diagonal notch."
    ]
  },
  {
    pageNumber: 19,
    chapter: "Chapter 8: Co-Branding & Chapters",
    title: "Chapter & Partner Lockup Formula",
    subtitle: "Standardized relationships with local organizers and funding partners",
    content: [
      "Local Chapter Formula: 'Human First AI' followed by a vertical hairline divider (#1F2A44 at 20% opacity) and the city name in regular weight.",
      "Partner Co-branding Formula: When partnering with UNESCO, local universities, or ethical foundations, both logos share equal visual height (36px).",
      "A vertical divider with 24px padding on both sides maintains clean visual independence."
    ]
  },
  {
    pageNumber: 20,
    chapter: "Chapter 9: Physical Applications",
    title: "Community Flyer & The Low-Cost Photocopy Test",
    subtitle: "Designing for black-and-white toner printing in community centers",
    content: [
      "Every printed community flyer MUST pass the 'Cheap Photocopy Test'.",
      "Most grassroots workshops print materials on low-cost black-and-white photocopiers with low toner.",
      "Rules for flyers:",
      "1. Text must be 100% black on white background. No gray body text.",
      "2. Important details (Date, Time, Location) must use bold boxed high-contrast framing.",
      "3. Minimum body font size is 14pt for community flyers.",
      "4. Include tear-off tabs or simple SMS shortcodes for attendees without smartphones."
    ]
  },
  {
    pageNumber: 21,
    chapter: "Chapter 9: Physical Applications",
    title: "Volunteer T-Shirt & Lanyard System",
    subtitle: "Creating pride of affiliation and approachable volunteer presence",
    content: [
      "The volunteer uniform is designed to feel like a friendly guide, not a corporate security guard.",
      "T-shirt: Deep Ink organic cotton with 'Human First AI' pocket mark on the front left chest, and the warm message on the back: 'Ask me anything about AI. We will figure it out together.'",
      "Lanyard & Badge: Community Teal strap with high-contrast badge showing volunteer's first name in 28pt type, spoken languages, and chapter location."
    ]
  },
  {
    pageNumber: 22,
    chapter: "Chapter 9: Physical Applications",
    title: "Workshop Slide Deck Architecture",
    subtitle: "Accessible 16:9 presentations for community halls and projectors",
    content: [
      "Community hall projectors often suffer from low brightness and washed-out contrast.",
      "Slide presentation standards:",
      "1. Dark mode option: Deep Ink background with Warm Cream text delivers maximum optical contrast on cheap projectors.",
      "2. Maximum 25 words per slide. Slides are conversation starters, not reading tests.",
      "3. Minimum font size on slides: 28pt. Headline minimum: 44pt.",
      "4. Every diagram must use high-contrast outlines and clear text labels."
    ]
  },
  {
    pageNumber: 23,
    chapter: "Chapter 9: Physical Applications",
    title: "Certificate of Completion",
    subtitle: "Honoring learners with a dignified, frame-worthy credential",
    content: [
      "For many learners in our workshops, this certificate represents their first formal technology credential. It must look and feel exceptionally dignified.",
      "Design specifications:",
      "• Printed on heavy 250gsm warm cream cardstock.",
      "• Deep Ink border with an embossed or stamped Sunrise seal.",
      "• Signed by the local volunteer educator and global director.",
      "• Contains a unique verification code and plain-English summary of practical skills mastered."
    ]
  },
  {
    pageNumber: 24,
    chapter: "Chapter 10: Digital Applications",
    title: "Website Homepage & Digital Accessibility",
    subtitle: "Fast loading on 3G connections, mobile-first, and zero clutter",
    content: [
      "The website must load in under 2 seconds on a 3G mobile connection in rural areas.",
      "Zero-Pill Discipline: No decorative pill capsules or confusing tech badges.",
      "Top Bar Contract: Clean 3-zone header with wordmark, concise nav links, and one primary 'Find a Workshop' action.",
      "Accessibility: Full keyboard navigation, visible focus rings, and screen-reader tested semantic HTML5."
    ]
  },
  {
    pageNumber: 25,
    chapter: "Chapter 10: Digital Applications",
    title: "Social Media Templates (Instagram, LinkedIn, WhatsApp)",
    subtitle: "Optimized shareable graphics for community organizing",
    content: [
      "WhatsApp is the world's primary communication layer across the Global South. We provide lightweight 1080x1080px event cards with high-contrast text that compress cleanly without artifact distortion.",
      "Instagram Carousel: 1:1 format focusing on '3 Simple AI Prompts for Small Businesses' or 'How to spot fake news'.",
      "LinkedIn: Institutional thought leadership cards emphasizing ethical policy, workforce transition, and philanthropic partnerships."
    ]
  },
  {
    pageNumber: 26,
    chapter: "Chapter 10: Digital Applications",
    title: "Mobile App Icon & Favicon System",
    subtitle: "Recognizable at 16px, 32px, and 180px retina touch displays",
    content: [
      "The Open Door symbol adapts seamlessly to squircle and circular app icon grids.",
      "Deep Ink background with Sunrise doorway portal provides immediate visual anchor on a crowded mobile homescreen.",
      "Zero text in the app icon ensures global usability across iOS and Android app stores without regional localization overhead."
    ]
  },
  {
    pageNumber: 27,
    chapter: "Chapter 11: Alt-Text & Plain English",
    title: "Alt-Text Formulation Standards",
    subtitle: "Writing descriptive, dignified alt-text for screen readers",
    content: [
      "Alt-text must never simply say 'image of people' or 'logo'.",
      "Formula: [Subject] + [Action/Context] + [Mood/Atmosphere].",
      "Example: 'A smiling Peruvian farmer wearing a warm knit chullo holds a tablet showing daily frost predictions, discussing crop health with a community agricultural advisor in an outdoor field.'",
      "For diagrams: Describe the functional takeaway first, then the visual structure."
    ]
  },
  {
    pageNumber: 28,
    chapter: "Chapter 12: Production & Asset Kit",
    title: "Asset File Formats & Export Rules",
    subtitle: "Guidelines for SVG, PNG, EPS, and PDF vector assets",
    content: [
      "SVG (Scalable Vector Graphics): Primary format for web, responsive UI, and digital presentation.",
      "PNG (Portable Network Graphics): Exported at 300 DPI with transparent background for office documents and social templates.",
      "EPS (Encapsulated PostScript): Provided for professional silkscreening, embroidery, and outdoor billboard vinyl plotting.",
      "PDF (Vector Print): Color-calibrated CMYK for offset commercial book and flyer printing."
    ]
  },
  {
    pageNumber: 29,
    chapter: "Chapter 12: Production & Asset Kit",
    title: "The 10-Year Timelessness Test",
    subtitle: "Why this identity will remain dignified and relevant in 2036",
    content: [
      "Trends date rapidly. Neon gradients, glassmorphism, and floating 3D spheres will look quaint in three years.",
      "The Open Door is rooted in 5,000 years of human architecture. As AI models evolve from text to spatial computing and embodied robotics, the core human question remains unchanged: Is this door open to me?",
      "By anchoring our mark in hospitality, paper warmth, and editorial typography, Human First AI will look just as trusted and relevant in 2036 as it does today."
    ]
  },
  {
    pageNumber: 30,
    chapter: "Chapter 12: Production & Asset Kit",
    title: "Brand Governance & Summary",
    subtitle: "The final sign-off checklist for all brand materials",
    content: [
      "Before publishing any material, run through the Human First AI Quality Checklist:",
      "1. Does it sound like a patient, trusted teacher? (No hype, no jargon)",
      "2. Can a 12-year-old read and understand the primary message?",
      "3. Does the text/background pairing pass WCAG AA contrast?",
      "4. Is 'Human' leading visually before 'AI'?",
      "5. Does it feature real people in natural light rather than sci-fi clichés?",
      "If you can answer 'YES' to all five, your work honors the movement."
    ],
    keyRules: [
      "The brand succeeds if a nervous first-time learner feels: 'This is for me.'",
      "The brand succeeds if a corporate partner feels: 'This is credible.'",
      "The brand succeeds if a volunteer feels: 'I am proud to wear this.'",
      "The brand succeeds if someone sees it once and can draw it from memory a week later."
    ]
  }
];
