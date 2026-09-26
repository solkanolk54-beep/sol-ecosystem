import { Farm, Tree, LivestockAnimal, TraceabilityBatch, DiagnosticResult } from '../types';

export const INITIAL_FARM: Farm = {
  id: 'b0000000-0000-0000-0000-000000000001',
  name: 'SOL Green Valley Agro-Estate',
  code: 'SOL-FARM-01',
  areaHectares: 142.5,
  latitude: 36.8065,
  longitude: 10.1815,
  region: 'Cap Bon Mediterranean Basin',
  country: 'Tunisia',
  soilType: 'Rich Terra Rossa & Silty Loam',
  irrigationSource: 'Solar Deep Well & Drip System',
  totalTrees: 4250,
  healthyTrees: 3820,
  needsAttentionTrees: 320,
  diseasedTrees: 110,
  totalLivestock: 680,
  cattleCount: 220,
  sheepCount: 460,
  avgSoilMoisture: '38.4%',
  weather: '24°C Mediterranean Sunny, NW 12km/h'
};

export const INITIAL_TREES: Tree[] = [
  {
    id: 'tr-001',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagCode: 'SOL-TR-OLV-001',
    species: 'Olive',
    variety: 'Chemlali Ancient Heritage',
    plantingDate: '2012-03-10',
    ageYears: 14.0,
    parcelZone: 'Grove Alpha (Ancient Centenarians)',
    healthStatus: 'healthy',
    irrigationStatus: 'optimal',
    soilMoisturePct: 42.0,
    canopyDiameterMeters: 4.2,
    lastHarvestDate: '2025-11-20',
    diseaseHistory: [
      {
        date: '2024-04-12',
        condition: 'Mild Olive Peacock Spot (Spilocaea oleagina)',
        treatment: 'Organic Copper Hydroxide spray (250g/100L)',
        status: 'resolved'
      }
    ]
  },
  {
    id: 'tr-002',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagCode: 'SOL-TR-OLV-002',
    species: 'Olive',
    variety: 'Picholine High-Density',
    plantingDate: '2018-05-14',
    ageYears: 8.0,
    parcelZone: 'Grove Beta (Modern High-Yield)',
    healthStatus: 'needs_attention',
    irrigationStatus: 'deficit',
    soilMoisturePct: 24.2,
    canopyDiameterMeters: 2.9,
    lastHarvestDate: '2025-11-22',
    diseaseHistory: [
      {
        date: '2026-02-18',
        condition: 'Sub-surface Moisture Deficit Stress',
        treatment: 'Trigger pulsed drip line irrigation (4h overnight)',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'tr-003',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagCode: 'SOL-TR-OLV-003',
    species: 'Olive',
    variety: 'Arbequina Super-Intensive',
    plantingDate: '2020-04-18',
    ageYears: 6.0,
    parcelZone: 'Grove Gamma (Hedgerow)',
    healthStatus: 'diseased',
    irrigationStatus: 'optimal',
    soilMoisturePct: 39.5,
    canopyDiameterMeters: 2.3,
    lastHarvestDate: '2025-11-25',
    diseaseHistory: [
      {
        date: '2026-03-02',
        condition: 'Olive Anthracnose (Colletotrichum gloeosporioides)',
        treatment: 'Targeted bio-fungicide Bacillus subtilis + branch sanitation',
        status: 'pending'
      }
    ]
  },
  {
    id: 'tr-004',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagCode: 'SOL-TR-CIT-104',
    species: 'Citrus',
    variety: 'Blood Orange Maltaise',
    plantingDate: '2019-02-11',
    ageYears: 7.2,
    parcelZone: 'Citrus Orchard South Valley',
    healthStatus: 'healthy',
    irrigationStatus: 'optimal',
    soilMoisturePct: 45.0,
    canopyDiameterMeters: 3.4,
    lastHarvestDate: '2026-01-15',
    diseaseHistory: []
  },
  {
    id: 'tr-005',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagCode: 'SOL-TR-OLV-005',
    species: 'Olive',
    variety: 'Mission Dual-Purpose',
    plantingDate: '2016-10-04',
    ageYears: 9.5,
    parcelZone: 'Grove Alpha (Ancient)',
    healthStatus: 'healthy',
    irrigationStatus: 'optimal',
    soilMoisturePct: 40.8,
    canopyDiameterMeters: 3.6,
    lastHarvestDate: '2025-11-18',
    diseaseHistory: []
  },
  {
    id: 'tr-006',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagCode: 'SOL-TR-FIG-201',
    species: 'Fig',
    variety: 'Sultani Purple Fig',
    plantingDate: '2017-03-22',
    ageYears: 9.0,
    parcelZone: 'Fig Terrace Terraces East',
    healthStatus: 'needs_attention',
    irrigationStatus: 'deficit',
    soilMoisturePct: 26.5,
    canopyDiameterMeters: 3.0,
    lastHarvestDate: '2025-08-30',
    diseaseHistory: []
  }
];

export const INITIAL_LIVESTOCK: LivestockAnimal[] = [
  {
    id: 'lstk-001',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagRfid: 'RFID-CTL-9021',
    nameOrAlias: 'Bella Prima',
    species: 'cattle',
    breed: 'Holstein Friesian',
    gender: 'female',
    birthDate: '2022-04-12',
    ageMonths: 48,
    currentWeightKg: 645,
    pastureZone: 'Green Meadow Sector 1',
    healthCondition: 'lactating',
    feedPlan: 'Organic Alfalfa + 2.2kg Balanced Fermented Sorghum Ration',
    yieldMetric: 'Daily Milk Yield',
    yieldUnit: 'L/day',
    currentYieldValue: 29.5,
    weightHistory: [
      { date: '2025-11-01', weightKg: 620 },
      { date: '2025-12-15', weightKg: 632 },
      { date: '2026-01-30', weightKg: 640 },
      { date: '2026-03-10', weightKg: 645 }
    ],
    vaccinationSchedule: [
      { vaccine: 'Foot-and-Mouth Inactivated Vaccine', date: '2026-01-10', status: 'completed' },
      { vaccine: 'Bovine Rhinotracheitis (IBR)', date: '2026-02-14', status: 'completed' },
      { vaccine: 'Clostridial 8-Way Booster', date: '2026-07-20', status: 'upcoming' }
    ]
  },
  {
    id: 'lstk-002',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagRfid: 'RFID-SHP-3084',
    nameOrAlias: 'Sultan Awassi',
    species: 'sheep',
    breed: 'Awassi Fat-Tailed Heritage',
    gender: 'male',
    birthDate: '2023-01-19',
    ageMonths: 38,
    currentWeightKg: 88.5,
    pastureZone: 'Hillside Pasture B',
    healthCondition: 'healthy',
    feedPlan: 'Free-range Meadow Grazing + 400g Barley Protein Pellet',
    yieldMetric: 'Daily Weight Gain',
    yieldUnit: 'g/day',
    currentYieldValue: 340,
    weightHistory: [
      { date: '2025-11-01', weightKg: 78.0 },
      { date: '2025-12-15', weightKg: 82.5 },
      { date: '2026-01-30', weightKg: 85.0 },
      { date: '2026-03-10', weightKg: 88.5 }
    ],
    vaccinationSchedule: [
      { vaccine: 'Enterotoxemia (Pulpy Kidney)', date: '2025-12-05', status: 'completed' },
      { vaccine: 'Sheep Pox Annual Vaccine', date: '2026-02-01', status: 'completed' }
    ]
  },
  {
    id: 'lstk-003',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagRfid: 'RFID-CTL-8812',
    nameOrAlias: 'Maximus Angus',
    species: 'cattle',
    breed: 'Black Angus Prime',
    gender: 'male',
    birthDate: '2022-11-05',
    ageMonths: 41,
    currentWeightKg: 730,
    pastureZone: 'Fattening Paddock 4',
    healthCondition: 'healthy',
    feedPlan: 'Pasture Grass + Organic Silage + Mineral Salt Lick',
    yieldMetric: 'Meat Marbling Score',
    yieldUnit: 'Grade MS4',
    currentYieldValue: '4.2',
    weightHistory: [
      { date: '2025-11-01', weightKg: 690 },
      { date: '2025-12-15', weightKg: 705 },
      { date: '2026-01-30', weightKg: 718 },
      { date: '2026-03-10', weightKg: 730 }
    ],
    vaccinationSchedule: [
      { vaccine: 'Bovine Respiratory Syncytial (BRSV)', date: '2026-01-20', status: 'completed' }
    ]
  },
  {
    id: 'lstk-004',
    farmId: 'b0000000-0000-0000-0000-000000000001',
    tagRfid: 'RFID-SHP-4190',
    nameOrAlias: 'Laila Barbarine',
    species: 'sheep',
    breed: 'Barbarine Traditional',
    gender: 'female',
    birthDate: '2023-04-10',
    ageMonths: 35,
    currentWeightKg: 64.0,
    pastureZone: 'South Olive Understory Grazing',
    healthCondition: 'pregnant',
    feedPlan: 'Fresh Orchard Weeds + Alfalfa Stems + Vitamin E Premix',
    yieldMetric: 'Gestation Term',
    yieldUnit: 'Day 115/150',
    currentYieldValue: 'Day 115',
    weightHistory: [
      { date: '2025-11-01', weightKg: 56.0 },
      { date: '2026-01-15', weightKg: 60.0 },
      { date: '2026-03-10', weightKg: 64.0 }
    ],
    vaccinationSchedule: [
      { vaccine: 'Chlamydiosis & Enzootic Abortion', date: '2025-10-15', status: 'completed' }
    ]
  }
];

export const INITIAL_BATCHES: TraceabilityBatch[] = [
  {
    batchCode: 'EVOO-2026-088',
    productName: 'SOL Reserve Organic Extra Virgin Olive Oil',
    variety: 'Chemlali & Picholine Estate Blend',
    origin: 'SOL Green Valley, Cap Bon Basin, Parcel Alpha',
    harvestDate: '2025-11-20',
    processingDate: '2025-11-21 (Cold-Pressed within 6 hours at 22°C)',
    quantity: '4,500 Liters (Numbered Bottles 0001 - 9000)',
    qualityParameters: {
      acidity: '0.18% (Ultra-Low Acidity, Limit < 0.8%)',
      peroxide: '5.8 meq O2/kg (Limit < 20)',
      polyphenols: '540 mg/kg (High Antioxidant Cardioprotective)',
      sensoryProfile: 'Green almond, fresh cut grass, artichoke heart, balanced peppery polyphenol finish'
    },
    certifications: [
      'EU Organic Cert #TN-BIO-004',
      'GlobalGAP Version 6.0 Compliant',
      'Single-Estate Protected Origin (Cap Bon)'
    ],
    blockchainTx: '0x8f2d7904e5421ac98b472e38c7519965a3cbbfa011d8821ec56e8b4e721a',
    farmCoordinates: { lat: 36.8065, lng: 10.1815 }
  },
  {
    batchCode: 'MEAT-2026-042',
    productName: 'SOL Pasture-Raised Organic Awassi Prime Lamb',
    variety: '100% Free-Range Awassi Heritage Ovine',
    origin: 'SOL Green Valley Pastures Zone B & C',
    harvestDate: '2026-02-28',
    processingDate: '2026-03-01 (Air-Chilled & Aged 7 Days)',
    quantity: '850 Kilograms vacuum sealed cuts',
    qualityParameters: {
      grading: 'Prime Grade A Organic (Omega-3 Enriched)',
      phLevel: '5.58 (Optimal Tenderness & Glycogen)',
      antibioticFree: '100% Certified Antibiotic & Hormone Free',
      pastureFedDays: '365 Days Wild Thyme & Pasture Grazed'
    },
    certifications: [
      'Certified Halal Organic Standards',
      'Animal Welfare Approved Free-Range',
      'Zero-Cold-Chain Break Monitored'
    ],
    blockchainTx: '0x43b17c99e1208fa732e6b2210ef899a19c623910cb4219a1ef54e99c1543',
    farmCoordinates: { lat: 36.8065, lng: 10.1815 }
  }
];

export const DIAGNOSTIC_PRESETS: { label: string; sampleType: string; result: DiagnosticResult; previewImg: string }[] = [
  {
    label: 'Sample A: Olive Leaf (Peacock Spot)',
    sampleType: 'peacock_spot',
    previewImg: 'olive_leaf_peacock',
    result: {
      disease: 'Olive Peacock Spot (Spilocaea oleagina)',
      scientificName: 'Spilocaea oleagina / Venturia oleaginea',
      pathogenType: 'Fungal Pathogen (Ascomycota)',
      confidence: 0.948,
      severity: 'moderate',
      symptoms: 'Circular concentric dark soot-like lesions surrounded by a chlorotic yellow halo on the upper adaxial leaf surface, leading to severe defoliation.',
      recommendedTreatment: '1. Apply Copper Hydroxide or Copper Oxychloride spray (250g/100L) after seasonal rains.\n2. Prune internal canopy water sprouts to allow wind circulation.\n3. Mechanically shred fallen infected leaves.',
      preventativeAction: 'Apply preventive copper formulation in late autumn prior to spore dissemination.'
    }
  },
  {
    label: 'Sample B: Olive Fruit (Anthracnose Rot)',
    sampleType: 'anthracnose',
    previewImg: 'olive_fruit_anthracnose',
    result: {
      disease: 'Olive Anthracnose (Colletotrichum gloeosporioides)',
      scientificName: 'Colletotrichum godetiae / acutatum',
      pathogenType: 'Necrotrophic Fungus',
      confidence: 0.924,
      severity: 'severe',
      symptoms: 'Circular depressed soft brown rot on ripening olives; gelatinous orange salmon-colored conidial tendrils under high humidity; shriveled "mummy" fruit.',
      recommendedTreatment: '1. Expedite early harvest to prevent oil acidity surge (> 1.5%).\n2. Strip and burn mummified drupes remaining on shoots during winter pruning.\n3. Apply authorized bio-fungicide Bacillus amyloliquefaciens.',
      preventativeAction: 'Control olive fruit fly (Bactrocera oleae) vectors that puncture skin and invite spore entry.'
    }
  },
  {
    label: 'Sample C: Healthy Olive Canopy Specimen',
    sampleType: 'healthy',
    previewImg: 'olive_healthy',
    result: {
      disease: 'Vigorous Specimen - Zero Pathogens Detected',
      scientificName: 'Olea europaea L. Healthy Foliage',
      pathogenType: 'None (Healthy)',
      confidence: 0.985,
      severity: 'none',
      symptoms: 'Thick cuticle with healthy chlorophyll levels, silvery trichome layer on abaxial surface, balanced turgor pressure and uniform leaf margins.',
      recommendedTreatment: 'Maintain calibrated drip fertigation program (N-P-K 20-10-20 with soluble boron). No agrochemical intervention necessary.',
      preventativeAction: 'Continue fortnightly drone multispectral NDVI imagery scanning.'
    }
  }
];
