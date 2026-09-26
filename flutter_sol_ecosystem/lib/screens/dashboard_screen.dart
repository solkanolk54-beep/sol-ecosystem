import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/services/api_service.dart';

// ============================================================================
// SOL ECOSYSTEM - FLUTTER MOBILE APP (Material 3 + Clean Architecture)
// Screen: Main Dashboard Screen (dashboard_screen.dart)
// Features: Full Arabic Localization (Algerian Agronomic Context) + RTL Layout
// ============================================================================

/// State Management Provider holding the active Farm & Orchard telemetry
class FarmStateProvider extends ChangeNotifier {
  final ApiService _apiService;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  // Language & RTL State (Defaults to Arabic for Algerian Agronomic context)
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
  Map<String, dynamic> _farmData = {
    'name': 'مستثمرة ميلة الفلاحية - حوض بني هارون',
    'code': 'SOL-FARM-DZ-MILA-01',
    'location': 'ميلة، الجزائر',
    'region': 'حوض بني هارون',
    'locationSubtitle': 'ميلة، الجزائر • حوض بني هارون',
    'estateAreaLabel': 'المساحة الإجمالية: 142.5 هكتار',
    'soilType': 'تربة طميية فيضية غنية وخصبة (حوض ميلة)',
    'areaHectares': 142.5,
    'treeCount': 4250,
    'healthyTreeCount': 3820,
    'attentionTreeCount': 320,
    'diseasedTreeCount': 110,
    'livestockCount': 680,
    'cattleCount': 220,
    'sheepCount': 460,
    'avgSoilMoisture': '38.4%',
    'weather': '24° م مشمس، شمالي غربي 12 كم/سا'
  };

  Map<String, dynamic> get farmData => _farmData;

  // Trees List State
  List<dynamic> _trees = [];
  List<dynamic> get trees => _trees;

  // AI Diagnostic State
  bool _isDiagnosing = false;
  bool get isDiagnosing => _isDiagnosing;

  Map<String, dynamic>? _lastDiagnosis;
  Map<String, dynamic>? get lastDiagnosis => _lastDiagnosis;

  FarmStateProvider({ApiService? apiService})
      : _apiService = apiService ?? ApiService();

  /// Loads live farm holding and trees rollup from Node.js REST API
  Future<void> loadFarmData() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // 1. Fetch Farm Data
      final liveFarm = await _apiService.fetchFarmOverview('SOL-FARM-DZ-MILA-01');
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

      // 2. Fetch Trees
      final treeResponse = await _apiService.fetchTrees();
      _trees = treeResponse['trees'] ?? [];
    } catch (e) {
      _errorMessage = e.toString();
      debugPrint('⚠️ [FarmStateProvider] API warning: $e - Retaining cached state.');
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
      final result = await _apiService.diagnoseLeaf(
        imageBase64: base64Image,
        cropSpecies: 'Olive',
      );
      _lastDiagnosis = result;
      return result;
    } catch (e) {
      debugPrint('❌ [FarmStateProvider] AI Diagnosis Error: $e');
      rethrow;
    } finally {
      _isDiagnosing = false;
      notifyListeners();
    }
  }
}

