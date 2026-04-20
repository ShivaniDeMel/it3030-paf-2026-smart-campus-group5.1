import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const roles = ['USER', 'ADMIN', 'TECHNICIAN']

const RoleManagementPage = () => {
  const { user, isAuthenticated, loading, refreshAuthState } = useAuth()
  const [users, setUsers] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [approving, setApproving] = useState(false)
  const [bootstrappingAdmin, setBootstrappingAdmin] = useState(false)

  const loadUsers = async () => {
    setPageLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to load users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === 'ADMIN') {
      loadUsers()
    } else if (!loading) {
      setPageLoading(false)
    }
  }, [loading, isAuthenticated, user?.role])

  const handleRoleChange = async (userId, role) => {
    setSuccess('')
    setError('')
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ role })
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      const updatedUser = await response.json()
      setUsers((current) =>
        current.map((item) => (item.id === updatedUser.id ? updatedUser : item))
      )
      setSuccess(`Updated role for ${updatedUser.email}`)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleApproveBooking = async (event) => {
    event.preventDefault()
    if (!bookingId.trim()) {
      return
    }

    setApproving(true)
    setSuccess('')
    setError('')
    try {
      const response = await fetch(`${API_BASE}/admin/bookings/${encodeURIComponent(bookingId)}/approve`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to approve booking')
      }

      const data = await response.json()
      setSuccess(data.message)
      setBookingId('')
    } catch (err) {
      setError(err.message)
    } finally {
      setApproving(false)
    }
  }

  if (loading || pageLoading) {
    return <main className="flex-1 px-4 py-12 max-w-6xl mx-auto w-full">Loading role management...</main>
  }

  if (!isAuthenticated) {
    return (
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-gray-700">
          Sign in as an administrator to manage users and approve bookings.
        </div>
      </main>
    )
  }

  if (user?.role !== 'ADMIN') {
    return (
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 space-y-4">
          <p>Access denied. Only administrators can manage users or approve bookings.</p>
          <p className="text-sm text-red-600">
            If this is the first admin account for the system, you can bootstrap your current user
            as ADMIN once.
          </p>
          <button
            type="button"
            onClick={async () => {
              setBootstrappingAdmin(true)
              setError('')
              setSuccess('')
              try {
                const response = await fetch(`${API_BASE}/auth/bootstrap-admin`, {
                  method: 'POST',
                  credentials: 'include'
                })
                const data = await response.json()
                if (!response.ok) {
                  throw new Error(data.message || 'Failed to bootstrap admin')
                }
                await refreshAuthState()
                setSuccess('Your account is now ADMIN. Reloading role management...')
              } catch (err) {
                setError(err.message)
              } finally {
                setBootstrappingAdmin(false)
              }
            }}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            disabled={bootstrappingAdmin}
          >
            {bootstrappingAdmin ? 'Updating role...' : 'Make my account ADMIN'}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 px-4 py-12 max-w-6xl mx-auto w-full space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
        <p className="mt-2 text-gray-600">
          Manage user roles and perform administrator-only actions from one place.
        </p>
      </section>

      <section className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Approve Booking</h2>
        <form onSubmit={handleApproveBooking} className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={bookingId}
            onChange={(event) => setBookingId(event.target.value)}
            placeholder="Enter booking ID"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={approving}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {approving ? 'Approving...' : 'Approve'}
          </button>
        </form>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      <section className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Change Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {[item.firstName, item.lastName].filter(Boolean).join(' ') || 'Unnamed user'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <select
                      value={item.role}
                      onChange={(event) => handleRoleChange(item.id, event.target.value)}
                      className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
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
    </main>
  )
}

export default RoleManagementPage
