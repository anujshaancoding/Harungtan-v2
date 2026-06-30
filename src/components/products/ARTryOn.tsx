'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, RotateCcw, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ARTryOnProps {
  productImage: string
  productName: string
  className?: string
}

export function ARTryOnButton({ productImage, productName, className }: ARTryOnProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [overlayPosition, setOverlayPosition] = useState({ x: 50, y: 40, scale: 0.6 })
  const [isDragging, setIsDragging] = useState(false)
  const [captured, setCaptured] = useState<string | null>(null)

  useEffect(() => {
    // Check camera support
    if (typeof navigator.mediaDevices?.getUserMedia === 'function') {
      setHasCamera(true)
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      // Camera denied
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const handleOpen = () => {
    setIsOpen(true)
    setCaptured(null)
    setTimeout(startCamera, 300)
  }

  const handleClose = () => {
    stopCamera()
    setIsOpen(false)
    setCaptured(null)
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw video frame
    ctx.drawImage(video, 0, 0)

    // Draw product overlay
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const w = canvas.width * overlayPosition.scale
      const h = w * (4 / 3)
      const x = (overlayPosition.x / 100) * canvas.width - w / 2
      const y = (overlayPosition.y / 100) * canvas.height - h / 2

      ctx.globalAlpha = 0.85
      ctx.drawImage(img, x, y, w, h)
      ctx.globalAlpha = 1

      setCaptured(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.src = productImage
  }

  const handleDownload = () => {
    if (!captured) return
    const a = document.createElement('a')
    a.href = captured
    a.download = `harungtan-tryon-${productName.toLowerCase().replace(/\s+/g, '-')}.jpg`
    a.click()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const container = e.currentTarget.getBoundingClientRect()
    setOverlayPosition((prev) => ({
      ...prev,
      x: ((touch.clientX - container.left) / container.width) * 100,
      y: ((touch.clientY - container.top) / container.height) * 100,
    }))
  }

  if (!hasCamera) return null

  return (
    <>
      <button
        onClick={handleOpen}
        className={cn(
          'flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors',
          className
        )}
        style={{ color: 'var(--accent)' }}
      >
        <Camera size={14} strokeWidth={1.5} />
        Try On
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ backgroundColor: '#000' }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-[13px] font-medium tracking-wide text-white">
                Virtual Try-On
              </h3>
              <button onClick={handleClose} className="p-1 text-white">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div
              className="relative flex-1 overflow-hidden"
              onTouchStart={() => setIsDragging(true)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => setIsDragging(false)}
            >
              {captured ? (
                <img src={captured} alt="Try-on capture" className="h-full w-full object-contain" />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {/* Product overlay */}
                  <div
                    className="pointer-events-none absolute"
                    style={{
                      left: `${overlayPosition.x}%`,
                      top: `${overlayPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${overlayPosition.scale * 100}%`,
                      opacity: 0.85,
                    }}
                  >
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full"
                      style={{ aspectRatio: '3/4', objectFit: 'contain' }}
                    />
                  </div>
                </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 px-4 py-6" style={{ backgroundColor: '#111' }}>
              {captured ? (
                <>
                  <button
                    onClick={() => setCaptured(null)}
                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase text-white"
                    style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    <RotateCcw size={14} strokeWidth={1.5} />
                    Retake
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-2 text-[11px] font-medium tracking-[0.1em] uppercase"
                    style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                  >
                    <Download size={14} strokeWidth={1.5} />
                    Save Photo
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[11px] tracking-wide text-white/50">
                    Drag to adjust position
                  </p>
                  <button
                    onClick={handleCapture}
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ border: '3px solid white' }}
                  >
                    <div className="h-12 w-12 rounded-full bg-white" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOverlayPosition((p) => ({ ...p, scale: Math.max(0.3, p.scale - 0.1) }))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                      style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                    >
                      −
                    </button>
                    <button
                      onClick={() => setOverlayPosition((p) => ({ ...p, scale: Math.min(1, p.scale + 0.1) }))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                      style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                    >
                      +
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
