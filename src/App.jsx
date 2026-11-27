import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from '@/routes'

function App() {
  const element = useRoutes(routes)

  return (
    <Suspense
      // Pages suspend inside MainLayout (header/footer stay); this only covers the very first boot
      fallback={<div className="min-h-svh bg-background" />}
    >
      {element}
    </Suspense>
  )
}

export default App
