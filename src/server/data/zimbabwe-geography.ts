import { Province, NaturalRegion, WardLocation } from '../../types';

export const ZIMBABWE_PROVINCES: Province[] = [
  {
    id: 'prov_manicaland',
    name: 'Manicaland',
    code: 'MC',
    districts: [
      {
        id: 'dist_makoni',
        name: 'Makoni (Rusape)',
        provinceId: 'prov_manicaland',
        provinceName: 'Manicaland',
        wards: [
          {
            id: 'ward_makoni_12',
            name: 'Ward 12 (Nyazura)',
            wardNumber: 12,
            districtId: 'dist_makoni',
            districtName: 'Makoni',
            provinceId: 'prov_manicaland',
            provinceName: 'Manicaland',
            latitude: -18.712,
            longitude: 32.181,
            naturalRegion: 'IIb',
            altitudeMeters: 1210,
            averageAnnualRainfallMm: '750 - 850mm',
            soilType: 'Sandy clay loam',
          },
          {
            id: 'ward_makoni_25',
            name: 'Ward 25 (Headlands)',
            wardNumber: 25,
            districtId: 'dist_makoni',
            districtName: 'Makoni',
            provinceId: 'prov_manicaland',
            provinceName: 'Manicaland',
            latitude: -18.276,
            longitude: 32.049,
            naturalRegion: 'IIa',
            altitudeMeters: 1450,
            averageAnnualRainfallMm: '800 - 950mm',
            soilType: 'Deep fertile red clay',
          }
        ]
      },
      {
        id: 'dist_nyanga',
        name: 'Nyanga',
        provinceId: 'prov_manicaland',
        provinceName: 'Manicaland',
        wards: [
          {
            id: 'ward_nyanga_04',
            name: 'Ward 4 (Juliasdale)',
            wardNumber: 4,
            districtId: 'dist_nyanga',
            districtName: 'Nyanga',
            provinceId: 'prov_manicaland',
            provinceName: 'Manicaland',
            latitude: -18.368,
            longitude: 32.673,
            naturalRegion: 'I',
            altitudeMeters: 1820,
            averageAnnualRainfallMm: '> 1,100mm',
            soilType: 'Humic ferrosols',
          }
        ]
      },
      {
        id: 'dist_buhera',
        name: 'Buhera',
        provinceId: 'prov_manicaland',
        provinceName: 'Manicaland',
        wards: [
          {
            id: 'ward_buhera_18',
            name: 'Ward 18 (Murambinda)',
            wardNumber: 18,
            districtId: 'dist_buhera',
            districtName: 'Buhera',
            provinceId: 'prov_manicaland',
            provinceName: 'Manicaland',
            latitude: -19.278,
            longitude: 31.961,
            naturalRegion: 'IV',
            altitudeMeters: 890,
            averageAnnualRainfallMm: '480 - 600mm',
            soilType: 'Granitic sands, prone to drought',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_mash_central',
    name: 'Mashonaland Central',
    code: 'MCB',
    districts: [
      {
        id: 'dist_mazowe',
        name: 'Mazowe',
        provinceId: 'prov_mash_central',
        provinceName: 'Mashonaland Central',
        wards: [
          {
            id: 'ward_mazowe_05',
            name: 'Ward 5 (Concession / Glendale)',
            wardNumber: 5,
            districtId: 'dist_mazowe',
            districtName: 'Mazowe',
            provinceId: 'prov_mash_central',
            provinceName: 'Mashonaland Central',
            latitude: -17.511,
            longitude: 30.985,
            naturalRegion: 'IIa',
            altitudeMeters: 1320,
            averageAnnualRainfallMm: '850 - 1,000mm',
            soilType: 'Rich red fersiallitic clay',
          }
        ]
      },
      {
        id: 'dist_bindura',
        name: 'Bindura',
        provinceId: 'prov_mash_central',
        provinceName: 'Mashonaland Central',
        wards: [
          {
            id: 'ward_bindura_03',
            name: 'Ward 3 (Manhenga / Matepatepa)',
            wardNumber: 3,
            districtId: 'dist_bindura',
            districtName: 'Bindura',
            provinceId: 'prov_mash_central',
            provinceName: 'Mashonaland Central',
            latitude: -17.301,
            longitude: 31.332,
            naturalRegion: 'IIa',
            altitudeMeters: 1100,
            averageAnnualRainfallMm: '800 - 900mm',
            soilType: 'Red clay loam',
          }
        ]
      },
      {
        id: 'dist_mbire',
        name: 'Mbire (Zambezi Valley)',
        provinceId: 'prov_mash_central',
        provinceName: 'Mashonaland Central',
        wards: [
          {
            id: 'ward_mbire_08',
            name: 'Ward 8 (Mushumbi Pools)',
            wardNumber: 8,
            districtId: 'dist_mbire',
            districtName: 'Mbire',
            provinceId: 'prov_mash_central',
            provinceName: 'Mashonaland Central',
            latitude: -16.143,
            longitude: 30.562,
            naturalRegion: 'V',
            altitudeMeters: 460,
            averageAnnualRainfallMm: '< 450mm',
            soilType: 'Alluvial sands / Sodic soils',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_mash_east',
    name: 'Mashonaland East',
    code: 'ME',
    districts: [
      {
        id: 'dist_goromonzi',
        name: 'Goromonzi',
        provinceId: 'prov_mash_east',
        provinceName: 'Mashonaland East',
        wards: [
          {
            id: 'ward_goromonzi_10',
            name: 'Ward 10 (Bromley / Ruwa Peri-urban)',
            wardNumber: 10,
            districtId: 'dist_goromonzi',
            districtName: 'Goromonzi',
            provinceId: 'prov_mash_east',
            provinceName: 'Mashonaland East',
            latitude: -18.012,
            longitude: 31.391,
            naturalRegion: 'IIa',
            altitudeMeters: 1530,
            averageAnnualRainfallMm: '850 - 950mm',
            soilType: 'Deep well-drained loam',
          }
        ]
      },
      {
        id: 'dist_marondera',
        name: 'Marondera',
        provinceId: 'prov_mash_east',
        provinceName: 'Mashonaland East',
        wards: [
          {
            id: 'ward_marondera_07',
            name: 'Ward 7 (Marondera Rural)',
            wardNumber: 7,
            districtId: 'dist_marondera',
            districtName: 'Marondera',
            provinceId: 'prov_mash_east',
            provinceName: 'Mashonaland East',
            latitude: -18.188,
            longitude: 31.552,
            naturalRegion: 'IIb',
            altitudeMeters: 1610,
            averageAnnualRainfallMm: '800 - 900mm',
            soilType: 'Sandy clay loam',
          }
        ]
      },
      {
        id: 'dist_mutoko',
        name: 'Mutoko',
        provinceId: 'prov_mash_east',
        provinceName: 'Mashonaland East',
        wards: [
          {
            id: 'ward_mutoko_15',
            name: 'Ward 15 (Chikwizo)',
            wardNumber: 15,
            districtId: 'dist_mutoko',
            districtName: 'Mutoko',
            provinceId: 'prov_mash_east',
            provinceName: 'Mashonaland East',
            latitude: -17.404,
            longitude: 32.227,
            naturalRegion: 'IV',
            altitudeMeters: 980,
            averageAnnualRainfallMm: '500 - 620mm',
            soilType: 'Coarse granite sand',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_mash_west',
    name: 'Mashonaland West',
    code: 'MW',
    districts: [
      {
        id: 'dist_makonde',
        name: 'Makonde (Chinhoyi)',
        provinceId: 'prov_mash_west',
        provinceName: 'Mashonaland West',
        wards: [
          {
            id: 'ward_makonde_08',
            name: 'Ward 8 (Chinhoyi Agricultural Zone)',
            wardNumber: 8,
            districtId: 'dist_makonde',
            districtName: 'Makonde',
            provinceId: 'prov_mash_west',
            provinceName: 'Mashonaland West',
            latitude: -17.359,
            longitude: 30.201,
            naturalRegion: 'IIa',
            altitudeMeters: 1160,
            averageAnnualRainfallMm: '800 - 950mm',
            soilType: 'Red dolomite clay loam',
          }
        ]
      },
      {
        id: 'dist_zvimba',
        name: 'Zvimba (Banket / Murombedzi)',
        provinceId: 'prov_mash_west',
        provinceName: 'Mashonaland West',
        wards: [
          {
            id: 'ward_zvimba_14',
            name: 'Ward 14 (Banket East)',
            wardNumber: 14,
            districtId: 'dist_zvimba',
            districtName: 'Zvimba',
            provinceId: 'prov_mash_west',
            provinceName: 'Mashonaland West',
            latitude: -17.382,
            longitude: 30.402,
            naturalRegion: 'IIa',
            altitudeMeters: 1240,
            averageAnnualRainfallMm: '850 - 920mm',
            soilType: 'Prime fersiallitic clay',
          }
        ]
      },
      {
        id: 'dist_kariba',
        name: 'Kariba Rural (Nyaminyami)',
        provinceId: 'prov_mash_west',
        provinceName: 'Mashonaland West',
        wards: [
          {
            id: 'ward_kariba_02',
            name: 'Ward 2 (Siakobvu)',
            wardNumber: 2,
            districtId: 'dist_kariba',
            districtName: 'Kariba Rural',
            provinceId: 'prov_mash_west',
            provinceName: 'Mashonaland West',
            latitude: -17.261,
            longitude: 28.528,
            naturalRegion: 'V',
            altitudeMeters: 550,
            averageAnnualRainfallMm: '< 450mm',
            soilType: 'Shallow lithosols / sands',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_midlands',
    name: 'Midlands',
    code: 'MD',
    districts: [
      {
        id: 'dist_gweru',
        name: 'Gweru',
        provinceId: 'prov_midlands',
        provinceName: 'Midlands',
        wards: [
          {
            id: 'ward_gweru_06',
            name: 'Ward 6 (Chiundura)',
            wardNumber: 6,
            districtId: 'dist_gweru',
            districtName: 'Gweru',
            provinceId: 'prov_midlands',
            provinceName: 'Midlands',
            latitude: -19.349,
            longitude: 29.897,
            naturalRegion: 'III',
            altitudeMeters: 1390,
            averageAnnualRainfallMm: '650 - 750mm',
            soilType: 'Paraferrallitic sands',
          }
        ]
      },
      {
        id: 'dist_kwekwe',
        name: 'Kwekwe',
        provinceId: 'prov_midlands',
        provinceName: 'Midlands',
        wards: [
          {
            id: 'ward_kwekwe_11',
            name: 'Ward 11 (Silobela)',
            wardNumber: 11,
            districtId: 'dist_kwekwe',
            districtName: 'Kwekwe',
            provinceId: 'prov_midlands',
            provinceName: 'Midlands',
            latitude: -19.004,
            longitude: 29.408,
            naturalRegion: 'IV',
            altitudeMeters: 1180,
            averageAnnualRainfallMm: '550 - 650mm',
            soilType: 'Shallow sandy loam',
          }
        ]
      },
      {
        id: 'dist_gokwe_south',
        name: 'Gokwe South',
        provinceId: 'prov_midlands',
        provinceName: 'Midlands',
        wards: [
          {
            id: 'ward_gokwe_03',
            name: 'Ward 3 (Nembudziya / Cotton Belt)',
            wardNumber: 3,
            districtId: 'dist_gokwe_south',
            districtName: 'Gokwe South',
            provinceId: 'prov_midlands',
            provinceName: 'Midlands',
            latitude: -18.219,
            longitude: 28.932,
            naturalRegion: 'IV',
            altitudeMeters: 920,
            averageAnnualRainfallMm: '500 - 620mm',
            soilType: 'Kalahari sand and clay pockets',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_masvingo',
    name: 'Masvingo',
    code: 'MV',
    districts: [
      {
        id: 'dist_gutu',
        name: 'Gutu',
        provinceId: 'prov_masvingo',
        provinceName: 'Masvingo',
        wards: [
          {
            id: 'ward_gutu_09',
            name: 'Ward 9 (Chatsworth)',
            wardNumber: 9,
            districtId: 'dist_gutu',
            districtName: 'Gutu',
            provinceId: 'prov_masvingo',
            provinceName: 'Masvingo',
            latitude: -19.632,
            longitude: 31.066,
            naturalRegion: 'III',
            altitudeMeters: 1320,
            averageAnnualRainfallMm: '600 - 700mm',
            soilType: 'Fersiallitic granite sands',
          }
        ]
      },
      {
        id: 'dist_chiredzi',
        name: 'Chiredzi (Lowveld)',
        provinceId: 'prov_masvingo',
        provinceName: 'Masvingo',
        wards: [
          {
            id: 'ward_chiredzi_04',
            name: 'Ward 4 (Triangle / Hippo Valley)',
            wardNumber: 4,
            districtId: 'dist_chiredzi',
            districtName: 'Chiredzi',
            provinceId: 'prov_masvingo',
            provinceName: 'Masvingo',
            latitude: -21.045,
            longitude: 31.667,
            naturalRegion: 'V',
            altitudeMeters: 430,
            averageAnnualRainfallMm: '< 420mm',
            soilType: 'Black basalt cracking clay',
          }
        ]
      },
      {
        id: 'dist_mwenezi',
        name: 'Mwenezi',
        provinceId: 'prov_masvingo',
        provinceName: 'Masvingo',
        wards: [
          {
            id: 'ward_mwenezi_07',
            name: 'Ward 7 (Rutenga)',
            wardNumber: 7,
            districtId: 'dist_mwenezi',
            districtName: 'Mwenezi',
            provinceId: 'prov_masvingo',
            provinceName: 'Masvingo',
            latitude: -21.248,
            longitude: 30.732,
            naturalRegion: 'V',
            altitudeMeters: 510,
            averageAnnualRainfallMm: '< 400mm',
            soilType: 'Arid sandy loam',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_mat_north',
    name: 'Matabeleland North',
    code: 'MN',
    districts: [
      {
        id: 'dist_lupane',
        name: 'Lupane',
        provinceId: 'prov_mat_north',
        provinceName: 'Matabeleland North',
        wards: [
          {
            id: 'ward_lupane_05',
            name: 'Ward 5 (Gwayi Valley)',
            wardNumber: 5,
            districtId: 'dist_lupane',
            districtName: 'Lupane',
            provinceId: 'prov_mat_north',
            provinceName: 'Matabeleland North',
            latitude: -18.924,
            longitude: 27.761,
            naturalRegion: 'IV',
            altitudeMeters: 990,
            averageAnnualRainfallMm: '450 - 580mm',
            soilType: 'Kalahari deep sands',
          }
        ]
      },
      {
        id: 'dist_binga',
        name: 'Binga (Zambezi Shore)',
        provinceId: 'prov_mat_north',
        provinceName: 'Matabeleland North',
        wards: [
          {
            id: 'ward_binga_03',
            name: 'Ward 3 (Siabuwa)',
            wardNumber: 3,
            districtId: 'dist_binga',
            districtName: 'Binga',
            provinceId: 'prov_mat_north',
            provinceName: 'Matabeleland North',
            latitude: -17.482,
            longitude: 28.021,
            naturalRegion: 'V',
            altitudeMeters: 520,
            averageAnnualRainfallMm: '< 450mm',
            soilType: 'Lithosols / Sodic flats',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_mat_south',
    name: 'Matabeleland South',
    code: 'MS',
    districts: [
      {
        id: 'dist_gwanda',
        name: 'Gwanda',
        provinceId: 'prov_mat_south',
        provinceName: 'Matabeleland South',
        wards: [
          {
            id: 'ward_gwanda_02',
            name: 'Ward 2 (Colleen Bawn / Rural)',
            wardNumber: 2,
            districtId: 'dist_gwanda',
            districtName: 'Gwanda',
            provinceId: 'prov_mat_south',
            provinceName: 'Matabeleland South',
            latitude: -20.933,
            longitude: 29.006,
            naturalRegion: 'V',
            altitudeMeters: 920,
            averageAnnualRainfallMm: '350 - 450mm',
            soilType: 'Sandy clay loam',
          }
        ]
      },
      {
        id: 'dist_matobo',
        name: 'Matobo',
        provinceId: 'prov_mat_south',
        provinceName: 'Matabeleland South',
        wards: [
          {
            id: 'ward_matobo_08',
            name: 'Ward 8 (Kezi)',
            wardNumber: 8,
            districtId: 'dist_matobo',
            districtName: 'Matobo',
            provinceId: 'prov_mat_south',
            provinceName: 'Matabeleland South',
            latitude: -20.871,
            longitude: 28.431,
            naturalRegion: 'IV',
            altitudeMeters: 1040,
            averageAnnualRainfallMm: '450 - 550mm',
            soilType: 'Granitic lithosol sands',
          }
        ]
      },
      {
        id: 'dist_beitbridge',
        name: 'Beitbridge Rural',
        provinceId: 'prov_mat_south',
        provinceName: 'Matabeleland South',
        wards: [
          {
            id: 'ward_beitbridge_06',
            name: 'Ward 6 (Lutumba / Limpopo Basin)',
            wardNumber: 6,
            districtId: 'dist_beitbridge',
            districtName: 'Beitbridge Rural',
            provinceId: 'prov_mat_south',
            provinceName: 'Matabeleland South',
            latitude: -22.102,
            longitude: 30.124,
            naturalRegion: 'V',
            altitudeMeters: 450,
            averageAnnualRainfallMm: '< 350mm',
            soilType: 'Arid calcareous loam',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_harare',
    name: 'Harare Metropolitan',
    code: 'HRE',
    districts: [
      {
        id: 'dist_harare_peri',
        name: 'Harare Peri-Urban',
        provinceId: 'prov_harare',
        provinceName: 'Harare Metropolitan',
        wards: [
          {
            id: 'ward_harare_hort',
            name: 'Ward 1 (Borrowdale / Glen Forest Ag)',
            wardNumber: 1,
            districtId: 'dist_harare_peri',
            districtName: 'Harare Peri-Urban',
            provinceId: 'prov_harare',
            provinceName: 'Harare Metropolitan',
            latitude: -17.712,
            longitude: 31.139,
            naturalRegion: 'IIa',
            altitudeMeters: 1490,
            averageAnnualRainfallMm: '820 - 900mm',
            soilType: 'Fersiallitic clay',
          }
        ]
      }
    ]
  },
  {
    id: 'prov_bulawayo',
    name: 'Bulawayo Metropolitan',
    code: 'BYO',
    districts: [
      {
        id: 'dist_bulawayo_peri',
        name: 'Bulawayo Peri-Urban',
        provinceId: 'prov_bulawayo',
        provinceName: 'Bulawayo Metropolitan',
        wards: [
          {
            id: 'ward_bulawayo_peri',
            name: 'Ward 2 (Umguza Border Ag)',
            wardNumber: 2,
            districtId: 'dist_bulawayo_peri',
            districtName: 'Bulawayo Peri-Urban',
            provinceId: 'prov_bulawayo',
            provinceName: 'Bulawayo Metropolitan',
            latitude: -20.121,
            longitude: 28.618,
            naturalRegion: 'IV',
            altitudeMeters: 1350,
            averageAnnualRainfallMm: '500 - 600mm',
            soilType: 'Granitic loamy sand',
          }
        ]
      }
    ]
  }
];

// Helper lookup functions
export function getAllWards(): WardLocation[] {
  const wards: WardLocation[] = [];
  for (const prov of ZIMBABWE_PROVINCES) {
    for (const dist of prov.districts) {
      wards.push(...dist.wards);
    }
  }
  return wards;
}

export function findWardById(wardId: string): WardLocation | undefined {
  for (const prov of ZIMBABWE_PROVINCES) {
    for (const dist of prov.districts) {
      const match = dist.wards.find(w => w.id === wardId);
      if (match) return match;
    }
  }
  return undefined;
}
