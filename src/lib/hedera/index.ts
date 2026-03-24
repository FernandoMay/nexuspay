// Nexus Pay - Hedera Integration Library
// This module provides utilities for interacting with Hedera network services

import {
  Client,
  AccountId,
  PrivateKey,
  TokenId,
  TopicId,
  TransactionId,
  TransferTransaction,
  TokenCreateTransaction,
  TokenMintTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  Hbar,
  PublicKey,
} from '@hashgraph/sdk'

// Types
export interface HederaConfig {
  network: 'mainnet' | 'testnet' | 'previewnet'
  operatorId: string
  operatorKey: string
}

export interface TokenInfo {
  tokenId: string
  symbol: string
  name: string
  decimals: number
  supply: number
}

export interface TransferResult {
  success: boolean
  transactionId?: string
  consensusTimestamp?: string
  error?: string
}

export interface HCSMessage {
  topicId: string
  message: string
  sequenceNumber?: number
  consensusTimestamp?: string
}

// Hedera Client Manager
export class HederaClient {
  private client: Client | null = null
  private config: HederaConfig

  constructor(config: HederaConfig) {
    this.config = config
  }

  // Initialize client
  async initialize(): Promise<void> {
    const operatorId = AccountId.fromString(this.config.operatorId)
    const operatorKey = PrivateKey.fromStringDer(this.config.operatorKey)

    switch (this.config.network) {
      case 'mainnet':
        this.client = Client.forMainnet()
        break
      case 'testnet':
        this.client = Client.forTestnet()
        break
      case 'previewnet':
        this.client = Client.forPreviewnet()
        break
    }

    this.client!.setOperator(operatorId, operatorKey)
  }

  // Get client
  getClient(): Client {
    if (!this.client) {
      throw new Error('Hedera client not initialized')
    }
    return this.client
  }

  // Close client
  close(): void {
    if (this.client) {
      this.client.close()
      this.client = null
    }
  }
}

// Hedera Token Service (HTS) Utilities
export class HederaTokenService {
  private client: HederaClient

  constructor(client: HederaClient) {
    this.client = client
  }

  // Create a new token (for currency tokenization)
  async createToken(params: {
    name: string
    symbol: string
    decimals: number
    initialSupply: number
    treasuryAccountId: string
    adminKey?: string
    supplyKey?: string
  }): Promise<TokenInfo> {
    const transaction = new TokenCreateTransaction()
      .setTokenName(params.name)
      .setTokenSymbol(params.symbol)
      .setDecimals(params.decimals)
      .setInitialSupply(params.initialSupply)
      .setTreasuryAccountId(AccountId.fromString(params.treasuryAccountId))
      .setMaxTransactionFee(new Hbar(30))

    if (params.adminKey) {
      transaction.setAdminKey(PrivateKey.fromStringDer(params.adminKey))
    }

    if (params.supplyKey) {
      transaction.setSupplyKey(PrivateKey.fromStringDer(params.supplyKey))
    }

    const response = await transaction.execute(this.client.getClient())
    const receipt = await response.getReceipt(this.client.getClient())

    const tokenId = receipt.tokenId

    if (!tokenId) {
      throw new Error('Failed to create token')
    }

    return {
      tokenId: tokenId.toString(),
      symbol: params.symbol,
      name: params.name,
      decimals: params.decimals,
      supply: params.initialSupply,
    }
  }

  // Transfer tokens between accounts
  async transferToken(params: {
    tokenId: string
    fromAccountId: string
    toAccountId: string
    amount: number
  }): Promise<TransferResult> {
    try {
      const transaction = new TransferTransaction()
        .addTokenTransfer(
          TokenId.fromString(params.tokenId),
          AccountId.fromString(params.fromAccountId),
          -params.amount
        )
        .addTokenTransfer(
          TokenId.fromString(params.tokenId),
          AccountId.fromString(params.toAccountId),
          params.amount
        )

      const response = await transaction.execute(this.client.getClient())
      const receipt = await response.getReceipt(this.client.getClient())

      return {
        success: true,
        transactionId: response.transactionId.toString(),
        consensusTimestamp: receipt.consensusTimestamp?.toString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Mint additional tokens
  async mintToken(params: {
    tokenId: string
    amount: number
    supplyKey: string
  }): Promise<TransferResult> {
    try {
      const transaction = new TokenMintTransaction()
        .setTokenId(TokenId.fromString(params.tokenId))
        .setAmount(params.amount)
        .freezeWith(this.client.getClient())

      const signedTransaction = transaction.sign(PrivateKey.fromStringDer(params.supplyKey))
      const response = await signedTransaction.execute(this.client.getClient())
      const receipt = await response.getReceipt(this.client.getClient())

      return {
        success: true,
        transactionId: response.transactionId.toString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Hedera Consensus Service (HCS) Utilities
export class HederaConsensusService {
  private client: HederaClient

  constructor(client: HederaClient) {
    this.client = client
  }

  // Create a new topic for transaction logging
  async createTopic(params: {
    topicMemo?: string
    adminKey?: string
    submitKey?: string
  }): Promise<string> {
    const transaction = new TopicCreateTransaction()
      .setTopicMemo(params.topicMemo || 'Nexus Pay Transaction Log')

    if (params.adminKey) {
      transaction.setAdminKey(PrivateKey.fromStringDer(params.adminKey))
    }

    if (params.submitKey) {
      transaction.setSubmitKey(PrivateKey.fromStringDer(params.submitKey))
    }

    const response = await transaction.execute(this.client.getClient())
    const receipt = await response.getReceipt(this.client.getClient())

    const topicId = receipt.topicId

    if (!topicId) {
      throw new Error('Failed to create topic')
    }

    return topicId.toString()
  }

  // Submit a message to a topic
  async submitMessage(params: {
    topicId: string
    message: string
  }): Promise<HCSMessage> {
    const transaction = new TopicMessageSubmitTransaction()
      .setTopicId(TopicId.fromString(params.topicId))
      .setMessage(params.message)

    const response = await transaction.execute(this.client.getClient())
    const receipt = await response.getReceipt(this.client.getClient())

    return {
      topicId: params.topicId,
      message: params.message,
      sequenceNumber: receipt.topicSequenceNumber?.toNumber(),
      consensusTimestamp: receipt.topicRunningHash?.toString(),
    }
  }

  // Log a transfer to HCS (for audit trail)
  async logTransfer(params: {
    topicId: string
    transferId: string
    fromAmount: number
    fromCurrency: string
    toAmount: number
    toCurrency: string
    fee: number
    yield: number
    timestamp: string
  }): Promise<HCSMessage> {
    const message = JSON.stringify({
      type: 'TRANSFER',
      transferId: params.transferId,
      from: {
        amount: params.fromAmount,
        currency: params.fromCurrency,
      },
      to: {
        amount: params.toAmount,
        currency: params.toCurrency,
      },
      fee: params.fee,
      yield: params.yield,
      timestamp: params.timestamp,
      version: '1.0',
    })

    return this.submitMessage({
      topicId: params.topicId,
      message,
    })
  }
}

// Utility functions
export function formatHbar(amount: number): string {
  return new Hbar(amount).toString()
}

export function parseHbar(amount: string): number {
  return Hbar.fromString(amount).toTinybars().toNumber()
}

export function generateTransactionId(accountId: string): string {
  return TransactionId.generate(AccountId.fromString(accountId)).toString()
}

// Export all
export default {
  HederaClient,
  HederaTokenService,
  HederaConsensusService,
  formatHbar,
  parseHbar,
  generateTransactionId,
}
