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

export interface ToastNotificationItem {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  category: 'tree' | 'livestock' | 'system';
  timestamp: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  metadata?: {
    treeId?: string;
    animalId?: string;
    tagCode?: string;
    tagRfid?: string;
  };
}

export interface WeatherDayForecast {
  dayName: string;
  date: string;
  maxTempC: number;
  minTempC: number;
  humidityPct: number;
  rainProbPct: number;
  expectedRainMm: number;
  et0MmDay: number;
  conditionArabic: string;
  icon: 'sun' | 'cloud' | 'rain' | 'wind';
}

export interface WeatherCondition {
  currentTempC: number;
  feelsLikeC: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirection: string;
  solarRadiationWm2: number;
  uvIndex: number;
  rainProbabilityPct: number;
  expectedRainfallMm: number;
  et0MmDay: number;
  conditionArabic: string;
  stationName: string;
  forecast5Days: WeatherDayForecast[];
}

export interface ParcelIrrigationMetrics {
  id: string;
  name: string;
  arabicName: string;
  species: string;
  variety: string;
  cropCoefficientKc: number;
  areaHectares: number;
  treeCount: number;
  treeIds: string[];
  soilType: string;
  currentMoisturePct: number;
  fieldCapacityPct: number;
  criticalThresholdPct: number;
  wiltingPointPct: number;
  depletionPct: number;
  etCropMmDay: number;
  dailyMoistureDropPct: number;
  hoursUntilCritical: number;
  urgency: 'critical' | 'warning' | 'optimal' | 'excess';
  suggestedCycle: {
    scheduledDate: string;
    scheduledTimeWindow: string;
    durationMinutes: number;
    waterVolumeM3: number;
    flowRateLph: number;
    savingsKwh: number;
    agronomicJustification: string;
  };
  sensorReadings24h: { hour: string; moisturePct: number }[];
  valveStatus: 'idle' | 'running' | 'scheduled';
}

export type MachineryCategory = 'tractor' | 'harvester' | 'sprayer' | 'irrigation_pump' | 'shredder';

export interface FarmMachinery {
  id: string;
  name: string;
  model: string;
  category: MachineryCategory;
  enginePowerHp: number;
  fuelCapacityLiters: number;
  currentFuelLevelPct: number;
  efficiencyLitersPerHour: number;
  status: 'operating' | 'idle' | 'maintenance' | 'refueling';
  assignedParcel: string;
  currentOperator: string;
  totalOperatingHours: number;
  todayOperatingHours: number;
  lastMaintenanceDate: string;
  iconType: 'tractor' | 'harvester' | 'sprayer' | 'pump' | 'shredder';
}

export interface ResourceConsumptionLog {
  id: string;
  date: string;
  machineryId: string;
  machineryName: string;
  parcelZone: string;
  activityType: string;
  waterM3: number;
  fertilizerKg: number;
  dieselLiters: number;
  operatingHours: number;
  fuelEfficiencyLitersPerHour: number;
  costDzd: number;
  operator: string;
  notes?: string;
}

export interface DailyResourceSummary {
  date: string;
  dayLabel: string;
  waterM3: number;
  fertilizerKg: number;
  dieselLiters: number;
  totalHours: number;
  activeMachineryCount: number;
  costDzd: number;
}

export interface OrchardParcelStatus {
  parcelId: string;
  parcelName: string;
  arabicName: string;
  species: string;
  totalTrees: number;
  healthyTrees: number;
  needsAttentionTrees: number;
  diseasedTrees: number;
  avgSoilMoisturePct: number;
  irrigationStatus: 'optimal' | 'deficit' | 'overirrigated' | 'scheduled';
  lastWaterAppliedM3: number;
  lastFertilizerAppliedKg: number;
  recentDieselUsageLiters: number;
  activeMachinery: string[];
  healthScorePct: number;
}
