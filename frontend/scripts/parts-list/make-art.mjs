/**
 * Draws the part illustrations used where the catalog has no real photo.
 *
 *   node scripts/parts-list/make-art.mjs   -> public/assets/parts-art/*.svg
 *
 * One consistent set in the storefront palette: charcoal line work, the brand
 * red as the single accent, on the same pale tile the product photos sit on.
 * They are deliberately illustrations — a drawn spark plug, not a fake photo —
 * so a shopper is never misled about what the item looks like, and the admin
 * can swap in a real photo per product from the image manager.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'assets', 'parts-art');
mkdirSync(OUT, { recursive: true });

const INK = '#1f2937';
const RED = '#c62828';
const SOFT = '#e5e7eb';

const s = (w = 14) => `fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const r = (w = 14) => `fill="none" stroke="${RED}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const fillRed = `fill="${RED}"`;
const fillInk = `fill="${INK}"`;

const polar = (cx, cy, rad, a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];

function gear(cx, cy, outer, inner, teeth, attrs = s(12)) {
  const pts = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const rad = i % 2 ? inner : outer;
    pts.push(polar(cx, cy, rad, a0), polar(cx, cy, rad, a1));
  }
  return `<path d="M${pts.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join(' L')} Z" ${attrs}/>`;
}

function holes(cx, cy, rad, n, size, attrs = fillInk) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = polar(cx, cy, rad, (i / n) * Math.PI * 2);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size}" ${attrs}/>`;
  }
  return out;
}

const ART = {
  'spark-plug': `
    <rect x="270" y="110" width="60" height="70" rx="10" ${s()}/>
    <path d="M245 180 h110 l-10 90 h-90 z" ${s()}/>
    <path d="M250 205 h100 M252 230 h96" ${s(8)}/>
    <rect x="262" y="270" width="76" height="80" rx="8" ${s()}/>
    <path d="M300 350 v90" ${s()}/>
    <path d="M300 440 v30 h-30" ${r()}/>
    <path d="M300 468 m-10 18 l6 -14 l8 10 l6 -16" ${r(8)}/>`,

  filter: `
    <path d="M300 120 v60 M300 420 v60" ${s()}/>
    <rect x="220" y="180" width="160" height="240" rx="40" ${s()}/>
    <path d="M240 240 h120 M240 280 h120 M240 320 h120 M240 360 h120" ${r(10)}/>`,

  'injector-cap': `
    <path d="M230 200 h140 v60 a70 70 0 0 1 -140 0 z" ${s()}/>
    <rect x="250" y="150" width="100" height="50" rx="10" ${s()}/>
    <circle cx="300" cy="270" r="22" ${r()}/>
    <path d="M300 330 v120 M270 450 h60" ${s()}/>`,

  pipe: `
    <path d="M150 380 C 230 380 230 220 310 220 S 400 300 450 250" ${s(26)}/>
    <path d="M150 380 C 230 380 230 220 310 220 S 400 300 450 250" fill="none" stroke="${SOFT}" stroke-width="10" stroke-linecap="round"/>
    <rect x="115" y="355" width="50" height="50" rx="8" ${r()}/>
    <rect x="440" y="225" width="50" height="50" rx="8" transform="rotate(-30 465 250)" ${r()}/>`,

  carbon: `
    <rect x="200" y="210" width="80" height="120" rx="10" ${s()}/>
    <rect x="320" y="210" width="80" height="120" rx="10" ${s()}/>
    <path d="M240 330 C 240 400 300 400 300 440 M360 330 C 360 400 300 400 300 440" ${r(10)}/>
    <circle cx="300" cy="450" r="14" ${fillRed}/>`,

  'disc-pad': `
    <path d="M160 230 q140 -70 280 0 v70 q-140 -60 -280 0 z" ${s()}/>
    <path d="M175 250 q125 -52 250 0" ${r(22)}/>
    <path d="M160 340 q140 -70 280 0 v70 q-140 -60 -280 0 z" ${s()}/>
    <path d="M175 360 q125 -52 250 0" ${r(22)}/>`,

  'brake-shoe': `
    <path d="M160 320 a140 140 0 0 1 280 0" ${s(30)}/>
    <path d="M178 320 a122 122 0 0 1 244 0" ${r(14)}/>
    <path d="M190 400 a110 110 0 0 0 220 0" ${s(30)}/>
    <path d="M200 350 h200" ${s(10)}/>`,

  bearing: `
    <circle cx="300" cy="300" r="170" ${s()}/>
    <circle cx="300" cy="300" r="80" ${s()}/>
    ${holes(300, 300, 125, 10, 26, `fill="none" stroke="${RED}" stroke-width="10"`)}`,

  rubber: `
    <rect x="170" y="230" width="260" height="140" rx="40" ${s()}/>
    <path d="M210 260 v80 M250 260 v80 M290 260 v80 M330 260 v80 M370 260 v80" ${r(12)}/>`,

  chain: (() => {
    let out = '';
    for (let i = 0; i < 5; i++) {
      const x = 120 + i * 80;
      out += `<rect x="${x}" y="${i % 2 ? 262 : 250}" width="110" height="${i % 2 ? 76 : 100}" rx="38" ${i % 2 ? r(12) : s(12)}/>`;
      out += `<circle cx="${x + 18}" cy="300" r="10" ${fillInk}/>`;
    }
    return out;
  })(),

  'chain-guide': `
    <path d="M140 380 C 220 260 380 260 460 300" ${s(34)}/>
    <path d="M140 380 C 220 260 380 260 460 300" fill="none" stroke="${SOFT}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="140" cy="380" r="16" ${fillRed}/><circle cx="460" cy="300" r="16" ${fillRed}/>`,

  cable: `
    <path d="M140 420 C 140 250 300 460 330 300 S 470 150 470 220" ${s(16)}/>
    <path d="M110 420 h60 v40 h-60 z" ${r(12)}/>
    <path d="M460 190 h24 v60 h-24 z" ${r(12)}/>
    <circle cx="140" cy="480" r="16" ${fillRed}/>`,

  lever: `
    <path d="M150 260 h60 q20 0 30 20 l40 60 q10 20 40 20 h160" ${s(26)}/>
    <circle cx="180" cy="260" r="40" ${s()}/>
    <circle cx="180" cy="260" r="12" ${fillRed}/>
    <path d="M320 380 h140" ${r(10)}/>`,

  lock: `
    <path d="M230 270 v-50 a70 70 0 0 1 140 0 v50" ${s(18)}/>
    <rect x="200" y="270" width="200" height="170" rx="24" ${s()}/>
    <circle cx="300" cy="340" r="20" ${fillRed}/>
    <path d="M300 355 v40" ${r(14)}/>`,

  'side-stand': `
    <circle cx="250" cy="200" r="30" ${s()}/>
    <path d="M265 225 L 390 440" ${s(28)}/>
    <path d="M360 440 h80" ${r(20)}/>
    <path d="M230 190 l-60 -40" ${s(10)}/>`,

  'main-stand': `
    <path d="M200 180 h200" ${s(20)}/>
    <path d="M220 180 L 170 440 M380 180 L 430 440" ${s(24)}/>
    <path d="M140 440 h80 M380 440 h80" ${r(20)}/>
    <path d="M430 300 l60 -30" ${s(12)}/>`,

  'worm-box': `
    <rect x="170" y="210" width="260" height="180" rx="30" ${s()}/>
    ${gear(300, 300, 62, 48, 12, r(10))}
    <circle cx="300" cy="300" r="16" ${fillInk}/>
    <path d="M430 300 h60" ${s()}/>`,

  gear: `${gear(300, 300, 170, 140, 16)}<circle cx="300" cy="300" r="60" ${r()}/><circle cx="300" cy="300" r="18" ${fillInk}/>`,

  horn: `
    <circle cx="300" cy="300" r="160" ${s()}/>
    <circle cx="300" cy="300" r="110" ${s(8)}/>
    <circle cx="300" cy="300" r="46" ${r()}/>
    <path d="M300 140 v-40 M285 100 h30" ${s(12)}/>
    <path d="M460 260 q30 40 0 80 M495 235 q50 65 0 130" ${r(10)}/>`,

  bulb: `
    <path d="M300 130 a110 110 0 0 1 60 202 v48 h-120 v-48 a110 110 0 0 1 60 -202 z" ${s()}/>
    <path d="M250 410 h100 M258 440 h84 M275 470 h50" ${s(12)}/>
    <path d="M270 300 l20 -40 l20 40 l20 -40" ${r(10)}/>`,

  indicator: `
    <path d="M150 300 L 330 190 v70 h120 v80 h-120 v70 z" ${s()}/>
    <path d="M200 300 L 310 232" ${r(16)}/>`,

  seal: `
    <circle cx="300" cy="300" r="165" ${s(22)}/>
    <circle cx="300" cy="300" r="120" ${r(18)}/>
    <circle cx="300" cy="300" r="80" ${s(8)}/>`,

  screw: `
    <rect x="230" y="120" width="140" height="70" rx="12" ${s()}/>
    <path d="M300 130 v50" ${r(12)}/>
    <path d="M270 190 v250 h60 v-250" ${s()}/>
    <path d="M270 230 l60 20 M270 280 l60 20 M270 330 l60 20 M270 380 l60 20" ${s(8)}/>
    <path d="M300 440 v30" ${r(14)}/>`,

  gasket: `
    <path d="M170 190 h260 a30 30 0 0 1 30 30 v160 a30 30 0 0 1 -30 30 h-260 a30 30 0 0 1 -30 -30 v-160 a30 30 0 0 1 30 -30 z" ${s()}/>
    <circle cx="300" cy="300" r="70" ${r()}/>
    <circle cx="180" cy="230" r="14" ${fillInk}/><circle cx="420" cy="230" r="14" ${fillInk}/>
    <circle cx="180" cy="370" r="14" ${fillInk}/><circle cx="420" cy="370" r="14" ${fillInk}/>`,

  'clutch-disc': `
    <circle cx="300" cy="300" r="170" ${s()}/>
    ${gear(300, 300, 150, 128, 24, s(8))}
    <circle cx="300" cy="300" r="70" ${r()}/>
    ${holes(300, 300, 100, 6, 10)}`,

  spokes: (() => {
    let out = `<circle cx="300" cy="300" r="175" ${s()}/><circle cx="300" cy="300" r="40" ${r()}/>`;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const [x1, y1] = polar(300, 300, 40, a + 0.35);
      const [x2, y2] = polar(300, 300, 175, a);
      out += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" ${s(6)}/>`;
    }
    return out;
  })(),

  handlebar: `
    <path d="M110 250 q60 70 130 60 h120 q70 10 130 -60" ${s(26)}/>
    <path d="M110 250 l-20 -30 M490 250 l20 -30" ${r(26)}/>
    <rect x="265" y="290" width="70" height="60" rx="10" ${s()}/>`,

  bracket: `
    <path d="M160 200 h170 l110 110 v130" ${s(30)}/>
    <circle cx="200" cy="200" r="14" ${fillRed}/><circle cx="300" cy="200" r="14" ${fillRed}/>
    <circle cx="440" cy="400" r="14" ${fillRed}/>`,

  'chain-cover': `
    <path d="M120 330 q0 -80 90 -80 h250 q40 0 40 40 v30 q0 40 -40 40 h-300 q-40 0 -40 -30 z" ${s()}/>
    <path d="M170 300 h250" ${r(10)}/>
    <circle cx="170" cy="340" r="10" ${fillInk}/><circle cx="430" cy="340" r="10" ${fillInk}/>`,

  pump: `
    <rect x="230" y="140" width="140" height="240" rx="30" ${s()}/>
    <path d="M230 200 h140" ${r(12)}/>
    <path d="M300 380 v60 M260 440 h80" ${s()}/>
    <path d="M370 250 h60 v-60" ${s(12)}/>`,

  carb: `
    <rect x="200" y="200" width="200" height="180" rx="24" ${s()}/>
    <circle cx="300" cy="290" r="50" ${r()}/>
    <path d="M140 290 h60 M400 290 h60" ${s(22)}/>
    <path d="M300 380 v60 h60" ${s(12)}/>
    <path d="M300 200 v-50" ${s()}/>`,

  motor: `
    <rect x="170" y="210" width="220" height="180" rx="30" ${s()}/>
    <path d="M200 250 h160 M200 300 h160 M200 350 h160" ${s(8)}/>
    <path d="M390 300 h60" ${s(22)}/>
    ${gear(470, 300, 34, 24, 8, r(8))}`,

  disc: `
    <circle cx="300" cy="300" r="175" ${s()}/>
    <circle cx="300" cy="300" r="70" ${r()}/>
    ${holes(300, 300, 125, 12, 12)}
    ${holes(300, 300, 45, 5, 8, fillRed)}`,

  caliper: `
    <path d="M190 180 h170 a60 60 0 0 1 60 60 v120 a60 60 0 0 1 -60 60 h-170 z" ${s()}/>
    <path d="M190 180 v240" ${r(22)}/>
    <circle cx="330" cy="260" r="30" ${s(10)}/><circle cx="330" cy="340" r="30" ${s(10)}/>`,

  piston: `
    <path d="M200 160 h200 v180 q0 30 -30 30 h-140 q-30 0 -30 -30 z" ${s()}/>
    <path d="M200 200 h200 M200 230 h200" ${r(10)}/>
    <circle cx="300" cy="300" r="26" ${s(10)}/>
    <path d="M280 370 l-30 100 M320 370 l30 100 M240 470 h120" ${s()}/>`,

  headlight: `
    <circle cx="300" cy="300" r="170" ${s()}/>
    <circle cx="300" cy="300" r="120" ${s(8)}/>
    <circle cx="300" cy="300" r="46" ${r()}/>
    <path d="M300 180 v40 M300 380 v40 M180 300 h40 M380 300 h40" ${r(8)}/>`,

  speedo: `
    <circle cx="300" cy="310" r="170" ${s()}/>
    <path d="M190 360 a120 120 0 1 1 220 0" ${s(10)}/>
    <path d="M300 310 L 380 230" ${r(14)}/>
    <circle cx="300" cy="310" r="18" ${fillRed}/>`,

  valve: `
    <path d="M300 110 v300" ${s(20)}/>
    <path d="M190 470 q110 -70 220 0 z" ${s()}/>
    <path d="M280 150 h40" ${r(16)}/>`,

  camshaft: `
    <path d="M110 300 h380" ${s(20)}/>
    <ellipse cx="200" cy="300" rx="40" ry="70" ${r(12)}/>
    <ellipse cx="400" cy="300" rx="40" ry="70" ${r(12)}/>
    ${gear(300, 300, 70, 56, 14, s(8))}`,

  shaft: `
    <path d="M110 300 h380" ${s(26)}/>
    <path d="M130 270 v60 M470 270 v60" ${s(12)}/>
    <path d="M200 280 h60 M200 320 h60" ${r(8)}/>`,

  shocker: `
    <circle cx="300" cy="130" r="30" ${s()}/>
    <circle cx="300" cy="470" r="30" ${s()}/>
    <rect x="265" y="160" width="70" height="120" rx="10" ${s()}/>
    <path d="M300 280 v160" ${s(20)}/>
    <path d="M250 200 l100 30 l-100 30 l100 30 l-100 30 l100 30 l-100 30 l100 30" ${r(12)}/>`,

  generic: `${gear(300, 300, 150, 122, 12)}<circle cx="300" cy="300" r="50" ${r()}/>`
};

let n = 0;
for (const [id, body] of Object.entries(ART)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img">
  <rect width="600" height="600" fill="#f7f8f8"/>
  <circle cx="300" cy="300" r="238" fill="#ffffff"/>
  <circle cx="300" cy="300" r="238" fill="none" stroke="${SOFT}" stroke-width="4"/>
  ${body.trim()}
</svg>
`;
  writeFileSync(join(OUT, `${id}.svg`), svg);
  n++;
}
console.log(`wrote ${n} illustrations to ${OUT}`);
