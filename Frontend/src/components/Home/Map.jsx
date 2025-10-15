import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import { ToastContainer, toast } from "react-toastify";
const URL = import.meta.env.VITE_URL;
import { useNavigate } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Map() {
  const [turfs, setTurfs] = useState([]);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      setLocation({ lat: 18.5204, lon: 73.8567 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        console.error("Location not found, using default:", err);
        toast.warning(
          "Using default location. Allow access for accurate results."
        );
        setLocation({ lat: 18.5204, lon: 73.8567 });
      }
    );
  }, []);

  useEffect(() => {
    if (location && location.lat && location.lon) {
      axios
        .get(`${URL}/turfs/show`, {
          params: {
            lat: location.lat,
            lon: location.lon,
            radius: 2000,
          },
        })
        .then((res) => {
          setTurfs(res.data.turfs);
        })
        .catch((err) => console.error(err));
    }
  }, [location]);

  const encodeTurfId = (turfId) => turfId.replace("/", "-");

  return (
    <div className="w-full h-screen">
      {!location ? (
        <div className="flex items-center justify-center h-full text-lg font-semibold">
          Getting your location...
        </div>
      ) : (
        <>
          <MapContainer
            center={[location.lat, location.lon]}
            zoomControl={false}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            />

            <Marker position={[location.lat, location.lon]}>
              <Popup>You are here</Popup>
            </Marker>

            {turfs.map((turf) => (
              <Marker key={turf.id} position={[turf.lat, turf.lon]}>
                <Popup>
                  <div className="text-center space-y-2">
                    <b className="block text-primary text-lg">{turf.name}</b>
                    <p className="text-sm text-gray-600">{turf.type}</p>

                    <div className="flex justify-center gap-2 mt-2">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() =>
                          navigate(`/turf/${encodeTurfId(turf.id)}`)
                        }
                      >
                        View Tickets
                      </button>

                      <button
                        className="btn btn-xs btn-secondary"
                        onClick={() =>
                          navigate(
                            `/turf/${encodeTurfId(turf.id)}/create-ticket`
                          )
                        }
                      >
                        Create Ticket
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Map;
