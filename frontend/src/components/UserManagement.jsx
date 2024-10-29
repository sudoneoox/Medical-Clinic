import React, { useState } from "react";
import { Users, FileUser } from "lucide-react";
import api from "../api.js";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const SubCategoryCard = ({ title, icon, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-2 rounded-lg border transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-blue-300"
    }`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
  </div>
);

const UsersCards = ({ title, icon, isSelected, onClick, description }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 rounded-lg border transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-blue-300"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

const UserManagement = (data) => {
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const userOptions = [
    {
      id: "EMPLOYEEMANAGE",
      title: "Employee's",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      description: "View Employees enrolled into the system",
      subCategories: [
        {
          id: "RECEPTIONISTMANAGE",
          title: "Receptionist",
          icon: <FileUser className="w-4 h-4" />,
        },
        {
          id: "DOCTORMANAGE",
          title: "Doctors",
          icon: <FileUser className="w-4 h-4" />,
        },
        {
          id: "NURSEMANAGE",
          title: "Nurses",
          icon: <FileUser className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "PATIENTSMANAGE",
      title: "Patients",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      description: "View patients enrolled into the system",
      subCategories: [],
    },
    {
      id: "ADDEMPLOYEE",
      title: "New Employee",
      icon: <Users className="w-6 h-6 text-orange-500" />,
      description: "Add a new employee into the system",
    },
  ];
  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    fetchAnalyticData(selectedAnalytic, subCategoryId);
  };

  const handleUserSelect = (userManageId) => {
    setSelectedAnalytic(userManageId);
    setSelectedSubCategory(null);
    const option = userOptions.find((opt) => opt.id === userManageId);
    if (option?.subCategories) {
      setSelectedSubCategory(option.subCategories[0].id);
      fetchAnalyticData(userManageId, option.subCategories[0].id);
    } else {
      fetchAnalyticData(userManageId, null);
    }
  };

  const fetchAnalyticData = async (type, subCategory, office) => {
    try {
      const response = await api.post("/users/portal/management", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        sidebarItem: "ANALYTICS",
        managementData: {
          analyticType: type,
          subCategory: subCategory,
        },
      });
    } catch (error) {
      console.error("Error fetching analytic data:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Select a category to view detailed analytics
        </p>
        {/* Analytics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {userOptions.map((option) => (
            <UsersCards
              key={option.id}
              title={option.title}
              icon={option.icon}
              description={option.description}
              isSelected={selectedAnalytic === option.id}
              onClick={() => handleUserSelect(option.id)}
            />
          ))}
        </div>
        {/* Sub-categories for Demographics */}
        {selectedAnalytic === "EMPLOYEEMANAGE" && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {userOptions
              .find((opt) => opt.id === "EMPLOYEEMANAGE")
              .subCategories.map((subCat) => (
                <SubCategoryCard
                  key={subCat.id}
                  title={subCat.title}
                  icon={subCat.icon}
                  isSelected={selectedSubCategory === subCat.id}
                  onClick={() => handleSubCategorySelect(subCat.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
