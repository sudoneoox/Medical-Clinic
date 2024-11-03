import React, { useState } from "react";
import api, { API } from "../api.js";
import PaymentForm from "./PaymentForm.jsx";

const PatientRecords = ({ data = [] }) => {
  const [currentView, setCurrentView] = useState("PATIENT_LIST");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [billingRecords, setBillingRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPaymentFormVisible, setPaymentFormVisible] = useState(false);
  const [selectedBillingRecord, setSelectedBillingRecord] = useState(null);

  // Fetch billing records
  const fetchBillingRecords = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(
        `${API.URL}/api/users/billing/${patientId}`,
      );
      setBillingRecords(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBills = (patient) => {
    setSelectedPatient(patient);
    fetchBillingRecords(patient.patient_id);
    setCurrentView("BILLING");
  };

  const handlePaymentComplete = async () => {
    await fetchBillingRecords(selectedPatient.patient_id);
    setPaymentFormVisible(false);
  };

  const handlePaymentCancel = () => {
    setPaymentFormVisible(false);
  };

  // Patient List View
  if (currentView === "PATIENT_LIST") {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          data.map((patient, index) => (
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
                  onClick={() => handleViewBills(patient)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-sm shadow hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  View Bills
                </button>
              </div>
            </div>
          ))
        )}
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

    if (isPaymentFormVisible && selectedBillingRecord) {
      return (
        <PaymentForm
          selectedBillingRecord={selectedBillingRecord}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}
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
                      setPaymentFormVisible(true);
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

export default PatientRecords;
