'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, Sparkles } from 'lucide-react'

interface SizeQuizProps {
  isOpen: boolean
  onClose: () => void
  onSizeSelect: (size: string) => void
}

type Gender = 'Male' | 'Female' | 'Unisex'
type Height = 'Under 5\'4"' | '5\'4" - 5\'7"' | '5\'8" - 5\'11"' | '6\'0" - 6\'2"' | 'Above 6\'2"'
type Build = 'Slim' | 'Athletic' | 'Average' | 'Broad'
type FitPreference = 'Fitted' | 'Regular' | 'Oversized'

const SIZES_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Unisex']
const HEIGHT_OPTIONS: Height[] = [
  'Under 5\'4"',
  '5\'4" - 5\'7"',
  '5\'8" - 5\'11"',
  '6\'0" - 6\'2"',
  'Above 6\'2"',
]
const BUILD_OPTIONS: Build[] = ['Slim', 'Athletic', 'Average', 'Broad']
const FIT_OPTIONS: { label: FitPreference; description: string }[] = [
  { label: 'Fitted', description: 'Close to body' },
  { label: 'Regular', description: 'Relaxed' },
  { label: 'Oversized', description: 'Loose & roomy' },
]

function getHeightGroup(height: Height): number {
  switch (height) {
    case 'Under 5\'4"':
      return 0
    case '5\'4" - 5\'7"':
      return 1
    case '5\'8" - 5\'11"':
      return 2
    case '6\'0" - 6\'2"':
    case 'Above 6\'2"':
      return 3
  }
}

function calculateSize(build: Build, height: Height, fit: FitPreference): string {
  const heightGroup = getHeightGroup(height)

  let sizeIndex: number

  if (build === 'Slim') {
    // Slim: XS, S, M, L
    sizeIndex = heightGroup // 0=XS, 1=S, 2=M, 3=L
  } else if (build === 'Athletic' || build === 'Average') {
    // Athletic/Average: S, M, L, XL
    sizeIndex = heightGroup + 1 // 0=S, 1=M, 2=L, 3=XL
  } else {
    // Broad: M, L, XL, XXL
    sizeIndex = heightGroup + 2 // 0=M, 1=L, 2=XL, 3=XXL
  }

  // Apply fit preference
  if (fit === 'Oversized') {
    sizeIndex = Math.min(sizeIndex + 1, SIZES_ORDER.length - 1)
  }
  // Fitted keeps as-is

  return SIZES_ORDER[Math.min(Math.max(sizeIndex, 0), SIZES_ORDER.length - 1)]
}

function getSizeExplanation(build: Build, fit: FitPreference, size: string): string {
  const fitText =
    fit === 'Oversized'
      ? 'Since you prefer an oversized fit, we bumped up one size for that extra room.'
      : fit === 'Fitted'
        ? 'This will give you the close, tailored fit you prefer.'
        : 'This should give you a comfortable, relaxed fit.'

  return `Based on your ${build.toLowerCase()} build and preferences, we recommend size ${size}. ${fitText}`
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
}

