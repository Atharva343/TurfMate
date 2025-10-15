import React from "react";
import { useNavigate } from "react-router-dom";

function TurfCard({ turf }) {
  const navigate = useNavigate();

  // Helper function to encode turfId
  const encodeTurfId = (turfId) => turfId.replace("/", "-");

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition">
      <div className="card-body">
        <h2 className="card-title text-primary">{turf.name}</h2>
        <p className="text-sm text-gray-500">{turf.address}</p>
        <p className="text-sm mb-2">Type: {turf.type}</p>

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate(`/turf/${encodeTurfId(turf.id)}`)}
          >
            View Tickets
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() =>
              navigate(`/turf/${encodeTurfId(turf.id)}/create-ticket`)
            }
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default TurfCard;
