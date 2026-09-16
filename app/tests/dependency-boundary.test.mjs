import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const pkg = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
)

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
