// =============================================================================
// PART TERMINOLOGY & PRODUCT-NAME TRANSLATION
//
// Catalog titles are machine-generated from the source feed and read like:
//
//   "Graphics Sticker Set for Hero Glamour | Type 6 | Black Vehicle | Both Sides"
//   "Mukut Rear Disc Brake Plate (Hero Karizma/ Karizma ZMR)"
//   "OLA Genuine Regenerative Electronic Brake Pad & Caliper Assembly - Roadster Pro"
//
// A dictionary keyed on whole titles is impossible here — there are 5,163 of
// them and the qualifier tails alone have 1,835 distinct spellings. So instead
// of matching titles we translate the *vocabulary* they are built from: a walk
// over the title replaces the longest known phrase at each position and leaves
// everything else alone.
//
// Leaving unknown words alone is the important half. Vehicle names, OEM vendor
// names and part numbers are proper nouns that must survive untranslated, and
// they do so by simply never appearing in the lexicon. That is also why words
// that double as model names ("Star", "Shine", "Plus", "Pro", "Passion") are
// deliberately absent — translating them would corrupt the vehicle.
// =============================================================================

export const partTerms = {
  'Ball Racer Set': { hi: 'बॉल रेसर सेट', mr: 'बॉल रेसर सेट', gu: 'બોલ રેસર સેટ' },
  'Body Control Unit': { hi: 'बॉडी कंट्रोल यूनिट', mr: 'बॉडी कंट्रोल युनिट', gu: 'બોડી કંટ્રોલ યુનિટ' },
  'Body Throttle Assembly': { hi: 'बॉडी थ्रॉटल असेंबली', mr: 'बॉडी थ्रॉटल असेंब्ली', gu: 'બોડી થ્રોટલ એસેમ્બલી' },
  Brake: { hi: 'ब्रेक', mr: 'ब्रेक', gu: 'બ્રેક' },
  'Brake Disc Caliper': { hi: 'ब्रेक डिस्क कैलिपर', mr: 'ब्रेक डिस्क कॅलिपर', gu: 'બ્રેક ડિસ્ક કેલિપર' },
  'Brake Disc Plate': { hi: 'ब्रेक डिस्क प्लेट', mr: 'ब्रेक डिस्क प्लेट', gu: 'બ્રેક ડિસ્ક પ્લેટ' },
  'Brake Drum': { hi: 'ब्रेक ड्रम', mr: 'ब्रेक ड्रम', gu: 'બ્રેક ડ્રમ' },
  Bush: { hi: 'बुश', mr: 'बुश', gu: 'બુશ' },
  Cables: { hi: 'केबल', mr: 'केबल', gu: 'કેબલ' },
  'Cam Shaft Assembly': { hi: 'कैम शाफ्ट असेंबली', mr: 'कॅम शाफ्ट असेंब्ली', gu: 'કેમ શાફ્ટ એસેમ્બલી' },
  Carburetor: { hi: 'कार्बोरेटर', mr: 'कार्बोरेटर', gu: 'કાર્બોરેટર' },
  'Carburetor Repair Kit': { hi: 'कार्बोरेटर रिपेयर किट', mr: 'कार्बोरेटर रिपेअर किट', gu: 'કાર્બોરેટર રિપેર કિટ' },
  CDI: { hi: 'सीडीआई', mr: 'सीडीआय', gu: 'સીડીઆઈ' },
  'Chain Sprocket': { hi: 'चेन स्प्रोकेट', mr: 'चेन स्प्रॉकेट', gu: 'ચેઇન સ્પ્રોકેટ' },
  Clutch: { hi: 'क्लच', mr: 'क्लच', gu: 'ક્લચ' },
  'Clutch Assembly': { hi: 'क्लच असेंबली', mr: 'क्लच असेंब्ली', gu: 'ક્લચ એસેમ્બલી' },
  'Clutch Cover': { hi: 'क्लच कवर', mr: 'क्लच कव्हर', gu: 'ક્લચ કવર' },
  'Clutch Plate': { hi: 'क्लच प्लेट', mr: 'क्लच प्लेट', gu: 'ક્લચ પ્લેટ' },
  'Clutch Pulley': { hi: 'क्लच पुली', mr: 'क्लच पुली', gu: 'ક્લચ પુલી' },
  'Clutch Shoe': { hi: 'क्लच शू', mr: 'क्लच शू', gu: 'ક્લચ શૂ' },
  'Connecting Rod Kit': { hi: 'कनेक्टिंग रॉड किट', mr: 'कनेक्टिंग रॉड किट', gu: 'કનેક્ટિંગ રોડ કિટ' },
  'Crank Shaft': { hi: 'क्रैंक शाफ्ट', mr: 'क्रँक शाफ्ट', gu: 'ક્રેન્ક શાફ્ટ' },
  'Disc Brake Master Cylinder Assembly': {
    hi: 'डिस्क ब्रेक मास्टर सिलेंडर असेंबली',
    mr: 'डिस्क ब्रेक मास्टर सिलिंडर असेंब्ली',
    gu: 'ડિસ્ક બ્રેક માસ્ટર સિલિન્ડર એસેમ્બલી'
  },
  ECU: { hi: 'ईसीयू', mr: 'ईसीयू', gu: 'ઈસીયુ' },
  Engine: { hi: 'इंजन', mr: 'इंजिन', gu: 'એન્જિન' },
  'Engine Belt': { hi: 'इंजन बेल्ट', mr: 'इंजिन बेल्ट', gu: 'એન્જિન બેલ્ટ' },
  'Engine Guard': { hi: 'इंजन गार्ड', mr: 'इंजिन गार्ड', gu: 'એન્જિન ગાર્ડ' },
  'Engine Valve Set': { hi: 'इंजन वाल्व सेट', mr: 'इंजिन व्हॉल्व्ह सेट', gu: 'એન્જિન વાલ્વ સેટ' },
  'Floor Platform': { hi: 'फ्लोर प्लेटफॉर्म', mr: 'फ्लोअर प्लॅटफॉर्म', gu: 'ફ્લોર પ્લેટફોર્મ' },
  'Fork Leg Assembly': { hi: 'फोर्क लेग असेंबली', mr: 'फोर्क लेग असेंब्ली', gu: 'ફોર્ક લેગ એસેમ્બલી' },
  'Fork Pipe': { hi: 'फोर्क पाइप', mr: 'फोर्क पाइप', gu: 'ફોર્ક પાઇપ' },
  'Front Brake Drum': { hi: 'फ्रंट ब्रेक ड्रम', mr: 'फ्रंट ब्रेक ड्रम', gu: 'ફ્રન્ટ બ્રેક ડ્રમ' },
  'Front Drum Plate': { hi: 'फ्रंट ड्रम प्लेट', mr: 'फ्रंट ड्रम प्लेट', gu: 'ફ્રન્ટ ડ્રમ પ્લેટ' },
  'Front Foot Rest Rod': { hi: 'फ्रंट फुट रेस्ट रॉड', mr: 'फ्रंट फूट रेस्ट रॉड', gu: 'ફ્રન્ટ ફૂટ રેસ્ટ રોડ' },
  'Front Fork Assembly': { hi: 'फ्रंट फोर्क असेंबली', mr: 'फ्रंट फोर्क असेंब्ली', gu: 'ફ્રન્ટ ફોર્ક એસેમ્બલી' },
  'Front Fork Leg': { hi: 'फ्रंट फोर्क लेग', mr: 'फ्रंट फोर्क लेग', gu: 'ફ્રન્ટ ફોર્ક લેગ' },
  'Front Mudguard': { hi: 'फ्रंट मडगार्ड', mr: 'फ्रंट मडगार्ड', gu: 'ફ્રન્ટ મડગાર્ડ' },
  'Fuel Injector': { hi: 'फ्यूल इंजेक्टर', mr: 'फ्यूएल इंजेक्टर', gu: 'ફ્યુઅલ ઇન્જેક્ટર' },
  'Fuel Pump Assembly': { hi: 'फ्यूल पंप असेंबली', mr: 'फ्यूएल पंप असेंब्ली', gu: 'ફ્યુઅલ પંપ એસેમ્બલી' },
  'Fuel Pump Motor': { hi: 'फ्यूल पंप मोटर', mr: 'फ्यूएल पंप मोटर', gu: 'ફ્યુઅલ પંપ મોટર' },
  'Gear Lever': { hi: 'गियर लीवर', mr: 'गिअर लिव्हर', gu: 'ગિયર લીવર' },
  'Gear Pinion Set': { hi: 'गियर पिनियन सेट', mr: 'गिअर पिनियन सेट', gu: 'ગિયર પિનિયન સેટ' },
  'Gear Shaft': { hi: 'गियर शाफ्ट', mr: 'गिअर शाफ्ट', gu: 'ગિયર શાફ્ટ' },
  Handle: { hi: 'हैंडल', mr: 'हँडल', gu: 'હેન્ડલ' },
  'Handle Bar Switch': { hi: 'हैंडल बार स्विच', mr: 'हँडल बार स्विच', gu: 'હેન્ડલ બાર સ્વિચ' },
  'Handle Tee': { hi: 'हैंडल टी', mr: 'हँडल टी', gu: 'હેન્ડલ ટી' },
  'Head Light Set': { hi: 'हेड लाइट सेट', mr: 'हेड लाइट सेट', gu: 'હેડ લાઇટ સેટ' },
  'Ignition Lock Set': { hi: 'इग्निशन लॉक सेट', mr: 'इग्निशन लॉक सेट', gu: 'ઇગ્નિશન લોક સેટ' },
  Ignitor: { hi: 'इग्नाइटर', mr: 'इग्नायटर', gu: 'ઇગ્નાઇટર' },
  'Kick Lever': { hi: 'किक लीवर', mr: 'किक लिव्हर', gu: 'કિક લીવર' },
  'Kick Rachet': { hi: 'किक रैचेट', mr: 'किक रॅचेट', gu: 'કિક રેચેટ' },
  'Kick Shaft': { hi: 'किक शाफ्ट', mr: 'किक शाफ्ट', gu: 'કિક શાફ્ટ' },
  Lights: { hi: 'लाइट', mr: 'लाइट', gu: 'લાઇટ' },
  Monogram: { hi: 'मोनोग्राम', mr: 'मोनोग्राम', gu: 'મોનોગ્રામ' },
  Oil: { hi: 'ऑयल', mr: 'ऑइल', gu: 'ઓઇલ' },
  'One Way Clutch': { hi: 'वन वे क्लच', mr: 'वन वे क्लच', gu: 'વન વે ક્લચ' },
  'Petrol Tank': { hi: 'पेट्रोल टैंक', mr: 'पेट्रोल टाकी', gu: 'પેટ્રોલ ટાંકી' },
  'Piston Cylinder Kit': { hi: 'पिस्टन सिलेंडर किट', mr: 'पिस्टन सिलिंडर किट', gu: 'પિસ્ટન સિલિન્ડર કિટ' },
  'Piston Kit': { hi: 'पिस्टन किट', mr: 'पिस्टन किट', gu: 'પિસ્ટન કિટ' },
  Radiator: { hi: 'रेडिएटर', mr: 'रेडिएटर', gu: 'રેડિએટર' },
  'Rear Brake Drum': { hi: 'रियर ब्रेक ड्रम', mr: 'रिअर ब्रेक ड्रम', gu: 'રિયર બ્રેક ડ્રમ' },
  'Rear Drum Plate': { hi: 'रियर ड्रम प्लेट', mr: 'रिअर ड्रम प्लेट', gu: 'રિયર ડ્રમ પ્લેટ' },
  'Rear Suspension U Fork': { hi: 'रियर सस्पेंशन यू फोर्क', mr: 'रिअर सस्पेंशन यू फोर्क', gu: 'રિયર સસ્પેન્શન યુ ફોર્ક' },
  'Rocker Arm Set': { hi: 'रॉकर आर्म सेट', mr: 'रॉकर आर्म सेट', gu: 'રોકર આર્મ સેટ' },
  'Roller Weights': { hi: 'रोलर वेट', mr: 'रोलर वेट', gu: 'રોલર વેઇટ' },
  'RR Unit': { hi: 'आरआर यूनिट', mr: 'आरआर युनिट', gu: 'આરઆર યુનિટ' },
  'Self Armature': { hi: 'सेल्फ आर्मेचर', mr: 'सेल्फ आर्मेचर', gu: 'સેલ્ફ આર્મેચર' },
  'Shock Absorber': { hi: 'शॉक अब्जॉर्बर', mr: 'शॉक अ‍ॅब्झॉर्बर', gu: 'શોક એબ્ઝોર્બર' },
  Shocker: { hi: 'शॉकर', mr: 'शॉकर', gu: 'શોકર' },
  'Side Panel': { hi: 'साइड पैनल', mr: 'साइड पॅनल', gu: 'સાઇડ પેનલ' },
  Silencer: { hi: 'साइलेंसर', mr: 'सायलेन्सर', gu: 'સાઇલેન્સર' },
  'Speed Sensor': { hi: 'स्पीड सेंसर', mr: 'स्पीड सेन्सर', gu: 'સ્પીડ સેન્સર' },
  Speedometer: { hi: 'स्पीडोमीटर', mr: 'स्पीडोमीटर', gu: 'સ્પીડોમીટર' },
  'Speedometer Case': { hi: 'स्पीडोमीटर केस', mr: 'स्पीडोमीटर केस', gu: 'સ્પીડોમીટર કેસ' },
  'Starter Motor': { hi: 'स्टार्टर मोटर', mr: 'स्टार्टर मोटर', gu: 'સ્ટાર્ટર મોટર' },
  'Stator Coil Plate': { hi: 'स्टेटर कॉइल प्लेट', mr: 'स्टेटर कॉइल प्लेट', gu: 'સ્ટેટર કોઇલ પ્લેટ' },
  'Sticker Set': { hi: 'स्टिकर सेट', mr: 'स्टिकर सेट', gu: 'સ્ટીકર સેટ' },
  'Tail Light Set': { hi: 'टेल लाइट सेट', mr: 'टेल लाइट सेट', gu: 'ટેલ લાઇટ સેટ' },
  'Tank Cover': { hi: 'टैंक कवर', mr: 'टाकी कव्हर', gu: 'ટાંકી કવર' },
  TCI: { hi: 'टीसीआई', mr: 'टीसीआय', gu: 'ટીસીઆઈ' },
  'Throttle Sensor': { hi: 'थ्रॉटल सेंसर', mr: 'थ्रॉटल सेन्सर', gu: 'થ્રોટલ સેન્સર' },
  TPFC: { hi: 'टीपीएफसी', mr: 'टीपीएफसी', gu: 'ટીપીએફસી' },
  Visor: { hi: 'वाइज़र', mr: 'व्हायझर', gu: 'વાઇઝર' },
  'Wheel Rim': { hi: 'व्हील रिम', mr: 'व्हील रिम', gu: 'વ્હીલ રિમ' },
  Wheels: { hi: 'व्हील', mr: 'व्हील', gu: 'વ્હીલ' },
  'Wiring Harness': { hi: 'वायरिंग हार्नेस', mr: 'वायरिंग हार्नेस', gu: 'વાયરિંગ હાર્નેસ' },
  'Spare Parts': { hi: 'स्पेयर पार्ट्स', mr: 'स्पेअर पार्ट्स', gu: 'સ્પેર પાર્ટ્સ' },

  // Shopper-facing category groups
  'Handle & Steering': { hi: 'हैंडल और स्टीयरिंग', mr: 'हँडल आणि स्टिअरिंग', gu: 'હેન્ડલ અને સ્ટિયરિંગ' },
  'Front Wheel Parts': { hi: 'फ्रंट व्हील पार्ट्स', mr: 'फ्रंट व्हील पार्ट्स', gu: 'ફ્રન્ટ વ્હીલ પાર્ટ્સ' },
  'Oil, Seals & Lubricants': {
    hi: 'ऑयल, सील और लुब्रिकेंट',
    mr: 'ऑइल, सील आणि ल्युब्रिकंट',
    gu: 'ઓઇલ, સીલ અને લુબ્રિકન્ટ'
  },
  'Bearings & Bushes': { hi: 'बेयरिंग और बुश', mr: 'बेअरिंग आणि बुश', gu: 'બેરિંગ અને બુશ' },
  'Lights & Indicators': { hi: 'लाइट और इंडिकेटर', mr: 'लाइट आणि इंडिकेटर', gu: 'લાઇટ અને ઇન્ડિકેટર' },
  'Fuel Supply System': { hi: 'फ्यूल सप्लाई सिस्टम', mr: 'फ्यूएल सप्लाय सिस्टिम', gu: 'ફ્યુઅલ સપ્લાય સિસ્ટમ' },
  'Pipes & Hoses': { hi: 'पाइप और होज़', mr: 'पाइप आणि होज', gu: 'પાઇપ અને હોઝ' },
  'Engine & Drive': { hi: 'इंजन और ड्राइव', mr: 'इंजिन आणि ड्राइव्ह', gu: 'એન્જિન અને ડ્રાઇવ' },
  Electricals: { hi: 'इलेक्ट्रिकल्स', mr: 'इलेक्ट्रिकल्स', gu: 'ઇલેક્ટ્રિકલ્સ' },
  'Body & Panels': { hi: 'बॉडी और पैनल', mr: 'बॉडी आणि पॅनल', gu: 'બોડી અને પેનલ' }
};