// ============================================================================
// MAIN DASHBOARD SCREEN (RTL + Material 3)
// ============================================================================

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final farmProvider = context.watch<FarmStateProvider>();
    final data = farmProvider.farmData;
    final isArabic = farmProvider.isArabic;
    final tr = farmProvider.tr;

    // Strict RTL Layout Enforcement: Wrap entire Scaffold with Directionality
    return Directionality(
      textDirection: farmProvider.textDirection,
      child: Scaffold(
        backgroundColor: const Color(0xFFF4F7F4),
        appBar: AppBar(
          backgroundColor: const Color(0xFF0F5132),
          foregroundColor: Colors.white,
          elevation: 0,
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.eco_rounded, color: Colors.white, size: 22),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tr('appTitle'),
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
                    Text(
                      tr('locationSubtitle'),
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.white.withOpacity(0.85),
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            // Language Switcher (Arabic <-> English toggle)
            TextButton.icon(
              onPressed: () => farmProvider.toggleLanguage(),
              icon: const Icon(Icons.translate_rounded, color: Colors.white, size: 16),
              label: Text(
                isArabic ? 'English' : 'عربي',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
              style: TextButton.styleFrom(
                backgroundColor: Colors.white.withOpacity(0.18),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
            ),
            const SizedBox(width: 4),
            IconButton(
              icon: const Icon(Icons.refresh_rounded),
              onPressed: () => farmProvider.loadFarmData(),
              tooltip: tr('syncTooltip'),
            ),
          ],
        ),
        body: farmProvider.isLoading
            ? Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircularProgressIndicator(color: Color(0xFF0F5132)),
                    const SizedBox(height: 12),
                    Text(
                      tr('syncing'),
                      style: const TextStyle(fontSize: 12, color: Color(0xFF0F5132)),
                    ),
                  ],
                ),
              )
            : RefreshIndicator(
                color: const Color(0xFF0F5132),
                onRefresh: () => farmProvider.loadFarmData(),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Offline/Cache Status Warning Banner if API error occurred
                      if (farmProvider.errorMessage != null)
                        Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            border: Border.all(color: const Color(0xFFF59E0B)),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.cloud_off_rounded, color: Color(0xFFD97706), size: 18),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  '${tr('offlineWarning')} (${farmProvider.errorMessage})',
                                  style: const TextStyle(fontSize: 11, color: Color(0xFF92400E)),
                                ),
                              ),
                            ],
                          ),
                        ),

                      // 1. Farm Overview Header & Weather
                      _buildFarmOverviewCard(context, farmProvider),
                      const SizedBox(height: 16),

                      // 2. Quick AI Scan Banner (Camera & Image Processing Trigger)
                      _buildQuickAiScanBanner(context, farmProvider),
                      const SizedBox(height: 20),

                      // 3. Smart Orchard Health Breakdown (Module A)
                      _buildSectionHeader(
                        tr('orchardModuleHeader'),
                        tr('orchardModuleSubtitle'),
                        Icons.forest_rounded,
                      ),
                      const SizedBox(height: 10),
                      _buildOrchardHealthCard(context, farmProvider),
                      const SizedBox(height: 20),

                      // 4. Livestock Summary (Module B)
                      _buildSectionHeader(
                        tr('livestockModuleHeader'),
                        tr('livestockModuleSubtitle'),
                        Icons.pets_rounded,
                      ),
                      const SizedBox(height: 10),
                      _buildLivestockSummaryCard(context, farmProvider),
                      const SizedBox(height: 20),

                      // 5. Traceability Quick Access (Module C)
                      _buildTraceabilityBanner(context, farmProvider),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  // Section Header Helper
  Widget _buildSectionHeader(String title, String subtitle, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF0F5132), size: 20),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1B2E20),
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
            ),
          ],
        ),
      ],
    );
  }

  /// 1. Dynamic Widget: Farm Overview & Key Telemetry Cards
  Widget _buildFarmOverviewCard(BuildContext context, FarmStateProvider provider) {
    final data = provider.farmData;
    final tr = provider.tr;

    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F5132), Color(0xFF165B37)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F5132).withOpacity(0.25),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.location_on_rounded, color: Color(0xFFC7E8CA), size: 15),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            tr('locationSubtitle'),
                            style: const TextStyle(
                              color: Color(0xFFC7E8CA),
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      tr('estateAreaLabel'),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 21,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${tr('soilLabel')} ${tr('soilType')}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.88),
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.wb_sunny_rounded, color: Colors.amberAccent, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      tr('weatherStatus'),
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white24, height: 1),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMetricTile(
                tr('oliveTrees'),
                '${data['treeCount'] ?? 4250}',
                Icons.yard_rounded,
              ),
              _buildMetricTile(
                tr('livestock'),
                '${data['livestockCount'] ?? 680}',
                Icons.agriculture_rounded,
              ),
              _buildMetricTile(
                tr('soilMoisture'),
                '${data['avgSoilMoisture'] ?? '38.4%'}',
                Icons.water_drop_rounded,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: const Color(0xFFC7E8CA), size: 15),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 11),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  /// 2. Interactive Feature: Quick AI Scan Banner with Image Picker Integration
  Widget _buildQuickAiScanBanner(BuildContext context, FarmStateProvider provider) {
    final tr = provider.tr;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF8B4513).withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: const Color(0xFF8B4513).withOpacity(0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: provider.isDiagnosing
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(color: Color(0xFF8B4513), strokeWidth: 2.5),
                  )
                : const Icon(Icons.document_scanner_rounded, color: Color(0xFF8B4513), size: 26),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tr('aiScanBannerTitle'),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B2E20),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  provider.isDiagnosing ? tr('analyzingText') : tr('aiScanSubtitle'),
                  style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton.icon(
            onPressed: provider.isDiagnosing ? null : () => _handleCameraCapture(context, provider),
            icon: const Icon(Icons.camera_alt_rounded, size: 16),
            label: Text(tr('scanButton')),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B4513),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  /// Triggers device camera or gallery, encodes image, and requests AI diagnostic
  Future<void> _handleCameraCapture(BuildContext context, FarmStateProvider provider) async {
    final picker = ImagePicker();
    final tr = provider.tr;

    // Show selection dialog between Camera and Gallery with RTL directionality
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Directionality(
        textDirection: provider.textDirection,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  tr('selectSpecimenSource'),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 16),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFF0F5132),
                    child: Icon(Icons.camera_alt, color: Colors.white),
                  ),
                  title: Text(tr('cameraOption')),
                  onTap: () => Navigator.pop(ctx, ImageSource.camera),
                ),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFF8B4513),
                    child: Icon(Icons.photo_library, color: Colors.white),
                  ),
                  title: Text(tr('galleryOption')),
                  onTap: () => Navigator.pop(ctx, ImageSource.gallery),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    if (source == null) return;

    try {
      final XFile? photo = await picker.pickImage(
        source: source,
        maxWidth: 1280,
        maxHeight: 1280,
        imageQuality: 85,
      );

      if (photo == null) return;

      // Encode image to Base64 payload
      final bytes = await File(photo.path).readAsBytes();
      final base64String = base64Encode(bytes);

      if (!context.mounted) return;

      // Call API
      final diagnosis = await provider.sendImageForAiDiagnosis(base64String);

      if (!context.mounted) return;
      // Display Stylish Modal Bottom Sheet with AI result in RTL
      _showDiagnosisBottomSheet(context, provider, diagnosis);
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${tr('diagnosticFailed')}$e'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  /// Displays the stylish AI Diagnosis Bottom Sheet with full RTL layout
  void _showDiagnosisBottomSheet(
    BuildContext context,
    FarmStateProvider provider,
    Map<String, dynamic> diagnosis,
  ) {
    final tr = provider.tr;
    final bool isAr = provider.isArabic;

    final String disease = diagnosis['disease'] ??
        (isAr ? 'تبقع عين الطاووس (Spilocaea oleagina)' : 'Olive Peacock Spot (Spilocaea oleagina)');
    final String scientificName = diagnosis['scientificName'] ?? 'Spilocaea oleagina / Cycloconium oleaginum';
    final double confidence = (diagnosis['confidence'] is num)
        ? (diagnosis['confidence'] as num).toDouble()
        : 0.948;
    final String symptoms = diagnosis['symptoms'] ??
        (isAr
            ? 'بقع دائرية رمادية محاطة بهالة صفراء داكنة على السطح العلوي لأوراق الزيتون.'
            : 'Circular concentric chlorotic lesions detected on upper leaf cuticle.');
    final String treatment = diagnosis['recommendedTreatment'] ??
        (isAr
            ? '1. الرش الوقائي بمركب هيدروكسيد النحاس بتركيز 250غ/100 لتر ماء بعد تساقط الأمطار.\n2. تقليم الفروع الداخلية لتهوية قلب الشجرة والحد من الرطوبة الفطرية.\n3. التخلص من الأوراق المتساقطة لكسر دورة حياة الفطر.'
            : 'Apply Copper Hydroxide spray (250g/100L) post-rain. Prune internal canopy twigs.');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Directionality(
        textDirection: provider.textDirection,
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F5132).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.biotech_rounded, color: Color(0xFF0F5132), size: 24),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        tr('aiDiagnosticResult'),
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                    ),
                    child: Text(
                      '${(confidence * 100).toStringAsFixed(1)}% ${tr('matchPercentage')}',
                      style: const TextStyle(color: Color(0xFF0F5132), fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(disease, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20))),
              Text(scientificName, style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Color(0xFF6B7280))),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9FBF8),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(tr('observedSymptoms'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(symptoms, style: const TextStyle(fontSize: 12, color: Color(0xFF374151), height: 1.4)),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F5132).withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF0F5132).withOpacity(0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.shield_outlined, color: Color(0xFF0F5132), size: 16),
                        const SizedBox(width: 6),
                        Text(
                          tr('treatmentProtocol'),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F5132)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(treatment, style: const TextStyle(fontSize: 12, color: Color(0xFF1B2E20), height: 1.4)),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F5132),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(tr('dossierSuccessMessage'))),
                    );
                  },
                  child: Text(tr('acknowledgeButton'), style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// 3. Dynamic Widget: Smart Orchard Health Breakdown (Module A)
  Widget _buildOrchardHealthCard(BuildContext context, FarmStateProvider provider) {
    final data = provider.farmData;
    final tr = provider.tr;

    final int healthy = data['healthyTreeCount'] ?? 3820;
    final int attention = data['attentionTreeCount'] ?? 320;
    final int diseased = data['diseasedTreeCount'] ?? 110;
    final int total = data['treeCount'] ?? 4250;

    final double healthyPct = (healthy / total) * 100;
    final double attentionPct = (attention / total) * 100;
    final double diseasedPct = (diseased / total) * 100;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                tr('canopyVigor'),
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20)),
              ),
              Text(
                '$total ${provider.isArabic ? "شجرة متابعة" : "Trees"}',
                style: const TextStyle(fontSize: 12, color: Color(0xFF0F5132), fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Prominent Tree Status Breakdown String
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FBF8),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(
              children: [
                const Icon(Icons.analytics_outlined, size: 15, color: Color(0xFF0F5132)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    tr('treeStatusBreakdown'),
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1B2E20),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Multi-Segmented Health Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              height: 12,
              child: Row(
                children: [
                  Expanded(flex: healthy, child: Container(color: const Color(0xFF10B981))),
                  Expanded(flex: attention, child: Container(color: const Color(0xFFF59E0B))),
                  Expanded(flex: diseased, child: Container(color: const Color(0xFFEF4444))),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildStatusPill(tr('statusHealthy'), healthy, healthyPct, const Color(0xFF10B981)),
              _buildStatusPill(tr('statusAttention'), attention, attentionPct, const Color(0xFFF59E0B)),
              _buildStatusPill(tr('statusDiseased'), diseased, diseasedPct, const Color(0xFFEF4444)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusPill(String title, int count, double pct, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.09),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
              const SizedBox(width: 6),
              Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '$count (${pct.toStringAsFixed(1)}%)',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20)),
          ),
        ],
      ),
    );
  }

  /// 4. Dynamic Widget: Livestock Summary (Module B)
  Widget _buildLivestockSummaryCard(BuildContext context, FarmStateProvider provider) {
    final data = provider.farmData;
    final tr = provider.tr;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildSpeciesTile(
                  tr('cattleHerd'),
                  '${data['cattleCount'] ?? 220} ${provider.isArabic ? "رأس" : "Heads"}',
                  tr('cattleBreeds'),
                  Icons.agriculture,
                  const Color(0xFF1E3A8A),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSpeciesTile(
                  tr('sheepFlock'),
                  '${data['sheepCount'] ?? 460} ${provider.isArabic ? "رأس" : "Heads"}',
                  tr('sheepBreeds'),
                  Icons.cruelty_free_rounded,
                  const Color(0xFF8B4513),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FBF8),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(
              children: [
                const Icon(Icons.vaccines_rounded, color: Color(0xFF0F5132), size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    tr('vaccineNotice'),
                    style: const TextStyle(fontSize: 11, color: Color(0xFF374151), height: 1.3),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpeciesTile(String title, String count, String breeds, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color)),
              Icon(icon, color: color, size: 18),
            ],
          ),
          const SizedBox(height: 6),
          Text(count, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF1B2E20))),
          Text(breeds, style: const TextStyle(fontSize: 10, color: Color(0xFF6B7280))),
        ],
      ),
    );
  }

  /// 5. Dynamic Widget: Traceability & Farm-to-Fork Banner (Module C)
  Widget _buildTraceabilityBanner(BuildContext context, FarmStateProvider provider) {
    final tr = provider.tr;
    final isArabic = provider.isArabic;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E3A8A).withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E3A8A).withOpacity(0.25)),
      ),
      child: Row(
        children: [
          const Icon(Icons.qr_code_2_rounded, size: 36, color: Color(0xFF1E3A8A)),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tr('traceabilityBanner'),
                  style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                ),
                const SizedBox(height: 3),
                Text(
                  tr('traceabilitySubtitle'),
                  style: const TextStyle(fontSize: 11, color: Color(0xFF4B5563), height: 1.3),
                ),
              ],
            ),
          ),
          // RTL-aware Chevron Icon: Points left in RTL, right in LTR
          Icon(
            isArabic ? Icons.arrow_back_ios_rounded : Icons.arrow_forward_ios_rounded,
            size: 16,
            color: const Color(0xFF1E3A8A),
          ),
        ],
      ),
    );
  }
}
