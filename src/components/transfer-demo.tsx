'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowDownUp, 
  Check, 
  Loader2, 
  Wallet,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const currencies = [
  { code: 'MXN', flag: '🇲🇽', name: 'Mexican Peso', symbol: '$' },
  { code: 'PEN', flag: '🇵🇪', name: 'Peruvian Sol', symbol: 'S/' },
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro', symbol: '€' },
  { code: 'BRL', flag: '🇧🇷', name: 'Brazilian Real', symbol: 'R$' },
]

const exchangeRates: Record<string, number> = {
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
}

export default function TransferDemo() {
  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState(currencies[0])
  const [toCurrency, setToCurrency] = useState(currencies[1])
  const [step, setStep] = useState<'input' | 'processing' | 'complete'>('input')
  const [progress, setProgress] = useState(0)
  const [yieldEarned, setYieldEarned] = useState('0.00')

  const rate = exchangeRates[`${fromCurrency.code}-${toCurrency.code}`] || 1
  const convertedAmount = (parseFloat(amount) || 0) * rate
  const fee = (parseFloat(amount) || 0) * 0.005
  const savedFee = (parseFloat(amount) || 0) * 0.075 // Compared to 8% traditional

  const handleTransfer = () => {
    setStep('processing')
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setStep('complete')
          setYieldEarned((parseFloat(amount) * 0.0001).toFixed(2))
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const resetTransfer = () => {
    setStep('input')
    setProgress(0)
    setYieldEarned('0.00')
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <ArrowDownUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Send Money</h3>
            <p className="text-xs text-muted-foreground">Instant global transfer</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          Live Demo
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* From Currency */}
            <Card className="border-2 border-border/50 hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">You send</span>
                  <span className="text-xs text-muted-foreground">Balance: 12,450.00</span>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold border-0 p-0 focus-visible:ring-0 bg-transparent"
                    placeholder="0.00"
                  />
                  <select
                    value={fromCurrency.code}
                    onChange={(e) => setFromCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
                    className="bg-muted rounded-lg px-3 py-2 text-sm font-medium cursor-pointer"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="rounded-full bg-background shadow-lg border-2 hover:rotate-180 transition-transform duration-300"
              >
                <ArrowDownUp className="w-4 h-4" />
              </Button>
            </div>

            {/* To Currency */}
            <Card className="border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Recipient gets</span>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-500">
                    <TrendingUp className="w-3 h-3 mr-1" /> +{(parseFloat(amount) * 0.0001).toFixed(4)} yield
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <select
                    value={toCurrency.code}
                    onChange={(e) => setToCurrency(currencies.find(c => c.code === e.target.value) || currencies[1])}
                    className="bg-muted rounded-lg px-3 py-2 text-sm font-medium cursor-pointer"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Rate Info */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">1 {fromCurrency.code} = {rate.toFixed(4)} {toCurrency.code}</span>
            </div>

            {/* Fee Comparison */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nexus Pay Fee</p>
                    <p className="font-semibold text-emerald-600">{fromCurrency.symbol}{fee.toFixed(2)} (0.5%)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Traditional Fee</p>
                    <p className="font-semibold text-red-500 line-through">{fromCurrency.symbol}{(fee * 16).toFixed(2)} (8%)</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    💰 You save {fromCurrency.symbol}{savedFee.toFixed(2)} compared to traditional services!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Send Button */}
            <Button 
              onClick={handleTransfer}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg font-semibold"
            >
              Send {fromCurrency.symbol}{parseFloat(amount).toLocaleString()} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Processing Transfer</h3>
            <p className="text-muted-foreground mb-6">Routing through optimal DeFi pathway...</p>
            
            <div className="max-w-xs mx-auto space-y-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Finding best route</span>
                <span>{progress}%</span>
              </div>
              
              {/* Processing Steps */}
              <div className="space-y-2 text-left text-sm">
                <div className={`flex items-center gap-2 ${progress >= 20 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Check className="w-4 h-4" /> Converting to stablecoin
                </div>
                <div className={`flex items-center gap-2 ${progress >= 50 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Check className="w-4 h-4" /> Optimizing yield route
                </div>
                <div className={`flex items-center gap-2 ${progress >= 80 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  <Check className="w-4 h-4" /> Executing transfer
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-6 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold mb-1">Transfer Complete!</h3>
            <p className="text-muted-foreground mb-6">Your money has arrived instantly</p>
            
            {/* Success Summary */}
            <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {toCurrency.symbol}{convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-muted-foreground">{toCurrency.flag} {toCurrency.code} received</p>
                
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-800">
                  <div>
                    <Clock className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-semibold">2s</p>
                  </div>
                  <div>
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <p className="text-xs text-muted-foreground">Fee</p>
                    <p className="font-semibold">{fromCurrency.symbol}{fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <p className="text-xs text-muted-foreground">Yield</p>
                    <p className="font-semibold text-emerald-600">+${yieldEarned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button onClick={resetTransfer} variant="outline" className="w-full">
              Send Another Transfer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