// -----------------------------------------------------------------------------
// The working vocabulary of the catalog. Phrases are matched longest-first, so
// "Front Fork Leg" wins over "Front", and "New Model" over a bare "Model".
// -----------------------------------------------------------------------------
export const partLexicon = {
  // --- qualifier phrases (the "| Both Sides | Left Hand" tails) --------------
  'Both Sides': { hi: 'दोनों तरफ', mr: 'दोन्ही बाजू', gu: 'બંને બાજુ' },
  'Left Hand': { hi: 'बायाँ', mr: 'डावा', gu: 'ડાબો' },
  'Right Hand': { hi: 'दायाँ', mr: 'उजवा', gu: 'જમણો' },
  'Left Side': { hi: 'बायीं तरफ', mr: 'डावी बाजू', gu: 'ડાબી બાજુ' },
  'Right Side': { hi: 'दायीं तरफ', mr: 'उजवी बाजू', gu: 'જમણી બાજુ' },
  'New Model': { hi: 'नया मॉडल', mr: 'नवीन मॉडेल', gu: 'નવું મોડેલ' },
  'Old Model': { hi: 'पुराना मॉडल', mr: 'जुने मॉडेल', gu: 'જૂનું મોડેલ' },
  'All Models': { hi: 'सभी मॉडल', mr: 'सर्व मॉडेल', gu: 'બધા મોડેલ' },
  'Set of': { hi: 'सेट', mr: 'संच', gu: 'સેટ' },
  'Disc Brakes': { hi: 'डिस्क ब्रेक', mr: 'डिस्क ब्रेक', gu: 'ડિસ્ક બ્રેક' },
  'Drum Brakes': { hi: 'ड्रम ब्रेक', mr: 'ड्रम ब्रेक', gu: 'ડ્રમ બ્રેક' },
  'Black Vehicle': { hi: 'काली गाड़ी', mr: 'काळे वाहन', gu: 'કાળું વાહન' },
  'Red Vehicle': { hi: 'लाल गाड़ी', mr: 'लाल वाहन', gu: 'લાલ વાહન' },
  'Blue Vehicle': { hi: 'नीली गाड़ी', mr: 'निळे वाहन', gu: 'વાદળી વાહન' },
  'Silver Vehicle': { hi: 'सिल्वर गाड़ी', mr: 'सिल्व्हर वाहन', gu: 'સિલ્વર વાહન' },
  'Grey Vehicle': { hi: 'ग्रे गाड़ी', mr: 'ग्रे वाहन', gu: 'ગ્રે વાહન' },
  'White Vehicle': { hi: 'सफ़ेद गाड़ी', mr: 'पांढरे वाहन', gu: 'સફેદ વાહન' },
  'Green Vehicle': { hi: 'हरी गाड़ी', mr: 'हिरवे वाहन', gu: 'લીલું વાહન' },
  'Red Sticker': { hi: 'लाल स्टिकर', mr: 'लाल स्टिकर', gu: 'લાલ સ્ટીકર' },
  'Blue Sticker': { hi: 'नीला स्टिकर', mr: 'निळा स्टिकर', gu: 'વાદળી સ્ટીકર' },
  'Grey Sticker': { hi: 'ग्रे स्टिकर', mr: 'ग्रे स्टिकर', gu: 'ગ્રે સ્ટીકર' },
  'Black Sticker': { hi: 'काला स्टिकर', mr: 'काळा स्टिकर', gu: 'કાળું સ્ટીકર' },
  'Vinyl Decal Set': { hi: 'विनाइल डिकल सेट', mr: 'विनाइल डिकल सेट', gu: 'વિનાઇલ ડિકલ સેટ' },
  'Cone Set': { hi: 'कोन सेट', mr: 'कोन सेट', gu: 'કોન સેટ' },
  'Paper Type': { hi: 'पेपर टाइप', mr: 'पेपर प्रकार', gu: 'પેપર પ્રકાર' },
  'Kick Pedal': { hi: 'किक पेडल', mr: 'किक पेडल', gu: 'કિક પેડલ' },
  'Gear Pedal': { hi: 'गियर पेडल', mr: 'गिअर पेडल', gu: 'ગિયર પેડલ' },
  'Gear Assembly': { hi: 'गियर असेंबली', mr: 'गिअर असेंब्ली', gu: 'ગિયર એસેમ્બલી' },
  'Regulator Rectifier': { hi: 'रेगुलेटर रेक्टिफायर', mr: 'रेग्युलेटर रेक्टिफायर', gu: 'રેગ્યુલેટર રેક્ટિફાયર' },
  'Meter Cover': { hi: 'मीटर कवर', mr: 'मीटर कव्हर', gu: 'મીટર કવર' },
  'Meter Pinion': { hi: 'मीटर पिनियन', mr: 'मीटर पिनियन', gu: 'મીટર પિનિયન' },
  'with seal': { hi: 'सील सहित', mr: 'सीलसह', gu: 'સીલ સાથે' },

  // --- part phrases ----------------------------------------------------------
  'Graphics Sticker Set': { hi: 'ग्राफिक्स स्टिकर सेट', mr: 'ग्राफिक्स स्टिकर सेट', gu: 'ગ્રાફિક્સ સ્ટીકર સેટ' },
  'Handle Bar Switch': { hi: 'हैंडल बार स्विच', mr: 'हँडल बार स्विच', gu: 'હેન્ડલ બાર સ્વિચ' },
  'Handle Bar': { hi: 'हैंडल बार', mr: 'हँडल बार', gu: 'હેન્ડલ બાર' },
  Handlebar: { hi: 'हैंडलबार', mr: 'हँडलबार', gu: 'હેન્ડલબાર' },
  'Shock Absorber': { hi: 'शॉक अब्जॉर्बर', mr: 'शॉक अ‍ॅब्झॉर्बर', gu: 'શોક એબ્ઝોર્બર' },
  'Stator Coil Plate': { hi: 'स्टेटर कॉइल प्लेट', mr: 'स्टेटर कॉइल प्लेट', gu: 'સ્ટેટર કોઇલ પ્લેટ' },
  'Stator Coil': { hi: 'स्टेटर कॉइल', mr: 'स्टेटर कॉइल', gu: 'સ્ટેટર કોઇલ' },
  'Front Fork Leg': { hi: 'फ्रंट फोर्क लेग', mr: 'फ्रंट फोर्क लेग', gu: 'ફ્રન્ટ ફોર્ક લેગ' },
  'Fork Leg': { hi: 'फोर्क लेग', mr: 'फोर्क लेग', gu: 'ફોર્ક લેગ' },
  'Front Fork': { hi: 'फ्रंट फोर्क', mr: 'फ्रंट फोर्क', gu: 'ફ્રન્ટ ફોર્ક' },
  'Petrol Tank': { hi: 'पेट्रोल टैंक', mr: 'पेट्रोल टाकी', gu: 'પેટ્રોલ ટાંકી' },
  'Fuel Tank': { hi: 'फ्यूल टैंक', mr: 'फ्यूएल टाकी', gu: 'ફ્યુઅલ ટાંકી' },
  'Brake Pad': { hi: 'ब्रेक पैड', mr: 'ब्रेक पॅड', gu: 'બ્રેક પેડ' },
  'Brake Shoe': { hi: 'ब्रेक शू', mr: 'ब्रेक शू', gu: 'બ્રેક શૂ' },
  'Brake Disc': { hi: 'ब्रेक डिस्क', mr: 'ब्रेक डिस्क', gu: 'બ્રેક ડિસ્ક' },
  'Brake Drum': { hi: 'ब्रेक ड्रम', mr: 'ब्रेक ड्रम', gu: 'બ્રેક ડ્રમ' },
  'Disc Plate': { hi: 'डिस्क प्लेट', mr: 'डिस्क प्लेट', gu: 'ડિસ્ક પ્લેટ' },
  'Drum Plate': { hi: 'ड्रम प्लेट', mr: 'ड्रम प्लेट', gu: 'ડ્રમ પ્લેટ' },
  'Master Cylinder': { hi: 'मास्टर सिलेंडर', mr: 'मास्टर सिलिंडर', gu: 'માસ્ટર સિલિન્ડર' },
  'Crank Shaft': { hi: 'क्रैंक शाफ्ट', mr: 'क्रँक शाफ्ट', gu: 'ક્રેન્ક શાફ્ટ' },
  'Cam Shaft': { hi: 'कैम शाफ्ट', mr: 'कॅम शाफ्ट', gu: 'કેમ શાફ્ટ' },
  'Kick Shaft': { hi: 'किक शाफ्ट', mr: 'किक शाफ्ट', gu: 'કિક શાફ્ટ' },
  'Gear Shaft': { hi: 'गियर शाफ्ट', mr: 'गिअर शाफ्ट', gu: 'ગિયર શાફ્ટ' },
  'Worm Gear': { hi: 'वर्म गियर', mr: 'वर्म गिअर', gu: 'વોર્મ ગિયર' },
  'Gear Pinion': { hi: 'गियर पिनियन', mr: 'गिअर पिनियन', gu: 'ગિયર પિનિયન' },
  'Gear Lever': { hi: 'गियर लीवर', mr: 'गिअर लिव्हर', gu: 'ગિયર લીવર' },
  'Kick Lever': { hi: 'किक लीवर', mr: 'किक लिव्हर', gu: 'કિક લીવર' },
  'Kick Rachet': { hi: 'किक रैचेट', mr: 'किक रॅचेट', gu: 'કિક રેચેટ' },
  'Wiring Harness': { hi: 'वायरिंग हार्नेस', mr: 'वायरिंग हार्नेस', gu: 'વાયરિંગ હાર્નેસ' },
  'Starter Motor': { hi: 'स्टार्टर मोटर', mr: 'स्टार्टर मोटर', gu: 'સ્ટાર્ટર મોટર' },
  'Self Starter': { hi: 'सेल्फ स्टार्टर', mr: 'सेल्फ स्टार्टर', gu: 'સેલ્ફ સ્ટાર્ટર' },
  'Self Armature': { hi: 'सेल्फ आर्मेचर', mr: 'सेल्फ आर्मेचर', gu: 'સેલ્ફ આર્મેચર' },
  'Chain Sprocket': { hi: 'चेन स्प्रोकेट', mr: 'चेन स्प्रॉकेट', gu: 'ચેઇન સ્પ્રોકેટ' },
  'Rocker Arm': { hi: 'रॉकर आर्म', mr: 'रॉकर आर्म', gu: 'રોકર આર્મ' },
  'Connecting Rod': { hi: 'कनेक्टिंग रॉड', mr: 'कनेक्टिंग रॉड', gu: 'કનેક્ટિંગ રોડ' },
  'Piston Cylinder': { hi: 'पिस्टन सिलेंडर', mr: 'पिस्टन सिलिंडर', gu: 'પિસ્ટન સિલિન્ડર' },
  'Ball Racer': { hi: 'बॉल रेसर', mr: 'बॉल रेसर', gu: 'બોલ રેસર' },
  'Roller Weights': { hi: 'रोलर वेट', mr: 'रोलर वेट', gu: 'રોલર વેઇટ' },
  'Head Light': { hi: 'हेड लाइट', mr: 'हेड लाइट', gu: 'હેડ લાઇટ' },
  'Tail Light': { hi: 'टेल लाइट', mr: 'टेल लाइट', gu: 'ટેલ લાઇટ' },
  Headlamp: { hi: 'हेडलैंप', mr: 'हेडलॅम्प', gu: 'હેડલેમ્પ' },
  'Spark Plug': { hi: 'स्पार्क प्लग', mr: 'स्पार्क प्लग', gu: 'સ્પાર્ક પ્લગ' },
  'Fuel Injector': { hi: 'फ्यूल इंजेक्टर', mr: 'फ्यूएल इंजेक्टर', gu: 'ફ્યુઅલ ઇન્જેક્ટર' },
  'Fuel Pump': { hi: 'फ्यूल पंप', mr: 'फ्यूएल पंप', gu: 'ફ્યુઅલ પંપ' },
  'Air Filter': { hi: 'एयर फ़िल्टर', mr: 'एअर फिल्टर', gu: 'એર ફિલ્ટર' },
  'Oil Filter': { hi: 'ऑयल फ़िल्टर', mr: 'ऑइल फिल्टर', gu: 'ઓઇલ ફિલ્ટર' },
  'Oil Seal': { hi: 'ऑयल सील', mr: 'ऑइल सील', gu: 'ઓઇલ સીલ' },
  'Wheel Rim': { hi: 'व्हील रिम', mr: 'व्हील रिम', gu: 'વ્હીલ રિમ' },
  'Alloy Wheel': { hi: 'अलॉय व्हील', mr: 'अलॉय व्हील', gu: 'એલોય વ્હીલ' },
  'Foot Rest': { hi: 'फुट रेस्ट', mr: 'फूट रेस्ट', gu: 'ફૂટ રેસ્ટ' },
  'Side Panel': { hi: 'साइड पैनल', mr: 'साइड पॅनल', gu: 'સાઇડ પેનલ' },
  'Floor Platform': { hi: 'फ्लोर प्लेटफॉर्म', mr: 'फ्लोअर प्लॅटफॉर्म', gu: 'ફ્લોર પ્લેટફોર્મ' },
  'Repair Kit': { hi: 'रिपेयर किट', mr: 'रिपेअर किट', gu: 'રિપેર કિટ' },
  'Lock Set': { hi: 'लॉक सेट', mr: 'लॉक सेट', gu: 'લોક સેટ' },
  'Ignition Lock': { hi: 'इग्निशन लॉक', mr: 'इग्निशन लॉक', gu: 'ઇગ્નિશન લોક' },
  'Speed Sensor': { hi: 'स्पीड सेंसर', mr: 'स्पीड सेन्सर', gu: 'સ્પીડ સેન્સર' },
  'Throttle Sensor': { hi: 'थ्रॉटल सेंसर', mr: 'थ्रॉटल सेन्सर', gu: 'થ્રોટલ સેન્સર' },
  'Control Unit': { hi: 'कंट्रोल यूनिट', mr: 'कंट्रोल युनिट', gu: 'કંટ્રોલ યુનિટ' },
  'One Way': { hi: 'वन वे', mr: 'वन वे', gu: 'વન વે' },
  'Engine Oil': { hi: 'इंजन ऑयल', mr: 'इंजिन ऑइल', gu: 'એન્જિન ઓઇલ' },
  'Heavy Duty': { hi: 'हेवी ड्यूटी', mr: 'हेवी ड्युटी', gu: 'હેવી ડ્યુટી' },
  'Gas Filled': { hi: 'गैस फिल्ड', mr: 'गॅस फिल्ड', gu: 'ગેસ ફિલ્ડ' },
  'High Efficiency': { hi: 'हाई एफिशिएंसी', mr: 'हाय एफिशियन्सी', gu: 'હાઈ એફિશિયન્સી' },
  'Low Drag': { hi: 'लो ड्रैग', mr: 'लो ड्रॅग', gu: 'લો ડ્રેગ' },
  'Permanent Magnet': { hi: 'परमानेंट मैग्नेट', mr: 'पर्मनंट मॅग्नेट', gu: 'પર્મનન્ટ મેગ્નેટ' },
  'Multi Step': { hi: 'मल्टी स्टेप', mr: 'मल्टी स्टेप', gu: 'મલ્ટી સ્ટેપ' },
  'Preload Adjustment': { hi: 'प्रीलोड एडजस्टमेंट', mr: 'प्रीलोड अ‍ॅडजस्टमेंट', gu: 'પ્રીલોડ એડજસ્ટમેન્ટ' },
  'Smart Display': { hi: 'स्मार्ट डिस्प्ले', mr: 'स्मार्ट डिस्प्ले', gu: 'સ્માર્ટ ડિસ્પ્લે' },
  'Synthetic Grade': { hi: 'सिंथेटिक ग्रेड', mr: 'सिंथेटिक ग्रेड', gu: 'સિન્થેટિક ગ્રેડ' },

  // --- single words ----------------------------------------------------------
  off: { hi: 'छूट', mr: 'सूट', gu: 'છૂટ' },
  more: { hi: 'और भी', mr: 'आणखी', gu: 'વધુ' },
  Without: { hi: 'बिना', mr: 'शिवाय', gu: 'વગર' },
  With: { hi: 'सहित', mr: 'सह', gu: 'સાથે' },
  Amber: { hi: 'एम्बर', mr: 'अंबर', gu: 'એમ્બર' },
  pin: { hi: 'पिन', mr: 'पिन', gu: 'પિન' },
  Pin: { hi: 'पिन', mr: 'पिन', gu: 'પિન' },
  Part: { hi: 'पार्ट', mr: 'पार्ट', gu: 'પાર્ટ' },
  Parts: { hi: 'पार्ट्स', mr: 'पार्ट्स', gu: 'પાર્ટ્સ' },
  Connector: { hi: 'कनेक्टर', mr: 'कनेक्टर', gu: 'કનેક્ટર' },
  Socket: { hi: 'सॉकेट', mr: 'सॉकेट', gu: 'સોકેટ' },
  Holder: { hi: 'होल्डर', mr: 'होल्डर', gu: 'હોલ્ડર' },
  Glass: { hi: 'ग्लास', mr: 'ग्लास', gu: 'ગ્લાસ' },
  Rubber: { hi: 'रबर', mr: 'रबर', gu: 'રબર' },
  Plastic: { hi: 'प्लास्टिक', mr: 'प्लास्टिक', gu: 'પ્લાસ્ટિક' },
  Shocker: { hi: 'शॉकर', mr: 'शॉकर', gu: 'શોકર' },
  Headlight: { hi: 'हेडलाइट', mr: 'हेडलाइट', gu: 'હેડલાઇટ' },
  Projector: { hi: 'प्रोजेक्टर', mr: 'प्रोजेक्टर', gu: 'પ્રોજેક્ટર' },
  DRL: { hi: 'डीआरएल', mr: 'डीआरएल', gu: 'ડીઆરએલ' },
  Combo: { hi: 'कॉम्बो', mr: 'कॉम्बो', gu: 'કોમ્બો' },
  Pair: { hi: 'जोड़ी', mr: 'जोडी', gu: 'જોડી' },
  Ring: { hi: 'रिंग', mr: 'रिंग', gu: 'રિંગ' },
  Friction: { hi: 'फ्रिक्शन', mr: 'फ्रिक्शन', gu: 'ફ્રિક્શન' },
  Hydraulic: { hi: 'हाइड्रोलिक', mr: 'हायड्रॉलिक', gu: 'હાઇડ્રોલિક' },
  Telescopic: { hi: 'टेलीस्कोपिक', mr: 'टेलिस्कोपिक', gu: 'ટેલિસ્કોપિક' },
  Overhaul: { hi: 'ओवरहॉल', mr: 'ओव्हरहॉल', gu: 'ઓવરહોલ' },
  Precision: { hi: 'प्रिसिज़न', mr: 'प्रिसिजन', gu: 'પ્રિસિઝન' },
  Machined: { hi: 'मशीन्ड', mr: 'मशीन्ड', gu: 'મશીન્ડ' },
  Painted: { hi: 'पेंटेड', mr: 'पेंटेड', gu: 'પેઇન્ટેડ' },
  Plated: { hi: 'प्लेटेड', mr: 'प्लेटेड', gu: 'પ્લેટેડ' },
  Ergonomic: { hi: 'एर्गोनोमिक', mr: 'अर्गोनॉमिक', gu: 'એર્ગોનોમિક' },
  Factory: { hi: 'फ़ैक्ट्री', mr: 'फॅक्टरी', gu: 'ફેક્ટરી' },
  Fully: { hi: 'पूरी तरह', mr: 'पूर्णपणे', gu: 'સંપૂર્ણપણે' },
  Motorcycle: { hi: 'मोटरसाइकिल', mr: 'मोटरसायकल', gu: 'મોટરસાયકલ' },
  spares: { hi: 'स्पेयर', mr: 'स्पेअर', gu: 'સ્પેર' },
  Bulb: { hi: 'बल्ब', mr: 'बल्ब', gu: 'બલ્બ' },
  Chrome: { hi: 'क्रोम', mr: 'क्रोम', gu: 'ક્રોમ' },
  Clear: { hi: 'क्लियर', mr: 'क्लिअर', gu: 'ક્લિયર' },
  Assy: { hi: 'असेंबली', mr: 'असेंब्ली', gu: 'એસેમ્બલી' },
  Indicator: { hi: 'इंडिकेटर', mr: 'इंडिकेटर', gu: 'ઇન્ડિકેટર' },
  Horn: { hi: 'हॉर्न', mr: 'हॉर्न', gu: 'હોર્ન' },
  Mirror: { hi: 'मिरर', mr: 'मिरर', gu: 'મિરર' },
  Grip: { hi: 'ग्रिप', mr: 'ग्रिप', gu: 'ગ્રિપ' },
  Bolt: { hi: 'बोल्ट', mr: 'बोल्ट', gu: 'બોલ્ટ' },
  Nut: { hi: 'नट', mr: 'नट', gu: 'નટ' },
  Spring: { hi: 'स्प्रिंग', mr: 'स्प्रिंग', gu: 'સ્પ્રિંગ' },
  Washer: { hi: 'वॉशर', mr: 'वॉशर', gu: 'વોશર' },
  Gasket: { hi: 'गैस्केट', mr: 'गॅस्केट', gu: 'ગાસ્કેટ' },
  Chain: { hi: 'चेन', mr: 'चेन', gu: 'ચેઇન' },
  Aviation: { hi: 'एविएशन', mr: 'एव्हिएशन', gu: 'એવિએશન' },
  Bay: { hi: 'बे', mr: 'बे', gu: 'બે' },
  Spectrum: { hi: 'स्पेक्ट्रम', mr: 'स्पेक्ट्रम', gu: 'સ્પેક્ટ્રમ' },
  Matrix: { hi: 'मैट्रिक्स', mr: 'मॅट्रिक्स', gu: 'મેટ્રિક્સ' },
  Range: { hi: 'रेंज', mr: 'रेंज', gu: 'રેન્જ' },
  Extended: { hi: 'एक्सटेंडेड', mr: 'एक्स्टेंडेड', gu: 'એક્સટેન્ડેડ' },
  Auto: { hi: 'ऑटो', mr: 'ऑटो', gu: 'ઓટો' },
  CDI: { hi: 'सीडीआई', mr: 'सीडीआय', gu: 'સીડીઆઈ' },
  TCI: { hi: 'टीसीआई', mr: 'टीसीआय', gu: 'ટીસીઆઈ' },
  TPFC: { hi: 'टीपीएफसी', mr: 'टीपीएफसी', gu: 'ટીપીએફસી' },
  ECU: { hi: 'ईसीयू', mr: 'ईसीयू', gu: 'ઈસીયુ' },
  LED: { hi: 'एलईडी', mr: 'एलईडी', gu: 'એલઈડી' },
  High: { hi: 'हाई', mr: 'हाय', gu: 'હાઈ' },
  Low: { hi: 'लो', mr: 'लो', gu: 'લો' },
  Full: { hi: 'फुल', mr: 'फुल', gu: 'ફુલ' },
  Drag: { hi: 'ड्रैग', mr: 'ड्रॅग', gu: 'ડ્રેગ' },
  Efficiency: { hi: 'एफिशिएंसी', mr: 'एफिशियन्सी', gu: 'એફિશિયન્સી' },
  Permanent: { hi: 'परमानेंट', mr: 'पर्मनंट', gu: 'પર્મનન્ટ' },
  Adjustment: { hi: 'एडजस्टमेंट', mr: 'अ‍ॅडजस्टमेंट', gu: 'એડજસ્ટમેન્ટ' },
  Smart: { hi: 'स्मार्ट', mr: 'स्मार्ट', gu: 'સ્માર્ટ' },
  Duty: { hi: 'ड्यूटी', mr: 'ड्युटी', gu: 'ડ્યુટી' },
  Heavy: { hi: 'हेवी', mr: 'हेवी', gu: 'હેવી' },
  Filled: { hi: 'फिल्ड', mr: 'फिल्ड', gu: 'ફિલ્ડ' },
  Absorber: { hi: 'अब्जॉर्बर', mr: 'अ‍ॅब्झॉर्बर', gu: 'એબ્ઝોર્બર' },
  Accelerator: { hi: 'एक्सेलेरेटर', mr: 'अ‍ॅक्सिलरेटर', gu: 'એક્સેલરેટર' },
  Aerodynamic: { hi: 'एरोडायनामिक', mr: 'एरोडायनॅमिक', gu: 'એરોડાયનેમિક' },
  Air: { hi: 'एयर', mr: 'एअर', gu: 'એર' },
  Alloy: { hi: 'अलॉय', mr: 'अलॉय', gu: 'એલોય' },
  Aluminium: { hi: 'एल्युमिनियम', mr: 'अ‍ॅल्युमिनियम', gu: 'એલ્યુમિનિયમ' },
  Aluminum: { hi: 'एल्युमिनियम', mr: 'अ‍ॅल्युमिनियम', gu: 'એલ્યુમિનિયમ' },
  Analog: { hi: 'एनालॉग', mr: 'अ‍ॅनालॉग', gu: 'એનાલોગ' },
  Arm: { hi: 'आर्म', mr: 'आर्म', gu: 'આર્મ' },
  Armature: { hi: 'आर्मेचर', mr: 'आर्मेचर', gu: 'આર્મેચર' },
  Assembly: { hi: 'असेंबली', mr: 'असेंब्ली', gu: 'એસેમ્બલી' },
  Ball: { hi: 'बॉल', mr: 'बॉल', gu: 'બોલ' },
  Bar: { hi: 'बार', mr: 'बार', gu: 'બાર' },
  Battery: { hi: 'बैटरी', mr: 'बॅटरी', gu: 'બેટરી' },
  Beam: { hi: 'बीम', mr: 'बीम', gu: 'બીમ' },
  Bearing: { hi: 'बेयरिंग', mr: 'बेअरिंग', gu: 'બેરિંગ' },
  Belt: { hi: 'बेल्ट', mr: 'बेल्ट', gu: 'બેલ્ટ' },
  Bike: { hi: 'बाइक', mr: 'बाइक', gu: 'બાઇક' },
  Black: { hi: 'काला', mr: 'काळा', gu: 'કાળો' },
  Block: { hi: 'ब्लॉक', mr: 'ब्लॉक', gu: 'બ્લોક' },
  Blue: { hi: 'नीला', mr: 'निळा', gu: 'વાદળી' },
  Body: { hi: 'बॉडी', mr: 'बॉडी', gu: 'બોડી' },
  Bore: { hi: 'बोर', mr: 'बोर', gu: 'બોર' },
  Box: { hi: 'बॉक्स', mr: 'बॉक्स', gu: 'બોક્સ' },
  Brake: { hi: 'ब्रेक', mr: 'ब्रेक', gu: 'બ્રેક' },
  Brakes: { hi: 'ब्रेक', mr: 'ब्रेक', gu: 'બ્રેક' },
  Brown: { hi: 'भूरा', mr: 'तपकिरी', gu: 'કથ્થઈ' },
  Bush: { hi: 'बुश', mr: 'बुश', gu: 'બુશ' },
  Cable: { hi: 'केबल', mr: 'केबल', gu: 'કેબલ' },
  Cables: { hi: 'केबल', mr: 'केबल', gu: 'કેબલ' },
  Caliper: { hi: 'कैलिपर', mr: 'कॅलिपर', gu: 'કેલિપર' },
  Cam: { hi: 'कैम', mr: 'कॅम', gu: 'કેમ' },
  Carburetor: { hi: 'कार्बोरेटर', mr: 'कार्बोरेटर', gu: 'કાર્બોરેટર' },
  Case: { hi: 'केस', mr: 'केस', gu: 'કેસ' },
  Chain: { hi: 'चेन', mr: 'चेन', gu: 'ચેઇન' },
  Clutch: { hi: 'क्लच', mr: 'क्लच', gu: 'ક્લચ' },
  Coil: { hi: 'कॉइल', mr: 'कॉइल', gu: 'કોઇલ' },
  Colour: { hi: 'रंग', mr: 'रंग', gu: 'રંગ' },
  Cone: { hi: 'कोन', mr: 'कोन', gu: 'કોન' },
  Control: { hi: 'कंट्रोल', mr: 'कंट्रोल', gu: 'કંટ્રોલ' },
  Core: { hi: 'कोर', mr: 'कोर', gu: 'કોર' },
  Coupling: { hi: 'कपलिंग', mr: 'कपलिंग', gu: 'કપલિંગ' },
  Cover: { hi: 'कवर', mr: 'कव्हर', gu: 'કવર' },
  Crank: { hi: 'क्रैंक', mr: 'क्रँक', gu: 'ક્રેન્ક' },
  Cylinder: { hi: 'सिलेंडर', mr: 'सिलिंडर', gu: 'સિલિન્ડર' },
  Damper: { hi: 'डैम्पर', mr: 'डॅम्पर', gu: 'ડેમ્પર' },
  Decal: { hi: 'डिकल', mr: 'डिकल', gu: 'ડિકલ' },
  Dielectric: { hi: 'डाइइलेक्ट्रिक', mr: 'डायइलेक्ट्रिक', gu: 'ડાયઇલેક્ટ્રિક' },
  Digital: { hi: 'डिजिटल', mr: 'डिजिटल', gu: 'ડિજિટલ' },
  Disc: { hi: 'डिस्क', mr: 'डिस्क', gu: 'ડિસ્ક' },
  Display: { hi: 'डिस्प्ले', mr: 'डिस्प्ले', gu: 'ડિસ્પ્લે' },
  Drum: { hi: 'ड्रम', mr: 'ड्रम', gu: 'ડ્રમ' },
  Electric: { hi: 'इलेक्ट्रिक', mr: 'इलेक्ट्रिक', gu: 'ઇલેક્ટ્રિક' },
  Electronic: { hi: 'इलेक्ट्रॉनिक', mr: 'इलेक्ट्रॉनिक', gu: 'ઇલેક્ટ્રોનિક' },
  Engine: { hi: 'इंजन', mr: 'इंजिन', gu: 'એન્જિન' },
  Fan: { hi: 'फैन', mr: 'फॅन', gu: 'ફેન' },
  Filter: { hi: 'फ़िल्टर', mr: 'फिल्टर', gu: 'ફિલ્ટર' },
  Floor: { hi: 'फ्लोर', mr: 'फ्लोअर', gu: 'ફ્લોર' },
  Foot: { hi: 'फुट', mr: 'फूट', gu: 'ફૂટ' },
  Fork: { hi: 'फोर्क', mr: 'फोर्क', gu: 'ફોર્ક' },
  Front: { hi: 'फ्रंट', mr: 'फ्रंट', gu: 'ફ્રન્ટ' },
  Fuel: { hi: 'फ्यूल', mr: 'फ्यूएल', gu: 'ફ્યુઅલ' },
  Gas: { hi: 'गैस', mr: 'गॅस', gu: 'ગેસ' },
  Gear: { hi: 'गियर', mr: 'गिअर', gu: 'ગિયર' },
  Gearbox: { hi: 'गियरबॉक्स', mr: 'गिअरबॉक्स', gu: 'ગિયરબોક્સ' },
  Genuine: { hi: 'असली', mr: 'अस्सल', gu: 'અસલી' },
  Grade: { hi: 'ग्रेड', mr: 'ग्रेड', gu: 'ગ્રેડ' },
  Graphics: { hi: 'ग्राफिक्स', mr: 'ग्राफिक्स', gu: 'ગ્રાફિક્સ' },
  Green: { hi: 'हरा', mr: 'हिरवा', gu: 'લીલો' },
  Grey: { hi: 'ग्रे', mr: 'ग्रे', gu: 'ગ્રે' },
  Guard: { hi: 'गार्ड', mr: 'गार्ड', gu: 'ગાર્ડ' },
  Handle: { hi: 'हैंडल', mr: 'हँडल', gu: 'હેન્ડલ' },
  Harness: { hi: 'हार्नेस', mr: 'हार्नेस', gu: 'હાર્નેસ' },
  Head: { hi: 'हेड', mr: 'हेड', gu: 'હેડ' },
  Housing: { hi: 'हाउसिंग', mr: 'हाउसिंग', gu: 'હાઉસિંગ' },
  Ignition: { hi: 'इग्निशन', mr: 'इग्निशन', gu: 'ઇગ્નિશન' },
  Ignitor: { hi: 'इग्नाइटर', mr: 'इग्नायटर', gu: 'ઇગ્નાઇટર' },
  Injector: { hi: 'इंजेक्टर', mr: 'इंजेक्टर', gu: 'ઇન્જેક્ટર' },
  Integrated: { hi: 'इंटीग्रेटेड', mr: 'इंटिग्रेटेड', gu: 'ઇન્ટિગ્રેટેડ' },
  Kick: { hi: 'किक', mr: 'किक', gu: 'કિક' },
  Kit: { hi: 'किट', mr: 'किट', gu: 'કિટ' },
  Leg: { hi: 'लेग', mr: 'लेग', gu: 'લેગ' },
  Lever: { hi: 'लीवर', mr: 'लिव्हर', gu: 'લીવર' },
  Light: { hi: 'लाइट', mr: 'लाइट', gu: 'લાઇટ' },
  Lock: { hi: 'लॉक', mr: 'लॉक', gu: 'લોક' },
  Lower: { hi: 'लोअर', mr: 'लोअर', gu: 'લોઅર' },
  Lubricant: { hi: 'लुब्रिकेंट', mr: 'ल्युब्रिकंट', gu: 'લુબ્રિકન્ટ' },
  Magnet: { hi: 'मैग्नेट', mr: 'मॅग्नेट', gu: 'મેગ્નેટ' },
  Master: { hi: 'मास्टर', mr: 'मास्टर', gu: 'માસ્ટર' },
  Meter: { hi: 'मीटर', mr: 'मीटर', gu: 'મીટર' },
  Model: { hi: 'मॉडल', mr: 'मॉडेल', gu: 'મોડેલ' },
  Models: { hi: 'मॉडल', mr: 'मॉडेल', gu: 'મોડેલ' },
  Mono: { hi: 'मोनो', mr: 'मोनो', gu: 'મોનો' },
  Monogram: { hi: 'मोनोग्राम', mr: 'मोनोग्राम', gu: 'મોનોગ્રામ' },
  Motor: { hi: 'मोटर', mr: 'मोटर', gu: 'મોટર' },
  Mudguard: { hi: 'मडगार्ड', mr: 'मडगार्ड', gu: 'મડગાર્ડ' },
  Multi: { hi: 'मल्टी', mr: 'मल्टी', gu: 'મલ્ટી' },
  Oil: { hi: 'ऑयल', mr: 'ऑइल', gu: 'ઓઇલ' },
  Original: { hi: 'ओरिजिनल', mr: 'ओरिजिनल', gu: 'ઓરિજિનલ' },
  Pad: { hi: 'पैड', mr: 'पॅड', gu: 'પેડ' },
  Panel: { hi: 'पैनल', mr: 'पॅनल', gu: 'પેનલ' },
  Pedal: { hi: 'पेडल', mr: 'पेडल', gu: 'પેડલ' },
  Petrol: { hi: 'पेट्रोल', mr: 'पेट्रोल', gu: 'પેટ્રોલ' },
  Pinion: { hi: 'पिनियन', mr: 'पिनियन', gu: 'પિનિયન' },
  Pipe: { hi: 'पाइप', mr: 'पाइप', gu: 'પાઇપ' },
  Piston: { hi: 'पिस्टन', mr: 'पिस्टन', gu: 'પિસ્ટન' },
  Planetary: { hi: 'प्लैनेटरी', mr: 'प्लॅनेटरी', gu: 'પ્લેનેટરી' },
  Plate: { hi: 'प्लेट', mr: 'प्लेट', gu: 'પ્લેટ' },
  Platform: { hi: 'प्लेटफॉर्म', mr: 'प्लॅटफॉर्म', gu: 'પ્લેટફોર્મ' },
  Preload: { hi: 'प्रीलोड', mr: 'प्रीलोड', gu: 'પ્રીલોડ' },
  Pulley: { hi: 'पुली', mr: 'पुली', gu: 'પુલી' },
  Pump: { hi: 'पंप', mr: 'पंप', gu: 'પંપ' },
  Racer: { hi: 'रेसर', mr: 'रेसर', gu: 'રેસર' },
  Rachet: { hi: 'रैचेट', mr: 'रॅचेट', gu: 'રેચેટ' },
  Radiator: { hi: 'रेडिएटर', mr: 'रेडिएटर', gu: 'રેડિએટર' },
  Rear: { hi: 'रियर', mr: 'रिअर', gu: 'રિયર' },
  Rectifier: { hi: 'रेक्टिफायर', mr: 'रेक्टिफायर', gu: 'રેક્ટિફાયર' },
  Red: { hi: 'लाल', mr: 'लाल', gu: 'લાલ' },
  Reduction: { hi: 'रिडक्शन', mr: 'रिडक्शन', gu: 'રિડક્શન' },
  Regenerative: { hi: 'रीजेनेरेटिव', mr: 'रिजनरेटिव्ह', gu: 'રિજનરેટિવ' },
  Regulator: { hi: 'रेगुलेटर', mr: 'रेग्युलेटर', gu: 'રેગ્યુલેટર' },
  Repair: { hi: 'रिपेयर', mr: 'रिपेअर', gu: 'રિપેર' },
  Rest: { hi: 'रेस्ट', mr: 'रेस्ट', gu: 'રેસ્ટ' },
  Rim: { hi: 'रिम', mr: 'रिम', gu: 'રિમ' },
  Rocker: { hi: 'रॉकर', mr: 'रॉकर', gu: 'રોકર' },
  Rod: { hi: 'रॉड', mr: 'रॉड', gu: 'રોડ' },
  Roller: { hi: 'रोलर', mr: 'रोलर', gu: 'રોલર' },
  Seal: { hi: 'सील', mr: 'सील', gu: 'સીલ' },
  Sealed: { hi: 'सील्ड', mr: 'सील्ड', gu: 'સીલ્ડ' },
  Self: { hi: 'सेल्फ', mr: 'सेल्फ', gu: 'સેલ્ફ' },
  Sensor: { hi: 'सेंसर', mr: 'सेन्सर', gu: 'સેન્સર' },
  Set: { hi: 'सेट', mr: 'सेट', gu: 'સેટ' },
  Shaft: { hi: 'शाफ्ट', mr: 'शाफ्ट', gu: 'શાફ્ટ' },
  Shield: { hi: 'शील्ड', mr: 'शील्ड', gu: 'શીલ્ડ' },
  Shielded: { hi: 'शील्डेड', mr: 'शील्डेड', gu: 'શીલ્ડેડ' },
  Shock: { hi: 'शॉक', mr: 'शॉक', gu: 'શોક' },
  Shoe: { hi: 'शू', mr: 'शू', gu: 'શૂ' },
  Side: { hi: 'साइड', mr: 'साइड', gu: 'સાઇડ' },
  Sides: { hi: 'साइड', mr: 'बाजू', gu: 'બાજુ' },
  Silencer: { hi: 'साइलेंसर', mr: 'सायलेन्सर', gu: 'સાઇલેન્સર' },
  Silver: { hi: 'सिल्वर', mr: 'सिल्व्हर', gu: 'સિલ્વર' },
  Spark: { hi: 'स्पार्क', mr: 'स्पार्क', gu: 'સ્પાર્ક' },
  Speed: { hi: 'स्पीड', mr: 'स्पीड', gu: 'સ્પીડ' },
  Speedometer: { hi: 'स्पीडोमीटर', mr: 'स्पीडोमीटर', gu: 'સ્પીડોમીટર' },
  Sprocket: { hi: 'स्प्रोकेट', mr: 'स्प्रॉकेट', gu: 'સ્પ્રોકેટ' },
  Starter: { hi: 'स्टार्टर', mr: 'स्टार्टर', gu: 'સ્ટાર્ટર' },
  Stator: { hi: 'स्टेटर', mr: 'स्टेटर', gu: 'સ્ટેટર' },
  Steel: { hi: 'स्टील', mr: 'स्टील', gu: 'સ્ટીલ' },
  Step: { hi: 'स्टेप', mr: 'स्टेप', gu: 'સ્ટેપ' },
  Sticker: { hi: 'स्टिकर', mr: 'स्टिकर', gu: 'સ્ટીકર' },
  Suspension: { hi: 'सस्पेंशन', mr: 'सस्पेंशन', gu: 'સસ્પેન્શન' },
  Switch: { hi: 'स्विच', mr: 'स्विच', gu: 'સ્વિચ' },
  Synchronous: { hi: 'सिंक्रोनस', mr: 'सिंक्रोनस', gu: 'સિંક્રોનસ' },
  Synthetic: { hi: 'सिंथेटिक', mr: 'सिंथेटिक', gu: 'સિન્થેટિક' },
  Tail: { hi: 'टेल', mr: 'टेल', gu: 'ટેલ' },
  Tank: { hi: 'टैंक', mr: 'टाकी', gu: 'ટાંકી' },
  Tee: { hi: 'टी', mr: 'टी', gu: 'ટી' },
  Throttle: { hi: 'थ्रॉटल', mr: 'थ्रॉटल', gu: 'થ્રોટલ' },
  Torque: { hi: 'टॉर्क', mr: 'टॉर्क', gu: 'ટોર્ક' },
  Transmission: { hi: 'ट्रांसमिशन', mr: 'ट्रान्समिशन', gu: 'ટ્રાન્સમિશન' },
  Trigger: { hi: 'ट्रिगर', mr: 'ट्रिगर', gu: 'ટ્રિગર' },
  Tube: { hi: 'ट्यूब', mr: 'ट्यूब', gu: 'ટ્યુબ' },
  Type: { hi: 'टाइप', mr: 'प्रकार', gu: 'પ્રકાર' },
  Unit: { hi: 'यूनिट', mr: 'युनिट', gu: 'યુનિટ' },
  Valve: { hi: 'वाल्व', mr: 'व्हॉल्व्ह', gu: 'વાલ્વ' },
  Valves: { hi: 'वाल्व', mr: 'व्हॉल्व्ह', gu: 'વાલ્વ' },
  Vehicle: { hi: 'गाड़ी', mr: 'वाहन', gu: 'વાહન' },
  Vinyl: { hi: 'विनाइल', mr: 'विनाइल', gu: 'વિનાઇલ' },
  Visor: { hi: 'वाइज़र', mr: 'व्हायझर', gu: 'વાઇઝર' },
  Voltage: { hi: 'वोल्टेज', mr: 'व्होल्टेज', gu: 'વોલ્ટેજ' },
  Way: { hi: 'वे', mr: 'वे', gu: 'વે' },
  Weights: { hi: 'वेट', mr: 'वेट', gu: 'વેઇટ' },
  Wheel: { hi: 'व्हील', mr: 'व्हील', gu: 'વ્હીલ' },
  White: { hi: 'सफ़ेद', mr: 'पांढरा', gu: 'સફેદ' },
  Wiring: { hi: 'वायरिंग', mr: 'वायरिंग', gu: 'વાયરિંગ' },
  Worm: { hi: 'वर्म', mr: 'वर्म', gu: 'વોર્મ' },
  and: { hi: 'और', mr: 'आणि', gu: 'અને' },
  of: { hi: 'का', mr: 'चा', gu: 'નો' },
  or: { hi: 'या', mr: 'किंवा', gu: 'અથવા' },
  with: { hi: 'सहित', mr: 'सह', gu: 'સાથે' }
};

