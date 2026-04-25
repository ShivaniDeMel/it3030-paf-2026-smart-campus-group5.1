import { useEffect, useMemo, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import BookingList from "../components/BookingList";
import { bookingAPI, facilityAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const toUiStatus = (status = "pending") => {
  const normalized = status.toLowerCase();
  if (normalized === "confirmed") return "APPROVED";
  if (normalized === "cancelled") return "CANCELLED";
  if (normalized === "rejected") return "REJECTED";
  return "PENDING";
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "N/A";
const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A";

export default function MyBookings() {
  const { user, isAuthenticated, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [facilityNames, setFacilityNames] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const userId = useMemo(
    () => user?.id || user?.userId || user?.email || "",
    [user]
  );

  useEffect(() => {
    const loadBookings = async () => {
      if (loading) return;

      if (!isAuthenticated || !userId) {
        setBookings([]);
        setFacilityNames({});
        setError("");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await bookingAPI.getBookingsByUser(userId);
        const bookingList = response.data || [];
        setBookings(bookingList);

        const uniqueFacilityIds = [...new Set(bookingList.map((b) => b.facilityId).filter(Boolean))];
        const entries = await Promise.all(
          uniqueFacilityIds.map(async (facilityId) => {
            try {
              const facilityResponse = await facilityAPI.getFacilityById(facilityId);
              return [facilityId, facilityResponse.data?.name || "Unknown Facility"];
            } catch {
              return [facilityId, "Unknown Facility"];
            }
          })
        );
        setFacilityNames(Object.fromEntries(entries));
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to load your bookings.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [isAuthenticated, loading, userId]);

  useEffect(() => {
    const normalized = bookings.map((booking) => ({
      id: booking.id,
      facilityId: booking.facilityId,
      facilityName: facilityNames[booking.facilityId] || booking.facilityId || "Facility",
      userName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "User",
      bookingDate: formatDate(booking.startTime),
      startClock: formatTime(booking.startTime),
      endClock: formatTime(booking.endTime),
      purpose: booking.purpose,
      status: toUiStatus(booking.status),
      createdAt: booking.createdAt || booking.startTime,
    }));

    setFilteredBookings(
      filter === "ALL" ? normalized : normalized.filter((booking) => booking.status === filter)
    );
  }, [bookings, facilityNames, filter, user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId, "Cancelled by user");
      const response = await bookingAPI.getBookingsByUser(userId);
      setBookings(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => toUiStatus(b.status) === "PENDING").length,
    APPROVED: bookings.filter((b) => toUiStatus(b.status) === "APPROVED").length,
    REJECTED: bookings.filter((b) => toUiStatus(b.status) === "REJECTED").length,
    CANCELLED: bookings.filter((b) => toUiStatus(b.status) === "CANCELLED").length,
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

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 py-12 space-y-8">
        <section className="glass-card p-6">
          <h1 className="text-4xl font-bold gradient-text">My Bookings</h1>
          <p className="mt-2 text-orange-200/80">
            All facility bookings created by your account.
          </p>
        </section>

        {!isLoading && !error && isAuthenticated && bookings.length > 0 && (
          <section className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === status
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </section>
        )}

        {!loading && !isAuthenticated && (
          <section className="glass-card p-6 border border-amber-600/40">
            <p className="text-amber-200">
              Please sign in to view your bookings.
            </p>
          </section>
        )}

        {(isLoading || loading) && (
          <section className="glass-card p-6 text-orange-100">
            Loading your bookings...
          </section>
        )}

        {!isLoading && error && (
          <section className="glass-card p-6 border border-red-600/40">
            <div className="flex items-center gap-2 text-red-200">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </section>
        )}

        {!isLoading && !error && isAuthenticated && bookings.length === 0 && (
          <section className="glass-card p-6 text-orange-100">
            No bookings yet. Create one from a facility details page.
          </section>
        )}

        {!isLoading && !error && bookings.length > 0 && (
          <section className="glass-card p-6">
            <BookingList
              bookings={filteredBookings}
              onCancel={handleCancelBooking}
              loading={isLoading}
            />
          </section>
        )}
      </div>
    </main>
  );
}
