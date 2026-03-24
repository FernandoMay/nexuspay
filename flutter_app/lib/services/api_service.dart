import 'package:dio/dio.dart';

import '../models/wallet.dart';
import '../models/transaction.dart';

class ApiService {
  final Dio _dio;
  static const String baseUrl = 'https://nexuspay.io/api';

  ApiService() : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  // Wallet endpoints
  Future<Wallet> getWallet() async {
    final response = await _dio.get('/wallet');
    return Wallet.fromJson(response.data['wallet']);
  }

  Future<Wallet> createWallet({String? email, String? displayName}) async {
    final response = await _dio.post('/wallet', data: {
      'email': email,
      'displayName': displayName,
    });
    return Wallet.fromJson(response.data['wallet']);
  }

  // Transfer endpoints
  Future<TransferResult> createTransfer({
    required String userId,
    required String fromCurrency,
    required String toCurrency,
    required double amount,
  }) async {
    final response = await _dio.post('/transfer', data: {
      'userId': userId,
      'fromCurrency': fromCurrency,
      'toCurrency': toCurrency,
      'amount': amount,
    });
    return TransferResult.fromJson(response.data);
  }

  Future<List<Transaction>> getTransactions({
    required String userId,
    int limit = 10,
    int offset = 0,
  }) async {
    final response = await _dio.get('/transfer', queryParameters: {
      'userId': userId,
      'limit': limit,
      'offset': offset,
    });
    return (response.data['transfers'] as List)
        .map((t) => Transaction.fromJson(t))
        .toList();
  }

  // Token endpoints
  Future<List<Token>> getTokens({String? userId}) async {
    final response = await _dio.get('/tokens', queryParameters: {
      'userId': userId,
    });
    return (response.data['tokens'] as List)
        .map((t) => Token.fromJson(t))
        .toList();
  }

  // AI endpoints
  Future<Map<String, dynamic>> getMarketAnalysis({
    String fromCurrency = 'MXN',
    String toCurrency = 'PEN',
  }) async {
    final response = await _dio.get('/ai', queryParameters: {
      'fromCurrency': fromCurrency,
      'toCurrency': toCurrency,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getAIRecommendation({
    required String type,
    Map<String, dynamic>? params,
  }) async {
    final response = await _dio.post('/ai', data: {
      'type': type,
      'params': params ?? {},
    });
    return response.data;
  }
}
