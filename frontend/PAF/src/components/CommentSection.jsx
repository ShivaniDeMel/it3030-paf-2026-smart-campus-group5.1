import { useState } from "react";
import { CheckIcon, PencilIcon, TrashIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ticketAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const CommentSection = ({ ticketId, comments, onCommentAdded, onCommentDeleted, onCommentEdited }) => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = user?.id || user?.userId || user?.email || "anon";
  const role = (user?.role || "USER").toString().toUpperCase();

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await ticketAPI.addComment(ticketId, { text: newComment }, user);
      setNewComment("");
      onCommentAdded(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post comment.");
    }
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    setError("");
    try {
      await ticketAPI.deleteComment(ticketId, commentId, user);
      if (onCommentDeleted) onCommentDeleted(commentId);
    } catch (err) {
      setError(err?.response?.data?.message || "You cannot delete this comment.");
    }
  };

  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    setError("");
    try {
      const res = await ticketAPI.editComment(ticketId, commentId, { text: editText }, user);
      if (onCommentEdited) onCommentEdited(res.data);
      setEditingId(null);
      setEditText("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to edit comment.");
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-orange-100 mb-4">Comments</h3>
      {error && (
        <p className="mb-3 rounded-lg border border-red-700/50 bg-red-900/20 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      
      <div className="flex flex-col gap-4 mb-8">
        {!comments || comments.length === 0 ? (
          <p className="text-orange-200/70 text-sm">No comments yet.</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="glass-card p-4 border border-orange-700/40">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-600/30 p-1 rounded-full">
                    <UserIcon className="h-4 w-4 text-orange-100" />
                  </div>
                  <strong className="text-white">{c.authorName}</strong>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/40 border border-orange-700/40 text-orange-200">{c.role}</span>
                  <span className="text-xs text-orange-200/60">
                    {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  {c.authorId === userId && editingId !== c.id && (
                    <button onClick={() => startEditing(c)} className="p-1.5 rounded-md border border-orange-700/40 text-orange-200 hover:bg-orange-900/30" title="Edit">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                  {(c.authorId === userId || role === 'ADMIN') && editingId !== c.id && (
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md border border-red-700/40 text-red-200 hover:bg-red-900/30" title="Delete">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {editingId === c.id ? (
                <div className="mt-2 text-right">
                  <textarea 
                    className="dark-input mb-2" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)} 
                    rows="2"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={cancelEdit} className="px-3 py-1.5 rounded-md border border-orange-700/40 text-orange-100"><XMarkIcon className="h-4 w-4" /></button>
                    <button onClick={() => handleEditSave(c.id)} className="px-3 py-1.5 rounded-md bg-orange-600 text-white"><CheckIcon className="h-4 w-4" /></button>
                  </div>
                </div>
              ) : (
                <p className="text-orange-100/90">{c.text}</p>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment}>
        <div className="mb-2">
          <textarea 
            rows="3" 
            className="dark-input" 
            placeholder="Write a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
        <button type="submit" className="button-primary disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading || !newComment.trim()}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
