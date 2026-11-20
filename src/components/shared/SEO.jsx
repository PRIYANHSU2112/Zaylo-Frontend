import { useEffect } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function SEO({
  title,
  description,
  path = '',
  ogType = 'website',
  ogImage,
  structuredData = null,
  noindex = false,
}) {
  const { settings } = useSiteSettings()
  const siteName = settings.general?.siteName || "ZAY'LO Snacks"
  const siteUrl = (settings.brand?.siteUrl || 'https://zaylosnacks.com').replace(/\/+$/, '')
  const resolvedOgImage = ogImage || settings.brand?.ogImageUrl || `${siteUrl}/images/og-image.png`
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const canonicalUrl = `${siteUrl}${path}`

  useEffect(() => {
    document.title = fullTitle
    {
      let robots = document.querySelector('meta[name="robots"]')
      if (noindex) {
        if (!robots) {
          robots = document.createElement('meta')
          robots.setAttribute('name', 'robots')
          document.head.appendChild(robots)
        }
        robots.setAttribute('content', 'noindex, nofollow')
      } else if (robots) {
        robots.remove()
      }
    }

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

    updateMetaTag('name', 'description', description)
    updateLinkTag('canonical', canonicalUrl)
    updateMetaTag('property', 'og:title', fullTitle)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:type', ogType)
    updateMetaTag('property', 'og:url', canonicalUrl)
    updateMetaTag('property', 'og:image', resolvedOgImage)
    updateMetaTag('property', 'og:site_name', siteName)
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', fullTitle)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', resolvedOgImage)
    updateJsonLd(structuredData)

    return () => {
      const el = document.getElementById('json-ld-seo')
      if (el) el.remove()
    }
  }, [fullTitle, description, canonicalUrl, ogType, resolvedOgImage, siteName, structuredData, noindex])

  return null
}
