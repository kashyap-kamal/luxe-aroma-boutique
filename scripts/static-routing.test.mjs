import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('should route admin product edit button to static query-param page when clicked', () => {
  const listPage = fs.readFileSync(
    path.join(ROOT, 'src/app/admin/products/page.tsx'),
    'utf8'
  )
  assert.match(listPage, /\/admin\/products\/edit\?id=\$\{product\.id\}/)
  assert.doesNotMatch(listPage, /\/admin\/products\/\$\{product\.id\}/)
})

test('should provide static client edit page for admin products when newly created product is edited', () => {
  const editPagePath = path.join(ROOT, 'src/app/admin/products/edit/page.tsx')
  assert.equal(fs.existsSync(editPagePath), true)
  const content = fs.readFileSync(editPagePath, 'utf8')
  assert.match(content, /^"use client"/)
  assert.match(content, /useSearchParams/)
  assert.doesNotMatch(content, /generateStaticParams/)
  assert.equal(
    fs.existsSync(path.join(ROOT, 'src/app/admin/products/[id]/page.tsx')),
    false
  )
})

test('should provide static client detail fallbacks for products and bundles when created after build', () => {
  const prodDetail = path.join(ROOT, 'src/app/products/detail/page.tsx')
  const bundleDetail = path.join(ROOT, 'src/app/bundles/detail/page.tsx')
  assert.equal(fs.existsSync(prodDetail), true)
  assert.equal(fs.existsSync(bundleDetail), true)
  assert.match(fs.readFileSync(prodDetail, 'utf8'), /useSearchParams/)
  assert.match(fs.readFileSync(bundleDetail, 'utf8'), /useSearchParams/)
})

test('should configure .htaccess to redirect unbuilt product and bundle paths without catch-all home rewrite', () => {
  for (const rel of ['.htaccess', 'public/.htaccess']) {
    const filePath = path.join(ROOT, rel)
    assert.equal(fs.existsSync(filePath), true, `Missing ${rel}`)
    const htaccess = fs.readFileSync(filePath, 'utf8')
    assert.match(htaccess, /admin\/products\/.*\/admin\/products\/edit\/\?id=\$1/)
    assert.match(htaccess, /products\/.*\/products\/detail\/\?id=\$1/)
    assert.match(htaccess, /bundles\/.*\/bundles\/detail\/\?id=\$1/)
    assert.doesNotMatch(htaccess, /RewriteRule \^\(\.\*\)\$ \/index\.html/)
  }
})
