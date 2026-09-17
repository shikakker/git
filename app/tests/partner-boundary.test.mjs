import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = async (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const form = await read('components/BecomeAPartner.tsx')
const api = await read('pages/api/partner-contact.ts').catch(() => '')
const migration = await read('../supabase/migrations/20260916_lock_partner_contacts.sql').catch(() => '')

test('partner PII is not inserted directly from the browser', () => {
  assert.doesNotMatch(form, /supabase\.from<PartnerContact>\(['"]partner_contacts['"]\)\.insert/)
  assert.match(form, /fetch\(['"]\/api\/partner-contact['"]/)
})

test('form only shows success after an OK server response and exposes a recovery error', () => {
  assert.match(form, /response\.ok/)
  assert.match(form, /setSubmitError/)
  assert.match(form, /setFormSubmitted\(true\)/)
})

test('server contact endpoint validates method, input and server-only Supabase credentials', () => {
  assert.match(api, /req\.method\s*!==\s*['"]POST['"]/)
  assert.match(api, /SUPABASE_SERVICE_ROLE_KEY/)
  assert.match(api, /NEXT_PUBLIC_SUPABASE_URL/)
  assert.match(api, /validatePartnerContact/)
  assert.match(api, /status\(400\)/)
  assert.match(api, /status\(503\)/)
})

test('partner-contact rejects cross-site and non-JSON writes before validation or service-role setup', () => {
  const originGuard = api.indexOf('requestIsSameOrigin(req)')
  const jsonGuard = api.indexOf('isJsonRequest(req)')
  const validation = api.indexOf('validatePartnerContact(req.body)')
  const serviceRole = api.indexOf('process.env.SUPABASE_SERVICE_ROLE_KEY')

  assert.match(api, /sec-fetch-site/i)
  assert.match(api, /x-forwarded-host/i)
  assert.match(api, /CROSS_ORIGIN_REQUEST/)
  assert.match(api, /UNSUPPORTED_MEDIA_TYPE/)
  assert.ok(originGuard >= 0 && jsonGuard > originGuard)
  assert.ok(validation > jsonGuard)
  assert.ok(serviceRole > validation)
  assert.match(api, /status\(403\)/)
  assert.match(api, /status\(415\)/)
})

test('partner-contact API is non-cacheable and does not return raw provider errors', () => {
  assert.match(api, /Cache-Control/)
  assert.match(api, /private, no-store/)
  assert.doesNotMatch(api, /error\.message/)
})

test('database migration removes browser write access to contact PII', () => {
  assert.match(migration, /enable row level security/i)
  assert.match(migration, /revoke\s+(insert|all).*anon/i)
  assert.match(migration, /revoke\s+(insert|all).*authenticated/i)
})
