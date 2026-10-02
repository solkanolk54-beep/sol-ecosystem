import 'package:flutter/material.dart';
import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../../data/models/farm_model.dart';

/// ============================================================================
/// SOL ECOSYSTEM - FARM DASHBOARD PROVIDER
/// File: lib/features/farm_overview/presentation/providers/farm_dashboard_provider.dart
/// Architectural Layer: Presentation / Providers
/// Features: State management for Farm Telemetry, AI Diagnosis, and Arabic RTL Localization
/// ============================================================================
class FarmDashboardProvider extends ChangeNotifier {
  final ApiClient _apiClient;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  // Language & RTL State (Defaults to Arabic for Algerian Agronomic context - Mila Basin)
  bool _isArabic = true;
  bool get isArabic => _isArabic;
  TextDirection get textDirection => _isArabic ? TextDirection.rtl : TextDirection.ltr;

  void toggleLanguage() {
    _isArabic = !_isArabic;
    notifyListeners();
  }

  void setLanguage(bool isAr) {
    _isArabic = isAr;
    notifyListeners();
  }

  // ==========================================================================
  // ARABIC LOCALIZATION DICTIONARY (Algerian Agronomic Context - Mila Basin)
  // ==========================================================================
  static const Map<String, String> arabicStrings = {
    // App Bar & Main Titles
    'appTitle': 'منظومة SOL الرقمية',
    'appSubtitle': 'مستثمرة ميلة الفلاحية • حوض بني هارون',
    'locationSubtitle': 'ميلة، الجزائر • حوض بني هارون',
    'estateAreaLabel': 'المساحة الإجمالية: 142.5 هكتار',
    'soilType': 'تربة طميية فيضية غنية وخصبة (حوض ميلة)',
    'weatherStatus': '24° م مشمس، شمالي غربي 12 كم/سا',

    // Key Telemetry Metrics
    'oliveTrees': 'أشجار الزيتون',
    'livestock': 'الثروة الحيوانية',
    'soilMoisture': 'رطوبة التربة',
    'totalTreesTracked': '4250 شجرة متابعة',
    'treesCountValue': '4250',
    'livestockCountValue': '680',
    'soilMoistureValue': '38.4%',

    // Quick AI Scan Banner
    'aiScanBannerTitle': 'الفحص السريع بالذكاء الاصطناعي',
    'aiScanSubtitle': 'التقط صورة للورقة للكشف المبكر عن عين الطاووس والآفات',
    'scanButton': 'فحص فوري',
    'analyzingText': 'جارٍ فحص أمراض الأوراق وتحليل العينة بالذكاء الاصطناعي...',

    // Module A: Smart Orchard Management
    'orchardModuleHeader': 'حالة الأشجار والمحاصيل (حقول الزيتون)',
    'orchardModuleSubtitle': 'حقول الزيتون (حوض ميلة الزراعي)',
    'canopyVigor': 'مؤشر حيوية المجموع الخضري والصحة',
    'treeStatusBreakdown': 'سليمة: 3820 | تحتاج عناية: 320 | مصابة: 110',
    'statusHealthy': 'سليمة',
    'statusAttention': 'تحتاج عناية',
    'statusDiseased': 'مصابة',

    // Module B: Livestock Herd Telemetry
    'livestockModuleHeader': 'سجل الثروة الحيوانية (الأبقار والأغنام)',
    'livestockModuleSubtitle': 'تتبع القطيع بالرقمنة وأطواق RFID',
    'cattleHerd': 'قطيع الأبقار',
    'cattleCount': '220 رأس',
    'cattleBreeds': 'سلالة هولشتاين ومونبليارد',
    'sheepFlock': 'قطيع الأغنام',
    'sheepCount': '460 رأس',
    'sheepBreeds': 'سلالة أولاد جلال الأصيلة',
    'vaccineNotice': 'تنبيه بيطري: جرعة التلقيح المعززة ضد الحمى القلاعية لـ 42 عجلة مبرمجة في 25 أوت.',

    // Module C: Traceability & Farm-to-Fork
    'traceabilityBanner': 'جواز السفر الرقمي للمنتج (تتبع الجودة QR)',
    'traceabilitySubtitle': 'شهادات المنشأ الرقمية لزيت الزيتون البكر الممتاز ولحوم أولاد جلال المسجلة.',

    // Dialogs & Actions
    'syncTooltip': 'مزامنة مع واجهة برمجة التطبيقات (API)',
    'syncing': 'جارٍ جلب البيانات الحية من خادم REST API...',
    'offlineWarning': 'وضع عدم الاتصال مفعل - البيانات المخزنة محلياً',
    'selectSpecimenSource': 'اختر مصدر عينة الفحص',
    'cameraOption': 'التقاط صورة عبر الكاميرا',
    'galleryOption': 'اختيار من معرض الصور',
    'aiDiagnosticResult': 'نتيجة التشخيص بالذكاء الاصطناعي',
    'matchPercentage': 'نسبة التطابق',
    'observedSymptoms': 'الأعراض المشخصة:',
    'treatmentProtocol': 'البروتوكول العلاجي الموصى به:',
    'acknowledgeButton': 'اعتماد البروتوكول وإدراجه بالسجل الصحي للمزرعة',
    'dossierSuccessMessage': 'تم تسجيل البروتوكول العلاجي بنجاح في السجل الصحي للمزرعة.',
    'diagnosticFailed': 'تعذر إتمام الفحص بالذكاء الاصطناعي: ',
    'soilLabel': 'التربة:',
  };

