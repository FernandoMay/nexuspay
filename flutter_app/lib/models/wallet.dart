class Wallet {
  final String id;
  final String address;
  final String? displayName;
  final String? email;
  final Map<String, double> balances;
  final List<Token>? tokens;
  final DateTime createdAt;

  Wallet({
    required this.id,
    required this.address,
    this.displayName,
    this.email,
    required this.balances,
    this.tokens,
    required this.createdAt,
  });

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      id: json['id'],
      address: json['address'],
      displayName: json['displayName'],
      email: json['email'],
      balances: Map<String, double>.from(json['balances'] ?? {}),
      tokens: json['tokens'] != null
          ? (json['tokens'] as List).map((t) => Token.fromJson(t)).toList()
          : null,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class Token {
  final String id;
  final String symbol;
  final String name;
  final double balance;

  Token({
    required this.id,
    required this.symbol,
    required this.name,
    required this.balance,
  });

  factory Token.fromJson(Map<String, dynamic> json) {
    return Token(
      id: json['id'] ?? json['tokenId'],
      symbol: json['symbol'],
      name: json['name'],
      balance: (json['balance'] as num).toDouble(),
    );
  }
}

class TransferResult {
  final bool success;
  final String? transferId;
  final double? fromAmount;
  final String? fromCurrency;
  final double? toAmount;
  final String? toCurrency;
  final double? exchangeRate;
  final double? fee;
  final double? yield;
  final String? transactionId;
  final String? status;
  final String? error;

  TransferResult({
    required this.success,
    this.transferId,
    this.fromAmount,
    this.fromCurrency,
    this.toAmount,
    this.toCurrency,
    this.exchangeRate,
    this.fee,
    this.yield,
    this.transactionId,
    this.status,
    this.error,
  });

  factory TransferResult.fromJson(Map<String, dynamic> json) {
    return TransferResult(
      success: json['success'],
      transferId: json['transferId'],
      fromAmount: json['fromAmount']?.toDouble(),
      fromCurrency: json['fromCurrency'],
      toAmount: json['toAmount']?.toDouble(),
      toCurrency: json['toCurrency'],
      exchangeRate: json['exchangeRate']?.toDouble(),
      fee: json['fee']?.toDouble(),
      yield: json['yield']?.toDouble(),
      transactionId: json['transactionId'],
      status: json['status'],
      error: json['error'],
    );
  }
}
