import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../../core/constants/app_colors.dart';
import '../../data/models/batch_passport_model.dart';
import 'public_passport_view_screen.dart';

/// ============================================================================
/// SOL ECOSYSTEM - BATCH QR GENERATOR & PASSPORT SCREEN
/// File: lib/features/traceability/presentation/screens/batch_qr_generator_screen.dart
/// Architectural Layer: Features / Traceability / Presentation / Screens
/// Context: Farm-to-Fork Batch QR Generator & Public Verification Screen
/// ============================================================================
class BatchQrGeneratorScreen extends StatelessWidget {
  final Map<String, dynamic> batchData;

  const BatchQrGeneratorScreen({
    super.key,
    required this.batchData,
  });

  /// Factory convenience for initializing with default olive oil batch if none provided
  factory BatchQrGeneratorScreen.defaultBatch() {
    return BatchQrGeneratorScreen(
      batchData: BatchPassportModel.defaultOliveOil().toMap(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String batchCode = batchData['batchCode'] ?? 'SOL-EVOO-DZ-2026-08';
    final String productName = batchData['productName'] ?? 'SOL Reserve Extra Virgin Olive Oil (زيت زيتون بكر ممتاز)';
    final String qrPayload = batchData['qrPayload'] ?? 'https://soleco1.onrender.com/passport/$batchCode';

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        title: const Text('Traceability & Product Passport (جواز السفر الرقمي)'),
        backgroundColor: AppColors.tertiary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // QR Code Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    productName,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.tertiary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      'Batch ID: $batchCode',
                      style: const TextStyle(color: AppColors.tertiary, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: QrImageView(
                      data: qrPayload,
                      version: QrVersions.auto,
                      size: 200.0,
                      foregroundColor: AppColors.tertiaryDark,
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'Scan with any smartphone camera to open public certification\nامسح الرمز بكاميرا أي هاتف ذكي للتحقق من شهادة المنشأ والجودة',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Public Quality Parameters View
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Certified Quality Parameters (المعايير المعتمدة)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: AppColors.textPrimary),
                      ),
                      TextButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => PublicPassportViewScreen(passportData: batchData),
                            ),
                          );
                        },
                        icon: const Icon(Icons.open_in_new, size: 14, color: AppColors.tertiary),
                        label: const Text('View Full View', style: TextStyle(fontSize: 11, color: AppColors.tertiary)),
                      ),
                    ],
                  ),
                  const Divider(height: 16),
                  _buildQualityRow('Harvest Date / تاريخ الجني', batchData['harvestDate'] ?? '2025-11-20'),
                  _buildQualityRow('Origin Parcel / الحقل', batchData['origin'] ?? 'Mila Basin Parcel Alpha (حوض ميلة)'),
                  _buildQualityRow('Acidity Level / الحموضة', batchData['acidityLevel'] ?? '0.18% (Ultra-Low Acidity)'),
                  _buildQualityRow('Polyphenols / مضادات الأكسدة', batchData['polyphenols'] ?? '540 mg/kg (High Antioxidants)'),
                  _buildQualityRow('Extraction Method / طريقة العصر', batchData['extractionMethod'] ?? 'Cold-extracted at 22°C within 6h'),
                  _buildQualityRow('Blockchain Seal / الختم الرقمي', batchData['blockchainSeal'] ?? 'Verified Polygon L2'),
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
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}

/// Backward compatibility alias so legacy code expecting TraceabilityScreen continues to work
typedef TraceabilityScreen = BatchQrGeneratorScreen;
