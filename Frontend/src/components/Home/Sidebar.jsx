import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ onClose }) {
  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li className="mb-4">
        <h2 className="text-lg font-bold">Menu</h2>
      </li>
      <li>
        <Link to="/home" onClick={onClose}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/my-tickets" onClick={onClose}>
          My Tickets
        </Link>
      </li>
      <li>
        <Link to="/profile" onClick={onClose}>
          Profile
        </Link>
      </li>
    </ul>
  );
}

export default Sidebar;
