const products = [
  {id:'helmet-apex',brand:'Axor',name:'Apex Venomous ISI & DOT Certified Full Face Helmet',category:'Helmets',price:4394,mrp:4994,rating:4.5,reviews:2847,badge:'12% off',prime:true,image:'assets/ai-riding-essentials.png',fit:'Universal',about:['ISI and DOT certified full-face protection','Pinlock-ready clear visor with internal sun visor','Removable, washable liner and multi-point ventilation']},
  {id:'oil-castrol',brand:'Castrol',name:'POWER1 Ultimate 20W-50 4T Full Synthetic Engine Oil, 1 L',category:'Engine & Oils',price:756,mrp:999,rating:4.6,reviews:6412,badge:'24% off',prime:true,image:'assets/oil-castrol.jpg',fit:'Most 150–500cc motorcycles',about:['Full synthetic 5-in-1 formula','JASO MA2 specification for wet clutch motorcycles','Helps control deposits and engine wear']},
  {id:'chain-kit',brand:'Rolon',name:'Premium Chain & Sprocket Kit for 150cc Motorcycles',category:'Drivetrain',price:1649,mrp:2199,rating:4.3,reviews:893,badge:'25% off',prime:true,image:'assets/chain-kit.jpg',fit:'Model-specific fitment',about:['High tensile pre-lubricated drive chain','Precision-machined front and rear sprockets','Includes chain lock and installation guide']},
  {id:'brake-disc',brand:'Endurance',name:'Front Disc Brake Rotor with Heat Dissipation Vents',category:'Brakes',price:1299,mrp:1799,rating:4.2,reviews:426,badge:'28% off',prime:true,image:'assets/brake-disc.png',fit:'Honda CB series',about:['Precision-cut steel braking surface','Drilled pattern improves heat dissipation','Direct replacement for compatible factory disc']},
  {id:'led-headlight',brand:'HJG',name:'7-inch Round LED Headlight with DRL for Bikes',category:'Lighting',price:1899,mrp:2999,rating:4.4,reviews:3150,badge:'37% off',prime:true,image:'assets/led-headlight.png',fit:'Universal 12V motorcycles',about:['High and low beam with daytime running light','Weather-resistant aluminium housing','Plug-and-play H4 connector on compatible bikes']},
  {id:'phone-mount',brand:'BOBO',name:'Anti-Vibration Aluminium Mobile Holder for Bike & Scooter',category:'Accessories',price:1299,mrp:1999,rating:4.5,reviews:7821,badge:'35% off',prime:true,image:'assets/phone-mount.png',fit:'Universal handlebar fit',about:['360-degree viewing angle','Anti-vibration module protects phone camera','Secure mechanical lock for rough roads']},
  {id:'michelin-tyre',brand:'Michelin',name:'Sirac Street 100/90-18 Rear Motorcycle Tyre',category:'Tyres',price:2799,mrp:3399,rating:4.6,reviews:1535,badge:'18% off',prime:true,image:'assets/michelin-tyre.webp',fit:'18-inch rear wheel',about:['Road-focused tread for confident wet and dry grip','Durable compound for everyday Indian road use','100/90-18 tubed fitment']},
  {id:'riding-gloves',brand:'Reise',name:'Rhodes Full Gauntlet Touring Riding Gloves, Orange',category:'Riding Gear',price:4649,mrp:5499,rating:4.7,reviews:368,badge:'15% off',prime:true,image:'assets/riding-gloves.jpg',fit:'Sizes S to 3XL',about:['Goat leather construction with knuckle protection','Touchscreen-compatible fingertips','Ventilated panels and secure dual closure']},
  {id:'mirror-set',brand:'Uno Minda',name:'Universal Rear View Mirror Set for Bikes & Scooters',category:'Accessories',price:649,mrp:999,rating:4.1,reviews:2241,badge:'35% off',prime:true,image:'assets/mirror-set.png',fit:'8mm / 10mm adapter fit',about:['Wide viewing surface reduces blind spots','Adjustable, vibration-resistant stems','Adapters included for common fitments']},
  {id:'motul-oil',brand:'Motul',name:'7100 4T 20W-50 Fully Synthetic Engine Oil, 1 L',category:'Engine & Oils',price:1045,mrp:1299,rating:4.7,reviews:5290,badge:'20% off',prime:true,image:'assets/motul-oil.jpg',fit:'Performance motorcycles',about:['100% synthetic ester technology','JASO MA2 wet clutch compatibility','Designed for high-temperature riding conditions']},
  {id:'seat-cover',brand:'GripX',name:'Ribbed Anti-Slip Waterproof Motorcycle Seat Cover',category:'Accessories',price:899,mrp:1399,rating:4.3,reviews:719,badge:'36% off',prime:false,image:'assets/ai-riding-essentials.png',fit:'Universal trim-to-fit',about:['High-grip ribbed surface','Stretchable waterproof construction','Protects seat foam from rain and dust']},
  {id:'helmet-matte',brand:'Royal Enfield',name:'Street Prime Matte Black Full Face Helmet',category:'Helmets',price:3499,mrp:4199,rating:4.4,reviews:1160,badge:'17% off',prime:true,image:'assets/helmet-matte.png',fit:'Sizes M to XL',about:['Aerodynamic full-face shell','Clear scratch-resistant visor','Comfort liner with easy-release buckle']},
  {id:'phone-pro',brand:'Kewig',name:'M33 C2 One-Touch Metal Phone Holder',category:'Accessories',price:2299,mrp:2999,rating:4.5,reviews:982,badge:'23% off',prime:false,image:'assets/phone-pro.png',fit:'Handlebar and mirror mount',about:['One-handed mechanical lock','Metal body with silicone contact pads','Portrait and landscape rotation']},
  {id:'oil-shell',brand:'Shell',name:'Advance AX3 10W-30 4-Stroke Motorcycle Engine Oil, 1 L',category:'Engine & Oils',price:425,mrp:520,rating:4.5,reviews:4380,badge:'18% off',prime:true,image:'assets/oil-shell.jpg',fit:'Commuter motorcycles',about:['Mineral oil for everyday four-stroke engines','Active cleansing formulation','Suitable for common commuter motorcycles']}
  ,{id:'battery-xplore',brand:'Exide',name:'Xplore XLTZ4 12V Maintenance-Free Two-Wheeler Battery',category:'Batteries',price:1399,mrp:1750,rating:4.4,reviews:2386,badge:'20% off',prime:true,image:'assets/ai-maintenance-parts.png',fit:'Selected bikes and scooters',about:['Sealed maintenance-free design','Reliable starting performance','Check dimensions and terminal position before ordering']}
  ,{id:'air-filter',brand:'K&N',name:'High-Flow Replacement Air Filter for Performance Motorcycles',category:'Filters',price:1149,mrp:1499,rating:4.5,reviews:864,badge:'23% off',prime:true,image:'assets/ai-maintenance-parts.png',fit:'Model-specific fitment',about:['Washable and reusable filter media','Designed for improved airflow','Direct replacement on compatible models']}
  ,{id:'tail-bag',brand:'ViaTerra',name:'Claw Mini Waterproof Motorcycle Tail Bag, 28 L',category:'Luggage',price:2799,mrp:3299,rating:4.6,reviews:1047,badge:'15% off',prime:true,image:'assets/ai-riding-essentials.png',fit:'Universal pillion-seat mount',about:['Rain liner included','Quick-mount strap system','Reflective details for better visibility']}
  ,{id:'bike-polish',brand:'Waxpol',name:'Silicone Bike Polish and Protectant Spray, 450 ml',category:'Bike Care',price:299,mrp:399,rating:4.3,reviews:3156,badge:'25% off',prime:true,image:'assets/ai-commuter-accessories.png',fit:'All painted two-wheelers',about:['Restores shine on painted surfaces','Easy spray-and-wipe application','Helps protect against dust and water spots']}
  ,{id:'dual-horn',brand:'Bosch',name:'Windtone Compact Dual Horn Set for Motorcycles, 12V',category:'Electrical',price:449,mrp:699,rating:4.2,reviews:1902,badge:'36% off',prime:true,image:'assets/ai-commuter-accessories.png',fit:'Universal 12V fitment',about:['Compact weather-resistant housing','Clear twin-tone output','Professional installation recommended']}
  ,{id:'scooter-mat',brand:'AutoKraft',name:'Anti-Skid Floor Mat for Popular Indian Scooters',category:'Body & Styling',price:399,mrp:599,rating:4.1,reviews:728,badge:'33% off',prime:false,image:'assets/ai-commuter-accessories.png',fit:'Model-specific scooter fitment',about:['Textured anti-slip surface','Easy to wash and dry','Protects the original scooter floorboard']}
  ,{id:'spark-plug-iridium',brand:'NGK',name:'Iridium IX Performance Spark Plug for Motorcycles',category:'Engine & Oils',price:699,mrp:899,rating:4.6,reviews:1842,badge:'22% off',prime:true,image:'assets/ai-maintenance-parts.png',fit:'Selected petrol motorcycles',about:['Fine-wire iridium centre electrode','Consistent ignition and smooth starts','Confirm plug code before ordering']}
  ,{id:'brake-pads-ceramic',brand:'Uno Minda',name:'Ceramic Front Disc Brake Pad Set for Commuter Bikes',category:'Brakes',price:579,mrp:799,rating:4.4,reviews:1276,badge:'28% off',prime:true,image:'assets/brake-disc.png',fit:'Model-specific front calipers',about:['Low-noise ceramic compound','Stable braking across city temperatures','Includes one front pad set']}
  ,{id:'chain-lube-pro',brand:'Liqui Moly',name:'Motorbike Chain Lube Spray, White, 400 ml',category:'Bike Care',price:649,mrp:799,rating:4.7,reviews:3415,badge:'19% off',prime:true,image:'assets/oil-shell.jpg',fit:'All chain-driven motorcycles',about:['High adhesion and water resistance','Reduces chain wear and running noise','Suitable for O-ring and X-ring chains']}
  ,{id:'compact-horn-set',brand:'Roots',name:'Vibromini Compact Dual Tone Horn Set, 12V',category:'Electrical',price:699,mrp:999,rating:4.3,reviews:2108,badge:'30% off',prime:true,image:'assets/ai-commuter-accessories.png',fit:'Universal 12V two-wheelers',about:['Compact twin-tone design','Weather-resistant construction','Professional relay installation recommended']}
  ,{id:'portable-inflator',brand:'Grand Pitstop',name:'Portable Digital Tyre Inflator for Bikes & Scooters',category:'Tyres',price:1499,mrp:2199,rating:4.5,reviews:2687,badge:'32% off',prime:true,image:'assets/ai-commuter-accessories.png',fit:'Universal Schrader valve',about:['Digital pressure display','Compact carry-ready body','Auto-stop at selected pressure']}
  ,{id:'helmet-visor-clear',brand:'Steelbird',name:'Scratch-Resistant Clear Helmet Visor with Quick Release',category:'Helmets',price:499,mrp:699,rating:4.2,reviews:936,badge:'29% off',prime:true,image:'assets/helmet-matte.png',fit:'Selected Steelbird helmet shells',about:['Optically clear polycarbonate visor','Tool-free quick release tabs','Confirm helmet series before ordering']}
  ,{id:'bike-rain-cover',brand:'Godryft',name:'Waterproof Bike Cover with Heat Shield and Buckle',category:'Body & Styling',price:799,mrp:1199,rating:4.4,reviews:1769,badge:'33% off',prime:true,image:'assets/ai-riding-essentials.png',fit:'Sizes for commuter and touring bikes',about:['All-weather water-resistant fabric','Heat-shield panel near exhaust zone','Windproof lower buckle']}
  ,{id:'usb-charger-dual',brand:'Portronics',name:'Dual USB Fast Charger with Voltmeter for Two-Wheelers',category:'Accessories',price:899,mrp:1399,rating:4.3,reviews:1458,badge:'36% off',prime:true,image:'assets/phone-pro.png',fit:'Universal 12V handlebar fit',about:['Dual protected USB outputs','Live battery voltage display','Weather cap included']}
];

