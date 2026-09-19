import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDirs = [
  path.resolve(__dirname, '../../frontend/public/assets/parts'),
  path.resolve(__dirname, '../../assets/parts'),
  path.resolve(__dirname, '../../frontend/public/assets/brands'),
  path.resolve(__dirname, '../../assets/brands')
];

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const brandThemes = {
  hero: { name: 'HERO', primary: '#ED1C24', secondary: '#1A1A1A', text: '#FFFFFF', tag: 'HERO GENUINE PARTS' },
  honda: { name: 'HONDA', primary: '#D80027', secondary: '#212121', text: '#FFFFFF', tag: 'HONDA GENUINE PARTS' },
  suzuki: { name: 'SUZUKI', primary: '#003399', secondary: '#1A237E', text: '#FFFFFF', tag: 'SUZUKI GENUINE (SGP)' },
  tvs: { name: 'TVS', primary: '#0A3983', secondary: '#D32F2F', text: '#FFFFFF', tag: 'TVS GENUINE PARTS' },
  yamaha: { name: 'YAMAHA', primary: '#00205B', secondary: '#C62828', text: '#FFFFFF', tag: 'YAMAHA GENUINE (YGP)' },
  bajaj: { name: 'BAJAJ', primary: '#00539B', secondary: '#FF6F00', text: '#FFFFFF', tag: 'BAJAJ GENUINE SPARES' },
  mahindra: { name: 'MAHINDRA', primary: '#C62828', secondary: '#212121', text: '#FFFFFF', tag: 'MAHINDRA GENUINE' },
  'royal-enfield': { name: 'ROYAL ENFIELD', primary: '#212121', secondary: '#D4AF37', text: '#D4AF37', tag: 'ROYAL ENFIELD GMA' },
  ola: { name: 'OLA', primary: '#111827', secondary: '#10B981', text: '#10B981', tag: 'OLA ELECTRIC GENUINE' },
  ather: { name: 'ATHER', primary: '#0F172A', secondary: '#00D285', text: '#00D285', tag: 'ATHER OFFICIAL SPARE' },
  vida: { name: 'VIDA', primary: '#FF4500', secondary: '#18181B', text: '#FFFFFF', tag: 'HERO VIDA EV SPARES' },
  iqube: { name: 'IQUBE (TVS)', primary: '#0052CC', secondary: '#00C7E6', text: '#FFFFFF', tag: 'TVS iQUBE EV SPARES' }
};

