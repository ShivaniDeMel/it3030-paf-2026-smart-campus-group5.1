import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const BookingWorkflowPage = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const [bookingId, setBookingId] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleApprove = async (event) => {
    event.preventDefault()
    if (!bookingId.trim()) {
      return
    }

    setSubmitting(true)
    setMessage('')
    try {
      const response = await fetch(`${API_BASE}/admin/bookings/${encodeURIComponent(bookingId)}/approve`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve booking')
      }

      setMessage(`Approved booking ${data.bookingId}`)
      setBookingId('')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <main className="flex-1 px-4 py-12 max-w-5xl mx-auto w-full">Loading workflow...</main>
  }

  return (
    <main className="flex-1 px-4 py-12 max-w-5xl mx-auto w-full space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Booking Workflow</h1>
        <p className="mt-2 text-gray-600">
          Review the basic approval flow. Administrators can approve bookings by ID from this page.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['1', 'Booking submitted', 'User creates a facility booking request.'],
          ['2', 'Admin review', 'An administrator reviews the request details and checks availability.'],
          ['3', 'Approval complete', 'Approved bookings can trigger follow-up notifications or actions.']
        ].map(([step, title, text]) => (
          <div key={step} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
              {step}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Approval Tool</h2>
        <p className="mb-4 text-gray-600">
          {isAuthenticated && user?.role === 'ADMIN'
            ? 'Enter a booking ID to approve it through the secured admin endpoint.'
            : 'Sign in as an ADMIN to approve bookings from this screen.'}
        </p>

        <form onSubmit={handleApprove} className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={bookingId}
            onChange={(event) => setBookingId(event.target.value)}
            placeholder="Booking ID"
            disabled={!isAuthenticated || user?.role !== 'ADMIN'}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={submitting || !isAuthenticated || user?.role !== 'ADMIN'}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Approving...' : 'Approve Booking'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </section>
    </main>
  )
}

export default BookingWorkflowPage
