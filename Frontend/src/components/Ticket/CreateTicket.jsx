import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Theme from "../Theme";
import { useAuth } from "../../context/AuthContext";

const URL = import.meta.env.VITE_URL;

function CreateTicket() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [turfName, setTurfName] = useState("");
  const navigate = useNavigate();
  const { turfId } = useParams();
  const { updateLoginStatus } = useAuth();

  // Helper function to decode turfId
  const decodeTurfId = (turfId) => {
    return turfId.replace("-", "/");
  };

  // Fetch turf details using turfId
  useEffect(() => {
    if (turfId) {
      const decodedTurfIdv = decodeTurfId(turfId);
      console.log("decoded", decodedTurfIdv);
      axiosInstance
        .get(`${URL}/turfs/show`, {
          params: {
            lat: 18.5204,
            lon: 73.8567,
            radius: 2000,
          },
        })
        .then((res) => {
          console.log(res.data.turfs);
          const turf = res.data.turfs.find((t) => t.id === decodedTurfIdv);
          console.log(turf);
          if (turf) {
            setTurfName(turf.name);
          } else {
            toast.error("Turf not found");
          }
        })
        .catch((err) => {
          console.error("Error fetching turf:", err);
          toast.error("Failed to fetch turf details");
        });
    }
  }, [turfId]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");

    if (!turfId) {
      toast.error("Turf ID missing — cannot create ticket");
      return;
    }

    const url = `${URL}/tickets/create/${turfId}`;

    const payload = {
      ...data,
      turfName,
    };

    try {
      const result = await axiosInstance.post(url, payload);
      console.log("Ticket creation response:", result.data); // Log response
      toast.success("Ticket Created Successfully");
      reset();
      setTimeout(() => {
        navigate(`/turf/${turfId}`);
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create ticket";
      console.error("Ticket creation error:", err.response || err); // Log error
      toast.error(errorMsg);
    }
  };

  const onError = (errors) => {
    if (errors.time) toast.error(errors.time.message);
    if (errors.numberOfPlayers) toast.error(errors.numberOfPlayers.message);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-base-200">
      <div className="absolute top-4 left-4">
        <Theme />
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center text-primary mb-4">
            Create Ticket
          </h1>
          <h3 className="text-lg font-semibold text-center mb-4">
            {turfName || "Loading turf name..."}
          </h3>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Time</span>
              </label>
              <input
                {...register("time", { required: "Time is required" })}
                type="datetime-local"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Number of Players</span>
              </label>
              <input
                {...register("numberOfPlayers", {
                  required: "Number of players is required",
                  min: {
                    value: 1,
                    message: "Must be at least 1 player",
                  },
                })}
                type="number"
                placeholder="Enter number of players"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Create Ticket
              </button>
            </div>
          </form>

          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
