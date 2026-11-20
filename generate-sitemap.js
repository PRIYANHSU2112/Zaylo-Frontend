import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define paths
const sitemapOutputPath = path.join(__dirname, 'public', 'sitemap.xml')

const DOMAIN = (process.env.SITE_URL || 'https://zaylosnacks.com').replace(/\/+$/, '')

// 1. Static pages
const staticPages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'products', priority: '0.9', changefreq: 'daily' },
  { path: 'about', priority: '0.8', changefreq: 'monthly' },
  { path: 'contact', priority: '0.8', changefreq: 'monthly' },
  { path: 'dealer', priority: '0.8', changefreq: 'monthly' },
  { path: 'bulk-order', priority: '0.8', changefreq: 'monthly' },
  { path: 'blog', priority: '0.8', changefreq: 'weekly' },
  { path: 'gallery', priority: '0.7', changefreq: 'weekly' }
]

// 2. Product slugs from the live API (no static product data). If the API is
//    unreachable at build time, the sitemap is generated with static pages only.
const API = (process.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '')
let productSlugs = []
try {
  for (let page = 1; page <= 50; page += 1) {
    const res = await fetch(`${API}/products?limit=100&page=${page}`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = await res.json()
    productSlugs.push(...(body.data || []).map((p) => p.slug).filter(Boolean))
    if (!body.meta?.hasMore) break
  }
  console.log(`Found ${productSlugs.length} product slug(s) from API`)
} catch (error) {
  console.warn(`Sitemap: could not fetch products from ${API} (${error.message}); static pages only.`)
}

// 3. Generate sitemap entries
const currentDate = new Date().toISOString().split('T')[0]
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

// Add static pages
for (const page of staticPages) {
  const url = page.path ? `${DOMAIN}/${page.path}` : DOMAIN
  xml += `  <url>\n`
  xml += `    <loc>${url}</loc>\n`
  xml += `    <lastmod>${currentDate}</lastmod>\n`
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`
  xml += `    <priority>${page.priority}</priority>\n`
  xml += `  </url>\n`
}

// Add dynamic product pages
for (const slug of productSlugs) {
  xml += `  <url>\n`
  xml += `    <loc>${DOMAIN}/products/${slug}</loc>\n`
  xml += `    <lastmod>${currentDate}</lastmod>\n`
  xml += `    <changefreq>weekly</changefreq>\n`
  xml += `    <priority>0.8</priority>\n`
  xml += `  </url>\n`
}

xml += `</urlset>\n`

// 4. Write to public/sitemap.xml
try {
  fs.writeFileSync(sitemapOutputPath, xml, 'utf8')
  console.log(`Successfully generated sitemap.xml at ${sitemapOutputPath}`)
} catch (error) {
  console.error('Error writing sitemap.xml:', error)
  process.exit(1)
}
