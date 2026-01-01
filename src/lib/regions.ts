export const REGIONS: Record<string, string[]> = {
    'LATAM': [
        'ARGENTINA', 'BOLIVIA', 'BRAZIL', 'CHILE', 'COLOMBIA', 'COSTA RICA', 'CUBA',
        'DOMINICAN REPUBLIC', 'ECUADOR', 'EL SALVADOR', 'GUATEMALA', 'HAITI', 'HONDURAS',
        'MEXICO', 'NICARAGUA', 'PANAMA', 'PARAGUAY', 'PERU', 'URUGUAY', 'VENEZUELA'
    ],
    'ASIA': [
        'AFGHANISTAN', 'ARMENIA', 'AZERBAIJAN', 'BAHRAIN', 'BANGLADESH', 'BHUTAN', 'BRUNEI',
        'CAMBODIA', 'CHINA', 'CYPRUS', 'GEORGIA', 'INDIA', 'INDONESIA', 'IRAN', 'IRAQ',
        'ISRAEL', 'JAPAN', 'JORDAN', 'KAZAKHSTAN', 'KUWAIT', 'KYRGYZSTAN', 'LAOS', 'LEBANON',
        'MALAYSIA', 'MALDIVES', 'MONGOLIA', 'MYANMAR', 'NEPAL', 'NORTH KOREA', 'OMAN',
        'PAKISTAN', 'PALESTINE', 'PHILIPPINES', 'QATAR', 'RUSSIA', 'SAUDI ARABIA',
        'SINGAPORE', 'SOUTH KOREA', 'SRI LANKA', 'SYRIA', 'TAIWAN', 'TAJIKISTAN', 'THAILAND',
        'TIMOR-LESTE', 'TURKEY', 'TURKMENISTAN', 'UNITED ARAB EMIRATES', 'UZBEKISTAN', 'VIETNAM', 'YEMEN'
    ],
    'AFRICA': [
        'ALGERIA', 'ANGOLA', 'BENIN', 'BOTSWANA', 'BURKINA FASO', 'BURUNDI', 'CABO VERDE',
        'CAMEROON', 'CENTRAL AFRICAN REPUBLIC', 'CHAD', 'COMOROS', 'CONGO', 'DJIBOUTI', 'EGYPT',
        'EQUATORIAL GUINEA', 'ERITREA', 'ESWATINI', 'ETHIOPIA', 'GABON', 'GAMBIA', 'GHANA',
        'GUINEA', 'GUINEA-BISSAU', 'IVORY COAST', 'KENYA', 'LESOTHO', 'LIBERIA', 'LIBYA',
        'MADAGASCAR', 'MALAWI', 'MALI', 'MAURITANIA', 'MAURITIUS', 'MOROCCO', 'MOZAMBIQUE',
        'NAMIBIA', 'NIGER', 'NIGERIA', 'RWANDA', 'SAO TOME AND PRINCIPE', 'SENEGAL', 'SEYCHELLES',
        'SIERRA LEONE', 'SOMALIA', 'SOUTH AFRICA', 'SOUTH SUDAN', 'SUDAN', 'TANZANIA', 'TOGO',
        'TUNISIA', 'UGANDA', 'ZAMBIA', 'ZIMBABWE'
    ],
    'OCEANIA': [
        'AUSTRALIA', 'FIJI', 'KIRIBATI', 'MARSHALL ISLANDS', 'MICRONESIA', 'NAURU',
        'NEW ZEALAND', 'PALAU', 'PAPUA NEW GUINEA', 'SAMOA', 'SOLOMON ISLANDS', 'TONGA',
        'TUVALU', 'VANUATU'
    ]
};

export function getRegionsForCountry(country: string): string[] {
    const normalizedCountry = country.toUpperCase().trim();
    const matches: string[] = [];

    for (const [region, countries] of Object.entries(REGIONS)) {
        if (countries.includes(normalizedCountry)) {
            matches.push(region);
        }
    }

    return matches;
}
