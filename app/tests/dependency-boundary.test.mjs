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
})

test('unused vulnerable Swiper runtime dependency is removed', () => {
  assert.equal(pkg.dependencies?.swiper, undefined)
})
