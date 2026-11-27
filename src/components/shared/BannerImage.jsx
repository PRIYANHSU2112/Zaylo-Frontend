import { useState } from 'react'
import { cn } from '@/utils/cn'

/**
 * Full-bleed banner image: shimmer skeleton while loading, then fades in to cover its
 * (positioned) parent. Optional `mobileSrc` is served below 768px via <picture>.
 */
export default function BannerImage({
  src,
  mobileSrc,
  alt = '',
  className,
  imgClassName,
  priority = false,
  position = 'center',
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {!loaded && !failed && <div className="skeleton-shimmer absolute inset-0" aria-hidden="true" />}
      {src && !failed && (
        <picture>
          {mobileSrc && <source media="(max-width: 767px)" srcSet={mobileSrc} />}
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={{ objectPosition: position }}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out',
              loaded ? 'opacity-100' : 'opacity-0',
              imgClassName,
            )}
          />
        </picture>
      )}
    </div>
  )
}
