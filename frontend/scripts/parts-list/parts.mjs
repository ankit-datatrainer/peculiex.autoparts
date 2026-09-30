// =============================================================================
// SHOP PARTS LIST
//
// The 77-line parts sheet plus the handwritten cables note, turned into one
// master list. Every entry says:
//
//   name       what the listing is called
//   category   the storefront category it lives in (existing where one fits)
//   existing   true when that category already holds real scraped listings —
//              a model that already has one is skipped, not duplicated
//   photoFrom  a real-photo category to borrow a picture of this part type
//              from; parts without one get a themed illustration (art)
//   group      the category group a NEW category is filed under
//   base       baseline selling price in ₹ for a commuter model, used when
//              the catalog has no real prices for this part type
//   fits       which vehicle classes the part exists on
//   fuel       'carb' | 'fi' when the part only exists on one fuel system
//   desc       one factual sentence — no fitment or genuineness claims
//
// Sheet lines that repeat (Cables ×2, Clutch Plate ×2, Spokes ×2) appear once.
// "Cables" is expanded into the specific cables from the handwritten note.
// =============================================================================

// Vehicle classes: BIKE and SCOOTER are petrol; EV covers electric scooters
// and the one electric motorcycle.
export const BIKE = 'bike';
export const SCOOTER = 'scooter';
export const EV = 'ev';

const IC = [BIKE, SCOOTER];
const ALL = [BIKE, SCOOTER, EV];

