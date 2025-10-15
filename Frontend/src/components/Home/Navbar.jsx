import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Theme from "../Theme";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onToggleDrawer }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onsubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <button className="btn btn-ghost btn-circle" onClick={onToggleDrawer}>
          <FaBars className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="navbar-center">
        <form onSubmit={onsubmit}>
          <div className="form-control">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder="Search turfs..."
                className="input input-bordered w-80"
              />
              <button className="btn btn-ghost btn-circle absolute right-0 top-0 h-full px-3 flex items-center justify-center">
                <CiSearch className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="navbar-end flex items-center gap-2">
        <Theme />
        {isLoggedIn ? (
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle className="h-6 w-6 text-gray-600" />
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
