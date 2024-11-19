import React, { useState } from "react";
import api from "../../../api.js";
import { Alert, AlertTitle } from "../../../utils/Alerts.tsx";
import AddEmployeeForm from "./AddEmployeeForm";
import SubCategoryCard from "./SubCategoryCards";
import UsersCard from "./UserCards";
import UserTable from "./UserTable";
import EditUserForm from "./EditUserForm.jsx";
import { userOptions } from "./constants";

const UserManagement = ({ data }) => {
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEdit = async (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (updatedUser) => {
    setUserData((prevData) =>
      prevData.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${user.name} from the system?`,
      )
    ) {
      try {
        const res = await api.post("/users/portal/management/delete", {
          user_id: localStorage.getItem("userId"),
          user_role: "ADMIN",
          targetUserEmail: user.email,
          managementType: selectedAnalytic,
        });
        fetchUserData(selectedAnalytic, selectedSubCategory);
        // success popup
        setSuccessMessage(`Successfully removed ${user.name} from the system`);
        setShowSuccess(true);
        // remove after 5 sec
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    fetchUserData(selectedAnalytic, subCategoryId);
  };

  const handleUserSelect = (userManageId) => {
    setSelectedAnalytic(userManageId);
    setSelectedSubCategory(null);

    if (userManageId === "ADDEMPLOYEE") {
      setUserData(null);
      return;
    }

    const option = userOptions.find((opt) => opt.id === userManageId);
    if (option?.subCategories) {
      setSelectedSubCategory(option.subCategories[0].id);
      fetchUserData(userManageId, option.subCategories[0].id);
    } else {
      fetchUserData(userManageId, null);
    }
  };

  const fetchUserData = async (type, subCategory) => {
    setIsLoading(true);
    setError(null);
    try {
      // NOTE: ADDEMPLOYEE has their own api request in their own function
      if (type === "ADDEMPLOYEE") {
        setIsLoading(false);
        return;
      }
      const response = await api.post("/users/portal/management", {
        user_id: localStorage.getItem("userId"),
        user_role: "ADMIN",
        sidebarItem: "USER MANAGEMENT",
        managementData: {
          analyticType: type,
          subCategory: subCategory,
        },
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
    }
    setIsLoading(false);
  };

  const getUserType = () => {
    if (selectedAnalytic === "PATIENTSMANAGE") return "PATIENT";
    if (selectedSubCategory === "DOCTORMANAGE") return "DOCTOR";
    if (selectedSubCategory === "NURSEMANAGE") return "NURSE";
    if (selectedSubCategory === "RECEPTIONISTMANAGE") return "RECEPTIONIST";
    return "USER";
  };

  return (
    <div className="space-y-6">
      {editingUser && (
        <EditUserForm
          user={editingUser}
          userType={getUserType()}
          onClose={() => setEditingUser(null)}
          onUpdate={handleUpdateUser}
        />
      )}

      {showSuccess && (
        <Alert className="mb-4">
          <AlertTitle>{successMessage}</AlertTitle>
        </Alert>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <p className="text-gray-600 mb-6">Manage system users and employees</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {userOptions.map((option) => (
            <UsersCard
              key={option.id}
              title={option.title}
              icon={option.icon}
              description={option.description}
              isSelected={selectedAnalytic === option.id}
              onClick={() => handleUserSelect(option.id)}
            />
          ))}
        </div>

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

        {selectedAnalytic === "ADDEMPLOYEE" && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Add New Employee</h3>
            <AddEmployeeForm />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : userData ? (
          <UserTable
            data={userData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : null}
      </div>
    </div>
  );
};
export default UserManagement;
