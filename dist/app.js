const products = [
  {id:'helmet-apex',brand:'Axor',name:'Apex Venomous ISI & DOT Certified Full Face Helmet',category:'Helmets',price:4394,mrp:4994,rating:4.5,reviews:2847,badge:'12% off',prime:true,image:'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV80Ml80NV9kZWdyZWVfYW5nbGVfaW1hZ2Vfb2ZfZnVsbC1mYWNlX21vdG9yY3ljbF84MDcwZGQ3OS1lMDg2LTQ4NzItYjU2YS0yZjEyNjhkOWI5MGJfMS5qcGc.jpg',fit:'Universal',about:['ISI and DOT certified full-face protection','Pinlock-ready clear visor with internal sun visor','Removable, washable liner and multi-point ventilation']},
  {id:'oil-castrol',brand:'Castrol',name:'POWER1 Ultimate 20W-50 4T Full Synthetic Engine Oil, 1 L',category:'Engine & Oils',price:756,mrp:999,rating:4.6,reviews:6412,badge:'24% off',prime:true,image:'https://cdn.moglix.com/p/jdOi5hGvca0q7.jpg',fit:'Most 150–500cc motorcycles',about:['Full synthetic 5-in-1 formula','JASO MA2 specification for wet clutch motorcycles','Helps control deposits and engine wear']},
  {id:'chain-kit',brand:'Rolon',name:'Premium Chain & Sprocket Kit for 150cc Motorcycles',category:'Drivetrain',price:1649,mrp:2199,rating:4.3,reviews:893,badge:'25% off',prime:true,image:'https://triumphdirect.co.uk/cdn/shop/products/T2017593-Chain_SprocketKit_1000x.jpg?v=1645182725',fit:'Model-specific fitment',about:['High tensile pre-lubricated drive chain','Precision-machined front and rear sprockets','Includes chain lock and installation guide']},
  {id:'brake-disc',brand:'Endurance',name:'Front Disc Brake Rotor with Heat Dissipation Vents',category:'Brakes',price:1299,mrp:1799,rating:4.2,reviews:426,badge:'28% off',prime:true,image:'https://www.honda-parts.eu/files/images/500x500xfafafa/45120mej901-brakedisks-productcategory.png',fit:'Honda CB series',about:['Precision-cut steel braking surface','Drilled pattern improves heat dissipation','Direct replacement for compatible factory disc']},
  {id:'led-headlight',brand:'HJG',name:'7-inch Round LED Headlight with DRL for Bikes',category:'Lighting',price:1899,mrp:2999,rating:4.4,reviews:3150,badge:'37% off',prime:true,image:'https://powerbrick-parts.com/cdn/shop/files/ZENITH-LED_1200x1200.png?v=1686832254',fit:'Universal 12V motorcycles',about:['High and low beam with daytime running light','Weather-resistant aluminium housing','Plug-and-play H4 connector on compatible bikes']},
  {id:'phone-mount',brand:'BOBO',name:'Anti-Vibration Aluminium Mobile Holder for Bike & Scooter',category:'Accessories',price:1299,mrp:1999,rating:4.5,reviews:7821,badge:'35% off',prime:true,image:'https://xploramoto.com/cdn/shop/files/KitEc-line.png?v=1698471618&width=1445',fit:'Universal handlebar fit',about:['360-degree viewing angle','Anti-vibration module protects phone camera','Secure mechanical lock for rough roads']},
  {id:'michelin-tyre',brand:'Michelin',name:'Sirac Street 100/90-18 Rear Motorcycle Tyre',category:'Tyres',price:2799,mrp:3399,rating:4.6,reviews:1535,badge:'18% off',prime:true,image:'https://static1.industrybuying.com/products/automotive-maintenance-and-accessories/tyres--wheels/tyres/AUT.TYR.107793916_1673437780582.webp',fit:'18-inch rear wheel',about:['Road-focused tread for confident wet and dry grip','Durable compound for everyday Indian road use','100/90-18 tubed fitment']},
  {id:'riding-gloves',brand:'Reise',name:'Rhodes Full Gauntlet Touring Riding Gloves, Orange',category:'Riding Gear',price:4649,mrp:5499,rating:4.7,reviews:368,badge:'15% off',prime:true,image:'https://www.reisemoto.com/cdn/shop/files/ReiseRhodes_Gloves_-_Orange-7431003013.9.jpg?v=1734413345&width=800',fit:'Sizes S to 3XL',about:['Goat leather construction with knuckle protection','Touchscreen-compatible fingertips','Ventilated panels and secure dual closure']},
  {id:'mirror-set',brand:'Uno Minda',name:'Universal Rear View Mirror Set for Bikes & Scooters',category:'Accessories',price:649,mrp:999,rating:4.1,reviews:2241,badge:'35% off',prime:true,image:'https://s.alicdn.com/%40sc04/kf/A2c48fbe145a54a20b1b42c6628a43b602/Universal-Motorcycle-Rearview-Mirror-Set-Durable-Bike-Side-Mirrors-High-Quality-Spare-Parts-for-Motorbikes-Scooters.png',fit:'8mm / 10mm adapter fit',about:['Wide viewing surface reduces blind spots','Adjustable, vibration-resistant stems','Adapters included for common fitments']},
  {id:'motul-oil',brand:'Motul',name:'7100 4T 20W-50 Fully Synthetic Engine Oil, 1 L',category:'Engine & Oils',price:1045,mrp:1299,rating:4.7,reviews:5290,badge:'20% off',prime:true,image:'https://f.fcdn.app/imgs/40f0d8/albanes.com.uy/albauy/0768/original/catalogo/74052_74052_1/1920-1200/motul-4t-7100-20w50-ma2-sintetico-1l-motul-4t-7100-20w50-ma2-sintetico-1l.jpg',fit:'Performance motorcycles',about:['100% synthetic ester technology','JASO MA2 wet clutch compatibility','Designed for high-temperature riding conditions']},
  {id:'seat-cover',brand:'GripX',name:'Ribbed Anti-Slip Waterproof Motorcycle Seat Cover',category:'Accessories',price:899,mrp:1399,rating:4.3,reviews:719,badge:'36% off',prime:false,image:'https://hardendurogear.com/wp-content/uploads/2024/09/Onegripper-seat-cover-ribbed-dark-blue-yellow.jpg',fit:'Universal trim-to-fit',about:['High-grip ribbed surface','Stretchable waterproof construction','Protects seat foam from rain and dust']},
  {id:'helmet-matte',brand:'Royal Enfield',name:'Street Prime Matte Black Full Face Helmet',category:'Helmets',price:3499,mrp:4199,rating:4.4,reviews:1160,badge:'17% off',prime:true,image:'https://www.v-twins.com.au/cdn/shop/files/ELDORADO_E70_MATTE_BLACK2.png?v=1732747814&width=460',fit:'Sizes M to XL',about:['Aerodynamic full-face shell','Clear scratch-resistant visor','Comfort liner with easy-release buckle']},
  {id:'phone-pro',brand:'Kewig',name:'M33 C2 One-Touch Metal Phone Holder',category:'Accessories',price:2299,mrp:2999,rating:4.5,reviews:982,badge:'23% off',prime:false,image:'https://candymotorsg.com/cdn/shop/files/kewigm33handlbar.png?v=1771055003&width=1445',fit:'Handlebar and mirror mount',about:['One-handed mechanical lock','Metal body with silicone contact pads','Portrait and landscape rotation']},
  {id:'oil-shell',brand:'Shell',name:'Advance AX3 10W-30 4-Stroke Motorcycle Engine Oil, 1 L',category:'Engine & Oils',price:425,mrp:520,rating:4.5,reviews:4380,badge:'18% off',prime:true,image:'https://www.shell.com.py/motorists/oils-lubricants/advance-for-motorcycles/advance-4-stroke-motorcycle-oil/shell-advance-ax3-cold-start/_jcr_content/root/main/section/standalone_asset.shellimg.jpeg/1675769844409/1l-advance-4t-ax3-cold-start-10w-30.jpeg',fit:'Commuter motorcycles',about:['Mineral oil for everyday four-stroke engines','Active cleansing formulation','Suitable for common commuter motorcycles']}
];

