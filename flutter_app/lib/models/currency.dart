class Currency {
  final String code;
  final String name;
  final String symbol;
  final String flag;
  final Map<String, double> rates;

  const Currency({
    required this.code,
    required this.name,
    required this.symbol,
    required this.flag,
    required this.rates,
  });
}

// Supported currencies with exchange rates
const List<Currency> currencies = [
  Currency(
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '\$',
    flag: '🇲🇽',
    rates: {
      'PEN': 0.18,
      'USD': 0.058,
      'EUR': 0.053,
      'BRL': 0.29,
    },
  ),
  Currency(
    code: 'PEN',
    name: 'Peruvian Sol',
    symbol: 'S/',
    flag: '🇵🇪',
    rates: {
      'MXN': 5.56,
      'USD': 0.27,
      'EUR': 0.24,
      'BRL': 1.54,
    },
  ),
  Currency(
    code: 'USD',
    name: 'US Dollar',
    symbol: '\$',
    flag: '🇺🇸',
    rates: {
      'MXN': 17.24,
      'PEN': 3.72,
      'EUR': 0.92,
      'BRL': 4.97,
    },
  ),
  Currency(
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rates: {
      'MXN': 18.73,
      'PEN': 4.04,
      'USD': 1.09,
      'BRL': 5.41,
    },
  ),
  Currency(
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R\$',
    flag: '🇧🇷',
    rates: {
      'MXN': 3.45,
      'PEN': 0.65,
      'USD': 0.20,
      'EUR': 0.18,
    },
  ),
];

Currency getCurrencyByCode(String code) {
  return currencies.firstWhere(
    (c) => c.code == code,
    orElse: () => currencies[0],
  );
}