export const PARTS = [
  // 1-11 · fuel, ignition, starting ------------------------------------------
  { sheet: 1, key: 'spark-plug', name: 'Spark Plug', category: 'Spark Plug', group: 'electricals', art: 'spark-plug', base: 179, fits: IC,
    desc: 'Replacement spark plug for reliable cold starts and a clean, even burn.' },
  { sheet: 2, key: 'fuel-pump-assy', name: 'Fuel Pump Assembly', category: 'Fuel Pump Assembly', existing: true, photoFrom: 'fuel-pump-assembly', base: 2890, fits: IC, fuel: 'fi',
    desc: 'In-tank fuel pump assembly that feeds pressurised fuel to the injector.' },
  { sheet: 3, key: 'fuel-pump-motor', name: 'Fuel Pump Motor', category: 'Fuel Pump Motor', existing: true, photoFrom: 'fuel-pump-motor', base: 1490, fits: IC, fuel: 'fi',
    desc: 'Electric motor for the in-tank fuel pump.' },
  { sheet: 4, key: 'fuel-filter', name: 'Fuel Filter', category: 'Fuel Filter', group: 'fuel-supply', art: 'filter', base: 149, fits: IC,
    desc: 'Inline fuel filter that keeps dirt and rust out of the carburettor or injector.' },
  { sheet: 5, key: 'injector', name: 'Fuel Injector', category: 'Fuel Injector', existing: true, photoFrom: 'fuel-injector', base: 1690, fits: IC, fuel: 'fi',
    desc: 'Fuel injector that atomises fuel into the intake for the ECU.' },
  { sheet: 6, key: 'injector-cap', name: 'Injector Cap', category: 'Injector Cap', group: 'fuel-supply', art: 'injector-cap', base: 169, fits: IC, fuel: 'fi',
    desc: 'Retaining cap that seats the fuel injector and seals the fuel connection.' },
  { sheet: 7, key: 'injector-pipe', name: 'Injector Pipe', category: 'Injector Pipe', group: 'fuel-supply', art: 'pipe', base: 289, fits: IC, fuel: 'fi',
    desc: 'High-pressure fuel pipe between the pump and the injector.' },
  { sheet: 8, key: 'carburettor', name: 'Carburettor', category: 'Carburetor', existing: true, photoFrom: 'carburetor', base: 1890, fits: IC, fuel: 'carb',
    desc: 'Complete carburettor that meters the air-fuel mixture for the engine.' },
  { sheet: 9, key: 'self-motor', name: 'Self Starter Motor', category: 'Starter Motor', existing: true, photoFrom: 'starter-motor', base: 1590, fits: IC,
    desc: 'Electric self-start motor that cranks the engine.' },
  { sheet: 10, key: 'carbon-kit', name: 'Carbon Brush Kit', category: 'Carbon Brush Kit', group: 'electricals', art: 'carbon', base: 249, fits: IC,
    desc: 'Carbon brush holder kit for the self-starter motor.' },
  { sheet: 11, key: 'carbon', name: 'Carbon Brush', category: 'Carbon Brush', group: 'electricals', art: 'carbon', base: 119, fits: IC,
    desc: 'Replacement carbon brushes for the self-starter motor.' },

  // 12-16 · brakes ------------------------------------------------------------
  { sheet: 12, key: 'disc-pad', name: 'Disc Brake Pad', category: 'Disc Pad', group: 'front-wheel', art: 'disc-pad', base: 319, fits: ALL,
    desc: 'Pair of disc brake pads for the caliper.' },
  { sheet: 13, key: 'brake-shoe', name: 'Brake Shoe', category: 'Brake Shoe', group: 'front-wheel', art: 'brake-shoe', base: 289, fits: ALL,
    desc: 'Pair of drum brake shoes with bonded lining.' },
  { sheet: 14, key: 'disc-plate', name: 'Brake Disc Plate', category: 'Brake Disc Plate', existing: true, photoFrom: 'brake-disc-plate', base: 1290, fits: ALL,
    desc: 'Brake disc rotor that the caliper clamps to stop the wheel.' },
  { sheet: 15, key: 'caliper', name: 'Brake Disc Caliper', category: 'Brake Disc Caliper', existing: true, photoFrom: 'brake-disc-caliper', base: 1490, fits: ALL,
    desc: 'Hydraulic caliper that presses the pads onto the disc.' },
  { sheet: 16, key: 'master-cylinder', name: 'Master Cylinder (Lever Yoke Assembly)', category: 'Disc Brake Master Cylinder Assembly', existing: true, photoFrom: 'disc-brake-master-cylinder-assembly', base: 1390, fits: ALL,
    desc: 'Handlebar master cylinder with lever and yoke for the disc brake.' },

  // 17-28 · engine, bearings, footrests, chain ------------------------------
  { sheet: 17, key: 'one-way-clutch', name: 'One Way Clutch Assembly', category: 'One Way Clutch', existing: true, photoFrom: 'one-way-clutch', base: 890, fits: IC,
    desc: 'Starter one-way (sprag) clutch that engages the self-start drive.' },
  { sheet: 18, key: 'bearing', name: 'Wheel Bearing', category: 'Bearing', group: 'bearing', art: 'bearing', base: 229, fits: ALL,
    desc: 'Sealed ball bearing for the wheel hub.' },
  { sheet: 19, key: 'piston-kit', name: 'Piston Kit', category: 'Piston Kit', existing: true, photoFrom: 'piston-kit', base: 1290, fits: IC,
    desc: 'Piston with rings, pin and clips.' },
  { sheet: 20, key: 'cylinder-block', name: 'Cylinder Block', category: 'Cylinder Block', group: 'engine-drive', photoFrom: 'piston-cylinder-kit', base: 2190, fits: IC,
    desc: 'Engine cylinder block (barrel) the piston runs in.' },
  { sheet: 21, key: 'footrest-assy', name: 'Footrest Assembly', category: 'Front Foot Rest Rod', existing: true, photoFrom: 'front-foot-rest-rod', base: 690, fits: ALL,
    desc: 'Footrest rod with mounting hardware.' },
  { sheet: 22, key: 'footrest-rubber', name: 'Footrest Rubber', category: 'Footrest Rubber', group: 'frame-stands', art: 'rubber', base: 99, fits: ALL,
    desc: 'Pair of anti-slip rubbers for the footrests.' },
  { sheet: 23, key: 'handle-tee', name: 'Handle Tee', category: 'Handle Tee', existing: true, photoFrom: 'handle-tee', base: 990, fits: ALL,
    desc: 'Upper triple clamp (handle tee) that holds the fork and handlebar.' },
  { sheet: 24, key: 'ball-racer', name: 'Ball Racer Set', category: 'Ball Racer Set', existing: true, photoFrom: 'ball-racer-set', base: 390, fits: ALL,
    desc: 'Steering head cones, cups and balls.' },
  { sheet: 25, key: 'timing-chain', name: 'Timing Chain', category: 'Timing Chain', group: 'engine-drive', art: 'chain', base: 449, fits: IC,
    desc: 'Cam timing chain that keeps the camshaft in step with the crank.' },
  { sheet: 26, key: 'chain-guide', name: 'Timing Chain Guide', category: 'Chain Guide', group: 'engine-drive', art: 'chain-guide', base: 269, fits: IC,
    desc: 'Guide and tensioner rail for the cam timing chain.' },
  { sheet: 27, key: 'chain-sprocket', name: 'Chain Sprocket Set', category: 'Chain Sprocket', existing: true, photoFrom: 'chain-sprocket', base: 1290, fits: [BIKE],
    desc: 'Drive chain with front and rear sprockets.' },
  { sheet: 28, key: 'drum-rubber', name: 'Drum Rubber (Hub Damper)', category: 'Drum Rubber', group: 'front-wheel', art: 'rubber', base: 199, fits: [BIKE],
    desc: 'Rear hub damper rubbers that cushion the chain drive.' },

  // 29 / 43 · cables — expanded from the handwritten note ---------------------
  { sheet: 29, key: 'clutch-cable', name: 'Clutch Cable', category: 'Clutch Cable', group: 'cables', art: 'cable', base: 189, fits: [BIKE],
    desc: 'Clutch cable from the handlebar lever to the clutch arm.' },
  { sheet: 29, key: 'accelerator-cable', name: 'Accelerator Cable', category: 'Accelerator Cable', group: 'cables', art: 'cable', base: 179, fits: IC,
    desc: 'Throttle cable from the twist grip to the carburettor or throttle body.' },
  { sheet: 29, key: 'front-brake-cable', name: 'Front Brake Cable', category: 'Front Brake Cable', group: 'cables', art: 'cable', base: 189, fits: IC,
    desc: 'Front drum brake cable from the lever to the brake arm.' },
  { sheet: 29, key: 'rear-brake-cable', name: 'Rear Brake Cable', category: 'Rear Brake Cable', group: 'cables', art: 'cable', base: 209, fits: IC,
    desc: 'Rear brake cable from the lever or pedal to the brake arm.' },
  { sheet: 29, key: 'choke-cable', name: 'Choke Cable', category: 'Choke Cable', group: 'cables', art: 'cable', base: 149, fits: IC, fuel: 'carb',
    desc: 'Choke cable for cold starting on carburetted engines.' },
  { sheet: 29, key: 'seat-cable', name: 'Seat Lock Cable', category: 'Seat Lock Cable', group: 'cables', art: 'cable', base: 169, fits: [SCOOTER, EV],
    desc: 'Seat opener cable from the key lock to the seat latch.' },
  { sheet: 29, key: 'combi-cable-lh', name: 'Combi Brake Cable | Left Hand', category: 'Combi Brake Cable', group: 'cables', art: 'cable', base: 259, fits: [SCOOTER],
    desc: 'Combi-brake (CBS) front brake cable, left-hand side.' },
  { sheet: 29, key: 'combi-cable-rh', name: 'Combi Brake Cable | Right Hand', category: 'Combi Brake Cable', group: 'cables', art: 'cable', base: 259, fits: [SCOOTER],
    desc: 'Combi-brake (CBS) front brake cable, right-hand side.' },

  // 30-47 · controls, locks, stands, meter, electrics ------------------------
  { sheet: 30, key: 'clutch-lever', name: 'Clutch Lever', category: 'Clutch Lever', group: 'handle-steering', art: 'lever', base: 159, fits: [BIKE],
    desc: 'Handlebar clutch lever.' },
  { sheet: 31, key: 'brake-lever', name: 'Brake Lever', category: 'Brake Lever', group: 'handle-steering', art: 'lever', base: 159, fits: ALL,
    desc: 'Handlebar brake lever.' },
  { sheet: 32, key: 'clutch-plate', name: 'Clutch Plate Set', category: 'Clutch Plate', existing: true, photoFrom: 'clutch-plate', base: 690, fits: [BIKE],
    desc: 'Set of clutch friction plates.' },
  { sheet: 33, key: 'ignition-lock', name: 'Main Ignition Lock', category: 'Ignition Lock Set', existing: true, photoFrom: 'ignition-lock-set', base: 790, fits: IC,
    desc: 'Main ignition key switch with keys.' },
  { sheet: 34, key: 'tank-lock', name: 'Petrol Tank Lock', category: 'Petrol Tank Lock', group: 'fuel-supply', art: 'lock', base: 389, fits: IC,
    desc: 'Locking fuel tank cap with keys.' },
  { sheet: 35, key: 'head-light', name: 'Head Light Assembly', category: 'Head Light Set', existing: true, photoFrom: 'head-light-set', base: 1290, fits: ALL,
    desc: 'Complete headlight assembly with reflector and lens.' },
  { sheet: 36, key: 'side-stand', name: 'Side Stand', category: 'Side Stand', group: 'frame-stands', art: 'side-stand', base: 329, fits: ALL,
    desc: 'Side stand with pivot bolt.' },
  { sheet: 37, key: 'main-stand', name: 'Main Stand', category: 'Main Stand', group: 'frame-stands', art: 'main-stand', base: 790, fits: ALL, noBrands: ['ktm', 'kawasaki'],
    desc: 'Centre (main) stand.' },
  { sheet: 38, key: 'speedo-cable', name: 'Speedometer Cable', category: 'Speedometer Cable', group: 'cables', art: 'cable', base: 169, fits: IC,
    desc: 'Speedometer drive cable from the wheel to the meter.' },
  { sheet: 39, key: 'speedo-machine', name: 'Speedometer Machine', category: 'Speedometer', existing: true, photoFrom: 'speedometer', base: 1190, fits: IC,
    desc: 'Speedometer meter unit.' },
  { sheet: 40, key: 'speedo-assy', name: 'Speedometer Assembly', category: 'Speedometer', existing: true, photoFrom: 'speedometer', base: 1490, fits: ALL,
    desc: 'Complete speedometer assembly with housing.' },
  { sheet: 41, key: 'meter-worm-box', name: 'Meter Worm Box', category: 'Meter Worm Box', group: 'electricals', art: 'worm-box', base: 279, fits: IC,
    desc: 'Speedometer drive gearbox at the front wheel.' },
  { sheet: 42, key: 'meter-worm', name: 'Meter Worm Gear', category: 'Meter Worm', group: 'electricals', art: 'gear', base: 139, fits: IC,
    desc: 'Worm gear inside the speedometer drive.' },
  { sheet: 44, key: 'horn', name: 'Horn', category: 'Horn', group: 'electricals', art: 'horn', base: 259, fits: ALL,
    desc: '12 V electric horn.' },
  { sheet: 45, key: 'bulb', name: 'Bulb Set', category: 'Bulb', group: 'lights', art: 'bulb', base: 149, fits: IC,
    desc: 'Set of replacement bulbs for the head, tail and indicator lamps.' },
  { sheet: 46, key: 'indicator', name: 'Indicator Assembly', category: 'Indicator Assembly', group: 'lights', art: 'indicator', base: 649, fits: ALL,
    desc: 'Set of turn indicators with holders.' },
  { sheet: 47, key: 'headlight-dome', name: 'Headlight Dome (Visor)', category: 'Visor', existing: true, photoFrom: 'visor', base: 690, fits: ALL,
    desc: 'Headlight dome and visor cowl.' },

  // 48-61 · valve train, seals, clutch ---------------------------------------
  { sheet: 48, key: 'valve', name: 'Engine Valve Set', category: 'Engine Valve Set', existing: true, photoFrom: 'engine-valve-set', base: 490, fits: IC,
    desc: 'Inlet and exhaust valves.' },
  { sheet: 49, key: 'valve-seal', name: 'Valve Seal', category: 'Valve Seal', group: 'oil-seals', art: 'seal', base: 119, fits: IC,
    desc: 'Valve stem oil seals.' },
  { sheet: 50, key: 'rocker-arm', name: 'Rocker Arm Set', category: 'Rocker Arm Set', existing: true, photoFrom: 'rocker-arm-set', base: 590, fits: IC,
    desc: 'Valve rocker arms with shafts.' },
  { sheet: 51, key: 'rocker-screw', name: 'Rocker Screw (Tappet Adjuster)', category: 'Rocker Screw', group: 'engine-drive', art: 'screw', base: 89, fits: IC,
    desc: 'Tappet adjusting screws with lock nuts.' },
  { sheet: 52, key: 'cam-shaft', name: 'Cam Shaft Assembly', category: 'Cam Shaft Assembly', existing: true, photoFrom: 'cam-shaft-assembly', base: 890, fits: IC,
    desc: 'Camshaft with sprocket.' },
  { sheet: 53, key: 'gasket-set', name: 'Gasket Set', category: 'Gasket Set', group: 'oil-seals', art: 'gasket', base: 389, fits: IC,
    desc: 'Full engine gasket kit.' },
  { sheet: 54, key: 'oil-seal', name: 'Oil Seal Kit', category: 'Oil Seal', group: 'oil-seals', art: 'seal', base: 219, fits: IC,
    desc: 'Engine oil seal kit.' },
  { sheet: 55, key: 'shocker-seal', name: 'Shocker (Fork) Oil Seal', category: 'Shocker Seal', group: 'oil-seals', art: 'seal', base: 179, fits: ALL,
    desc: 'Front fork oil seals with dust seals.' },
  { sheet: 56, key: 'clutch-hub', name: 'Clutch Hub', category: 'Clutch Hub', group: 'engine-drive', art: 'clutch-disc', base: 549, fits: [BIKE],
    desc: 'Inner clutch hub.' },
  { sheet: 57, key: 'clutch-centre', name: 'Clutch Centre', category: 'Clutch Centre', group: 'engine-drive', art: 'clutch-disc', base: 619, fits: [BIKE],
    desc: 'Clutch centre (boss) the plates stack on.' },
  { sheet: 58, key: 'clutch-housing', name: 'Clutch Housing', category: 'Clutch Housing', group: 'engine-drive', art: 'clutch-disc', base: 1449, fits: IC,
    desc: 'Outer clutch housing (bell).' },
  { sheet: 59, key: 'clutch-assembly', name: 'Clutch Assembly', category: 'Clutch Assembly', existing: true, photoFrom: 'clutch-assembly', base: 1490, fits: IC,
    desc: 'Complete clutch assembly.' },
  { sheet: 60, key: 'pressure-plate', name: 'Clutch Pressure Plate', category: 'Pressure Plate', group: 'engine-drive', art: 'clutch-disc', base: 479, fits: [BIKE],
    desc: 'Clutch pressure plate.' },

  // 62-77 · wheels, gears, kick, frame, suspension ---------------------------
  { sheet: 62, key: 'spokes', name: 'Spoke Set', category: 'Spokes', group: 'front-wheel', art: 'spokes', base: 419, fits: [BIKE], noBrands: ['ktm', 'kawasaki'],
    desc: 'Set of wheel spokes with nipples.' },
  { sheet: 63, key: 'gear-lever', name: 'Gear Lever', category: 'Gear Lever', existing: true, photoFrom: 'gear-lever', base: 389, fits: [BIKE],
    desc: 'Gear shift lever.' },
  { sheet: 64, key: 'gear-shaft', name: 'Gear Shaft', category: 'Gear Shaft', existing: true, photoFrom: 'gear-shaft', base: 890, fits: [BIKE],
    desc: 'Gear shifter shaft.' },
  { sheet: 65, key: 'kick-shaft', name: 'Kick Shaft', category: 'Kick Shaft', existing: true, photoFrom: 'kick-shaft', base: 590, fits: IC, noBrands: ['ktm', 'kawasaki'],
    desc: 'Kick starter shaft.' },
  { sheet: 66, key: 'kick-lever', name: 'Kick Lever', category: 'Kick Lever', existing: true, photoFrom: 'kick-lever', base: 389, fits: IC, noBrands: ['ktm', 'kawasaki'],
    desc: 'Kick start lever.' },
  { sheet: 67, key: 'kick-boss', name: 'Kick Boss', category: 'Kick Boss', group: 'engine-drive', photoFrom: 'kick-rachet', base: 449, fits: IC, noBrands: ['ktm', 'kawasaki'],
    desc: 'Kick starter boss (ratchet) that engages the kick shaft.' },
  { sheet: 68, key: 'handle-bar', name: 'Handle Bar', category: 'Handle', existing: true, art: 'handlebar', base: 690, fits: ALL,
    desc: 'Handlebar tube.' },
  { sheet: 70, key: 'brake-drum', name: 'Brake Drum', category: 'Brake Drum', existing: true, photoFrom: 'brake-drum', base: 1190, fits: ALL,
    desc: 'Wheel hub brake drum.' },
  { sheet: 71, key: 'footrest-bracket', name: 'Footrest Bracket', category: 'Footrest Bracket', group: 'frame-stands', art: 'bracket', base: 519, fits: [BIKE],
    desc: 'Footrest mounting bracket.' },
  { sheet: 73, key: 'chain-cover', name: 'Chain Cover', category: 'Chain Cover', group: 'frame-stands', art: 'chain-cover', base: 479, fits: [BIKE],
    desc: 'Drive chain guard.' },
  { sheet: 74, key: 'shocker-assy', name: 'Rear Shocker Assembly (Pair)', category: 'Shock Absorber', existing: true, photoFrom: 'shock-absorber', base: 1690, fits: ALL,
    desc: 'Pair of rear shock absorbers.' },
  { sheet: 75, key: 'jhula', name: 'Swing Arm (Jhula)', category: 'Rear Suspension U Fork', existing: true, photoFrom: 'rear-suspension-u-fork', base: 1490, fits: [BIKE],
    desc: 'Rear swing arm (jhula) that carries the rear wheel.' },
  { sheet: 76, key: 'shocker', name: 'Rear Shocker', category: 'Shocker', existing: true, photoFrom: 'shock-absorber', base: 949, fits: ALL,
    desc: 'Single rear shock absorber.' },
  { sheet: 77, key: 'silent-block-bush', name: 'Silent Block Bush', category: 'Bush', existing: true, photoFrom: 'bush', base: 229, fits: ALL,
    desc: 'Rubber-bonded silent block bush for the swing arm or engine mount.' }
];

