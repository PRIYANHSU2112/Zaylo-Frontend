import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Logo from '@/components/shared/Logo'
import Reveal from '@/components/shared/Reveal'

export default function ComingSoon() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-5 py-20 text-center">
      <Reveal>
        <Logo size="xl" link={false} className="mx-auto mb-8" />
        <h1 className="text-3xl font-extrabold text-main md:text-4xl">Coming Soon</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          We&apos;re crafting something special. This section launches shortly.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
          <Link to="/products">
            <Button>Explore Products</Button>
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
