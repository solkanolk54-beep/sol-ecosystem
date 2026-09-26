export interface Farm {
  id: string;
  name: string;
  code: string;
  areaHectares: number;
  latitude: number;
  longitude: number;
  region: string;
  country: string;
  soilType: string;
  irrigationSource: string;
  totalTrees: number;
  healthyTrees: number;
  needsAttentionTrees: number;
  diseasedTrees: number;
  totalLivestock: number;
  cattleCount: number;
  sheepCount: number;
  avgSoilMoisture: string;
  weather: string;
}

export interface Tree {
  id: string;
  farmId: string;
  tagCode: string;
  species: string;
  variety: string;
  plantingDate: string;
  ageYears: number;
  parcelZone: string;
  healthStatus: 'healthy' | 'needs_attention' | 'diseased';
  irrigationStatus: 'optimal' | 'deficit' | 'overirrigated' | 'scheduled';
  soilMoisturePct: number;
  canopyDiameterMeters: number;
  lastHarvestDate: string;
  diseaseHistory: {
    date: string;
    condition: string;
    treatment: string;
    status: 'resolved' | 'in_progress' | 'pending';
  }[];
}

export interface LivestockAnimal {
  id: string;
  farmId: string;
  tagRfid: string;
  nameOrAlias: string;
  species: 'cattle' | 'sheep';
  breed: string;
  gender: 'female' | 'male';
  birthDate: string;
  ageMonths: number;
  currentWeightKg: number;
  pastureZone: string;
  healthCondition: 'healthy' | 'quarantined' | 'under_treatment' | 'pregnant' | 'lactating';
  feedPlan: string;
  yieldMetric: string;
  yieldUnit: string;
  currentYieldValue: number | string;
  weightHistory: { date: string; weightKg: number }[];
  vaccinationSchedule: { vaccine: string; date: string; status: 'completed' | 'upcoming' | 'overdue' }[];
}

export interface TraceabilityBatch {
  batchCode: string;
  productName: string;
  variety: string;
  origin: string;
  harvestDate: string;
  processingDate: string;
  quantity: string;
  qualityParameters: {
    acidity?: string;
    peroxide?: string;
    polyphenols?: string;
    sensoryProfile?: string;
    grading?: string;
    phLevel?: string;
    antibioticFree?: string;
    pastureFedDays?: string;
  };
  certifications: string[];
  blockchainTx: string;
  farmCoordinates: { lat: number; lng: number };
}

export interface DiagnosticResult {
  disease: string;
  scientificName: string;
  pathogenType: string;
  confidence: number;
  severity: 'none' | 'low' | 'moderate' | 'severe';
  symptoms: string;
  recommendedTreatment: string;
  preventativeAction: string;
}
