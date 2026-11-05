import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

// ---------------------------------------------------------------------------
//  Land data for the chapter globe.
//
//  The globe is drawn as a field of dots rather than filled coastlines. Three
//  reasons: a dot either faces you or it does not, so horizon clipping is a
//  single comparison instead of polygon splitting; the halftone reads as print
//  rather than as a defence-contractor dashboard; and the whole world fits in
//  a few kilobytes, which is what a 3G connection in a rural chapter gets.
//
//  Source: Natural Earth 110m land, public domain.
//  Runs once. The result is committed, so the site build needs no network.
// ---------------------------------------------------------------------------
const SRC = '../.scratch/geo/land.geojson';
const OUT = '../site/data';
mkdirSync(OUT, { recursive: true });

if (!existsSync(SRC)) {
  console.log('geo: source not present, keeping the committed land.json');
  process.exit(0);
}

const geo = JSON.parse(readFileSync(SRC, 'utf8'));

// Collect every outer ring, with its bounding box for a cheap pre-test.
const rings = [];
for (const f of geo.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    const r = poly[0];
    if (r.length < 4) continue;
    let x0 = 180, y0 = 90, x1 = -180, y1 = -90;
    for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    rings.push({ r, x0, y0, x1, y1 });
  }
}

const inRing = (lon, lat, { r, x0, y0, x1, y1 }) => {
  if (lon < x0 || lon > x1 || lat < y0 || lat > y1) return false;
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const isLand = (lon, lat) => rings.some(ring => inRing(lon, lat, ring));

// Even spacing on the sphere: constant latitude step, longitude step opened
// out by 1/cos(lat) so dots near the poles do not bunch together.
const STEP = 2.1;
const Q = 10;
const dots = [];
for (let lat = -84; lat <= 84; lat += STEP) {
  const lonStep = STEP / Math.max(0.18, Math.cos((lat * Math.PI) / 180));
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (isLand(lon, lat)) dots.push([Math.round(lon * Q), Math.round(lat * Q)]);
  }
}

// Flat, delta-encoded on longitude within each latitude band.
const flat = [];
for (const [lon, lat] of dots) flat.push(lon, lat);

const payload = {
  q: Q,
  step: STEP,
  source: 'Natural Earth 110m land, public domain. A motif, not a map — do not measure anything with it.',
  dots: flat,
};
writeFileSync(`${OUT}/land.json`, JSON.stringify(payload));
console.log(`geo: ${dots.length} land dots at ${STEP}°, ${(JSON.stringify(payload).length / 1024).toFixed(1)} KB`);
