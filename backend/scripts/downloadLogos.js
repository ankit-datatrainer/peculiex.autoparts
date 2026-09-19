import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../../frontend/public/assets/brands');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const list = [
  ['hero', 'https://commons.wikimedia.org/wiki/Special:FilePath/Hero_MotoCorp.svg'],
  ['honda', 'https://commons.wikimedia.org/wiki/Special:FilePath/Honda_logo.svg'],
  ['suzuki', 'https://commons.wikimedia.org/wiki/Special:FilePath/Suzuki_logo_2.svg'],
  ['tvs', 'https://commons.wikimedia.org/wiki/Special:FilePath/TVS_Motor_Company_Logo.svg'],
  ['yamaha', 'https://commons.wikimedia.org/wiki/Special:FilePath/Yamaha_Motor_Logo_(full).svg'],
  ['bajaj', 'https://commons.wikimedia.org/wiki/Special:FilePath/Bajaj_Auto_Logo.svg'],
  ['mahindra', 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Rise_logo.svg'],
  ['royal-enfield', 'https://commons.wikimedia.org/wiki/Special:FilePath/Royal_Enfield_logo.svg'],
  ['ola', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ola_Cabs_logo.svg'],
  ['ather', 'https://commons.wikimedia.org/wiki/Special:FilePath/Ather_Energy_Logo.svg']
];

for (const [name, url] of list) {
  const dest = path.join(targetDir, `${name}.svg`);
  try {
    execSync(`curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${url}" -o "${dest}"`, { stdio: 'inherit' });
    const stat = fs.statSync(dest);
    console.log(`✅ ${name}: ${stat.size} bytes`);
  } catch (e) {
    console.error(`❌ ${name}: ${e.message}`);
  }
}

// Copy to assets/brands as well
const assetsBrandsDir = path.resolve(__dirname, '../../assets/brands');
if (fs.existsSync(assetsBrandsDir)) {
  fs.cpSync(targetDir, assetsBrandsDir, { recursive: true });
}