// Sheet lines folded into another entry, with the reason — reported to the user.
export const MERGED = [
  { sheet: 43, into: 'Cables (line 29)', why: 'repeat of line 29 — expanded into the individual cables' },
  { sheet: 61, into: 'Clutch Plate Set (line 32)', why: 'repeat of line 32' },
  { sheet: 69, into: 'Spoke Set (line 62)', why: 'repeat of line 62' },
  { sheet: 72, into: 'Headlight Dome (line 47)', why: '"Doom" — read as the same headlight dome' }
];

// New category groups — the last three existed only in code, which is why the
// Engine & Drive and Electricals pages answered 404.
export const GROUPS = [
  { id: 'engine-drive', name: 'Engine & Drive', description: 'Pistons, clutches, cams, sprockets and gearbox internals.', sort_order: 9 },
  { id: 'electricals', name: 'Electricals', description: 'CDI, ECU, coils, sensors, wiring and starter motors.', sort_order: 10 },
  { id: 'body-panels', name: 'Body & Panels', description: 'Side panels, visors, floor boards, stickers and monograms.', sort_order: 11 },
  { id: 'cables', name: 'Cables & Controls', description: 'Clutch, brake, accelerator, choke, seat and speedometer cables.', sort_order: 12 },
  { id: 'frame-stands', name: 'Stands, Footrests & Frame', description: 'Side and main stands, footrests, brackets and chain covers.', sort_order: 13 },
  { id: 'suspension', name: 'Suspension & Shockers', description: 'Rear shockers, shock absorbers and suspension parts.', sort_order: 14 }
];

// ---- fuel system -------------------------------------------------------------

// Fuel-injected across the whole model entry.
export const FI_ONLY = /^(ktm|kawasaki)$|dominar|meteor|hunter|cbr 250/i;

// Model families still sold after the 2020 BS6 switch: their later years are
// fuel-injected, their earlier years carburetted, so both parts apply.
export const BS6_ERA =
  /(\bfi\b|bs6|6g|i3s|4v|activa|shine|unicorn|livo|dream neo|grazia|hornet|splendor|passion|glamour|xtreme|xpulse|pleasure|maestro|hf deluxe|platina|ct 100|pulsar|avenger|discover 125|apache|jupiter|ntorq|radeon|star city|xl|scooty|wego|zest|fz|r15|ray|fascino|saluto|access|gixxer|intruder|classic|bullet|electra|himalayan|continental|thunderbird|centuro|gusto)/i;
