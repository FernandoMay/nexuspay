'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Send, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  data?: {
    type: 'rate' | 'prediction' | 'optimization'
    value?: string
    change?: number
    confidence?: number
  }
}

const aiResponses: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '👋 Hi! I\'m your Nexus AI agent. I analyze markets 24/7 to find the best transfer opportunities for you.',
    timestamp: new Date(),
    suggestions: ['What\'s the best time to send MXN to PEN?', 'Show me current rates', 'Optimize my transfer']
  },
  {
    id: '2',
    role: 'assistant',
    content: '📊 **Market Analysis: MXN → PEN**\n\nCurrent rate: **1 MXN = 0.18 PEN**\n\n⚠️ The Peso is slightly weak today due to Fed announcements.',
    timestamp: new Date(),
    data: { type: 'rate', value: '0.18', change: -0.5 }
  },
  {
    id: '3',
    role: 'assistant',
    content: '🔮 **AI Prediction**\n\nBased on market patterns, the MXN/PEN rate may improve in the next **2-3 hours**.\n\nConfidence: **78%**',
    timestamp: new Date(),
    data: { type: 'prediction', confidence: 78 }
  },
  {
    id: '4',
    role: 'assistant',
    content: '✅ **Optimization Ready**\n\nI\'ve found a better route through USDC liquidity pools!\n\n• Save **$4.20** in fees\n• Earn **$0.12** in yield during transfer\n• Total benefit: **+$4.32**',
    timestamp: new Date(),
    data: { type: 'optimization', value: '+$4.32' }
  }
]

export default function AIAgentDemo() {
  const [messages, setMessages] = useState<Message[]>([aiResponses[0]])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Auto-advance through demo
    const interval = setInterval(() => {
      if (currentSuggestion < aiResponses.length && messages.length < 4) {
        setIsTyping(true)
        setTimeout(() => {
          setMessages(prev => [...prev, aiResponses[currentSuggestion]])
          setCurrentSuggestion(prev => prev + 1)
          setIsTyping(false)
        }, 1500)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [currentSuggestion, messages.length])

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      const nextResponse = aiResponses[messages.length]
      if (nextResponse) {
        setMessages(prev => [...prev, nextResponse])
      }
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    handleSend()
  }

  return (
    <div className="flex flex-col h-[500px] bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              Nexus AI Agent
              <Badge variant="outline" className="text-purple-600 border-purple-500 text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> Active
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">Always optimizing your transfers</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-muted-foreground">AI Agent</span>
                  </div>
                )}
                
                <Card className={`${message.role === 'user' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                  : 'bg-muted/50'}`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    
                    {/* Data Visualization */}
                    {message.data && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        {message.data.type === 'rate' && (
                          <div className="flex items-center gap-2">
                            <Badge variant={message.data.change! < 0 ? 'destructive' : 'default'} 
                              className={message.data.change! < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}
                            >
                              {message.data.change! < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                              {message.data.change}%
                            </Badge>
                          </div>
                        )}
                        {message.data.type === 'prediction' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-violet-600"
                                style={{ width: `${message.data.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{message.data.confidence}%</span>
                          </div>
                        )}
                        {message.data.type === 'optimization' && (
                          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            {message.data.value} saved
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs h-8"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <ArrowRight className="w-3 h-3 mr-2" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-2 h-2 rounded-full bg-purple-500"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about rates, timing, or optimization..."
            className="flex-1"
          />
          <Button 
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
