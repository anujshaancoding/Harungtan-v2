// Pincode-to-zone mapping for delivery estimation
// Metro pincodes: 3-5 business days
// Tier-2 cities: 5-7 business days
// Rest of India: 7-10 business days

const METRO_PREFIXES = [
  '110', // Delhi
  '400', // Mumbai
  '500', // Hyderabad
  '600', // Chennai
  '560', // Bangalore
  '700', // Kolkata
  '380', // Ahmedabad
  '411', // Pune
]

const TIER2_PREFIXES = [
  '302', // Jaipur
  '226', // Lucknow
  '462', // Bhopal
  '440', // Nagpur
  '360', // Rajkot
  '395', // Surat
  '682', // Kochi
  '530', // Visakhapatnam
  '800', // Patna
  '160', // Chandigarh
  '180', // Jammu
  '208', // Kanpur
  '201', // Noida/Ghaziabad
  '122', // Gurgaon
  '247', // Dehradun
  '250', // Meerut
  '452', // Indore
  '421', // Thane
]

export type DeliveryZone = 'metro' | 'tier2' | 'standard'

export function getDeliveryZone(pincode: string): DeliveryZone {
  const prefix3 = pincode.slice(0, 3)
  if (METRO_PREFIXES.includes(prefix3)) return 'metro'
  if (TIER2_PREFIXES.includes(prefix3)) return 'tier2'
  return 'standard'
}

export function getDeliveryEstimate(pincode: string): {
  minDays: number
  maxDays: number
  zone: DeliveryZone
  available: boolean
} {
  // Validate pincode format
  if (!/^\d{6}$/.test(pincode)) {
    return { minDays: 0, maxDays: 0, zone: 'standard', available: false }
  }

  const zone = getDeliveryZone(pincode)

  switch (zone) {
    case 'metro':
      return { minDays: 3, maxDays: 5, zone, available: true }
    case 'tier2':
      return { minDays: 5, maxDays: 7, zone, available: true }
    default:
      return { minDays: 7, maxDays: 10, zone, available: true }
  }
}

export function getEstimatedDeliveryDates(pincode: string): {
  minDate: Date
  maxDate: Date
  zone: DeliveryZone
  available: boolean
} {
  const { minDays, maxDays, zone, available } = getDeliveryEstimate(pincode)
  const now = new Date()
  const minDate = new Date(now)
  const maxDate = new Date(now)

  minDate.setDate(minDate.getDate() + minDays)
  maxDate.setDate(maxDate.getDate() + maxDays)

  // Skip Sundays
  while (minDate.getDay() === 0) minDate.setDate(minDate.getDate() + 1)
  while (maxDate.getDay() === 0) maxDate.setDate(maxDate.getDate() + 1)

  return { minDate, maxDate, zone, available }
}

// Pincode to city/state lookup for autocomplete
const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  '110': { city: 'New Delhi', state: 'Delhi' },
  '400': { city: 'Mumbai', state: 'Maharashtra' },
  '411': { city: 'Pune', state: 'Maharashtra' },
  '500': { city: 'Hyderabad', state: 'Telangana' },
  '600': { city: 'Chennai', state: 'Tamil Nadu' },
  '560': { city: 'Bangalore', state: 'Karnataka' },
  '700': { city: 'Kolkata', state: 'West Bengal' },
  '380': { city: 'Ahmedabad', state: 'Gujarat' },
  '302': { city: 'Jaipur', state: 'Rajasthan' },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '440': { city: 'Nagpur', state: 'Maharashtra' },
  '360': { city: 'Rajkot', state: 'Gujarat' },
  '395': { city: 'Surat', state: 'Gujarat' },
  '682': { city: 'Kochi', state: 'Kerala' },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '800': { city: 'Patna', state: 'Bihar' },
  '160': { city: 'Chandigarh', state: 'Chandigarh' },
  '180': { city: 'Jammu', state: 'Jammu & Kashmir' },
  '208': { city: 'Kanpur', state: 'Uttar Pradesh' },
  '201': { city: 'Noida', state: 'Uttar Pradesh' },
  '122': { city: 'Gurgaon', state: 'Haryana' },
  '247': { city: 'Dehradun', state: 'Uttarakhand' },
  '250': { city: 'Meerut', state: 'Uttar Pradesh' },
  '452': { city: 'Indore', state: 'Madhya Pradesh' },
  '421': { city: 'Thane', state: 'Maharashtra' },
  '370': { city: 'Bhuj', state: 'Gujarat' },
  '144': { city: 'Jalandhar', state: 'Punjab' },
  '141': { city: 'Ludhiana', state: 'Punjab' },
  '143': { city: 'Amritsar', state: 'Punjab' },
  '431': { city: 'Aurangabad', state: 'Maharashtra' },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '625': { city: 'Madurai', state: 'Tamil Nadu' },
  '570': { city: 'Mysore', state: 'Karnataka' },
  '575': { city: 'Mangalore', state: 'Karnataka' },
  '695': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '673': { city: 'Kozhikode', state: 'Kerala' },
  '751': { city: 'Bhubaneswar', state: 'Odisha' },
  '781': { city: 'Guwahati', state: 'Assam' },
  '834': { city: 'Ranchi', state: 'Jharkhand' },
  '305': { city: 'Ajmer', state: 'Rajasthan' },
  '313': { city: 'Udaipur', state: 'Rajasthan' },
  '342': { city: 'Jodhpur', state: 'Rajasthan' },
}

export function lookupPincode(pincode: string): { city: string; state: string } | null {
  const prefix3 = pincode.slice(0, 3)
  return PINCODE_MAP[prefix3] || null
}
