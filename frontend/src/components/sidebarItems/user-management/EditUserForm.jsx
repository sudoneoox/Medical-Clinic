import React, { useState, useEffect } from "react";
import api from "../../../api.js";
import { X } from "lucide-react";

const EditUserForm = ({ user, onClose, onUpdate, userType }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Convert user data to form data
      const initialFormData = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        ...(user.emergencyContact
          ? { emergencyContact: JSON.parse(user.emergencyContact) }
          : {
              emergencyContact: {
                name: "",
                relationship: "",
                phone: "",
              },
            }),
        // Add specific fields based on user type
        ...(userType === "DOCTOR"
          ? {
              specialization: user.specialization || "",
            }
          : {}),
        ...(userType === "NURSE" ? {} : {}),
      };

      setFormData(initialFormData);
    }
  }, [user, userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert emergency contact back to string
      const submissionData = {
        ...formData,
        emergencyContact: JSON.stringify(formData.emergencyContact),
      };
      // TODO: implement backend api
      const response = await api.post("/users/portal/management/update", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        targetUserId: user.id,
        userType: userType,
        userData: submissionData,
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const renderField = (key, label, type = "text") => {
    // Skip rendering emergencyContact as it's handled separately
    if (key === "emergencyContact") return null;

    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          type={type}
          value={formData[key] || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, [key]: e.target.value }))
          }
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    );
  };

  const renderUserSpecificFields = () => {
    switch (userType) {
      case "DOCTOR":
        return <>{renderField("specialization", "Specialization")}</>;
      case "PATIENT":
        return <>{renderField("dateOfBirth", "Date of Birth", "date")}</>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit {userType.toLowerCase()}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Basic Information</h3>
            {renderField("name", "Name")}
            {renderField("email", "Email", "email")}
            {renderField("phone", "Phone")}
          </div>

          {/* Emergency Contact */}
          {userType === "PATIENT" && (
            <div className="space-y-4">
              <h3 className="font-medium">Emergency Contact</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.name || ""}
                    onChange={(e) =>
                      handleEmergencyContactChange("name", e.target.value)
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.relationship || ""}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        "relationship",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.phone || ""}
                    onChange={(e) =>
                      handleEmergencyContactChange("phone", e.target.value)
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* User Specific Fields */}
          <div className="space-y-4">
            <h3 className="font-medium">Additional Information</h3>
            {renderUserSpecificFields()}
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