const categories = [
  {name:'Helmets',copy:'Full-face, open-face & modular',image:products[0].image},
  {name:'Engine & Oils',copy:'Oils, filters & spark plugs',image:products[1].image},
  {name:'Brakes',copy:'Pads, shoes, discs & fluids',image:products[3].image},
  {name:'Lighting',copy:'LED headlights & indicators',image:products[4].image},
  {name:'Accessories',copy:'Mounts, mirrors & comfort',image:products[5].image},
  {name:'Tyres',copy:'City, touring & performance',image:products[6].image},
  {name:'Riding Gear',copy:'Gloves, jackets & protection',image:products[7].image},
  {name:'Drivetrain',copy:'Chains, sprockets & clutch',image:products[2].image},
  {name:'Batteries',copy:'Reliable starts, every morning',image:'assets/ai-maintenance-parts.png'},
  {name:'Filters',copy:'Air, oil & fuel filters',image:'assets/ai-maintenance-parts.png'},
  {name:'Luggage',copy:'Tail bags & touring storage',image:'assets/ai-riding-essentials.png'},
  {name:'Bike Care',copy:'Cleaners, polish & protection',image:'assets/ai-commuter-accessories.png'},
  {name:'Electrical',copy:'Batteries, horns & wiring',image:'assets/ai-commuter-accessories.png'},
  {name:'Body & Styling',copy:'Mats, guards & panels',image:'assets/ai-commuter-accessories.png'}
];

const models = {
  Hero:['Splendor Plus','HF Deluxe','Xtreme 160R','Xpulse 200'],Honda:['Activa 6G','Shine 125','Unicorn','Dio'],TVS:['Apache RTR 160','Jupiter','NTorq 125','Raider'],Bajaj:['Pulsar 150','Pulsar NS200','Avenger 220','Chetak'],
  'Royal Enfield':['Classic 350','Bullet 350','Hunter 350','Himalayan'],Yamaha:['FZ-S','R15 V4','MT-15','Fascino'],Suzuki:['Access 125','Gixxer','Burgman Street','Avenis'],KTM:['Duke 200','Duke 390','RC 200','Adventure 390']
};

