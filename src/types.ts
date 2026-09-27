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

export interface ParcelAgronomicMetric {
  parcelId: string;
  parcelName: string;
  arabicName: string;
  cropVariety: string;
  treeCount: number;
  healthScorePct: number;
  ndviVigorIndex: number;
  avgSoilMoisturePct: number;
  waterAppliedM3: number;
  waterDeficitM3: number;
  fertilizerNpkKg: number;
  activeTreatments: string;
  status: 'optimal' | 'attention' | 'critical';
}

export interface PhytosanitaryIntervention {
  id: string;
  date: string;
  parcelZone: string;
  targetPathogen: string;
  treatmentProduct: string;
  dosage: string;
  applicationMethod: string;
  agronomistApproval: string;
  status: 'completed' | 'in_progress' | 'scheduled';
}

export interface LivestockWeightChangeRecord {
  id: string;
  tagRfid: string;
  nameOrAlias: string;
  species: 'cattle' | 'sheep';
  breed: string;
  pastureZone: string;
  previousWeightKg: number;
  currentWeightKg: number;
  weightChangeKg: number;
  weightChangePct: number;
  adgGramsDay: number; // Average Daily Gain
  bodyConditionScore: number; // Scale 1.0 to 5.0
  healthCondition: string;
  yieldInfo?: string;
}

export interface ResourceEfficiencyMetric {
  resourceType: 'water' | 'fertilizer' | 'diesel';
  nameArabic: string;
  totalConsumed: number;
  unit: string;
  targetBenchmark: number;
  efficiencyPct: number;
  savingsVsBaseline: number;
  savingsUnit: string;
  costDzd: number;
  costPerHectareDzd: number;
  carbonImpactKgCo2: number;
  statusNote: string;
}

export interface AgronomicActionItem {
  id: string;
  priority: 'high' | 'medium' | 'routine';
  category: 'tree_health' | 'livestock' | 'irrigation' | 'machinery';
  title: string;
  description: string;
  targetParcelOrSector: string;
  deadlineDate: string;
  assignedEngineer: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface WeeklyAgronomicReport {
  reportId: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  generatedDate: string;
  estateName: string;
  estateRegion: string;
  estateHectares: number;
  supervisingAgronomist: {
    name: string;
    title: string;
    licenseNumber: string;
    digitalSignatureHash: string;
  };
  overallAgronomicScore: number;
  overallRatingLabel: string;
  executiveSummary: string;
  weatherSummary: {
    avgTemperatureC: number;
    rainfallAccumulatedMm: number;
    et0ReferenceMm: number;
    solarRadiationAvg: string;
  };
  treeHealthSection: {
    totalTrees: number;
    healthyCount: number;
    needsAttentionCount: number;
    diseasedCount: number;
    overallHealthPct: number;
    avgNdviScore: number;
    parcels: ParcelAgronomicMetric[];
    phytosanitaryInterventions: PhytosanitaryIntervention[];
  };
  livestockSection: {
    totalLivestock: number;
    cattleCount: number;
    sheepCount: number;
    avgDailyGainGrams: number;
    totalFlockGainKg: number;
    avgBcsScore: number;
    dailyMilkYieldLiters: number;
    veterinaryCompliancePct: number;
    animals: LivestockWeightChangeRecord[];
    feedEfficiencySummary: string;
  };
  resourceEfficiencySection: {
    totalWaterM3: number;
    totalFertilizerKg: number;
    totalDieselLiters: number;
    totalOperatingHours: number;
    totalOperatingCostDzd: number;
    overallEfficiencyIndex: number;
    carbonOffsetKgCo2: number;
    metrics: ResourceEfficiencyMetric[];
  };
  actionItems: AgronomicActionItem[];
}
