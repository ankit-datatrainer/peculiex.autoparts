// Pure grouping rules, shared by the storefront (lib/categoryGroups.js) and the
// catalog scripts, which run outside Next and cannot import server modules.

/** Ordered most specific first — the first rule that matches a category wins. */
export const GROUP_RULES = [
  // Cables first: "Front Brake Cable" is a cable, not a front-wheel part.
  {
    id: 'cables',
    name: 'Cables & Controls',
    description: 'Clutch, brake, accelerator, choke, seat and speedometer cables.',
    pattern: /cable/i
  },
  {
    id: 'handle-steering',
    name: 'Handle & Steering',
    description: 'Handlebars, tees, levers, switches and steering hardware.',
    pattern: /(handle|steering|yoke|\btee\b|grip|lever|switch)/i
  },
  {
    id: 'front-wheel',
    name: 'Front Wheel Parts',
    description: 'Forks, rims, discs, drums, mudguards and front axle parts.',
    pattern: /(front|fork|wheel|rim|spoke|axle|mudguard|disc|drum|caliper|master cylinder|brake)/i
  },
  {
    id: 'suspension',
    name: 'Suspension & Shockers',
    description: 'Rear shockers, shock absorbers and suspension parts.',
    pattern: /(shock|suspension|damper)/i
  },
  {
    id: 'frame-stands',
    name: 'Stands, Footrests & Frame',
    description: 'Side and main stands, footrests, brackets and chain covers.',
    pattern: /(\bstand\b|footrest|swing arm|bracket|chain cover)/i
  },
  {
    id: 'oil-seals',
    name: 'Oil, Seals & Lubricants',
    description: 'Engine oil, gear oil, oil seals and O-rings.',
    pattern: /(^oil|lubric|seal|o.?ring|gasket)/i
  },
  {
    id: 'bearing',
    name: 'Bearings & Bushes',
    description: 'Wheel bearings, ball racer sets, bushes and kits.',
    pattern: /(bearing|racer|bush)/i
  },
  {
    id: 'lights',
    name: 'Lights & Indicators',
    description: 'Head lamps, tail lamps, indicators and bulbs.',
    pattern: /(light|lamp|indicator|bulb|blinker)/i
  },
  {
    id: 'fuel-supply',
    name: 'Fuel Supply System',
    description: 'Carburettors, injectors, pumps, tanks and throttle bodies.',
    pattern: /(fuel|carburet|carburat|petrol|tank|injector|pump|throttle|choke)/i
  },
  {
    id: 'pipes-hoses',
    name: 'Pipes & Hoses',
    description: 'Fork pipes, fuel lines, brake hoses and silencers.',
    pattern: /(pipe|hose|tube|silencer|exhaust|manifold)/i
  },
  {
    id: 'engine-drive',
    name: 'Engine & Drive',
    description: 'Pistons, clutches, cams, sprockets and gearbox internals.',
    pattern: /(engine|piston|clutch|cam|crank|gear|chain|sprocket|valve|rocker|kick|connecting rod|roller weight|radiator)/i
  },
  {
    id: 'electricals',
    name: 'Electricals',
    description: 'CDI, ECU, coils, sensors, wiring and starter motors.',
    pattern: /(cdi|ecu|tci|coil|sensor|wiring|harness|starter|armature|ignit|speedo|rr unit|tpfc|control unit)/i
  },
  {
    id: 'body-panels',
    name: 'Body & Panels',
    description: 'Side panels, visors, floor boards, stickers and monograms.',
    pattern: /(panel|visor|floor|sticker|monogram|cover|guard|foot rest|body)/i
  }
];

export function groupForCategory(categoryName) {
  if (!categoryName) return null;
  const rule = GROUP_RULES.find((g) => g.pattern.test(categoryName));
  return rule ? rule.id : null;
}
