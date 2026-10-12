import { Crop, NaturalRegion, LanguageCode } from '../../types';

export const SUPPORTED_CROPS: Crop[] = [
  {
    id: 'crop_maize',
    name: 'Maize (Chibage / Umbila)',
    scientificName: 'Zea mays',
    category: 'cereal',
    commonVarieties: [
      { code: 'SC403', name: 'Seed Co Tsoko (SC403)', maturityDays: 115, suitableRegions: ['IV', 'V', 'III'], droughtTolerance: 'High' },
      { code: 'SC513', name: 'Seed Co Zebra (SC513)', maturityDays: 130, suitableRegions: ['IIb', 'III'], droughtTolerance: 'Medium' },
      { code: 'SC719', name: 'Seed Co Shumba (SC719)', maturityDays: 150, suitableRegions: ['I', 'IIa'], droughtTolerance: 'Low' }
    ]
  },
  {
    id: 'crop_sorghum',
    name: 'Sorghum (Mapfunde / Amabele)',
    scientificName: 'Sorghum bicolor',
    category: 'cereal',
    commonVarieties: [
      { code: 'SV2', name: 'SV2 White Grain', maturityDays: 110, suitableRegions: ['IV', 'V', 'III'], droughtTolerance: 'High' },
      { code: 'MACIA', name: 'Macia Dwarf', maturityDays: 105, suitableRegions: ['IV', 'V'], droughtTolerance: 'High' }
    ]
  },
  {
    id: 'crop_tobacco',
    name: 'Virginia Tobacco (Fodya)',
    scientificName: 'Nicotiana tabacum',
    category: 'cash_crop',
    commonVarieties: [
      { code: 'KRK26R', name: 'KRK 26R (Kutsaga)', maturityDays: 125, suitableRegions: ['IIa', 'IIb'], droughtTolerance: 'Low' },
      { code: 'T66', name: 'T66 High Yield', maturityDays: 130, suitableRegions: ['IIa'], droughtTolerance: 'Low' }
    ]
  },
  {
    id: 'crop_cotton',
    name: 'Cotton (Donje / Ukotini)',
    scientificName: 'Gossypium hirsutum',
    category: 'cash_crop',
    commonVarieties: [
      { code: 'QM301', name: 'QM301 Bollgard', maturityDays: 140, suitableRegions: ['III', 'IV'], droughtTolerance: 'High' },
      { code: 'SZ9314', name: 'Albar SZ9314', maturityDays: 145, suitableRegions: ['IV', 'V'], droughtTolerance: 'High' }
    ]
  },
  {
    id: 'crop_groundnuts',
    name: 'Groundnuts (Nzungu / Amazambane)',
    scientificName: 'Arachis hypogaea',
    category: 'legume',
    commonVarieties: [
      { code: 'NYANDA', name: 'Nyanda Short Season', maturityDays: 95, suitableRegions: ['III', 'IV', 'V'], droughtTolerance: 'High' },
      { code: 'ILANDA', name: 'Ilanda Spanish', maturityDays: 100, suitableRegions: ['IIb', 'III', 'IV'], droughtTolerance: 'Medium' }
    ]
  },
  {
    id: 'crop_soya',
    name: 'Soya Beans (Soya)',
    scientificName: 'Glycine max',
    category: 'oilseed',
    commonVarieties: [
      { code: 'PAN1867', name: 'PAN 1867 Medium', maturityDays: 120, suitableRegions: ['IIa', 'IIb'], droughtTolerance: 'Medium' },
      { code: 'SC_SIRIUS', name: 'SC Sirius', maturityDays: 125, suitableRegions: ['IIa'], droughtTolerance: 'Low' }
    ]
  }
];

