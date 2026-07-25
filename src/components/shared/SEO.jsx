import { useEffect } from 'react'

export default function SEO({
  title,
  description,
  path = '',
  ogType = 'website',
  ogImage = 'https://zaylosnacks.com/images/og-image.png', // Fallback brand image
  structuredData = null
}) {
  const siteName = "ZAY'LO Snacks"
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const canonicalUrl = `https://zaylosnacks.com${path}`

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle

    // Helper: Update or append meta tags
    const updateMetaTag = (attrName, attrVal, content) => {
      if (content === undefined || content === null) return
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Helper: Update or append link tags
    const updateLinkTag = (rel, href) => {
      if (!href) return
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    // Helper: Update or inject JSON-LD script block
    const updateJsonLd = (data) => {
      let el = document.getElementById('json-ld-seo')
      if (!data) {
        if (el) el.remove()
        return
      }
      if (!el) {
        el = document.createElement('script')
        el.setAttribute('type', 'application/ld+json')
        el.setAttribute('id', 'json-ld-seo')
        document.head.appendChild(el)
      }
      el.textContent = JSON.stringify(data)
    }

    // 2. Primary Meta Description
    updateMetaTag('name', 'description', description)

    // 3. Canonical Link tag
    updateLinkTag('canonical', canonicalUrl)

    // 4. Open Graph Meta Tags (Facebook, LinkedIn, Slack, etc.)
    updateMetaTag('property', 'og:title', fullTitle)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:type', ogType)
    updateMetaTag('property', 'og:url', canonicalUrl)
    updateMetaTag('property', 'og:image', ogImage)
    updateMetaTag('property', 'og:site_name', siteName)

    // 5. Twitter Card Meta Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', fullTitle)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', ogImage)

    // 6. JSON-LD Structured Data
    updateJsonLd(structuredData)

    // Cleanup: Remove structured data on page unmount to prevent bleeding
    return () => {
      const el = document.getElementById('json-ld-seo')
      if (el) el.remove()
    }
  }, [fullTitle, description, canonicalUrl, ogType, ogImage, structuredData])

  return null
}
