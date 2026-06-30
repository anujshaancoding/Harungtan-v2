'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

// ─── Free shipping threshold (same as CartSidebar) ───
const FREE_SHIPPING_THRESHOLD = 999

// ─── Harung the Monkey SVG ───
function HarungMonkey({ className, mood = 'default' }: { className?: string; mood?: 'default' | 'happy' | 'thinking' | 'excited' }) {
  const mouthPaths = {
    default: 'M18 26 Q22 30 26 26',     // gentle smile
    happy: 'M17 25 Q22 32 27 25',        // big grin
    thinking: 'M19 27 Q22 27 25 27',     // flat/thinking
    excited: 'M17 24 Q22 31 27 24',      // wide open smile
  }

  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <circle cx="6" cy="18" r="6" fill="#8B5E3C" />
      <circle cx="6" cy="18" r="3.5" fill="#D4A574" />
      <circle cx="38" cy="18" r="6" fill="#8B5E3C" />
      <circle cx="38" cy="18" r="3.5" fill="#D4A574" />

      {/* Head */}
      <ellipse cx="22" cy="22" rx="16" ry="17" fill="#8B5E3C" />

      {/* Face patch (lighter area) */}
      <ellipse cx="22" cy="24" rx="11" ry="12" fill="#D4A574" />

      {/* Sunglasses frame */}
      <rect x="11" y="15" width="9" height="7" rx="2" fill="#1A1A1A" />
      <rect x="24" y="15" width="9" height="7" rx="2" fill="#1A1A1A" />
      <line x1="20" y1="18" x2="24" y2="18" stroke="#1A1A1A" strokeWidth="1.5" />

      {/* Sunglasses shine */}
      <rect x="12.5" y="16.5" width="3" height="1.5" rx="0.75" fill="white" opacity="0.4" />
      <rect x="25.5" y="16.5" width="3" height="1.5" rx="0.75" fill="white" opacity="0.4" />

      {/* Nose */}
      <ellipse cx="22" cy="24" rx="2" ry="1.5" fill="#6B4226" />

      {/* Mouth */}
      <path d={mouthPaths[mood]} stroke="#6B4226" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Beanie hat */}
      <ellipse cx="22" cy="12" rx="14" ry="9" fill="var(--accent, #C45A3C)" />
      <ellipse cx="22" cy="8" rx="12" ry="6" fill="var(--accent, #C45A3C)" />
      <rect x="8" y="10" width="28" height="5" fill="var(--accent, #C45A3C)" />
      {/* Hat brim fold */}
      <rect x="9" y="12" width="26" height="3" rx="1.5" fill="var(--warm-dark, #A84832)" />
      {/* Hat pom-pom */}
      <circle cx="22" cy="4" r="3" fill="var(--accent, #C45A3C)" />
      <circle cx="22" cy="4" r="2" fill="var(--warm-dark, #A84832)" />
    </svg>
  )
}

// ─── Harung's personality lines ───
// He's a cool, fashion-savvy monkey who talks like a fun friend

const GREETINGS = [
  "Yo yo yo! Harung here 🐒 Your personal style monkey. Let's find some fire fits!",
  "Oooh oooh! *adjusts sunglasses* Welcome to Harungtan! I'm Harung, and I've got THE best taste in tees. Let me show you around!",
  "Hey hey! Harung at your service! 🐒 I've been swinging through the collection and found some BANANAS good stuff.",
  "*lands on screen* What's good! I'm Harung — half monkey, half fashion icon. Let's get you dripped out!",
  "🐒 *does a little spin* Welcome, welcome! Harung here. I know every thread in this store. Try me!",
]

const BROWSE_IDLE = [
  "*hangs upside down* Still browsing? Take your time, I'll just chill here looking cool. 🐒",
  "Fun fact: monkeys have excellent taste. Source: me. Let me help you pick something?",
  "*polishes sunglasses* I see you scrolling... that's the look of someone about to make a legendary choice.",
  "Pro tip from your boy Harung: if it catches your eye twice, it's destiny. Just add to cart. 🍌",
  "*yawns stylishly* You've been exploring like a pro. Need a monkey's opinion?",
  "Did you know oversized tees are basically monkey-approved comfort? Just saying. 😎🐒",
]