/** The word joining a part to the vehicle it fits, e.g. "Brake Pad *for* Honda Activa". */
export const joinFor = { en: 'for', hi: 'के लिए', mr: 'साठी', gu: 'માટે' };

/** Whether the joining word goes before the vehicle (English) or after it (Indic). */
export const joinAfterVehicle = { en: false, hi: true, mr: true, gu: true };

export function translatePartTerm(term, lang) {
  if (!term || lang === 'en') return term;
  return partTerms[term]?.[lang] || translatePhrase(term, lang);
}

// Phrases are indexed by word count so the walker can try the longest first.
const LEXICON_BY_LENGTH = (() => {
  const byLen = new Map();
  for (const [phrase, value] of Object.entries(partLexicon)) {
    const n = phrase.trim().split(/\s+/).length;
    if (!byLen.has(n)) byLen.set(n, new Map());
    byLen.get(n).set(phrase.toLowerCase(), value);
  }
  return byLen;
})();

const MAX_PHRASE = Math.max(...LEXICON_BY_LENGTH.keys());

/**
 * Replaces every known phrase in `text`, longest match first, and leaves
 * everything else exactly as it was.
 *
 * Splitting on whitespace only — punctuation stays glued to its word and is
 * stripped for the lookup, then re-attached — keeps "(Bajaj" and "Set)" and
 * "Karizma/" intact rather than reflowing the separators.
 */
