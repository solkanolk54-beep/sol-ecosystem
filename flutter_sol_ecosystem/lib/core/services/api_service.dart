import '../network/api_client.dart';

/// ============================================================================
/// SOL ECOSYSTEM - API SERVICE ADAPTER (LEGACY COMPATIBILITY)
/// File: lib/core/services/api_service.dart
/// Architectural Layer: Core / Services -> Delegates to Core / Network / ApiClient
/// ============================================================================
class ApiService {
  final ApiClient _client;

  ApiService({
    String? baseUrl,
    ApiClient? client,
  }) : _client = client ?? ApiClient(baseUrl: baseUrl);

  void setAuthToken(String token) {
    _client.setAuthToken(token);
  }

  Future<Map<String, dynamic>> fetchFarmOverview([String farmId = 'SOL-FARM-DZ-MILA-01']) async {
    return _client.fetchFarmOverview(farmId);
  }

  Future<Map<String, dynamic>> fetchTrees({
    String? healthStatus,
    String? species,
    String? search,
  }) async {
    return _client.fetchTrees(
      healthStatus: healthStatus,
      species: species,
      search: search,
    );
  }

  Future<Map<String, dynamic>> diagnoseLeaf({
    required String imageBase64,
    String cropSpecies = 'Olive',
    String? sampleTypeHint,
  }) async {
    return _client.diagnoseLeaf(
      imageBase64: imageBase64,
      cropSpecies: cropSpecies,
      sampleTypeHint: sampleTypeHint,
    );
  }

  Future<Map<String, dynamic>> fetchBatchPassport(String batchCode) async {
    return _client.fetchBatchPassport(batchCode);
  }

  void dispose() {}
}

// Re-export ApiException for backwards compatibility
export '../network/api_client.dart' show ApiException;