export function SizeQuiz({ isOpen, onClose, onSizeSelect }: SizeQuizProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [gender, setGender] = useState<Gender | null>(null)
  const [height, setHeight] = useState<Height | null>(null)
  const [build, setBuild] = useState<Build | null>(null)
  const [fit, setFit] = useState<FitPreference | null>(null)

  const totalSteps = 4
  const isResult = step === 4

  const recommendedSize =
    build && height && fit ? calculateSize(build, height, fit) : null

  const resetAndClose = useCallback(() => {
    setStep(0)
    setDirection(1)
    setGender(null)
    setHeight(null)
    setBuild(null)
    setFit(null)
    onClose()
  }, [onClose])

  const goNext = useCallback(() => {
    setDirection(1)
    setStep((s) => s + 1)
  }, [])

  const goBack = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const handleSelectSize = useCallback(() => {
    if (recommendedSize) {
      onSizeSelect(recommendedSize)
      resetAndClose()
    }
  }, [recommendedSize, onSizeSelect, resetAndClose])

  if (!isOpen) return null

  const progressPercent = isResult ? 100 : ((step + 1) / totalSteps) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={resetAndClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4 overflow-hidden"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ backgroundColor: 'var(--muted)' }}>
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--accent)' }}
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            {step > 0 && !isResult && (
              <button
                onClick={goBack}
                className="flex items-center justify-center transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label="Go back"
              >
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
            )}
            {!isResult && (
              <span
                className="text-[11px] font-medium tracking-[0.15em] uppercase"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Step {step + 1} of {totalSteps}
              </span>
            )}
            {isResult && (
              <span
                className="text-[11px] font-medium tracking-[0.15em] uppercase"
                style={{ color: 'var(--accent)' }}
              >
                Your Result
              </span>
            )}
          </div>
          <button
            onClick={resetAndClose}
            className="flex items-center justify-center transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Close size quiz"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 min-h-[360px] overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div
                key="gender"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <h2
                  className="heading-editorial text-xl mb-6"
                  style={{ color: 'var(--foreground)' }}
                >
                  What&apos;s your gender?
                </h2>
                <div className="flex flex-col gap-3">
                  {GENDER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setGender(option)
                        goNext()
                      }}
                      className="w-full py-4 px-5 text-left text-[13px] font-medium tracking-wide border transition-all"
                      style={{
                        borderColor:
                          gender === option
                            ? 'var(--foreground)'
                            : 'var(--border)',
                        backgroundColor:
                          gender === option
                            ? 'var(--muted)'
                            : 'var(--background)',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={(e) => {
                        if (gender !== option) {
                          e.currentTarget.style.borderColor = 'var(--muted-foreground)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (gender !== option) {
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="height"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <h2
                  className="heading-editorial text-xl mb-6"
                  style={{ color: 'var(--foreground)' }}
                >
                  What&apos;s your height?
                </h2>
                <div className="flex flex-col gap-3">
                  {HEIGHT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setHeight(option)
                        goNext()
                      }}
                      className="w-full py-4 px-5 text-left text-[13px] font-medium tracking-wide border transition-all"
                      style={{
                        borderColor:
                          height === option
                            ? 'var(--foreground)'
                            : 'var(--border)',
                        backgroundColor:
                          height === option
                            ? 'var(--muted)'
                            : 'var(--background)',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={(e) => {
                        if (height !== option) {
                          e.currentTarget.style.borderColor = 'var(--muted-foreground)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (height !== option) {
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="build"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <h2
                  className="heading-editorial text-xl mb-6"
                  style={{ color: 'var(--foreground)' }}
                >
                  How would you describe your build?
                </h2>
                <div className="flex flex-col gap-3">
                  {BUILD_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setBuild(option)
                        goNext()
                      }}
                      className="w-full py-4 px-5 text-left text-[13px] font-medium tracking-wide border transition-all"
                      style={{
                        borderColor:
                          build === option
                            ? 'var(--foreground)'
                            : 'var(--border)',
                        backgroundColor:
                          build === option
                            ? 'var(--muted)'
                            : 'var(--background)',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={(e) => {
                        if (build !== option) {
                          e.currentTarget.style.borderColor = 'var(--muted-foreground)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (build !== option) {
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="fit"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <h2
                  className="heading-editorial text-xl mb-6"
                  style={{ color: 'var(--foreground)' }}
                >
                  How do you prefer your fit?
                </h2>
                <div className="flex flex-col gap-3">
                  {FIT_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => {
                        setFit(option.label)
                        goNext()
                      }}
                      className="w-full py-4 px-5 text-left border transition-all"
                      style={{
                        borderColor:
                          fit === option.label
                            ? 'var(--foreground)'
                            : 'var(--border)',
                        backgroundColor:
                          fit === option.label
                            ? 'var(--muted)'
                            : 'var(--background)',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={(e) => {
                        if (fit !== option.label) {
                          e.currentTarget.style.borderColor = 'var(--muted-foreground)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (fit !== option.label) {
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }
                      }}
                    >
                      <span className="block text-[13px] font-medium tracking-wide">
                        {option.label}
                      </span>
                      <span
                        className="block mt-1 text-[11px] tracking-wide"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {isResult && recommendedSize && build && fit && (
              <motion.div
                key="result"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
                  className="mb-2"
                >
                  <Sparkles
                    size={24}
                    strokeWidth={1.5}
                    style={{ color: 'var(--accent)' }}
                  />
                </motion.div>

                <p
                  className="subheading text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Your Recommended Size
                </p>

                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                  className="flex items-center justify-center w-24 h-24 mb-6 border-2"
                  style={{
                    borderColor: 'var(--foreground)',
                    color: 'var(--foreground)',
                  }}
                >
                  <span className="heading-editorial text-4xl font-normal">
                    {recommendedSize}
                  </span>
                </motion.div>

                <p
                  className="text-[13px] leading-relaxed mb-8 max-w-xs"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {getSizeExplanation(build, fit, recommendedSize)}
                </p>

                <button
                  onClick={handleSelectSize}
                  className="w-full h-12 text-[13px] font-medium tracking-[0.15em] uppercase transition-all"
                  style={{
                    backgroundColor: 'var(--foreground)',
                    color: 'var(--background)',
                    border: 'none',
                  }}
                >
                  Select This Size
                </button>

                <button
                  onClick={() => {
                    setStep(0)
                    setDirection(-1)
                    setGender(null)
                    setHeight(null)
                    setBuild(null)
                    setFit(null)
                  }}
                  className="mt-3 text-[11px] tracking-wide transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Retake Quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default SizeQuiz