const translations = {
  hi:{
    'Skip to products':'प्रोडक्ट पर जाएँ','LIVE DEALS':'लाइव डील्स','Grand Garage Days — extra 10% off on selected essentials':'ग्रैंड गैराज डेज़ — चुनिंदा ज़रूरी सामान पर अतिरिक्त 10% छूट','Free delivery on selected bike and scooter parts':'चुनिंदा बाइक और स्कूटर पार्ट्स पर मुफ़्त डिलीवरी','Verified fitment for a safer, smarter ride':'सुरक्षित और बेहतर राइड के लिए सत्यापित फिटमेंट','Shop offers':'ऑफ़र देखें','Delivering to':'डिलीवरी यहाँ','All':'सभी',
    'Helmets':'हेलमेट','Engine & Oils':'इंजन और ऑयल','Brakes':'ब्रेक','Lighting':'लाइटिंग','Accessories':'एक्सेसरीज़','Tyres':'टायर','Riding Gear':'राइडिंग गियर','Batteries':'बैटरी','Filters':'फ़िल्टर','Luggage':'लगेज','Bike Care':'बाइक केयर','Electrical':'इलेक्ट्रिकल','Body & Styling':'बॉडी और स्टाइलिंग','Search bike parts, brands and models':'बाइक पार्ट्स, ब्रांड और मॉडल खोजें',
    'Hello, sign in':'नमस्ते, साइन इन','Account & Lists⌄':'अकाउंट और लिस्ट⌄','Returns':'वापसी','& Orders':'और ऑर्डर','Cart':'कार्ट',"Today's Deals":'आज की डील्स','Bike Parts':'बाइक पार्ट्स','Scooter Parts':'स्कूटर पार्ट्स','Engine Oils':'इंजन ऑयल','Tyres & Wheels':'टायर और व्हील','Sell / Trade-In':'बेचें / ट्रेड-इन','Customer Service':'ग्राहक सेवा','MotoMart Auto':'मोटोमार्ट ऑटो','Motorcycle':'मोटरसाइकिल','Scooter':'स्कूटर','Shop by vehicle':'वाहन के अनुसार खरीदें','Maintenance':'मेंटेनेंस','Body parts':'बॉडी पार्ट्स','Travel accessories':'ट्रैवल एक्सेसरीज़',
    'Hello, rider':'नमस्ते, राइडर','Shop by category':'कैटेगरी से खरीदें','Bike parts':'बाइक पार्ट्स','Scooter parts':'स्कूटर पार्ट्स','Engine oils':'इंजन ऑयल','Riding gear':'राइडिंग गियर','Help & account':'सहायता और अकाउंट','Change location':'लोकेशन बदलें','Sign in':'साइन इन',
    'Rider safety kits':'राइडर सेफ़्टी किट','Up to 35% off':'35% तक छूट','Helmets, gloves & mounts':'हेलमेट, ग्लव्स और माउंट','Shop safety gear':'सेफ़्टी गियर देखें','Service essentials':'सर्विस के ज़रूरी सामान','Starting ₹399':'₹399 से शुरू','Chains, brakes, oils & plugs':'चेन, ब्रेक, ऑयल और प्लग','See maintenance deals':'मेंटेनेंस डील्स देखें','Commuter upgrades':'कम्यूटर अपग्रेड','Under ₹1,999':'₹1,999 से कम','Lights, mirrors & inflators':'लाइट, मिरर और इन्फ्लेटर','Explore accessories':'एक्सेसरीज़ देखें','Helmet clearance':'हेलमेट क्लीयरेंस','Up to 40% off':'40% तक छूट','ISI-rated protection':'ISI-रेटेड सुरक्षा','Shop helmets':'हेलमेट देखें','Engine care store':'इंजन केयर स्टोर','From ₹425':'₹425 से','Everyday oils for every ride':'हर राइड के लिए रोज़मर्रा के ऑयल','Shop engine care':'इंजन केयर देखें',
    'YOUR GARAGE':'आपका गैराज','Find parts that fit your vehicle':'अपने वाहन में फिट होने वाले पार्ट्स खोजें','Vehicle type':'वाहन का प्रकार','Brand':'ब्रांड','Model':'मॉडल','Choose brand':'ब्रांड चुनें','Choose model':'मॉडल चुनें','Find compatible parts':'संगत पार्ट्स खोजें','SHOP YOUR WAY':'अपने तरीके से खरीदें','Everything your two-wheeler needs':'आपके टू-व्हीलर की हर ज़रूरत','See all categories':'सभी कैटेगरी देखें','LIMITED-TIME PRICES':'सीमित समय की कीमतें','Today’s garage deals':'आज की गैराज डील्स','Ends in':'समाप्त होने में','POPULAR WITH RIDERS':'राइडर्स की पसंद','Best sellers for bikes & scooters':'बाइक और स्कूटर के बेस्टसेलर',
    'RIDER PROTECT':'राइडर सुरक्षा','Gear that works as hard as you ride.':'आपकी राइड जितनी दमदार, उतना ही भरोसेमंद गियर।','ISI-certified helmets, CE-rated gloves and high-visibility essentials from trusted riding brands.':'भरोसेमंद ब्रांडों के ISI-सर्टिफाइड हेलमेट, CE-रेटेड ग्लव्स और हाई-विज़िबिलिटी सामान।','Explore protective gear':'प्रोटेक्टिव गियर देखें','average rider rating':'औसत राइडर रेटिंग','ESSENTIAL MAINTENANCE':'ज़रूरी मेंटेनेंस','Keep your ride road-ready':'अपनी राइड को सड़क के लिए तैयार रखें','View maintenance store':'मेंटेनेंस स्टोर देखें','Engine care':'इंजन केयर','Oils, filters & spark plugs':'ऑयल, फ़िल्टर और स्पार्क प्लग','Brake service':'ब्रेक सर्विस','Pads, discs & fluids':'पैड, डिस्क और फ्लूइड','Lights, batteries & horns':'लाइट, बैटरी और हॉर्न','Grip for every road':'हर सड़क के लिए ग्रिप',
    'Verified fitment':'सत्यापित फिटमेंट','Vehicle-compatible parts':'वाहन-संगत पार्ट्स','10-day returns':'10 दिन में वापसी','Easy replacement support':'आसान रिप्लेसमेंट सहायता','Fast delivery':'तेज़ डिलीवरी','Across 18,000+ pin codes':'18,000+ पिन कोड तक','Secure payments':'सुरक्षित भुगतान','UPI, cards & pay on delivery':'UPI, कार्ड और पे ऑन डिलीवरी','See personalised picks for your ride':'अपनी राइड के लिए व्यक्तिगत सुझाव देखें','Sign in securely':'सुरक्षित साइन इन','New to MotoMart?':'MotoMart पर नए हैं?','Create an account':'अकाउंट बनाएँ',
    'Get to know us':'हमारे बारे में','About MotoMart':'MotoMart के बारे में','Careers':'करियर','Press releases':'प्रेस रिलीज़','Connect with us':'हमसे जुड़ें','Make money with us':'हमारे साथ कमाएँ','Sell or trade parts':'पार्ट्स बेचें या ट्रेड करें','Become a seller':'विक्रेता बनें','Advertise products':'प्रोडक्ट का विज्ञापन करें','Let us help you':'हम आपकी मदद करें','Your account':'आपका अकाउंट','Returns centre':'रिटर्न सेंटर','Fitment help':'फिटमेंट सहायता','Contact us':'संपर्क करें','English':'अंग्रेज़ी','Conditions of use':'उपयोग की शर्तें','Privacy notice':'गोपनीयता सूचना','Interest-based ads':'रुचि-आधारित विज्ञापन','Back to top':'ऊपर जाएँ',
    'YOUR CART':'आपका कार्ट','Ready for the road':'राइड के लिए तैयार','Subtotal':'कुल','Taxes included. Delivery calculated at checkout.':'कर शामिल हैं। डिलीवरी चेकआउट पर तय होगी।','Proceed to checkout':'चेकआउट करें','Continue shopping':'खरीदारी जारी रखें','Choose your location':'अपनी लोकेशन चुनें','Enter a PIN code to see delivery options and local availability.':'डिलीवरी विकल्प और उपलब्धता देखने के लिए पिन कोड डालें।','6-digit PIN code':'6 अंकों का पिन कोड','Apply':'लागू करें','MOTOMART TRADE-IN':'मोटोमार्ट ट्रेड-इन','Turn old parts into ride credits':'पुराने पार्ट्स को राइड क्रेडिट में बदलें','Tell us what you want to sell. We’ll share an estimated exchange value.':'बताएँ कि आप क्या बेचना चाहते हैं। हम अनुमानित एक्सचेंज मूल्य बताएँगे।','Item type':'आइटम का प्रकार','Choose an item':'आइटम चुनें','Helmet':'हेलमेट','Exhaust':'एग्ज़ॉस्ट','Alloy wheel':'अलॉय व्हील','Riding jacket':'राइडिंग जैकेट','Other part':'अन्य पार्ट','Condition':'स्थिति','Choose condition':'स्थिति चुनें','Like new':'लगभग नया','Good':'अच्छा','Well used':'काफ़ी उपयोग किया हुआ','Your mobile number':'आपका मोबाइल नंबर','10-digit number':'10 अंकों का नंबर','Get estimate':'अनुमान पाएँ','Sign in to MotoMart':'MotoMart में साइन इन करें','Email or mobile number':'ईमेल या मोबाइल नंबर','Enter email or mobile':'ईमेल या मोबाइल डालें','Continue':'जारी रखें','By continuing, you agree to MotoMart’s Conditions of Use and Privacy Notice.':'जारी रखकर आप MotoMart की उपयोग शर्तों और गोपनीयता सूचना से सहमत होते हैं।',
    'Add to cart':'कार्ट में जोड़ें','Free delivery':'मुफ़्त डिलीवरी','FREE delivery':'मुफ़्त डिलीवरी','Home':'होम','Visit the':'देखें','store':'स्टोर','ratings':'रेटिंग','Inclusive of all taxes':'सभी कर शामिल','Offers':'ऑफ़र','Cashback':'कैशबैक','Bank offer':'बैंक ऑफ़र','Partner offer':'पार्टनर ऑफ़र','About this item':'इस आइटम के बारे में','Fitment:':'फिटमेंट:','Check your vehicle before ordering.':'ऑर्डर से पहले अपना वाहन जाँचें।','Order within 6 hrs 22 mins.':'6 घंटे 22 मिनट में ऑर्डर करें।','In stock':'स्टॉक में','Quantity':'मात्रा','Buy now':'अभी खरीदें','Secure transaction':'सुरक्षित लेनदेन','Sold by MotoMart Verified Seller':'MotoMart सत्यापित विक्रेता द्वारा बेचा गया','7-day replacement available':'7 दिन का रिप्लेसमेंट उपलब्ध','Pay on delivery':'डिलीवरी पर भुगतान','Easy replacement':'आसान रिप्लेसमेंट','Warranty support':'वारंटी सहायता','Customers also viewed':'ग्राहकों ने यह भी देखा','CATALOG SEARCH':'कैटलॉग खोज','Prices include applicable taxes.':'कीमतों में लागू कर शामिल हैं।','Back to home':'होम पर वापस','No exact parts found':'सटीक पार्ट नहीं मिले','Try a product type, brand, bike model or a shorter search.':'प्रोडक्ट प्रकार, ब्रांड, बाइक मॉडल या छोटा खोज शब्द आज़माएँ।','Browse all products':'सभी प्रोडक्ट देखें','Shopping Cart':'शॉपिंग कार्ट','Eligible for FREE delivery':'मुफ़्त डिलीवरी के योग्य','Delete':'हटाएँ','Proceed to Buy':'खरीदने के लिए आगे बढ़ें','Your MotoMart cart is empty':'आपका MotoMart कार्ट खाली है','Shop today’s deals on bike parts, scooter accessories and riding gear.':'बाइक पार्ट्स, स्कूटर एक्सेसरीज़ और राइडिंग गियर पर आज की डील्स देखें।','Your cart is waiting':'आपका कार्ट इंतज़ार कर रहा है','Add the parts and gear you need for your next ride.':'अपनी अगली राइड के लिए ज़रूरी पार्ट्स और गियर जोड़ें।'
  },
  mr:{
    'Skip to products':'उत्पादनांकडे जा','LIVE DEALS':'लाइव्ह डील्स','Grand Garage Days — extra 10% off on selected essentials':'ग्रँड गॅरेज डेज — निवडक आवश्यक वस्तूंवर अतिरिक्त 10% सूट','Free delivery on selected bike and scooter parts':'निवडक बाइक आणि स्कूटर पार्ट्सवर मोफत डिलिव्हरी','Verified fitment for a safer, smarter ride':'सुरक्षित आणि स्मार्ट राइडसाठी पडताळलेले फिटमेंट','Shop offers':'ऑफर्स पाहा','Delivering to':'येथे डिलिव्हरी','All':'सर्व',
    'Helmets':'हेल्मेट','Engine & Oils':'इंजिन आणि ऑइल','Brakes':'ब्रेक','Lighting':'लाइटिंग','Accessories':'ॲक्सेसरीज','Tyres':'टायर','Riding Gear':'राइडिंग गियर','Batteries':'बॅटरी','Filters':'फिल्टर','Luggage':'लगेज','Bike Care':'बाइक केअर','Electrical':'इलेक्ट्रिकल','Body & Styling':'बॉडी आणि स्टाइलिंग','Search bike parts, brands and models':'बाइक पार्ट्स, ब्रँड आणि मॉडेल शोधा',
    'Hello, sign in':'नमस्कार, साइन इन','Account & Lists⌄':'खाते आणि याद्या⌄','Returns':'परतावा','& Orders':'आणि ऑर्डर','Cart':'कार्ट',"Today's Deals":'आजच्या डील्स','Bike Parts':'बाइक पार्ट्स','Scooter Parts':'स्कूटर पार्ट्स','Engine Oils':'इंजिन ऑइल','Tyres & Wheels':'टायर आणि व्हील','Sell / Trade-In':'विका / ट्रेड-इन','Customer Service':'ग्राहक सेवा','MotoMart Auto':'मोटोमार्ट ऑटो','Motorcycle':'मोटरसायकल','Scooter':'स्कूटर','Shop by vehicle':'वाहनानुसार खरेदी','Maintenance':'देखभाल','Body parts':'बॉडी पार्ट्स','Travel accessories':'प्रवास ॲक्सेसरीज',
    'Hello, rider':'नमस्कार, रायडर','Shop by category':'श्रेणीनुसार खरेदी','Bike parts':'बाइक पार्ट्स','Scooter parts':'स्कूटर पार्ट्स','Engine oils':'इंजिन ऑइल','Riding gear':'राइडिंग गियर','Help & account':'मदत आणि खाते','Change location':'ठिकाण बदला','Sign in':'साइन इन',
    'Rider safety kits':'रायडर सुरक्षा किट','Up to 35% off':'35% पर्यंत सूट','Helmets, gloves & mounts':'हेल्मेट, ग्लोव्हज आणि माउंट','Shop safety gear':'सुरक्षा गियर पाहा','Service essentials':'सर्व्हिस आवश्यक वस्तू','Starting ₹399':'₹399 पासून','Chains, brakes, oils & plugs':'चेन, ब्रेक, ऑइल आणि प्लग','See maintenance deals':'देखभाल डील्स पाहा','Commuter upgrades':'कम्युटर अपग्रेड','Under ₹1,999':'₹1,999 पेक्षा कमी','Lights, mirrors & inflators':'लाइट, मिरर आणि इन्फ्लेटर','Explore accessories':'ॲक्सेसरीज पाहा','Helmet clearance':'हेल्मेट क्लिअरन्स','Up to 40% off':'40% पर्यंत सूट','ISI-rated protection':'ISI-रेटेड सुरक्षा','Shop helmets':'हेल्मेट पाहा','Engine care store':'इंजिन केअर स्टोअर','From ₹425':'₹425 पासून','Everyday oils for every ride':'प्रत्येक राइडसाठी रोजचे ऑइल','Shop engine care':'इंजिन केअर पाहा',
    'YOUR GARAGE':'तुमचे गॅरेज','Find parts that fit your vehicle':'तुमच्या वाहनाला जुळणारे पार्ट्स शोधा','Vehicle type':'वाहन प्रकार','Brand':'ब्रँड','Model':'मॉडेल','Choose brand':'ब्रँड निवडा','Choose model':'मॉडेल निवडा','Find compatible parts':'सुसंगत पार्ट्स शोधा','SHOP YOUR WAY':'तुमच्या पद्धतीने खरेदी','Everything your two-wheeler needs':'तुमच्या दुचाकीला लागणारी प्रत्येक गोष्ट','See all categories':'सर्व श्रेणी पाहा','LIMITED-TIME PRICES':'मर्यादित वेळेच्या किंमती','Today’s garage deals':'आजच्या गॅरेज डील्स','Ends in':'संपण्यासाठी','POPULAR WITH RIDERS':'रायडर्सची पसंती','Best sellers for bikes & scooters':'बाइक आणि स्कूटरचे बेस्टसेलर',
    'RIDER PROTECT':'रायडर संरक्षण','Gear that works as hard as you ride.':'तुमच्या राइडइतकेच मेहनती गियर.','ISI-certified helmets, CE-rated gloves and high-visibility essentials from trusted riding brands.':'विश्वसनीय ब्रँडचे ISI-प्रमाणित हेल्मेट, CE-रेटेड ग्लोव्हज आणि हाय-व्हिजिबिलिटी वस्तू.','Explore protective gear':'संरक्षक गियर पाहा','average rider rating':'सरासरी रायडर रेटिंग','ESSENTIAL MAINTENANCE':'आवश्यक देखभाल','Keep your ride road-ready':'तुमची राइड रस्त्यासाठी तयार ठेवा','View maintenance store':'देखभाल स्टोअर पाहा','Engine care':'इंजिन केअर','Oils, filters & spark plugs':'ऑइल, फिल्टर आणि स्पार्क प्लग','Brake service':'ब्रेक सर्व्हिस','Pads, discs & fluids':'पॅड, डिस्क आणि फ्लुइड','Lights, batteries & horns':'लाइट, बॅटरी आणि हॉर्न','Grip for every road':'प्रत्येक रस्त्यासाठी ग्रिप',
    'Verified fitment':'पडताळलेले फिटमेंट','Vehicle-compatible parts':'वाहनाशी सुसंगत पार्ट्स','10-day returns':'10 दिवसांत परतावा','Easy replacement support':'सुलभ रिप्लेसमेंट मदत','Fast delivery':'जलद डिलिव्हरी','Across 18,000+ pin codes':'18,000+ पिन कोडमध्ये','Secure payments':'सुरक्षित पेमेंट','UPI, cards & pay on delivery':'UPI, कार्ड आणि पे ऑन डिलिव्हरी','See personalised picks for your ride':'तुमच्या राइडसाठी वैयक्तिक निवडी पाहा','Sign in securely':'सुरक्षित साइन इन','New to MotoMart?':'MotoMart वर नवीन आहात?','Create an account':'खाते तयार करा',
    'Get to know us':'आमच्याबद्दल','About MotoMart':'MotoMart बद्दल','Careers':'करिअर','Press releases':'प्रेस रिलीज','Connect with us':'आमच्याशी जोडा','Make money with us':'आमच्यासोबत कमवा','Sell or trade parts':'पार्ट्स विका किंवा ट्रेड करा','Become a seller':'विक्रेता बना','Advertise products':'उत्पादनांची जाहिरात करा','Let us help you':'आम्हाला मदत करू द्या','Your account':'तुमचे खाते','Returns centre':'परतावा केंद्र','Fitment help':'फिटमेंट मदत','Contact us':'संपर्क करा','English':'इंग्रजी','Conditions of use':'वापराच्या अटी','Privacy notice':'गोपनीयता सूचना','Interest-based ads':'आवडीनुसार जाहिराती','Back to top':'वर जा',
    'YOUR CART':'तुमचा कार्ट','Ready for the road':'राइडसाठी तयार','Subtotal':'एकूण','Taxes included. Delivery calculated at checkout.':'कर समाविष्ट. डिलिव्हरी चेकआउटवेळी मोजली जाईल.','Proceed to checkout':'चेकआउट करा','Continue shopping':'खरेदी सुरू ठेवा','Choose your location':'तुमचे ठिकाण निवडा','Enter a PIN code to see delivery options and local availability.':'डिलिव्हरी पर्याय आणि उपलब्धता पाहण्यासाठी पिन कोड टाका.','6-digit PIN code':'6 अंकी पिन कोड','Apply':'लागू करा','MOTOMART TRADE-IN':'मोटोमार्ट ट्रेड-इन','Turn old parts into ride credits':'जुने पार्ट्स राइड क्रेडिटमध्ये बदला','Tell us what you want to sell. We’ll share an estimated exchange value.':'तुम्हाला काय विकायचे आहे ते सांगा. आम्ही अंदाजे एक्सचेंज मूल्य देऊ.','Item type':'वस्तूचा प्रकार','Choose an item':'वस्तू निवडा','Helmet':'हेल्मेट','Exhaust':'एक्झॉस्ट','Alloy wheel':'अलॉय व्हील','Riding jacket':'राइडिंग जॅकेट','Other part':'इतर पार्ट','Condition':'स्थिती','Choose condition':'स्थिती निवडा','Like new':'नव्यासारखे','Good':'चांगले','Well used':'अधिक वापरलेले','Your mobile number':'तुमचा मोबाइल नंबर','10-digit number':'10 अंकी नंबर','Get estimate':'अंदाज मिळवा','Sign in to MotoMart':'MotoMart मध्ये साइन इन करा','Email or mobile number':'ईमेल किंवा मोबाइल नंबर','Enter email or mobile':'ईमेल किंवा मोबाइल टाका','Continue':'पुढे जा','By continuing, you agree to MotoMart’s Conditions of Use and Privacy Notice.':'पुढे जाऊन तुम्ही MotoMart च्या वापराच्या अटी आणि गोपनीयता सूचनेशी सहमत होता.',
    'Add to cart':'कार्टमध्ये टाका','Free delivery':'मोफत डिलिव्हरी','FREE delivery':'मोफत डिलिव्हरी','Home':'होम','Visit the':'भेट द्या','store':'स्टोअर','ratings':'रेटिंग','Inclusive of all taxes':'सर्व कर समाविष्ट','Offers':'ऑफर्स','Cashback':'कॅशबॅक','Bank offer':'बँक ऑफर','Partner offer':'पार्टनर ऑफर','About this item':'या वस्तूबद्दल','Fitment:':'फिटमेंट:','Check your vehicle before ordering.':'ऑर्डर करण्यापूर्वी वाहन तपासा.','Order within 6 hrs 22 mins.':'6 तास 22 मिनिटांत ऑर्डर करा.','In stock':'स्टॉकमध्ये','Quantity':'संख्या','Buy now':'आता खरेदी करा','Secure transaction':'सुरक्षित व्यवहार','Sold by MotoMart Verified Seller':'MotoMart सत्यापित विक्रेत्याकडून विक्री','7-day replacement available':'7 दिवसांचे रिप्लेसमेंट उपलब्ध','Pay on delivery':'डिलिव्हरीवेळी पेमेंट','Easy replacement':'सुलभ रिप्लेसमेंट','Warranty support':'वॉरंटी मदत','Customers also viewed':'ग्राहकांनी हेही पाहिले','CATALOG SEARCH':'कॅटलॉग शोध','Prices include applicable taxes.':'किंमतींमध्ये लागू कर समाविष्ट आहेत.','Back to home':'होमवर परत','No exact parts found':'अचूक पार्ट सापडले नाहीत','Try a product type, brand, bike model or a shorter search.':'उत्पादन प्रकार, ब्रँड, बाइक मॉडेल किंवा छोटा शोध शब्द वापरा.','Browse all products':'सर्व उत्पादने पाहा','Shopping Cart':'शॉपिंग कार्ट','Eligible for FREE delivery':'मोफत डिलिव्हरीसाठी पात्र','Delete':'काढा','Proceed to Buy':'खरेदीसाठी पुढे जा','Your MotoMart cart is empty':'तुमचा MotoMart कार्ट रिकामा आहे','Shop today’s deals on bike parts, scooter accessories and riding gear.':'बाइक पार्ट्स, स्कूटर ॲक्सेसरीज आणि राइडिंग गियरवरील आजच्या डील्स पाहा.','Your cart is waiting':'तुमचा कार्ट वाट पाहत आहे','Add the parts and gear you need for your next ride.':'पुढील राइडसाठी लागणारे पार्ट्स आणि गियर जोडा.'
  }
};

