import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/context/ThemeContext'
import { StoreProvider } from '@/context/StoreContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import App from '@/App'
import '@/index.css'
import { persistQueries, restorePersistedQueries } from '@/lib/queryPersist'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (count, err) => (err?.status >= 400 && err?.status < 500 ? false : count < 1),
      refetchOnWindowFocus: false,
    },
  },
})

// Instant repeat visits: show last real API data immediately, refresh in background
restorePersistedQueries(queryClient)
persistQueries(queryClient)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <StoreProvider>
                <App />
              </StoreProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
