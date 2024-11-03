import React, { useState, useEffect } from 'react';
import api, { API } from "../api.js";
import PaymentForm from "./PaymentForm.jsx";

const BillingRecordsTable = ({ records, onRecordClick }) => (
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
        {records.map((record, index) => (
          <tr
            key={index}
            className={`hover:bg-gray-50 ${
              record.payment_status === "PAID" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => {
              if (record.payment_status !== "PAID") {
                onRecordClick(record);
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
            <td className={`py-2 px-4 border-b border-gray-200 font-bold ${
              record.payment_status === "PAID" ? 'text-green-600' : 'text-red-600'
            }`}>
              {record.payment_status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Billing = () => {
  // Local state
  const [billingRecords, setBillingRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPaymentFormVisible, setPaymentFormVisible] = useState(false);
  const [selectedBillingRecord, setSelectedBillingRecord] = useState(null);
  const [view, setView] = useState('PATIENT_RECORDS'); // ['PATIENT_RECORDS', 'BILLING_RECORDS']

  // Fetch all patients for the initial view
  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`${API.URL}/api/users/patients`, {
        user_id: localStorage.getItem('userId'),
        user_role: localStorage.getItem('userRole'),
        sidebarItem: 'PATIENT_RECORDS'
      });
      return response.data.patients;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch billing records for a specific patient
  const fetchBillingRecords = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`${API.URL}/api/users/billing/${patientId}`, {
        user_id: localStorage.getItem('userId'),
        user_role: localStorage.getItem('userRole')
      });
      setBillingRecords(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBills = async (patient) => {
    setSelectedPatient(patient);
    await fetchBillingRecords(patient.patient_id);
    setView('BILLING_RECORDS');
  };

  const handlePaymentComplete = async () => {
    await fetchBillingRecords(selectedPatient.patient_id);
    setPaymentFormVisible(false);
  };

  const handleBackToPatientRecords = () => {
    setView('PATIENT_RECORDS');
    setSelectedPatient(null);
    setBillingRecords([]);
  };

  const handleRecordClick = (record) => {
    setSelectedBillingRecord(record);
    setPaymentFormVisible(true);
  };

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
        onCancel={() => setPaymentFormVisible(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {view === 'PATIENT_RECORDS' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
          <Bills
            fetchPatients={fetchPatients}
            onViewBills={handleViewBills}
          />
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold">
            Billing Records for {selectedPatient?.patient_fname} {selectedPatient?.patient_lname}
          </h2>
          <p className="mt-2 mb-4">
            To make a payment, select the row of the appointment that has not been paid and you wish to pay for at this time.
          </p>
          
          <BillingRecordsTable 
            records={billingRecords}
            onRecordClick={handleRecordClick}
          />

          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
              onClick={handleBackToPatientRecords}
            >
              Back to Patient Records
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
