import 'package:flutter/material.dart';

import '../app/app_theme.dart';

class RecentTransactions extends StatelessWidget {
  const RecentTransactions({super.key});

  @override
  Widget build(BuildContext context) {
    final transactions = [
      {'from': 'MXN', 'to': 'PEN', 'amount': 1000, 'date': 'Today, 2:30 PM', 'status': 'completed'},
      {'from': 'USD', 'to': 'MXN', 'amount': 500, 'date': 'Yesterday', 'status': 'completed'},
      {'from': 'PEN', 'to': 'USD', 'amount': 300, 'date': 'Mar 21', 'status': 'completed'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Transactions',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            TextButton(
              onPressed: () {},
              child: const Text('See All'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: transactions.asMap().entries.map((entry) {
              final index = entry.key;
              final tx = entry.value;
              return Column(
                children: [
                  if (index > 0) const Divider(height: 1),
                  _TransactionItem(
                    fromCurrency: tx['from'] as String,
                    toCurrency: tx['to'] as String,
                    amount: tx['amount'] as int,
                    date: tx['date'] as String,
                    status: tx['status'] as String,
                  ),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _TransactionItem extends StatelessWidget {
  final String fromCurrency;
  final String toCurrency;
  final int amount;
  final String date;
  final String status;

  const _TransactionItem({
    required this.fromCurrency,
    required this.toCurrency,
    required this.amount,
    required this.date,
    required this.status,
  });

  String getCurrencyFlag(String code) {
    switch (code) {
      case 'MXN': return '🇲🇽';
      case 'PEN': return '🇵🇪';
      case 'USD': return '🇺🇸';
      case 'EUR': return '🇪🇺';
      case 'BRL': return '🇧🇷';
      default: return '🌍';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppTheme.primaryGreen.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.swap_horiz,
              color: AppTheme.primaryGreen,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${getCurrencyFlag(fromCurrency)} $fromCurrency → ${getCurrencyFlag(toCurrency)} $toCurrency',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                Text(
                  date,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '\$$amount',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: AppTheme.primaryGreen,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  status,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppTheme.primaryGreen,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