const categories = [
  {name:'Helmets',copy:'Full-face, open-face & modular',image:products[0].image},
  {name:'Engine & Oils',copy:'Oils, filters & spark plugs',image:products[1].image},
  {name:'Brakes',copy:'Pads, shoes, discs & fluids',image:products[3].image},
  {name:'Lighting',copy:'LED headlights & indicators',image:products[4].image},
  {name:'Accessories',copy:'Mounts, mirrors & comfort',image:products[5].image},
  {name:'Tyres',copy:'City, touring & performance',image:products[6].image},
  {name:'Riding Gear',copy:'Gloves, jackets & protection',image:products[7].image},
  {name:'Drivetrain',copy:'Chains, sprockets & clutch',image:products[2].image}
];

const models = {
  Hero:['Splendor Plus','HF Deluxe','Xtreme 160R','Xpulse 200'],Honda:['Activa 6G','Shine 125','Unicorn','Dio'],TVS:['Apache RTR 160','Jupiter','NTorq 125','Raider'],Bajaj:['Pulsar 150','Pulsar NS200','Avenger 220','Chetak'],
  'Royal Enfield':['Classic 350','Bullet 350','Hunter 350','Himalayan'],Yamaha:['FZ-S','R15 V4','MT-15','Fascino'],Suzuki:['Access 125','Gixxer','Burgman Street','Avenis'],KTM:['Duke 200','Duke 390','RC 200','Adventure 390']
};

