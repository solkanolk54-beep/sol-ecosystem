import { WeeklyAgronomicReport, Farm, Tree, LivestockAnimal, ResourceConsumptionLog } from '../types';

export const HISTORICAL_WEEKLY_REPORTS: WeeklyAgronomicReport[] = [
  // WEEK 39 (Current Week: 21 - 27 September 2026)
  {
    reportId: 'SOL-RPT-2026-W39-MILA',
    weekNumber: 39,
    year: 2026,
    startDate: '2026-09-21',
    endDate: '2026-09-27',
    generatedDate: '2026-09-27 08:30:00',
    estateName: 'مستثمرة ميلة الفلاحية النموذجية',
    estateRegion: 'حوض سد بني هارون • ولاية ميلة، الجزائر',
    estateHectares: 142.5,
    supervisingAgronomist: {
      name: 'د. سليم بن عثمان (Dr. Salim Ben Othman)',
      title: 'كبير المهندسين الزراعيين ورئيس مصلحة الوقاية النباتية والإنتاج الحيواني',
      licenseNumber: 'AGR-DZ-MILA-2016/0942',
      digitalSignatureHash: 'SHA256:7f4a9b8c12e5d90e4f2a71c8901bca4409ef32a11b897645eacb90812'
    },
    overallAgronomicScore: 93.8,
    overallRatingLabel: 'أداء زراعي متميز (A+)',
    executiveSummary: `أظهرت مؤشرات الأسبوع 39 استقراراً استثنائياً في الحالة الفيزيولوجية لحقول الزيتون بحوض بني هارون بفضل تفعيل نظام الري التنبؤي الذكي (FAO-56) الذي قلّص الإجهاد المائي بنسبة 28.5%. سجل قطيع الماشية زيادة يومية ملموسة في الوزن بمعدل 485 غرام/رأس للأغنام و1,220 غرام/رأس للأبقار مدعوماً ببرنامج الأعلاف المخمرة ومراعي القطاع الشمالي. كما حقق أسطول الآلات الفلاحية وفرة في الديزل بلغت 165 لتراً مقارنة بالمعيار الإقليمي، مع الحفاظ على وتيرة رش وقائي عضوي متقدم لمكافحة عين الطاووس وتأهيل مسارب تصريف المياه.`,
    weatherSummary: {
      avgTemperatureC: 24.2,
      rainfallAccumulatedMm: 3.5,
      et0ReferenceMm: 4.6,
      solarRadiationAvg: '18.4 ميغاجول/م²'
    },
    treeHealthSection: {
      totalTrees: 4250,
      healthyCount: 3820,
      needsAttentionCount: 320,
      diseasedCount: 110,
      overallHealthPct: 89.9,
      avgNdviScore: 0.84,
      parcels: [
        {
          parcelId: 'pcl-01',
          parcelName: 'Grove Alpha (Ancient Centenarians)',
          arabicName: 'بستان ألفا (الشملالي العتيق)',
          cropVariety: 'زيتون شملالي عتيق (14 سنة)',
          treeCount: 1200,
          healthScorePct: 96.5,
          ndviVigorIndex: 0.88,
          avgSoilMoisturePct: 42.0,
          waterAppliedM3: 72.0,
          waterDeficitM3: 0.0,
          fertilizerNpkKg: 45.0,
          activeTreatments: 'تم رش هيدروكسيد النحاس الوقائي (Peacock Spot) بنجاح 100%',
          status: 'optimal'
        },
        {
          parcelId: 'pcl-02',
          parcelName: 'Grove Beta (Modern High-Yield)',
          arabicName: 'بستان بيتا (البيشولين المكثف)',
          cropVariety: 'زيتون بيشولين عالي الكثافة (8 سنوات)',
          treeCount: 1450,
          healthScorePct: 82.4,
          ndviVigorIndex: 0.74,
          avgSoilMoisturePct: 24.2,
          waterAppliedM3: 90.0,
          waterDeficitM3: 18.5,
          fertilizerNpkKg: 70.0,
          activeTreatments: 'علاج ذبول فرتيسيليوم جاري بالحقن الحيوي الجذري (Trichoderma)',
          status: 'critical'
        },
        {
          parcelId: 'pcl-03',
          parcelName: 'Grove Gamma (Hedgerow)',
          arabicName: 'بستان غاما (الأربيكينا المسوّر)',
          cropVariety: 'زيتون أربيكينا فائق الكثافة (5 سنوات)',
          treeCount: 950,
          healthScorePct: 94.2,
          ndviVigorIndex: 0.86,
          avgSoilMoisturePct: 39.5,
          waterAppliedM3: 42.0,
          waterDeficitM3: 0.0,
          fertilizerNpkKg: 30.0,
          activeTreatments: 'تقليم ميكانيكي وتعديل الأسيجة الحية منتهي، وقاية ممتازة',
          status: 'optimal'
        },
        {
          parcelId: 'pcl-04',
          parcelName: 'Fig Plantation West Terrace',
          arabicName: 'مدرجات التين السلطاني الغربية',
          cropVariety: 'تين سلطاني عسلي محلي (10 سنوات)',
          treeCount: 380,
          healthScorePct: 88.0,
          ndviVigorIndex: 0.79,
          avgSoilMoisturePct: 26.5,
          waterAppliedM3: 52.0,
          waterDeficitM3: 8.0,
          fertilizerNpkKg: 28.0,
          activeTreatments: 'تغذية كالسيوم وبوتاسيوم لمنع تشقق الثمار قبل مرحلة القطف',
          status: 'attention'
        },
        {
          parcelId: 'pcl-05',
          parcelName: 'Citrus Orchard South Valley',
          arabicName: 'بستان الحمضيات (البرتقال المالطي)',
          cropVariety: 'برتقال مالطي وكليمونتين ميلة (7 سنوات)',
          treeCount: 270,
          healthScorePct: 91.5,
          ndviVigorIndex: 0.83,
          avgSoilMoisturePct: 45.0,
          waterAppliedM3: 35.0,
          waterDeficitM3: 0.0,
          fertilizerNpkKg: 35.0,
          activeTreatments: 'تجهيز مسارب تصريف السيول ومصائد فرمونية لذبابة الفاكهة (Ceratitis)',
          status: 'optimal'
        }
      ],
      phytosanitaryInterventions: [
        {
          id: 'phyto-39-01',
          date: '2026-09-22',
          parcelZone: 'بستان ألفا (الشملالي)',
          targetPathogen: 'تبقع عين الطاووس (Spilocaea oleagina)',
          treatmentProduct: 'هيدروكسيد النحاس العضوي (Kocide 2000)',
          dosage: '250 غرام / 100 لتر ماء',
          applicationMethod: 'رش هوائي دقيق بواسطة مرشة كافيني 2000L',
          agronomistApproval: 'معتمد ومطابق للمعايير العضوية',
          status: 'completed'
        },
        {
          id: 'phyto-39-02',
          date: '2026-09-24',
          parcelZone: 'بستان بيتا (البيشولين)',
          targetPathogen: 'فطر الذبول الوعائي (Verticillium dahliae)',
          treatmentProduct: 'مكافحة حيوية بفطر التريكوديرما (Trichoderma harzianum)',
          dosage: '2 كغ / هكتار عبر شبكة التسميد بالري',
          applicationMethod: 'تسميد عضوي سائل وحقن جذري محطة جروندفوس',
          agronomistApproval: 'تدخل طارئ قيد المعالجة (تراجع الأعراض بـ 35%)',
          status: 'in_progress'
        },
        {
          id: 'phyto-39-03',
          date: '2026-09-25',
          parcelZone: 'بستان الحمضيات الوادي الجنوبي',
          targetPathogen: 'ذبابة ثمار البحر الأبيض المتوسط (Ceratitis capitata)',
          treatmentProduct: 'مصائد فرمونية جاذبة + سبينوساد (Spinosad Eco)',
          dosage: '20 مصيدة / هكتار',
          applicationMethod: 'تعليق ميكانيكي بمحاذاة الشجيرات الجنوبية',
          agronomistApproval: 'وقاية استباقية متكاملة (IPM)',
          status: 'completed'
        }
      ]
    },
    livestockSection: {
      totalLivestock: 680,
      cattleCount: 220,
      sheepCount: 460,
      avgDailyGainGrams: 485,
      totalFlockGainKg: 2840,
      avgBcsScore: 3.8,
      dailyMilkYieldLiters: 3450,
      veterinaryCompliancePct: 100,
      animals: [
        {
          id: 'lstk-001',
          tagRfid: 'RFID-CTL-9021',
          nameOrAlias: 'بيلا بريما (Bella Prima)',
          species: 'cattle',
          breed: 'هولشتاين فريزيان نقية (Holstein)',
          pastureZone: 'مرعى المروج الخضراء - القطاع 1',
          previousWeightKg: 641.5,
          currentWeightKg: 645.0,
          weightChangeKg: 3.5,
          weightChangePct: 0.55,
          adgGramsDay: 500,
          bodyConditionScore: 3.7,
          healthCondition: 'مدرّة للحليب (إنتاج قياسي 29.5 لتر/يوم)',
          yieldInfo: '29.5 لتر/يوم (حليب عالي الدسم)'
        },
        {
          id: 'lstk-002',
          tagRfid: 'RFID-SHP-3084',
          nameOrAlias: 'سلطان عواسي (Sultan Awassi)',
          species: 'sheep',
          breed: 'سلالة العواسي المحسنة',
          pastureZone: 'مراعي التلال الشرقية B',
          previousWeightKg: 86.1,
          currentWeightKg: 88.5,
          weightChangeKg: 2.4,
          weightChangePct: 2.79,
          adgGramsDay: 343,
          bodyConditionScore: 4.1,
          healthCondition: 'صحة ممتازة (نمو عضلي متسارع)',
          yieldInfo: 'مؤشر صوف ممتاز + فحل تلقيح'
        },
        {
          id: 'lstk-003',
          tagRfid: 'RFID-CTL-8812',
          nameOrAlias: 'ماكسيموس أنغوس (Maximus Angus)',
          species: 'cattle',
          breed: 'بلاك أنغوس بريميوم (Black Angus)',
          pastureZone: 'حظيرة التسمين المكثف 4',
          previousWeightKg: 721.0,
          currentWeightKg: 730.0,
          weightChangeKg: 9.0,
          weightChangePct: 1.25,
          adgGramsDay: 1285,
          bodyConditionScore: 4.4,
          healthCondition: 'تسمين مثالي (رخامية لحم MS4)',
          yieldInfo: 'معدل تسمين فائق الجودة'
        },
        {
          id: 'lstk-004',
          tagRfid: 'RFID-SHP-4109',
          nameOrAlias: 'نجمة أولاد جلال (Najmat Djellal)',
          species: 'sheep',
          breed: 'سلالة أولاد جلال الأصيلة (Ouled Djellal)',
          pastureZone: 'مرعى السهوب الجنوبية C',
          previousWeightKg: 67.2,
          currentWeightKg: 69.8,
          weightChangeKg: 2.6,
          weightChangePct: 3.87,
          adgGramsDay: 371,
          bodyConditionScore: 3.9,
          healthCondition: 'حامل (في الثلث الأخير من الحمل)',
          yieldInfo: 'ولادة توأمية متوقعة'
        }
      ],
      feedEfficiencySummary: `تم استهلاك 4.2 طن من السيلاج العضوي المعزز وحبوب الشعير المنبت، مع تسجيل معدل تحويل غذائي (FCR) ممتاز بلغ 6.1 للأبقار و4.3 للحملان. أظهرت عينات مياه الشرب من خزانات بني هارون نقاوة جرثومية كاملة مع استهلاك يومي متوسط 58 لتر/رأس للبقر و7.8 لتر/رأس للأغنام.`
    },
    resourceEfficiencySection: {
      totalWaterM3: 291.0,
      totalFertilizerKg: 218.0,
      totalDieselLiters: 198.5,
      totalOperatingHours: 42.1,
      totalOperatingCostDzd: 12420,
      overallEfficiencyIndex: 94.2,
      carbonOffsetKgCo2: 412,
      metrics: [
        {
          resourceType: 'water',
          nameArabic: 'مياه الري التنبؤي (حوض بني هارون)',
          totalConsumed: 291.0,
          unit: 'م³',
          targetBenchmark: 407.0,
          efficiencyPct: 96.5,
          savingsVsBaseline: 116.0,
          savingsUnit: 'م³ وفر مباشر',
          costDzd: 2910,
          costPerHectareDzd: 20.4,
          carbonImpactKgCo2: 34.9,
          statusNote: 'وفر 28.5% مقارنة بالري التقليدي بفضل مجسات FDR والجدولة الليلية'
        },
        {
          resourceType: 'fertilizer',
          nameArabic: 'الأسمدة التسميدية العضوية والكيماوية',
          totalConsumed: 218.0,
          unit: 'كغ',
          targetBenchmark: 260.0,
          efficiencyPct: 92.0,
          savingsVsBaseline: 42.0,
          savingsUnit: 'كغ وفر',
          costDzd: 4360,
          costPerHectareDzd: 30.6,
          carbonImpactKgCo2: 87.2,
          statusNote: 'تسميد موضعي دقيق عبر شبكة التسميد السائل (Fertigation) دون هدر'
        },
        {
          resourceType: 'diesel',
          nameArabic: 'وقود الديزل لأسطول الجرارات والآلات',
          totalConsumed: 198.5,
          unit: 'لتر',
          targetBenchmark: 245.0,
          efficiencyPct: 91.8,
          savingsVsBaseline: 46.5,
          savingsUnit: 'لتر وقود',
          costDzd: 9925,
          costPerHectareDzd: 69.6,
          carbonImpactKgCo2: 526.0,
          statusNote: 'معدل استهلاك 4.71 لتر/ساعة تشغيل بفضل صيانة الحاقنات وبرمجة المسارات الذكية'
        }
      ]
    },
    actionItems: [
      {
        id: 'act-39-01',
        priority: 'high',
        category: 'irrigation',
        title: 'استكمال دورة الري الليلي لبستان بيتا (البيشولين)',
        description: 'ضخ 45 م³ ري بالتنقيط لتعويض عجز الرطوبة (24.2%) ورفعها فوق السعة الحقلية (38%).',
        targetParcelOrSector: 'بستان بيتا (Modern High-Yield)',
        deadlineDate: '2026-09-28',
        assignedEngineer: 'م. رشيد عثمان (قسم الري)',
        status: 'in_progress'
      },
      {
        id: 'act-39-02',
        priority: 'high',
        category: 'livestock',
        title: 'تلقيح تعزيزي ضد التسمم المعوي (Enterotoxemia)',
        description: 'إجراء الجرعة الدورية لأمهات الأغنام الحوامل بقطاع السهوب C لضمان المناعة السلبية للمواليد.',
        targetParcelOrSector: 'عيادة البيطرة والمأوى رقم 2',
        deadlineDate: '2026-09-29',
        assignedEngineer: 'د. طارق عمروش (طبيب بيطري)',
        status: 'pending'
      },
      {
        id: 'act-39-03',
        priority: 'medium',
        category: 'tree_health',
        title: 'أخذ عينات أنسجة نباتية لتقييم مؤشر الفينولات ونضج الزيتون',
        description: 'قياس نسبة الزيت والرطوبة في ثمار الشملالي والبيشولين لتحديد نافذة القطف الذهبية لموسم 2026.',
        targetParcelOrSector: 'مخبر التحاليل الزراعية بميلة',
        deadlineDate: '2026-10-02',
        assignedEngineer: 'أ. دلال مجدوب (كيميائية الجودة)',
        status: 'pending'
      },
      {
        id: 'act-39-04',
        priority: 'routine',
        category: 'machinery',
        title: 'صيانة وقائية لمرشة كافيني وجرار كوبوتا M7',
        description: 'تغيير فلاتر الهواء والزيت بعد استكمال 120 ساعة عمل ومراجعة ضغط الإطارات.',
        targetParcelOrSector: 'ورشة الميكنة المركزية',
        deadlineDate: '2026-10-03',
        assignedEngineer: 'السيد أحمد قرفي (مسؤول الميكنة)',
        status: 'pending'
      }
    ]
  },

  // WEEK 38 (Previous Week: 14 - 20 September 2026)
  {
    reportId: 'SOL-RPT-2026-W38-MILA',
    weekNumber: 38,
    year: 2026,
    startDate: '2026-09-14',
    endDate: '2026-09-20',
    generatedDate: '2026-09-20 09:00:00',
    estateName: 'مستثمرة ميلة الفلاحية النموذجية',
    estateRegion: 'حوض سد بني هارون • ولاية ميلة، الجزائر',
    estateHectares: 142.5,
    supervisingAgronomist: {
      name: 'د. سليم بن عثمان (Dr. Salim Ben Othman)',
      title: 'كبير المهندسين الزراعيين ورئيس مصلحة الوقاية النباتية والإنتاج الحيواني',
      licenseNumber: 'AGR-DZ-MILA-2016/0942',
      digitalSignatureHash: 'SHA256:5a3c189b21f008e7c10bca78219472de981240adcb319082'
    },
    overallAgronomicScore: 91.5,
    overallRatingLabel: 'أداء زراعي متميز (A)',
    executiveSummary: `تميز الأسبوع 38 بارتفاع طفيف في درجات الحرارة ترافق مع نشاط رياح شمالية شرقية جافة. تم تفعيل استراتيجية الري التبريدي الجزئي لحماية أزهار الحمضيات وتثبيت الحمل الزيتوني. سجل قطيع الأبقار زيادة في استهلاك المياه بنسبة 12% قابلها حفاظ تام على إنتاج الحليب فوق 3,400 لتر/يوم. تم ضبط استهلاك الديزل عند 214 لتراً تضمنت عمليات تمشيط ومقاومة أعشاب ضارة بحقول الأربيكينا.`,
    weatherSummary: {
      avgTemperatureC: 26.8,
      rainfallAccumulatedMm: 0.0,
      et0ReferenceMm: 5.1,
      solarRadiationAvg: '20.1 ميغاجول/م²'
    },
    treeHealthSection: {
      totalTrees: 4250,
      healthyCount: 3790,
      needsAttentionCount: 340,
      diseasedCount: 120,
      overallHealthPct: 89.1,
      avgNdviScore: 0.82,
      parcels: [
        {
          parcelId: 'pcl-01',
          parcelName: 'Grove Alpha (Ancient Centenarians)',
          arabicName: 'بستان ألفا (الشملالي العتيق)',
          cropVariety: 'زيتون شملالي عتيق (14 سنة)',
          treeCount: 1200,
          healthScorePct: 95.8,
          ndviVigorIndex: 0.87,
          avgSoilMoisturePct: 39.0,
          waterAppliedM3: 84.0,
          waterDeficitM3: 0.0,
          fertilizerNpkKg: 40.0,
          activeTreatments: 'مراقبة بصرية دورية بعد التقليم',
          status: 'optimal'
        },
        {
          parcelId: 'pcl-02',
          parcelName: 'Grove Beta (Modern High-Yield)',
          arabicName: 'بستان بيتا (البيشولين المكثف)',
          cropVariety: 'زيتون بيشولين عالي الكثافة (8 سنوات)',
          treeCount: 1450,
          healthScorePct: 80.5,
          ndviVigorIndex: 0.72,
          avgSoilMoisturePct: 22.0,
          waterAppliedM3: 95.0,
          waterDeficitM3: 25.0,
          fertilizerNpkKg: 65.0,
          activeTreatments: 'تشخيص أولي للذبول الفرتيسيليومي في 12 شجرة',
          status: 'critical'
        },
        {
          parcelId: 'pcl-03',
          parcelName: 'Grove Gamma (Hedgerow)',
          arabicName: 'بستان غاما (الأربيكينا المسوّر)',
          cropVariety: 'زيتون أربيكينا فائق الكثافة (5 سنوات)',
          treeCount: 950,
          healthScorePct: 93.5,
          ndviVigorIndex: 0.85,
          avgSoilMoisturePct: 38.0,
          waterAppliedM3: 45.0,
          waterDeficitM3: 0.0,
          fertilizerNpkKg: 32.0,
          activeTreatments: 'عزق ميكانيكي بين الخطوط لمنع التنافس على الرطوبة',
          status: 'optimal'
        },
        {
          parcelId: 'pcl-04',
          parcelName: 'Fig Plantation West Terrace',
          arabicName: 'مدرجات التين السلطاني الغربية',
          cropVariety: 'تين سلطاني عسلي محلي (10 سنوات)',
          treeCount: 380,
          healthScorePct: 89.2,
          ndviVigorIndex: 0.80,
          avgSoilMoisturePct: 29.0,
          waterAppliedM3: 48.0,
          waterDeficitM3: 0.0,
          fertilizerNpkKg: 25.0,
          activeTreatments: 'تغذية ورقية بالزنك والبورون',
          status: 'optimal'
        },
        {
          parcelId: 'pcl-05',
          parcelName: 'Citrus Orchard South Valley',
          arabicName: 'بستان الحمضيات (البرتقال المالطي)',
          cropVariety: 'برتقال مالطي وكليمونتين ميلة (7 سنوات)',
          treeCount: 270,
          healthScorePct: 90.0,
          ndviVigorIndex: 0.81,
          avgSoilMoisturePct: 43.0,
          waterAppliedM3: 40.0,
          waterDeficitM3: 0.0,
          fertilizerNpkKg: 30.0,
          activeTreatments: 'تنظيف قنوات السقي الفرعية',
          status: 'optimal'
        }
      ],
      phytosanitaryInterventions: [
        {
          id: 'phyto-38-01',
          date: '2026-09-16',
          parcelZone: 'بستان غاما (الأربيكينا)',
          targetPathogen: 'حشرة العثة القطنية (Euphyllura olivina)',
          treatmentProduct: 'صابون بوتاسي عضوي + زيت كولزا نقي',
          dosage: '1.5 لتر / 100 لتر ماء',
          applicationMethod: 'رش ورقي منخفض الضغط',
          agronomistApproval: 'تم القضاء على البؤر بنجاح',
          status: 'completed'
        }
      ]
    },
    livestockSection: {
      totalLivestock: 680,
      cattleCount: 220,
      sheepCount: 460,
      avgDailyGainGrams: 465,
      totalFlockGainKg: 2690,
      avgBcsScore: 3.7,
      dailyMilkYieldLiters: 3410,
      veterinaryCompliancePct: 98,
      animals: [
        {
          id: 'lstk-001',
          tagRfid: 'RFID-CTL-9021',
          nameOrAlias: 'بيلا بريما (Bella Prima)',
          species: 'cattle',
          breed: 'هولشتاين فريزيان نقية (Holstein)',
          pastureZone: 'مرعى المروج الخضراء - القطاع 1',
          previousWeightKg: 638.0,
          currentWeightKg: 641.5,
          weightChangeKg: 3.5,
          weightChangePct: 0.55,
          adgGramsDay: 500,
          bodyConditionScore: 3.6,
          healthCondition: 'مدرّة للحليب',
          yieldInfo: '29.1 لتر/يوم'
        },
        {
          id: 'lstk-002',
          tagRfid: 'RFID-SHP-3084',
          nameOrAlias: 'سلطان عواسي (Sultan Awassi)',
          species: 'sheep',
          breed: 'سلالة العواسي المحسنة',
          pastureZone: 'مراعي التلال الشرقية B',
          previousWeightKg: 84.0,
          currentWeightKg: 86.1,
          weightChangeKg: 2.1,
          weightChangePct: 2.50,
          adgGramsDay: 300,
          bodyConditionScore: 4.0,
          healthCondition: 'سليم ومرعى طبيعي',
          yieldInfo: 'مؤشر نمو صوفي قياسي'
        }
      ],
      feedEfficiencySummary: `تم توزيع 3.9 طن من الفصة الخضراء وحصص مركزة للمجترات. أظهرت الفحوصات الطفيلية الدورية خلو القطيع من الديدان الرئوية والمعوية.`
    },
    resourceEfficiencySection: {
      totalWaterM3: 312.0,
      totalFertilizerKg: 192.0,
      totalDieselLiters: 214.0,
      totalOperatingHours: 46.5,
      totalOperatingCostDzd: 13580,
      overallEfficiencyIndex: 91.5,
      carbonOffsetKgCo2: 385,
      metrics: [
        {
          resourceType: 'water',
          nameArabic: 'مياه الري التنبؤي (حوض بني هارون)',
          totalConsumed: 312.0,
          unit: 'م³',
          targetBenchmark: 420.0,
          efficiencyPct: 94.0,
          savingsVsBaseline: 108.0,
          savingsUnit: 'م³ وفر',
          costDzd: 3120,
          costPerHectareDzd: 21.9,
          carbonImpactKgCo2: 37.4,
          statusNote: 'وفر 25.7% مع موجة حرارة خفيفة'
        },
        {
          resourceType: 'fertilizer',
          nameArabic: 'الأسمدة التسميدية',
          totalConsumed: 192.0,
          unit: 'كغ',
          targetBenchmark: 230.0,
          efficiencyPct: 91.0,
          savingsVsBaseline: 38.0,
          savingsUnit: 'كغ وفر',
          costDzd: 3840,
          costPerHectareDzd: 26.9,
          carbonImpactKgCo2: 76.8,
          statusNote: 'تركيز على الفوسفور والبوتاسيوم'
        },
        {
          resourceType: 'diesel',
          nameArabic: 'وقود الديزل',
          totalConsumed: 214.0,
          unit: 'لتر',
          targetBenchmark: 250.0,
          efficiencyPct: 89.5,
          savingsVsBaseline: 36.0,
          savingsUnit: 'لتر وقود',
          costDzd: 10700,
          costPerHectareDzd: 75.1,
          carbonImpactKgCo2: 567.1,
          statusNote: 'استهلاك معتدل مع عمليات العزق الميكانيكي'
        }
      ]
    },
    actionItems: [
      {
        id: 'act-38-01',
        priority: 'high',
        category: 'tree_health',
        title: 'فحص بؤر الفرتيسيليوم في بستان بيتا',
        description: 'عزل الأشجار المشتبه بإصابتها وتعقيم مقصات التقليم فورياً.',
        targetParcelOrSector: 'بستان بيتا (البيشولين)',
        deadlineDate: '2026-09-22',
        assignedEngineer: 'د. سليم بن عثمان',
        status: 'completed'
      }
    ]
  }
];

