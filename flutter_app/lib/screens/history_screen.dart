import 'package:flutter/material.dart';

import '../app/app_theme.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Transaction History'),
      ),
      body: const _HistoryContent(),
    );
  }
}

class _HistoryContent extends StatelessWidget {
  const _HistoryContent();

  @override
  Widget build(BuildContext context) {
    final transactions = [
      {'id': '1', 'type': 'transfer', 'from': 'MXN', 'to': 'PEN', 'amount': 1000, 'fee': 5.0, 'yield': 0.1, 'date': 'Mar 23, 2026', 'status': 'completed'},
      {'id': '2', 'type': 'transfer', 'from': 'USD', 'to': 'MXN', 'amount': 500, 'fee': 2.5, 'yield': 0.05, 'date': 'Mar 22, 2026', 'status': 'completed'},
      {'id': '3', 'type': 'transfer', 'from': 'PEN', 'to': 'USD', 'amount': 300, 'fee': 1.5, 'yield': 0.03, 'date': 'Mar 21, 2026', 'status': 'completed'},
      {'id': '4', 'type': 'transfer', 'from': 'MXN', 'to': 'EUR', 'amount': 2000, 'fee': 10.0, 'yield': 0.2, 'date': 'Mar 20, 2026', 'status': 'completed'},
      {'id': '5', 'type': 'yield', 'from': 'USD', 'to': 'USD', 'amount': 50, 'fee': 0.0, 'yield': 50, 'date': 'Mar 19, 2026', 'status': 'completed'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: transactions.length,
      itemBuilder: (context, index) {
        final tx = transactions[index];
        return _TransactionCard(
          id: tx['id'] as String,
          type: tx['type'] as String,
          from: tx['from'] as String,
          to: tx['to'] as String,
          amount: tx['amount'] as int,
          fee: tx['fee'] as double,
          yieldAmount: tx['yield'] as double,
          date: tx['date'] as String,
          status: tx['status'] as String,
        );
      },
    );
  }
}

class _TransactionCard extends StatelessWidget {
  final String id;
  final String type;
  final String from;
  final String to;
  final int amount;
  final double fee;
  final double yieldAmount;
  final String date;
  final String status;

  const _TransactionCard({
    required this.id,
    required this.type,
    required this.from,
    required this.to,
    required this.amount,
    required this.fee,
    required this.yieldAmount,
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
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: type == 'yield' 
                          ? AppTheme.purpleAccent.withOpacity(0.1)
                          : AppTheme.primaryGreen.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        type == 'yield' ? Icons.trending_up : Icons.swap_horiz,
                        color: type == 'yield' ? AppTheme.purpleAccent : AppTheme.primaryGreen,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          type == 'yield' ? 'Yield Earned' : 'Transfer',
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                        Text(
                          date,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryGreen.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    status.toUpperCase(),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppTheme.primaryGreen,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Text(getCurrencyFlag(from)),
                      const SizedBox(width: 8),
                      Text('$amount $from'),
                    ],
                  ),
                  const Icon(Icons.arrow_forward, size: 16),
                  Row(
                    children: [
                      Text(getCurrencyFlag(to)),
                      const SizedBox(width: 8),
                      Text('$to'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _InfoItem(label: 'Fee', value: '\$${fee.toStringAsFixed(2)}'),
                _InfoItem(label: 'Yield', value: '+\$${yieldAmount.toStringAsFixed(2)}', isPositive: true),
                _InfoItem(label: 'TX ID', value: '0x${id}...'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoItem extends StatelessWidget {
  final String label;
  final String value;
  final bool isPositive;

  const _InfoItem({
    required this.label,
    required this.value,
    this.isPositive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: isPositive ? AppTheme.primaryGreen : null,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