const PRODUCT_VIEW = [
  "Ooo ooo! *grabs the tee excitedly* This one? THIS ONE? Excellent taste, my friend! 👀",
  "*nods approvingly* That's an 'add to cart first, think later' situation. Trust your monkey. 🐒",
  "*takes notes in tiny notebook* Hmm yes, excellent choice. I'm noting this down for my own wardrobe.",
  "*whispers* Someone was eyeing this 12 seconds ago. It's basically flying off the shelves!",
  "You know what goes great with this? Another one in a different color. Just Harung's honest opinion. 🎨",
]

const COLOR_COMMENTS: Record<string, string[]> = {
  Black: [
    "*puts on matching black sunglasses* Black on black on black. You get it. Classic. 🖤🐒",
    "Black — even monkeys know it matches everything. Including my shades. Chef's kiss!",
  ],
  White: [
    "White tee! *does a little monkey dance* Clean, crispy, main character vibes. LOVE it! ✨",
    "*adjusts beanie* The white tee — where simplicity meets 'who IS that cool person?' energy.",
  ],
  Blue: [
    "Blue! Like the sky I swing through on a good day. Your wardrobe approves. I approve. 💙🐒",
    "*looks at the sky, looks at the tee* Yep. Both gorgeous. Going blue was the right call.",
  ],
  Navy: [
    "Navy! *straightens imaginary tie* Sophisticated but not trying too hard. I rate this 10 bananas. 🍌",
    "Navy pairs with literally everything. Smart move, friend. Even a monkey knows that.",
  ],
  Red: [
    "RED?! *monkey goes wild* Someone's feeling BOLD today! I love the confidence! ❤️‍🔥🐒",
    "Red tee = instant attention magnet. You're going to turn heads! Even mine, and I see a LOT of tees.",
  ],
  Green: [
    "Green! *swings from imaginary vine* Nature called, it wants you to look this good. 🌿🐒",
    "As a monkey who lives in trees, I can confirm: green is ALWAYS the right choice.",
  ],
  Grey: [
    "Grey — the unsung hero of any wardrobe. I'd give it a crown if I had one. 👑🐒",
    "*nods sagely* Going grey? That's basically a cheat code for looking put together. Monkey-approved.",
  ],
  Pink: [
    "PINK! *monkey spins excitedly* Breaking stereotypes and looking fabulous! 💗🐒",
    "Pink is the new... well, pink has ALWAYS been amazing. Even us monkeys know that. Great pick!",
  ],
  Olive: [
    "Olive! Jungle vibes! As a monkey, I'm legally required to love this color. 🫒🐒",
  ],
  Maroon: [
    "Maroon — for those who think red is too mainstream. Respect. *sips imaginary coffee* 🍷🐒",
  ],
  Mustard: [
    "Mustard?! Now THAT'S a statement! Bold, brilliant, banana-colored adjacent. I approve! 🌟🐒",
  ],
  Beige: [
    "Beige — soft, warm, and undeniably chic. Quiet luxury vibes! *whispers* This is the way. 🐒",
  ],
  Lavender: [
    "Lavender! This is giving peaceful, stylish, main character energy. Even I'M jealous. 💜🐒",
  ],
  Teal: [
    "Teal! Standing out from the crowd in the best way. *chef's kiss from a monkey* 🌊🐒",
  ],
}

const SIZE_COMMENTS: Record<string, string[]> = {
  XS: ["XS! Compact but mighty! Like a baby monkey — small but full of attitude. 💫🐒"],
  S: ["Small but stylish! *thumbs up* This is going to be a perfect fit."],
  M: ["Medium! *Goldilocks voice* Just right! Not too tight, not too loose. Perfect. 🐒"],
  L: ["Large and in charge! Comfort meets style. Harung approves! 👍🐒"],
  XL: ["XL — extra room means extra comfort. That's big brain energy right there. 😎🐒"],
  XXL: ["XXL! Go big or go home! And you're going BIG. I respect that energy! 🐒"],
  '3XL': ["3XL — maximum comfort zone ACTIVATED! *monkey celebration dance* 🚀🐒"],
}

const ADD_TO_CART = [
  "*jumps up and down excitedly* YES! Great call! Your wardrobe is about to LEVEL UP! 🎉🐒",
  "Added! *high fives you with tiny monkey hand* That's what I call excellent judgment! ✋🐒",
  "Into the cart it goes! *makes swoosh sound* One step closer to peak drip. 🐒",
  "Cart: upgraded. Style: elevated. Regrets: zero. Harung's approval rating: 100%. 😎🐒",
  "*does a backflip* The cart just got SO much cooler. Shall we keep the momentum going?",
]

