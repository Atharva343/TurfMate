import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

function TicketCard({ ticket, onInterest }) {
  const [loading, setLoading] = useState(false);

  const handleInterest = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/tickets/interest/${ticket._id}`);
      toast.success("Interest registered!");
      onInterest?.(); // Refresh the ticket list
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md p-4 mb-3">
      <h3 className="text-lg font-semibold">{ticket.turfName}</h3>
      <p>Time: {new Date(ticket.time).toLocaleString()}</p>
      <p>Players Needed: {ticket.numberOfPlayers}</p>
      <p className="text-sm text-gray-500">
        Created by: {ticket.createdBy?.name || ticket.createdBy?.email}
      </p>
      <p>Interested: {ticket.interestedUsers?.length || 0}</p>

      <button
        onClick={handleInterest}
        className="btn btn-primary mt-3"
        disabled={loading}
      >
        {loading ? "Sending..." : "I'm Interested"}
      </button>
    </div>
  );
}

export default TicketCard;
