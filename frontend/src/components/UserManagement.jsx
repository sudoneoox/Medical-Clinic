import React, { useState } from "react";
import { Users, FileUser, Search, Edit, Trash2 } from "lucide-react";
import api from "../api.js";

const AddEmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    role: "",
  });
  const [error, setError] = useState("");

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
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error adding employee");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Employee ID</label>
        <input
          type="number"
          value={employeeData.employeeId}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, employeeId: e.target.value }))
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
  );
};
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

const UserTable = ({ data, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.employeeId && item.employeeId.toString().includes(searchTerm)),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 w-full md:w-96">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0] || {}).map(
                (key) =>
                  key !== "id" && (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ),
              )}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id}>
                {Object.entries(item).map(
                  ([key, value]) =>
                    key !== "id" && (
                      <td key={key} className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                      </td>
                    ),
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserManagement = (data) => {
  const [selectedAnalytic, setSelectedAnalytic] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEdit = async (user) => {
    console.log("editing user:", user);
  };

  // TODO: handle delete api
  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${user.name} from the system?`,
      )
    ) {
      try {
        await api.post("/users/portal/management/delete", {
          user_id: localStorage.getItem("userId"),
          user_role: "ADMIN",
          targetUserId: user.id,
          managementType: selectedAnalytic,
        });
        // Refresh data after deletion
        fetchUserData(selectedAnalytic, selectedSubCategory);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

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
    fetchUserData(selectedAnalytic, subCategoryId);
  };

  const handleUserSelect = (userManageId) => {
    setSelectedAnalytic(userManageId);
    setSelectedSubCategory(null);
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
      // NOTE: ADDEMPLOYEE has there own api request in there own function
      if (type == "ADDEMPLOYEE") {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <p className="text-gray-600 mb-6">Manage system users and employees</p>

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
