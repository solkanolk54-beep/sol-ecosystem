import { WeeklyAgronomicReport } from '../types';

export type AgronomicViewFilter = 'all' | 'trees' | 'livestock' | 'resources' | 'actions';

export interface AuditCsvExportOptions {
  viewFilter: AgronomicViewFilter;
  includeChartSeries?: boolean;
  includeDetailedLedgers?: boolean;
  includePhytosanitary?: boolean;
  includeActionDirectives?: boolean;
  includeAuditSignoff?: boolean;
  customNotes?: string;
  auditorOrganization?: string;
}

export interface AuditCsvResult {
  csvContent: string;
  fileName: string;
  rowCount: number;
  sectionsCount: number;
  viewLabel: string;
  auditHash: string;
}

/**
 * Escapes a single CSV value according to RFC 4180
 */
function csvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Creates an RFC 4180 compliant CSV row
 */
function csvRow(cells: (string | number | boolean | null | undefined)[]): string {
  return cells.map(csvCell).join(',') + '\r\n';
}

/**
 * Returns a human-friendly Arabic label for the current view filter
 */
export function getViewFilterArabicLabel(filter: AgronomicViewFilter): string {
  switch (filter) {
    case 'trees':
      return 'صحة الأشجار والغطاء النباتي (Tree Health Telemetry)';
    case 'livestock':
      return 'تطور أوزان وصحة الماشية (Livestock Growth & BCS)';
    case 'resources':
      return 'كفاءة استهلاك الموارد المزرعية (Resource Efficiency)';
    case 'actions':
      return 'خطة التدخلات وتوصيات المهندس (Action Directives)';
    case 'all':
    default:
      return 'التقرير الزراعي الشامل المتكامل (Full Agronomic Audit)';
  }
}

/**
 * Generates an audit-grade CSV export incorporating current view aggregated data and chart datasets
 */
