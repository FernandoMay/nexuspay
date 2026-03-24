// Nexus Pay - Hedera HCS Configuration

/**
 * HCS Topic Structure for Nexus Pay
 * Immutable audit trail on Hedera Consensus Service
 */

export const NEXUS_PAY_TOPICS = {
  TRANSACTIONS: {
    topicId: '0.0.1234567',
    description: 'Main transaction log',
    messageTypes: ['TRANSFER_INITIATED', 'TRANSFER_COMPLETED', 'YIELD_DISTRIBUTED'],
  },
  RATES: {
    topicId: '0.0.1234568',
    description: 'Exchange rate updates',
    messageTypes: ['RATE_UPDATE', 'MARKET_EVENT'],
  },
  COMPLIANCE: {
    topicId: '0.0.1234569',
    description: 'Compliance events',
    messageTypes: ['KYC_VERIFIED', 'AML_CHECK'],
  },
  YIELD: {
    topicId: '0.0.1234570',
    description: 'Yield events',
    messageTypes: ['YIELD_ACCRUED', 'YIELD_DISTRIBUTED', 'POOL_REBALANCED'],
  },
};

export const MESSAGE_SCHEMAS = {
  TRANSFER_COMPLETED: {
    type: 'TRANSFER_COMPLETED',
    transferId: 'string',
    transactionId: 'string',
    toAmount: 'number',
    fee: 'number',
    yield: 'number',
    timestamp: 'ISO8601',
  },
  RATE_UPDATE: {
    type: 'RATE_UPDATE',
    fromCurrency: 'string',
    toCurrency: 'string',
    oldRate: 'number',
    newRate: 'number',
    timestamp: 'ISO8601',
  },
  YIELD_DISTRIBUTED: {
    type: 'YIELD_DISTRIBUTED',
    userId: 'string',
    currency: 'string',
    amount: 'number',
    timestamp: 'ISO8601',
  },
};