const UPSELL_SIMILAR = [
  "*rubs hands together* This would look AMAZING with another design. Same fabric, different vibe. Want me to find one?",
  "Should I pick out two? One for you, one for your sibling. Matching tees = peak bonding. Even monkeys do it! 👫🐒",
  "*whispers conspiratorially* People who bought this also grabbed another color. I'm just the messenger... 🎨",
  "One is great, but two is a MOOD. Same fit, different vibe? Your call, but Harung says go for it! 🐒",
]

const FREE_SHIPPING_NUDGE = (remaining: number) => [
  `*bounces excitedly* Psst... add just ${formatPrice(remaining)} more and shipping is FREE! Harung doesn't lie! 🚚🐒`,
  `You're SO close to free delivery! Just ${formatPrice(remaining)} away. Don't let the shipping monkey win! Wait, I'M a monkey... 🐒`,
  `${formatPrice(remaining)} more = free shipping. That's basically saving money by spending money. Even a monkey can do that math! 🧮🐒`,
  `*tugs your sleeve* The free shipping gods are watching. ${formatPrice(remaining)} more. Don't disappoint them (or me)! 🐒`,
]

const FREE_SHIPPING_ACHIEVED = [
  "*MONKEY GOES ABSOLUTELY WILD* 🎊🐒 FREE SHIPPING UNLOCKED! You basically just made money!",
  "BOOM! Free delivery earned! *does victory dance on branch* The tees are practically paying for themselves! 🚀🐒",
  "*throws confetti* Free shipping! You're officially a shopping genius. Harung bows down. 🙇🐒",
]

const EMPTY_CART_NUDGE = [
  "*peeks into empty cart* Hello? Anybody home? This cart needs some love! 🛒🐒",
  "*sad monkey face* Empty cart? That's the saddest thing I've seen today. Let's fix that!",
  "The cart is giving me the empty eyes... shall we fill it up with some banging tees? 🐒",
]

const WISHLIST_ADD = [
  "*nods knowingly* Saved to wishlist! Playing hard to get with your own wardrobe. Smooth move. 😏🐒",
  "Wishlisted! But between us monkeys... just buy it. You deserve it. Trust Harung. 🐒",
  "Added to wishlist — aka the 'I'll definitely buy this later (or in 5 minutes)' list. 🐒",
]

const COMEBACK = [
  "*swings down from logo* Oh you're BACK! I knew you couldn't stay away from Harung! 😄🐒",
  "Welcome back, fashion friend! *monkey hug* The tees AND I missed you!",
  "Back for more? I like your dedication! *adjusts sunglasses coolly* Let's get it! 🐒",
]

const CHECKOUT_NUDGE = [
  "*drums on checkout button excitedly* Almost there! Your future self is going to LOVE this! 🤩🐒",
  "The checkout button is RIGHT there. You got this! *cheers you on with tiny pom-poms* 💪🐒",
]

const CATEGORY_COMMENTS: Record<string, string[]> = {
  'Oversized': [
    "Oversized! *wraps self in oversized tee like a blanket* Because comfort is the ultimate luxury. 🛋️🐒",
    "Oversized fit = instant cool factor. Even monkeys look fly in these. No cap.",
  ],
  'Graphic Tees': [
    "Graphic tees! *strikes a pose* Let your chest do the talking. Express yourself! 🎨🐒",
    "A graphic tee says 'I have personality' without saying a word. Harung wrote that.",
  ],
  'Polo': [
    "Polo! *adjusts imaginary collar* Smart-casual royalty vibes. Harung sees you! 👔🐒",
  ],
  'V-Neck': [
    "V-Neck! Because your collarbone deserves the spotlight. *fans self dramatically* ✨🐒",
  ],
  'Henley': [
    "Henley buttons = effortless style. This human GETS it! *monkey nod of approval* 🔘🐒",
  ],
  'Crop Top': [
    "Crop top?! Confidence level: THROUGH THE ROOF! Even I'm impressed. 🌟🐒",
  ],
  'Acid Wash': [
    "Acid wash! Retro vibes incoming! *puts on vintage sunglasses* Time-travel fashion! ⏳🐒",
  ],
  'Plain': [
    "Plain tee — the backbone of every great outfit. Respect the basics! *bows* 🤌🐒",
  ],
}

