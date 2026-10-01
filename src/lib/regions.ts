import {
  ASEAN_COUNTRIES,
  EEA_COUNTRIES,
  EU_COUNTRIES,
  MERCOSUR_COUNTRIES,
  SCHENGEN_COUNTRIES,
  countryCodeAlpha3ToName,
} from '@zkpassport/utils';

// Codes for organizations that issue travel documents, not countries. Named so they aren't
// mistaken for a region (the EU region is "European Union (region)").
const ISSUER_NAMES: Record<string, string> = {
  EUR: 'EU-issued travel document',
  UNO: 'UN-issued travel document',
  XOM: 'Order of Malta travel document',
};

/** All ISO alpha-3 codes the SDK knows, mapped to display names. */
export const COUNTRIES: Record<string, string> = (() => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const out: Record<string, string> = {};
  for (const a of letters) for (const b of letters) for (const c of letters) {
    const code = a + b + c;
    const name = ISSUER_NAMES[code] ?? countryCodeAlpha3ToName(code);
    if (name) out[code] = name;
  }
  return out;
})();

// The SDK's region lists spell a few countries differently from its own country table.
const codeByName = new Map<string, string>([
  ...Object.entries(COUNTRIES).map(([code, name]) => [name, code] as [string, string]),
  ['Czech Republic', 'CZE'],
  ['Brunei Darussalam', 'BRN'],
  ["Lao People's Democratic Republic", 'LAO'],
  ['Syrian Arab Republic', 'SYR'],
]);
const toCodes = (names: string[]) => names.map((n) => codeByName.get(n)).filter((c): c is string => !!c);

export const REGIONS: Record<string, { label: string; codes: string[] }> = {
  EU: { label: 'European Union', codes: toCodes(EU_COUNTRIES) },
  EEA: { label: 'European Economic Area', codes: toCodes(EEA_COUNTRIES) },
  SCHENGEN: { label: 'Schengen Area', codes: toCodes(SCHENGEN_COUNTRIES) },
  ASEAN: { label: 'ASEAN', codes: toCodes(ASEAN_COUNTRIES) },
  MERCOSUR: { label: 'Mercosur', codes: toCodes(MERCOSUR_COUNTRIES) },
  LATAM: {
    label: 'Latin America',
    codes: 'ARG BOL BRA CHL COL CRI CUB DOM ECU SLV GTM HTI HND MEX NIC PAN PRY PER URY VEN'.split(' '),
  },
  ASIA: {
    label: 'Asia',
    codes: ('AFG ARM AZE BHR BGD BTN BRN KHM CHN CYP GEO IND IDN IRN IRQ ISR JPN JOR KAZ KWT KGZ LAO LBN MYS ' +
      'MDV MNG MMR NPL PRK OMN PAK PSE PHL QAT RUS SAU SGP KOR LKA SYR TWN TJK THA TLS TUR TKM ARE UZB VNM YEM').split(' '),
  },
  AFRICA: {
    label: 'Africa',
    codes: ('DZA AGO BEN BWA BFA BDI CPV CMR CAF TCD COM COG COD DJI EGY GNQ ERI SWZ ETH GAB GMB GHA GIN GNB CIV ' +
      'KEN LSO LBR LBY MDG MWI MLI MRT MUS MAR MOZ NAM NER NGA RWA STP SEN SYC SLE SOM ZAF SSD SDN TZA TGO TUN ' +
      'UGA ZMB ZWE').split(' '),
  },
  OCEANIA: {
    label: 'Oceania',
    codes: 'AUS FJI KIR MHL FSM NRU NZL PLW PNG WSM SLB TON TUV VUT'.split(' '),
  },
};

/** Passport MRZ codes can be padded ("D<<" for Germany). */
export function normalizeCountryCode(raw: string): string {
  const code = raw.replace(/</g, '').trim().toUpperCase();
  return code === 'D' ? 'DEU' : code;
}

export function regionsFor(code: string): string[] {
  return Object.entries(REGIONS)
    .filter(([, r]) => r.codes.includes(code))
    .map(([key]) => key);
}

/** "country:FRA" -> "France", "region:EU" -> "European Union" */
export function describePlace(key: string): string {
  const [kind, id] = key.split(':');
  return kind === 'region' ? REGIONS[id]?.label ?? id : COUNTRIES[id] ?? id;
}

/** Everyday names the official list doesn't use. */
const ALIASES: Record<string, string[]> = {
  USA: ['us', 'usa', 'america', 'united states of america'],
  GBR: ['uk', 'britain', 'great britain', 'england', 'scotland', 'wales'],
  ARE: ['uae', 'emirates'],
  KOR: ['korea'],
  NLD: ['holland'],
  CZE: ['czech republic'],
  RUS: ['russian federation'],
  CIV: ["cote d'ivoire"],
  VNM: ['vietnam'],
};

/** Countries and regions matching what an admin typed, best matches first, at most 25 (Discord's limit). */
export function searchPlaces(query: string): { name: string; value: string }[] {
  const q = query.trim().toLowerCase();
  const places = [
    ...Object.entries(REGIONS).map(([key, r]) => ({
      name: `${r.label} (region)`,
      value: `region:${key}`,
      terms: [key.toLowerCase(), r.label.toLowerCase()],
    })),
    ...Object.entries(COUNTRIES).map(([code, name]) => ({
      name,
      value: `country:${code}`,
      terms: [code.toLowerCase(), name.toLowerCase(), ...(ALIASES[code] ?? [])],
    })),
  ];
  if (!q) return places.slice(0, 25).map(({ name, value }) => ({ name, value }));

  // 0: exact code, name or alias. 1: starts with the query. 2: contains it.
  const rank = (terms: string[]) =>
    terms.includes(q) ? 0 : terms.some((t) => t.startsWith(q)) ? 1 : terms.some((t) => t.includes(q)) ? 2 : 3;
  return places
    .map((p) => ({ ...p, rank: rank(p.terms) }))
    .filter((p) => p.rank < 3)
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
    .slice(0, 25)
    .map(({ name, value }) => ({ name, value }));
}
