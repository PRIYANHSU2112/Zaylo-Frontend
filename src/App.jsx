import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from '@/routes'

function App() {
  const element = useRoutes(routes)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

export default App
