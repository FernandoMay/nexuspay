# 🌍 Nexus Pay - The Global Value Layer

> Send, earn, and move money globally — instantly, intelligently, invisibly.

[![Hedera](https://img.shields.io/badge/Powered%20by-Hedera-00C853?logo=hedera)](https://hedera.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

## 🎯 Problem

Cross-border payments are broken:
- **Slow**: 3-5 days for international transfers
- **Expensive**: 5-10% fees on average
- **Opaque**: Hidden fees and poor exchange rates
- **Inaccessible**: 1.4 billion unbanked globally

**$700B+** in remittances annually, with **$50B+** lost to fees.

---

## 💡 Solution

**Nexus Pay** is a global value layer that makes money move like information:

| Feature | Traditional | Nexus Pay |
|---------|-------------|-----------|
| Transfer Time | 3-5 days | **2 seconds** |
| Transaction Fee | 5-10% | **<1%** |
| Yield on Transfer | None | **4-8% APY** |
| AI Optimization | No | **Yes** |
| Weekend Transfers | No | **24/7** |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXUS PAY STACK                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  Flutter App │    │  Next.js Web │    │  Dashboard  │        │
│  │   (Mobile)   │    │   (Landing)  │    │   (Admin)   │        │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
│         │                  │                   │                │
│         └──────────────────┼───────────────────┘                │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Gateway                           │   │
│  │              (Next.js API Routes)                        │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         ▼                  ▼                  ▼                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Hedera    │    │     AI      │    │   Yield     │        │
│  │     SDK     │    │    Agent    │    │   Engine    │        │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
│         │                  │                   │                │
└─────────┼──────────────────┼───────────────────┼────────────────┘
          │                  │                   │
          ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HEDERA NETWORK                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │     HTS     │    │     HCS     │    │   Smart     │        │
│  │   (Tokens)  │    │  (Logging)  │    │  Contracts  │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Core Components

### 1. Tokenized Currencies (HTS)
- **MXN.x** - Mexican Peso
- **PEN.x** - Peruvian Sol
- **USD.x** - US Dollar
- **EUR.x** - Euro
- **BRL.x** - Brazilian Real

### 2. Smart Contracts
- **NexusToken.sol** - ERC-20 tokenized currencies
- **NexusBridge.sol** - Cross-currency swaps
- **NexusVault.sol** - Yield generation

### 3. Hedera Consensus Service (HCS)
- Immutable transaction logs
- Audit trail
- Rate updates
- Compliance events

### 4. AI Agent
- Real-time market analysis
- Predictive FX optimization
- Automatic yield harvesting
- Smart timing suggestions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Bun or npm
- Hedera testnet account

### Installation

```bash
# Clone the repository
git clone https://github.com/nexuspay/nexus-pay.git
cd nexus-pay

# Install dependencies
bun install

# Run development server
bun run dev
```

### Environment Setup

```env
# Hedera Configuration
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e...

# Database
DATABASE_URL="file:./db/custom.db"

# API Keys
OPENAI_API_KEY=sk-...
```

---

## 📊 Hedera Integration

### Hedera Token Service (HTS)
```typescript
import { HederaTokenService } from '@/lib/hedera'

// Create tokenized currency
const token = await tokenService.createToken({
  name: 'Nexus Mexican Peso',
  symbol: 'MXN.x',
  decimals: 2,
  initialSupply: 10000000,
})

// Transfer tokens
await tokenService.transferToken({
  tokenId: token.tokenId,
  fromAccountId: sender,
  toAccountId: recipient,
  amount: 1000,
})
```

### Hedera Consensus Service (HCS)
```typescript
import { HederaConsensusService } from '@/lib/hedera'

// Log transfer to HCS
await hcsService.logTransfer({
  topicId: NEXUS_PAY_TOPIC_ID,
  transferId: 'tr_abc123',
  fromAmount: 1000,
  fromCurrency: 'MXN',
  toAmount: 180,
  toCurrency: 'PEN',
  fee: 5,
  yield: 0.1,
})
```

---

## 🤖 AI Agent

The Nexus AI Agent provides intelligent optimization:

```typescript
// Get market analysis
const analysis = await api.get('/ai', {
  fromCurrency: 'MXN',
  toCurrency: 'PEN',
})

// Response
{
  "prediction": "RATE_WILL_IMPROVE",
  "message": "MXN/PEN rate expected to improve in 2-3 hours",
  "confidence": 78,
  "suggestions": [
    "Send now for immediate transfer",
    "Wait 2 hours for potentially better rate",
    "Use yield-optimized route for extra returns"
  ]
}
```

---

## 📱 Flutter App

The mobile app is located in `/flutter_app`:

```bash
cd flutter_app

# Install dependencies
flutter pub get

# Run on simulator
flutter run

# Build for production
flutter build apk
```

### Key Screens
- **HomeScreen** - Balance overview and quick actions
- **SendScreen** - Transfer flow with live conversion
- **WalletScreen** - Tokenized balances
- **HistoryScreen** - Transaction history
- **AIAssistantScreen** - AI chat interface

---

## 🔒 Security

- **ABFT Consensus**: Hedera's asynchronous Byzantine Fault Tolerance
- **Non-Custodial**: Users control their keys
- **Smart Contract Audits**: All contracts audited
- **HCS Logging**: Immutable audit trail

---

## 📈 Roadmap

### Q1 2026 (Current)
- [x] MVP Launch (MXN ↔ PEN)
- [x] HTS Token Integration
- [x] HCS Logging
- [x] AI Agent MVP

### Q2 2026
- [ ] Multi-currency support (USD, EUR, BRL)
- [ ] Bonzo Finance integration
- [ ] Mobile app launch

### Q3 2026
- [ ] Global expansion (50+ countries)
- [ ] Enterprise API
- [ ] Stablecoin bridge

### Q4 2026
- [ ] Full decentralization
- [ ] DAO governance
- [ ] 1M+ users target

---

## 🏆 Hackathon Track

**DeFi & Tokenization** - Hedera Hello Future Apex Hackathon 2026

### Judging Criteria Alignment

| Criteria | How Nexus Pay Addresses |
|----------|------------------------|
| Innovation (10%) | Invisible DeFi yield on remittances |
| Feasibility (10%) | Working MVP with Hedera integration |
| Execution (20%) | Full-stack implementation |
| Integration (15%) | Deep HTS + HCS usage |
| Success (20%) | LATAM market = billions |
| Validation (15%) | Real remittance pain point |
| Pitch (10%) | Clear value proposition |

---

## 📞 Contact

- **Website**: [nexuspay.io](https://nexuspay.io)
- **Twitter**: [@nexuspay](https://twitter.com/nexuspay)
- **Discord**: [Join our community](https://discord.gg/nexuspay)
- **Email**: team@nexuspay.io

---

## 📄 License

Apache-2.0 License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with ❤️ on Hedera</strong>
</p>
