// Script to generate favicon, PWA icons, apple-touch-icon, and og-image
// Run: node scripts/generate-icons.js
// Requires: sharp (npm install sharp --save-dev if not present)

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const publicDir = path.join(__dirname, '..', 'public')
const iconsDir = path.join(publicDir, 'icons')

// SVG logo with dark background for icons
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="64" fill="#0a0a0a"/>
  <g transform="translate(56, 40) scale(0.3)" fill="#ffffff">
    <path d="M14.8 1014.63V434.74H245.12V1014.63ZM944.29 1594.52V434.74H1174.59V1594.52ZM14.8 1594.52V1362.57C14.8 1298.51 30.54 1240.24 62.02 1187.77 93.51 1135.31 135.48 1093.33 187.94 1061.85 240.41 1030.38 298.68 1014.63 362.74 1014.63H826.66V1246.59H362.74C330.71 1246.59 303.37 1257.91 280.73 1280.56 258.09 1303.2 246.77 1330.54 246.77 1362.57V1594.52Z"/>
    <path d="M480.38 1340.66V528.82C480.38 496.79 468.78 469.45 445.59 446.8 422.39 424.16 394.77 412.84 362.74 412.84H14.8V180.88H362.74C426.8 180.88 485.07 196.63 537.54 228.1 590.01 259.58 631.98 301.55 663.46 354.02 694.94 406.49 710.68 464.76 710.68 528.82V1340.66ZM710.68 412.84V180.88H1174.59V412.84Z"/>
  </g>
</svg>`

// OG image SVG (1200x630)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <g transform="translate(420, 100) scale(0.25)" fill="#ffffff">
    <path d="M14.8 1014.63V434.74H245.12V1014.63ZM944.29 1594.52V434.74H1174.59V1594.52ZM14.8 1594.52V1362.57C14.8 1298.51 30.54 1240.24 62.02 1187.77 93.51 1135.31 135.48 1093.33 187.94 1061.85 240.41 1030.38 298.68 1014.63 362.74 1014.63H826.66V1246.59H362.74C330.71 1246.59 303.37 1257.91 280.73 1280.56 258.09 1303.2 246.77 1330.54 246.77 1362.57V1594.52Z"/>
    <path d="M480.38 1340.66V528.82C480.38 496.79 468.78 469.45 445.59 446.8 422.39 424.16 394.77 412.84 362.74 412.84H14.8V180.88H362.74C426.8 180.88 485.07 196.63 537.54 228.1 590.01 259.58 631.98 301.55 663.46 354.02 694.94 406.49 710.68 464.76 710.68 528.82V1340.66ZM710.68 412.84V180.88H1174.59V412.84Z"/>
  </g>
  <text x="600" y="530" text-anchor="middle" fill="#ffffff" font-family="serif" font-size="48" font-weight="600">HARUNGTAN</text>
  <text x="600" y="580" text-anchor="middle" fill="#999999" font-family="sans-serif" font-size="20">Premium T-Shirts for Men &amp; Women</text>
</svg>`

async function generateIcons() {
  console.log('Generating icons...')

  const svgBuffer = Buffer.from(logoSvg)

  // Generate favicon.ico (32x32 PNG - browsers accept PNG as ico)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'))
  console.log('  ✓ favicon.ico (32x32)')

  // Generate apple-touch-icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
  console.log('  ✓ apple-touch-icon.png (180x180)')

  // Generate PWA icons
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'))
  console.log('  ✓ icons/icon-192x192.png')

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'))
  console.log('  ✓ icons/icon-512x512.png')

  // Generate og-image (1200x630)
  const ogBuffer = Buffer.from(ogSvg)
  await sharp(ogBuffer)
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'))
  console.log('  ✓ og-image.png (1200x630)')

  console.log('\nAll icons generated successfully!')
}

generateIcons().catch(console.error)
