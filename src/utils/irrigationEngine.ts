import { WeatherCondition, ParcelIrrigationMetrics, Tree } from '../types';

export const DEFAULT_WEATHER_MILA: WeatherCondition = {
  currentTempC: 24,
  feelsLikeC: 25,
  humidityPct: 48,
  windSpeedKmh: 12,
  windDirection: 'شمالي غربي (NW)',
  solarRadiationWm2: 780,
  uvIndex: 6,
  rainProbabilityPct: 10,
  expectedRainfallMm: 0,
  et0MmDay: 4.6, // FAO-56 Reference Evapotranspiration for Mila Basin
  conditionArabic: 'مشمس معتدل • رياح خفيفة',
  stationName: 'محطة الأرصاد الزراعية الآلية SOL-MET-01 • حوض بني هارون',
  forecast5Days: [
    {
      dayName: 'اليوم (السبت)',
      date: '26 سبتمبر',
      maxTempC: 25,
      minTempC: 15,
      humidityPct: 48,
      rainProbPct: 10,
      expectedRainMm: 0,
      et0MmDay: 4.6,
      conditionArabic: 'مشمس وصافٍ',
      icon: 'sun'
    },
    {
      dayName: 'الأحد',
      date: '27 سبتمبر',
      maxTempC: 27,
      minTempC: 16,
      humidityPct: 42,
      rainProbPct: 15,
      expectedRainMm: 0,
      et0MmDay: 5.1,
      conditionArabic: 'مشمس دافئ',
      icon: 'sun'
    },
    {
      dayName: 'الإثنين',
      date: '28 سبتمبر',
      maxTempC: 31,
      minTempC: 18,
      humidityPct: 34,
      rainProbPct: 5,
      expectedRainMm: 0,
      et0MmDay: 6.4,
      conditionArabic: 'رياح جنوبية جافة (سيروكو)',
      icon: 'wind'
    },
    {
      dayName: 'الثلاثاء',
      date: '29 سبتمبر',
      maxTempC: 22,
      minTempC: 14,
      humidityPct: 68,
      rainProbPct: 75,
      expectedRainMm: 14.5,
      et0MmDay: 2.8,
      conditionArabic: 'زخات رعدية ماطرة',
      icon: 'rain'
    },
    {
      dayName: 'الأربعاء',
      date: '30 سبتمبر',
      maxTempC: 21,
      minTempC: 13,
      humidityPct: 62,
      rainProbPct: 30,
      expectedRainMm: 2.0,
      et0MmDay: 3.4,
      conditionArabic: 'غائم جزئياً ورطب',
      icon: 'cloud'
    }
  ]
};

export const WEATHER_PRESETS: {
  id: string;
  name: string;
  description: string;
  weather: WeatherCondition;
}[] = [
  {
    id: 'current_normal',
    name: 'الطقس الفعلي المستقر (حوض بني هارون)',
    description: 'درجة حرارة 24° م، رياح 12 كم/سا، معدل البخر المرجعي 4.6 مم/يوم',
    weather: DEFAULT_WEATHER_MILA
  },
  {
    id: 'heatwave_sirocco',
    name: 'محاكاة: موجة حر وسيروكو جاف (35° م)',
    description: 'رياح جنوبية حارة وجافة 28 كم/سا، انخفاض الرطوبة إلى 22%، قفزة البخر إلى 7.8 مم/يوم',
    weather: {
      ...DEFAULT_WEATHER_MILA,
      currentTempC: 35,
      feelsLikeC: 37,
      humidityPct: 22,
      windSpeedKmh: 28,
      windDirection: 'جنوبي جاف (Sirocco)',
      solarRadiationWm2: 920,
      uvIndex: 9,
      rainProbabilityPct: 0,
      expectedRainfallMm: 0,
      et0MmDay: 7.8,
      conditionArabic: 'موجة حر وجفاف شديد • إجهاد مائي متسارع'
    }
  },
  {
    id: 'rain_storm',
    name: 'محاكاة: منخفض جوي ماطر (18 مم)',
    description: 'سحب رعدية مع هطول 18 مم من الأمطار، رطوبة 85%، انخفاض البخر إلى 1.8 مم/يوم',
    weather: {
      ...DEFAULT_WEATHER_MILA,
      currentTempC: 19,
      feelsLikeC: 18,
      humidityPct: 85,
      windSpeedKmh: 20,
      windDirection: 'شمالي رطب (N)',
      solarRadiationWm2: 340,
      uvIndex: 3,
      rainProbabilityPct: 95,
      expectedRainfallMm: 18.0,
      et0MmDay: 1.8,
      conditionArabic: 'أمطار غزيرة متوقعة • توصية بإيقاف الري وتوفير الطاقة'
    }
  }
];

