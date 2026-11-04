// Human First AI — Tailwind preset
// tailwind.config.js:  presets: [require('./brand/color/tailwind.preset.js')]
module.exports = {
  theme: {
    extend: {
      colors: { hf: {
        "cream": "#FFF6EC",
        "ink": "#1F2A44",
        "sunrise": "#FF8A3D",
        "sunrise-deep": "#C24D00",
        "teal": "#187F72",
        "sky": "#7CC4F2",
        "sky-deep": "#1277B7",
        "ink-muted": "#68728A",
        "clay": "#CE3E22",
        "white": "#FFFFFF",
        "black": "#000000"
} },
      fontFamily: {
        brand: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        readable: ['Atkinson Hyperlegible', 'Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
};