  // English Fallback Strings
  static const Map<String, String> englishStrings = {
    'appTitle': 'SOL ECOSYSTEM',
    'appSubtitle': 'Mila Agro-Industrial Basin • Beni Haroun',
    'locationSubtitle': 'Mila, Algeria • Beni Haroun Basin',
    'estateAreaLabel': 'Total Estate Area: 142.5 Hectares',
    'soilType': 'Rich Silty Loam & Agricultural Alluvial Soil',
    'weatherStatus': '24°C Sunny, NW 12 km/h',
    'oliveTrees': 'Olive Trees',
    'livestock': 'Livestock',
    'soilMoisture': 'Soil Moisture',
    'totalTreesTracked': '4250 Trees Tracked',
    'treesCountValue': '4250',
    'livestockCountValue': '680',
    'soilMoistureValue': '38.4%',
    'aiScanBannerTitle': 'Quick AI Leaf & Fruit Scan',
    'aiScanSubtitle': 'Capture foliage to detect peacock spot & anthracnose.',
    'scanButton': 'Scan',
    'analyzingText': 'Analyzing leaf pathology via REST API...',
    'orchardModuleHeader': 'Smart Orchard Management (Olive Groves)',
    'orchardModuleSubtitle': 'Olive Trees (Mila Basins)',
    'canopyVigor': 'Canopy Vigor & Health Status',
    'treeStatusBreakdown': 'Healthy: 3820 | Attention: 320 | Diseased: 110',
    'statusHealthy': 'Healthy',
    'statusAttention': 'Needs Attention',
    'statusDiseased': 'Diseased',
    'livestockModuleHeader': 'Livestock Herd Telemetry (Cattle & Sheep)',
    'livestockModuleSubtitle': 'Cattle & Sheep Tracking via RFID',
    'cattleHerd': 'Cattle Herd',
    'cattleCount': '220 Heads',
    'cattleBreeds': 'Holstein & Montbeliarde',
    'sheepFlock': 'Sheep Flock',
    'sheepCount': '460 Heads',
    'sheepBreeds': 'Ouled Djellal Heritage',
    'vaccineNotice': 'Veterinary notice: Foot-and-Mouth booster scheduled for 42 heifers on August 25th.',
    'traceabilityBanner': 'Digital Product Passport (Quality QR Traceability)',
    'traceabilitySubtitle': 'Consumer passports for EVOO & Ouled Djellal lamb cuts.',
    'syncTooltip': 'Sync with Backend API',
    'syncing': 'Fetching telemetry from Node.js REST API...',
    'offlineWarning': 'Local offline cache active',
    'selectSpecimenSource': 'Select Specimen Source',
    'cameraOption': 'Capture with Camera',
    'galleryOption': 'Choose from Photo Gallery',
    'aiDiagnosticResult': 'AI Diagnostic Result',
    'matchPercentage': 'Match',
    'observedSymptoms': 'Observed Symptoms:',
    'treatmentProtocol': 'Recommended Treatment Protocol:',
    'acknowledgeButton': 'Acknowledge & Log to Farm Dossier',
    'dossierSuccessMessage': 'Treatment protocol logged to Farm Health Dossier.',
    'diagnosticFailed': 'AI Diagnostic failed: ',
    'soilLabel': 'Soil:',
  };

