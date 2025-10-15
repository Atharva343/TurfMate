import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found.");
        }
        const res = await axiosInstance.get("/tickets/my");

        const ticketsData = res.data.tickets || [];
        if (!Array.isArray(ticketsData)) {
          throw new Error("Invalid ticket data format.");
        }
        setTickets(ticketsData);
      } catch (err) {
        console.error(
          "Error fetching tickets:",
          err.response?.data || err.message
        );
        setError(
          err.response?.status === 401
            ? "Authentication failed. Please log in again."
            : "Failed to load tickets. Please try again or check your login."
        );
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading tickets...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary ml-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
      {tickets.length === 0 ? (
        <p>You haven’t created any tickets yet.</p>
      ) : (
        tickets.map((t) => (
          <div key={t._id} className="card  shadow-md p-4 mb-3">
            <h3 className="font-semibold">{t.turfName || t.turf?.name}</h3>{" "}
            <p>Time: {new Date(t.time).toLocaleString()}</p>
            <p>Interested Players:</p>
            <ul className="list-disc pl-6">
              {t.interestedUsers?.length === 0 ? (
                <li className="text-gray-500">No one yet</li>
              ) : (
                t.interestedUsers.map((u) => (
                  <li key={u._id}>{u.name || u.email}</li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default MyTickets;
