/// ============================================================================
/// SOL ECOSYSTEM - API ENDPOINTS CONSTANTS
/// File: lib/core/constants/api_endpoints.dart
/// Architectural Layer: Core / Constants
/// ============================================================================
abstract class ApiEndpoints {
  /// Production Backend Base URL
  static const String baseUrl = 'https://soleco1.onrender.com/api/v1';

  /// Local Development / Android Emulator Fallback
  static const String emulatorBaseUrl = 'http://10.0.2.2:5000/api/v1';
  static const String webLocalBaseUrl = 'http://localhost:5000/api/v1';

  // Farm Overview & Telemetry
  static const String farms = '/farms';
  static String farmDetails(String farmId) => '/farms/$farmId';
  static const String defaultFarmId = 'SOL-FARM-DZ-MILA-01';

  // Smart Orchard & Trees
  static const String trees = '/trees';
  static String treeDetails(String treeId) => '/trees/$treeId';

  // AI Diagnostic Vision
  static const String aiDiagnose = '/ai/diagnose';

  // Livestock & RFID Herd Management
  static const String livestock = '/livestock';
  static String animalDetails(String animalId) => '/livestock/$animalId';

  // Traceability & Batch Passports
  static const String traceabilityBatches = '/traceability/batches';
  static String batchPassport(String batchCode) => '/traceability/public/$batchCode';
}
