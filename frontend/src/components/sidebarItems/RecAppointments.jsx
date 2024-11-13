import React, { useState } from "react";
import api, { API } from "../../api.js";
import PaymentForm from "../PaymentForm.jsx";
import { Search } from "lucide-react";

const AppointmentsList = ({ data = [] }) => {
  const [currentView, setCurrentView] = useState("PATIENT_LIST");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [billingRecords, setAppointmentsRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAppointmentsFormVisible, setAppointmentsFormVisible] = useState(false);//no billing change in appointments
  const [selectedBillingRecord, setSelectedBillingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = data.filter(
    (patient) =>
      patient.patient_fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (
        patient.patient_fname.toLowerCase() +
        " " +
        patient.patient_lname.toLowerCase()
      ).includes(searchTerm.toLowerCase()) ||
      (patient.patient_id &&
        patient.patient_id.toString().includes(searchTerm)),
  );
  // Fetch appointments records
  const fetchAppointmentsRecords = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(
        `${API.URL}/api/users/recappointments/${patientId}`,//create a rout in userroutes
      );
      setAppointmentsRecords(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAppointments = (patient) => {
    setSelectedPatient(patient);
    /*fetchBillingRecords*/
    fetchAppointmentsRecords(patient.patient_id);
    setCurrentView("AppointmentSet");
    //setCurrentView("BILLING");
  };

  /*const handlePaymentComplete = async () => {
    await /*fetchBillingRecords*//*fetchAppointmentsRecords(selectedPatient.patient_id);
    setAppointmentsFormVisible(false);
  };

  const handlePaymentCancel = () => {
    setAppointmentsFormVisible(false);
  };*/

  // Patient List View
  if (currentView === "PATIENT_LIST") {
    return (
      <div className="space-y-4"><p className="text-2xl font-bold">Find Patient Appointments</p>
        <div className="flex items-center gap-2 w-full md:w-96">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPatients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          filteredPatients.map((patient, index) => (
            <div
              key={index}
              className="flex items-start justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  {patient.patient_fname} {patient.patient_lname}
                </p>
              </div>
              <div>
                <button
                  onClick={() => /*handleViewBills*/handleViewAppointments(patient)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-sm shadow hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  View Appointments
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
  // AppointmentSet view
  if (currentView === "AppointmentSet"){
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          //<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /> what is the reason for this?
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-600">Error: {error}</div>;
    }
    if (isAppointmentsFormVisible && selectedBillingRecord) {
      return (
        <PaymentForm
          /*selectedBillingRecord={selectedBillingRecord}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}*/
        />
      );
    }
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">
          Upcomming appointments of {selectedPatient?.patient_fname}{" "}
          {selectedPatient?.patient_lname}
        </h2>
        <p>
          You can Add, Delete or Cancel.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Date of Appointment
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Doctor Last Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Reason for the appointment
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Appointment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {billingRecords.map((record, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    record.payment_status === "PAID"
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (record.payment_status !== "PAID") {
                      setSelectedBillingRecord(record);
                      setAppointmentsFormVisible(true);
                    }
                  }}
                >
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(record.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(record.billing_due).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    ${parseFloat(record.amount_due).toFixed(2)}
                  </td>
                  <td
                    className={`py-2 px-4 border-b border-gray-200 font-bold ${
                      record.payment_status === "PAID"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
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
              //setCurrentView("PATIENT_LIST");
              //setSelectedPatient(null);
            }}
          >
            Add an Appointment.
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            onClick={() => {
              setCurrentView("PATIENT_LIST");
              setSelectedPatient(null);
            }}
          >
            Back to Patient Records
          </button>
        </div>
      </div>
    );
  }

  // Billing View
  if (currentView === "BILLING") {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-600">Error: {error}</div>;
    }

    if (isAppointmentsFormVisible && selectedBillingRecord) {
      return (
        <PaymentForm
          /*selectedBillingRecord={selectedBillingRecord}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}*/
        />
      );
    }

    return (
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">
          Billing Records for {selectedPatient?.patient_fname}{" "}
          {selectedPatient?.patient_lname}
        </h2>
        <p>
          To make a payment, select the row of the appointment that has not been
          paid and you wish to pay for at this time.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Date of Appointment
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Payment Due Date
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Amount Due
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {billingRecords.map((record, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    record.payment_status === "PAID"
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (record.payment_status !== "PAID") {
                      setSelectedBillingRecord(record);
                      setAppointmentsFormVisible(true);
                    }
                  }}
                >
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(record.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(record.billing_due).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    ${parseFloat(record.amount_due).toFixed(2)}
                  </td>
                  <td
                    className={`py-2 px-4 border-b border-gray-200 font-bold ${
                      record.payment_status === "PAID"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
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
              setCurrentView("PATIENT_LIST");
              setSelectedPatient(null);
            }}
          >
            Back to Patient Records
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AppointmentsList;
