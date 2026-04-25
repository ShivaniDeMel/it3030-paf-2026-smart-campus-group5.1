import { useEffect, useMemo, useState } from "react";
import { UserCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ProfilePage = () => {
  const { user, loading, isAuthenticated, refreshAuthState } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
  }, [user?.firstName, user?.lastName]);

  const role = useMemo(
    () => (user?.role || "USER").toString().toUpperCase(),
    [user?.role]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black flex items-center justify-center text-orange-100">
        Loading profile...
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black flex items-center justify-center p-6">
        <div className="glass-card p-6 text-orange-100 border border-red-700/40">
          Sign in to view and edit your profile.
        </div>
      </main>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update profile.");
      }

      await refreshAuthState();
      setMessage("Profile updated successfully.");
    } catch (submitError) {
      setError(submitError.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="relative min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full px-4 py-12">
        <section className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <UserCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">My Profile</h1>
              <p className="text-orange-200/80 mt-1">
                Update your personal details shown in the system.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-orange-700/40 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-wide text-orange-300/80">Email</p>
              <p className="text-white mt-1">{user.email}</p>
            </div>
            <div className="rounded-xl border border-orange-700/40 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-wide text-orange-300/80">Role</p>
              <p className="text-white mt-1">{role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-orange-200 mb-2">First Name</label>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="dark-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-orange-200 mb-2">Last Name</label>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="dark-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="button-primary disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-200 rounded-lg border border-red-700/40 bg-red-900/20 px-4 py-3">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-green-200 rounded-lg border border-green-700/40 bg-green-900/20 px-4 py-3 inline-flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4" />
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
