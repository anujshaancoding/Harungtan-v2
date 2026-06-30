'use client'

import { Modal } from '@/components/ui/Modal'

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
}

const SIZE_DATA = [
  { size: 'XS', chest: '34-36', waist: '26-28', hip: '34-36', length: '26' },
  { size: 'S', chest: '36-38', waist: '28-30', hip: '36-38', length: '27' },
  { size: 'M', chest: '38-40', waist: '30-32', hip: '38-40', length: '28' },
  { size: 'L', chest: '40-42', waist: '32-34', hip: '40-42', length: '29' },
  { size: 'XL', chest: '42-44', waist: '34-36', hip: '42-44', length: '30' },
  { size: 'XXL', chest: '44-46', waist: '36-38', hip: '44-46', length: '31' },
  { size: '3XL', chest: '46-48', waist: '38-40', hip: '46-48', length: '32' },
]

const HOW_TO_MEASURE = [
  {
    label: 'Chest',
    instruction:
      'Measure around the fullest part of your chest, keeping the tape level under your arms and across the shoulder blades.',
  },
  {
    label: 'Waist',
    instruction:
      'Measure around your natural waistline, which is the narrowest part of your torso, usually just above the belly button.',
  },
  {
    label: 'Hip',
    instruction:
      'Stand with your feet together and measure around the fullest part of your hips.',
  },
  {
    label: 'Length',
    instruction:
      'Measure from the highest point of the shoulder to the bottom hem of the garment.',
  },
]

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide" size="lg">
      <div className="max-h-[70vh] overflow-y-auto">
        {/* Size table */}
        <div className="mb-8 overflow-x-auto">
          <p className="subheading mb-3 text-[var(--muted-foreground)]">
            All measurements are in inches.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--foreground)]">
                <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)]">
                  Size
                </th>
                <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)]">
                  Chest
                </th>
                <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)]">
                  Waist
                </th>
                <th className="pb-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)]">
                  Hip
                </th>
                <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground)]">
                  Length
                </th>
              </tr>
            </thead>
            <tbody>
              {SIZE_DATA.map((row, idx) => (
                <tr
                  key={row.size}
                  className={`border-b border-[var(--border)] ${
                    idx % 2 === 0 ? 'bg-[var(--muted)]' : 'bg-white'
                  }`}
                >
                  <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                    {row.size}
                  </td>
                  <td className="py-3 pr-4 text-[var(--muted-foreground)]">{row.chest}</td>
                  <td className="py-3 pr-4 text-[var(--muted-foreground)]">{row.waist}</td>
                  <td className="py-3 pr-4 text-[var(--muted-foreground)]">{row.hip}</td>
                  <td className="py-3 text-[var(--muted-foreground)]">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure */}
        <div>
          <h3 className="heading-editorial mb-4 text-base text-[var(--foreground)]">
            How to Measure
          </h3>
          <div className="space-y-3">
            {HOW_TO_MEASURE.map((item) => (
              <div key={item.label} className="border-l-2 border-[var(--accent)] pl-4">
                <p className="text-sm">
                  <span className="font-medium text-[var(--foreground)]">{item.label}:</span>{' '}
                  <span className="text-[var(--muted-foreground)]">{item.instruction}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[var(--muted-foreground)]">
            If you are between sizes, we recommend ordering the larger size for a
            more comfortable fit.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default SizeGuide
