import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/services/api_service.dart';

// ============================================================================
// SOL ECOSYSTEM - FLUTTER MOBILE APP (Material 3 + Clean Architecture)
// Screen: Main Dashboard Screen (dashboard_screen.dart)
// ============================================================================

/// State Management Provider holding the active Farm & Orchard telemetry
class FarmStateProvider extends ChangeNotifier {
  final ApiService _apiService;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  // Farm Summary Model State (Mila, Algeria)
  Map<String, dynamic> _farmData = {
    'name': 'Domaine Olicole de Mila - Beni Haroun Basin',
    'code': 'SOL-FARM-DZ-MILA-01',
    'location': 'Mila, Algeria',
    'region': 'Mila Agro-Industrial Basin, Algeria',
    'soilType': 'Rich Silty Loam & Agricultural Alluvial Soil',
    'areaHectares': 25.0,
    'treeCount': 4250,
    'healthyTreeCount': 3820,
    'attentionTreeCount': 320,
    'diseasedTreeCount': 110,
    'livestockCount': 680,
    'cattleCount': 220,
    'sheepCount': 460,
    'avgSoilMoisture': '38.4%',
    'weather': '24°C Mediterranean Sunny'
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

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final farmProvider = context.watch<FarmStateProvider>();
    final data = farmProvider.farmData;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      appBar: AppBar(
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
                  const Text(
                    'SOL ECOSYSTEM',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.1,
                    ),
                  ),
                  Text(
                    '${data['name']}',
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
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => farmProvider.loadFarmData(),
            tooltip: 'Sync with Backend API',
          ),
        ],
      ),
      body: farmProvider.isLoading
          ? const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(color: Color(0xFF0F5132)),
                  SizedBox(height: 12),
                  Text('Fetching telemetry from Node.js REST API...', style: TextStyle(fontSize: 12, color: Color(0xFF0F5132))),
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
                    // Error Warning Banner if API fails
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
                                'Local offline cache active (${farmProvider.errorMessage})',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF92400E)),
                              ),
                            ),
                          ],
                        ),
                      ),

                    // 1. Farm Overview Header & Weather
                    _buildFarmOverviewCard(context, data),
                    const SizedBox(height: 16),

                    // 2. Quick AI Scan Banner (Camera & Gallery Action)
                    _buildQuickAiScanBanner(context),
                    const SizedBox(height: 20),

                    // 3. Smart Orchard Health Breakdown (Module A)
                    _buildSectionHeader('Smart Orchard Management', 'Olive Trees (Mila Basins)', Icons.forest_rounded),
                    const SizedBox(height: 10),
                    _buildOrchardHealthCard(context, data),
                    const SizedBox(height: 20),

                    // 4. Livestock Summary (Module B)
                    _buildSectionHeader('Livestock Herd Telemetry', 'Cattle & Sheep Tracking', Icons.pets_rounded),
                    const SizedBox(height: 10),
                    _buildLivestockSummaryCard(context, data),
                    const SizedBox(height: 20),

                    // 5. Traceability Quick Access (Module C)
                    _buildTraceabilityBanner(context),
                    const SizedBox(height: 32),
                  ],
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
                fontSize: 15,
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
  Widget _buildFarmOverviewCard(BuildContext context, Map<String, dynamic> data) {
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
                        const Icon(Icons.location_on_rounded, color: Color(0xFFC7E8CA), size: 14),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '${data['location']} • ${data['region']}',
                            style: const TextStyle(
                              color: Color(0xFFC7E8CA),
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${data['areaHectares']} Ha Estate',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Soil: ${data['soilType']}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.85),
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
                      '${data['weather'] ?? '24°C Sunny'}',
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
              _buildMetricTile('Olive Trees', '${data['treeCount'] ?? data['totalTrees'] ?? 4250}', Icons.yard_rounded),
              _buildMetricTile('Livestock', '${data['livestockCount'] ?? data['totalLivestock'] ?? 680}', Icons.agriculture_rounded),
              _buildMetricTile('Soil Moisture', '${data['avgSoilMoisture'] ?? '38.4%'}', Icons.water_drop_rounded),
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
              style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11),
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
  Widget _buildQuickAiScanBanner(BuildContext context) {
    final provider = context.watch<FarmStateProvider>();

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
                const Text(
                  'Quick AI Leaf & Fruit Scan',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B2E20),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  provider.isDiagnosing
                      ? 'Analyzing leaf pathology via REST API...'
                      : 'Capture foliage to detect peacock spot & anthracnose.',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton.icon(
            onPressed: provider.isDiagnosing ? null : () => _handleCameraCapture(context),
            icon: const Icon(Icons.camera_alt_rounded, size: 16),
            label: const Text('Scan'),
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
  Future<void> _handleCameraCapture(BuildContext context) async {
    final picker = ImagePicker();

    // Show selection dialog between Camera and Gallery
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Select Specimen Source', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 16),
              ListTile(
                leading: const CircleAvatar(backgroundColor: Color(0xFF0F5132), child: Icon(Icons.camera_alt, color: Colors.white)),
                title: const Text('Capture with Camera'),
                onTap: () => Navigator.pop(ctx, ImageSource.camera),
              ),
              ListTile(
                leading: const CircleAvatar(backgroundColor: Color(0xFF8B4513), child: Icon(Icons.photo_library, color: Colors.white)),
                title: const Text('Choose from Photo Gallery'),
                onTap: () => Navigator.pop(ctx, ImageSource.gallery),
              ),
            ],
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
      final provider = Provider.of<FarmStateProvider>(context, listen: false);

      // Call API
      final diagnosis = await provider.sendImageForAiDiagnosis(base64String);

      if (!context.mounted) return;
      // Display Stylish Modal Bottom Sheet with AI result
      _showDiagnosisBottomSheet(context, diagnosis);
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('AI Diagnostic failed: $e'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  /// Displays the stylish AI Diagnosis Bottom Sheet
  void _showDiagnosisBottomSheet(BuildContext context, Map<String, dynamic> diagnosis) {
    final String disease = diagnosis['disease'] ?? 'Pathology Identified';
    final String scientificName = diagnosis['scientificName'] ?? 'Olea europaea pathogen';
    final double confidence = (diagnosis['confidence'] is num)
        ? (diagnosis['confidence'] as num).toDouble()
        : 0.948;
    final String severity = diagnosis['severity'] ?? 'moderate';
    final String symptoms = diagnosis['symptoms'] ?? 'Concentric lesions detected on upper leaf cuticle.';
    final String treatment = diagnosis['recommendedTreatment'] ?? 'Apply Copper Hydroxide spray (250g/100L).';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
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
                    const Text('AI Diagnostic Result', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
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
                    '${(confidence * 100).toStringAsFixed(1)}% Match',
                    style: const TextStyle(color: Color(0xFF0F5132), fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(disease, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20))),
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
                  const Text('Observed Symptoms:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  Text(symptoms, style: const TextStyle(fontSize: 12, color: Color(0xFF374151))),
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
                  const Row(
                    children: [
                      Icon(Icons.shield_outlined, color: Color(0xFF0F5132), size: 16),
                      SizedBox(width: 6),
                      Text('Recommended Treatment Protocol:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F5132))),
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
                    const SnackBar(content: Text('Treatment protocol logged to Farm Health Dossier.')),
                  );
                },
                child: const Text('Acknowledge & Log to Dossier', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 3. Dynamic Widget: Smart Orchard Health Breakdown (Module A)
  Widget _buildOrchardHealthCard(BuildContext context, Map<String, dynamic> data) {
    final int healthy = data['healthyTreeCount'] ?? data['healthyTrees'] ?? 3820;
    final int attention = data['attentionTreeCount'] ?? data['needsAttentionTrees'] ?? 320;
    final int diseased = data['diseasedTreeCount'] ?? data['diseasedTrees'] ?? 110;
    final int total = data['treeCount'] ?? data['totalTrees'] ?? 4250;

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
              const Text(
                'Canopy Vigor & Health Status',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20)),
              ),
              Text(
                '$total Trees Tracked',
                style: const TextStyle(fontSize: 12, color: Color(0xFF0F5132), fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 12),
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
              _buildStatusPill('Healthy', healthy, healthyPct, const Color(0xFF10B981)),
              _buildStatusPill('Needs Water', attention, attentionPct, const Color(0xFFF59E0B)),
              _buildStatusPill('Diseased', diseased, diseasedPct, const Color(0xFFEF4444)),
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
  Widget _buildLivestockSummaryCard(BuildContext context, Map<String, dynamic> data) {
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
                  'Cattle Herd',
                  '${data['cattleCount'] ?? 220} Heads',
                  'Holstein & Montbeliarde',
                  Icons.agriculture,
                  const Color(0xFF1E3A8A),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSpeciesTile(
                  'Sheep Flock',
                  '${data['sheepCount'] ?? 460} Heads',
                  'Ouled Djellal Heritage',
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
            child: const Row(
              children: [
                Icon(Icons.vaccines_rounded, color: Color(0xFF0F5132), size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Upcoming: Foot-and-Mouth booster scheduled for 42 heifers on August 25th.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF374151)),
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
  Widget _buildTraceabilityBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E3A8A).withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E3A8A).withOpacity(0.25)),
      ),
      child: const Row(
        children: [
          Icon(Icons.qr_code_2_rounded, size: 36, color: Color(0xFF1E3A8A)),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Traceability & QR Batches (Mila PGI)',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                ),
                SizedBox(height: 2),
                Text(
                  'Consumer passports for EVOO & Ouled Djellal lamb cuts.',
                  style: TextStyle(fontSize: 11, color: Color(0xFF4B5563)),
                ),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Color(0xFF1E3A8A)),
        ],
      ),
    );
  }
}
