// Nexus Pay - Tokens API
// API route for HTS token management

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Supported tokenized currencies
const SUPPORTED_TOKENS = [
  { symbol: 'MXN.x', name: 'Nexus Mexican Peso', decimals: 2, initialSupply: 10000000 },
  { symbol: 'PEN.x', name: 'Nexus Peruvian Sol', decimals: 2, initialSupply: 5000000 },
  { symbol: 'USD.x', name: 'Nexus US Dollar', decimals: 2, initialSupply: 2000000 },
  { symbol: 'EUR.x', name: 'Nexus Euro', decimals: 2, initialSupply: 1000000 },
  { symbol: 'BRL.x', name: 'Nexus Brazilian Real', decimals: 2, initialSupply: 3000000 },
  { symbol: 'USDC', name: 'USD Coin (Bridge)', decimals: 6, initialSupply: 5000000 },
  { symbol: 'HBAR', name: 'Hedera Hashgraph', decimals: 8, initialSupply: 100000000 },
]

// GET - Get all supported tokens
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Get user's token balances if userId provided
    let userTokens: any[] = []
    if (userId) {
      userTokens = await db.userToken.findMany({
        where: { userId },
      })
    }

    const tokens = SUPPORTED_TOKENS.map(token => {
      const userToken = userTokens.find(ut => ut.symbol === token.symbol)
      return {
        ...token,
        tokenId: userToken?.tokenId || `0.0.${Math.floor(Math.random() * 1000000)}`,
        balance: userToken?.balance || 0,
      }
    })

    return NextResponse.json({
      success: true,
      tokens,
      totalSupply: tokens.reduce((sum, t) => sum + t.initialSupply, 0),
    })
  } catch (error) {
    console.error('Get tokens error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}

// POST - Mint tokens (admin only in production)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { userId, symbol, amount } = body

    if (!userId || !symbol || !amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid parameters',
      }, { status: 400 })
    }

    // Find or create user token
    let userToken = await db.userToken.findFirst({
      where: { userId, symbol },
    })

    if (!userToken) {
      // Create new token for user
      userToken = await db.userToken.create({
        data: {
          userId,
          tokenId: `0.0.${Math.floor(Math.random() * 1000000)}`,
          symbol,
          name: SUPPORTED_TOKENS.find(t => t.symbol === symbol)?.name || symbol,
          decimals: SUPPORTED_TOKENS.find(t => t.symbol === symbol)?.decimals || 2,
          balance: amount,
        },
      })
    } else {
      // Update balance
      userToken = await db.userToken.update({
        where: { id: userToken.id },
        data: { balance: userToken.balance + amount },
      })
    }

    return NextResponse.json({
      success: true,
      token: {
        id: userToken.tokenId,
        symbol: userToken.symbol,
        balance: userToken.balance,
      },
    })
  } catch (error) {
    console.error('Mint tokens error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