Object.assign(translations.hi,{
  'Full-face, open-face & modular':'फुल-फेस, ओपन-फेस और मॉड्यूलर','Pads, shoes, discs & fluids':'पैड, शू, डिस्क और फ्लूइड','LED headlights & indicators':'LED हेडलाइट और इंडिकेटर','Mounts, mirrors & comfort':'माउंट, मिरर और कम्फर्ट','City, touring & performance':'सिटी, टूरिंग और परफ़ॉर्मेंस','Gloves, jackets & protection':'ग्लव्स, जैकेट और सुरक्षा','Chains, sprockets & clutch':'चेन, स्प्रोकेट और क्लच','Reliable starts, every morning':'हर सुबह भरोसेमंद स्टार्ट','Air, oil & fuel filters':'एयर, ऑयल और फ्यूल फ़िल्टर','Tail bags & touring storage':'टेल बैग और टूरिंग स्टोरेज','Cleaners, polish & protection':'क्लीनर, पॉलिश और सुरक्षा','Batteries, horns & wiring':'बैटरी, हॉर्न और वायरिंग','Mats, guards & panels':'मैट, गार्ड और पैनल','Drivetrain':'ड्राइवट्रेन'
});
Object.assign(translations.mr,{
  'Full-face, open-face & modular':'फुल-फेस, ओपन-फेस आणि मॉड्युलर','Pads, shoes, discs & fluids':'पॅड, शू, डिस्क आणि फ्लुइड','LED headlights & indicators':'LED हेडलाइट आणि इंडिकेटर','Mounts, mirrors & comfort':'माउंट, मिरर आणि आराम','City, touring & performance':'सिटी, टूरिंग आणि परफॉर्मन्स','Gloves, jackets & protection':'ग्लोव्हज, जॅकेट आणि सुरक्षा','Chains, sprockets & clutch':'चेन, स्प्रॉकेट आणि क्लच','Reliable starts, every morning':'दर सकाळी विश्वसनीय स्टार्ट','Air, oil & fuel filters':'एअर, ऑइल आणि फ्युएल फिल्टर','Tail bags & touring storage':'टेल बॅग आणि टूरिंग स्टोरेज','Cleaners, polish & protection':'क्लीनर, पॉलिश आणि सुरक्षा','Batteries, horns & wiring':'बॅटरी, हॉर्न आणि वायरिंग','Mats, guards & panels':'मॅट, गार्ड आणि पॅनेल','Drivetrain':'ड्राइव्हट्रेन'
});
Object.assign(translations.hi,{
  'MORE FOR YOUR RIDE':'आपकी राइड के लिए और भी','Built to go the distance':'लंबे सफ़र के लिए तैयार','Hand-picked essentials for everyday commutes, weekend rides and workshop care.':'रोज़ के सफ़र, वीकेंड राइड और वर्कशॉप के लिए चुना हुआ ज़रूरी सामान।','Explore all products':'सभी प्रोडक्ट देखें'
});
Object.assign(translations.mr,{
  'MORE FOR YOUR RIDE':'तुमच्या राइडसाठी आणखी','Built to go the distance':'लांब प्रवासासाठी सज्ज','Hand-picked essentials for everyday commutes, weekend rides and workshop care.':'रोजचा प्रवास, वीकेंड राइड आणि वर्कशॉपसाठी निवडक आवश्यक वस्तू.','Explore all products':'सर्व उत्पादने पाहा'
});

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
let currentLanguage = ['en','hi','mr'].includes(localStorage.getItem('motomart-language')) ? localStorage.getItem('motomart-language') : 'en';
const originalTextNodes = new WeakMap();