export function translatePhrase(text, lang) {
  if (!text || lang === 'en') return text;

  // Hyphens separate words as surely as spaces do — "High-Efficiency" and
  // "Mono-Suspension" are two lexicon lookups, not one unknown token.
  const pieces = String(text).split(/([\s‐-―-]+)/);
  const tokens = [];
  const seps = [];
  for (let i = 0; i < pieces.length; i += 2) {
    tokens.push(pieces[i]);
    seps.push(pieces[i + 1] ?? '');
  }

  let out = '';
  let i = 0;
  while (i < tokens.length) {
    let matched = false;

    for (let n = Math.min(MAX_PHRASE, tokens.length - i); n >= 1 && !matched; n -= 1) {
      const joined = tokens.slice(i, i + n).join(' ');
      // Punctuation on the outer edges is not part of the phrase: "(Bajaj" and
      // "Set)" must still match "bajaj" and "set" and keep their brackets.
      const lead = joined.match(/^[^\p{L}\p{N}]*/u)[0];
      const tail = joined.match(/[^\p{L}\p{N}]*$/u)[0];
      if (lead.length + tail.length >= joined.length) continue; // punctuation only

      const core = joined.slice(lead.length, joined.length - tail.length);
      const hit = LEXICON_BY_LENGTH.get(n)?.get(core.toLowerCase());
      if (hit && hit[lang]) {
        out += lead + hit[lang] + tail + seps[i + n - 1];
        i += n;
        matched = true;
      }
    }

    if (!matched) {
      out += tokens[i] + seps[i];
      i += 1;
    }
  }

  return out;
}

