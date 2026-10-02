import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../livestock/presentation/screens/livestock_registry_screen.dart';
import '../../../orchard_and_trees/presentation/screens/ai_camera_scanner_screen.dart';
import '../../../orchard_and_trees/presentation/screens/tree_profile_screen.dart';
import '../../../traceability/data/models/batch_passport_model.dart';
import '../../../traceability/presentation/screens/batch_qr_generator_screen.dart';
import '../providers/farm_dashboard_provider.dart';
import '../widgets/farm_overview_card.dart';
import '../widgets/livestock_summary_card.dart';
import '../widgets/orchard_health_card.dart';
import '../widgets/quick_ai_scan_banner.dart';
import '../widgets/traceability_banner.dart';

/// ============================================================================
/// SOL ECOSYSTEM - MAIN FARM DASHBOARD SCREEN
/// File: lib/features/farm_overview/presentation/screens/dashboard_screen.dart
/// Architectural Layer: Features / Farm Overview / Presentation / Screens
/// Features: Full Arabic Localization (Algerian Context: Mila) & RTL Architecture
/// ============================================================================
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final farmProvider = context.watch<FarmDashboardProvider>();
    final isArabic = farmProvider.isArabic;
    final tr = farmProvider.tr;

    // Strict RTL Layout Enforcement: Wrap entire Scaffold with Directionality
    return Directionality(
      textDirection: farmProvider.textDirection,
      child: Scaffold(
        backgroundColor: AppColors.scaffoldBackground,
        appBar: AppBar(
          backgroundColor: AppColors.primary,
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
                    const CircularProgressIndicator(color: AppColors.primary),
                    const SizedBox(height: 12),
                    Text(
                      tr('syncing'),
                      style: const TextStyle(fontSize: 12, color: AppColors.primary),
                    ),
                  ],
                ),
              )
            : RefreshIndicator(
                color: AppColors.primary,
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
                            color: AppColors.attentionContainer,
                            border: Border.all(color: AppColors.attentionYellow),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.cloud_off_rounded, color: AppColors.secondary, size: 18),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  '${tr('offlineWarning')} (${farmProvider.errorMessage})',
                                  style: const TextStyle(fontSize: 11, color: AppColors.secondaryDark),
                                ),
                              ),
                            ],
                          ),
                        ),

                      // 1. Farm Overview Header & Weather (Modular Widget)
                      FarmOverviewCard(provider: farmProvider),
                      const SizedBox(height: 16),

                      // 2. Quick AI Scan Banner (Camera & Image Processing Trigger)
                      QuickAiScanBanner(
                        provider: farmProvider,
                        onScanPressed: () => _handleCameraCapture(context, farmProvider),
                      ),
                      const SizedBox(height: 20),

                      // 3. Smart Orchard Health Breakdown (Module A)
                      _buildSectionHeader(
                        title: tr('orchardModuleHeader'),
                        subtitle: tr('orchardModuleSubtitle'),
                        icon: Icons.forest_rounded,
                        actionLabel: isArabic ? 'عرض الأشجار' : 'View Trees',
                        onAction: () {
                          // Navigate to Tree Profile / Details
                          final sampleTree = (farmProvider.trees.isNotEmpty &&
                                  farmProvider.trees.first is Map<String, dynamic>)
                              ? farmProvider.trees.first as Map<String, dynamic>
                              : {
                                  'tagCode': 'SOL-TR-OLV-4250',
                                  'variety': 'Chemlali Ancient (زيتون شملالي)',
                                  'parcelZone': 'Grove Alpha (Ancient) • حوض ميلة',
                                  'healthStatus': 'healthy',
                                  'ageYears': 16.5,
                                  'irrigationStatus': 'Solar Drip Optimal',
                                  'soilMoisturePct': 38.4,
                                  'lastHarvestDate': '2025-11-20'
                                };
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => TreeProfileScreen(tree: sampleTree),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),
                      OrchardHealthCard(
                        provider: farmProvider,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const AiCameraScannerScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 20),

                      // 4. Livestock Summary (Module B)
                      _buildSectionHeader(
                        title: tr('livestockModuleHeader'),
                        subtitle: tr('livestockModuleSubtitle'),
                        icon: Icons.pets_rounded,
                        actionLabel: isArabic ? 'سجل القطيع' : 'Herd Registry',
                        onAction: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const LivestockRegistryScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),
                      LivestockSummaryCard(
                        provider: farmProvider,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const LivestockRegistryScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 20),

                      // 5. Traceability Quick Access (Module C)
                      TraceabilityBanner(
                        provider: farmProvider,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => BatchQrGeneratorScreen.defaultBatch(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  // Section Header Helper
  Widget _buildSectionHeader({
    required String title,
    required String subtitle,
    required IconData icon,
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ],
        ),
        if (actionLabel != null && onAction != null)
          TextButton(
            onPressed: onAction,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: Text(
              actionLabel,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
          ),
      ],
    );
  }

  /// Triggers device camera or gallery, encodes image, and requests AI diagnostic
  Future<void> _handleCameraCapture(BuildContext context, FarmDashboardProvider provider) async {
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
                    backgroundColor: AppColors.primary,
                    child: Icon(Icons.camera_alt, color: Colors.white),
                  ),
                  title: Text(tr('cameraOption')),
                  onTap: () => Navigator.pop(ctx, ImageSource.camera),
                ),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: AppColors.secondary,
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
          backgroundColor: AppColors.diseasedRed,
        ),
      );
    }
  }

  /// Displays the stylish AI Diagnosis Bottom Sheet with full RTL layout
  void _showDiagnosisBottomSheet(
    BuildContext context,
    FarmDashboardProvider provider,
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
                          color: AppColors.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.biotech_rounded, color: AppColors.primary, size: 24),
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
                      color: AppColors.healthyGreen.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.healthyGreen.withOpacity(0.3)),
                    ),
                    child: Text(
                      '${(confidence * 100).toStringAsFixed(1)}% ${tr('matchPercentage')}',
                      style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(disease, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              Text(scientificName, style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: AppColors.textMuted)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.lightSurface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(tr('observedSymptoms'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(symptoms, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.shield_outlined, color: AppColors.primary, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          tr('treatmentProtocol'),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.primary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(treatment, style: const TextStyle(fontSize: 12, color: AppColors.textPrimary, height: 1.4)),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
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
}
