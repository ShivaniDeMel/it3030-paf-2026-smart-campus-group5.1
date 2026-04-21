import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const LoginPage = () => {
  const { googleConfigured, loading } = useAuth()

  return (
    <main className="flex-1 w-full px-4 py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
        <p className="text-gray-600 mb-6">
          Continue with Google to access Smart Campus Operations Hub.
        </p>

        <a
          href={googleConfigured ? `${API_BASE}/auth/google` : undefined}
          className={`w-full inline-flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-colors ${
            googleConfigured
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
          }`}
          aria-disabled={!googleConfigured}
        >
          Login with Google
        </a>

        {!loading && !googleConfigured && (
          <p className="mt-4 text-sm text-red-600">
            Google login is not configured yet. Add your Google OAuth client ID and secret in the
            backend, then restart the server.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-500">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}

export default LoginPage
