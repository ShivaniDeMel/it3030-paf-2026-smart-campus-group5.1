import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ticketAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const TicketSubmissionForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: "GENERAL",
    priority: "LOW",
    description: "",
    contactEmail: "",
    contactPhone: "",
    preferredContactMethod: "EMAIL",
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 3) {
      setError("Maximum 3 files allowed as evidence.");
      return;
    }
    setFiles([...files, ...selected]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    const data = new FormData();
    data.append("category", formData.category);
    data.append("priority", formData.priority);
    data.append("description", formData.description);
    data.append("contactEmail", formData.contactEmail);
    data.append("contactPhone", formData.contactPhone);
    data.append("preferredContactMethod", formData.preferredContactMethod);
    
    files.forEach(f => {
      data.append("files", f);
    });

    try {
      const res = await ticketAPI.createTicket(data, user);
      navigate(`/tickets/${res.data.id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit ticket.");
    }
    setSubmitting(false);
  };

  return (
    <main className="relative min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-black via-orange-800 to-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 py-12">
        <section className="glass-card p-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Report Incident</h1>
          <p className="text-orange-200/80 mb-6">Create a maintenance ticket with optional evidence files.</p>
          {error && (
            <p className="mb-4 rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
      
          <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-orange-200 mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="dark-input">
              <option value="GENERAL">General Maintenance</option>
              <option value="ELECTRICAL">Electrical Issue</option>
              <option value="PLUMBING">Plumbing Issue</option>
              <option value="HVAC">Heating / AC</option>
              <option value="NETWORK">Network / IT</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-orange-200 mb-2">Priority Level</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="dark-input">
              <option value="LOW">Low (Routine)</option>
              <option value="MEDIUM">Medium (Needs attention)</option>
              <option value="HIGH">High (Urgent)</option>
              <option value="CRITICAL">Critical (Emergency)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-orange-200 mb-2">Detailed Description</label>
          <textarea 
            name="description" 
            rows="5" 
            value={formData.description} 
            onChange={handleChange} 
            className="dark-input" 
            required 
            placeholder="Please provide specifics about the issue..."
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
           <div>
              <label className="block text-sm font-medium text-orange-200 mb-2">Contact Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="dark-input" />
           </div>
           <div>
              <label className="block text-sm font-medium text-orange-200 mb-2">Contact Phone</label>
              <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="dark-input" />
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-orange-200 mb-2">Attach Evidence (Max 3 Images)</label>
           
           <label className="block cursor-pointer rounded-xl border border-orange-700/50 bg-black/40 px-6 py-8 text-center text-orange-100 hover:bg-orange-900/30 transition-colors" htmlFor="fileUpload">
              <ArrowUpTrayIcon className="h-10 w-10 text-orange-300 mx-auto mb-2" />
              <p>Click to browse images or drag them here.</p>
           </label>
           <input 
              id="fileUpload" 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange} 
            style={{ display: "none" }}
            />
            
            {files.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg border border-orange-700/40 bg-black/30 px-3 py-2">
                     <span className="text-sm text-orange-100/85">{file.name}</span>
                     <button type="button" onClick={() => removeFile(idx)} className="text-red-300 hover:text-red-200"><XMarkIcon className="h-4 w-4"/></button>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-orange-700/40">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-lg border border-orange-700/50 text-orange-100 hover:bg-orange-900/20 transition-colors">Cancel</button>
          <button type="submit" className="button-primary disabled:opacity-60 disabled:cursor-not-allowed" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Incident Ticket"}
          </button>
        </div>
      </form>
        </section>
      </div>
    </main>
  );
};

export default TicketSubmissionForm;
