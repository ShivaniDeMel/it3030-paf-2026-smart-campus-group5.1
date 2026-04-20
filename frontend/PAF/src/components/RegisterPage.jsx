import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const RegisterPage = () => {
  const { googleConfigured, loading } = useAuth()

  return (
    <main className="flex-1 w-full px-4 py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h1>
        <p className="text-gray-600 mb-6">
          Sign up with Google. On first sign-in we create your profile and assign the default role
          (USER).
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
          Continue with Google
        </a>

        {!loading && !googleConfigured && (
          <p className="mt-4 text-sm text-red-600">
            Registration uses Google sign-in. Configure Google OAuth in the backend to enable this
            button.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-500">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default RegisterPage
