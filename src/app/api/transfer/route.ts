// Nexus Pay - Transfer API
// API route for handling cross-border transfers via Hedera

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Exchange rates (in production, fetch from oracle/API)
const EXCHANGE_RATES: Record<string, number> = {
  'MXN-PEN': 0.18,
  'MXN-USD': 0.058,
  'MXN-EUR': 0.053,
  'MXN-BRL': 0.29,
  'PEN-MXN': 5.56,
  'PEN-USD': 0.27,
  'PEN-EUR': 0.24,
  'PEN-BRL': 1.54,
  'USD-MXN': 17.24,
  'USD-PEN': 3.72,
  'USD-EUR': 0.92,
  'USD-BRL': 4.97,
  'EUR-MXN': 18.73,
  'EUR-PEN': 4.04,
  'EUR-USD': 1.09,
  'EUR-BRL': 5.41,
  'BRL-MXN': 3.45,
  'BRL-PEN': 0.65,
  'BRL-USD': 0.20,
  'BRL-EUR': 0.18,
}

// Fee configuration
const FEE_PERCENTAGE = 0.005 // 0.5%
const YIELD_APY = 0.04 // 4% APY (for micro-yield during transfer)

interface TransferRequest {
  userId: string
  fromCurrency: string
  toCurrency: string
  amount: number
  recipientWallet?: string
}

interface TransferResponse {
  success: boolean
  transferId?: string
  fromAmount?: number
  fromCurrency?: string
  toAmount?: number
  toCurrency?: string
  exchangeRate?: number
  fee?: number
  yield?: number
  transactionId?: string
  status?: string
  error?: string
}

// POST - Create a new transfer
export async function POST(request: NextRequest): Promise<NextResponse<TransferResponse>> {
  try {
    const body: TransferRequest = await request.json()
    const { userId, fromCurrency, toCurrency, amount, recipientWallet } = body

    // Validate input
    if (!userId || !fromCurrency || !toCurrency || !amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transfer parameters',
      }, { status: 400 })
    }

    // Get exchange rate
    const rateKey = `${fromCurrency}-${toCurrency}`
    const exchangeRate = EXCHANGE_RATES[rateKey]
    
    if (!exchangeRate) {
      return NextResponse.json({
        success: false,
        error: 'Currency pair not supported',
      }, { status: 400 })
    }

    // Calculate amounts
    const fee = amount * FEE_PERCENTAGE
    const netAmount = amount - fee
    const toAmount = netAmount * exchangeRate
    
    // Calculate micro-yield (simulated DeFi yield during transfer)
    // In production, this would come from actual DeFi protocols
    const transferTimeHours = 0.001 // ~3.6 seconds
    const yieldAmount = (netAmount * YIELD_APY * transferTimeHours) / 8760

    // Create transfer record
    const transfer = await db.transfer.create({
      data: {
        userId,
        fromAmount: amount,
        fromCurrency,
        toAmount,
        toCurrency,
        exchangeRate,
        fee,
        yield: yieldAmount,
        status: 'processing',
      },
    })

    // Simulate Hedera transaction
    // In production, this would call actual Hedera SDK
    const mockTransactionId = `0.0.${Math.floor(Math.random() * 1000000)}@${Date.now()}`
    
    // Update transfer with transaction ID
    await db.transfer.update({
      where: { id: transfer.id },
      data: {
        htsTransactionId: mockTransactionId,
        status: 'completed',
        completedAt: new Date(),
      },
    })

    // Create transaction record
    await db.transaction.create({
      data: {
        userId,
        type: 'transfer',
        amount,
        currency: fromCurrency,
        transactionId: mockTransactionId,
        status: 'completed',
      },
    })

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      fromAmount: amount,
      fromCurrency,
      toAmount,
      toCurrency,
      exchangeRate,
      fee,
      yield: yieldAmount,
      transactionId: mockTransactionId,
      status: 'completed',
    })
  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}

// GET - Get transfer history
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId required',
      }, { status: 400 })
    }

    const transfers = await db.transfer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await db.transfer.count({
      where: { userId },
    })

    return NextResponse.json({
      success: true,
      transfers,
      pagination: {
        total,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Get transfers error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
