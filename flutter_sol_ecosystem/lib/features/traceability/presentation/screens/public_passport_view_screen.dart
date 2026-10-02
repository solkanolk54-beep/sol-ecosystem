import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../data/models/batch_passport_model.dart';

/// ============================================================================
/// SOL ECOSYSTEM - PUBLIC PASSPORT VIEW SCREEN
/// File: lib/features/traceability/presentation/screens/public_passport_view_screen.dart
/// Architectural Layer: Features / Traceability / Presentation / Screens
/// Context: Public verification portal for consumer authenticity checking
/// ============================================================================
class PublicPassportViewScreen extends StatelessWidget {
  final Map<String, dynamic> passportData;

  const PublicPassportViewScreen({
    super.key,
    required this.passportData,
  });

  factory PublicPassportViewScreen.fromModel(BatchPassportModel model) {
    return PublicPassportViewScreen(passportData: model.toMap());
  }

  @override
  Widget build(BuildContext context) {
    final batchCode = passportData['batchCode'] ?? 'SOL-EVOO-DZ-2026-08';
    final productName = passportData['productName'] ?? 'SOL Reserve Extra Virgin Olive Oil';
    final origin = passportData['origin'] ?? 'Mila Basin Parcel Alpha';
    final harvestDate = passportData['harvestDate'] ?? '2025-11-20';
    final acidity = passportData['acidityLevel'] ?? '0.18% (Ultra-Low Acidity)';
    final polyphenols = passportData['polyphenols'] ?? '540 mg/kg';
    final extraction = passportData['extractionMethod'] ?? 'Cold-extracted at 22°C';
    final seal = passportData['blockchainSeal'] ?? 'Verified Polygon L2';

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        title: const Text('Public Certificate of Origin (شهادة المنشأ)'),
        backgroundColor: AppColors.tertiary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Verified Badge Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.healthyContainer,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.healthyGreen.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.verified_rounded, color: AppColors.healthyGreen, size: 36),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          '100% Authenticity Verified (منتج موثق ومعتمد)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.primaryDark),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Originating from Certified Organic Parcels in Mila Basin.',
                          style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Product & Batch Specifications Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    productName,
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Batch ID: $batchCode',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.tertiary),
                  ),
                  const Divider(height: 24),
                  _buildQualityRow('Origin Parcel / الحقل الأصلي', origin),
                  _buildQualityRow('Harvest Date / تاريخ الجني', harvestDate),
                  _buildQualityRow('Acidity Level / نسبة الحموضة', acidity),
                  _buildQualityRow('Polyphenols / البوليفينول', polyphenols),
                  _buildQualityRow('Extraction Method / طريقة العصر', extraction),
                  _buildQualityRow('Blockchain Seal / الختم الرقمي', seal),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Agronomic Soil & Location Verification
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Agronomic Terroir (الخصائص الجغرافية والتربة)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textPrimary),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Region: Mila Province, Algeria (Beni Haroun Basin)\n'
                    'Soil: Silty Alluvial Loam rich in organic matter\n'
                    'Irrigation: Solar-powered drip irrigation via Mila watershed',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQualityRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
          ),
          const SizedBox(width: 8),
          Expanded(
            flex: 3,
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
