import {
  ASEAN_COUNTRIES,
  EEA_COUNTRIES,
  EU_COUNTRIES,
  MERCOSUR_COUNTRIES,
  SCHENGEN_COUNTRIES,
  countryCodeAlpha3ToName,
} from '@zkpassport/utils';

/** All ISO alpha-3 codes the SDK knows, mapped to display names. */
export const COUNTRIES: Record<string, string> = (() => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const out: Record<string, string> = {};
  for (const a of letters) for (const b of letters) for (const c of letters) {
    const name = countryCodeAlpha3ToName(a + b + c);
    if (name) out[a + b + c] = name;
  }
  return out;
})();

const codeByName = new Map(Object.entries(COUNTRIES).map(([code, name]) => [name, code]));
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