export interface PlantingRuleDefinition {
  cropId: string;
  naturalRegions: NaturalRegion[];
  recommendedMonths: number[]; // 1=Jan ... 12=Dec (e.g. 10, 11, 12, 1 for Zim)
  recommendedVariety: string;
  expectedRainfallBand: string;
  spacing: string;
  fertilizerBasal: string;
  adviceSummaryEn: string;
  adviceSummarySn: string; // Shona
  adviceSummaryNr: string; // Ndebele
  ussdEn: string; // strict <=182 chars
  ussdSn: string;
  ussdNr: string;
  smsEn: string;  // strict <=160 chars
  smsSn: string;
  smsNr: string;
}

export const PLANTING_RULES: PlantingRuleDefinition[] = [
  // Maize for Natural Region I & IIa (High rainfall, prime zones: Mazowe, Chinhoyi, Makoni, Nyanga)
  {
    cropId: 'crop_maize',
    naturalRegions: ['I', 'IIa'],
    recommendedMonths: [10, 11, 12],
    recommendedVariety: 'SC719 or SC727 (Late Maturity, 145-155 days)',
    expectedRainfallBand: '800mm - 1100mm',
    spacing: '90cm between rows, 25cm in-row (44,000 plants/ha)',
    fertilizerBasal: 'Compound D @ 350-400 kg/ha at planting',
    adviceSummaryEn: 'High-potential region. Plant high-yield late maturity hybrid (SC719/727). Apply basal Compound D.',
    adviceSummarySn: 'Dunhu remvura yakawanda. Dzvari chibage chinotora nguva yakareba (SC719). Isa Compound D pakudyara.',
    adviceSummaryNr: 'Isigaba sezulu esinengi. Hlanyela umbila othatha isikhathi (SC719). Faka i-Compound D ekuhlwanyeleni.',
    ussdEn: 'ZimSmart: Reg IIa Maize. Plant SC719 now. Spacing 90x25cm. Basal: Compound D 350kg/ha. Rain band: 850mm. Yield target: 8t/ha.',
    ussdSn: 'ZimSmart: Chibage Dunhu IIa. Dyara SC719 iye zvino. Nzvimbo 90x25cm. Isa Compound D 350kg/ha. Mvura: 850mm. Goho guru.',
    ussdNr: 'ZimSmart: Umbila Isigaba IIa. Hlanyela SC719 khathesi. Isikhala 90x25cm. Faka Compound D 350kg/ha. Izulu: 850mm. Isivuno esihle.',
    smsEn: 'ZimSmart: Plant SC719 maize now. Spacing 90x25cm. Compound D 350kg/ha. High rainfall expected (>850mm). Protect with pre-emergent herbicide.',
    smsSn: 'ZimSmart: Dyara mbeu yeSC719 nhasi. Nzvimbo 90x25cm. Compound D 350kg/ha. Mvura yakawanda inotarisirwa. Bvisa masora nenguva.',
    smsNr: 'ZimSmart: Hlanyela umbila SC719 khathesi. Isikhala 90x25cm. Compound D 350kg/ha. Izulu elinengi liyalindelwa. Hlakula masinya.'
  },
  // Maize for Natural Region IIb & III (Semi-intensive: Marondera, Gweru, Makoni Ward 12, Gutu)
  {
    cropId: 'crop_maize',
    naturalRegions: ['IIb', 'III'],
    recommendedMonths: [11, 12, 1],
    recommendedVariety: 'SC513 or SC529 (Medium Maturity, 125-135 days)',
    expectedRainfallBand: '650mm - 800mm',
    spacing: '90cm between rows, 28cm in-row (39,000 plants/ha)',
    fertilizerBasal: 'Compound D @ 250-300 kg/ha at planting',
    adviceSummaryEn: 'Medium rainfall with dry spell risk. Plant medium maturity SC513. Practice moisture conservation (pfumvudza/pot-holing).',
    adviceSummarySn: 'Mvura iri pakati nepakati. Shandisa SC513. Chengetedza hunyoro muvhu pachishandiswa Pfumvudza.',
    adviceSummaryNr: 'Izulu eliphakathi lingozi yesomiso. Hlanyela SC513. Londoloza umswakama womhlabathi usebenzisa i-Intwasa/Pfumvudza.',
    ussdEn: 'ZimSmart: Reg III Maize. Plant SC513 medium hybrid. Basal: Compound D 300kg/ha. Dig Pfumvudza basins to trap moisture. Rain: 700mm.',
    ussdSn: 'ZimSmart: Chibage Dunhu III. Dyara SC513. Isa Compound D 300kg/ha. Chera makomba ePfumvudza kudzivirira kusanaya. Mvura: 700mm.',
    ussdNr: 'ZimSmart: Umbila Isigaba III. Hlanyela SC513. Faka Compound D 300kg/ha. Gciba imigodi ye-Intwasa ukugcina umswakama. Izulu: 700mm.',
    smsEn: 'ZimSmart: Plant SC513 maize in Reg III. Basal Compound D 300kg/ha. Use Pfumvudza mulch to survive dry spells. Expected rain: 650-750mm.',
    smsSn: 'ZimSmart: Dyara SC513 muDunhu III. Compound D 300kg/ha. Shandisa huswa/pfumvudza kuchengeta hunyoro pakusanaya kwemvura. Mvura: 700mm.',
    smsNr: 'ZimSmart: Hlanyela SC513 esigabeni III. Compound D 300kg/ha. Faka utshani be-Intwasa ukulondoloza umswakama wesomiso. Izulu: 700mm.'
  },
  // Maize for Natural Region IV & V (Low rainfall: Gokwe, Buhera, Lupane, Mwenezi, Beitbridge)
  {
    cropId: 'crop_maize',
    naturalRegions: ['IV', 'V'],
    recommendedMonths: [11, 12],
    recommendedVariety: 'SC403 Tsoko or SC301 (Ultra-Early Drought Escaping, 105-115 days)',
    expectedRainfallBand: '350mm - 550mm',
    spacing: '100cm between rows, 30cm in-row (33,000 plants/ha)',
    fertilizerBasal: 'Compound D @ 150-200 kg/ha or cattle manure 5t/ha',
    adviceSummaryEn: 'Low rainfall & drought risk. Plant ultra-early drought escaping SC403. Essential to use Pfumvudza basins with heavy mulch.',
    adviceSummarySn: 'Mvura shoma ine kusanaya. Dyara chibage chinokurumidza SC403. Chera makomba ePfumvudza uise mashizha nemufudze.',
    adviceSummaryNr: 'Izulu elilutshwana lesomiso. Hlanyela umbila ovuthwa masinya SC403. Sebenzisa imigodi ye-Intwasa lomquba.',
    ussdEn: 'ZimSmart: Reg IV/V Maize. Plant ultra-early SC403 (Tsoko). Basal: 150kg/ha Compound D. MUST use Pfumvudza basins + mulch. Rain: <500mm.',
    ussdSn: 'ZimSmart: Chibage Dunhu IV/V. Dyara SC403 Tsoko inokurumidza. Isa mufudze kana 150kg/ha Compound D. Shandisa Pfumvudza nemashizha.',
    ussdNr: 'ZimSmart: Umbila Isigaba IV/V. Hlanyela SC403 ephangisayo. Faka umquba kumbe 150kg/ha Compound D. Sebenzisa i-Intwasa lomquba.',
    smsEn: 'ZimSmart: High drought risk. Plant SC403 ultra-early maize now. Apply 150kg/ha Compound D in Pfumvudza basins. Consider intercropping cowpeas.',
    smsSn: 'ZimSmart: Kusanaya kwakanyanya. Dyara SC403 Tsoko mumakomba ePfumvudza. Isa 150kg/ha Compound D. Kuvadzanisa nenyemba kunobatsira.',
    smsNr: 'ZimSmart: Isomiso silikhulu. Hlanyela SC403 masinya emagodini e-Intwasa. Faka 150kg/ha Compound D. Hlanyela lendumba ndawonye.'
  },
  // Sorghum for Natural Region IV & V
  {
    cropId: 'crop_sorghum',
    naturalRegions: ['IV', 'V', 'III'],
    recommendedMonths: [11, 12, 1],
    recommendedVariety: 'SV2 or Macia (Dwarf White Grain, 105 days)',
    expectedRainfallBand: '350mm - 550mm',
    spacing: '75cm between rows, 15cm in-row (88,000 plants/ha)',
    fertilizerBasal: 'Compound D @ 150 kg/ha',
    adviceSummaryEn: 'Ideal climate-resilient crop for arid regions. Resistant to prolonged dry spells. Thin to 2 plants per station.',
    adviceSummarySn: 'Chirimwa chakasimba chinomira nekusanaya. Dyara SV2 kana Macia. Bvisa zvimwe zvidiki kusara ne2 pachiteshi.',
    adviceSummaryNr: 'Isilimo esilakho ukumelana lesomiso. Hlanyela i-SV2 kumbe i-Macia. Tshiya izitshalo ezimbili kuphela esikhundleni.',
    ussdEn: 'ZimSmart: Sorghum Reg IV/V. Plant Macia/SV2. Drought proof. Spacing 75x15cm. Basal: 150kg Compound D. Thin at 3 weeks. Rain: 400mm.',
    ussdSn: 'ZimSmart: Mapfunde Dunhu IV/V. Dyara Macia/SV2 inotsungirira kusanaya. Nzvimbo 75x15cm. Isa 150kg Compound D. Mvura: 400mm.',
    ussdNr: 'ZimSmart: Amabele Isigaba IV/V. Hlanyela i-Macia/SV2 emelana lesomiso. Isikhala 75x15cm. Compound D 150kg. Izulu: 400mm.',
    smsEn: 'ZimSmart: Sorghum SV2/Macia recommended for your ward. Excellent drought survival. Basal Compound D 150kg/ha. Bird-scare prep required at maturity.',
    smsSn: 'ZimSmart: Mapfunde SV2/Macia anokurudzirwa muward menyu. Anotsungirira zuva. Isa 150kg/ha Compound D. Gadzirirai kudzinga shiri.',
    smsNr: 'ZimSmart: Amabele SV2/Macia ayakhuthazwa ewadini yenu. Ayalwisana lesomiso. Faka 150kg/ha Compound D. Lungiselela ukuxotsha inyoni.'
  },
  // Tobacco for Natural Region IIa & IIb (Cash crop: Mazowe, Marondera, Chinhoyi, Makoni)
  {
    cropId: 'crop_tobacco',
    naturalRegions: ['IIa', 'IIb'],
    recommendedMonths: [9, 10, 11], // Water-planted in Sept/Oct, dryland Nov
    recommendedVariety: 'KRK26R or T66 (Kutsaga Certified)',
    expectedRainfallBand: '750mm - 950mm',
    spacing: '120cm ridges, 50cm in-row on high ridges (15,000 plants/ha)',
    fertilizerBasal: 'Tobacco Fertiliser (Compound C or S) @ 600 kg/ha',
    adviceSummaryEn: 'Transplant seedlings into well-formed ridges. Apply recommended cup of water per station if dry. Use cup of Compound C.',
    adviceSummarySn: 'Chovha fodya pamariji akakwirira. Isa kapu yemvura neCompound C pakusima. Dzivirira tupukanana tunodya mashizha.',
    adviceSummaryNr: 'Hlanyela igwayi emiseleni ephakemeyo. Faka inkomitsho yamanzi le-Compound C. Vikela izinanakazana eziqeda amakhasi.',
    ussdEn: 'ZimSmart: Reg II Tobacco. Transplant KRK26R onto 1.2m ridges. Basal: Compound C 600kg/ha. Cup of water per hole. Monitor aphid vectors.',
    ussdSn: 'ZimSmart: Fodya Dunhu II. Chovha KRK26R pamariji 1.2m. Isa Compound C 600kg/ha. Kapu yemvura gomba rimwe. Chenjerai inda dzefodya.',
    ussdNr: 'ZimSmart: Igwayi Isigaba II. Hlanyela KRK26R emiseleni 1.2m. Compound C 600kg/ha. Inkomitsho yamanzi emgodini. Naka izinanakazana.',
    smsEn: 'ZimSmart: Tobacco planting underway. Use KRK26R on 1.2m ridges. 600kg/ha Compound C basal. Scout weekly for cutworms and aphids.',
    smsSn: 'ZimSmart: Kusima fodya kweKRK26R pamariji 1.2m. Compound C 600kg/ha. Tarisisai tupukanana neinda dzinoparadza fodya vhiki yoga yoga.',
    smsNr: 'ZimSmart: Ukuhlanyela igwayi le-KRK26R emiseleni 1.2m. Faka i-Compound C 600kg/ha. Hlola amaphela lezinanakazana ngeviki.'
  },
  // Groundnuts for Natural Region III & IV
  {
    cropId: 'crop_groundnuts',
    naturalRegions: ['III', 'IV', 'V'],
    recommendedMonths: [11, 12],
    recommendedVariety: 'Nyanda or Ilanda (Short Season Spanish, 95-105 days)',
    expectedRainfallBand: '450mm - 650mm',
    spacing: '45cm between rows, 7.5cm in-row (290,000 plants/ha)',
    fertilizerBasal: 'Single Super Phosphate (SSP) @ 200 kg/ha + Gypsum at flowering',
    adviceSummaryEn: 'High-value legume. Improves soil nitrogen. Plant on ridges to prevent waterlogging. Apply Gypsum at pegging stage.',
    adviceSummarySn: 'Nzungu dzinopa mari uye dzinowedzera fetereza muvhu. Dyara Nyanda pamariji. Isa Gypsum panobuda tsono dzenzungu.',
    adviceSummaryNr: 'Amazambane anothuthukisa umhlabathi. Hlanyela i-Nyanda emiseleni. Faka i-Gypsum lapho esiqhakaza.',
    ussdEn: 'ZimSmart: Groundnuts Reg III/IV. Plant Nyanda 45x7.5cm on ridges. Basal: SSP 200kg/ha. Inoculate or apply Gypsum at pegging for pod fill.',
    ussdSn: 'ZimSmart: Nzungu Dunhu III/IV. Dyara Nyanda 45x7.5cm pamariji. Isa SSP 200kg/ha. Isa Gypsum panotungira tsono kuti nhanga dzizadze.',
    ussdNr: 'ZimSmart: Amazambane Isigaba III/IV. Hlanyela i-Nyanda 45x7.5cm emiseleni. SSP 200kg/ha. Faka i-Gypsum nxa esiqhakaza.',
    smsEn: 'ZimSmart: Plant Nyanda groundnuts on ridges at 45x7.5cm spacing. Basal SSP 200kg/ha. Apply Gypsum at flower pegging to prevent pops (empty pods).',
    smsSn: 'ZimSmart: Dyara nzungu dzeNyanda pamariji 45x7.5cm. Isa SSP 200kg/ha. Isa Gypsum painotunga tsono kudzivirira mahangara/nhanga dzisina mhodzi.',
    smsNr: 'ZimSmart: Hlanyela amazambane eNyanda emiseleni 45x7.5cm. SSP 200kg/ha. Faka i-Gypsum nxa esiqhakaza ukuvimbela amakhoba angelalutho.'
  }
];

export function findPlantingRule(cropId: string, naturalRegion: NaturalRegion): PlantingRuleDefinition | undefined {
  // First exact match
  const exact = PLANTING_RULES.find(r => r.cropId === cropId && r.naturalRegions.includes(naturalRegion));
  if (exact) return exact;

  // Fallback to any rule for this crop
  return PLANTING_RULES.find(r => r.cropId === cropId);
}