const translations = {
  en:{hello:'Hello, sign in',account:'Account & Lists⌄',returns:'Returns',orders:'& Orders',cart:'Cart'},
  hi:{hello:'नमस्ते, साइन इन',account:'अकाउंट और लिस्ट⌄',returns:'वापसी',orders:'और ऑर्डर',cart:'कार्ट'},
  ta:{hello:'வணக்கம், உள்நுழைக',account:'கணக்கு & பட்டியல்⌄',returns:'திரும்ப',orders:'& ஆர்டர்கள்',cart:'கார்ட்'},
  te:{hello:'హలో, సైన్ ఇన్',account:'ఖాతా & జాబితాలు⌄',returns:'రిటర్న్స్',orders:'& ఆర్డర్లు',cart:'కార్ట్'},
  bn:{hello:'হ্যালো, সাইন ইন',account:'অ্যাকাউন্ট ও তালিকা⌄',returns:'ফেরত',orders:'ও অর্ডার',cart:'কার্ট'},
  mr:{hello:'नमस्कार, साइन इन',account:'खाते आणि याद्या⌄',returns:'परतावा',orders:'आणि ऑर्डर',cart:'कार्ट'}
};

const currency = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
const qs = (s,root=document)=>root.querySelector(s);
const qsa = (s,root=document)=>[...root.querySelectorAll(s)];
const escapeHtml = text => String(text).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fallbackImage = (label='MotoMart') => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700"><rect width="100%" height="100%" fill="#eef2f6"/><circle cx="350" cy="315" r="145" fill="#dce5ed"/><text x="350" y="330" text-anchor="middle" font-family="Arial" font-size="35" font-weight="700" fill="#173a5d">${label}</text><text x="350" y="385" text-anchor="middle" font-family="Arial" font-size="22" fill="#ff7a18">Two-wheeler essentials</text></svg>`)}`;
const imgError = `this.onerror=null;this.src='${fallbackImage().replace(/'/g,"%27")}'`;

let cart = JSON.parse(localStorage.getItem('motomart-cart') || '{}');
let garage = JSON.parse(localStorage.getItem('motomart-garage') || 'null');
let activeSlide = 0;
let heroInterval;
let toastTimer;

function stars(rating){const full=Math.round(rating);return `${'★'.repeat(full)}${'☆'.repeat(5-full)}`}
function productCard(product){return `<article class="product-card" data-product="${product.id}">
  <button class="product-image-button" data-open-product="${product.id}" aria-label="View ${escapeHtml(product.name)}"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="${imgError}"></button>
  <span class="discount-badge">${product.badge}</span><div class="card-info"><span class="card-brand">${product.brand}</span>
  <button class="card-title-button" data-open-product="${product.id}"><span class="card-title">${escapeHtml(product.name)}</span></button>
  <div class="rating"><span>${stars(product.rating)}</span> ${product.rating} · ${product.reviews.toLocaleString('en-IN')}</div>
  <div class="price-line"><span class="price">${currency(product.price)}</span><span class="mrp">${currency(product.mrp)}</span></div>
  <span class="prime">${product.prime?'✓ prime · FREE delivery':'Free delivery'}</span><button class="add-cart" data-add-cart="${product.id}">Add to cart</button></div></article>`}

