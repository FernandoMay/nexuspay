# 🚀 Nexus Pay - Quick Start Guide

## Project Structure

```
nexus-pay/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main landing page
│   │   ├── layout.tsx        # Root layout
│   │   └── api/
│   │       ├── transfer/     # Transfer API
│   │       ├── wallet/       # Wallet API
│   │       ├── tokens/       # HTS Token API
│   │       ├── hcs/          # HCS logging API
│   │       └── ai/           # AI Agent API
│   ├── components/
│   │   ├── transfer-demo.tsx # Interactive transfer demo
│   │   └── ai-agent-demo.tsx # AI chat demo
│   └── lib/
│       ├── hedera/           # Hedera SDK utilities
│       └── db.ts             # Database client
├── flutter_app/              # Mobile app (Flutter)
│   ├── lib/
│   │   ├── main.dart
│   │   ├── app/
│   │   ├── screens/
│   │   ├── widgets/
│   │   ├── models/
│   │   ├── services/
│   │   └── providers/
│   └── pubspec.yaml
├── smart-contracts/          # Hedera smart contracts
│   └── contracts/
│       ├── NexusToken.sol
│       ├── NexusBridge.sol
│       └── NexusVault.sol
├── docs/
│   └── PITCH_DECK.md
├── README.md
└── prisma/
    └── schema.prisma
```

## Running the Project

### Web Application (Next.js)
```bash
# Install dependencies
bun install

# Run development server
bun run dev

# The app will be available at localhost:3000
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/transfer` | POST | Execute a transfer |
| `/api/transfer` | GET | Get transfer history |
| `/api/wallet` | POST | Create wallet |
| `/api/wallet` | GET | Get wallet info |
| `/api/tokens` | GET | List supported tokens |
| `/api/hcs` | GET | Get HCS messages |
| `/api/hcs` | POST | Submit HCS message |
| `/api/ai` | GET | Get market analysis |
| `/api/ai` | POST | Get AI recommendations |

### Flutter Mobile App
```bash
cd flutter_app

# Install dependencies
flutter pub get

# Run on simulator
flutter run
```

### Smart Contracts
```bash
cd smart-contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Hedera testnet
npx hardhat run scripts/deploy.js --network hedera_testnet
```

## Key Features

### 1. Landing Page
- Hero section with animated stats
- Interactive transfer demo
- AI agent chat preview
- Feature cards
- Pricing tiers
- Comparison table

### 2. Transfer System
- Real-time currency conversion
- Fee calculation and comparison
- Yield generation display
- Transaction processing animation

### 3. AI Agent
- Market analysis
- Rate predictions
- Route optimization
- Timing suggestions

### 4. Hedera Integration
- HTS for tokenized currencies
- HCS for transaction logging
- Smart contracts for swaps and yield

## Hackathon Submission

### Track
**DeFi & Tokenization** - Hedera Hello Future Apex Hackathon 2026

### Demo Video Script (5 min)
1. **0:00-0:30** - Problem statement
2. **0:30-1:30** - Solution overview
3. **1:30-3:00** - Live demo (transfer flow)
4. **3:00-4:00** - Technical deep dive
5. **4:00-5:00** - Vision and roadmap

### Key Differentiators
- Invisible DeFi yield on remittances
- AI-powered optimization
- 10x lower fees than traditional
- Hedera's enterprise-grade infrastructure

## Environment Variables

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Hedera (for production)
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e...

# AI (optional)
OPENAI_API_KEY=sk-...
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma, SQLite
- **Mobile**: Flutter, Riverpod
- **Blockchain**: Hedera (HTS, HCS, Smart Contracts)
- **AI**: Custom agent with market analysis

## License

Apache-2.0