const partDrawings = {
  brake: (brandColor, tag) => `
    <g transform="translate(200, 200)">
      <!-- Outer Rotor Disc -->
      <circle r="120" fill="none" stroke="#607D8B" stroke-width="26" stroke-dasharray="8 6" />
      <circle r="130" fill="none" stroke="#90A4AE" stroke-width="4" />
      <circle r="105" fill="none" stroke="#455A64" stroke-width="3" />
      <!-- Vent Holes -->
      <g fill="#263238">
        <circle cx="0" cy="-118" r="4"/><circle cx="59" cy="-102" r="4"/><circle cx="102" cy="-59" r="4"/><circle cx="118" cy="0" r="4"/>
        <circle cx="102" cy="59" r="4"/><circle cx="59" cy="102" r="4"/><circle cx="0" cy="118" r="4"/><circle cx="-59" cy="102" r="4"/>
        <circle cx="-102" cy="59" r="4"/><circle cx="-118" cy="0" r="4"/><circle cx="-102" cy="-59" r="4"/><circle cx="-59" cy="-102" r="4"/>
      </g>
      <!-- Center Hub with Mounting Bolts -->
      <circle r="60" fill="#CFD8DC" stroke="#78909C" stroke-width="4"/>
      <circle r="30" fill="#1E293B"/>
      <circle cx="0" cy="-42" r="6" fill="#37474F"/><circle cx="42" cy="0" r="6" fill="#37474F"/>
      <circle cx="0" cy="42" r="6" fill="#37474F"/><circle cx="-42" cy="0" r="6" fill="#37474F"/>
      <!-- Heavy Caliper -->
      <path d="M-135,-110 C-100,-150 60,-150 95,-110 L80,-60 C50,-90 -60,-90 -90,-60 Z" fill="${brandColor}" stroke="#FFFFFF" stroke-width="3"/>
      <rect x="-80" y="-105" width="40" height="20" rx="4" fill="#FFFFFF" opacity="0.9"/>
      <rect x="20" y="-105" width="40" height="20" rx="4" fill="#FFFFFF" opacity="0.9"/>
      <text x="-4" y="-91" fill="#000" font-size="10" font-family="Arial, sans-serif" font-weight="900" text-anchor="middle">OEM DUAL PISTON</text>
    </g>
  `,
  clutch: (brandColor, tag) => `
    <g transform="translate(200, 200)">
      <!-- Outer Clutch Basket Rim -->
      <circle r="130" fill="#2B2D42" stroke="${brandColor}" stroke-width="6"/>
      <!-- Inner Friction Teeth -->
      <g fill="#E2E8F0">
        ${Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return `<rect x="-10" y="-136" width="20" height="18" rx="3" transform="rotate(${angle})" fill="${brandColor}"/>`;
        }).join('')}
      </g>
      <!-- Friction Material Ring -->
      <circle r="115" fill="#C5A059" stroke="#8D6E63" stroke-width="16" stroke-dasharray="14 8"/>
      <!-- Center Steel Plate -->
      <circle r="85" fill="#4A4E69" stroke="#9E9E9E" stroke-width="4"/>
      <!-- Clutch Springs (6 heavy duty) -->
      ${Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 360) / 6;
        return `
          <g transform="rotate(${angle}) translate(0, -50)">
            <rect x="-12" y="-16" width="24" height="32" rx="6" fill="#FFC107" stroke="#333" stroke-width="2"/>
            <line x1="-12" y1="-8" x2="12" y2="-8" stroke="#333" stroke-width="2"/>
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#333" stroke-width="2"/>
            <line x1="-12" y1="8" x2="12" y2="8" stroke="#333" stroke-width="2"/>
          </g>
        `;
      }).join('')}
      <!-- Splined Center Hub -->
      <circle r="25" fill="#1E293B" stroke="#FFF" stroke-width="3"/>
      <circle r="12" fill="#000"/>
    </g>
  `,
  engine: (brandColor, tag) => `
    <g transform="translate(200, 195)">
      <!-- Cylinder Block with Cooling Fins -->
      <rect x="-85" y="-95" width="170" height="180" rx="12" fill="#37474F" stroke="#263238" stroke-width="4"/>
      ${[-80, -60, -40, -20, 0, 20, 40, 60].map(y => `
        <rect x="-100" y="${y}" width="200" height="10" rx="4" fill="#607D8B" stroke="#263238" stroke-width="2"/>
      `).join('')}
      <!-- Cylinder Bore Cutout -->
      <circle cx="0" cy="-5" r="55" fill="#ECEFF1" stroke="#455A64" stroke-width="6"/>
      <!-- High Compression Piston -->
      <circle cx="0" cy="-5" r="42" fill="#B0BEC5"/>
      <rect x="-38" y="-12" width="76" height="14" fill="#78909C" rx="2"/>
      <!-- Spark Plug at Top -->
      <rect x="-14" y="-135" width="28" height="40" rx="4" fill="#ECEFF1" stroke="#333" stroke-width="2"/>
      <rect x="-8" y="-150" width="16" height="15" fill="#CFD8DC"/>
      <line x1="0" y1="-155" x2="0" y2="-150" stroke="#E53935" stroke-width="4"/>
      <!-- Brand Plate on Engine -->
      <rect x="-65" y="55" width="130" height="24" rx="4" fill="${brandColor}" stroke="#FFF" stroke-width="1.5"/>
      <text x="0" y="71" fill="#FFF" font-size="11" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">4-VALVE DOHC OHC</text>
    </g>
  `,
  shocker: (brandColor, tag) => `
    <g transform="translate(200, 200)">
      <!-- Left Shocker Fork -->
      <g transform="translate(-45, 0)">
        <!-- Chrome Stanchion Tube -->
        <rect x="-12" y="-140" width="24" height="160" fill="url(#chromeGrad)" stroke="#78909C" stroke-width="2" rx="4"/>
        <!-- Dust Seal -->
        <rect x="-16" y="10" width="32" height="14" fill="#212121" rx="2"/>
        <!-- Heavy Coiled Spring -->
        ${[-110, -85, -60, -35, -10].map(y => `
          <ellipse cx="0" cy="${y}" rx="20" ry="8" fill="none" stroke="${brandColor}" stroke-width="7"/>
        `).join('')}
        <!-- Lower Damper Slider Tube -->
        <rect x="-18" y="20" width="36" height="120" rx="8" fill="#37474F" stroke="#263238" stroke-width="3"/>
        <!-- Bottom Axle Mount Eyelet -->
        <circle cx="0" cy="130" r="14" fill="#CFD8DC" stroke="#263238" stroke-width="4"/>
        <circle cx="0" cy="130" r="6" fill="#1E293B"/>
      </g>
      <!-- Right Shocker Fork -->
      <g transform="translate(45, 0)">
        <rect x="-12" y="-140" width="24" height="160" fill="url(#chromeGrad)" stroke="#78909C" stroke-width="2" rx="4"/>
        <rect x="-16" y="10" width="32" height="14" fill="#212121" rx="2"/>
        ${[-110, -85, -60, -35, -10].map(y => `
          <ellipse cx="0" cy="${y}" rx="20" ry="8" fill="none" stroke="${brandColor}" stroke-width="7"/>
        `).join('')}
        <rect x="-18" y="20" width="36" height="120" rx="8" fill="#37474F" stroke="#263238" stroke-width="3"/>
        <circle cx="0" cy="130" r="14" fill="#CFD8DC" stroke="#263238" stroke-width="4"/>
        <circle cx="0" cy="130" r="6" fill="#1E293B"/>
      </g>
      <!-- Top Triple Clamp Brace -->
      <rect x="-70" y="-140" width="140" height="18" rx="4" fill="#212121" stroke="#FFF" stroke-width="2"/>
    </g>
  `,
  lights: (brandColor, tag) => `
    <g transform="translate(200, 195)">
      <!-- Headlight Housing Nacelle -->
      <ellipse cx="0" cy="0" rx="125" ry="110" fill="#1E293B" stroke="#64748B" stroke-width="4"/>
      <!-- Chrome Bezel Trim -->
      <ellipse cx="0" cy="0" rx="112" ry="98" fill="#0F172A" stroke="${brandColor}" stroke-width="5"/>
      <!-- LED Halo DRL Ring -->
      <ellipse cx="0" cy="0" rx="90" ry="80" fill="none" stroke="#38BDF8" stroke-width="7" opacity="0.9"/>
      <!-- Upper High Beam Projector Lens -->
      <circle cx="0" cy="-25" r="38" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
      <circle cx="-10" cy="-35" r="10" fill="#E0F2FE" opacity="0.8"/>
      <!-- Lower Dual LED Low Beams -->
      <rect x="-45" y="25" width="38" height="24" rx="6" fill="#E2E8F0" stroke="#38BDF8" stroke-width="2"/>
      <rect x="7" y="25" width="38" height="24" rx="6" fill="#E2E8F0" stroke="#38BDF8" stroke-width="2"/>
      <!-- Light Beams Flare effect -->
      <path d="M-75,-15 L-110,-45 M75,-15 L110,-45 M0,-70 L0,-105" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
      <text x="0" y="70" fill="#F8FAFC" font-size="10" font-family="Arial, sans-serif" font-weight="900" text-anchor="middle">FULL LED MATRIX</text>
    </g>
  `,
  cables: (brandColor, tag) => `
    <g transform="translate(200, 200)">
      <!-- Heavy Loop Outer Housing Sheath -->
      <path d="M-110,90 C-130,-70 -30,-120 40,-90 C120,-60 110,60 0,95 C-80,120 -80,10 -10,-20" fill="none" stroke="#1E293B" stroke-width="20" stroke-linecap="round"/>
      <path d="M-110,90 C-130,-70 -30,-120 40,-90 C120,-60 110,60 0,95 C-80,120 -80,10 -10,-20" fill="none" stroke="${brandColor}" stroke-width="4" stroke-dasharray="10 8"/>
      <!-- Cable End Fittings & Brass Nipple -->
      <rect x="-128" y="80" width="28" height="22" rx="4" fill="#B0BEC5" stroke="#37474F" stroke-width="2"/>
      <rect x="-144" y="86" width="16" height="10" rx="3" fill="#D4AF37" stroke="#37474F" stroke-width="2"/>
      <!-- Exposed Stainless Steel Braided Core Wire -->
      <line x1="-10" y1="-20" x2="60" y2="-50" stroke="#CFD8DC" stroke-width="7" stroke-linecap="round"/>
      <!-- Adjuster Barrel Screw -->
      <g transform="translate(60, -50)">
        <rect x="-5" y="-12" width="30" height="24" rx="4" fill="#ECEFF1" stroke="#333" stroke-width="2"/>
        <line x1="2" y1="-12" x2="2" y2="12" stroke="#607D8B" stroke-width="3"/>
        <line x1="12" y1="-12" x2="12" y2="12" stroke="#607D8B" stroke-width="3"/>
        <line x1="22" y1="-12" x2="22" y2="12" stroke="#607D8B" stroke-width="3"/>
        <circle cx="35" cy="0" r="6" fill="#D4AF37" stroke="#333" stroke-width="2"/>
      </g>
    </g>
  `,
  wheels: (brandColor, tag) => `
    <g transform="translate(200, 200)">
      <!-- Outer Wheel Rim with Tubeless Tyre -->
      <circle r="132" fill="#1E293B" stroke="#0F172A" stroke-width="18"/>
      <!-- Tread Patterns -->
      <g stroke="#334155" stroke-width="4">
        ${Array.from({ length: 18 }).map((_, i) => {
          const angle = (i * 360) / 18;
          return `<line x1="0" y1="-140" x2="0" y2="-125" transform="rotate(${angle})" stroke-linecap="round"/>`;
        }).join('')}
      </g>
      <!-- Machined Alloy Lip -->
      <circle r="120" fill="none" stroke="${brandColor}" stroke-width="5"/>
      <!-- 5-Spoke Alloy Mag Design -->
      <g fill="#475569" stroke="#1E293B" stroke-width="3">
        ${Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 360) / 5;
          return `
            <g transform="rotate(${angle})">
              <path d="M-14,-35 L-22,-112 L22,-112 L14,-35 Z" fill="#64748B"/>
              <circle cx="0" cy="-80" r="10" fill="#0F172A"/>
            </g>
          `;
        }).join('')}
      </g>
      <!-- Center Wheel Hub & Bearings -->
      <circle r="40" fill="#94A3B8" stroke="#1E293B" stroke-width="4"/>
      <circle r="22" fill="#0F172A"/>
      <!-- Disc Mount Bosses -->
      <circle cx="0" cy="-28" r="5" fill="#E2E8F0"/><circle cx="28" cy="0" r="5" fill="#E2E8F0"/>
      <circle cx="0" cy="28" r="5" fill="#E2E8F0"/><circle cx="-28" cy="0" r="5" fill="#E2E8F0"/>
    </g>
  `,
  handle: (brandColor, tag) => `
    <g transform="translate(200, 200)">
      <!-- Wide Ergonomic Handlebar Profile -->
      <path d="M-140,40 C-110,-40 -50,-60 0,-60 C50,-60 110,-40 140,40" fill="none" stroke="#475569" stroke-width="26" stroke-linecap="round"/>
      <path d="M-140,40 C-110,-40 -50,-60 0,-60 C50,-60 110,-40 140,40" fill="none" stroke="url(#chromeGrad)" stroke-width="16" stroke-linecap="round"/>
      <!-- Left & Right Diamond Knurled Grips -->
      <g fill="#1E293B" stroke="#0F172A" stroke-width="2">
        <rect x="-145" y="15" width="45" height="26" rx="4" transform="rotate(35, -125, 30)"/>
        <rect x="100" y="15" width="45" height="26" rx="4" transform="rotate(-35, 125, 30)"/>
      </g>
      <!-- Metal Bar-End Weights -->
      <circle cx="-148" cy="46" r="13" fill="${brandColor}" stroke="#FFF" stroke-width="2.5"/>
      <circle cx="148" cy="46" r="13" fill="${brandColor}" stroke="#FFF" stroke-width="2.5"/>
      <!-- Center Handlebar Clamp Mounts -->
      <rect x="-42" y="-72" width="22" height="26" rx="4" fill="#0F172A" stroke="#FFF" stroke-width="1.5"/>
      <rect x="20" y="-72" width="22" height="26" rx="4" fill="#0F172A" stroke="#FFF" stroke-width="1.5"/>
      <!-- Brake & Clutch Lever Attachments -->
      <path d="M-115,20 C-125,5 -80,-5 -70,5" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round"/>
      <path d="M115,20 C125,5 80,-5 70,5" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round"/>
    </g>
  `,
  'petrol-tank': (brandColor, tag) => `
    <g transform="translate(200, 195)">
      <!-- Sculpted Fuel Tank Body -->
      <path d="M-125,25 C-135,-55 -80,-105 10,-105 C85,-105 135,-65 140,25 C140,75 55,95 -20,95 C-85,95 -120,70 -125,25 Z" fill="${brandColor}" stroke="#0F172A" stroke-width="6"/>
      <!-- Glossy Reflection Highlight -->
      <path d="M-90,-20 C-60,-75 10,-85 60,-80 C-10,-70 -50,-50 -75,-10 Z" fill="#FFFFFF" opacity="0.35"/>
      <!-- Knee Recess Grip Pads (Left & Right) -->
      <path d="M-105,25 C-105,-15 -80,-30 -50,-30 C-65,5 -75,35 -90,45 Z" fill="#18181B" stroke="#27272A" stroke-width="2"/>
      <!-- Chrome Flip-up Fuel Filler Cap -->
      <ellipse cx="20" cy="-75" rx="28" ry="16" fill="#E2E8F0" stroke="#334155" stroke-width="3"/>
      <ellipse cx="20" cy="-75" rx="16" ry="9" fill="#94A3B8"/>
      <circle cx="16" cy="-75" r="3" fill="#0F172A"/>
      <!-- OEM 3D Brand Monogram Badge -->
      <rect x="-35" y="10" width="70" height="24" rx="5" fill="#1E293B" stroke="#F8FAFC" stroke-width="2"/>
      <text x="0" y="26" fill="#F8FAFC" font-size="11" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">GENUINE</text>
      <!-- Bottom Fuel Petcock Cock valve -->
      <rect x="-80" y="85" width="20" height="20" fill="#64748B" rx="3"/>
      <line x1="-70" y1="105" x2="-70" y2="120" stroke="#64748B" stroke-width="6" stroke-linecap="round"/>
    </g>
  `,
  oil: (brandColor, tag) => `
    <g transform="translate(200, 195)">
      <!-- Ergonomic 1L / 1.2L Oil Bottle Canister -->
      <path d="M-65,110 L-75,-25 C-75,-45 -55,-65 -30,-65 L-30,-100 L30,-100 L30,-65 C55,-65 75,-45 75,-25 L65,110 Z" fill="#1E293B" stroke="#0F172A" stroke-width="5"/>
      <!-- Integrated Easy-Pour Side Handle -->
      <path d="M-75,-15 C-105,-15 -105,65 -75,65" fill="none" stroke="#1E293B" stroke-width="16" stroke-linecap="round"/>
      <path d="M-75,-15 C-105,-15 -105,65 -75,65" fill="none" stroke="${brandColor}" stroke-width="6" stroke-linecap="round"/>
      <!-- Threaded Screw Cap with Tamper Ring -->
      <rect x="-24" y="-125" width="48" height="28" rx="6" fill="${brandColor}" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="-24" y1="-110" x2="24" y2="-110" stroke="#FFF" stroke-width="2"/>
      <!-- Official Product Label Shield -->
      <rect x="-52" y="-35" width="104" height="120" rx="8" fill="#F8FAFC" stroke="${brandColor}" stroke-width="3"/>
      <!-- Label Header & Brand Bar -->
      <rect x="-52" y="-35" width="104" height="30" rx="6" fill="${brandColor}"/>
      <text x="0" y="-15" fill="#FFF" font-size="11" font-family="Arial, sans-serif" font-weight="900" text-anchor="middle">4T FULL SYNTHETIC</text>
      <!-- Viscosity Rating Box -->
      <rect x="-42" y="5" width="84" height="34" rx="4" fill="#0F172A"/>
      <text x="0" y="27" fill="#FACC15" font-size="16" font-family="Arial, sans-serif" font-weight="900" text-anchor="middle">10W-30</text>
      <text x="0" y="56" fill="#334155" font-size="9" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">JASO MA2 • API SN</text>
      <text x="0" y="73" fill="#DC2626" font-size="9" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">100% FACTORY SEALED</text>
    </g>
  `
};

