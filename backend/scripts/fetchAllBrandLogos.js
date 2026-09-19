import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../../frontend/public/assets/brands');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const logos = [
  { id: 'hero', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Hero_MotoCorp.svg' },
  { id: 'honda', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Honda_logo.svg' },
  { id: 'suzuki', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Suzuki_logo_2025_%28vertical%29.svg' },
  { id: 'tvs', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/TVS_logo.svg' },
  { id: 'yamaha', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Yamaha_Motor_Logo_%28full%29.svg' },
  { id: 'bajaj', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bajaj_Auto_Ltd_logo.svg' },
  { id: 'mahindra', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Mahindra_logo.svg' },
  { id: 'royal-enfield', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Royal_Enfield_logo_new.svg' },
  { id: 'ola', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/OLA_Electric_logo.svg' },
  { id: 'ather', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Ather-logo.svg' },
  { id: 'vida', ext: 'png', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Hero_VIDA_new_logo.png' }
];

async function download(item) {
  const filePath = path.join(targetDir, `${item.id}.${item.ext}`);
  try {
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/svg+xml,image/*,*/*'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`[OK] ${item.id}.${item.ext} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`[FAIL] ${item.id}:`, err.message);
  }
}

async function run() {
  for (const item of logos) {
    await download(item);
    // Be polite with 600ms gap
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