function renderHome(){
  qs('#categoryGrid').innerHTML=categories.map(c=>`<button class="category-card" data-filter-button="${c.name}"><img src="${c.image}" alt="${c.name}" loading="lazy" onerror="${imgError}"><span class="category-card-content"><strong>${c.name}</strong><span>${c.copy}</span><i>→</i></span></button>`).join('');
  qs('#dealScroller').innerHTML=products.slice(0,8).map(productCard).join('');
  qs('#productRow').innerHTML=products.slice(5).concat(products.slice(0,5)).map(productCard).join('');
  if(garage){qs('#deliveryText').textContent=garage.pin || qs('#deliveryText').textContent;}
}

function renderHeroDots(){qs('#heroDots').innerHTML=qsa('.hero-slide').map((_,i)=>`<button class="${i===activeSlide?'active':''}" data-slide="${i}" aria-label="Show offer ${i+1}"></button>`).join('')}
function showSlide(index){const slides=qsa('.hero-slide');activeSlide=(index+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===activeSlide));renderHeroDots()}
function resetHero(){clearInterval(heroInterval);heroInterval=setInterval(()=>showSlide(activeSlide+1),6000)}

function showHome(){qs('#homeView').hidden=false;qs('#productView').hidden=true;qs('#searchView').hidden=true;document.title='MotoMart India | Bike & Scooter Parts'}
function openProduct(id){location.hash=`product:${id}`}
function renderProductDetail(id){
  const p=products.find(item=>item.id===id);if(!p){showHome();return}
  qs('#homeView').hidden=true;qs('#searchView').hidden=true;const view=qs('#productView');view.hidden=false;
  const related=products.filter(x=>x.category===p.category&&x.id!==p.id).concat(products.filter(x=>x.id!==p.id)).slice(0,6);
  view.innerHTML=`<div class="page-shell"><div class="breadcrumb"><button data-home>Home</button> › ${p.category} › ${p.brand}</div><section class="detail-layout">
    <div class="detail-gallery"><div class="thumb-list"><button class="active"><img src="${p.image}" alt="Front view" onerror="${imgError}"></button><button><img src="${p.image}" alt="Detail view" onerror="${imgError}"></button><button><img src="${p.image}" alt="Product view" onerror="${imgError}"></button></div><div class="main-image-wrap"><img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="${imgError}"></div></div>
    <div class="detail-info"><a class="detail-brand" href="#search:${encodeURIComponent(p.brand)}">Visit the ${p.brand} store</a><h1>${escapeHtml(p.name)}</h1><div class="detail-rating"><span>${p.rating}</span><span class="stars">${stars(p.rating)}</span><a href="#reviews">${p.reviews.toLocaleString('en-IN')} ratings</a></div>
      <div class="price-block"><span class="discount">-${Math.round((1-p.price/p.mrp)*100)}%</span><strong class="detail-price">${currency(p.price)}</strong><p>M.R.P.: <s>${currency(p.mrp)}</s></p><p>Inclusive of all taxes</p><p><strong>EMI</strong> starts at ${currency(Math.ceil(p.price/6))} per month.</p></div>
      <div class="offers"><h3>⚙ Offers</h3><div class="offer-cards"><div class="offer-card"><strong>Cashback</strong><p>Up to ₹100 cashback with select payment methods.</p></div><div class="offer-card"><strong>Bank offer</strong><p>Extra 5% off on eligible cards.</p></div><div class="offer-card"><strong>Partner offer</strong><p>Get GST invoice for business purchases.</p></div></div></div>
      <div class="about-product"><h3>About this item</h3><ul>${p.about.map(a=>`<li>${a}</li>`).join('')}<li><strong>Fitment:</strong> ${p.fit}. Check your vehicle before ordering.</li></ul></div>
    </div>
    <aside class="buy-box"><strong class="detail-price">${currency(p.price)}</strong><p class="delivery-message"><strong>FREE delivery</strong> by <b>${deliveryDate()}</b><br>Order within 6 hrs 22 mins.</p><p>⌖ Delivering to <strong>${escapeHtml(qs('#deliveryText').textContent)}</strong></p><p class="stock">In stock</p><label>Quantity <select id="detailQty">${[1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></label><button class="buy-add" data-detail-add="${p.id}">Add to cart</button><button class="buy-now" data-buy-now="${p.id}">Buy now</button><p class="secure-copy">🔒 Secure transaction<br><br>Sold by MotoMart Verified Seller<br>7-day replacement available</p></aside>
    <div class="detail-benefits"><div><span>💳</span>Pay on delivery</div><div><span>↩</span>Easy replacement</div><div><span>⚡</span>Fast delivery</div><div><span>🛡</span>Warranty support</div></div>
    <div class="related-detail"><h2>Customers also viewed</h2><div class="product-row">${related.map(productCard).join('')}</div></div></section></div>`;
  document.title=`${p.name} | MotoMart`;window.scrollTo(0,0)
}