function tr(text){return currentLanguage==='en'?text:(translations[currentLanguage]?.[text]||text)}
function local(en,hi,mr){return currentLanguage==='hi'?hi:currentLanguage==='mr'?mr:en}
function translateTextNodes(root=document.body){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
    if(!node.nodeValue.trim()||['SCRIPT','STYLE'].includes(node.parentElement?.tagName))return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }});
  let node;
  while((node=walker.nextNode())){
    if(!originalTextNodes.has(node))originalTextNodes.set(node,node.nodeValue);
    const original=originalTextNodes.get(node),plain=original.trim(),translated=tr(plain);
    node.nodeValue=plain===translated?original:original.replace(plain,translated);
  }
}
function applyLanguage(language,{announce=false}={}){
  currentLanguage=['en','hi','mr'].includes(language)?language:'en';
  localStorage.setItem('motomart-language',currentLanguage);
  document.documentElement.lang=currentLanguage;
  qs('#languageSelect').value=currentLanguage;
  qs('#searchInput').placeholder=tr('Search bike parts, brands and models');
  qs('#pincodeInput').placeholder=tr('6-digit PIN code');
  qs('#tradeModal input').placeholder=tr('10-digit number');
  qs('#signinModal input').placeholder=tr('Enter email or mobile');
  qs('#footerLanguage').textContent=`🌐 ${currentLanguage==='hi'?'हिन्दी':currentLanguage==='mr'?'मराठी':'English'}`;
  qs('#floatingBackTop').setAttribute('aria-label',tr('Back to top'));
  qs('#floatingBackTop').title=tr('Back to top');
  renderHome();
  updateCart();
  route();
  translateTextNodes();
  if(announce)showToast(currentLanguage==='hi'?'भाषा हिन्दी में बदल दी गई':currentLanguage==='mr'?'भाषा मराठीत बदलली':'Language changed to English');
}

