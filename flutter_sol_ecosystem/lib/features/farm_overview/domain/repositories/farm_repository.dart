import '../entities/farm_entity.dart';

/// ============================================================================
/// SOL ECOSYSTEM - FARM REPOSITORY CONTRACT (DOMAIN)
/// File: lib/features/farm_overview/domain/repositories/farm_repository.dart
/// Architectural Layer: Domain / Repositories
/// ============================================================================
abstract class FarmRepository {
  Future<FarmEntity> getFarmOverview(String farmId);
  Future<Map<String, dynamic>> sendImageForAiDiagnosis({
    required String imageBase64,
    String cropSpecies = 'Olive',
  });
}
