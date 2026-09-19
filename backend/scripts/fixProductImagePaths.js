import fs from 'fs';

function fixCatalog(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace empty .jpg with the correct part image based on id or brand-part
  // e.g. for hero-brake: /assets/parts/hero-brake.jpg
  // or /assets/parts/brake.jpg
  const jsonMatches = content.match(/\{\s*"id":\s*"([^"]+)",[\s\S]*?"image":\s*"\/assets\/parts\/\.jpg"/g);
  console.log(`Found ${jsonMatches ? jsonMatches.length : 0} items to fix in ${filePath}`);

  // Let's use a regex replace with callback function
  content = content.replace(
    /\{\s*"id":\s*"([^"]+)",([\s\S]*?)"partType":\s*"([^"]+)",([\s\S]*?)"image":\s*"\/assets\/parts\/\.jpg"/g,
    (match, id, mid1, partType, mid2) => {
      const partSlug = partType.toLowerCase().replace(/\s+/g, '-');
      return `{\n    "id": "${id}",${mid1}"partType": "${partType}",${mid2}"image": "/assets/parts/${partSlug}.jpg"`;
    }
  );

  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${filePath}`);
}

fixCatalog('frontend/src/lib/catalogData.js');
fixCatalog('backend/src/data/initialData.js');
