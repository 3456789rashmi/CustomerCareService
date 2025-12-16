import React, { useState } from "react";
import { enquiryAPI } from "../services/api";

function AdminReplyBox({ enquiry, onReplySent }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      setError("Reply cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await enquiryAPI.adminReply(enquiry._id, reply);
      setSuccess("Reply sent successfully!");
      setReply("");
      if (onReplySent) onReplySent();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReply} className="flex flex-col gap-2 mt-2">
      <textarea
        className="border rounded p-2 text-sm"
        rows={2}
        placeholder="Type your reply to the user..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        disabled={loading}
      />
      <div className="flex gap-2 items-center">
        <button
          type="submit"
          className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary text-sm disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reply"}
        </button>
        {error && <span className="text-red-600 text-xs">{error}</span>}
        {success && <span className="text-green-600 text-xs">{success}</span>}
      </div>
    </form>
  );
}

export default AdminReplyBox;