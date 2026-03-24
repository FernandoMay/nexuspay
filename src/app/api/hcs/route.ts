// Nexus Pay - HCS (Hedera Consensus Service) API
// API route for logging transactions to Hedera Consensus Service

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// HCS Topic ID for Nexus Pay (in production, this would be created on Hedera)
const NEXUS_PAY_TOPIC_ID = '0.0.1234567'

interface HCSMessageRequest {
  type: 'transfer' | 'yield' | 'rate_update' | 'audit'
  data: Record<string, any>
}

// GET - Get HCS topic messages
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const topicId = searchParams.get('topicId') || NEXUS_PAY_TOPIC_ID
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')

    // Build query
    const where: any = { topicId }
    if (type) {
      where.messageType = type
    }

    const messages = await db.hCSMessage.findMany({
      where,
      orderBy: { sequenceNumber: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      topicId,
      messages: messages.map(m => ({
        sequenceNumber: m.sequenceNumber,
        consensusTimestamp: m.consensusTimestamp,
        type: m.messageType,
        content: JSON.parse(m.content),
        createdAt: m.createdAt,
      })),
    })
  } catch (error) {
    console.error('Get HCS messages error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}

// POST - Submit message to HCS
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: HCSMessageRequest = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        error: 'type and data required',
      }, { status: 400 })
    }

    // Simulate HCS message submission
    // In production, this would call actual Hedera SDK
    const sequenceNumber = Math.floor(Math.random() * 1000000)
    const consensusTimestamp = new Date().toISOString()

    // Store message in database
    const message = await db.hCSMessage.create({
      data: {
        topicId: NEXUS_PAY_TOPIC_ID,
        sequenceNumber,
        consensusTimestamp,
        messageType: type,
        content: JSON.stringify(data),
      },
    })

    return NextResponse.json({
      success: true,
      message: {
        topicId: NEXUS_PAY_TOPIC_ID,
        sequenceNumber,
        consensusTimestamp,
        type,
        data,
      },
    })
  } catch (error) {
    console.error('Submit HCS message error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}

// Log transfer to HCS (helper function)
export async function logTransferToHCS(transfer: {
  transferId: string
  fromAmount: number
  fromCurrency: string
  toAmount: number
  toCurrency: string
  fee: number
  yield: number
}): Promise<void> {
  try {
    const sequenceNumber = Math.floor(Math.random() * 1000000)
    const consensusTimestamp = new Date().toISOString()

    await db.hCSMessage.create({
      data: {
        topicId: NEXUS_PAY_TOPIC_ID,
        sequenceNumber,
        consensusTimestamp,
        messageType: 'transfer',
        content: JSON.stringify({
          transferId: transfer.transferId,
          from: {
            amount: transfer.fromAmount,
            currency: transfer.fromCurrency,
          },
          to: {
            amount: transfer.toAmount,
            currency: transfer.toCurrency,
          },
          fee: transfer.fee,
          yield: transfer.yield,
          timestamp: consensusTimestamp,
          version: '1.0',
        }),
      },
    })
  } catch (error) {
    console.error('Log transfer to HCS error:', error)
  }
}