  /// Returns localized string according to current active language
  String tr(String key) {
    if (_isArabic) {
      return arabicStrings[key] ?? key;
    }
    return englishStrings[key] ?? key;
  }

  // Farm Summary Model State (Mila, Algeria - Beni Haroun Basin)
  Map<String, dynamic> _farmData = FarmModel.initial().toMap();
  Map<String, dynamic> get farmData => _farmData;

  // Trees List State
  List<dynamic> _trees = [];
  List<dynamic> get trees => _trees;

  // AI Diagnostic State
  bool _isDiagnosing = false;
  bool get isDiagnosing => _isDiagnosing;

  Map<String, dynamic>? _lastDiagnosis;
  Map<String, dynamic>? get lastDiagnosis => _lastDiagnosis;

  FarmDashboardProvider({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient();

  /// Loads live farm holding and trees rollup from Node.js REST API
  Future<void> loadFarmData() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // 1. Fetch Farm Data
      final liveFarm = await _apiClient.fetchFarmOverview(ApiEndpoints.defaultFarmId);
      if (liveFarm.isNotEmpty) {
        _farmData = {
          ..._farmData,
          ...liveFarm,
          'areaHectares': liveFarm['areaHectares'] ?? _farmData['areaHectares'],
          'treeCount': liveFarm['treeCount'] ?? _farmData['treeCount'],
          'healthyTreeCount': liveFarm['healthyTreeCount'] ?? _farmData['healthyTreeCount'],
          'attentionTreeCount': liveFarm['attentionTreeCount'] ?? _farmData['attentionTreeCount'],
          'diseasedTreeCount': liveFarm['diseasedTreeCount'] ?? _farmData['diseasedTreeCount'],
          'livestockCount': liveFarm['livestockCount'] ?? _farmData['livestockCount'],
        };
      }

      // 2. Fetch Trees
      final treeResponse = await _apiClient.fetchTrees();
      _trees = treeResponse['trees'] ?? [];
    } catch (e) {
      _errorMessage = e.toString();
      debugPrint('⚠️ [FarmDashboardProvider] API warning: $e - Retaining cached state.');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Triggers AI diagnosis by sending base64 image bytes to /api/ai/diagnose
  Future<Map<String, dynamic>> sendImageForAiDiagnosis(String base64Image) async {
    _isDiagnosing = true;
    notifyListeners();

    try {
      final result = await _apiClient.diagnoseLeaf(
        imageBase64: base64Image,
        cropSpecies: 'Olive',
      );
      _lastDiagnosis = result;
      return result;
    } catch (e) {
      debugPrint('❌ [FarmDashboardProvider] AI Diagnosis Error: $e');
      rethrow;
    } finally {
      _isDiagnosing = false;
      notifyListeners();
    }
  }
}

/// Backward compatibility alias so legacy code expecting FarmStateProvider works without any breakage
typedef FarmStateProvider = FarmDashboardProvider;