/** "Fits <vehicle>" in the word order of the target language. */
const FITS = {
  hi: (v) => `${v} में फ़िट`,
  mr: (v) => `${v} मध्ये बसते`,
  gu: (v) => `${v} માં ફિટ`
};

/**
 * A fitment line — "Fits Honda Activa 6G", or a bare vehicle list.
 *
 * English puts the verb first; Hindi, Marathi and Gujarati put it last, so a
 * straight word swap would read backwards. The vehicle itself still goes
 * through the lexicon, which leaves model names alone and localises trailing
 * qualifiers.
 */
const FITMENT_LABEL = { hi: 'फ़िटमेंट', mr: 'फिटमेंट', gu: 'ફિટમેન્ટ' };

export function translateFitment(text, lang) {
  if (!text || lang === 'en') return text;

  // The curated feed writes "Fitment: Splendor Plus, HF Deluxe, …" — a label
  // followed by a list of model names that must stay as they are.
  const labelled = String(text).match(/^\s*fitment\s*:\s*(.+)$/i);
  if (labelled) {
    return `${FITMENT_LABEL[lang] || 'Fitment'}: ${translatePhrase(labelled[1].trim(), lang)}`;
  }

  const m = String(text).match(/^\s*fits\s+(.+)$/i);
  const vehicle = translatePhrase((m ? m[1] : String(text)).trim(), lang);
  return m && FITS[lang] ? FITS[lang](vehicle) : vehicle;
}