function deliveryDate(){const d=new Date();d.setDate(d.getDate()+3);return d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}
function searchProducts(query,category='all'){
  const q=query.trim().toLowerCase();const matches=products.filter(p=>(category==='all'||p.category===category)&&(!q||`${p.name} ${p.brand} ${p.category} ${p.fit}`.toLowerCase().includes(q)));
  qs('#homeView').hidden=true;qs('#productView').hidden=true;const view=qs('#searchView');view.hidden=false;
  view.innerHTML=`<div class="search-head"><div><span class="eyebrow dark">CATALOG SEARCH</span><h1>${matches.length} result${matches.length===1?'':'s'} for “${escapeHtml(query||category)}”</h1><p>Prices include applicable taxes.</p></div><button class="outline-cta" data-home>Back to home</button></div>${matches.length?`<div class="search-results">${matches.map(productCard).join('')}</div>`:`<div class="search-empty"><span>🔧</span><h2>No exact parts found</h2><p>Try a product type, brand, bike model or a shorter search.</p><button data-home>Browse all products</button></div>`}`;
  document.title=`Search: ${query||category} | MotoMart`;window.scrollTo(0,0)
}

function route(){const hash=decodeURIComponent(location.hash.slice(1));if(hash.startsWith('product:'))renderProductDetail(hash.slice(8));else if(hash.startsWith('search:'))searchProducts(hash.slice(7));else showHome()}

function addToCart(id,qty=1){cart[id]=(cart[id]||0)+Number(qty);persistCart();updateCart();showToast(`${products.find(p=>p.id===id).brand} item added to cart`)}
function persistCart(){localStorage.setItem('motomart-cart',JSON.stringify(cart))}
function updateCart(){
  const count=Object.values(cart).reduce((a,b)=>a+b,0);qs('#cartCount').textContent=count;
  const entries=Object.entries(cart).filter(([id,qty])=>qty>0&&products.some(p=>p.id===id));
  qs('#cartItems').innerHTML=entries.length?entries.map(([id,qty])=>{const p=products.find(x=>x.id===id);return `<article class="cart-item"><img src="${p.image}" alt="" onerror="${imgError}"><div><h3>${escapeHtml(p.name)}</h3><strong>${currency(p.price*qty)}</strong><div class="qty-stepper"><button data-cart-dec="${id}" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-cart-inc="${id}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-cart-remove="${id}" aria-label="Remove item">×</button></article>`}).join(''):`<div class="empty-cart"><span>🛠</span><h3>Your cart is waiting</h3><p>Add the parts and gear you need for your next ride.</p></div>`;
  const subtotal=entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);qs('#cartSubtotal').textContent=currency(subtotal)
}
function openCart(){updateCart();qs('#cartDrawer').classList.add('open');qs('#cartDrawer').setAttribute('aria-hidden','false');showOverlay()}
function closePanels(){qs('#cartDrawer').classList.remove('open');qs('#cartDrawer').setAttribute('aria-hidden','true');qs('#mobileMenu').classList.remove('open');qs('#mobileMenu').setAttribute('aria-hidden','true');qsa('.modal').forEach(m=>m.hidden=true);hideOverlay()}
function showOverlay(){qs('#overlay').hidden=false;document.body.style.overflow='hidden'}
function hideOverlay(){qs('#overlay').hidden=true;document.body.style.overflow=''}
function openModal(id){closePanels();qs(id).hidden=false;showOverlay();setTimeout(()=>qs(`${id} input, ${id} select`)?.focus(),40)}
function showToast(message){const t=qs('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800)}

function runSearch(){const q=qs('#searchInput').value.trim();const category=qs('#categorySelect').value;if(q)location.hash=`search:${encodeURIComponent(q)}`;else if(category!=='all')searchProducts('',category);else searchProducts('all products')}
function showSuggestions(value){const q=value.trim().toLowerCase();const box=qs('#searchSuggestions');if(!q){box.classList.remove('open');return}const hits=products.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)).slice(0,5);box.innerHTML=hits.map(p=>`<button class="suggestion" type="button" data-open-product="${p.id}" role="option">⌕ <span><strong>${p.brand}</strong> ${escapeHtml(p.name)}</span></button>`).join('')||`<button class="suggestion" type="submit">⌕ Search for “${escapeHtml(value)}”</button>`;box.classList.add('open')}

