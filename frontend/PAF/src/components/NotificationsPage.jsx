import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const notificationTypes = ['BOOKING', 'TICKET', 'COMMENT']

const NotificationsPage = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    message: '',
    type: 'BOOKING'
  })

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read && !notification.isRead).length,
    [notifications]
  )

  const loadNotifications = async () => {
    if (!user?.id) {
      setPageLoading(false)
      return
    }

    setPageLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/notifications?userId=${encodeURIComponent(user.id)}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to load notifications')
      }

      const data = await response.json()
      setNotifications(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      loadNotifications()
    }
  }, [loading, user?.id])

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!formData.message.trim()) {
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          message: formData.message,
          userId: user.id,
          type: formData.type
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create notification')
      }

      const created = await response.json()
      setNotifications((current) => [created, ...current])
      setFormData({
        message: '',
        type: formData.type
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to update notification')
      }

      const updated = await response.json()
      setNotifications((current) =>
        current.map((notification) => (notification.id === updated.id ? updated : notification))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE}/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete notification')
      }

      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationId)
      )
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading || pageLoading) {
    return <main className="flex-1 px-4 py-12 max-w-6xl mx-auto w-full">Loading notifications...</main>
  }

  if (!isAuthenticated) {
    return (
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-gray-700">
          Sign in with Google to view and manage your notifications.
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 px-4 py-12 max-w-6xl mx-auto w-full space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            Create, review, mark as read, and delete notifications for your account.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
            <p className="text-sm text-gray-500">Unread</p>
            <p className="text-2xl font-semibold text-orange-600">{unreadCount}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Notification</h2>
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
          <input
            type="text"
            value={formData.message}
            onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
            placeholder="Enter notification message"
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
          <select
            value={formData.type}
            onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          >
            {notificationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
      )}

      <section className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => {
            const isRead = notification.read || notification.isRead

            return (
              <article
                key={notification.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  isRead ? 'bg-white border-gray-200' : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                        {notification.type}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isRead ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {notification.timestamp
                        ? new Date(notification.timestamp).toLocaleString()
                        : 'Just now'}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="rounded-xl border border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notification.id)}
                      className="rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </section>
    </main>
  )
}

export default NotificationsPage
