import React, { useState, useEffect } from "react";
import Overview from "./OverviewCards.jsx";
import Calendar from "./sidebarItems/Calendar.jsx";
import Patients from "./PatientsCards.jsx";
import PatientRecords from "./sidebarItems/PatientsRecords.jsx";
import Appointments from "./sidebarItems/my-appointments/Appointments.jsx";
import Analytics from "./sidebarItems/analytics/Analytics.jsx";
import UserManagement from "./sidebarItems/UserManagement.jsx";
import Settings from "./sidebarItems/UserSettings.jsx";
import { cn } from "../utils/utils.js";
import { Bell, UserRound } from "lucide-react";
import api, { API } from "../api.js";

// Header component to display user details and quick actions
const Header = ({ userFullName, userRole }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome {userFullName},
        </h1>
        <p className="text-2xl ml-2 text-gray-500 font-bold">
          How're you feeling today?
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Bell className="rounded-full" />
        </button>
        <div className="flex items-center">
          <UserRound className="h-8 w-8 mr-3 rounded-full" />
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {userFullName}
            </p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// sidebar component for navigation links and other information
const Sidebar = ({ items, currentSelected, onItemSelect }) => {
  return (
    <div className="h-screen w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5  border-b border-gray-200">
        <img src="images/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {items.map((item, index) => {
            const isActive = currentSelected === item.label.toUpperCase();

            return (
              <li key={index}>
                {item.section === "account" && (
                  <div className="my-4 border-t border-gray-200" />
                )}
                <button
                  onClick={() => onItemSelect(item)}
                  className={cn(
                    "w-full flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200",
                    "hover:bg-gray-100",
                    isActive &&
                      "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600",
                    !isActive && "text-gray-700",
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(
                        "mr-3",
                        isActive ? "text-blue-600" : "text-gray-400",
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-red-800">
            Emergency Hotline: 911
          </p>
        </div>
      </div>
    </div>
  );
};

// MainFrame component that wraps the entire layout
// NOTE: the mainframe should not handle a sidebarItems Logic nor the UI for it
// its just being used to fetch an api request and then to send the data it got from that api request to the component
// so that its filled with something ones its rendered and to switch around what UI is showing depending on what sidebaritem is clicked
// IMPORTANT: DO NOT DO sidebarItem UI or LOGIC here handle it in its own file
// for code readability and consitency
const MainFrame = ({
  userFullName,
  userRole,
  sidebarItems,
  userId,
  patientId,
}) => {
  const [currentSelected, setCurrentSelected] = useState("OVERVIEW");
  const [contentData, setContentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data based on selected item
  const fetchData = async (path) => {
    try {
      setIsLoading(true);
      setError(null);
      const user_id = localStorage.getItem("userId");
      const user_role = localStorage.getItem("userRole");
      const API_PATH = API.URL + "/api/users" + path;
      console.log("API_PATH inside fetchdata inside mainframe", API_PATH);
      const sidebarItem = path.split("/").pop().toUpperCase();
      const response = await api.post(API_PATH, {
        user_id,
        user_role,
        sidebarItem,
      });

      setContentData(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle sidebar item selection
  const handleItemSelect = (item) => {
    if (item.label === "Logout") {
      // Handle logout separately
      // Clear JWT token and redirect to login
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
    setCurrentSelected(item.label.toUpperCase());
    console.log("CURRENTLY SELECTED", currentSelected);
    // NOTE: ignores api requests for these components they handle themselves
    if (
      item.label === "Analytics" ||
      item.label === "User Management" ||
      item.label === "My Appointments" ||
      item.label === "Settings" ||
      item.label === "Appointments"
    ) {
      return;
    }
    fetchData(item.path);
  };

  // Initial data fetch
  useEffect(() => {
    const defaultItem = sidebarItems.find(
      (item) => item.label.toUpperCase() === currentSelected,
    );

    if (defaultItem) {
      fetchData(defaultItem.path);
    }
  }, []);

  // WARNING: remove during deployment
  // set to true if you want to see the UI of your sidebarItem but havent set up a backend api
  // so its stuck at loading
  const TEST = false;
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        items={sidebarItems}
        currentSelected={currentSelected}
        onItemSelect={handleItemSelect}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userFullName={userFullName} userRole={userRole} />

        <main className="flex-1 overflow-y-auto p-6">
          {!TEST && isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : !TEST && error ? (
            <div className="text-center text-red-600">Error: {error}</div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Render the appropriate component based on contentData */}
              {contentData && (
                <div className="bg-white rounded-lg shadow p-6">
                  {/*IMPORTANT: add specific component rendering logic here based on currentSelected */}
                  {currentSelected === "OVERVIEW" && (
                    <Overview data={contentData} />
                  )}
                  {currentSelected === "CALENDAR" && (
                    <Calendar data={contentData} />
                  )}

                  {currentSelected === "PATIENTS" && (
                    <Patients data={contentData.patients} />
                  )}

                  {currentSelected === "PATIENT RECORDS" && (
                    <PatientRecords data={contentData.patients} />
                  )}

                  {currentSelected === "MY APPOINTMENTS" && <Appointments />}
                  {currentSelected === "APPOINTMENTS" && <Appointments />}
                  {currentSelected === "ANALYTICS" && <Analytics />}
                  {currentSelected === "USER MANAGEMENT" && (
                    <UserManagement data={contentData} />
                  )}
                  {currentSelected === "SETTINGS" && (
                    <Settings data={contentData} />
                  )}

                  {/*NOTE: Add other component conditions here*/}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default MainFrame;
