// ============================================================================
//  Human First AI — brand constants. Single source of truth for every asset.
// ============================================================================
export const COLORS = {
  cream:       { hex:'#FFF6EC', name:'Warm Cream',      role:'Primary canvas' },
  ink:         { hex:'#1F2A44', name:'Deep Ink',        role:'Structure & text' },
  sunrise:     { hex:'#FF8A3D', name:'Sunrise',         role:'Accent fill only' },
  sunriseDeep: { hex:'#C24D00', name:'Sunrise Deep',    role:'Accent text & icons on light' },
  teal:        { hex:'#187F72', name:'Community Teal',  role:'Growth, secondary actions' },
  sky:         { hex:'#7CC4F2', name:'Sky',             role:'Illustration & surface tint' },
  skyDeep:     { hex:'#1277B7', name:'Sky Deep',        role:'Links & data on light' },
  white:       { hex:'#FFFFFF', name:'Paper White',     role:'Print & high-contrast canvas' },
  black:       { hex:'#000000', name:'Press Black',     role:'1-colour print only' },
};
export const C = Object.fromEntries(Object.entries(COLORS).map(([k,v])=>[k,v.hex]));

// --- WCAG ---------------------------------------------------------------
const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
export const luminance = hex => { const h=hex.replace('#','');
  return 0.2126*lin(parseInt(h.slice(0,2),16))+0.7152*lin(parseInt(h.slice(2,4),16))+0.0722*lin(parseInt(h.slice(4,6),16)); };
export const contrast = (a,b) => { const l1=luminance(a), l2=luminance(b);
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };
export const grade = r => r>=7 ? 'AAA' : r>=4.5 ? 'AA' : r>=3 ? 'AA Large / graphics' : 'Fail';

// --- THE OPEN DOOR MARK -------------------------------------------------
// 64 x 64 construction grid, every value on a 0.5u increment.
// The lit opening is enclosed by ink on all four sides, so Sunrise (2.19:1 on
// cream) never meets a light background directly — WCAG 1.4.11 is satisfied
// by construction rather than by rule.
export const GRID = 64;
export function markPaths({ stroke = 5, knob = true, ground = true } = {}) {
  const base = 51.5, spring = 30, cx = 39.5, rOut = 15, t = stroke / 2;
  const fL = cx - rOut, fR = cx + rOut;          // frame centreline
  const oL = fL + t,  oR = fR - t, rIn = rOut - t; // lit opening
  const leafR = Math.round((fL - t - 2) * 2) / 2;  // 2u hinge gap from frame
  const p = [];
  p.push({ id:'opening', fill:'light', d:`M${oL},${base} L${oL},${spring} A${rIn},${rIn} 0 0 1 ${oR},${spring} L${oR},${base} Z` });
  p.push({ id:'frame', stroke:'dark', width:stroke, d:`M${fL},${base} L${fL},${spring} A${rOut},${rOut} 0 0 1 ${fR},${spring} L${fR},${base}` });
  p.push({ id:'leaf', fill:'dark', d:`M${leafR},${base} L${leafR},16.5 L7,9 L7,${base} Z` });
  if (knob)   p.push({ id:'knob', fill:'light', circle:[10.5, 34, 2.4] });
  if (ground) p.push({ id:'ground', fill:'dark', rect:[3, base, 58, stroke>5?4:3.5] });
  return p;
}
/** Render the mark. dark = frame/leaf/ground, light = the opening + knob. */
export function markBody(dark, light, opts = {}) {
  return markPaths(opts).map(p => {
    const col = c => c === 'dark' ? dark : light;
    if (p.circle) return `<circle cx="${p.circle[0]}" cy="${p.circle[1]}" r="${p.circle[2]}" fill="${col(p.fill)}"/>`;
    if (p.rect)   return `<rect x="${p.rect[0]}" y="${p.rect[1]}" width="${p.rect[2]}" height="${p.rect[3]}" fill="${col(p.fill)}"/>`;
    if (p.stroke) return `<path d="${p.d}" fill="none" stroke="${col(p.stroke)}" stroke-width="${p.width}"/>`;
    return `<path d="${p.d}" fill="${col(p.fill)}"/>`;
  }).join('\n  ');
}
/** Visual bounds of the mark inside the 64u grid. */
export const MARK_BOX = { x:3, y:9, w:58, h:46 };

// --- COLOURWAYS ---------------------------------------------------------
export const WAYS = {
  full:         { dark:C.ink,   light:C.sunrise, on:C.cream, label:'Full colour'           },
  'full-white': { dark:C.ink,   light:C.sunrise, on:C.white, label:'Full colour on white'  },
  reversed:     { dark:C.cream, light:C.sunrise, on:C.ink,   label:'Reversed on Deep Ink'  },
  'mono-ink':   { dark:C.ink,   light:'none',    on:C.cream, label:'One colour — Deep Ink' },
  'mono-black': { dark:C.black, light:'none',    on:C.white, label:'One colour — black'    },
  'mono-white': { dark:C.white, light:'none',    on:C.ink,   label:'One colour — white'    },
  'mono-teal':  { dark:C.teal,  light:'none',    on:C.cream, label:'One colour — Teal'     },
};

// --- WORDMARK -----------------------------------------------------------
// "Human" leads (ExtraBold). "First" connects (Medium). "AI" is quiet and
// grounded (Bold, 0.84 cap height). Never set any part of it in Sunrise.
export const WORDMARK = [
  { w:800, t:'Human', track:-0.02 },
  { w:500, t:'First', track:-0.02, gapBefore:0.20 },
  { w:700, t:'AI',    track: 0.03, gapBefore:0.26, scale:0.84 },
];
export const BRAND = {
  name:'Human First AI',
  oneLiner:'Make AI feel like an open door, not a locked lab.',
  promise:'The future belongs to all of us.',
  coreIdea:'AI for everyone. Opportunity for all.',
  descriptor:'Global Movement',
  version:'2.0',
};