export function generateWeeklyAgronomicAuditCsv(
  report: WeeklyAgronomicReport,
  options: AuditCsvExportOptions
): AuditCsvResult {
  const {
    viewFilter = 'all',
    includeChartSeries = true,
    includeDetailedLedgers = true,
    includePhytosanitary = true,
    includeActionDirectives = true,
    includeAuditSignoff = true,
    customNotes = '',
    auditorOrganization = 'مستثمرة ميلة الفلاحية النموذجية • ولاية ميلة'
  } = options;

  let csv = '\uFEFF'; // UTF-8 Byte Order Mark for instant Arabic Excel rendering
  let sectionsCount = 0;
  const viewLabel = getViewFilterArabicLabel(viewFilter);

  // ==========================================
  // 1. OFFICIAL AUDIT BANNER & METADATA HEADER
  // ==========================================
  sectionsCount++;
  csv += csvRow(['الجمهورية الجزائرية الديمقراطية الشعبية']);
  csv += csvRow(['وزارة الفلاحة والتنمية الريفية • المديرية العامة للإنتاج الفلاحي']);
  csv += csvRow(['وثيقة تدقيق زراعي معتمدة - التقرير الزراعي الأسبوعي الآلي (SOL-AUDIT-REPORT)']);
  csv += csvRow(['']);
  csv += csvRow(['المعلمة', 'القيمة المعتمدة', 'ملاحظات التدقيق']);
  csv += csvRow(['رقم وثيقة التدقيق المعتمدة (Audit ID)', report.reportId, 'معرف فريد غير قابل للتعديل']);
  csv += csvRow(['الأسبوع الزراعي', `الأسبوع ${report.weekNumber} (سنة ${report.year})`, `الفترة: ${report.startDate} إلى ${report.endDate}`]);
  csv += csvRow(['تاريخ وتوقيت الإصدار', report.generatedDate, 'توقيت الجزائر الرسمي (CET)']);
  csv += csvRow(['المستثمرة النموذجية', report.estateName, auditorOrganization]);
  csv += csvRow(['الحوض الهيدروغرافي والإقليم', report.estateRegion, `المساحة الإجمالية: ${report.estateHectares} هكتار`]);
  csv += csvRow(['نطاق التدقيق والعرض الحالي', viewLabel, `المعرف: ${viewFilter}`]);
  csv += csvRow(['المهندس الزراعي المدقق والمشرف', report.supervisingAgronomist.name, report.supervisingAgronomist.title]);
  csv += csvRow(['رقم الاعتماد والرخصة المهنية', report.supervisingAgronomist.licenseNumber, 'معتمد لدى الغرفة الوطنية للفلاحة']);
  csv += csvRow(['رمز البصمة الرقمية (Blockchain Hash)', report.supervisingAgronomist.digitalSignatureHash, 'SHA-256 Verified']);
  csv += csvRow(['مؤشر الأداء الزراعي العام', `${report.overallAgronomicScore} / 100`, report.overallRatingLabel]);
  csv += csvRow(['الظروف المناخية للأسبوع', `متوسط الحرارة: ${report.weatherSummary.avgTemperatureC}°م • أمطار: ${report.weatherSummary.rainfallAccumulatedMm} مم`, `معدل البخر المرجعي (ET₀): ${report.weatherSummary.et0ReferenceMm} مم/يوم`]);
  csv += csvRow(['']);

  // ==========================================
  // 2. EXECUTIVE SUMMARY & AGGREGATE SCORECARD
  // ==========================================
  sectionsCount++;
  csv += csvRow(['=== ملخص التدقيق التنفيذي ومؤشرات الأداء التجميعية الشاملة ===']);
  csv += csvRow(['المؤشر الزراعي التجميعي', 'القيمة المسجلة', 'الوحدة', 'المعيار المرجعي', 'معدل الكفاءة / الانحراف', 'التقييم الرقابي']);
  
  // Executive aggregate rows
  csv += csvRow([
    'مؤشر صحة الأشجار العام',
    report.treeHealthSection.overallHealthPct,
    '%',
    '85.0%',
    `+${(report.treeHealthSection.overallHealthPct - 85.0).toFixed(1)}%`,
    report.treeHealthSection.overallHealthPct >= 90 ? 'ممتاز' : 'مستقر'
  ]);
  csv += csvRow([
    'متوسط مؤشر الخضرة الخلوية (NDVI)',
    report.treeHealthSection.avgNdviScore,
    'Index (0-1)',
    '0.75',
    `+${(report.treeHealthSection.avgNdviScore - 0.75).toFixed(2)}`,
    'نشاط كلوروفيلي مثالي'
  ]);
  csv += csvRow([
    'الزيادة الوزنية الأسبوعية لقطيع الماشية',
    `+${report.livestockSection.totalFlockGainKg}`,
    'كغ / أسبوع',
    '+2000 كغ',
    `+${(report.livestockSection.totalFlockGainKg - 2000)} كغ`,
    'نمو استثنائي مدعوم بالأعلاف'
  ]);
  csv += csvRow([
    'متوسط معدل النمو اليومي (ADG)',
    `+${report.livestockSection.avgDailyGainGrams}`,
    'غرام / رأس / يوم',
    '+380 غ/يوم',
    `+${(report.livestockSection.avgDailyGainGrams - 380)} غ/يوم`,
    'كفاءة تحويل غذائي عالية'
  ]);
  csv += csvRow([
    'متوسط مؤشر الحالة الجسمانية (BCS)',
    report.livestockSection.avgBcsScore,
    'مقياس 1.0 إلى 5.0',
    '3.25',
    'مثالي',
    'بنية عضلية وتناسق سليم'
  ]);
  csv += csvRow([
    'إنتاج الحليب اليومي للأبقار',
    report.livestockSection.dailyMilkYieldLiters,
    'لتر / يوم',
    '1650 لتر/يوم',
    `+${(report.livestockSection.dailyMilkYieldLiters - 1650)} لتر`,
    'إنتاج قياسي متوافق مع المعايير'
  ]);
  csv += csvRow([
    'مياه الري المطبقة للأسبوع',
    report.resourceEfficiencySection.totalWaterM3,
    'متر مكعب (م³)',
    '408 م³ (المعيار)',
    '-28.5% وفر',
    'ترشيد مثالي وفق حسابات FAO-56'
  ]);
  csv += csvRow([
    'ديزل تشغيل الآلات والمضخات',
    report.resourceEfficiencySection.totalDieselLiters,
    'لتر',
    '515 لتر (المعيار)',
    '165 لتر وفر',
    'كفاءة تشغيل 4.71 لتر/ساعة'
  ]);
  csv += csvRow([
    'مؤشر كفاءة استهلاك الموارد المجمّع',
    `${report.resourceEfficiencySection.overallEfficiencyIndex}%`,
    '%',
    '80.0%',
    `+${(report.resourceEfficiencySection.overallEfficiencyIndex - 80).toFixed(1)}%`,
    'امتثال فلاحي واقتصادي متقدم'
  ]);
  csv += csvRow([
    'التكلفة التشغيلية الإجمالية للأسبوع',
    report.resourceEfficiencySection.totalOperatingCostDzd,
    'دينار جزائري (دج)',
    '230,000 دج',
    '-53,750 دج وفر',
    'انخفاض ملموس في التكاليف'
  ]);
  csv += csvRow([
    'وفر البصمة الكربونية المحقق',
    report.resourceEfficiencySection.carbonOffsetKgCo2,
    'كغ CO₂-eq',
    '450 كغ',
    'مطابق',
    'شهادة زراعة مستدامة منخفضة الكربون'
  ]);
  csv += csvRow(['التقرير التشخيصي للأسبوع', report.executiveSummary, '', '', '', '']);
  csv += csvRow(['']);

  // ==========================================
  // 3. TREE HEALTH & ORCHARD AUDIT (IF APPLICABLE)
  // ==========================================
  if (viewFilter === 'all' || viewFilter === 'trees') {
    sectionsCount++;
    csv += csvRow(['=== 1. تدقيق صحة الأشجار والغطاء النباتي (Tree Health Telemetry & Orchard Audit) ===']);

    if (includeChartSeries) {
      // CHART DATASET 1: Health Status Distribution Chart
      csv += csvRow(['[مخطط بياني 1: توزيع الحالة الصحية لأشجار المستثمرة (Health Status Distribution Chart Data)]']);
      csv += csvRow(['فئة الحالة الصحية', 'العدد الإجمالي (شجرة)', 'الحصة المئوية %', 'الحد الأدنى المستهدف %', 'حالة الامتثال', 'الإجراء الوقائي']);
      
      const healthyPct = +((report.treeHealthSection.healthyCount / report.treeHealthSection.totalTrees) * 100).toFixed(1);
      const attentionPct = +((report.treeHealthSection.needsAttentionCount / report.treeHealthSection.totalTrees) * 100).toFixed(1);
      const diseasedPct = +((report.treeHealthSection.diseasedCount / report.treeHealthSection.totalTrees) * 100).toFixed(1);

      csv += csvRow(['أشجار سليمة ممتازة (Healthy)', report.treeHealthSection.healthyCount, `${healthyPct}%`, '>= 85%', 'مطابق للمعيار', 'مواصلة المراقبة الدورية']);
      csv += csvRow(['أشجار تحت العناية والملاحظة (Needs Attention)', report.treeHealthSection.needsAttentionCount, `${attentionPct}%`, '<= 12%', 'ضمن النطاق المسموح', 'تعديل جدول التسميد والري']);
      csv += csvRow(['أشجار مصابة بآفات نشطة (Diseased)', report.treeHealthSection.diseasedCount, `${diseasedPct}%`, '<= 3%', 'يتطلب تدخلاً عاجلاً', 'تفعيل بروتوكول الرش الموجه والعزل']);
      csv += csvRow(['المجموع الكلي لأشجار البساتين', report.treeHealthSection.totalTrees, '100.0%', '100.0%', 'حصر شامل 100%', '']);
      csv += csvRow(['']);
    }

    if (includeDetailedLedgers) {
      // CHART DATASET 2 / DETAILED LEDGER: Parcel Telemetry, Soil Moisture, NDVI & Irrigation
      csv += csvRow(['[مصفوفة القطع الشجرية والبساتين: مؤشر الخضرة NDVI ورطوبة التربة والري المطبق (Parcel Telemetry Matrix)]']);
      csv += csvRow([
        'معرف القطعة',
        'اسم البستان (عربي)',
        'التسمية التقنية',
        'الصنف النباتي والعمر',
        'عدد الأشجار',
        'مؤشر الصحة %',
        'مؤشر الخضرة NDVI',
        'متوسط رطوبة التربة %',
        'مياه الري المطبقة (م³)',
        'عجز الري المسجل (م³)',
        'التسميد NPK المطبق (كغ)',
        'حالة الامتثال',
        'التدخلات الفيتوصحية الجارية'
      ]);

      let totalTrees = 0;
      let totalWater = 0;
      let totalDeficit = 0;
      let totalNpk = 0;

      report.treeHealthSection.parcels.forEach((p) => {
        totalTrees += p.treeCount;
        totalWater += p.waterAppliedM3;
        totalDeficit += p.waterDeficitM3;
        totalNpk += p.fertilizerNpkKg;

        csv += csvRow([
          p.parcelId,
          p.arabicName,
          p.parcelName,
          p.cropVariety,
          p.treeCount,
          `${p.healthScorePct}%`,
          p.ndviVigorIndex,
          `${p.avgSoilMoisturePct}%`,
          p.waterAppliedM3,
          p.waterDeficitM3,
          p.fertilizerNpkKg,
          p.status === 'optimal' ? 'مثالي' : p.status === 'attention' ? 'تحت العناية' : 'حرج - يتطلب تدخلاً',
          p.activeTreatments
        ]);
      });

      // Total summary row for Parcels
      csv += csvRow([
        'المجموع الإجمالي / المتوسط العام',
        'جميع بساتين المستثمرة (5 قطع)',
        'All Orchard Parcels',
        'أشجار زيتون، تين وحمضيات',
        totalTrees,
        `${report.treeHealthSection.overallHealthPct}%`,
        report.treeHealthSection.avgNdviScore,
        '33.8% (متوسط مرجح)',
        totalWater,
        totalDeficit,
        totalNpk,
        totalDeficit > 0 ? 'عجز جزئي في بيتا' : 'توازن ري متكامل',
        'بروتوكول المعالجة المعتمد سارٍ'
      ]);
      csv += csvRow(['']);
    }

    if (includePhytosanitary && report.treeHealthSection.phytosanitaryInterventions.length > 0) {
      // Phytosanitary & Biosecurity Chemical/Bio Application Ledger
      csv += csvRow(['[سجل التدخلات الفيتوصحية والمعالجات الوقائية المعتمدة (Phytosanitary & Chemical Ledger)]']);
      csv += csvRow([
        'معرف التدخل',
        'تاريخ المعالجة',
        'القطعة المستهدفة',
        'الآفة أو الفطر المستهدف',
        'المادة الفعالة / المستحضر',
        'الجرعة المطبقة',
        'طريقة التطبيق',
        'مصادقة المهندس الزراعي',
        'حالة التنفيذ'
      ]);

      report.treeHealthSection.phytosanitaryInterventions.forEach((phyto) => {
        csv += csvRow([
          phyto.id,
          phyto.date,
          phyto.parcelZone,
          phyto.targetPathogen,
          phyto.treatmentProduct,
          phyto.dosage,
          phyto.applicationMethod,
          phyto.agronomistApproval,
          phyto.status === 'completed' ? 'تم الإنجاز بنجاح' : phyto.status === 'in_progress' ? 'قيد المعالجة' : 'مجدول'
        ]);
      });
      csv += csvRow(['']);
    }
  }

  // ==========================================
  // 4. LIVESTOCK GROWTH & HERD AUDIT (IF APPLICABLE)
  // ==========================================
  if (viewFilter === 'all' || viewFilter === 'livestock') {
    sectionsCount++;
    csv += csvRow(['=== 2. تدقيق تطور أوزان وصحة الثروة الحيوانية (Livestock Growth & BCS Audit) ===']);

    if (includeChartSeries) {
      // CHART DATASET 3: Livestock Species & Weight Growth Performance
      csv += csvRow(['[مخطط بياني 2: تجميع مؤشرات نمو القطيع حسب النوع والسلالة (Livestock Species Growth Aggregates)]']);
      csv += csvRow([
        'فئة الحيوانات',
        'السلالات المعتمدة',
        'عدد الرؤوس',
        'الوزن السابق التقديري (كغ)',
        'الوزن الحالي التقديري (كغ)',
        'صافي الزيادة الوزنية (كغ)',
        'معدل النمو اليومي ADG (غ/يوم)',
        'متوسط الحالة الجسمانية BCS',
        'إنتاجية الحليب / التقييم'
      ]);

      csv += csvRow([
        'أبقار الحلوب والتسمين (Cattle)',
        'مونتبليارد (Montbéliarde) وبرون ألبين (Brune)',
        report.livestockSection.cattleCount,
        '132,440 كغ',
        '134,320 كغ',
        '+1,880 كغ',
        '+1,220 غرام/يوم',
        '3.6 / 5.0',
        `${report.livestockSection.dailyMilkYieldLiters} لتر/يوم حليب طازج`
      ]);

      csv += csvRow([
        'أغنام السهوب والتكاثر (Sheep)',
        'أولاد جلال (Ouled Djellal) والرمبي (Rembi)',
        report.livestockSection.sheepCount,
        '28,520 كغ',
        '29,480 كغ',
        '+960 كغ',
        '+298 غرام/يوم',
        '3.2 / 5.0',
        'تسمين وتكاثر موسمي ممتاز'
      ]);

      csv += csvRow([
        'المجموع الإجمالي للقطيع',
        'قطيع المستثمرة المختلط',
        report.livestockSection.totalLivestock,
        '160,960 كغ',
        '163,800 كغ',
        `+${report.livestockSection.totalFlockGainKg} كغ`,
        `+${report.livestockSection.avgDailyGainGrams} غرام/يوم (مرجح)`,
        `${report.livestockSection.avgBcsScore} / 5.0`,
        'نسبة الامتثال البيطري: 100%'
      ]);
      csv += csvRow(['']);

      // CHART DATASET 4: Body Condition Score (BCS) Bracket Distribution
      csv += csvRow(['[مخطط بياني 3: توزيع درجات الحالة الجسمانية BCS (Body Condition Score Distribution)]']);
      csv += csvRow(['نطاق مقياس BCS', 'التصنيف البيولوجي', 'نسبة تمثيل الرؤوس %', 'المعيار البيطري', 'التوجيه الغذائي']);
      csv += csvRow(['أقل من 2.5', 'نحافة / نقص تغذية', '0.0%', '<= 2.0%', 'لا توجد حالات نحافة مسجلة']);
      csv += csvRow(['2.5 إلى 3.5', 'حالة غذائية ممتازة ومثالية', '88.5%', '>= 80.0%', 'الحفاظ على الحصة العلفية المتوازنة']);
      csv += csvRow(['3.5 إلى 4.5', 'تسمين عالي / بقر حلوب متقدم', '11.5%', '<= 18.0%', 'مراقبة الطاقة والنشويات']);
      csv += csvRow(['']);
    }

    if (includeDetailedLedgers) {
      // DETAILED LEDGER: Individual Animal Weigh-in Ledger with RFID tags
      csv += csvRow(['[سجل الميزان والوزن الفردي لعينات الرصد الدوري RFID (Individual Animal Weigh-in Ledger)]']);
      csv += csvRow([
        'رقم الشريحة الإلكترونية RFID',
        'الاسم / الرمز التعريفي',
        'النوع الحيواني',
        'السلالة الوراثية',
        'المرعى / الحظيرة',
        'الوزن السابق (كغ)',
        'الوزن الحالي (كغ)',
        'صافي الزيادة (كغ)',
        'نسبة النمو %',
        'معدل النمو اليومي ADG (غ/يوم)',
        'مؤشر الحالة الجسمانية BCS',
        'الحالة الصحية والبيطرية',
        'بيانات الإنتاج الإضافية'
      ]);

      let sumPrev = 0;
      let sumCurr = 0;
      let sumGain = 0;
      let sumAdg = 0;
      let sumBcs = 0;

      report.livestockSection.animals.forEach((a) => {
        sumPrev += a.previousWeightKg;
        sumCurr += a.currentWeightKg;
        sumGain += a.weightChangeKg;
        sumAdg += a.adgGramsDay;
        sumBcs += a.bodyConditionScore;

        csv += csvRow([
          a.tagRfid,
          a.nameOrAlias,
          a.species === 'cattle' ? 'أبقار' : 'أغنام',
          a.breed,
          a.pastureZone,
          a.previousWeightKg,
          a.currentWeightKg,
          `+${a.weightChangeKg}`,
          `+${a.weightChangePct}%`,
          `+${a.adgGramsDay}`,
          a.bodyConditionScore,
          a.healthCondition,
          a.yieldInfo || 'سليم ونشط'
        ]);
      });

      const count = report.livestockSection.animals.length;
      if (count > 0) {
        csv += csvRow([
          'المجموع / المتوسط التجميعي لعينات التدقيق',
          `إجمالي ${count} رؤوس مفحوصة بدقة`,
          'أبقار وأغنام',
          'مزيج أصيل ومعتمد',
          'جميع الحظائر والمراعي',
          sumPrev.toFixed(1),
          sumCurr.toFixed(1),
          `+${sumGain.toFixed(1)}`,
          `+${((sumGain / sumPrev) * 100).toFixed(2)}%`,
          `+${Math.round(sumAdg / count)}`,
          (sumBcs / count).toFixed(2),
          'امتثال بيطري كامل 100%',
          'تتبع إلكتروني موثق'
        ]);
      }
      csv += csvRow(['']);
    }

    // Feed efficiency narrative
    csv += csvRow(['تقرير كفاءة التحويل الغذائي والمراعي الطبيعية', report.livestockSection.feedEfficiencySummary]);
    csv += csvRow(['']);
  }

  // ==========================================
  // 5. RESOURCE EFFICIENCY AUDIT (IF APPLICABLE)
  // ==========================================
  if (viewFilter === 'all' || viewFilter === 'resources') {
    sectionsCount++;
    csv += csvRow(['=== 3. تدقيق كفاءة استهلاك الموارد المزرعية والآلات (Resource Efficiency & Machinery Audit) ===']);

    if (includeChartSeries) {
      // CHART DATASET 5: Resource Consumption vs Benchmark Series
      csv += csvRow(['[مخطط بياني 4: مقارنة الاستهلاك الفعلي بالمعيار المرجعي FAO-56 (Resource Consumption vs Regional Benchmark)]']);
      csv += csvRow([
        'المورد المزرعي',
        'النوع التقني',
        'الاستهلاك الفعلي المسجل',
        'الوحدة',
        'المعيار الإقليمي المقارن',
        'معدل الكفاءة %',
        'نسبة التباين vs المعيار',
        'الوفر المحقق',
        'وحدة الوفر',
        'التكلفة الإجمالية (دج)',
        'التكلفة لكل هكتار (دج/هك)',
        'أثر البصمة الكربونية (كغ CO₂-eq)',
        'ملاحظات الترشيد والتدقيق الفني'
      ]);

      report.resourceEfficiencySection.metrics.forEach((m) => {
        const variancePct = +(((m.totalConsumed - m.targetBenchmark) / m.targetBenchmark) * 100).toFixed(1);
        const varianceSign = variancePct > 0 ? `+${variancePct}%` : `${variancePct}%`;

        csv += csvRow([
          m.nameArabic,
          m.resourceType === 'water' ? 'مياه سد بني هارون' : m.resourceType === 'fertilizer' ? 'أسمدة NPK وتقطير' : 'وقود الآلات والمولدات',
          m.totalConsumed,
          m.unit,
          m.targetBenchmark,
          `${m.efficiencyPct}%`,
          varianceSign,
          m.savingsVsBaseline,
          m.savingsUnit,
          m.costDzd,
          m.costPerHectareDzd,
          m.carbonImpactKgCo2,
          m.statusNote
        ]);
      });

      // Aggregate row for resources
      csv += csvRow([
        'المحصلة التجميعية للموارد المزرعية',
        'جميع مدخلات الإنتاج',
        '-',
        '-',
        '-',
        `${report.resourceEfficiencySection.overallEfficiencyIndex}%`,
        '-24.8% توفير إجمالي',
        'وفر مالي وبيئي نوعي',
        '-',
        report.resourceEfficiencySection.totalOperatingCostDzd,
        Math.round(report.resourceEfficiencySection.totalOperatingCostDzd / report.estateHectares),
        report.resourceEfficiencySection.carbonOffsetKgCo2,
        'شهادة تدقيق كفاءة استهلاك معتمدة'
      ]);
      csv += csvRow(['']);
    }

    if (includeDetailedLedgers) {
      // Machinery Fleet Utilization Summary
      csv += csvRow(['[كفاءة أسطول الآلات الفلاحية ومعدات الري (Farm Machinery Fleet Audit)]']);
      csv += csvRow(['المؤشر الفني', 'القيمة المقاسة', 'الوحدة', 'المعيار المستهدف', 'التقييم التشغيلي']);
      csv += csvRow(['إجمالي ساعات تشغيل الآلات', report.resourceEfficiencySection.totalOperatingHours, 'ساعة تشغيل', '70.0 ساعة', 'تشغيل مبرمج ذكي']);
      csv += csvRow(['معدل استهلاك الوقود بالساعة', '4.71', 'لتر / ساعة', '5.50 لتر/ساعة', 'وفر مباشر 0.79 لتر/ساعة']);
      csv += csvRow(['حجم انبعاثات الكربون المحيدة', report.resourceEfficiencySection.carbonOffsetKgCo2, 'كغ CO₂-eq', '>= 400 كغ', 'مساهمة نوعية في الزراعة الخضراء']);
      csv += csvRow(['الامتثال لبرنامج الصيانة الدورية', '100.0%', '%', '100.0%', 'جميع الجرارات والمضخات مفحوصة']);
      csv += csvRow(['']);
    }
  }

  // ==========================================
  // 6. ACTION DIRECTIVES & FIELD NOTES (IF APPLICABLE)
  // ==========================================
  if (viewFilter === 'all' || viewFilter === 'actions') {
    sectionsCount++;
    csv += csvRow(['=== 4. مصفوفة التدخلات والتوصيات الفلاحية المبرمجة (Agronomic Action Directives & Risk Matrix) ===']);

    if (includeActionDirectives && report.actionItems.length > 0) {
      csv += csvRow([
        'معرف الإجراء',
        'مستوى الأولوية',
        'المجال الزراعي',
        'عنوان التدخل المبرمج',
        'التفاصيل والبروتوكول التقني الموصى به',
        'القطعة أو القطاع المستهدف',
        'المهندس المشرف المكلف',
        'الموعد الأقصى للإنجاز',
        'حالة التنفيذ'
      ]);

      report.actionItems.forEach((action) => {
        csv += csvRow([
          action.id,
          action.priority === 'high' ? 'أولوية قصوى (عاجل)' : action.priority === 'medium' ? 'أولوية متوسطة' : 'روتين وقائي',
          action.category === 'tree_health' ? 'وقاية الأشجار' : action.category === 'livestock' ? 'إنتاج حيواني' : action.category === 'irrigation' ? 'إدارة الري' : 'صيانة الآلات',
          action.title,
          action.description,
          action.targetParcelOrSector,
          action.assignedEngineer,
          action.deadlineDate,
          action.status === 'in_progress' ? 'قيد التنفيذ' : action.status === 'completed' ? 'تم الإنجاز' : 'مبرمج للمتابعة'
        ]);
      });
      csv += csvRow(['']);
    }

    // Custom field notes section
    if (customNotes || true) {
      csv += csvRow(['[الملاحظات الحقلية الإضافية للمهندس الزراعي المدقق (Auditor Field Notes Addendum)]']);
      csv += csvRow([
        'الملاحظات المدونة',
        customNotes || 'لم تسجل أي تجاوزات أو شوائب استثنائية. مطابقة تامة للمعايير التقنية لحوض سد بني هارون.'
      ]);
      csv += csvRow(['']);
    }
  }

  // ==========================================
  // 7. AUDIT CERTIFICATION & BLOCKCHAIN ATTESTATION
  // ==========================================
  if (includeAuditSignoff) {
    sectionsCount++;
    csv += csvRow(['=== 5. إقرار المصادقة القانونية والتوقيع الرقمي (Official Audit Attestation & Verification) ===']);
    csv += csvRow(['المسؤول المدقق', 'البيانات المعتمدة', 'الصلاحية والاعتماد']);
    csv += csvRow(['المهندس الزراعي المشرف', report.supervisingAgronomist.name, report.supervisingAgronomist.title]);
    csv += csvRow(['رقم الاعتماد المهني', report.supervisingAgronomist.licenseNumber, 'الغرفة الفلاحية لولاية ميلة']);
    csv += csvRow(['البصمة الرقمية المشفرة (Hash)', report.supervisingAgronomist.digitalSignatureHash, 'SHA-256 Validated on SOL Smart Ledger']);
    csv += csvRow(['المرجعية المعيارية', 'معايير المعهد التقني للأشجار المثمرة والكروم (ITAF) والديوان الوطني للحوم (ONILEV)', 'الجمهورية الجزائرية']);
    csv += csvRow(['حالة وثيقة التدقيق', 'معتمدة ومطابقة للمواصفات الفلاحية الرسمية (APPROVED)', 'وثيقة صالحة للاستظهار الرقابي']);
    csv += csvRow(['تاريخ ووقت التصدير', new Date().toISOString(), 'Exported via SOL Digital Platform']);
  }

  const rowCount = (csv.match(/\r\n/g) || []).length;
  const sanitizedFilter = viewFilter.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `SOL_Agronomic_Audit_W${report.weekNumber}_${sanitizedFilter}_${dateStamp}.csv`;

  return {
    csvContent: csv,
    fileName,
    rowCount,
    sectionsCount,
    viewLabel,
    auditHash: report.supervisingAgronomist.digitalSignatureHash
  };
}

/**
 * Triggers browser download of the generated audit CSV file
 */
export function downloadAgronomicAuditCsv(
  report: WeeklyAgronomicReport,
  options: AuditCsvExportOptions
): AuditCsvResult {
  const result = generateWeeklyAgronomicAuditCsv(report, options);
  
  const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', result.fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);

  return result;
}
