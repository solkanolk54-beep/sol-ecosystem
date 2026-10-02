import '../../../../core/network/api_client.dart';
import '../../domain/entities/farm_entity.dart';
import '../../domain/repositories/farm_repository.dart';
import '../models/farm_model.dart';

/// ============================================================================
/// SOL ECOSYSTEM - FARM REPOSITORY IMPLEMENTATION (DATA)
/// File: lib/features/farm_overview/data/repositories/farm_repository_impl.dart
/// Architectural Layer: Data / Repositories
/// ============================================================================
class FarmRepositoryImpl implements FarmRepository {
  final ApiClient _apiClient;

  FarmRepositoryImpl({required ApiClient apiClient}) : _apiClient = apiClient;

  @override
  Future<FarmEntity> getFarmOverview(String farmId) async {
    try {
      final responseData = await _apiClient.fetchFarmOverview(farmId);
      if (responseData.isNotEmpty) {
        return FarmModel.fromJson(responseData);
      }
      return FarmModel.initial();
    } catch (e) {
      // Return cached/initial state on error while rethrowing or propagating
      return FarmModel.initial();
    }
  }

  @override
  Future<Map<String, dynamic>> sendImageForAiDiagnosis({
    required String imageBase64,
    String cropSpecies = 'Olive',
  }) async {
    return await _apiClient.diagnoseLeaf(
      imageBase64: imageBase64,
      cropSpecies: cropSpecies,
    );
  }
}
