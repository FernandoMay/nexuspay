import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../app/app_theme.dart';
import '../models/currency.dart';
import '../widgets/currency_selector.dart';
// import '../widgets/transfer_summary.dart';
// import '../providers/transfer_provider.dart';

class SendScreen extends ConsumerStatefulWidget {
  const SendScreen({super.key});

  @override
  ConsumerState<SendScreen> createState() => _SendScreenState();
}

class _SendScreenState extends ConsumerState<SendScreen> {
  final _amountController = TextEditingController(text: '1000');
  Currency _fromCurrency = currencies[0]; // MXN
  Currency _toCurrency = currencies[1]; // PEN
  TransferStep _currentStep = TransferStep.input;

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  void _swapCurrencies() {
    setState(() {
      final temp = _fromCurrency;
      _fromCurrency = _toCurrency;
      _toCurrency = temp;
    });
  }

  void _startTransfer() async {
    setState(() {
      _currentStep = TransferStep.processing;
    });

    // Simulate transfer processing
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _currentStep = TransferStep.complete;
      });
    }
  }

  void _resetTransfer() {
    setState(() {
      _currentStep = TransferStep.input;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Send Money'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _buildContent(),
      ),
    );
  }

  Widget _buildContent() {
    switch (_currentStep) {
      case TransferStep.input:
        return _InputStep(
          amountController: _amountController,
          fromCurrency: _fromCurrency,
          toCurrency: _toCurrency,
          onSwapCurrencies: _swapCurrencies,
          onFromCurrencyChanged: (currency) {
            setState(() => _fromCurrency = currency);
          },
          onToCurrencyChanged: (currency) {
            setState(() => _toCurrency = currency);
          },
          onSend: _startTransfer,
        );
      case TransferStep.processing:
        return const _ProcessingStep();
      case TransferStep.complete:
        return _CompleteStep(
          amount: double.tryParse(_amountController.text) ?? 0,
          fromCurrency: _fromCurrency,
          toCurrency: _toCurrency,
          onDone: _resetTransfer,
        );
    }
  }
}

enum TransferStep { input, processing, complete }

class _InputStep extends StatelessWidget {
  final TextEditingController amountController;
  final Currency fromCurrency;
  final Currency toCurrency;
  final VoidCallback onSwapCurrencies;
  final ValueChanged<Currency> onFromCurrencyChanged;
  final ValueChanged<Currency> onToCurrencyChanged;
  final VoidCallback onSend;

  const _InputStep({
    required this.amountController,
    required this.fromCurrency,
    required this.toCurrency,
    required this.onSwapCurrencies,
    required this.onFromCurrencyChanged,
    required this.onToCurrencyChanged,
    required this.onSend,
  });

  double get amount => double.tryParse(amountController.text) ?? 0;
  double get fee => amount * 0.005;
  double get rate => fromCurrency.rates[toCurrency.code] ?? 1;
  double get convertedAmount => (amount - fee) * rate;
  double get yieldEarned => amount * 0.0001;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // From Currency
          _CurrencyInputCard(
            label: 'You send',
            amountController: amountController,
            currency: fromCurrency,
            onCurrencyChanged: onFromCurrencyChanged,
          ).animate().fadeIn().slideY(begin: 0.1, duration: 300.ms),

          const SizedBox(height: 8),

          // Swap Button
          Center(
            child: Container(
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryGreen.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: IconButton(
                icon: const Icon(Icons.swap_vert, color: Colors.white),
                onPressed: onSwapCurrencies,
              ),
            ),
          ),

          const SizedBox(height: 8),

          // To Currency
          _CurrencyOutputCard(
            label: 'Recipient gets',
            amount: convertedAmount,
            currency: toCurrency,
            yieldAmount: yieldEarned,
            onCurrencyChanged: onToCurrencyChanged,
          ).animate().fadeIn().slideY(begin: 0.1, duration: 300.ms, delay: 100.ms),

          const SizedBox(height: 16),

