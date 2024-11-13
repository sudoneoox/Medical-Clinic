import React, { useState } from "react";
import Navbar from "../components/UI/Navbar.jsx";
import "../styles/tailwindbase.css";
import api, { API } from "../api.js";
import { useNavigate } from "react-router-dom";
import { Building2, Users, ClipboardList, Activity } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navbaritems = [];

  const userSignupButton = {
    buttonText: "Sign Up",
    buttonLink: "/registrations/new",
    buttonClassName:
      "text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:underline",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post(API.URL + "/api/users/login", formData);

      // Store the token and user info in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userFullName", response.data.userFullName);
      localStorage.setItem("userEmail", response.data.email);
      console.log("RESPONSE GOTTEN FROM LOGIN ", response);
      // Redirect based on user role
      navigate("/portal");
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "Login failed. Please try again.",
        );
      } else if (err.request) {
        setError("No response received from server. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <Navbar items={navbaritems} customButtonProps={userSignupButton} />
      {/* LOGIN  */}
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-12 w-auto"
                src="images/logo.png"
                alt="MedicalClinicLogo"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Log in to your account
              </h2>
            </div>
            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm font-bold ">
                      {error}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Log In
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>

                {/* <div className="mt-6 grid grid-cols-2 gap-3"> */}
                {/*   <a */}
                {/*     href="/forgot_password" */}
                {/*     className="text-blue-800 dark:text-blue-500 hover:underline" */}
                {/*   > */}
                {/*     Forgot Your password? */}
                {/*   </a> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="flex flex-col justify-center items-center h-full px-12 text-white">
              <h2 className="text-3xl font-bold mb-8">
                Welcome to WSYK Clinic
              </h2>

              {/* Stats/Info Grid */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
                <div className="text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-2xl font-bold mb-2">3</p>
                  <p className="text-sm">Locations</p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-2xl font-bold mb-2">25+</p>
                  <p className="text-sm">Healthcare Providers</p>
                </div>
                <div className="text-center">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-2xl font-bold mb-2">15+</p>
                  <p className="text-sm">Specialties</p>
                </div>
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-2xl font-bold mb-2">24/7</p>
                  <p className="text-sm">Emergency Care</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-lg mb-4">
                  Access your medical records, schedule appointments, and manage
                  your healthcare journey.
                </p>
                <p className="text-sm opacity-80">
                  New to WSYK Clinic? Sign up for a patient account to get
                  started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
