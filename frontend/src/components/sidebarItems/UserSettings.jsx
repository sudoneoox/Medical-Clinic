import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../utils/Card.tsx";
import { Label } from "../../utils/Label.tsx";
import { Input } from "../../utils/Input.tsx";
import { Button } from "../../utils/Button.tsx";
import { Alert, AlertDescription } from "../../utils/Alerts.tsx";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  KeyRound,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react";
import { Switch } from "../../utils/Switch.tsx";
import api, { API } from "../../api.js";

const Settings = ({ data }) => {
  const userRole = localStorage.getItem("userRole");
  const [activeTab, setActiveTab] = useState("account");
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    account: {
      email: "",
      phone: "",
      username: "",
    },
    password: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    // TODO: implement later
    emergency: {
      contacts: [],
    },
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

  const handleSubmit = async (section) => {
    try {
      const response = await api.post(API.URL + "/api/users/portal/settings", {
        section,
        data: formData[section],
        user_id: localStorage.getItem("userId"),
        user_role: userRole,
      });

      const result = response.data;

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Settings updated successfully",
        });

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

  const tabs = [
    {
      id: "account",
      label: "Account Settings",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "password",
      label: "Change Password",
      icon: <KeyRound className="w-4 h-4" />,
    },
    // only patient role can change emergency contacts
    ...(userRole === "PATIENT"
      ? [
          {
            id: "emergency",
            label: "Emergency Contacts",
            icon: <UserPlus className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-6">
        <Card className="w-64 h-fit">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeTab === "account" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.account.username}
                    onChange={(e) =>
                      handleInputChange("account", "username", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.account.email}
                    onChange={(e) =>
                      handleInputChange("account", "email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </div>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.account.phone}
                    onChange={(e) =>
                      handleInputChange("account", "phone", e.target.value)
                    }
                  />
                </div>
                <Button onClick={() => handleSubmit("account")}>
                  Save Changes
                </Button>
              </>
            )}

            {activeTab === "password" && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.password.currentPassword}
                      onChange={(e) =>
                        handleInputChange(
                          "password",
                          "currentPassword",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.password.newPassword}
                      onChange={(e) =>
                        handleInputChange(
                          "password",
                          "newPassword",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.password.confirmPassword}
                      onChange={(e) =>
                        handleInputChange(
                          "password",
                          "confirmPassword",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <Button onClick={() => handleSubmit("password")}>
                  Update Password
                </Button>
              </>
            )}

            {activeTab === "emergency" && (
              <>
                <div className="space-y-4">
                  {formData.emergency.contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">
                            Emergency Contact #{index + 1}
                          </h3>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeEmergencyContact(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) =>
                                handleEmergencyContactChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Relationship</Label>
                            <Input
                              value={contact.relationship}
                              onChange={(e) =>
                                handleEmergencyContactChange(
                                  index,
                                  "relationship",
                                  e.target.value,
                                )
                              }
                              placeholder="Spouse, Parent, etc."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                              value={contact.phone}
                              onChange={(e) =>
                                handleEmergencyContactChange(
                                  index,
                                  "phone",
                                  e.target.value,
                                )
                              }
                              placeholder="123-456-7890"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={addEmergencyContact}
                  >
                    Add Emergency Contact
                  </Button>
                </div>
                <Button onClick={() => handleSubmit("emergency")}>
                  Save Emergency Contacts
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