/**
 * Localises a catalog product title.
 *
 * Titles usually read "<Part…> for <Vehicle…>". The part half goes through the
 * lexicon; the vehicle half is left verbatim because brand and model names are
 * proper nouns. Word order follows the target language, so Hindi reads
 * "होंडा एक्टिवा के लिए ब्रेक पैड" rather than English order.
 *
 * Titles without "for" — the EV range and a few OEM listings — are walked in
 * place, which translates the part words and leaves the vehicle alone anyway.
 */
export function translateProductName(name, lang, categoryName = '') {
  if (!name || lang === 'en') return name;

  const whole = partTerms[name.trim()]?.[lang];
  if (whole) return whole;

  // The qualifier tail after the first "|" describes the fitment, not the part.
  const [rawHead, ...tailSegments] = String(name).split('|');
  const tail = tailSegments.map((s) => translatePhrase(s.trim(), lang)).filter(Boolean);

  const join = joinFor[lang] || joinFor.en;

  // A bracketed "(For <vehicle>)" is a fitment clause, so it takes the joining
  // word of the target language and its own word order.
  const bracketFixed = joinAfterVehicle[lang]
    ? rawHead.replace(/\(\s*for\s+([^)]+)\)/gi, (_, vehicle) => `(${vehicle.trim()} ${join})`)
    : rawHead;

  // The EV listings name the vehicle after a dash rather than after "for":
  // "…Alloy Wheel Rim for Extended Range - TVS iQube (2.2 kWh)". Peeling that
  // suffix off first stops it being swept into the "for" clause and reordered
  // to the front, which read as though the part fitted an "Extended Range".
  const dash = bracketFixed.match(/^(.*\S)\s+[-–—]\s+(\S.*)$/);
  const head = dash ? dash[1] : bracketFixed;
  const vehicleSuffix = dash ? ` - ${translatePhrase(dash[2], lang)}` : '';

  const split = head.split(/\s+for\s+/i);
  let localisedHead;

  if (split.length >= 2) {
    const part = translatePhrase(split[0].trim(), lang);
    // The vehicle half is walked too: model names are absent from the lexicon
    // so they pass through, while trailing qualifiers ("Alloy Wheel New Model")
    // get localised instead of being stranded in English.
    const vehicle = translatePhrase(split.slice(1).join(' for ').trim(), lang);
    localisedHead = joinAfterVehicle[lang]
      ? `${vehicle} ${join} ${part}`
      : `${part} ${join} ${vehicle}`;
  } else {
    localisedHead = translatePhrase(head.trim(), lang);
  }

  // Nothing recognised at all — fall back to the category so the shopper still
  // reads the part type in their own language.
  if (localisedHead === head.trim() && categoryName) {
    const cat = partTerms[categoryName]?.[lang];
    if (cat) localisedHead = `${localisedHead} — ${cat}`;
  }

  return [localisedHead + vehicleSuffix, ...tail].join(' | ');
}
