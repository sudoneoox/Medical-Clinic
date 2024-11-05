import React, { useState } from "react";
import api, { API } from "../api.js";
import { 
  Search,
  Pencil,
  Plus,
  PillBottle,
  Trash2,
 } from "lucide-react";

const PatientList = ({ data = [] }) => {
  const [currentView, setCurrentView] = useState("PATIENT LIST");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptionRecords, setPrescriptionRecords] = useState([]);
  const [expandedPrescription, setExpandedPrescription] = useState(null);
  
  const fetchMedicalRecords = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(
        `${API.URL}/api/users/medicalrecords/${patientId}`,
      );
      setMedicalRecords(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicalRecords = (patient) => {
    setSelectedPatient(patient);
    fetchMedicalRecords(patient.patient_id);
    setCurrentView("MEDICAL RECORDS");
  };

  const handleEditMedicalRecord = async (recordId) => {

  }

  const handleAddMedicalRecord = async (recordId) => {
    
  }

  const handleViewPrescriptions = async (record_id) => {
    setCurrentView("PRESCRIPTIONS");
    try {
      const response = await api.post(
        `${API.URL}/api/users/prescriptionrecords/${record_id}`,
      );
      setPrescriptionRecords(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePrescriptionDetails = (prescriptionId) => {
    setExpandedPrescription(expandedPrescription === prescriptionId ? null : prescriptionId);
  };

  if (currentView === "PATIENT LIST") {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          data.map((patient, index) => (
            <div key={index} className="flex items-start justify-between border-b pb-2">
              <div>
                <p className="font-medium">
                  {patient.patient_fname} {patient.patient_lname}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleMedicalRecords(patient)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-sm shadow hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  View Records
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  if (currentView === "MEDICAL RECORDS") {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Medical Records for {selectedPatient.patient_fname} {selectedPatient.patient_lname}</h2>
          <button
            onClick={handleAddMedicalRecord}
            className="text-lg font-medium text-black px-3 py-2 rounded-sm hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 flex justify-between items-center"
          >
            <Plus className="inline-block w-4 h-4 mr-1" /><p>Medical Record</p>
          </button>
        </div>
        
        {isLoading ? (
          <p>Loading medical records...</p>
        ) : error ? (
          <p>Error fetching medical records: {error}</p>
        ) : (
          <div>
            {medicalRecords.length === 0 ? (
              <p>No medical records found for this patient.</p>
            ) : (
              medicalRecords.map((record, index) => (
                <div key ={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{record.diagnosis}</p>
                    <p className="text-sm text-gray-600">Updated Date: {new Date(record.updated_at).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-evenly items-center px-3">
                    <button
                      onClick={() => handleEditMedicalRecord(record.record_id)}
                      className="text-blue-500 hover:text-blue-600 transition duration-200 ease-in-out ml-2"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleViewPrescriptions(record.record_id)}
                      className="text-green-500 hover:text-green-600 transition duration-200 ease-in-out ml-2"
                    >
                      <PillBottle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleViewPrescriptions(record.record_id)}
                      className="text-red-500 hover:text-red-600 transition duration-200 ease-in-out ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  if (currentView === "PRESCRIPTIONS") {
    return (
      <div className="space-y-4">
          <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Prescriptions</h2>
          <button
            onClick={handleAddMedicalRecord}
            className="text-lg font-medium text-black px-3 py-2 rounded-sm hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 flex justify-between items-center"
          >
            <Plus className="inline-block w-4 h-4 mr-1" /><p>Prescriptions</p>
          </button>
        </div>
        {isLoading ? (
          <p>Loading prescriptions...</p>
        ) : error ? (
          <p>Error fetching prescriptions: {error}</p>
        ) : (
          <div>
            {prescriptionRecords.length === 0 ? (
              <p>No prescriptions found for this patient.</p>
            ) : (
              prescriptionRecords.map((prescription) => (
                <div key={prescription.prescription_id} className="border rounded-md p-4 mb-2">
                  <div onClick={() => togglePrescriptionDetails(prescription.prescription_id)} className="cursor-pointer">
                    <h3 className="font-bold">{prescription.medication_name}</h3>
                    <p>Dosage: {prescription.dosage}</p>
                    <p>Duration: {prescription.duration}</p>
                  </div>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedPrescription === prescription.prescription_id ? 'max-h-40' : 'max-h-0'}`}>
                    {expandedPrescription === prescription.prescription_id && (
                      <div className="mt-2">
                        <h4 className="font-semibold">Pharmacy Details:</h4>
                        <p>Name: {prescription.pharmacy_details.pharmacy_name}</p>
                        <p>Phone: {prescription.pharmacy_details.pharmacy_phone}</p>
                        <p>Address: {prescription.pharmacy_details.pharmacy_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }
};

export default PatientList;