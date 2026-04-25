import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { ticketAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const statusStyle = {
  OPEN: "bg-amber-500/20 text-amber-200 border border-amber-500/40",
  IN_PROGRESS: "bg-blue-500/20 text-blue-200 border border-blue-500/40",
  RESOLVED: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40",
  CLOSED: "bg-slate-500/20 text-slate-200 border border-slate-500/40",
  REJECTED: "bg-red-500/20 text-red-200 border border-red-500/40",
};

const statusIcon = {
  OPEN: ExclamationCircleIcon,
  IN_PROGRESS: ClockIcon,
  RESOLVED: CheckCircleIcon,
  CLOSED: CheckCircleIcon,
  REJECTED: ExclamationCircleIcon,
};

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const role = (user?.role || "USER").toString().toUpperCase();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");
        const isTechnician = role === "TECHNICIAN";
        const res = isTechnician
          ? await ticketAPI.getAssignedTickets(user)
          : await ticketAPI.getTickets(user);
        setTickets(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, role]);

  const title = useMemo(
    () => {
      if (role === "TECHNICIAN") return "Assigned Tickets";
      if (role === "ADMIN") return "All Tickets Queue";
      return "My Tickets";
    },
    [role]
  );

  return (
    <main className="relative min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 py-12 space-y-6">
        <section className="glass-card p-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Ticketing</h1>
            <p className="mt-1 text-orange-200/80">{title}</p>
          </div>
          <Link to="/tickets/new" className="button-primary inline-flex items-center gap-2">
            <WrenchScrewdriverIcon className="h-5 w-5" />
            Report Incident
          </Link>
        </section>

        {loading && <section className="glass-card p-6 text-orange-100">Loading tickets...</section>}
        {!loading && error && <section className="glass-card p-6 text-red-200 border border-red-600/40">{error}</section>}

        {!loading && !error && tickets.length === 0 && (
          <section className="glass-card p-6 text-orange-100">No tickets found.</section>
        )}

        {!loading && !error && tickets.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tickets.map((ticket, index) => {
              const Icon = statusIcon[ticket.status] || ExclamationCircleIcon;
              return (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="glass-card p-5 border border-orange-700/40 transition-all duration-300 hover:scale-[1.02] animate-bounce-in"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{ticket.ticketNumber}</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${statusStyle[ticket.status] || statusStyle.OPEN}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {ticket.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-orange-100">{ticket.category} Issue</h3>
                  <p className="mt-2 text-sm text-orange-200/80 line-clamp-3">
                    {ticket.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-orange-200/70">
                    <span>Priority: {ticket.priority}</span>
                    <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default TicketListPage;