interface ParcelConfig {
  id: string;
  name: string;
  arabicName: string;
  species: string;
  variety: string;
  cropCoefficientKc: number;
  areaHectares: number;
  treeCount: number;
  treeZoneSubstring: string;
  soilType: string;
  fieldCapacityPct: number;
  criticalThresholdPct: number;
  wiltingPointPct: number;
  flowRateLph: number; // liters per hour total capacity
}

const PARCEL_CONFIGS: ParcelConfig[] = [
  {
    id: 'parcel-alpha',
    name: 'Grove Alpha (Ancient Centenarians)',
    arabicName: 'بستان الزيتون المعمر (ألفا) - صنف الشملالي العتيق',
    species: 'أشجار الزيتون',
    variety: 'شملالي جزائري عتيق (عمر > 80 سنة)',
    cropCoefficientKc: 0.65,
    areaHectares: 35.0,
    treeCount: 1200,
    treeZoneSubstring: 'Grove Alpha',
    soilType: 'تربة طميية غرينية عميقة (حوض ميلة الفيضي)',
    fieldCapacityPct: 40.0,
    criticalThresholdPct: 28.0,
    wiltingPointPct: 14.0,
    flowRateLph: 19200
  },
  {
    id: 'parcel-beta',
    name: 'Grove Beta (Modern High-Yield)',
    arabicName: 'بستان الزيتون المكثف (بيتا) - صنف البيشولين عالي الإنتاج',
    species: 'أشجار الزيتون',
    variety: 'بيشولين حديث عالي الكثافة (سقي مقنن)',
    cropCoefficientKc: 0.68,
    areaHectares: 42.0,
    treeCount: 1600,
    treeZoneSubstring: 'Grove Beta',
    soilType: 'تربة طميية رملية جيدة الصرف مع صخور كلسية',
    fieldCapacityPct: 38.0,
    criticalThresholdPct: 27.5,
    wiltingPointPct: 13.5,
    flowRateLph: 25600
  },
  {
    id: 'parcel-gamma',
    name: 'Grove Gamma (Hedgerow)',
    arabicName: 'بستان الزيتون فائق الكثافة (غاما) - صنف الأربيكينا',
    species: 'أشجار الزيتون',
    variety: 'أربيكينا فائق الكثافة بنظام الأسيجة (Super-Intensive)',
    cropCoefficientKc: 0.72,
    areaHectares: 28.5,
    treeCount: 950,
    treeZoneSubstring: 'Grove Gamma',
    soilType: 'طمي فيضي خصب مسطح بجوار وادي بني هارون',
    fieldCapacityPct: 42.0,
    criticalThresholdPct: 29.0,
    wiltingPointPct: 15.0,
    flowRateLph: 15200
  },
  {
    id: 'parcel-citrus',
    name: 'Citrus Orchard South Valley',
    arabicName: 'بستان الحمضيات والبرتقال (دلتا) - المالطي والواشنطن نافل',
    species: 'أشجار الحمضيات',
    variety: 'برتقال مالطي دموي وواشنطن نافل',
    cropCoefficientKc: 0.75,
    areaHectares: 22.0,
    treeCount: 320,
    treeZoneSubstring: 'Citrus Orchard',
    soilType: 'تربة غرينية عميقة غنية بالمادة العضوية ومحمية من الرياح',
    fieldCapacityPct: 44.0,
    criticalThresholdPct: 31.0,
    wiltingPointPct: 16.0,
    flowRateLph: 7680
  },
  {
    id: 'parcel-fig',
    name: 'Fig Terrace Terraces East',
    arabicName: 'مدرجات التين السلطاني (إيست) - تلال الشرق المشمسة',
    species: 'أشجار التين',
    variety: 'تين سلطاني أرجواني وبياضي ميلة',
    cropCoefficientKc: 0.62,
    areaHectares: 15.0,
    treeCount: 180,
    treeZoneSubstring: 'Fig Terrace',
    soilType: 'تربة كلسية جبلية متدرجة ذات تهوية عالية',
    fieldCapacityPct: 36.0,
    criticalThresholdPct: 26.0,
    wiltingPointPct: 13.0,
    flowRateLph: 4320
  }
];

