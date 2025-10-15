import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Theme from "../Theme";
import { useAuth } from "../../context/AuthContext";

const URL = import.meta.env.VITE_URL;

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const { updateLoginStatus } = useAuth();

  const onSubmit = (data) => {
    const url = `${URL}/auth/signup`;
    axios
      .post(url, data)
      .then((result) => {
        const { newUser, jwtToken } = result.data;
        console.log(newUser);
        toast.success("Signed up Successfully");
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        updateLoginStatus();
        reset();
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.error || "Signup failed";
        toast.error(errorMsg);
      });
  };

  const onError = (errors) => {
    if (errors.name) toast.error(errors.name.message);
    if (errors.email) toast.error(errors.email.message);
    if (errors.password) toast.error(errors.password.message);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-base-200">
      <div className="absolute top-4 left-4">
        <Theme></Theme>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center text-primary mb-4">
            Signup
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Enter your name"
                className="input input-bordered w-full"
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                {...register("password", {
                  required: "Password required",
                  minLength: {
                    value: 6,
                    message: "Password must be of minimum 6 characters",
                  },
                })}
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
            </div>

            {/* Actions */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Sign Up
              </button>
              <p className="text-sm mt-2 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>

          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      </div>
    </div>
  );
}

export default Signup;
