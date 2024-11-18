import React, { useState, useEffect } from "react";
import Tabs from "./Tabs.jsx";
import AccountSettings from "./AcountSettings.jsx";
import PasswordSettings from "./PasswordSettings.jsx";
import EmergencyContacts from "./EmergencyContacts.jsx";
import AlertMessage from "./AlertMessage.jsx";
import { Settings as SettingsIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../utils/Card.tsx";
import api, { API } from "../../../api.js";
import "../../../styles/tailwindbase.css";

// BUG: password changes change even when the password is incorrect
// need to fix backend logic to only change password if the field currentPassword is correct

const Settings = ({ data }) => {
  const userRole = localStorage.getItem("userRole");
  const [activeTab, setActiveTab] = useState("account");
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    account: { email: "", phone: "", username: "" },
    password: { currentPassword: "", newPassword: "", confirmPassword: "" },
    emergency: { contacts: [] },
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        account: {
          email: data.user?.user_email || "",
          phone: data.user?.user_phone || "",
          username: data.user?.user_username || "",
        },
        emergency: {
          contacts: data.emergency_contacts
            ? JSON.parse(data.emergency_contacts)
            : [],
        },
      }));
    }
  }, [data]);

  const handleSubmit = async (section) => {
    try {
      const response = await api.post(API.URL + "/api/users/portal/settings", {
        section,
        data: formData[section],
        sidebarItem: "SETTINGS",
        user_id: localStorage.getItem("userId"),
        user_role: userRole,
      });

      const result = response.data;

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Settings updated successfully",
        });

        if (section === "account") {
          setFormData((prev) => ({
            ...prev,
            account: {
              username: "",
              phone: "",
              email: "",
            }
          }));
        }

        // clear password fields if it was a password update
        if (section === "password") {
          setFormData((prev) => ({
            ...prev,
            password: {
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            },
          }));
        }
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        throw new Error(result.message || "Failed to update settings");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to update settings",
      });
    }
  };
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergency.contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      emergency: {
        contacts: updatedContacts,
      },
    }));
  };

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergency: {
        contacts: [
          ...prev.emergency.contacts,
          { name: "", relationship: "", phone: "" },
        ],
      },
    }));
  };

  const removeEmergencyContact = (index) => {
    const updatedContacts = formData.emergency.contacts.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({
      ...prev,
      emergency: {
        contacts: updatedContacts,
      },
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      {message && <AlertMessage message={message} />}
      <div className="flex gap-6">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
        />
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{/* Set Active Tab Title */}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeTab === "account" && (
              <AccountSettings
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            )}
            {activeTab === "password" && (
              <PasswordSettings
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            )}
            {activeTab === "emergency" && (
              <EmergencyContacts
                formData={formData}
                handleEmergencyContactChange={handleEmergencyContactChange}
                addEmergencyContact={addEmergencyContact}
                removeEmergencyContact={removeEmergencyContact}
                handleSubmit={handleSubmit}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