export function calculateParcelIrrigation(
  trees: Tree[],
  weather: WeatherCondition,
  thresholdAdjustOffset: number = 0
): ParcelIrrigationMetrics[] {
  return PARCEL_CONFIGS.map((cfg) => {
    // 1. Gather all trees belonging to this parcel zone
    const matchingTrees = trees.filter(
      (t) =>
        t.parcelZone.toLowerCase().includes(cfg.treeZoneSubstring.toLowerCase()) ||
        t.parcelZone.toLowerCase().includes(cfg.id.toLowerCase())
    );

    const treeIds = matchingTrees.map((t) => t.id);

    // 2. Average soil moisture from sensor probes (fallback to defaults if tree list empty)
    let avgMoisture = 38.0;
    if (matchingTrees.length > 0) {
      const sum = matchingTrees.reduce((acc, t) => acc + t.soilMoisturePct, 0);
      avgMoisture = +(sum / matchingTrees.length).toFixed(1);
    } else if (cfg.id === 'parcel-beta') {
      avgMoisture = 24.2;
    } else if (cfg.id === 'parcel-fig') {
      avgMoisture = 26.5;
    } else if (cfg.id === 'parcel-citrus') {
      avgMoisture = 45.0;
    }

    const fieldCapacity = cfg.fieldCapacityPct;
    const criticalThreshold = Math.max(cfg.wiltingPointPct + 5, cfg.criticalThresholdPct + thresholdAdjustOffset);
    const wiltingPoint = cfg.wiltingPointPct;

    // 3. Agronomic Water Requirement (FAO-56):
    // ETc = ET0 * Kc
    const etCrop = +(weather.et0MmDay * cfg.cropCoefficientKc).toFixed(2);

    // Effective rain absorption
    const effectiveRain = weather.expectedRainfallMm > 3 ? (weather.expectedRainfallMm - 3) * 0.8 : 0;
    const netDailyDeficitMm = Math.max(0, etCrop - effectiveRain);

    // Approx daily moisture percentage drop in the 0.6m - 0.8m root zone
    // Each 1mm net evapotranspiration drops root zone soil moisture by ~0.42% in this soil texture
    const dailyMoistureDrop = +(netDailyDeficitMm * 0.42).toFixed(2);

    // Depletion percentage relative to available water capacity
    const availableWater = fieldCapacity - wiltingPoint;
    const currentAvailable = Math.max(0, avgMoisture - wiltingPoint);
    const depletionPct = +Math.min(100, Math.max(0, ((fieldCapacity - avgMoisture) / availableWater) * 100)).toFixed(1);

    // 4. Hours until reaching critical MAD threshold
    let hoursUntilCritical = 0;
    if (avgMoisture <= criticalThreshold) {
      hoursUntilCritical = 0;
    } else if (dailyMoistureDrop > 0.1) {
      const moistureMargin = avgMoisture - criticalThreshold;
      hoursUntilCritical = Math.round((moistureMargin / dailyMoistureDrop) * 24);
    } else {
      hoursUntilCritical = 168; // 1 week +
    }

    // 5. Determine Urgency Status
    let urgency: 'critical' | 'warning' | 'optimal' | 'excess' = 'optimal';
    if (avgMoisture <= criticalThreshold) {
      urgency = 'critical';
    } else if (avgMoisture <= criticalThreshold + 4.5 || hoursUntilCritical <= 36) {
      urgency = 'warning';
    } else if (avgMoisture >= fieldCapacity + 3) {
      urgency = 'excess';
    } else {
      urgency = 'optimal';
    }

    // If heavy rain is forecasted in next 24h, downgrade urgency to save water
    if (weather.expectedRainfallMm >= 10 && urgency !== 'critical') {
      urgency = 'excess';
    }

    // 6. Calculate Suggested Irrigation Dosage:
    // Moisture replenishment needed (target is 95% of field capacity)
    const targetMoisture = fieldCapacity * 0.95;
    const moistureToReplenishPct = Math.max(0, targetMoisture - avgMoisture);

    // Volume calculation:
    // Water needed (m3) = area (m2) * root_depth (m) * (moisture_pct / 100) * irrigation_efficiency (0.9 for drip)
    const areaM2 = cfg.areaHectares * 10000;
    const rootDepthM = 0.7;
    const volumeM3 = +( (areaM2 * rootDepthM * (moistureToReplenishPct / 100) * 0.12) ).toFixed(1);

    // Duration in minutes using parcel pump flow rate:
    // volume (m3) * 1000 / flowRate (L/h) * 60 min
    let durationMinutes = 0;
    if (volumeM3 > 0) {
      durationMinutes = Math.min(360, Math.max(45, Math.round((volumeM3 * 1000 / cfg.flowRateLph) * 60)));
    }

    // Optimal time window (aiming for early morning 05:00 - 08:00 or late night 21:00 to minimize evaporation)
    let scheduledDate = 'غداً (الأحد 27 سبتمبر)';
    let scheduledTimeWindow = '05:00 ص - 07:45 ص (فترة انخفاض التبخر الصباحية)';

    if (urgency === 'critical') {
      scheduledDate = 'فوري - اليوم (السبت 26 سبتمبر)';
      scheduledTimeWindow = '21:00 م - 23:45 م (دورة طارئة ليلية لتفادي صدمة العطش)';
    } else if (urgency === 'warning') {
      scheduledDate = 'غداً (الأحد 27 سبتمبر)';
      scheduledTimeWindow = '05:30 ص - 08:00 ص (متزامن مع بدء شروق الشمس)';
    } else if (weather.expectedRainfallMm >= 10) {
      scheduledDate = 'مؤجل إلى ما بعد المنخفض (الأربعاء 30 سبتمبر)';
      scheduledTimeWindow = '06:00 ص - 08:00 ص (سقي تكميلي بعد تقييم الأمطار)';
    } else {
      scheduledDate = 'بعد يومين (الإثنين 28 سبتمبر)';
      scheduledTimeWindow = '05:00 ص - 07:00 ص (جدولة دورية وقائية)';
    }

    // Energy savings (kWh) from solar pumping vs peak grid rates
    const savingsKwh = +(durationMinutes * 0.18 * (cfg.flowRateLph / 10000)).toFixed(1);

    // Agronomic justification
    let agronomicJustification = '';
    if (urgency === 'critical') {
      agronomicJustification = `رطوبة التربة الحالية (${avgMoisture}%) انخفضت تحت عتبة الإجهاد المائي الحرج (${criticalThreshold}%). يجب ضخ مياه سد بني هارون لتعويض عجز قدره ${moistureToReplenishPct.toFixed(1)}% ومنع تساقط الثمار.`;
    } else if (urgency === 'warning') {
      agronomicJustification = `معدل البخر اليومي المتوقع (${etCrop} مم) سيستنزف الرطوبة المتبقية خلال ${hoursUntilCritical} ساعة. يوصى ببدء الري الصباحي لتأمين توازن الرطوبة قبل هبوب الرياح الدافئة.`;
    } else if (weather.expectedRainfallMm >= 10) {
      agronomicJustification = `توقعات بهطول أمطار رعدية معتبرة (${weather.expectedRainfallMm} مم). تم تأجيل دورة الري آلياً لتوفير ما يقارب ${volumeM3} م³ من المياه وترشيد استهلاك طاقة المضخات.`;
    } else {
      agronomicJustification = `الرطوبة في النطاق المستهدف (${avgMoisture}%). الجدولة المقترحة وقائية للحفاظ على المحتوى المائي ضمن السعة الحقلية دون إهدار أو تشبع سطحي.`;
    }

    // 7. Generate simulated 24h hourly readings for trend visualization
    const sensorReadings24h = [
      { hour: '00:00', moisturePct: +(avgMoisture + 0.9).toFixed(1) },
      { hour: '04:00', moisturePct: +(avgMoisture + 0.6).toFixed(1) },
      { hour: '08:00', moisturePct: +(avgMoisture + 0.3).toFixed(1) },
      { hour: '12:00', moisturePct: +(avgMoisture - 0.2).toFixed(1) },
      { hour: '16:00', moisturePct: +(avgMoisture - 0.6).toFixed(1) },
      { hour: '20:00', moisturePct: +(avgMoisture - 0.1).toFixed(1) },
      { hour: 'الآن', moisturePct: avgMoisture }
    ];

    // Checking valve status based on tree irrigationStatus
    const isRunning = matchingTrees.some((t) => t.irrigationStatus === 'scheduled');
    const valveStatus: 'idle' | 'running' | 'scheduled' = isRunning
      ? 'running'
      : urgency === 'critical'
      ? 'scheduled'
      : 'idle';

    return {
      id: cfg.id,
      name: cfg.name,
      arabicName: cfg.arabicName,
      species: cfg.species,
      variety: cfg.variety,
      cropCoefficientKc: cfg.cropCoefficientKc,
      areaHectares: cfg.areaHectares,
      treeCount: cfg.treeCount,
      treeIds,
      soilType: cfg.soilType,
      currentMoisturePct: avgMoisture,
      fieldCapacityPct: fieldCapacity,
      criticalThresholdPct: criticalThreshold,
      wiltingPointPct: wiltingPoint,
      depletionPct,
      etCropMmDay: etCrop,
      dailyMoistureDropPct: dailyMoistureDrop,
      hoursUntilCritical,
      urgency,
      suggestedCycle: {
        scheduledDate,
        scheduledTimeWindow,
        durationMinutes,
        waterVolumeM3: volumeM3,
        flowRateLph: cfg.flowRateLph,
        savingsKwh,
        agronomicJustification
      },
      sensorReadings24h,
      valveStatus
    };
  });
}
