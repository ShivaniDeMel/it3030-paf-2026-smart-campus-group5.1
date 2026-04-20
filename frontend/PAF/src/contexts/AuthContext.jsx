import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [googleConfigured, setGoogleConfigured] = useState(false)

  const refreshAuthState = async () => {
    try {
      const [statusResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE}/auth/status`, {
          credentials: 'include'
        }),
        fetch(`${API_BASE}/auth/me`, {
          credentials: 'include'
        })
      ])

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setGoogleConfigured(Boolean(statusData.googleConfigured))
      }

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch {
      // Backend not running or user not logged in.
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAuthState()
  }, [])

  const login = async () => ({
    success: false,
    error: 'Use Login with Google to authenticate.'
  })

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!user,
      googleConfigured,
      loading,
      refreshAuthState,
      login,
      logout
    }),
    [user, googleConfigured, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
