import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../constants/api_endpoints.dart';

/// ============================================================================
/// SOL ECOSYSTEM - ROBUST DIO NETWORK CLIENT
/// File: lib/core/network/api_client.dart
/// Architectural Layer: Core / Network
/// ============================================================================
class ApiClient {
  final Dio _dio;
  String? _authToken;

  ApiClient({
    String? baseUrl,
    Dio? dio,
  }) : _dio = dio ??
            Dio(
              BaseOptions(
                baseUrl: baseUrl ?? ApiEndpoints.baseUrl,
                connectTimeout: const Duration(seconds: 15),
                receiveTimeout: const Duration(seconds: 15),
                sendTimeout: const Duration(seconds: 15),
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
              ),
            ) {
    _setupInterceptors();
  }

  /// Configures standard network interceptors: Authentication, Logging, and Error Handling
  void _setupInterceptors() {
    _dio.interceptors.clear();

    // 1. Auth & Request Headers Interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_authToken != null && _authToken!.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $_authToken';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          return handler.next(response);
        },
        onError: (DioException error, handler) {
          final mappedError = _mapDioException(error);
          return handler.reject(
            DioException(
              requestOptions: error.requestOptions,
              response: error.response,
              type: error.type,
              error: mappedError,
              message: mappedError.message,
            ),
          );
        },
      ),
    );

    // 2. Logging Interceptor (Enabled in Debug Mode)
    if (kDebugMode) {
      _dio.interceptors.add(
        LogInterceptor(
          requestBody: true,
          responseBody: false,
          requestHeader: false,
          responseHeader: false,
          logPrint: (log) => debugPrint('📡 [SOL-API] $log'),
        ),
      );
    }
  }

  /// Sets authorization token after user sign-in
  void setAuthToken(String? token) {
    _authToken = token;
  }

  /// Exposes raw Dio instance if needed
  Dio get dio => _dio;

  // ===========================================================================
  // CORE HTTP VERBS
  // ===========================================================================

  /// Generic GET request
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _unwrapError(e);
    } catch (e) {
      throw ApiException(message: 'Unexpected network error: $e');
    }
  }

  /// Generic POST request
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _unwrapError(e);
    } catch (e) {
      throw ApiException(message: 'Unexpected network error: $e');
    }
  }

  /// Generic PUT request
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _unwrapError(e);
    } catch (e) {
      throw ApiException(message: 'Unexpected network error: $e');
    }
  }

  /// Generic DELETE request
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _unwrapError(e);
    } catch (e) {
      throw ApiException(message: 'Unexpected network error: $e');
    }
  }

  // ===========================================================================
  // DOMAIN-SPECIFIC HIGH-LEVEL METHODS
  // (Maintains 100% compatibility with existing screens and providers)
  // ===========================================================================

  /// 1. Fetch Farm Holding Metadata & Dynamic Rollup
  /// GET /farms/:id
  Future<Map<String, dynamic>> fetchFarmOverview([String farmId = ApiEndpoints.defaultFarmId]) async {
    try {
      final response = await get(ApiEndpoints.farmDetails(farmId));
      final dynamic body = response.data;
      if (body is Map<String, dynamic>) {
        return (body['farm'] is Map<String, dynamic>) ? body['farm'] as Map<String, dynamic> : body;
      }
      return <String, dynamic>{};
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to fetch farm overview: $e');
    }
  }

  /// 2. Fetch Trees with Filtering
  /// GET /trees?healthStatus=&species=&search=
  Future<Map<String, dynamic>> fetchTrees({
    String? healthStatus,
    String? species,
    String? search,
  }) async {
    final queryParams = <String, dynamic>{};
    if (healthStatus != null && healthStatus != 'all') queryParams['healthStatus'] = healthStatus;
    if (species != null && species != 'all') queryParams['species'] = species;
    if (search != null && search.isNotEmpty) queryParams['search'] = search;

    try {
      final response = await get(
        ApiEndpoints.trees,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      if (response.data is Map<String, dynamic>) {
        return response.data as Map<String, dynamic>;
      }
      return {'trees': response.data};
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load trees: $e');
    }
  }

  /// 3. AI Computer Vision Leaf Pathogen Diagnosis
  /// POST /ai/diagnose
  Future<Map<String, dynamic>> diagnoseLeaf({
    required String imageBase64,
    String cropSpecies = 'Olive',
    String? sampleTypeHint,
  }) async {
    final payload = {
      'imageBase64': imageBase64,
      'cropSpecies': cropSpecies,
      if (sampleTypeHint != null) 'sampleType': sampleTypeHint,
    };

    try {
      final response = await post(
        ApiEndpoints.aiDiagnose,
        data: payload,
      );
      if (response.data is Map<String, dynamic>) {
        final map = response.data as Map<String, dynamic>;
        return (map['analysis'] is Map<String, dynamic>)
            ? map['analysis'] as Map<String, dynamic>
            : map;
      }
      return <String, dynamic>{};
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to complete AI diagnostic scan: $e');
    }
  }

  /// 4. Public Batch Verification Passport
  /// GET /traceability/public/:batchCode
  Future<Map<String, dynamic>> fetchBatchPassport(String batchCode) async {
    try {
      final response = await get(ApiEndpoints.batchPassport(batchCode));
      if (response.data is Map<String, dynamic>) {
        final map = response.data as Map<String, dynamic>;
        return (map['passport'] is Map<String, dynamic>)
            ? map['passport'] as Map<String, dynamic>
            : map;
      }
      return <String, dynamic>{};
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to retrieve batch passport: $e');
    }
  }

  /// 5. Fetch Livestock Herd Registry
  /// GET /livestock?species=
  Future<List<dynamic>> fetchLivestock({String? species}) async {
    final queryParams = <String, dynamic>{};
    if (species != null && species != 'all') queryParams['species'] = species;

    try {
      final response = await get(
        ApiEndpoints.livestock,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      if (response.data is List) {
        return response.data as List;
      } else if (response.data is Map<String, dynamic>) {
        return (response.data['animals'] as List?) ?? [];
      }
      return [];
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(message: 'Failed to load livestock: $e');
    }
  }

  // ===========================================================================
  // ERROR TRANSLATION & HELPERS
  // ===========================================================================

  ApiException _mapDioException(DioException error) {
    final statusCode = error.response?.statusCode;
    String message;

    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        message = 'Connection timeout with SOL cloud server (Render). Please check your internet connection.';
        break;
      case DioExceptionType.badResponse:
        final data = error.response?.data;
        if (data is Map && data['message'] != null) {
          message = data['message'].toString();
        } else {
          message = 'Server responded with status $statusCode: ${error.response?.statusMessage ?? "Unknown Error"}';
        }
        break;
      case DioExceptionType.cancel:
        message = 'Request cancelled by user.';
        break;
      case DioExceptionType.connectionError:
        message = 'Unable to reach SOL server (https://soleco1.onrender.com). Working in cached offline mode.';
        break;
      default:
        message = error.message ?? 'An unexpected network error occurred.';
    }

    return ApiException(
      message: message,
      statusCode: statusCode,
      details: error.response?.data,
    );
  }

  ApiException _unwrapError(DioException e) {
    if (e.error is ApiException) {
      return e.error as ApiException;
    }
    return _mapDioException(e);
  }
}

/// Standardized domain exception for API communication errors
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic details;

  ApiException({
    required this.message,
    this.statusCode,
    this.details,
  });

  @override
  String toString() => message;
}
