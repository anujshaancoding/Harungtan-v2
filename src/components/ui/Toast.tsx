'use client'

import toast, { Toaster as HotToaster } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertTriangle, Info, Undo2 } from 'lucide-react'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          padding: '14px 18px',
          fontSize: '14px',
          borderRadius: '0px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          fontFamily: 'inherit',
        },
        success: {
          iconTheme: { primary: '#16a34a', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#dc2626', secondary: '#fff' },
        },
      }}
    />
  )
}

export const showToast = {
  success: (message: string) =>
    toast.success(message, {
      icon: <CheckCircle size={18} strokeWidth={1.5} className="text-green-600" />,
    }),
  error: (message: string) =>
    toast.error(message, {
      icon: <XCircle size={18} strokeWidth={1.5} className="text-red-600" />,
    }),
  warning: (message: string) =>
    toast(message, {
      icon: <AlertTriangle size={18} strokeWidth={1.5} className="text-amber-500" />,
    }),
  info: (message: string) =>
    toast(message, {
      icon: <Info size={18} strokeWidth={1.5} className="text-blue-600" />,
    }),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId?: string) => toast.dismiss(toastId),
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toast.promise(promise, messages),
  withUndo: (message: string, onUndo: () => void) =>
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-[13px]">{message}</span>
          <button
            onClick={() => {
              onUndo()
              toast.dismiss(t.id)
            }}
            className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.06em] transition-colors hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <Undo2 size={12} strokeWidth={1.5} />
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    ),
}

export default Toaster
