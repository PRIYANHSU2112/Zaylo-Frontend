import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
// Trimmed asset (no transparent padding) so sizes below are the visible logo size.
import defaultLogo from '@/assets/brand/zaylo-logo-trimmed.png'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const sizes = {
  sm: 'h-10 w-auto',
  md: 'h-12 w-auto md:h-14',
  lg: 'h-14 w-auto md:h-16',
  nav: 'h-14 w-auto md:h-[4.75rem]',
  xl: 'h-20 w-auto md:h-24',
  footer: 'h-28 w-auto md:h-36',
}

export default function Logo({ size = 'md', className, link = true }) {
  const { settings } = useSiteSettings()
  const alt = settings.general?.siteName || "ZAY'LO Snacks"
  const src = settings.brand?.logoUrl || defaultLogo

  const img = (
    <img
      src={src}
      alt={alt}
      width={200}
      height={80}
      className={cn(sizes[size], 'object-contain drop-shadow-sm', className)}
    />
  )

  if (!link) return img
  return (
    <Link to="/" className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  )
}
