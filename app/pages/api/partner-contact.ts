import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

type PartnerContactInput = {
  type: 'expert' | 'technology'
  first: string
  last: string
  company: string
  size: number | null
  title: string
  email: string
  phone: string
  country: string
  details: string
}

function text(value: unknown, max: number, required = false) {
  if (typeof value !== 'string') return required ? null : ''
  const normalized = value.trim()
  if ((required && !normalized) || normalized.length > max) return null
  return normalized
}

function firstHeader(req: NextApiRequest, name: string): string {
  const raw = req.headers[name.toLowerCase()]
  if (Array.isArray(raw)) return raw[0] || ''
  return raw || ''
}

function requestIsSameOrigin(req: NextApiRequest): boolean {
  const fetchSite = firstHeader(req, 'sec-fetch-site').trim().toLowerCase()
  if (fetchSite === 'cross-site') return false

  const origin = firstHeader(req, 'origin').trim()
  if (!origin) return true

  const forwardedHost = firstHeader(req, 'x-forwarded-host').split(',', 1)[0].trim()
  const host = forwardedHost || firstHeader(req, 'host').trim()
  if (!host) return false

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase()
  } catch {
    return false
  }
}

function isJsonRequest(req: NextApiRequest): boolean {
  return firstHeader(req, 'content-type')
    .split(';', 1)[0]
    .trim()
    .toLowerCase() === 'application/json'
}

function validatePartnerContact(body: unknown): PartnerContactInput | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const input = body as Record<string, unknown>

  const type = input.type === 'expert' || input.type === 'technology' ? input.type : null
  const first = text(input.first, 80, true)
  const last = text(input.last, 80, true)
  const company = text(input.company, 160)
  const title = text(input.title, 120)
  const email = text(input.email, 254, true)
  const phone = text(input.phone, 40)
  const countryRaw = text(input.country, 2, true)
  const details = text(input.details, 4000)
  const sizeRaw = input.size
  const size = sizeRaw === '' || sizeRaw == null ? null : Number(sizeRaw)

  if (
    !type ||
    first === null ||
    last === null ||
    company === null ||
    title === null ||
    email === null ||
    phone === null ||
    countryRaw === null ||
    details === null ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^[A-Za-z]{2}$/.test(countryRaw) ||
    (size !== null && (!Number.isInteger(size) || size < 1 || size > 1_000_000))
  ) {
    return null
  }

  return {
    type,
    first,
    last,
    company,
    size,
    title,
    email: email.toLowerCase(),
    phone,
    country: countryRaw.toUpperCase(),
    details,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  if (!requestIsSameOrigin(req)) {
    return res.status(403).json({ error: 'CROSS_ORIGIN_REQUEST' })
  }

  if (!isJsonRequest(req)) {
    return res.status(415).json({ error: 'UNSUPPORTED_MEDIA_TYPE' })
  }

  const input = validatePartnerContact(req.body)
  if (!input) return res.status(400).json({ error: 'INVALID_CONTACT' })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    return res.status(503).json({ error: 'CONTACT_SERVICE_UNAVAILABLE' })
  }

  const supabase = createClient(url, serviceRoleKey, {
    persistSession: false,
    autoRefreshToken: false,
  })

  const domain = input.email.split('@')[1] || ''
  const { error } = await supabase.from('partner_contacts').insert(
    [
      {
        ...input,
        website: domain,
      },
    ],
    { returning: 'minimal' }
  )

  if (error) {
    console.error('Partner contact insert failed', { code: error.code })
    return res.status(502).json({ error: 'CONTACT_SUBMISSION_FAILED' })
  }

  return res.status(201).json({ ok: true })
}