function stars(rating){const full=Math.round(rating);return `${'★'.repeat(full)}${'☆'.repeat(5-full)}`}
function productCard(product){return `<article class="product-card" data-product="${product.id}">
  <button class="product-image-button" data-open-product="${product.id}" aria-label="View ${escapeHtml(product.name)}"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="${imgError}"></button>
  <span class="discount-badge">${product.badge}</span><div class="card-info"><span class="card-brand">${product.brand}</span>
  <button class="card-title-button" data-open-product="${product.id}"><span class="card-title">${escapeHtml(product.name)}</span></button>
  <div class="rating"><span>${stars(product.rating)}</span> ${product.rating} · ${product.reviews.toLocaleString('en-IN')}</div>
  <div class="price-line"><span class="price">${currency(product.price)}</span><span class="mrp">${currency(product.mrp)}</span></div>
  <span class="prime">${product.prime?`✓ prime · ${tr('FREE delivery')}`:tr('Free delivery')}</span><button class="add-cart" data-add-cart="${product.id}">${tr('Add to cart')}</button></div></article>`}

function renderHome(){
  qs('#categoryGrid').innerHTML=categories.map(c=>`<button class="category-card" data-filter-button="${c.name}"><img src="${c.image}" alt="${c.name}" loading="lazy" onerror="${imgError}"><span class="category-card-content"><strong>${tr(c.name)}</strong><span>${tr(c.copy)}</span><i>→</i></span></button>`).join('');
  qs('#dealScroller').innerHTML=products.slice(0,8).map(productCard).join('');
  qs('#productRow').innerHTML=products.slice(5,20).concat(products.slice(0,5)).map(productCard).join('');
  qs('#moreProductsGrid').innerHTML=products.slice(-8).map(productCard).join('');
  if(garage){qs('#deliveryText').textContent=garage.pin || qs('#deliveryText').textContent;}
  translateTextNodes(qs('#homeView'));
}

function renderHeroDots(){}
function showSlide(direction){qs('#heroSlides').scrollBy({left:direction*330,behavior:'smooth'})}
function resetHero(){clearInterval(heroInterval)}

function hideViews(){qs('#homeView').hidden=true;qs('#productView').hidden=true;qs('#searchView').hidden=true;qs('#cartPageView').hidden=true}
function showHome(){hideViews();qs('#homeView').hidden=false;document.title=currentLanguage==='en'?'MotoMart India | Bike & Scooter Parts':currentLanguage==='hi'?'MotoMart India | बाइक और स्कूटर पार्ट्स':'MotoMart India | बाइक आणि स्कूटर पार्ट्स';translateTextNodes(qs('#homeView'))}
function openProduct(id){location.hash=`product:${id}`}
function renderProductDetail(id){
  const p=products.find(item=>item.id===id);if(!p){showHome();return}
  hideViews();const view=qs('#productView');view.hidden=false;
  const related=products.filter(x=>x.category===p.category&&x.id!==p.id).concat(products.filter(x=>x.id!==p.id)).slice(0,6);
  view.innerHTML=`<div class="page-shell"><div class="breadcrumb"><button data-home>${tr('Home')}</button> › ${tr(p.category)} › ${p.brand}</div><section class="detail-layout">
    <div class="detail-gallery"><div class="thumb-list"><button class="active"><img src="${p.image}" alt="Front view" onerror="${imgError}"></button><button><img src="${p.image}" alt="Detail view" onerror="${imgError}"></button><button><img src="${p.image}" alt="Product view" onerror="${imgError}"></button></div><div class="main-image-wrap"><img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="${imgError}"></div></div>
    <div class="detail-info"><a class="detail-brand" href="#search:${encodeURIComponent(p.brand)}">${local(`Visit the ${p.brand} store`,`${p.brand} स्टोर देखें`,`${p.brand} स्टोअरला भेट द्या`)}</a><h1>${escapeHtml(p.name)}</h1><div class="detail-rating"><span>${p.rating}</span><span class="stars">${stars(p.rating)}</span><a href="#reviews">${p.reviews.toLocaleString('en-IN')} ${tr('ratings')}</a></div>
      <div class="price-block"><span class="discount">-${Math.round((1-p.price/p.mrp)*100)}%</span><strong class="detail-price">${currency(p.price)}</strong><p>M.R.P.: <s>${currency(p.mrp)}</s></p><p>${tr('Inclusive of all taxes')}</p><p><strong>EMI</strong> ${local(`starts at ${currency(Math.ceil(p.price/6))} per month.`,`${currency(Math.ceil(p.price/6))} प्रति माह से शुरू।`,`${currency(Math.ceil(p.price/6))} प्रति महिना पासून.`)}</p></div>
      <div class="offers"><h3>⚙ ${tr('Offers')}</h3><div class="offer-cards"><div class="offer-card"><strong>${tr('Cashback')}</strong><p>${local('Up to ₹100 cashback with select payment methods.','चुनिंदा भुगतान तरीकों पर ₹100 तक कैशबैक।','निवडक पेमेंट पद्धतींवर ₹100 पर्यंत कॅशबॅक.')}</p></div><div class="offer-card"><strong>${tr('Bank offer')}</strong><p>${local('Extra 5% off on eligible cards.','योग्य कार्ड पर अतिरिक्त 5% छूट।','पात्र कार्डवर अतिरिक्त 5% सूट.')}</p></div><div class="offer-card"><strong>${tr('Partner offer')}</strong><p>${local('Get GST invoice for business purchases.','बिज़नेस खरीद पर GST इनवॉइस पाएँ।','व्यवसाय खरेदीसाठी GST इनव्हॉइस मिळवा.')}</p></div></div></div>
      <div class="about-product"><h3>${tr('About this item')}</h3><ul>${p.about.map(a=>`<li>${a}</li>`).join('')}<li><strong>${tr('Fitment:')}</strong> ${p.fit}. ${tr('Check your vehicle before ordering.')}</li></ul></div>
    </div>
    <aside class="buy-box"><strong class="detail-price">${currency(p.price)}</strong><p class="delivery-message"><strong>${tr('FREE delivery')}</strong> ${local('by','तक','पर्यंत')} <b>${deliveryDate()}</b><br>${tr('Order within 6 hrs 22 mins.')}</p><p>⌖ ${tr('Delivering to')} <strong>${escapeHtml(qs('#deliveryText').textContent)}</strong></p><p class="stock">${tr('In stock')}</p><label>${tr('Quantity')} <select id="detailQty">${[1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></label><button class="buy-add" data-detail-add="${p.id}">${tr('Add to cart')}</button><button class="buy-now" data-buy-now="${p.id}">${tr('Buy now')}</button><p class="secure-copy">🔒 ${tr('Secure transaction')}<br><br>${tr('Sold by MotoMart Verified Seller')}<br>${tr('7-day replacement available')}</p></aside>
    <div class="detail-benefits"><div><span>💳</span>${tr('Pay on delivery')}</div><div><span>↩</span>${tr('Easy replacement')}</div><div><span>⚡</span>${tr('Fast delivery')}</div><div><span>🛡</span>${tr('Warranty support')}</div></div>
    <div class="related-detail"><h2>${tr('Customers also viewed')}</h2><div class="product-row">${related.map(productCard).join('')}</div></div></section></div>`;
  document.title=`${p.name} | MotoMart`;translateTextNodes(view);window.scrollTo(0,0)
}

