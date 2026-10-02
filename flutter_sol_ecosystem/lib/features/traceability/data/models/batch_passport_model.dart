/// ============================================================================
/// SOL ECOSYSTEM - BATCH PASSPORT MODEL
/// File: lib/features/traceability/data/models/batch_passport_model.dart
/// Architectural Layer: Data / Models
/// Context: Farm-to-Fork Digital Product Passport (Mila Basin Bio-Agriculture)
/// ============================================================================
class BatchPassportModel {
  final String batchCode;
  final String productName;
  final String harvestDate;
  final String origin;
  final String acidityLevel;
  final String polyphenols;
  final String extractionMethod;
  final String blockchainSeal;
  final String qrPayload;

  const BatchPassportModel({
    required this.batchCode,
    required this.productName,
    required this.harvestDate,
    required this.origin,
    required this.acidityLevel,
    required this.polyphenols,
    required this.extractionMethod,
    required this.blockchainSeal,
    required this.qrPayload,
  });

  factory BatchPassportModel.fromJson(Map<String, dynamic> json) {
    final code = json['batchCode']?.toString() ?? json['id']?.toString() ?? 'SOL-EVOO-DZ-2026-08';
    return BatchPassportModel(
      batchCode: code,
      productName: json['productName']?.toString() ?? 'SOL Reserve Extra Virgin Olive Oil (زيت زيتون بكر ممتاز)',
      harvestDate: json['harvestDate']?.toString() ?? '2025-11-20',
      origin: json['origin']?.toString() ?? 'Mila Basin Parcel Alpha (حوض ميلة - الحقل أ)',
      acidityLevel: json['acidityLevel']?.toString() ?? '0.18% (Ultra-Low Acidity)',
      polyphenols: json['polyphenols']?.toString() ?? '540 mg/kg (High Antioxidants)',
      extractionMethod: json['extractionMethod']?.toString() ?? 'Cold-extracted at 22°C within 6h (عصر على البارد)',
      blockchainSeal: json['blockchainSeal']?.toString() ?? 'Verified Ethereum / Polygon L2 Immutable Hash',
      qrPayload: json['qrPayload']?.toString() ?? 'https://soleco1.onrender.com/passport/$code',
    );
  }

  factory BatchPassportModel.defaultOliveOil() {
    return const BatchPassportModel(
      batchCode: 'SOL-EVOO-DZ-2026-08',
      productName: 'SOL Reserve Extra Virgin Olive Oil (زيت زيتون بكر ممتاز)',
      harvestDate: '2025-11-20',
      origin: 'Mila Basin Parcel Alpha • حوض ميلة الزراعي',
      acidityLevel: '0.18% (Ultra-Low Acidity / حموضة منخفضة جداً)',
      polyphenols: '540 mg/kg (High Antioxidants / غني بمضادات الأكسدة)',
      extractionMethod: 'Cold-extracted at 22°C within 6h (عصر ميكانيكي على البارد)',
      blockchainSeal: 'Verified Polygon L2 • 0x8f4c...3e12',
      qrPayload: 'https://soleco1.onrender.com/passport/SOL-EVOO-DZ-2026-08',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'batchCode': batchCode,
      'productName': productName,
      'harvestDate': harvestDate,
      'origin': origin,
      'acidityLevel': acidityLevel,
      'polyphenols': polyphenols,
      'extractionMethod': extractionMethod,
      'blockchainSeal': blockchainSeal,
      'qrPayload': qrPayload,
    };
  }
}
