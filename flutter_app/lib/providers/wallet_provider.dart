import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/wallet.dart';
import '../services/api_service.dart';

// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

// Wallet Provider
final walletProvider = FutureProvider<Wallet>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getWallet();
});

// Balance Provider
final balanceProvider = Provider<Map<String, double>>((ref) {
  final walletAsync = ref.watch(walletProvider);
  return walletAsync.when(
    data: (wallet) => wallet.balances,
    loading: () => {},
    error: (_, __) => {},
  );
});
