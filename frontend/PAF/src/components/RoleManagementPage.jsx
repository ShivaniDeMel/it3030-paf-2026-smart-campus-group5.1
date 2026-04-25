import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ShieldCheckIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const roles = ["USER", "ADMIN", "TECHNICIAN"];

const rolePrefix = (role) => {
  if (role === "ADMIN") return "AD";
  if (role === "TECHNICIAN") return "TN";
  return "ST";
};

const Shell = ({ children }) => (
  <main className="relative min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />
    </div>
    <div className="relative z-10 max-w-6xl mx-auto w-full px-4 py-12 space-y-8">
      {children}
    </div>
  </main>
);

const RoleManagementPage = () => {
  const { user, isAuthenticated, loading, refreshAuthState } = useAuth();
  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [approving, setApproving] = useState(false);
  const [bootstrappingAdmin, setBootstrappingAdmin] = useState(false);

  const referenceIdByUserId = useMemo(() => {
    const counters = { ADMIN: 0, TECHNICIAN: 0, USER: 0 };
    const sorted = [...users].sort((a, b) =>
      `${a.role}-${a.firstName || ""}-${a.lastName || ""}-${a.email || ""}`.localeCompare(
        `${b.role}-${b.firstName || ""}-${b.lastName || ""}-${b.email || ""}`
      )
    );
    const map = {};
    sorted.forEach((item) => {
      const normalizedRole = (item.role || "USER").toUpperCase();
      counters[normalizedRole] = (counters[normalizedRole] || 0) + 1;
      map[item.id] = `${rolePrefix(normalizedRole)}${String(counters[normalizedRole]).padStart(2, "0")}`;
    });
    return map;
  }, [users]);

  const loadUsers = async () => {
    setPageLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === "ADMIN") {
      loadUsers();
    } else if (!loading) {
      setPageLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated, user?.role]);

  const handleRoleChange = async (userId, role) => {
    setSuccess("");
    setError("");
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      const updatedUser = await response.json();
      setUsers((current) =>
        current.map((item) =>
          item.id === updatedUser.id ? updatedUser : item
        )
      );
      setSuccess(`Updated role for ${updatedUser.email}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApproveBooking = async (event) => {
    event.preventDefault();
    if (!bookingId.trim()) {
      return;
    }

    setApproving(true);
    setSuccess("");
    setError("");
    try {
      const response = await fetch(
        `${API_BASE}/admin/bookings/${encodeURIComponent(bookingId)}/approve`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve booking");
      }

      const data = await response.json();
      setSuccess(data.message);
      setBookingId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setApproving(false);
    }
  };

  if (loading || pageLoading) {
    return (
      <Shell>
        <div className="glass-card p-8 text-center text-orange-100 animate-fade-in">
          Loading role management...
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated) {
    return (
      <Shell>
        <div className="glass-card p-6 text-orange-100 flex items-start gap-3 animate-fade-in">
          <NoSymbolIcon className="h-6 w-6 text-orange-300 flex-shrink-0 mt-0.5" />
          <p>Sign in as an administrator to manage users and approve bookings.</p>
        </div>
      </Shell>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <Shell>
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">Access denied</p>
              <p className="text-sm text-orange-200/80 mt-1">
                Only administrators can manage users or approve bookings.
              </p>
            </div>
          </div>
          <p className="text-sm text-orange-200/70">
            If this is the first admin account for the system, you can bootstrap
            your current user as ADMIN once.
          </p>
          <button
            type="button"
            onClick={async () => {
              setBootstrappingAdmin(true);
              setError("");
              setSuccess("");
              try {
                const response = await fetch(
                  `${API_BASE}/auth/bootstrap-admin`,
                  {
                    method: "POST",
                    credentials: "include",
                  }
                );
                const data = await response.json();
                if (!response.ok) {
                  throw new Error(data.message || "Failed to bootstrap admin");
                }
                await refreshAuthState();
                setSuccess(
                  "Your account is now ADMIN. Reloading role management..."
                );
              } catch (err) {
                setError(err.message);
              } finally {
                setBootstrappingAdmin(false);
              }
            }}
            className="button-primary disabled:opacity-60"
            disabled={bootstrappingAdmin}
          >
            {bootstrappingAdmin ? "Updating role..." : "Make my account ADMIN"}
          </button>
          {error && (
            <p className="text-sm text-red-300 px-4 py-3 rounded-xl bg-red-950/50 border border-red-500/30">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-300 px-4 py-3 rounded-xl bg-green-950/50 border border-green-500/30">
              {success}
            </p>
          )}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="flex items-center gap-4 animate-fade-in">
        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg animate-pulse-glow">
          <ShieldCheckIcon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold gradient-text">Role Management</h1>
          <p className="mt-1 text-orange-200/80">
            Manage user roles and perform administrator-only actions.
          </p>
        </div>
      </section>

      <section className="glass-card p-6 animate-slide-in">
        <h2 className="text-xl font-bold text-orange-100 mb-4 flex items-center gap-2">
          <ClipboardDocumentCheckIcon className="h-6 w-6 text-orange-400" />
          Approve Booking
        </h2>
        <form
          onSubmit={handleApproveBooking}
          className="flex flex-col gap-4 md:flex-row"
        >
          <input
            type="text"
            value={bookingId}
            onChange={(event) => setBookingId(event.target.value)}
            placeholder="Enter booking ID"
            className="dark-input flex-1"
          />
          <button
            type="submit"
            disabled={approving}
            className="button-primary disabled:opacity-60"
          >
            {approving ? "Approving..." : "Approve"}
          </button>
        </form>
      </section>

      {error && (
        <div className="flex items-start gap-2 p-4 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-300">
          <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 p-4 rounded-2xl bg-green-950/50 border border-green-500/40 text-green-300">
          <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <section className="glass-card overflow-hidden animate-slide-in">
        <div className="border-b border-orange-700/40 px-6 py-4 flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-orange-400" />
          <h2 className="text-xl font-bold text-orange-100">Manage Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Ref ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Change Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-900/40">
              {users.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-orange-500/10 transition-colors"
                >
                  <td className="px-6 py-4 text-xs text-orange-200/80 font-mono" title={item.id}>
                    {referenceIdByUserId[item.id] || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {[item.firstName, item.lastName]
                      .filter(Boolean)
                      .join(" ") || "Unnamed user"}
                  </td>
                  <td className="px-6 py-4 text-sm text-orange-200/80">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 font-semibold text-white text-xs">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={item.role}
                      onChange={(event) =>
                        handleRoleChange(item.id, event.target.value)
                      }
                      className="dark-input py-2 px-3 w-auto"
                    >
                      {roles.map((role) => (
                        <option
                          key={role}
                          value={role}
                          className="bg-black text-white"
                        >
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
};

export default RoleManagementPage;