// ─── Helper to pick random item ───
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Trigger types ───
type CompanionTrigger =
  | { type: 'greeting' }
  | { type: 'browse_idle' }
  | { type: 'product_view'; name: string; category?: string }
  | { type: 'color_select'; color: string }
  | { type: 'size_select'; size: string }
  | { type: 'add_to_cart'; name: string }
  | { type: 'free_shipping_nudge'; remaining: number }
  | { type: 'free_shipping_achieved' }
  | { type: 'empty_cart_nudge' }
  | { type: 'wishlist_add' }
  | { type: 'upsell' }
  | { type: 'comeback' }
  | { type: 'checkout_nudge' }

type Mood = 'default' | 'happy' | 'thinking' | 'excited'

function getMessageAndMood(trigger: CompanionTrigger): { text: string; mood: Mood } {
  switch (trigger.type) {
    case 'greeting': return { text: pick(GREETINGS), mood: 'happy' }
    case 'browse_idle': return { text: pick(BROWSE_IDLE), mood: 'thinking' }
    case 'product_view': {
      const msgs = [...PRODUCT_VIEW]
      if (trigger.category && CATEGORY_COMMENTS[trigger.category]) {
        msgs.push(...CATEGORY_COMMENTS[trigger.category])
      }
      return { text: pick(msgs), mood: 'excited' }
    }
    case 'color_select': return { text: pick(COLOR_COMMENTS[trigger.color] || [`${trigger.color}! *monkey nod* Great choice! That's going to look fantastic on you. 🎨🐒`]), mood: 'happy' }
    case 'size_select': return { text: pick(SIZE_COMMENTS[trigger.size] || ["*thumbs up* Great size pick! This is going to fit perfectly. 🐒"]), mood: 'happy' }
    case 'add_to_cart': return { text: pick(ADD_TO_CART), mood: 'excited' }
    case 'free_shipping_nudge': return { text: pick(FREE_SHIPPING_NUDGE(trigger.remaining)), mood: 'excited' }
    case 'free_shipping_achieved': return { text: pick(FREE_SHIPPING_ACHIEVED), mood: 'excited' }
    case 'empty_cart_nudge': return { text: pick(EMPTY_CART_NUDGE), mood: 'thinking' }
    case 'wishlist_add': return { text: pick(WISHLIST_ADD), mood: 'happy' }
    case 'upsell': return { text: pick(UPSELL_SIMILAR), mood: 'thinking' }
    case 'comeback': return { text: pick(COMEBACK), mood: 'happy' }
    case 'checkout_nudge': return { text: pick(CHECKOUT_NUDGE), mood: 'excited' }
  }
}

// ─── Custom event for other components to trigger companion ───
declare global {
  interface WindowEventMap {
    'companion:trigger': CustomEvent<CompanionTrigger>
  }
}

export function triggerCompanion(trigger: CompanionTrigger) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('companion:trigger', { detail: trigger }))
  }
}

