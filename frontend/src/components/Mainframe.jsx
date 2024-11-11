import React, { useState, useEffect } from "react";

// sidebar items
import Overview from "./sidebarItems/overview/Overview.jsx";
import Calendar from "./sidebarItems/calendar/Calendar.jsx";
import Patients from "./PatientsCards.jsx";
import PatientRecords from "./sidebarItems/PatientsRecords.jsx";
import MyAppointments from "./sidebarItems/my-appointments/MyAppointments.jsx";
import Analytics from "./sidebarItems/analytics/Analytics.jsx";
import UserManagement from "./sidebarItems/user-management/UserManagement.jsx";
import Settings from "./sidebarItems/settings/Settings.jsx";
import Sidebar from "./UI/MainframeSidebar.jsx";
import Header from "./UI/MainframeHeader.jsx";
import PatientCare from "./sidebarItems/patient-care/PatientCare.jsx";

import api, { API } from "../api.js";

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
      item.label === "Appointments" ||
      item.label === "Patient Care"
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

  // TODO: make sure set to false during deployment
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

                  {currentSelected === "MY APPOINTMENTS" && <MyAppointments />}
                  {/* BUG: Receptionist Appointments being implemented by danil */}
                  {/* {currentSelected === "APPOINTMENTS" && <Appointments />} */}
                  {currentSelected === "ANALYTICS" && <Analytics />}
                  {currentSelected === "USER MANAGEMENT" && (
                    <UserManagement data={contentData} />
                  )}
                  {currentSelected === "SETTINGS" && (
                    <Settings data={contentData} />
                  )}

                  {currentSelected === "PATIENT CARE" && <PatientCare />}
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
