import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { ticketAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import StatusTracker from "./StatusTracker";
import CommentSection from "./CommentSection";
import AdminControls from "./AdminControls";

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const res = await ticketAPI.getTicketById(id, user);
      setTicket(res.data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load ticket details.");
    }
    setLoading(false);
  };

  const role = (user?.role || "USER").toString().toUpperCase();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  if (loading) return <main className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black p-8 text-orange-100">Loading details...</main>;
  if (!ticket) return <main className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black p-8 text-red-200">{error || "Ticket not found."}</main>;

  return (
    <main className="relative min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 py-12">
      <div className="glass-card p-8 border border-orange-700/40">
      <div className="mb-4">
        <Link to="/tickets" className="inline-flex items-center gap-2 text-orange-200/80 hover:text-orange-100">
          <ArrowLeftIcon className="h-4 w-4" /> Back to Tickets
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-3xl font-bold text-white mb-1">{ticket.ticketNumber}</h2>
           <span className="text-orange-200/80">{ticket.category} • Priority: <span className="px-2 py-1 rounded bg-black/30 border border-orange-700/30">{ticket.priority}</span></span>
        </div>
        <div className="text-right">
           <span className="px-3 py-1 rounded-full text-sm font-semibold bg-black/40 border border-orange-700/40 text-orange-100">
             {ticket.status}
           </span>
        </div>
      </div>

      <StatusTracker status={ticket.status} />

      <div className="flex flex-col gap-4 my-8">
        <div>
          <label className="block text-sm font-medium text-orange-200 mb-2">Description</label>
          <div className="rounded-xl border border-orange-700/40 bg-black/35 p-4 text-orange-100">
            {ticket.description}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
           <div className="rounded-xl border border-orange-700/40 bg-black/35 p-4 text-orange-100">
              <label className="block text-sm font-medium text-orange-200 mb-2">Reporter Info</label>
              <p><strong>Name:</strong> {ticket.reportedByName}</p>
              {ticket.contactEmail && <p><strong>Email:</strong> {ticket.contactEmail}</p>}
              {ticket.contactPhone && <p><strong>Phone:</strong> {ticket.contactPhone}</p>}
           </div>
           <div className="rounded-xl border border-orange-700/40 bg-black/35 p-4 text-orange-100">
              <label className="block text-sm font-medium text-orange-200 mb-2">Assignment</label>
              <p><strong>Technician:</strong> {ticket.assignedTechnicianName || "Unassigned"}</p>
           </div>
        </div>
        
        {ticket.rejectionReason && (
           <div className="rounded-xl border border-red-700/50 bg-red-900/20 p-4">
              <strong className="text-red-200">Rejection Reason:</strong>
              <p className="text-red-100 mt-2">{ticket.rejectionReason}</p>
           </div>
        )}
        
        {ticket.resolutionNotes && (
           <div className="rounded-xl border border-emerald-700/50 bg-emerald-900/20 p-4">
              <strong className="text-emerald-200">Resolution details:</strong>
              <p className="text-emerald-100 mt-2">{ticket.resolutionNotes}</p>
           </div>
        )}

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="flex items-center gap-2 text-orange-100 font-semibold"><PaperClipIcon className="h-5 w-5" /> Attachments ({ticket.attachments.length})</h4>
            <div className="flex gap-4 flex-wrap mt-2">
               {ticket.attachments.map(att => (
                 <a 
                   key={att.filename} 
                  href={`${apiBase}/api/tickets/attachments/${att.filename}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="rounded-lg border border-orange-700/40 bg-black/30 px-3 py-2 text-orange-100/85 hover:bg-orange-900/20"
                 >
                   <span className="text-sm">{att.originalName}</span>
                 </a>
               ))}
            </div>
          </div>
        )}
      </div>

      {(role === "ADMIN" || role === "TECHNICIAN") && (
         <AdminControls ticket={ticket} onUpdated={(updatedTick) => setTicket(updatedTick)} />
      )}

      <hr className="border-0 border-t border-orange-700/40 my-8" />

      <CommentSection 
        ticketId={id} 
        comments={ticket.comments} 
        onCommentAdded={(c) => setTicket({...ticket, comments: [...(ticket.comments || []), c]})}
        onCommentDeleted={(cId) => setTicket({...ticket, comments: (ticket.comments || []).filter(c => c.id !== cId)})}
        onCommentEdited={(updatedC) => setTicket({...ticket, comments: (ticket.comments || []).map(c => c.id === updatedC.id ? updatedC : c)})}
      />
    </div>
    </div>
    </main>
  );
};

export default TicketDetailPage;
