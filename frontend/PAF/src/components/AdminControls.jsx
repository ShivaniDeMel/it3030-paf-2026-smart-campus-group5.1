import { useEffect, useMemo, useState } from "react";
import { adminAPI, ticketAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const AdminControls = ({ ticket, onUpdated }) => {
  const { user } = useAuth();
  const role = (user?.role || "USER").toString().toUpperCase();
  const isAdmin = role === "ADMIN";
  const isTechnician = role === "TECHNICIAN";
  const [status, setStatus] = useState(ticket.status);
  const [notes, setNotes] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const technicianOptions = useMemo(() => {
    const sorted = [...technicians].sort((a, b) =>
      `${a.firstName || ""} ${a.lastName || ""}`.localeCompare(
        `${b.firstName || ""} ${b.lastName || ""}`
      )
    );
    return sorted.map((tech, index) => ({
      ...tech,
      referenceId: `TN${String(index + 1).padStart(2, "0")}`,
      displayName: `${tech.firstName || ""} ${tech.lastName || ""}`.trim() || tech.email || "Technician",
    }));
  }, [technicians]);

  const technicianById = useMemo(() => {
    const map = {};
    technicianOptions.forEach((tech) => {
      map[tech.id] = tech;
    });
    return map;
  }, [technicianOptions]);

  const technicianByReferenceId = useMemo(() => {
    const map = {};
    technicianOptions.forEach((tech) => {
      map[tech.referenceId] = tech;
    });
    return map;
  }, [technicianOptions]);

  useEffect(() => {
    const loadTechnicians = async () => {
      if (!isAdmin) return;
      try {
        const res = await adminAPI.getUsers();
        const allUsers = res.data || [];
        setTechnicians(
          allUsers.filter(
            (userItem) => (userItem.role || "").toUpperCase() === "TECHNICIAN"
          )
        );
      } catch {
        // ignore: assignment can still use manual ID entry fallback
      }
    };
    loadTechnicians();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || technicianOptions.length === 0) return;
    if (!ticket.assignedTechnicianId) return;

    const matched = technicianOptions.find((tech) => tech.id === ticket.assignedTechnicianId);
    if (matched) {
      setTechnicianId(matched.referenceId);
    }
  }, [isAdmin, technicianOptions, ticket.assignedTechnicianId]);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = { status };
      if (isAdmin && status === "REJECTED") payload.rejectionReason = notes;
      if ((status === "RESOLVED" || status === "CLOSED") && notes.trim()) {
        payload.resolutionNotes = notes;
      }
      
      const res = await ticketAPI.updateTicketStatus(ticket.id, payload, user);
      onUpdated(res.data);
      if (isTechnician && status === "RESOLVED" && notes.trim()) {
        const resolutionResponse = await ticketAPI.addResolution(ticket.id, notes.trim(), user);
        onUpdated(resolutionResponse.data);
      }
      setNotes("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status.");
    }
    setLoading(false);
  };

  const handleAssign = async () => {
    if (!technicianId.trim()) {
      setError("Technician ID is required.");
      return;
    }

    const selectedTechnician =
      technicianByReferenceId[technicianId.trim()] || technicianById[technicianId.trim()];
    const backendTechnicianId = selectedTechnician?.id || technicianId.trim();
    const backendTechnicianName = selectedTechnician?.displayName || technicianId.trim();

    setLoading(true);
    setError("");
    try {
      const res = await ticketAPI.assignTechnician(
        ticket.id,
        backendTechnicianId,
        backendTechnicianName,
        user
      );
      onUpdated(res.data);
    } catch (err) {
      const backendMessage =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message;
      const networkMessage = !err?.response
        ? "Request blocked before reaching server. Check backend CORS/server status."
        : "";
      setError(backendMessage || networkMessage || "Failed to assign technician.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await ticketAPI.rejectTicket(ticket.id, notes.trim(), user);
      onUpdated(res.data);
      setNotes("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reject ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5 border border-orange-700/40">
      <h4 className="text-lg font-bold text-orange-100 mb-4">
        {isTechnician ? "Technician Controls" : "Admin Controls"}
      </h4>
      {error && (
        <p className="mb-3 rounded-lg border border-red-700/50 bg-red-900/20 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="text-sm font-medium text-orange-200">Change Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="dark-input max-w-xs">
          {isAdmin && <option value="OPEN">Open</option>}
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          {isAdmin && <option value="CLOSED">Closed</option>}
          {isAdmin && <option value="REJECTED">Rejected</option>}
        </select>
        
        {status === "IN_PROGRESS" && !ticket.assignedTechnicianId && (
           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-500/40">
             Will self-assign upon update
           </span>
        )}
      </div>

      {isAdmin && (
        <>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <select
              className="dark-input"
              value={technicianId}
              onChange={(event) => {
                const selected = technicianOptions.find((tech) => tech.id === event.target.value);
                setTechnicianId(selected?.referenceId || "");
              }}
            >
              <option value="">Select technician (TNxx)</option>
              {technicianOptions.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.referenceId} - {tech.displayName}
                </option>
              ))}
            </select>
            <input
              value={technicianId}
              placeholder="Technician ID (auto-filled from TNxx)"
              className="dark-input"
              readOnly
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleAssign}
              type="button"
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-60"
            >
              Assign Technician
            </button>
            <button
              onClick={handleReject}
              type="button"
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-60"
            >
              Reject Ticket
            </button>
          </div>
        </>
      )}

      {(status === "REJECTED" || status === "RESOLVED") && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-orange-200 mb-2">
            {status === "REJECTED" ? "Rejection Reason" : "Resolution Notes"}
          </label>
          <textarea 
            className="dark-input" 
            rows="3" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`Enter ${status === "REJECTED" ? "reason for rejection" : "resolution details"}...`}
          />
        </div>
      )}

      <button onClick={handleUpdate} disabled={loading || status === ticket.status} className="button-primary disabled:opacity-60 disabled:cursor-not-allowed">
        Update Status
      </button>
    </div>
  );
};

export default AdminControls;
