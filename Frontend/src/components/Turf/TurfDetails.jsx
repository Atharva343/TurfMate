import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import TicketCard from "../Ticket/TicketCard";
import { useParams } from "react-router-dom";

function TurfDetails() {
  const { turfId } = useParams();
  const [tickets, setTickets] = useState([]);

  const decodeTurfId = (turfId) => turfId.replace("/", "-");

  const fetchTickets = async () => {
    const decodedTurfId = decodeTurfId(turfId);
    const res = await axiosInstance.get(`/tickets/turf/${decodedTurfId}`);
    setTickets(res.data.tickets);
  };

  useEffect(() => {
    fetchTickets();
  }, [turfId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets yet for this turf.</p>
      ) : (
        tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            onInterest={fetchTickets}
          />
        ))
      )}
    </div>
  );
}

export default TurfDetails;