// ─── Main Component ───
export default function ShopCompanion() {
  const [message, setMessage] = useState('')
  const [mood, setMood] = useState<Mood>('default')
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lastTriggerRef = useRef(0)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const hasGreetedRef = useRef(false)
  const prevItemCountRef = useRef(0)
  const prevTotalRef = useRef(0)
  const prevPathRef = useRef('')
  const pathname = usePathname()

  const cartItems = useCartStore(s => s.items)
  const cartTotal = useCartStore(s => s.total)()
  const itemCount = useCartStore(s => s.itemCount)()

  const showMessage = useCallback((text: string, newMood: Mood = 'default', duration = 8000) => {
    const now = Date.now()
    if (now - lastTriggerRef.current < 4000) return
    lastTriggerRef.current = now

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setMessage(text)
    setMood(newMood)
    setVisible(true)
    setDismissed(false)

    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      setMood('default')
    }, duration)
  }, [])

  // Listen for custom trigger events
  useEffect(() => {
    function handleTrigger(e: CustomEvent<CompanionTrigger>) {
      const { text, mood: m } = getMessageAndMood(e.detail)
      showMessage(text, m)
    }
    window.addEventListener('companion:trigger', handleTrigger)
    return () => window.removeEventListener('companion:trigger', handleTrigger)
  }, [showMessage])

  // ─── Greeting on first visit ───
  useEffect(() => {
    if (hasGreetedRef.current) return
    hasGreetedRef.current = true

    const hasVisited = sessionStorage.getItem('harungtan-companion-visited')
    const trigger: CompanionTrigger = hasVisited ? { type: 'comeback' } : { type: 'greeting' }
    sessionStorage.setItem('harungtan-companion-visited', '1')

    const timer = setTimeout(() => {
      const { text, mood: m } = getMessageAndMood(trigger)
      showMessage(text, m, 10000)
    }, 2500)
    return () => clearTimeout(timer)
  }, [showMessage])

  // ─── Route change detection ───
  useEffect(() => {
    if (prevPathRef.current === pathname) return
    const prevPath = prevPathRef.current
    prevPathRef.current = pathname

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      const { text, mood: m } = getMessageAndMood({ type: 'browse_idle' })
      showMessage(text, m)
    }, 45000)

    if (pathname.startsWith('/products/') && pathname !== '/products') {
      const timer = setTimeout(() => {
        if (Date.now() - lastTriggerRef.current > 3000) {
          const { text, mood: m } = getMessageAndMood({ type: 'product_view', name: '' })
          showMessage(text, m)
        }
      }, 3500)
      return () => clearTimeout(timer)
    }

    if (pathname.startsWith('/checkout') && prevPath !== pathname) {
      const timer = setTimeout(() => {
        const { text, mood: m } = getMessageAndMood({ type: 'checkout_nudge' })
        showMessage(text, m)
      }, 2000)
      return () => clearTimeout(timer)
    }

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [pathname, showMessage])

  // ─── Cart change detection ───
  useEffect(() => {
    const prevCount = prevItemCountRef.current
    const prevTotal = prevTotalRef.current
    prevItemCountRef.current = itemCount
    prevTotalRef.current = cartTotal

    if (prevCount === 0 && prevTotal === 0 && itemCount === 0) return

    if (itemCount > prevCount) {
      const newItem = cartItems[cartItems.length - 1]
      const { text, mood: m } = getMessageAndMood({ type: 'add_to_cart', name: newItem?.name || '' })
      showMessage(text, m)

      setTimeout(() => {
        const total = cartTotal
        const remaining = FREE_SHIPPING_THRESHOLD - total

        if (remaining <= 0 && prevTotal < FREE_SHIPPING_THRESHOLD) {
          const r = getMessageAndMood({ type: 'free_shipping_achieved' })
          showMessage(r.text, r.mood)
        } else if (remaining > 0 && remaining < 500) {
          const r = getMessageAndMood({ type: 'free_shipping_nudge', remaining })
          showMessage(r.text, r.mood)
        } else if (Math.random() > 0.5) {
          const r = getMessageAndMood({ type: 'upsell' })
          showMessage(r.text, r.mood)
        }
      }, 5000)
    }

    if (itemCount === 0 && prevCount > 0) {
      setTimeout(() => {
        const { text, mood: m } = getMessageAndMood({ type: 'empty_cart_nudge' })
        showMessage(text, m)
      }, 2000)
    }
  }, [itemCount, cartTotal, cartItems, showMessage])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
  }

  const handleMinimize = () => {
    setMinimized(!minimized)
    if (minimized && message) {
      setVisible(true)
    }
  }

  return (
    <motion.div
      className="fixed bottom-10 left-6 z-40 flex flex-col items-start gap-2 max-sm:bottom-[88px] max-sm:left-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      {/* Thought bubble */}
      <AnimatePresence>
        {visible && !dismissed && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mb-2 max-w-[300px] rounded-2xl rounded-bl-md bg-[var(--background)] px-4 py-3 text-[13px] leading-relaxed text-[var(--foreground)] shadow-lg ring-1 ring-[var(--border)] max-sm:max-w-[260px]"
          >
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--border)]"
              aria-label="Dismiss"
            >
              <X size={10} />
            </button>

            {/* Harung label */}
            <span className="mb-1 block text-[10px] font-bold tracking-wider text-[var(--accent)] uppercase">Harung says</span>
            <p className="m-0">{message}</p>

            {/* Thought bubble connector dots */}
            <div className="absolute -bottom-2.5 left-6 flex items-end gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--background)] shadow-sm ring-1 ring-[var(--border)]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--background)] shadow-sm ring-1 ring-[var(--border)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Harung the Monkey mascot */}
      <motion.button
        onClick={handleMinimize}
        className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--background)] shadow-lg transition-shadow hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -3, 0] }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-label={minimized ? 'Show Harung' : 'Minimize Harung'}
      >
        <HarungMonkey className="h-11 w-11" mood={mood} />

        {/* Name tag */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase whitespace-nowrap shadow-sm">
          Harung
        </span>

        {/* Pulse ring when talking */}
        {visible && !minimized && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[var(--accent)]"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}