function deliveryDate(){const d=new Date();d.setDate(d.getDate()+3);return d.toLocaleDateString(currentLanguage==='hi'?'hi-IN':currentLanguage==='mr'?'mr-IN':'en-IN',{weekday:'long',day:'numeric',month:'short'})}
function searchProducts(query,category='all'){
  const q=query.trim().toLowerCase();const matches=products.filter(p=>(category==='all'||p.category===category)&&(!q||`${p.name} ${p.brand} ${p.category} ${p.fit}`.toLowerCase().includes(q)));
  hideViews();const view=qs('#searchView');view.hidden=false;
  const resultsHeading=currentLanguage==='hi'?`${matches.length} परिणाम “${escapeHtml(query||tr(category))}” के लिए`:currentLanguage==='mr'?`“${escapeHtml(query||tr(category))}” साठी ${matches.length} निकाल`:`${matches.length} result${matches.length===1?'':'s'} for “${escapeHtml(query||category)}”`;
  view.innerHTML=`<div class="search-head"><div><span class="eyebrow dark">CATALOG SEARCH</span><h1>${resultsHeading}</h1><p>Prices include applicable taxes.</p></div><button class="outline-cta" data-home>Back to home</button></div>${matches.length?`<div class="search-results">${matches.map(productCard).join('')}</div>`:`<div class="search-empty"><span>🔧</span><h2>No exact parts found</h2><p>Try a product type, brand, bike model or a shorter search.</p><button data-home>Browse all products</button></div>`}`;
  document.title=`${tr('CATALOG SEARCH')}: ${query||tr(category)} | MotoMart`;translateTextNodes(view);window.scrollTo(0,0)
}

function renderCartPage(){
  hideViews();const view=qs('#cartPageView');view.hidden=false;const entries=Object.entries(cart).filter(([id,qty])=>qty>0&&products.some(p=>p.id===id));const subtotal=entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);
  const itemCount=Object.values(cart).reduce((a,b)=>a+b,0),subtotalLabel=local(`Subtotal (${itemCount} items):`, `कुल (${itemCount} आइटम):`, `एकूण (${itemCount} वस्तू):`);
  view.innerHTML=entries.length?`<div class="cart-page-shell"><section class="cart-page-main"><button class="cart-page-back" data-home>← ${tr('Continue shopping')}</button><h1>${tr('Shopping Cart')}</h1>${entries.map(([id,qty])=>{const p=products.find(x=>x.id===id);return `<article class="cart-page-item"><img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="${imgError}"><div><h2>${escapeHtml(p.name)}</h2><p class="in-stock">${tr('In stock')}</p><p>${tr('Eligible for FREE delivery')}</p><p><strong>${tr('Fitment:')}</strong> ${p.fit}</p><div class="cart-page-actions"><div class="qty-stepper"><button data-cart-dec="${id}" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-cart-inc="${id}" aria-label="Increase quantity">+</button></div><button class="remove-link" data-cart-remove="${id}">${tr('Delete')}</button></div></div><strong class="cart-page-price">${currency(p.price*qty)}</strong></article>`}).join('')}<div class="cart-page-subtotal">${subtotalLabel} <strong>${currency(subtotal)}</strong></div></section><aside class="cart-summary"><h2>${subtotalLabel} <strong>${currency(subtotal)}</strong></h2><button data-cart-checkout>${tr('Proceed to Buy')}</button><small>🔒 ${local('Secure checkout. Taxes included; delivery is calculated at checkout.','सुरक्षित चेकआउट। कर शामिल हैं; डिलीवरी चेकआउट पर तय होगी।','सुरक्षित चेकआउट. कर समाविष्ट; डिलिव्हरी चेकआउटवेळी मोजली जाईल.')}</small></aside></div>`:`<div class="cart-empty"><span>🛒</span><div><h1>${tr('Your MotoMart cart is empty')}</h1><p>${tr('Shop today’s deals on bike parts, scooter accessories and riding gear.')}</p><button data-home>${tr('Continue shopping')}</button></div></div>`;
  document.title=`${tr('Shopping Cart')} | MotoMart`;translateTextNodes(view);window.scrollTo(0,0)
}
function route(){const hash=decodeURIComponent(location.hash.slice(1));if(hash.startsWith('product:'))renderProductDetail(hash.slice(8));else if(hash.startsWith('search:'))searchProducts(hash.slice(7));else if(hash==='cart')renderCartPage();else showHome()}

function addToCart(id,qty=1){cart[id]=(cart[id]||0)+Number(qty);persistCart();updateCart();const brand=products.find(p=>p.id===id).brand;showToast(currentLanguage==='hi'?`${brand} आइटम कार्ट में जोड़ा गया`:currentLanguage==='mr'?`${brand} वस्तू कार्टमध्ये टाकली`:`${brand} item added to cart`)}
function persistCart(){localStorage.setItem('motomart-cart',JSON.stringify(cart))}
function updateCart(){
  const count=Object.values(cart).reduce((a,b)=>a+b,0);qs('#cartCount').textContent=count;
  const entries=Object.entries(cart).filter(([id,qty])=>qty>0&&products.some(p=>p.id===id));
  qs('#cartItems').innerHTML=entries.length?entries.map(([id,qty])=>{const p=products.find(x=>x.id===id);return `<article class="cart-item"><img src="${p.image}" alt="" onerror="${imgError}"><div><h3>${escapeHtml(p.name)}</h3><strong>${currency(p.price*qty)}</strong><div class="qty-stepper"><button data-cart-dec="${id}" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-cart-inc="${id}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-cart-remove="${id}" aria-label="Remove item">×</button></article>`}).join(''):`<div class="empty-cart"><span>🛠</span><h3>Your cart is waiting</h3><p>Add the parts and gear you need for your next ride.</p></div>`;
  const subtotal=entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);qs('#cartSubtotal').textContent=currency(subtotal);translateTextNodes(qs('#cartDrawer'));if(location.hash==='#cart')renderCartPage()
}
function openCart(){closePanels();location.hash='cart';renderCartPage()}
function closePanels(){qs('#cartDrawer').classList.remove('open');qs('#cartDrawer').setAttribute('aria-hidden','true');qs('#mobileMenu').classList.remove('open');qs('#mobileMenu').setAttribute('aria-hidden','true');qsa('.modal').forEach(m=>m.hidden=true);hideOverlay()}
function showOverlay(){qs('#overlay').hidden=false;document.body.style.overflow='hidden'}
function hideOverlay(){qs('#overlay').hidden=true;document.body.style.overflow=''}
function openModal(id){closePanels();qs(id).hidden=false;showOverlay();setTimeout(()=>qs(`${id} input, ${id} select`)?.focus(),40)}
function showToast(message){const t=qs('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800)}

function runSearch(){const q=qs('#searchInput').value.trim();const category=qs('#categorySelect').value;if(q)location.hash=`search:${encodeURIComponent(q)}`;else if(category!=='all')searchProducts('',category);else searchProducts('all products')}
function showSuggestions(value){const q=value.trim().toLowerCase();const box=qs('#searchSuggestions');if(!q){box.classList.remove('open');return}const hits=products.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)).slice(0,5);box.innerHTML=hits.map(p=>`<button class="suggestion" type="button" data-open-product="${p.id}" role="option">⌕ <span><strong>${p.brand}</strong> ${escapeHtml(p.name)}</span></button>`).join('')||`<button class="suggestion" type="submit">⌕ Search for “${escapeHtml(value)}”</button>`;box.classList.add('open')}

function setupGarage(){
  const brand=qs('#vehicleBrand'),model=qs('#vehicleModel');brand.addEventListener('change',()=>{model.innerHTML=`<option value="">${tr('Choose model')}</option>`+((models[brand.value]||[]).map(m=>`<option>${m}</option>`).join(''))});
  qs('#garageForm').addEventListener('submit',e=>{e.preventDefault();if(!brand.value||!model.value){showToast(currentLanguage==='hi'?'अपने वाहन का ब्रांड और मॉडल चुनें':currentLanguage==='mr'?'तुमच्या वाहनाचा ब्रँड आणि मॉडेल निवडा':'Choose your vehicle brand and model');return}garage={type:qs('#vehicleType').value,brand:brand.value,model:model.value,pin:qs('#deliveryText').textContent};localStorage.setItem('motomart-garage',JSON.stringify(garage));qs('#garageResult').textContent=currentLanguage==='hi'?`✓ गैराज सेव हुआ: ${brand.value} ${model.value}। संगत सामान दिखाया जा रहा है।`:currentLanguage==='mr'?`✓ गॅरेज सेव्ह झाले: ${brand.value} ${model.value}. सुसंगत वस्तू दाखवत आहोत.`:`✓ Garage saved: ${brand.value} ${model.value}. Showing compatible essentials.`;searchProducts('', 'all');qs('#searchView .search-head h1').textContent=currentLanguage==='hi'?`${brand.value} ${model.value} के लिए पार्ट्स`:currentLanguage==='mr'?`${brand.value} ${model.value} साठी पार्ट्स`:`Parts for ${brand.value} ${model.value}`});
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
  if(target.matches('[data-scroll]')){e.preventDefault();const id=target.dataset.scroll;if(id==='top')window.scrollTo({top:0,behavior:'smooth'});else qs(`#${id}`)?.scrollIntoView({behavior:'smooth'})}
  if(target.matches('[data-slide]')){showSlide(Number(target.dataset.slide));resetHero()}
  if(target.matches('[data-close-modal],[data-close-menu]'))closePanels();
  if(target.matches('[data-cart-inc]')){cart[target.dataset.cartInc]=(cart[target.dataset.cartInc]||0)+1;persistCart();updateCart()}
  if(target.matches('[data-cart-dec]')){const id=target.dataset.cartDec;cart[id]=Math.max(0,(cart[id]||0)-1);if(!cart[id])delete cart[id];persistCart();updateCart()}
  if(target.matches('[data-cart-remove]')){delete cart[target.dataset.cartRemove];persistCart();updateCart()}
  if(target.matches('[data-scroll-row]'))qs('#productRow').scrollBy({left:target.dataset.scrollRow==='next'?500:-500,behavior:'smooth'})
  if(target.matches('[data-cart-checkout]'))showToast('Checkout is ready for payment integration');
});

