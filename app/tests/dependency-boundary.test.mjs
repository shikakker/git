import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const pkg = JSON.parse(await read('package.json'))
const nextConfig = await read('next.config.js')
const supabaseClient = await read('lib/supabase.ts')
const integrationsPage = await read('pages/partners/integrations/index.tsx')
const expertsPage = await read('pages/partners/experts/index.tsx')
const partnerPage = await read('pages/partners/[slug].tsx')

test('partner gallery uses a patched supported Next runtime', () => {
  assert.equal(pkg.dependencies?.next, '15.5.24')
  assert.equal(pkg.dependencies?.react, '18.2.0')
  assert.equal(pkg.dependencies?.['react-dom'], '18.2.0')
  assert.equal(pkg.engines?.node, '22.x')
})

test('known vulnerable transitive PostCSS range is overridden', () => {
  assert.equal(pkg.overrides?.postcss, '8.5.28')
})

test('deprecated React 17-only Supabase UI package is removed', () => {
  assert.equal(pkg.dependencies?.['@supabase/ui'], undefined)
})

test('used Swiper carousel is upgraded beyond the vulnerable range', () => {
  assert.equal(pkg.dependencies?.swiper, '14.2.0')
})

test('image host config is omitted cleanly when SUPABASE_HOSTNAME is absent', () => {
  assert.doesNotMatch(nextConfig, /domains:\s*\[process\.env\.SUPABASE_HOSTNAME\]/)
  assert.match(nextConfig, /supabaseHostname\s*\?\s*\{/)
  assert.match(nextConfig, /remotePatterns/)
})

test('public Supabase client is optional so builds do not require runtime env', () => {
  assert.doesNotMatch(supabaseClient, /NEXT_PUBLIC_SUPABASE_URL!|NEXT_PUBLIC_SUPABASE_ANON_KEY!/)
  assert.match(supabaseClient, /supabaseUrl\s*&&\s*supabaseAnonKey/)
  assert.match(supabaseClient, /createClient/)
  assert.match(integrationsPage, /if \(!supabase\)/)
  assert.match(expertsPage, /if \(!supabase\)/)
  assert.match(partnerPage, /if \(!supabase\)/)
})
