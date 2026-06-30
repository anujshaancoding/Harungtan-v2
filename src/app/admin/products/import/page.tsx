'use client'

import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react'
import Papa from 'papaparse'
import { cn } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'

interface ProductRow {
  name: string
  description: string
  price: string
  comparePrice?: string
  category: string
  gender: string
  sizes: string
  colors: string
  images?: string
  material?: string
  stock?: string
  featured?: string
  [key: string]: string | undefined
}

interface ValidationError {
  row: number
  field: string
  message: string
}

export default function BulkImportPage() {
  const [rows, setRows] = useState<ProductRow[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(0)

  const validateRows = useCallback((data: ProductRow[]): ValidationError[] => {
    const errs: ValidationError[] = []
    data.forEach((row, i) => {
      if (!row.name?.trim()) errs.push({ row: i + 1, field: 'name', message: 'Name is required' })
      if (!row.description?.trim()) errs.push({ row: i + 1, field: 'description', message: 'Description is required' })
      if (!row.price || isNaN(Number(row.price)) || Number(row.price) <= 0) errs.push({ row: i + 1, field: 'price', message: 'Valid price required' })
      if (!row.category?.trim()) errs.push({ row: i + 1, field: 'category', message: 'Category is required' })
      if (!row.gender?.trim()) errs.push({ row: i + 1, field: 'gender', message: 'Gender is required' })
      if (!row.sizes?.trim()) errs.push({ row: i + 1, field: 'sizes', message: 'At least one size required' })
      if (!row.colors?.trim()) errs.push({ row: i + 1, field: 'colors', message: 'At least one color required' })
    })
    return errs
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setImported(0)

    Papa.parse<ProductRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
        setRows(data)
        setErrors(validateRows(data))
      },
    })
  }, [validateRows])

  const handleImport = async () => {
    if (errors.length > 0) {
      showToast.error('Fix validation errors before importing')
      return
    }

    setImporting(true)
    let count = 0

    try {
      const products = rows.map((row) => ({
        name: row.name.trim(),
        description: row.description.trim(),
        price: parseFloat(row.price),
        comparePrice: row.comparePrice ? parseFloat(row.comparePrice) : null,
        category: row.category.trim().toLowerCase().replace(/\s+/g, '-'),
        gender: row.gender.trim().toLowerCase(),
        sizes: row.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: row.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: row.images ? row.images.split(',').map((u) => u.trim()).filter(Boolean) : [],
        material: row.material?.trim() || null,
        stock: row.stock ? parseInt(row.stock) : 0,
        featured: row.featured?.toLowerCase() === 'true',
      }))

      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      })

      if (res.ok) {
        const data = await res.json()
        count = data.imported || products.length
        setImported(count)
        showToast.success(`Successfully imported ${count} products`)
      } else {
        showToast.error('Failed to import products')
      }
    } catch {
      showToast.error('Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handleClear = () => {
    setRows([])
    setErrors([])
    setFileName('')
    setImported(0)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading-editorial text-2xl" style={{ color: 'var(--foreground)' }}>Bulk Import</h1>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
          Upload a CSV file to import products in bulk
        </p>
        <div className="divider-accent mt-3" />
      </div>

      {/* Upload Zone */}
      <div
        className="border-2 border-dashed p-10 text-center transition-colors hover:border-[var(--foreground)]"
        style={{ borderColor: 'var(--border)' }}
      >
        <Upload size={40} strokeWidth={1} className="mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
        <p className="text-[13px]" style={{ color: 'var(--foreground)' }}>
          Drop your CSV file here or click to browse
        </p>
        <p className="mt-1 text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
          Required columns: name, description, price, category, gender, sizes, colors
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="absolute inset-0 cursor-pointer opacity-0"
          style={{ position: 'relative' }}
        />
        <label className="mt-4 inline-block cursor-pointer">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          <span
            className="px-6 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase cursor-pointer"
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
          >
            Choose File
          </span>
        </label>
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={18} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
              <span className="text-[13px] font-medium" style={{ color: 'var(--foreground)' }}>
                {fileName} — {rows.length} products
              </span>
              {errors.length > 0 && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: '#DC2626' }}>
                  <AlertCircle size={12} /> {errors.length} errors
                </span>
              )}
              {errors.length === 0 && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: '#059669' }}>
                  <CheckCircle size={12} /> Valid
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase border"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Clear
              </button>
              <button
                onClick={handleImport}
                disabled={importing || errors.length > 0}
                className="px-6 py-2 text-[11px] font-medium tracking-[0.1em] uppercase disabled:opacity-50"
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
              >
                {importing ? 'Importing...' : `Import ${rows.length} Products`}
              </button>
            </div>
          </div>

          {imported > 0 && (
            <div
              className="flex items-center gap-2 border p-4"
              style={{ borderColor: '#059669', backgroundColor: '#F0FDF4' }}
            >
              <CheckCircle size={16} style={{ color: '#059669' }} />
              <span className="text-[13px]" style={{ color: '#059669' }}>
                Successfully imported {imported} products
              </span>
            </div>
          )}

          {/* Error list */}
          {errors.length > 0 && (
            <div className="max-h-40 overflow-y-auto border p-3" style={{ borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }}>
              {errors.slice(0, 20).map((err, i) => (
                <p key={i} className="text-[11px] py-0.5" style={{ color: '#DC2626' }}>
                  Row {err.row}: {err.field} — {err.message}
                </p>
              ))}
              {errors.length > 20 && (
                <p className="text-[11px] mt-1 font-medium" style={{ color: '#DC2626' }}>
                  ... and {errors.length - 20} more errors
                </p>
              )}
            </div>
          )}

          {/* Data preview table */}
          <div className="overflow-x-auto border" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-[11px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>#</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Name</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Price</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Category</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Gender</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Sizes</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Colors</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((row, i) => {
                  const rowErrors = errors.filter((e) => e.row === i + 1)
                  return (
                    <tr key={i} className={cn(rowErrors.length > 0 && 'bg-red-50')}>
                      <td className="px-3 py-2" style={{ color: 'var(--muted-foreground)' }}>{i + 1}</td>
                      <td className="px-3 py-2 font-medium" style={{ color: 'var(--foreground)' }}>{row.name || '—'}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--foreground)' }}>₹{row.price || '—'}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--foreground)' }}>{row.category || '—'}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--foreground)' }}>{row.gender || '—'}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--foreground)' }}>{row.sizes || '—'}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--foreground)' }}>{row.colors || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {rows.length > 10 && (
              <p className="px-3 py-2 text-center text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
                Showing first 10 of {rows.length} rows
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
