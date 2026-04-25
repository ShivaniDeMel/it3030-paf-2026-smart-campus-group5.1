import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  UserPlusIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const RegisterPage = () => {
  const { googleConfigured, loading } = useAuth();

  return (
    <main className="relative flex-1 w-full min-h-screen overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black px-4 py-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto animate-fade-in">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg animate-pulse-glow">
              <UserPlusIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Create an account
              </h1>
              <p className="text-sm text-orange-200/80">
                Sign up with Google &mdash; we&apos;ll handle the rest.
              </p>
            </div>
          </div>

          <p className="text-orange-100/75 mb-6 text-sm leading-relaxed">
            On first sign-in we create your profile and assign the default role
            (USER).
          </p>

          <a
            href={googleConfigured ? `${API_BASE}/auth/google` : undefined}
            className={`w-full inline-flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all duration-300 transform ${
              googleConfigured
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:scale-[1.02] hover:shadow-[0_15px_35px_-10px_rgba(249,115,22,0.65)]"
                : "bg-orange-900/30 text-orange-300/60 border border-orange-800/40 cursor-not-allowed pointer-events-none"
            }`}
            aria-disabled={!googleConfigured}
          >
            <SparklesIcon className="h-5 w-5" />
            Continue with Google
          </a>

          {!loading && !googleConfigured && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-sm">
              <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                Registration uses Google sign-in. Configure Google OAuth in the
                backend to enable this button.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-orange-200/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
