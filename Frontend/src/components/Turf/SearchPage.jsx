import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TurfCard from "./TurfCard";

const URL = import.meta.env.VITE_URL;

function SearchPage() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  useEffect(() => {
    async function fetchTurfs() {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/turfs/search`, {
          params: { q: query },
        });
        setTurfs(res.data.turfs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (query) fetchTurfs();
  }, [query]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {loading ? (
        <div className="text-center mt-10">Loading turfs...</div>
      ) : turfs.length === 0 ? (
        <div className="text-center mt-10">No turfs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {turfs.map((turf, index) => (
            <TurfCard key={index} turf={turf} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
