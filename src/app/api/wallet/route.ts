// Nexus Pay - Wallet API
// API route for wallet management and balance queries

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface CreateWalletRequest {
  email?: string
  displayName?: string
}

interface WalletResponse {
  success: boolean
  wallet?: {
    id: string
    address: string
    balances: Record<string, number>
  }
  error?: string
}

// Generate a mock wallet address
function generateWalletAddress(): string {
  const chars = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

// POST - Create a new wallet
export async function POST(request: NextRequest): Promise<NextResponse<WalletResponse>> {
  try {
    const body: CreateWalletRequest = await request.json()
    const { email, displayName } = body

    // Generate wallet address
    const walletAddress = generateWalletAddress()

    // Create user with initial balances
    const user = await db.user.create({
      data: {
        email,
        displayName,
        walletAddress,
        balanceMXN: 10000, // Initial demo balance
        balancePEN: 5000,
        balanceUSD: 1000,
        balanceEUR: 500,
        balanceBRL: 2000,
      },
    })

    // Create tokenized balances for each currency
    const tokens = [
      { symbol: 'MXN.x', name: 'Nexus Mexican Peso', balance: 10000 },
      { symbol: 'PEN.x', name: 'Nexus Peruvian Sol', balance: 5000 },
      { symbol: 'USD.x', name: 'Nexus US Dollar', balance: 1000 },
      { symbol: 'EUR.x', name: 'Nexus Euro', balance: 500 },
      { symbol: 'BRL.x', name: 'Nexus Brazilian Real', balance: 2000 },
    ]

    for (const token of tokens) {
      await db.userToken.create({
        data: {
          userId: user.id,
          tokenId: `0.0.${Math.floor(Math.random() * 1000000)}`,
          symbol: token.symbol,
          name: token.name,
          balance: token.balance,
        },
      })
    }

    return NextResponse.json({
      success: true,
      wallet: {
        id: user.id,
        address: user.walletAddress,
        balances: {
          MXN: user.balanceMXN,
          PEN: user.balancePEN,
          USD: user.balanceUSD,
          EUR: user.balanceEUR,
          BRL: user.balanceBRL,
        },
      },
    })
  } catch (error) {
    console.error('Create wallet error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create wallet',
    }, { status: 500 })
  }
}

// GET - Get wallet info
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address')
    const userId = searchParams.get('userId')

    if (!walletAddress && !userId) {
      return NextResponse.json({
        success: false,
        error: 'address or userId required',
      }, { status: 400 })
    }

    const user = await db.user.findFirst({
      where: walletAddress 
        ? { walletAddress } 
        : { id: userId! },
      include: {
        tokens: true,
      },
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Wallet not found',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      wallet: {
        id: user.id,
        address: user.walletAddress,
        displayName: user.displayName,
        email: user.email,
        balances: {
          MXN: user.balanceMXN,
          PEN: user.balancePEN,
          USD: user.balanceUSD,
          EUR: user.balanceEUR,
          BRL: user.balanceBRL,
        },
        tokens: user.tokens.map(t => ({
          id: t.tokenId,
          symbol: t.symbol,
          name: t.name,
          balance: t.balance,
        })),
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Get wallet error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
