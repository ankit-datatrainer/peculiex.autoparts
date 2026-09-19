import fs from 'fs';

const buf = fs.readFileSync('frontend/public/assets/brands/vida.png');
const b64 = buf.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <image href="data:image/png;base64,${b64}" width="320" height="100" preserveAspectRatio="xMidYMid meet" />
</svg>`;
fs.writeFileSync('frontend/public/assets/brands/vida.svg', svg);
fs.writeFileSync('assets/brands/vida.svg', svg);
console.log('Created vida.svg successfully!');
