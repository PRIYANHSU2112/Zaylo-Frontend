import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api, tokenStore, refreshSession, setSessionExpiredHandler } from '@/lib/api'

const AuthContext = createContext(null)

/**
 * Customer session. Access token lives in memory only; the httpOnly refresh
 * cookie restores the session on page load.
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | authenticated | guest

  const applySession = useCallback((session) => {
    if (session?.accessToken) {
      tokenStore.set(session.accessToken)
      setUser(session.user)
      setStatus('authenticated')
    } else {
      tokenStore.set(null)
      setUser(null)
      setStatus('guest')
    }
  }, [])

  useEffect(() => {
    let alive = true
    refreshSession().then((session) => alive && applySession(session))
    setSessionExpiredHandler(() => {
      tokenStore.set(null)
      setUser(null)
      setStatus('guest')
    })
    return () => {
      alive = false
    }
  }, [applySession])

  const login = useCallback(
    async (credentials) => {
      const session = await api.post('/auth/login', credentials)
      applySession(session)
      return session.user
    },
    [applySession],
  )

  const register = useCallback(
    async (payload) => {
      const session = await api.post('/auth/register', payload)
      applySession(session)
      return session.user
    },
    [applySession],
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      applySession(null)
      queryClient.removeQueries({ queryKey: ['me'] })
    }
  }, [applySession, queryClient])

  const updateUser = useCallback((next) => setUser((u) => ({ ...u, ...next })), [])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login,
      register,
      logout,
      updateUser,
      applySession,
    }),
    [user, status, login, register, logout, updateUser, applySession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