qs('#heroPrev').addEventListener('click',()=>showSlide(-1));qs('#heroNext').addEventListener('click',()=>showSlide(1));
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
qs('#languageSelect').addEventListener('change',e=>applyLanguage(e.target.value,{announce:true}));

qs('#locationForm').addEventListener('submit',e=>{e.preventDefault();const pin=qs('#pincodeInput').value;if(!/^\d{6}$/.test(pin)){showToast(currentLanguage==='hi'?'मान्य 6 अंकों का पिन कोड डालें':currentLanguage==='mr'?'वैध 6 अंकी पिन कोड टाका':'Enter a valid 6-digit PIN code');return}qs('#deliveryText').textContent=`India ${pin}`;if(garage){garage.pin=`India ${pin}`;localStorage.setItem('motomart-garage',JSON.stringify(garage))}closePanels();showToast(currentLanguage==='hi'?'डिलीवरी लोकेशन अपडेट हो गई':currentLanguage==='mr'?'डिलिव्हरीचे ठिकाण अपडेट झाले':'Delivery location updated')});
qs('#tradeForm').addEventListener('submit',e=>{e.preventDefault();closePanels();showToast(currentLanguage==='hi'?'धन्यवाद! आपका ट्रेड-इन अनुरोध दर्ज हो गया।':currentLanguage==='mr'?'धन्यवाद! तुमची ट्रेड-इन विनंती नोंदवली.':'Thanks! Your trade-in estimate request is registered.');e.target.reset()});
qs('#signinForm').addEventListener('submit',e=>{e.preventDefault();closePanels();showToast(currentLanguage==='hi'?'डेमो साइन-इन सफलतापूर्वक सबमिट हुआ।':currentLanguage==='mr'?'डेमो साइन-इन यशस्वीरीत्या सबमिट झाले.':'Demo sign-in submitted successfully.');e.target.reset()});
qs('#checkoutButton').addEventListener('click',()=>{if(!Object.keys(cart).length){showToast(currentLanguage==='hi'?'आपका कार्ट खाली है':currentLanguage==='mr'?'तुमचा कार्ट रिकामा आहे':'Your cart is empty');return}closePanels();showToast(currentLanguage==='hi'?'चेकआउट भुगतान इंटीग्रेशन के लिए तैयार है':currentLanguage==='mr'?'चेकआउट पेमेंट इंटिग्रेशनसाठी तयार आहे':'Checkout is ready for payment integration')});

function startTimer(){let seconds=8*3600+42*60+16;setInterval(()=>{seconds=Math.max(0,seconds-1);const h=String(Math.floor(seconds/3600)).padStart(2,'0'),m=String(Math.floor(seconds%3600/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');qs('#dealTimer').textContent=`${h}:${m}:${s}`},1000)}

function registerWebMcpTools(){
  const context=document.modelContext;if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  const register=tool=>Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});
  register({name:'search_motomart_catalog',title:'Search MotoMart catalog',description:'Search visible bike and scooter parts by product, brand, category or fitment and show the matching catalog results.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1,maxLength:100}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input.query!=='string'||!input.query.trim())throw new Error('A non-empty search query is required.');const query=input.query.trim();const matches=products.filter(p=>`${p.name} ${p.brand} ${p.category} ${p.fit}`.toLowerCase().includes(query.toLowerCase()));searchProducts(query);return{query,resultCount:matches.length,productIds:matches.map(p=>p.id)};}});
  register({name:'add_motomart_item_to_cart',title:'Add a MotoMart item to cart',description:'Add a known MotoMart catalog product to the visible shopping cart using its product ID.',inputSchema:{type:'object',properties:{productId:{type:'string'},quantity:{type:'integer',minimum:1,maximum:5}},required:['productId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const product=products.find(p=>p.id===input?.productId);if(!product)throw new Error('Unknown product ID.');const quantity=input.quantity??1;if(!Number.isInteger(quantity)||quantity<1||quantity>5)throw new Error('Quantity must be an integer from 1 to 5.');addToCart(product.id,quantity);return{productId:product.id,quantity,cartItemCount:Object.values(cart).reduce((a,b)=>a+b,0),subtotal:Object.entries(cart).reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0)};}});
}

renderHome();renderHeroDots();resetHero();updateCart();setupGarage();startTimer();route();applyLanguage(currentLanguage);registerWebMcpTools();window.addEventListener('hashchange',route);
const floatingBackTop=qs('#floatingBackTop');
const syncBackTop=()=>floatingBackTop.classList.toggle('visible',window.scrollY>520);
window.addEventListener('scroll',syncBackTop,{passive:true});syncBackTop();

const chatbotPanel=qs('#chatbotPanel');
const chatbotLauncher=qs('#chatbotLauncher');
const chatbotMessages=qs('#chatbotMessages');
const chatbotInput=qs('#chatbotInput');
const chatbotAnswers=[
  {keywords:['delivery','deliver','shipping','ship','arrive'],answer:'Delivery availability depends on your PIN code. Enter your 6-digit PIN at the top of the page to see local options. MotoMart serves 18,000+ PIN codes.'},
  {keywords:['return','refund','replace','replacement'],answer:'Eligible items have a 10-day return or replacement window. Keep the item, packaging and invoice in their original condition.'},
  {keywords:['fit','fitment','compatible','compatibility','vehicle','model'],answer:'Use “Your Garage” to select your vehicle type, brand and model. MotoMart will then show compatible essentials for your ride.'},
  {keywords:['payment','pay','upi','card','cod','cash'],answer:'You can pay using UPI, cards or pay on delivery where available. The exact options are shown during checkout.'},
  {keywords:['order','track','tracking','status'],answer:'Sign in and open “Returns & Orders” to review your orders. Live tracking becomes available after an order is dispatched.'},
  {keywords:['trade','sell','exchange','old part'],answer:'Choose “Sell / Trade-In” from the menu, describe the item and its condition, and submit your mobile number to request an estimated exchange value.'},
  {keywords:['helmet','oil','brake','tyre','tire','part','accessory','product'],answer:'MotoMart carries helmets, engine oils, brakes, tyres, riding gear and accessories. Use the search bar or category links to find what you need.'},
  {keywords:['contact','support','help','agent'],answer:'I can answer common questions here. For more help, use the Customer Service link in the main menu.'},
  {keywords:['hello','hi','hey','namaste'],answer:'Hello! Ask me about delivery, returns, fitment, payments, orders, products or trade-ins.'}
];

function addChatMessage(message,type){
  const bubble=document.createElement('p');bubble.className=`chat-message ${type}`;bubble.textContent=message;chatbotMessages.appendChild(bubble);chatbotMessages.scrollTop=chatbotMessages.scrollHeight;
}
function answerChatbot(question){
  const normalized=question.toLowerCase();
  return chatbotAnswers.find(item=>item.keywords.some(keyword=>normalized.includes(keyword)))?.answer||'I can help with delivery, returns, fitment, payments, orders, products and trade-ins. Try asking about one of those topics or choose a suggestion above.';
}
function sendChatbotQuestion(question){
  const clean=question.trim();if(!clean)return;addChatMessage(clean,'user');setTimeout(()=>addChatMessage(answerChatbot(clean),'bot'),180);
}
function openChatbot(){chatbotPanel.hidden=false;chatbotLauncher.setAttribute('aria-expanded','true');chatbotInput.focus()}
function closeChatbot(){chatbotPanel.hidden=true;chatbotLauncher.setAttribute('aria-expanded','false');chatbotLauncher.focus()}

chatbotLauncher.addEventListener('click',()=>chatbotPanel.hidden?openChatbot():closeChatbot());
qs('#closeChatbot').addEventListener('click',closeChatbot);
qs('#chatbotForm').addEventListener('submit',event=>{event.preventDefault();sendChatbotQuestion(chatbotInput.value);chatbotInput.value=''});
qsa('[data-chat-question]').forEach(button=>button.addEventListener('click',()=>sendChatbotQuestion(button.dataset.chatQuestion)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!chatbotPanel.hidden)closeChatbot()});
