# Nexus Pay - Smart Contracts

## Overview

Smart contracts for the Nexus Pay platform on Hedera Hashgraph.

## Contracts

### 1. NexusToken.sol
Tokenized representation of fiat currencies on Hedera.

**Features:**
- ERC-20 compatible
- Mintable/Burnable by authorized parties
- Backing ratio tracking
- Currency code association

**Supported Tokens:**
- MXN.x (Mexican Peso)
- PEN.x (Peruvian Sol)
- USD.x (US Dollar)
- EUR.x (Euro)
- BRL.x (Brazilian Real)

### 2. NexusBridge.sol
Cross-currency swap and bridge contract.

**Features:**
- Instant swaps between tokenized currencies
- Protocol fee (0.5%)
- Yield generation during transfers
- Exchange rate management

**Functions:**
```solidity
function swap(
    string memory fromCurrency,
    string memory toCurrency,
    uint256 amount
) external returns (uint256 toAmount, uint256 yieldEarned);
```

### 3. NexusVault.sol
Yield-generating vault for deposits.

**Features:**
- Deposit tokens to earn yield
- Integration with Bonzo Finance
- APY tracking per currency
- Real-time yield calculation

**Current APYs:**
- MXN: 4.2%
- PEN: 3.8%
- USD: 4.5%
- EUR: 4.0%
- BRL: 5.0%

## Hedera Consensus Service (HCS)

Nexus Pay uses HCS for:
- Immutable transaction logs
- Audit trail
- Rate updates
- Compliance events

**Topics:**
| Topic | ID | Purpose |
|-------|-----|---------|
| Transactions | 0.0.1234567 | Main transfer log |
| Rates | 0.0.1234568 | Exchange rate updates |
| Compliance | 0.0.1234569 | KYC/AML events |
| Yield | 0.0.1234570 | Yield distribution |

## Deployment

### Prerequisites
- Hedera account with HBAR
- Node.js 18+
- Hardhat or Truffle

### Deploy to Testnet

```bash
# Install dependencies
npm install

# Configure network
export HEDERA_NETWORK=testnet
export HEDERA_OPERATOR_ID=0.0.xxxxx
export HEDERA_OPERATOR_KEY=302e...

# Deploy
npx hardhat run scripts/deploy.js --network hedera_testnet
```

### Contract Verification

```bash
npx hardhat verify --network hedera_testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Testing

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test
npx hardhat test test/NexusBridge.test.js
```

## Security

### Audited Features
- [x] Reentrancy protection
- [x] Access control
- [x] Safe math operations
- [x] Input validation

### Known Risks
- Exchange rate oracle dependency
- Smart contract upgradeability
- Yield pool sustainability

## Gas Optimization

| Function | Gas Used | Optimization |
|----------|----------|--------------|
| swap() | ~85,000 | Batch operations |
| deposit() | ~45,000 | Storage packing |
| withdraw() | ~52,000 | Efficient loops |

## License

Apache-2.0
