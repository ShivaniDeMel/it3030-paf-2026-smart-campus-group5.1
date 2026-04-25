import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { bookingAPI } from "../services/api";
import {
  QrCodeIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const BookingWorkflowPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionBookingId, setActionBookingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING");

  const isAdmin = useMemo(
    () => isAuthenticated && (user?.role || "").toUpperCase() === "ADMIN",
    [isAuthenticated, user?.role]
  );

  const loadBookings = async () => {
    if (!isAdmin) return;
    try {
      const res = await bookingAPI.getAllAdminBookings(user);
      setBookings(res.data || []);
      setError("");
    } catch (loadError) {
      setError(
        loadError?.response?.status === 403
          ? "Only admins can view all booking requests."
          : loadError?.response?.data?.message || "Failed to load bookings."
      );
    }
  };

  useEffect(() => {
    if (!loading && isAdmin) {
      loadBookings();
    }
  }, [loading, isAdmin]);

  const handleApprove = async (bookingId) => {
    if (!bookingId) {
      return;
    }
    setSubmitting(true);
    setActionBookingId(bookingId);
    setError("");
    setMessage("");
    try {
      await bookingAPI.approveBookingAdmin(bookingId, "Approved by admin", user);
      setMessage(`Approved booking ${bookingId}`);
      await loadBookings();
    } catch (approveError) {
      setError(approveError?.response?.data?.message || "Failed to approve booking.");
    } finally {
      setSubmitting(false);
      setActionBookingId("");
    }
  };

  const handleReject = async (bookingId) => {
    if (!bookingId) {
      return;
    }
    if (!reason.trim()) {
      setError("Provide a rejection reason before rejecting.");
      return;
    }
    setSubmitting(true);
    setActionBookingId(bookingId);
    setError("");
    setMessage("");
    try {
      await bookingAPI.rejectBookingAdmin(bookingId, reason.trim(), user);
      setMessage(`Rejected booking ${bookingId}`);
      setReason("");
      await loadBookings();
    } catch (rejectError) {
      setError(rejectError?.response?.data?.message || "Failed to reject booking.");
    } finally {
      setSubmitting(false);
      setActionBookingId("");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "ALL") return true;
    return (booking.status || "").toUpperCase() === filter.toUpperCase();
  });

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

  if (loading) {
    return (
      <Shell>
        <div className="glass-card p-8 text-center text-orange-100 animate-fade-in">
          Loading workflow...
        </div>
      </Shell>
    );
  }

  const steps = [
    {
      step: "1",
      title: "Booking submitted",
      text: "User creates a facility booking request.",
      icon: ClipboardDocumentCheckIcon,
      color: "from-orange-500 to-orange-600",
    },
    {
      step: "2",
      title: "Admin review",
      text: "An administrator reviews the request details and checks availability.",
      icon: ShieldCheckIcon,
      color: "from-yellow-500 to-orange-500",
    },
    {
      step: "3",
      title: "Approval complete",
      text: "Approved bookings can trigger follow-up notifications or actions.",
      icon: CheckBadgeIcon,
      color: "from-green-500 to-orange-500",
    },
  ];

  return (
    <Shell>
      <section className="flex items-center gap-4 animate-fade-in">
        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg animate-pulse-glow">
          <QrCodeIcon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold gradient-text">Booking Workflow</h1>
          <p className="mt-1 text-orange-200/80">
            Review the basic approval flow. Administrators can approve bookings
            by ID from this page.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative overflow-hidden rounded-2xl p-6 border border-orange-700/40 bg-gradient-to-br from-black via-orange-950/70 to-black backdrop-blur transition-all duration-300 hover:border-orange-500/60 hover:scale-[1.02] animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${s.color} font-bold text-white shadow-lg`}
                >
                  {s.step}
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-orange-700/40">
                  <Icon className="h-5 w-5 text-orange-300" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-white">{s.title}</h2>
              <p className="mt-2 text-sm text-orange-100/75 leading-relaxed">
                {s.text}
              </p>
            </div>
          );
        })}
      </section>

      <section className="glass-card p-6 animate-slide-in">
        <h2 className="text-xl font-bold text-orange-100 mb-2 flex items-center gap-2">
          <ShieldCheckIcon className="h-6 w-6 text-orange-400" />
          Booking Decision Console
        </h2>
        <p className="mb-4 text-orange-200/80">
          {isAdmin
            ? "Review pending requests, approve or reject with a reason."
            : "Sign in as an ADMIN to approve or reject booking requests."}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {["PENDING", "CONFIRMED", "CANCELLED", "ALL"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                filter === status
                  ? "bg-orange-600 text-white"
                  : "bg-black/40 border border-orange-700/40 text-orange-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-orange-200 mb-1">Rejection reason</label>
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Required when rejecting a booking"
            className="dark-input"
            disabled={!isAdmin}
          />
        </div>

        {!isAdmin && (
          <div className="rounded-xl bg-red-900/20 border border-red-700/40 p-4 text-red-200 text-sm inline-flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            Admin role required for booking decisions.
          </div>
        )}

        {isAdmin && (
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <p className="text-sm text-orange-200/70">No bookings in this filter.</p>
            ) : (
              filteredBookings.map((booking) => {
                const bookingId = booking.id || booking._id;
                const busy = submitting && actionBookingId === bookingId;
                return (
                  <div
                    key={bookingId}
                    className="rounded-xl border border-orange-700/40 bg-black/35 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-white font-semibold">Booking {bookingId}</p>
                        <p className="text-xs text-orange-200/70">
                          User: {booking.userId} | Facility: {booking.facilityId}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/40 border border-orange-700/40 text-orange-100 uppercase">
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-orange-100/85 mt-2">
                      {booking.purpose || "No purpose provided"}
                    </p>
                    {(booking.status || "").toLowerCase() === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(bookingId)}
                          disabled={busy}
                          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm disabled:opacity-60"
                        >
                          {busy ? "Processing..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(bookingId)}
                          disabled={busy}
                          className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-60"
                        >
                          {busy ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm px-4 py-3 rounded-xl bg-red-900/20 border border-red-700/40 text-red-200">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-4 text-sm px-4 py-3 rounded-xl bg-black/40 border border-orange-700/40 text-orange-100">
            {message}
          </p>
        )}
      </section>
    </Shell>
  );
};

export default BookingWorkflowPage;
