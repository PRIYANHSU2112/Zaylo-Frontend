import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import logo from '@/assets/brand/zaylo-logo.png'

const sizes = {
  sm: 'h-12 w-auto',
  md: 'h-16 w-auto md:h-[4.5rem]',
  lg: 'h-20 w-auto md:h-24',
  xl: 'h-28 w-auto md:h-32',
  '2xl': 'h-36 w-auto md:h-48',
}

export default function Logo({ size = 'md', className, link = true }) {
  const img = (
    <img
      src={logo}
      alt="ZAY'LO Snacks"
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
