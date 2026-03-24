import 'package:flutter/material.dart';

import '../app/app_theme.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wallet'),
      ),
      body: const _WalletContent(),
    );
  }
}

class _WalletContent extends StatelessWidget {
  const _WalletContent();

  @override
  Widget build(BuildContext context) {
    final tokens = [
      {'symbol': 'MXN.x', 'name': 'Nexus Mexican Peso', 'balance': 10000.0, 'flag': '🇲🇽'},
      {'symbol': 'PEN.x', 'name': 'Nexus Peruvian Sol', 'balance': 5000.0, 'flag': '🇵🇪'},
      {'symbol': 'USD.x', 'name': 'Nexus US Dollar', 'balance': 1000.0, 'flag': '🇺🇸'},
      {'symbol': 'EUR.x', 'name': 'Nexus Euro', 'balance': 500.0, 'flag': '🇪🇺'},
      {'symbol': 'BRL.x', 'name': 'Nexus Brazilian Real', 'balance': 2000.0, 'flag': '🇧🇷'},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Wallet Address Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Wallet Address',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontFamily: 'monospace',
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.copy, size: 20),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          Text(
            'Tokenized Balances (HTS)',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Text(
            'Powered by Hedera Token Service',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          
          const SizedBox(height: 16),
          
          // Token List
          ...tokens.map((token) => _TokenCard(
            symbol: token['symbol'] as String,
            name: token['name'] as String,
            balance: token['balance'] as double,
            flag: token['flag'] as String,
          )),
        ],
      ),
    );
  }
}

class _TokenCard extends StatelessWidget {
  final String symbol;
  final String name;
  final double balance;
  final String flag;

  const _TokenCard({
    required this.symbol,
    required this.name,
    required this.balance,
    required this.flag,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(flag, style: const TextStyle(fontSize: 24)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    symbol,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  Text(
                    name,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  balance.toStringAsFixed(2),
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  'Token ID: 0.0.${balance.toInt()}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
