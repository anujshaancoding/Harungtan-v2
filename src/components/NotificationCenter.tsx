'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle, AlertTriangle, Info, ShoppingBag, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'cart'
  title: string
  message: string
  timestamp: number
  read: boolean
}

const NOTIFICATION_EVENT = 'harungtan-notification'
const STORAGE_KEY = 'harungtan-notifications'

// Call this from anywhere to add a notification
export function pushNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  if (typeof window === 'undefined') return
  const entry: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    read: false,
  }
  // Persist
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Notification[]
  const updated = [entry, ...stored].slice(0, 50) // Max 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, { detail: entry }))
}

const typeIcons = {
  success: CheckCircle,
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  cart: ShoppingBag,
}

const typeColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-amber-500',
  info: 'text-blue-600',
  cart: 'text-[var(--accent)]',
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)

  const loadNotifications = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Notification[]
    setNotifications(stored)
  }, [])

  useEffect(() => {
    setMounted(true)
    loadNotifications()

    const handler = () => loadNotifications()
    window.addEventListener(NOTIFICATION_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(NOTIFICATION_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [loadNotifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.setItem(STORAGE_KEY, '[]')
  }

  const removeNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (!mounted) return null

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) markAllRead()
        }}
        className="relative p-2 transition-colors duration-200 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center bg-[var(--accent)] text-[9px] font-semibold text-white" style={{ borderRadius: '50%' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 max-h-96 overflow-hidden border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)]">
                  Notifications
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[11px] tracking-[0.04em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Bell size={24} strokeWidth={1} className="mb-2 text-[var(--border)]" />
                    <p className="text-[12px] text-[var(--muted-foreground)]">No notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = typeIcons[n.type]
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          'group flex gap-3 border-b border-[var(--border)] px-4 py-3 transition-colors last:border-0',
                          !n.read && 'bg-[var(--muted)]'
                        )}
                      >
                        <Icon size={16} strokeWidth={1.5} className={cn('mt-0.5 shrink-0', typeColors[n.type])} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium text-[var(--foreground)] line-clamp-1">{n.title}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)] line-clamp-2">{n.message}</p>
                          <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">{formatTime(n.timestamp)}</p>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="shrink-0 p-1 opacity-0 transition-opacity group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          aria-label="Remove notification"
                        >
                          <Trash2 size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default NotificationCenter
