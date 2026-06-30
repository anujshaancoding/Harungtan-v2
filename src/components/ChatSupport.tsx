'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'bot' | 'user'
  timestamp: Date
  options?: QuickOption[]
}

interface QuickOption {
  label: string
  value: string
}

const QUICK_REPLIES: QuickOption[] = [
  { label: '📦 Order Status', value: 'order_status' },
  { label: '🚚 Shipping Info', value: 'shipping' },
  { label: '↩️ Returns & Exchanges', value: 'returns' },
  { label: '📏 Size Guide', value: 'sizing' },
  { label: '💳 Payment Methods', value: 'payment' },
  { label: '💬 Contact Support', value: 'contact' },
]

const BOT_RESPONSES: Record<string, { text: string; followUp?: QuickOption[] }> = {
  greeting: {
    text: "Hi there! 👋 Welcome to Harungtan. I'm here to help you with any questions. What can I assist you with today?",
  },
  order_status: {
    text: "To check your order status, please log in to your account and visit the 'My Orders' section under your profile. You'll find real-time tracking information there.\n\nIf you can't find your order, make sure you're using the same email you ordered with.",
    followUp: [
      { label: "I can't log in", value: 'login_help' },
      { label: 'Order is delayed', value: 'order_delayed' },
      { label: '← Back to menu', value: 'menu' },
    ],
  },
  shipping: {
    text: "We offer the following shipping options:\n\n🟢 **Standard Shipping** — 5-7 business days (Free over ₩50,000)\n🟡 **Express Shipping** — 2-3 business days\n🔴 **Next Day Delivery** — Order before 2 PM\n\nAll orders include tracking. You'll receive a confirmation email once shipped.",
    followUp: [
      { label: 'International shipping?', value: 'international' },
      { label: 'Free shipping threshold?', value: 'free_shipping' },
      { label: '← Back to menu', value: 'menu' },
    ],
  },
  returns: {
    text: "Our return policy:\n\n• **30-day return window** from delivery date\n• Items must be unworn, unwashed, with tags attached\n• Free returns on all domestic orders\n• Exchanges available for different sizes/colors\n\nTo start a return, go to 'My Orders' → select the order → 'Request Return'.",
    followUp: [
      { label: 'Item arrived damaged', value: 'damaged' },
      { label: 'Wrong item received', value: 'wrong_item' },
      { label: '← Back to menu', value: 'menu' },
    ],
  },
  sizing: {
    text: "Finding the right size is important! Here are some tips:\n\n📏 Check our **Size Guide** on each product page — it includes detailed measurements in cm/inches.\n\n👕 Our t-shirts have a **relaxed fit**. If you're between sizes, we recommend going with your usual size for a comfortable fit, or size down for a more fitted look.\n\nNeed help with a specific product? Just let me know!",
    followUp: [
      { label: 'Size chart link', value: 'size_chart' },
      { label: "What if it doesn't fit?", value: 'returns' },
      { label: '← Back to menu', value: 'menu' },
    ],
  },
  payment: {
    text: "We accept the following payment methods:\n\n💳 Credit & Debit Cards (Visa, Mastercard, Amex)\n📱 Digital Wallets (Apple Pay, Google Pay)\n🏦 Bank Transfer\n\nAll payments are securely processed through Stripe. Your card details are never stored on our servers.",
    followUp: [
      { label: 'Payment failed', value: 'payment_failed' },
      { label: 'Promo codes', value: 'promo' },
      { label: '← Back to menu', value: 'menu' },
    ],
  },
  contact: {
    text: "You can reach our support team through:\n\n📧 **Email**: support@harungtan.com\n⏰ **Hours**: Mon-Fri, 9 AM - 6 PM KST\n📱 **Response time**: Within 24 hours\n\nFor urgent issues, please include your order number in your message.",
    followUp: [
      { label: '← Back to menu', value: 'menu' },
    ],
  },
  login_help: {
    text: "Having trouble logging in? Try these steps:\n\n1. Click 'Forgot Password' on the login page\n2. Enter your email to receive a reset link\n3. Check your spam folder if you don't see it\n\nIf you still can't access your account, email us at support@harungtan.com with your registered email.",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  order_delayed: {
    text: "Sorry to hear your order is delayed! Here's what to do:\n\n1. Check the tracking link in your shipping confirmation email\n2. Delays can happen during peak seasons or due to carrier issues\n3. If it's been more than 10 business days, please contact us at support@harungtan.com with your order number\n\nWe'll look into it right away!",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  international: {
    text: "We currently ship to select international destinations. International shipping typically takes 7-14 business days.\n\nPlease note that customs duties and import taxes may apply depending on your country. These are the buyer's responsibility.\n\nCheck availability for your country at checkout!",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  free_shipping: {
    text: "Free standard shipping is available on all domestic orders over ₩50,000! The discount is automatically applied at checkout — no code needed. 🎉",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  damaged: {
    text: "We're sorry your item arrived damaged! Please:\n\n1. Take photos of the damage and packaging\n2. Email support@harungtan.com within 48 hours of delivery\n3. Include your order number and the photos\n\nWe'll send a replacement or full refund — no need to return the damaged item.",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  wrong_item: {
    text: "Sorry about that! If you received the wrong item:\n\n1. Email support@harungtan.com with your order number\n2. Let us know what you received vs. what you ordered\n3. We'll arrange a free return label and ship the correct item ASAP\n\nYou won't be charged for the return shipping.",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  size_chart: {
    text: "You can find the size chart on any product page — just click the '📏 Size Guide' link below the size selector.\n\nOur size guide includes:\n• Chest, waist, and length measurements\n• Both cm and inch measurements\n• Fit recommendations\n\nVisit any product page to see the detailed chart!",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  payment_failed: {
    text: "If your payment failed, try these steps:\n\n1. Double-check your card details (number, expiry, CVV)\n2. Ensure your card has sufficient funds\n3. Try a different payment method\n4. Disable any VPN or ad blockers\n\nIf the issue persists, your bank may be blocking the transaction — contact them to authorize it.",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  promo: {
    text: "Have a promo code? Enter it at checkout in the 'Discount Code' field and click 'Apply'.\n\n💡 **Tips:**\n• Only one promo code can be used per order\n• Codes are case-sensitive\n• Check the code's expiry date\n\nSign up for our newsletter to get exclusive offers and early access to sales! 🎁",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
  menu: {
    text: "What else can I help you with?",
  },
  fallback: {
    text: "I'm not sure I understand that. Could you try selecting one of the options below, or type a keyword like 'shipping', 'returns', 'size', or 'payment'?\n\nFor complex questions, please reach out to support@harungtan.com — our team is happy to help!",
    followUp: [{ label: '← Back to menu', value: 'menu' }],
  },
}

function matchIntent(input: string): string {
  const lower = input.toLowerCase().trim()
  const keywords: Record<string, string[]> = {
    order_status: ['order', 'track', 'tracking', 'where is my', 'status', 'delivery'],
    shipping: ['shipping', 'deliver', 'how long', 'ship', 'courier'],
    returns: ['return', 'exchange', 'refund', 'send back', 'money back'],
    sizing: ['size', 'sizing', 'fit', 'measurement', 'chart', 'small', 'medium', 'large'],
    payment: ['payment', 'pay', 'card', 'credit', 'wallet', 'checkout'],
    contact: ['contact', 'email', 'phone', 'support', 'talk', 'human', 'agent', 'help'],
    promo: ['promo', 'coupon', 'discount', 'code', 'sale', 'offer'],
  }

  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) return intent
  }
  return 'fallback'
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatBodyRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // On mobile (fullscreen chat), lock body scroll to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 640
      if (!isMobile) return

      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const addBotMessage = useCallback((key: string) => {
    setIsTyping(true)
    const response = BOT_RESPONSES[key] || BOT_RESPONSES.fallback
    const delay = Math.min(response.text.length * 8, 1500)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          options: response.followUp || (key === 'menu' || key === 'greeting' ? QUICK_REPLIES : undefined),
        },
      ])
      if (!isOpen) setHasUnread(true)
    }, delay)
  }, [isOpen])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setHasUnread(false)
    if (messages.length === 0) {
      addBotMessage('greeting')
    }
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [messages.length, addBotMessage])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text) return

    setMessages(prev => [
      ...prev,
      { id: generateId(), text, sender: 'user', timestamp: new Date() },
    ])
    setInput('')

    const intent = matchIntent(text)
    addBotMessage(intent)
  }, [input, addBotMessage])

  const handleQuickReply = useCallback((option: QuickOption) => {
    setMessages(prev => [
      ...prev,
      { id: generateId(), text: option.label, sender: 'user', timestamp: new Date() },
    ])
    addBotMessage(option.value)
  }, [addBotMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <>
      {/* Chat Toggle Button — positioned above BackToTop */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={handleOpen}
            className="fixed right-6 bottom-[144px] z-40 flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border-none bg-[var(--accent)] text-white shadow-lg transition-shadow duration-200 hover:shadow-xl md:bottom-[88px]"
            aria-label="Open chat support"
          >
            <MessageCircle size={22} strokeWidth={1.5} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-4 bottom-4 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl bg-[var(--background)] shadow-2xl ring-1 ring-[var(--border)] max-sm:inset-0 max-sm:h-full max-sm:w-full max-sm:rounded-none"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-[var(--accent)] px-5 py-4 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Harungtan Support</h3>
                <p className="text-xs opacity-80">Typically replies instantly</p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatBodyRef}
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
              onWheel={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
            >
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.sender === 'bot' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'ml-auto' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'rounded-br-sm bg-[var(--accent)] text-white'
                          : 'rounded-bl-sm bg-[var(--muted)] text-[var(--foreground)]'
                      }`}
                    >
                      {msg.text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </div>
                    {msg.options && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.options.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handleQuickReply(opt)}
                            className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                    <Bot size={14} />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-[var(--muted)] px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Minimize bar */}
            <div className="flex justify-center border-t border-[var(--border)] bg-[var(--background)]">
              <button
                onClick={handleClose}
                className="flex w-full cursor-pointer items-center justify-center gap-1 border-none bg-transparent py-1 text-[10px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                aria-label="Minimize chat"
              >
                <ChevronDown size={12} />
              </button>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--accent)] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
