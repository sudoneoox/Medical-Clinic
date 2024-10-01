import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/tailwindbase.css";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import api from "../api.js";

export default function SignUp() {
  const navigate = useNavigate();

  // State to manage form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    providerType: "",
    licenseNumber: "",
    employeeId: "",
    dob: "",
    gender: "",
    race: "",
    ethnicity: "",
  });

  // State to manage form step
  const [step, setStep] = useState(1);
  // Navbar items for the navigation component
  const navbarItems = [];

  // Props for login button on the navbar

  const userLoginButton = {
    buttonText: "Sign in",
    buttonLink: "/login",
    buttonClassName:
      "text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:underline",
  };

  // Handle input change for form fields

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      console.log("Getting demographic data");
      setStep(3);
    } else if (step === 3 && formData.role === "Patient") {
      console.log("Enrolling patient:", formData);
      // submit patient data to enroll in backend
      try {
        const response = await api.post(
          "http://localhost:5000/api/users/register",
          formData
        );
        console.log("User Patient registration successful: ", response.data);
        navigate("/login");
      } catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Registration failed: ", err.response.data.message);
          // Show error message to user
        } else if (err.request) {
          // The request was made but no response was received
          console.log("No response received: ", err.request);
          // Show network error message to user
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", err.message);
          // Show general error message to user
        }
      }
    } else if (step === 3 && formData.role === "Provider") {
      setStep(4);
    } else if (step === 4) {
      console.log("Submitting provider data:", formData);
      // submit provider data to backend
      try {
        const response = await api.post(
          "http://localhost:5000/api/users/register",
          formData
        );
        console.log("User Provider Regitrations successful: ", response.data);
        navigate("/login");
      } catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Registration failed: ", err.response.data.message);
          // Show error message to user
        } else if (err.request) {
          // The request was made but no response was received
          console.log("No response received: ", err.request);
          // Show network error message to user
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", err.message);
          // Show general error message to user
        }
      }
    }
  };

  // Render appropriate form fields based on the current step
  const renderFormFields = () => {
    const fields = {
      1: [
        { name: "username", label: "Username", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
          pattern: ".{8,}",
          title: "Password must be at least 8 characters long",
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          pattern: "\\+?[0-9]{10,14}",
          title:
            "Phone number must be 10-14 digits, optionally starting with +",
          required: true,
        },
      ],
      2: [
        { name: "dob", label: "Date of Birth", type: "date", required: true },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            "Male",
            "Female",
            "Non-binary",
            "Prefer not to say",
            "Other",
          ],
          required: true,
        },
        {
          name: "race",
          label: "Race",
          type: "select",
          options: [
            "American Indian or Alaska Native",
            "Asian",
            "Black or African American",
            "Native Hawaiian or Other Pacific Islander",
            "White",
            "Other",
            "Prefer not to say",
          ],
          required: true,
        },
        {
          name: "ethnicity",
          label: "Ethnicity",
          type: "select",
          options: [
            "Hispanic or Latino",
            "Not Hispanic or Latino",
            "Prefer not to say",
          ],
          required: true,
        },
      ],
      3: [
        {
          name: "role",
          label: "Role",
          type: "select",
          options: ["Patient", "Provider"],
          required: true,
        },
      ],
      4: [
        {
          name: "providerType",
          label: "Provider Type",
          type: "select",
          options: ["Nurse", "Receptionist", "Doctor"],
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
      ],
    };

    return fields[step].map((field) => (
      <FormField
        key={field.name}
        field={field}
        value={formData[field.name]}
        onChange={handleChange}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar items={navbarItems} customButtonProps={userLoginButton} />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create your account
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            {step === 1
              ? "Let's get started!"
              : step === 2
              ? "Just a bit more info..."
              : step === 3
              ? "Final step for patients"
              : "Final step for providers"}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFormFields()}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {step === 1
                ? "Next"
                : step === 2
                ? formData.role === "Patient"
                  ? "Enroll"
                  : "Next"
                : "Submit"}
            </button>
          </form>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}