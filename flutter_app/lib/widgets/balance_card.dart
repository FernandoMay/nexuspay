import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../app/app_theme.dart';
import '../providers/wallet_provider.dart';

class BalanceCard extends ConsumerWidget {
  const BalanceCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final walletAsync = ref.watch(walletProvider);

    return walletAsync.when(
      data: (wallet) => _buildContent(context, wallet.balances),
      loading: () => _buildSkeleton(context),
      error: (error, _) => _buildError(context, error.toString()),
    );
  }

  Widget _buildContent(BuildContext context, Map<String, double> balances) {
    final totalUSD = balances['USD'] ?? 0;
    final totalMXN = balances['MXN'] ?? 0;
    final totalPEN = balances['PEN'] ?? 0;

    return Container(
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryGreen.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total Balance',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.trending_up,
                      color: Colors.white.withOpacity(0.9),
                      size: 14,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '+4.2%',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '\$${(totalUSD + totalMXN * 0.058 + totalPEN * 0.27).toStringAsFixed(2)}',
            style: Theme.of(context).textTheme.displayLarge?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              _BalanceItem(
                currency: 'MXN',
                amount: totalMXN,
                flag: '🇲🇽',
              ),
              const SizedBox(width: 16),
              _BalanceItem(
                currency: 'PEN',
                amount: totalPEN,
                flag: '🇵🇪',
              ),
              const SizedBox(width: 16),
              _BalanceItem(
                currency: 'USD',
                amount: totalUSD,
                flag: '🇺🇸',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSkeleton(BuildContext context) {
    return Container(
      height: 180,
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Center(
        child: CircularProgressIndicator(color: Colors.white),
      ),
    );
  }

  Widget _buildError(BuildContext context, String error) {
    return Container(
      height: 180,
      decoration: BoxDecoration(
        color: AppTheme.redAccent.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Center(
        child: Text('Error: $error'),
      ),
    );
  }
}

class _BalanceItem extends StatelessWidget {
  final String currency;
  final double amount;
  final String flag;

  const _BalanceItem({
    required this.currency,
    required this.amount,
    required this.flag,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '$flag $currency',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.white.withOpacity(0.8),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              amount.toStringAsFixed(2),
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
