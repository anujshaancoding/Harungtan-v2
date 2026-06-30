'use client'

export default function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="btn-primary"
    >
      Try Again
    </button>
  )
}
