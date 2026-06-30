export default function MarqueeBanner() {
  const text =
    'FREE SHIPPING OVER \u20B9999  \u00B7  PREMIUM 100% COTTON  \u00B7  MADE IN INDIA  \u00B7  EASY 7-DAY RETURNS  \u00B7  '

  return (
    <div className="overflow-hidden bg-[var(--foreground)] py-3">
      <div className="animate-marquee whitespace-nowrap flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 mx-0"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
