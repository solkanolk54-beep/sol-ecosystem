import 'dart:convert';
import 'package:http/http.dart' as http;

/// ============================================================================
/// SOL ECOSYSTEM - API Service Layer
/// File: lib/core/services/api_service.dart
/// ============================================================================
class ApiService {
  // Configurable Base URL (defaults to localhost for Android Emulator: 10.0.2.2 or Web: localhost:5000)
  static const String defaultBaseUrl = 'http://10.0.2.2:5000/api';
  final String baseUrl;
  final http.Client _client;

  String? _authToken;

  ApiService({
    String? baseUrl,
    http.Client? client,
  })  : baseUrl = baseUrl ?? defaultBaseUrl,
        _client = client ?? http.Client();

  /// Sets bearer token after user authentication
  void setAuthToken(String token) {
    _authToken = token;
  }

  Map<String, String> _headers({bool requiresAuth = false}) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (requiresAuth && _authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  /// 1. Fetch Farm Holding Metadata & Dynamic Rollup
  /// GET /api/farms/:id
  Future<Map<String, dynamic>> fetchFarmOverview([String farmId = 'SOL-FARM-DZ-MILA-01']) async {
    final url = Uri.parse('$baseUrl/farms/$farmId');
    try {
      final response = await _client.get(url, headers: _headers());
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['farm'] ?? data;
      } else {
        throw ApiException('Failed to fetch farm data (${response.statusCode}): ${response.body}');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network connection error fetching farm overview: $e');
    }
  }

  /// 2. Fetch Trees with Filtering
  /// GET /api/trees?healthStatus=&species=
  Future<Map<String, dynamic>> fetchTrees({
    String? healthStatus,
    String? species,
    String? search,
  }) async {
    final queryParams = <String, String>{};
    if (healthStatus != null && healthStatus != 'all') queryParams['healthStatus'] = healthStatus;
    if (species != null && species != 'all') queryParams['species'] = species;
    if (search != null && search.isNotEmpty) queryParams['search'] = search;

    final url = Uri.parse('$baseUrl/trees').replace(queryParameters: queryParams.isNotEmpty ? queryParams : null);
    try {
      final response = await _client.get(url, headers: _headers());
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw ApiException('Failed to load trees (${response.statusCode})');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error fetching trees: $e');
    }
  }

  /// 3. AI Computer Vision Leaf Pathogen Diagnosis
  /// POST /api/ai/diagnose
  Future<Map<String, dynamic>> diagnoseLeaf({
    required String imageBase64,
    String cropSpecies = 'Olive',
    String? sampleTypeHint,
  }) async {
    final url = Uri.parse('$baseUrl/ai/diagnose');
    final payload = {
      'imageBase64': imageBase64,
      'cropSpecies': cropSpecies,
      if (sampleTypeHint != null) 'sampleType': sampleTypeHint,
    };

    try {
      final response = await _client.post(
        url,
        headers: _headers(),
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        return decoded['analysis'] ?? decoded;
      } else {
        throw ApiException('AI Diagnosis service error (${response.statusCode}): ${response.body}');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Failed to complete AI diagnostic scan: $e');
    }
  }

  /// 4. Public Batch Verification Passport
  /// GET /api/traceability/public/:batchCode
  Future<Map<String, dynamic>> fetchBatchPassport(String batchCode) async {
    final url = Uri.parse('$baseUrl/traceability/public/$batchCode');
    try {
      final response = await _client.get(url, headers: _headers());
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        return decoded['passport'] ?? decoded;
      } else {
        throw ApiException('Batch passport not found (${response.statusCode})');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error retrieving batch passport: $e');
    }
  }

  void dispose() {
    _client.close();
  }
}

/// Custom Exception wrapper for API errors
class ApiException implements Exception {
  final String message;
  ApiException(this.message);

  @override
  String toString() => message;
}
