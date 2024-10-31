import React, { useState, useEffect } from "react";
import { Bell, UserRound } from "lucide-react";
import api, { API } from "../api.js";
import Overview from "./OverviewCards.jsx";
import Calendar from "./Calendar.jsx";
import Patients from "./PatientsCards.jsx";
import Bills from "./PatientsBills.jsx";
import Appointments from "./Appointments.jsx";
import Analytics from "./Analytics.jsx";
import UserManagement from "./UserManagement.jsx";
import { cn } from "../utils/utils.js";

// Header component to display user details and quick actions
const Header = ({ userFullName, userRole }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {/* TODO: change username to user First name and Last name */}
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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [billingRecords, setBillingRecords] = useState([]);

  // Function to fetch data based on selected item
  const fetchData = async (path) => {
    try {
      setIsLoading(true);
      setError(null);
      const user_id = localStorage.getItem("userId");
      const user_role = localStorage.getItem("userRole");
      const API_PATH = API.URL + "/api/users" + path;
      // console.log("API_PATH inside fetchdata inside mainframe", API_PATH);
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
      item.label === "MY APPOINTMENTS"
    ) {
      return;
    }
    fetchData(item.path);
  };

  const handleViewBills = (patient) => {
    setSelectedPatient(patient);
    fetchBillingRecords(patient.patient_id);
    setCurrentSelected("BILLING");
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

  // Fetch billing records
  const fetchBillingRecords = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`${API.URL}/api/users/billing/${patientId}`);
      console.log(response.data);
      setBillingRecords(response.data);
      console.log(billingRecords);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // WARNING: remove during deployment
  // set to true if you want to see the UI of your sidebarItem but havent set up a backend api
  // so its stuck at loading
  const TEST = true;

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
                  {/*add specific component rendering logic here based on currentSelected */}
                  {currentSelected === "OVERVIEW" && (
                    <Overview data={contentData} />
                  )}
                  {currentSelected === "CALENDAR" && (
                    <Calendar data={contentData} />
                  )}

                  {currentSelected === "PATIENTS" && (
                    // <Patients data={contentData} />
                    <Patients data={contentData.patients} />
                  )}
                  {currentSelected === "PATIENT RECORDS" && (
                    <Bills data={contentData.patients} onViewBills={handleViewBills} />
                  )}

                  {currentSelected === "BILLING" && (
                    <div className="space-y-5">
                      <h2 className="text-xl font-semibold">
                        Billing Records for {selectedPatient.patient_fname} {selectedPatient.patient_lname}
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-2 px-4 border-b border-gray-200 text-left">Date of Appointment</th>
                              <th className="py-2 px-4 border-b border-gray-200 text-left">Payment Due Date</th>
                              <th className="py-2 px-4 border-b border-gray-200 text-left">Amount Due</th>
                              <th className="py-2 px-4 border-b border-gray-200 text-left">Payment Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billingRecords.map((record, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b border-gray-200">
                                  {new Date(record.created_at).toLocaleDateString()} {/* Date of Appointment */}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                  {new Date(record.billing_due).toLocaleDateString()} {/* Payment Due Date */}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                  ${parseFloat(record.amount_due).toFixed(2)} {/* Amount Due */}
                                </td>
                                <td className={`py-2 px-4 border-b border-gray-200 font-bold ${record.payment_status === "PAID" ? 'text-green-600' : 'text-red-600'}`}>
                                  {record.payment_status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end space-x-4">

                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        onClick={() => {
                          setCurrentSelected("PATIENT RECORDS");
                          setSelectedPatient(null); // Clear the selected patient
                        }}
                      >
                        Back to Patient Records
                      </button>
                      <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-opacity-50"
                        >
                          Make a Payment
                        </button>
                        </div>
                    </div>
                  )}

                  {currentSelected === "MY APPOINTMENTS" && <Appointments />}
                  {currentSelected === "ANALYTICS" && <Analytics />}
                  {currentSelected === "USER MANAGEMENT" && (
                    <UserManagement data={contentData} />
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
