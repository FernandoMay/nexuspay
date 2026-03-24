import 'package:flutter/material.dart';

import '../models/currency.dart';

class CurrencySelector extends StatelessWidget {
  final Currency selectedCurrency;
  final ValueChanged<Currency> onCurrencyChanged;

  const CurrencySelector({
    super.key,
    required this.selectedCurrency,
    required this.onCurrencyChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<Currency>(
          value: selectedCurrency,
          isDense: true,
          icon: const Icon(Icons.keyboard_arrow_down, size: 20),
          items: currencies.map((currency) {
            return DropdownMenuItem(
              value: currency,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(currency.flag),
                  const SizedBox(width: 8),
                  Text(
                    currency.code,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ],
              ),
            );
          }).toList(),
          onChanged: (currency) {
            if (currency != null) {
              onCurrencyChanged(currency);
            }
          },
        ),
      ),
    );
  }
}
