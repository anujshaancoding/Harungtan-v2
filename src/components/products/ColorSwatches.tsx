'use client'

import { COLORS } from '@/lib/utils'

interface ColorSwatchesProps {
  colors: string[]
  onColorHover?: (color: string) => void
  onColorLeave?: () => void
}

function getColorHex(colorName: string): string {
  const found = COLORS.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase()
  )
  return found?.hex || '#6B7280'
}

const MAX_VISIBLE = 4

export function ColorSwatches({
  colors,
  onColorHover,
  onColorLeave,
}: ColorSwatchesProps) {
  if (!colors || colors.length === 0) return null

  const visibleColors = colors.slice(0, MAX_VISIBLE)
  const remaining = colors.length - MAX_VISIBLE

  return (
    <div className="flex items-center gap-1.5">
      {visibleColors.map((color) => {
        const hex = getColorHex(color)
        const isWhite = hex.toUpperCase() === '#FFFFFF'

        return (
          <button
            key={color}
            type="button"
            className="group/swatch relative flex-shrink-0 transition-transform duration-200 hover:scale-125"
            style={{
              width: 14,
              height: 14,
            }}
            title={color}
            onMouseEnter={() => onColorHover?.(color)}
            onMouseLeave={() => onColorLeave?.()}
          >
            <span
              className="block w-full h-full"
              style={{
                backgroundColor: hex,
                border: `1px solid ${isWhite ? 'var(--border)' : hex}`,
              }}
            />
          </button>
        )
      })}
      {remaining > 0 && (
        <span
          className="flex-shrink-0 text-[10px] font-medium tracking-wide"
          style={{ color: 'var(--muted-foreground)' }}
        >
          +{remaining}
        </span>
      )}
    </div>
  )
}

export default ColorSwatches