/**
 * Generates an up-to-date weekly agronomic summary from active application state.
 */
export function buildDynamicWeeklySummary(
  farm: Farm,
  trees: Tree[],
  livestock: LivestockAnimal[],
  consumptionLogs: ResourceConsumptionLog[],
  weekOffset: number = 0
): WeeklyAgronomicReport {
  // If requesting previous week
  if (weekOffset === 1 && HISTORICAL_WEEKLY_REPORTS[1]) {
    return HISTORICAL_WEEKLY_REPORTS[1];
  }

  // Base on current week 39
  const baseReport = HISTORICAL_WEEKLY_REPORTS[0];

  // Dynamically compute live figures from current trees
  const totalTrees = trees.length > 0 ? trees.length : farm.totalTrees;
  const healthyCount = trees.filter((t) => t.healthStatus === 'healthy').length;
  const attentionCount = trees.filter((t) => t.healthStatus === 'needs_attention').length;
  const diseasedCount = trees.filter((t) => t.healthStatus === 'diseased').length;

  const totalCalculated = healthyCount + attentionCount + diseasedCount;
  const healthPct = totalCalculated > 0 ? Math.round((healthyCount / totalCalculated) * 1000) / 10 : 89.9;

  // Compute resource consumption totals from actual logs
  let totalWater = 0;
  let totalFertilizer = 0;
  let totalDiesel = 0;
  let totalHours = 0;
  let totalCost = 0;

  consumptionLogs.forEach((log) => {
    totalWater += Number(log.waterM3) || 0;
    totalFertilizer += Number(log.fertilizerKg) || 0;
    totalDiesel += Number(log.dieselLiters) || 0;
    totalHours += Number(log.operatingHours) || 0;
    totalCost += Number(log.costDzd) || 0;
  });

  // Calculate live livestock weight changes from livestock array
  const liveAnimalRecords = livestock.slice(0, 8).map((animal) => {
    const history = animal.weightHistory || [];
    const prevWeight = history.length > 1 ? history[history.length - 2].weightKg : animal.currentWeightKg - 2.5;
    const diff = Math.round((animal.currentWeightKg - prevWeight) * 10) / 10;
    const pct = prevWeight > 0 ? Math.round((diff / prevWeight) * 1000) / 10 : 0;
    const adg = Math.round((diff / 7) * 1000); // 7 days in grams

    return {
      id: animal.id,
      tagRfid: animal.tagRfid,
      nameOrAlias: animal.nameOrAlias,
      species: animal.species,
      breed: animal.breed,
      pastureZone: animal.pastureZone,
      previousWeightKg: prevWeight,
      currentWeightKg: animal.currentWeightKg,
      weightChangeKg: diff,
      weightChangePct: pct,
      adgGramsDay: adg > 0 ? adg : 350,
      bodyConditionScore: animal.species === 'cattle' ? 3.8 : 4.0,
      healthCondition: animal.healthCondition,
      yieldInfo: animal.yieldMetric ? `${animal.currentYieldValue} ${animal.yieldUnit}` : undefined
    };
  });

  return {
    ...baseReport,
    estateName: farm.name || baseReport.estateName,
    estateRegion: `${farm.region} • ${farm.country}`,
    estateHectares: farm.areaHectares || baseReport.estateHectares,
    treeHealthSection: {
      ...baseReport.treeHealthSection,
      totalTrees: farm.totalTrees || totalTrees,
      healthyCount: farm.healthyTrees || healthyCount,
      needsAttentionCount: farm.needsAttentionTrees || attentionCount,
      diseasedCount: farm.diseasedTrees || diseasedCount,
      overallHealthPct: healthPct
    },
    livestockSection: {
      ...baseReport.livestockSection,
      totalLivestock: farm.totalLivestock || baseReport.livestockSection.totalLivestock,
      cattleCount: farm.cattleCount || baseReport.livestockSection.cattleCount,
      sheepCount: farm.sheepCount || baseReport.livestockSection.sheepCount,
      animals: liveAnimalRecords.length > 0 ? liveAnimalRecords : baseReport.livestockSection.animals
    },
    resourceEfficiencySection: {
      ...baseReport.resourceEfficiencySection,
      totalWaterM3: totalWater > 0 ? Math.round(totalWater * 10) / 10 : baseReport.resourceEfficiencySection.totalWaterM3,
      totalFertilizerKg: totalFertilizer > 0 ? Math.round(totalFertilizer * 10) / 10 : baseReport.resourceEfficiencySection.totalFertilizerKg,
      totalDieselLiters: totalDiesel > 0 ? Math.round(totalDiesel * 10) / 10 : baseReport.resourceEfficiencySection.totalDieselLiters,
      totalOperatingHours: totalHours > 0 ? Math.round(totalHours * 10) / 10 : baseReport.resourceEfficiencySection.totalOperatingHours,
      totalOperatingCostDzd: totalCost > 0 ? Math.round(totalCost) : baseReport.resourceEfficiencySection.totalOperatingCostDzd
    }
  };
}