function setupGarage(){
  const brand=qs('#vehicleBrand'),model=qs('#vehicleModel');brand.addEventListener('change',()=>{model.innerHTML='<option value="">Choose model</option>'+((models[brand.value]||[]).map(m=>`<option>${m}</option>`).join(''))});
  qs('#garageForm').addEventListener('submit',e=>{e.preventDefault();if(!brand.value||!model.value){showToast('Choose your vehicle brand and model');return}garage={type:qs('#vehicleType').value,brand:brand.value,model:model.value,pin:qs('#deliveryText').textContent};localStorage.setItem('motomart-garage',JSON.stringify(garage));qs('#garageResult').textContent=`✓ Garage saved: ${brand.value} ${model.value}. Showing compatible essentials.`;searchProducts('', 'all');qs('#searchView .search-head h1').textContent=`Parts for ${brand.value} ${model.value}`});
}

document.addEventListener('click',e=>{
  const target=e.target.closest('button,a');if(!target)return;
  if(target.matches('[data-open-product]')){e.preventDefault();openProduct(target.dataset.openProduct);qs('#searchSuggestions').classList.remove('open')}
  if(target.matches('[data-add-cart]')){e.preventDefault();addToCart(target.dataset.addCart)}
  if(target.matches('[data-detail-add]'))addToCart(target.dataset.detailAdd,qs('#detailQty')?.value||1);
  if(target.matches('[data-buy-now]')){addToCart(target.dataset.buyNow,qs('#detailQty')?.value||1);openCart()}
  if(target.matches('[data-filter-button]')){e.preventDefault();searchProducts('',target.dataset.filterButton)}
  if(target.matches('[data-filter-link]')){e.preventDefault();searchProducts('',target.dataset.filterLink)}
  if(target.matches('[data-home]')){e.preventDefault();location.hash='home';showHome();window.scrollTo(0,0)}
  if(target.matches('[data-scroll]')){e.preventDefault();const id=target.dataset.scroll;qs(id==='top'?'#top':`#${id}`)?.scrollIntoView({behavior:'smooth'})}
  if(target.matches('[data-slide]')){showSlide(Number(target.dataset.slide));resetHero()}
  if(target.matches('[data-close-modal],[data-close-menu]'))closePanels();
  if(target.matches('[data-cart-inc]')){cart[target.dataset.cartInc]=(cart[target.dataset.cartInc]||0)+1;persistCart();updateCart()}
  if(target.matches('[data-cart-dec]')){const id=target.dataset.cartDec;cart[id]=Math.max(0,(cart[id]||0)-1);if(!cart[id])delete cart[id];persistCart();updateCart()}
  if(target.matches('[data-cart-remove]')){delete cart[target.dataset.cartRemove];persistCart();updateCart()}
  if(target.matches('[data-scroll-row]'))qs('#productRow').scrollBy({left:target.dataset.scrollRow==='next'?500:-500,behavior:'smooth'})
});