function generateSvg(brandKey, partKey) {
  const brand = brandThemes[brandKey] || { name: brandKey.toUpperCase(), primary: '#C62828', secondary: '#212121', text: '#FFF', tag: 'GENUINE PARTS' };
  const drawingFn = partDrawings[partKey] || partDrawings.brake;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B0BEC5" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#78909C" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="400" height="400" rx="20" fill="url(#bgGrad)"/>
  
  <!-- Subtle Technical Grid Overlay -->
  <g stroke="#94A3B8" stroke-width="0.75" stroke-dasharray="4 6" opacity="0.4">
    <line x1="40" y1="0" x2="40" y2="400"/>
    <line x1="200" y1="0" x2="200" y2="400"/>
    <line x1="360" y1="0" x2="360" y2="400"/>
    <line x1="0" y1="40" x2="400" y2="40"/>
    <line x1="0" y1="200" x2="400" y2="200"/>
    <line x1="0" y1="360" x2="400" y2="360"/>
  </g>

  <!-- Top Brand Watermark Banner -->
  <rect x="20" y="16" width="160" height="30" rx="6" fill="${brand.primary}" filter="url(#cardShadow)"/>
  <text x="100" y="36" fill="${brand.text}" font-size="12" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" letter-spacing="1" text-anchor="middle">${brand.name}</text>

  <!-- Genuine OEM Guarantee Holographic Stamp -->
  <g transform="translate(330, 32)">
    <circle r="20" fill="#FEF08A" stroke="#CA8A04" stroke-width="2"/>
    <circle r="16" fill="none" stroke="#EAB308" stroke-width="1" stroke-dasharray="3 2"/>
    <text x="0" y="-3" fill="#854D0E" font-size="6" font-family="'Segoe UI', sans-serif" font-weight="900" text-anchor="middle">100%</text>
    <text x="0" y="6" fill="#854D0E" font-size="6" font-family="'Segoe UI', sans-serif" font-weight="900" text-anchor="middle">GENUINE</text>
    <text x="0" y="13" fill="#854D0E" font-size="5" font-family="'Segoe UI', sans-serif" font-weight="bold" text-anchor="middle">OEM</text>
  </g>

  <!-- Technical Part Drawing -->
  ${drawingFn(brand.primary, brand.tag)}

  <!-- Bottom Part Type & Tag Badge -->
  <rect x="24" y="348" width="352" height="36" rx="8" fill="#0F172A" opacity="0.92"/>
  <text x="40" y="371" fill="#38BDF8" font-size="11" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" letter-spacing="0.5">${brand.tag}</text>
  <text x="360" y="371" fill="#F8FAFC" font-size="12" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" text-anchor="end">${partKey.toUpperCase().replace('-', ' ')}</text>
</svg>
`;
}

// Generate for all 12 brands and 10 parts
const brands = Object.keys(brandThemes);
const parts = Object.keys(partDrawings);

let count = 0;
for (const b of brands) {
  for (const p of parts) {
    const filename = `${b}-${p}.svg`;
    const svgContent = generateSvg(b, p);

    for (const dir of targetDirs) {
      if (dir.includes('parts')) {
        fs.writeFileSync(path.join(dir, filename), svgContent, 'utf-8');
      }
    }
    count++;
  }
}

// Also generate 12 brand logo icons
for (const [key, b] of Object.entries(brandThemes)) {
  const brandSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="100%" height="100%">
  <rect width="240" height="80" rx="12" fill="${b.primary}"/>
  <text x="120" y="44" fill="${b.text}" font-size="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" letter-spacing="1.5" text-anchor="middle">${b.name}</text>
  <text x="120" y="64" fill="${b.text}" font-size="8" font-family="'Segoe UI', Roboto, sans-serif" font-weight="bold" opacity="0.85" letter-spacing="1" text-anchor="middle">OFFICIAL SPARE PARTS</text>
</svg>
  `;
  for (const dir of targetDirs) {
    if (dir.includes('brands')) {
      fs.writeFileSync(path.join(dir, `${key}.svg`), brandSvg, 'utf-8');
    }
  }
}

console.log(`✅ Successfully generated ${count} high-resolution OEM part SVGs and 12 brand icons.`);
