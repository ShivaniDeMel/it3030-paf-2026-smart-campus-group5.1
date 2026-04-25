import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  BellIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const notificationTypes = ["BOOKING", "TICKET", "COMMENT"];

const NotificationsPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    message: "",
    type: "BOOKING",
  });

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read && !notification.isRead
      ).length,
    [notifications]
  );

  const loadNotifications = async () => {
    if (!user?.id) {
      setPageLoading(false);
      return;
    }

    setPageLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${API_BASE}/notifications?userId=${encodeURIComponent(user.id)}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.id]);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!formData.message.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: formData.message,
          userId: user.id,
          type: formData.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      const created = await response.json();
      setNotifications((current) => [created, ...current]);
      setFormData({
        message: "",
        type: formData.type,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE}/notifications/${notificationId}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notification");
      }

      const updated = await response.json();
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === updated.id ? updated : notification
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE}/notifications/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationId)
      );
    } catch (err) {
      setError(err.message);
    }
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

  if (loading || pageLoading) {
    return (
      <Shell>
        <div className="glass-card p-8 text-center text-orange-100 animate-fade-in">
          Loading notifications...
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated) {
    return (
      <Shell>
        <div className="glass-card p-8 text-orange-100 animate-fade-in">
          Sign in with Google to view and manage your notifications.
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg animate-pulse-glow">
            <BellIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Notifications</h1>
            <p className="mt-1 text-orange-200/80">
              Create, review, mark as read, and delete your notifications.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="glass-card px-5 py-4 min-w-[120px]">
            <p className="text-sm text-orange-300">Total</p>
            <p className="text-2xl font-bold text-white">
              {notifications.length}
            </p>
          </div>
          <div className="glass-card px-5 py-4 min-w-[120px]">
            <p className="text-sm text-orange-300">Unread</p>
            <p className="text-2xl font-bold text-orange-400">{unreadCount}</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 animate-slide-in">
        <h2 className="text-xl font-bold text-orange-100 mb-4 flex items-center gap-2">
          <PlusCircleIcon className="h-6 w-6 text-orange-400" />
          Create Notification
        </h2>
        <form
          onSubmit={handleCreate}
          className="grid gap-4 md:grid-cols-[1fr_180px_auto]"
        >
          <input
            type="text"
            value={formData.message}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            placeholder="Enter notification message"
            className="dark-input"
          />
          <select
            value={formData.type}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                type: event.target.value,
              }))
            }
            className="dark-input"
          >
            {notificationTypes.map((type) => (
              <option key={type} value={type} className="bg-black text-white">
                {type}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="button-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </form>
      </section>

      {error && (
        <div className="flex items-start gap-2 p-4 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-300">
          <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <section className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass-card p-8 text-center text-orange-200/80 border-dashed">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification, index) => {
            const isRead = notification.read || notification.isRead;

            return (
              <article
                key={notification.id}
                className={`rounded-2xl p-5 border backdrop-blur transition-all duration-300 animate-bounce-in ${
                  isRead
                    ? "bg-black/50 border-orange-900/40"
                    : "bg-gradient-to-r from-orange-950/70 via-black/60 to-orange-950/70 border-orange-500/50 shadow-[0_20px_40px_-20px_rgba(249,115,22,0.45)]"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 text-xs font-semibold text-white">
                        {notification.type}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                          isRead
                            ? "bg-black/40 text-orange-300 border-orange-800/40"
                            : "bg-orange-500/20 text-orange-200 border-orange-400/50"
                        }`}
                      >
                        {isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-white">
                      {notification.message}
                    </p>
                    <p className="text-sm text-orange-300/70">
                      {notification.timestamp
                        ? new Date(notification.timestamp).toLocaleString()
                        : "Just now"}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-orange-500/40 bg-black/40 px-4 py-2 text-sm font-semibold text-orange-200 hover:bg-orange-500/20 hover:text-white transition-colors"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Mark as read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notification.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-500/40 bg-black/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 hover:text-white transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </Shell>
  );
};

export default NotificationsPage;