qs('#heroPrev').addEventListener('click',()=>{showSlide(activeSlide-1);resetHero()});qs('#heroNext').addEventListener('click',()=>{showSlide(activeSlide+1);resetHero()});
qs('#cartButton').addEventListener('click',openCart);qs('#closeCart').addEventListener('click',closePanels);qs('#continueButton').addEventListener('click',closePanels);qs('#overlay').addEventListener('click',closePanels);
qs('#menuButton').addEventListener('click',()=>{qs('#mobileMenu').classList.add('open');qs('#mobileMenu').setAttribute('aria-hidden','false');showOverlay()});qs('#allMenuButton').addEventListener('click',()=>qs('#menuButton').click());
qs('#locationButton').addEventListener('click',()=>openModal('#locationModal'));qs('#mobileLocation').addEventListener('click',()=>openModal('#locationModal'));
[qs('#tradeButton'),qs('#footerTrade'),qs('#mobileTrade')].forEach(b=>b.addEventListener('click',()=>openModal('#tradeModal')));
[qs('#accountButton'),qs('#signInButton'),qs('#registerButton')].forEach(b=>b.addEventListener('click',()=>openModal('#signinModal')));
qs('#footerLanguage').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>qs('#languageSelect').focus(),400)});

qs('#searchForm').addEventListener('submit',e=>{e.preventDefault();qs('#searchSuggestions').classList.remove('open');runSearch()});
qs('#searchInput').addEventListener('input',e=>showSuggestions(e.target.value));
qs('#searchInput').addEventListener('keydown',e=>{if(e.key==='Escape')qs('#searchSuggestions').classList.remove('open')});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))qs('#searchSuggestions').classList.remove('open')});
qs('#languageSelect').addEventListener('change',e=>{const dict=translations[e.target.value]||translations.en;qsa('[data-i18n]').forEach(el=>el.textContent=dict[el.dataset.i18n]);showToast(`Language changed to ${e.target.options[e.target.selectedIndex].text}`)});

qs('#locationForm').addEventListener('submit',e=>{e.preventDefault();const pin=qs('#pincodeInput').value;if(!/^\d{6}$/.test(pin)){showToast('Enter a valid 6-digit PIN code');return}qs('#deliveryText').textContent=`India ${pin}`;if(garage){garage.pin=`India ${pin}`;localStorage.setItem('motomart-garage',JSON.stringify(garage))}closePanels();showToast('Delivery location updated')});
qs('#tradeForm').addEventListener('submit',e=>{e.preventDefault();closePanels();showToast('Thanks! Your trade-in estimate request is registered.');e.target.reset()});
qs('#signinForm').addEventListener('submit',e=>{e.preventDefault();closePanels();showToast('Demo sign-in submitted successfully.');e.target.reset()});
qs('#checkoutButton').addEventListener('click',()=>{if(!Object.keys(cart).length){showToast('Your cart is empty');return}closePanels();showToast('Checkout is ready for payment integration')});

function startTimer(){let seconds=8*3600+42*60+16;setInterval(()=>{seconds=Math.max(0,seconds-1);const h=String(Math.floor(seconds/3600)).padStart(2,'0'),m=String(Math.floor(seconds%3600/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');qs('#dealTimer').textContent=`${h}:${m}:${s}`},1000)}

function registerWebMcpTools(){
  const context=document.modelContext;if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  const register=tool=>Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});
  register({name:'search_motomart_catalog',title:'Search MotoMart catalog',description:'Search visible bike and scooter parts by product, brand, category or fitment and show the matching catalog results.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1,maxLength:100}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input.query!=='string'||!input.query.trim())throw new Error('A non-empty search query is required.');const query=input.query.trim();const matches=products.filter(p=>`${p.name} ${p.brand} ${p.category} ${p.fit}`.toLowerCase().includes(query.toLowerCase()));searchProducts(query);return{query,resultCount:matches.length,productIds:matches.map(p=>p.id)};}});
  register({name:'add_motomart_item_to_cart',title:'Add a MotoMart item to cart',description:'Add a known MotoMart catalog product to the visible shopping cart using its product ID.',inputSchema:{type:'object',properties:{productId:{type:'string'},quantity:{type:'integer',minimum:1,maximum:5}},required:['productId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const product=products.find(p=>p.id===input?.productId);if(!product)throw new Error('Unknown product ID.');const quantity=input.quantity??1;if(!Number.isInteger(quantity)||quantity<1||quantity>5)throw new Error('Quantity must be an integer from 1 to 5.');addToCart(product.id,quantity);return{productId:product.id,quantity,cartItemCount:Object.values(cart).reduce((a,b)=>a+b,0),subtotal:Object.entries(cart).reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0)};}});
}

renderHome();renderHeroDots();resetHero();updateCart();setupGarage();startTimer();route();registerWebMcpTools();window.addEventListener('hashchange',route);
