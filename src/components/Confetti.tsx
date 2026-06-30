'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#C45A3C', '#1A1A1A', '#D4755A', '#E8E6E1', '#059669', '#CA8A04', '#2563EB']

interface Piece {
  id: number
  x: number
  color: string
  delay: number
  size: number
  rotation: number
}

export default function Confetti({ duration = 3000 }: { duration?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const generated: Piece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.8,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
    setPieces(generated)

    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible || pieces.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
