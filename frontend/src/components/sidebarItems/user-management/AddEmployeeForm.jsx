import React, { useState } from "react";
import api from "../../../api.js";
import { Alert, AlertTitle } from "../../../utils/Alerts.tsx";
const AddEmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/portal/management", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        sidebarItem: "USER MANAGEMENT",
        managementData: {
          analyticType: "ADDEMPLOYEE",
          employeeData: {
            employee_no: employeeData.employeeId,
            employee_role: employeeData.role,
          },
        },
      });

      if (response.data.success) {
        setEmployeeData({ employeeId: "", role: "" });
        setError("");
        setSuccessMessage(
          `Successfully added new employee no: ${employeeData.employeeId}`,
        );
        setShowSuccess(true);

        // remove popup after 5 sec
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <>
      <div className="spacy-y-4">
        {showSuccess && (
          <Alert className="mb-4">
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
        )}
      </div>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            type="number"
            value={employeeData.employeeId}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                employeeId: e.target.value,
              }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter employee ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={employeeData.role}
            onChange={(e) =>
              setEmployeeData((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Role</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="RECEPTIONIST">Receptionist</option>
          </select>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Add Employee
        </button>
      </form>
    </>
  );
};

export default AddEmployeeForm;