          // Exchange Rate Info
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Exchange Rate',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  Text(
                    '1 ${fromCurrency.code} = ${rate.toStringAsFixed(4)} ${toCurrency.code}',
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ],
              ),
            ),
          ).animate().fadeIn().slideY(begin: 0.1, duration: 300.ms, delay: 200.ms),

          const SizedBox(height: 16),

          // Fee Comparison
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.primaryGreen.withOpacity(0.1),
                  AppTheme.primaryTeal.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Nexus Pay Fee',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        Text(
                          '\$${fee.toStringAsFixed(2)} (0.5%)',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppTheme.primaryGreen,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Traditional Fee',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        Text(
                          '\$${(fee * 16).toStringAsFixed(2)} (8%)',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppTheme.redAccent,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.savings, color: AppTheme.primaryGreen, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'You save \$${(amount * 0.075).toStringAsFixed(2)}!',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppTheme.primaryGreen,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ).animate().fadeIn().slideY(begin: 0.1, duration: 300.ms, delay: 300.ms),

          const SizedBox(height: 24),

          // Send Button
          Container(
            decoration: BoxDecoration(
              gradient: AppTheme.primaryGradient,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryGreen.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: ElevatedButton(
              onPressed: onSend,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Send \$${amount.toStringAsFixed(0)} ${fromCurrency.code}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.arrow_forward, color: Colors.white),
                ],
              ),
            ),
          ).animate().fadeIn().slideY(begin: 0.1, duration: 300.ms, delay: 400.ms),
        ],
      ),
    );
  }
}

class _CurrencyInputCard extends StatelessWidget {
  final String label;
  final TextEditingController amountController;
  final Currency currency;
  final ValueChanged<Currency> onCurrencyChanged;

  const _CurrencyInputCard({
    required this.label,
    required this.amountController,
    required this.currency,
    required this.onCurrencyChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Text(
                  'Balance: 12,450.00',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: amountController,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    style: Theme.of(context).textTheme.displaySmall,
                    decoration: const InputDecoration(
                      hintText: '0.00',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
                CurrencySelector(
                  selectedCurrency: currency,
                  onCurrencyChanged: onCurrencyChanged,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _CurrencyOutputCard extends StatelessWidget {
  final String label;
  final double amount;
  final Currency currency;
  final double yieldAmount;
  final ValueChanged<Currency> onCurrencyChanged;

  const _CurrencyOutputCard({
    required this.label,
    required this.amount,
    required this.currency,
    required this.yieldAmount,
    required this.onCurrencyChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppTheme.primaryGreen.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  label,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryGreen.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.trending_up,
                        color: AppTheme.primaryGreen,
                        size: 14,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '+\$${yieldAmount.toStringAsFixed(4)} yield',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.primaryGreen,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Text(
                    amount.toStringAsFixed(2),
                    style: Theme.of(context).textTheme.displaySmall,
                  ),
                ),
                CurrencySelector(
                  selectedCurrency: currency,
                  onCurrencyChanged: onCurrencyChanged,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ProcessingStep extends StatelessWidget {
  const _ProcessingStep();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              gradient: AppTheme.primaryGradient,
              shape: BoxShape.circle,
            ),
            child: const CircularProgressIndicator(
              color: Colors.white,
              strokeWidth: 3,
            ),
          ).animate(onPlay: (controller) => controller.repeat()).rotate(
            duration: 2000.ms,
          ),
          const SizedBox(height: 24),
          Text(
            'Processing Transfer',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Routing through optimal DeFi pathway...',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}

class _CompleteStep extends StatelessWidget {
  final double amount;
  final Currency fromCurrency;
  final Currency toCurrency;
  final VoidCallback onDone;

  const _CompleteStep({
    required this.amount,
    required this.fromCurrency,
    required this.toCurrency,
    required this.onDone,
  });

  @override
  Widget build(BuildContext context) {
    final rate = fromCurrency.rates[toCurrency.code] ?? 1;
    final convertedAmount = amount * rate;
    final fee = amount * 0.005;
    final yieldEarned = amount * 0.0001;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check,
                color: Colors.white,
                size: 40,
              ),
            ).animate().scale(duration: 300.ms),
            const SizedBox(height: 24),
            Text(
              'Transfer Complete!',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Your money has arrived instantly',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 32),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Text(
                      '${toCurrency.symbol}${convertedAmount.toStringAsFixed(2)}',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        color: AppTheme.primaryGreen,
                      ),
                    ),
                    Text(
                      '${toCurrency.flag} ${toCurrency.code} received',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 24),
                    const Divider(),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _StatItem(
                          icon: Icons.timer,
                          label: 'Time',
                          value: '2s',
                        ),
                        _StatItem(
                          icon: Icons.paid,
                          label: 'Fee',
                          value: '\$${fee.toStringAsFixed(2)}',
                        ),
                        _StatItem(
                          icon: Icons.trending_up,
                          label: 'Yield',
                          value: '+\$${yieldEarned.toStringAsFixed(2)}',
                          isPositive: true,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: onDone,
                child: const Text('Send Another Transfer'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool isPositive;

  const _StatItem({
    required this.icon,
    required this.label,
    required this.value,
    this.isPositive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(
          icon,
          color: isPositive ? AppTheme.primaryGreen : AppTheme.gray500,
          size: 20,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            color: isPositive ? AppTheme.primaryGreen : null,
          ),
        ),
      ],
    );
  }
}
