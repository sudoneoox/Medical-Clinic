import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/tailwindbase.css";

// To add aditional fileds for the forms
const AdditionalInfo = ({ fields, onChange }) => {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      ))}
    </div>
  );
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});

  const navbarItems = [];

  const userLoginButton = {
    buttonText: "Sign in",
    buttonLink: "/login",
    buttonClassName:
      "text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:underline",
  };

  // For the information were asking for the database 
  const additionalFields = [
    { name: "fullName", label: "Full Name", type: "text" },
    { name: "phoneNumber", label: "Phone Number", type: "tel" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showAdditionalInfo) {
      setShowAdditionalInfo(true);
    } else {
      // Handle the final submission here
      console.log("Form submitted", { email, password, ...additionalInfo });
    }
  };

  const handleAdditionalInfoChange = (e) => {
    setAdditionalInfo({ ...additionalInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar items={navbarItems} customButtonProps={userLoginButton} />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Create your account</h2>
          <p className="text-gray-600 mb-6 text-center">
            Dont worry, this won't take long!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!showAdditionalInfo ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </>
            ) : (
              <AdditionalInfo fields={additionalFields} onChange={handleAdditionalInfoChange} />
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showAdditionalInfo ? "Submit" : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-gray-600">
            We just need to ask a couple more questions!
          </p>
        </div>
      </div>
    </div>
  );
}