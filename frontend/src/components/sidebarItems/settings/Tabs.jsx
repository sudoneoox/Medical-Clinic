import React from "react";
import { User, KeyRound, UserPlus } from "lucide-react";
import { Card, CardContent } from "../../../utils/Card.tsx";

const Tabs = ({ activeTab, setActiveTab, userRole }) => {
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
  );
};

export default Tabs;
