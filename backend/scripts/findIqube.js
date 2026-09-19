async function test() {
  const urls = [
    'https://www.tvsmotor.com/electric-scooters/tvs-iqube',
    'https://www.tvsmotor.com/iqube'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const html = await res.text();
      const imgs = html.match(/(?:https:)?\/\/[^\s"']+\.(?:svg|png|webp)/gi) || [];
      const iqubeImgs = imgs.filter(i => /iqube|logo/i.test(i));
      console.log(url, iqubeImgs.slice(0, 10));
    } catch(e) {
      console.error(e.message);
    }
  }
}
test();
