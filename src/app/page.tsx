'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign,
  ChevronRight,
  Menu,
  X,
  Send,
  Wallet,
  LineChart,
  Bot,
  Check,
  Star,
  Play,
  ArrowDownUp,
  Lock,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import TransferDemo from '@/components/transfer-demo'
import AIAgentDemo from '@/components/ai-agent-demo'

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: { 
  end: number, 
  suffix?: string, 
  prefix?: string,
  duration?: number 
}) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <ArrowDownUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Nexus Pay
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Demo</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm">Log In</Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-sm font-medium">Features</a>
              <a href="#how-it-works" className="block text-sm font-medium">How it Works</a>
              <a href="#demo" className="block text-sm font-medium">Demo</a>
              <a href="#pricing" className="block text-sm font-medium">Pricing</a>
              <Separator />
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Powered by Hedera Blockchain
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block">Send Money</span>
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Like Information
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-8"
          >
            Instant, low-cost global transfers with invisible DeFi yield. 
            <span className="text-foreground font-medium"> The financial operating system for the next billion users.</span>
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 h-14">
              Start Sending <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14">
              <Play className="mr-2 w-5 h-5" /> Watch Demo
            </Button>
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>2s Settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>180+ Countries</span>
            </div>
          </motion.div>
        </div>
        
        {/* Hero Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden border-2 border-emerald-100 dark:border-emerald-900 shadow-2xl shadow-emerald-500/10">
            <CardContent className="p-0">
              <TransferDemo />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// Stats Section
function StatsSection() {
  const stats = [
    { label: 'Transaction Time', value: 2, suffix: 's', prefix: '', icon: Clock },
    { label: 'Average Fee', value: 0.5, suffix: '%', prefix: '', icon: DollarSign },
    { label: 'Countries Supported', value: 180, suffix: '+', prefix: '', icon: Globe },
    { label: 'Happy Users', value: 50000, suffix: '+', prefix: '', icon: Users },
  ]
  
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Money arrives in seconds, not days. Powered by Hedera&apos;s 10,000+ TPS network.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Invisible Yield',
      description: 'Your money earns 4-8% APY while traveling. DeFi yield without the complexity.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Bot,
      title: 'AI Optimization',
      description: 'Smart routing finds the best rates and timing. Our AI agent works 24/7 for you.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Enterprise-grade security with Hedera&apos;s ABFT consensus. Your funds are always safe.',
      color: 'from-rose-500 to-pink-600'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Send to 180+ countries. MXN, PEN, USD, EUR, and more coming soon.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Lock,
      title: 'Non-Custodial',
      description: 'You control your keys. We never hold your funds. True decentralized finance.',
      color: 'from-indigo-500 to-purple-600'
    }
  ]
  
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Send Money Globally
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Built on Hedera&apos;s enterprise-grade infrastructure, Nexus Pay combines the best of traditional finance with the power of DeFi.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Connect Your Wallet',
      description: 'Link your existing wallet or create a new one in seconds. No KYC required for small amounts.',
      icon: Wallet
    },
    {
      step: '02', 
      title: 'Enter Amount & Destination',
      description: 'Choose how much to send and where. Our AI shows you the best route instantly.',
      icon: Send
    },
    {
      step: '03',
      title: 'Confirm & Send',
      description: 'Review the details and confirm. Your money travels via the optimal DeFi route.',
      icon: Check
    },
    {
      step: '04',
      title: 'Recipient Gets More',
      description: 'Thanks to yield optimization and low fees, recipients get up to 15% more than traditional services.',
      icon: TrendingUp
    }
  ]
  
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Send Money in 4 Simple Steps
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            No complexity. No hidden fees. Just instant, intelligent global transfers.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent -translate-x-8" />
              )}
              
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold bg-background border-2 border-emerald-500 rounded-full w-6 h-6 flex items-center justify-center text-emerald-600">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// AI Agent Demo Section
function AIAgentSection() {
  return (
    <section id="demo" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4">AI-Powered</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Meet Your Personal AI Finance Agent
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our intelligent agent works 24/7 to optimize your transfers. It monitors markets, predicts FX movements, and automatically routes your money for maximum value.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                'Real-time market analysis',
                'Predictive FX optimization',
                'Automatic yield harvesting',
                'Smart timing suggestions'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-2 border-purple-100 dark:border-purple-900 shadow-xl">
              <CardContent className="p-0">
                <AIAgentDemo />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Comparison Section
function ComparisonSection() {
  const comparisons = [
    { feature: 'Transfer Speed', traditional: '3-5 days', nexuspay: '2 seconds' },
    { feature: 'Transaction Fee', traditional: '5-10%', nexuspay: '<1%' },
    { feature: 'Yield on Transfer', traditional: 'None', nexuspay: '4-8% APY' },
    { feature: 'AI Optimization', traditional: 'No', nexuspay: 'Yes' },
    { feature: 'Weekend Transfers', traditional: 'No', nexuspay: '24/7' },
    { feature: 'Hidden Fees', traditional: 'Often', nexuspay: 'Never' },
  ]
  
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Why Nexus Pay</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See the Difference
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Compare Nexus Pay with traditional remittance services and see why thousands are making the switch.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Traditional Services</th>
                    <th className="text-center p-4 font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white">Nexus Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, index) => (
                    <tr key={row.feature} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="text-center p-4 text-muted-foreground">{row.traditional}</td>
                      <td className="text-center p-4 text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20">
                        {row.nexuspay}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            No hidden fees. No surprises. Just the lowest rates in the industry.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Free</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {['Up to $500/month', '0.5% fee', '2-second transfers', 'Email support'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-4">Get Started</Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-2 border-emerald-500 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-2 pt-6">
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {['Up to $10,000/month', '0.3% fee', 'Priority routing', 'AI optimization', 'Phone support'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Enterprise Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {['Unlimited volume', '0.1% fee', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-4">Contact Sales</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
            <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Transfers?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already sending money faster, cheaper, and smarter with Nexus Pay.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-transparent border-white/30 text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <ArrowDownUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Nexus Pay</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The global value layer. Send money like information.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Licenses</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2026 Nexus Pay. All rights reserved.</p>
          <p>Built on Hedera. Powered by DeFi.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AIAgentSection />
        <ComparisonSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
