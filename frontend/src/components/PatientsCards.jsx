import React, { useState } from "react";
import api, { API } from "../api.js";

import {
  Search,
  Pencil,
  Plus,
  PillBottle,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import MedicalRecordForm from './MedicalRecordForm.jsx'; // Import the MedicalRecordForm
import PrescriptionForm from './PrescriptionsForm.jsx'; // Import the PrescriptionForm


const PatientList = ({ data = [] }) => {
  const [currentView, setCurrentView] = useState("PATIENT LIST");
  const [viewHistory, setViewHistory] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptionRecords, setPrescriptionRecords] = useState([]);
  const [expandedPrescription, setExpandedPrescription] = useState(null);
  
  // State for forms
  const [isMedicalRecordFormOpen, setIsMedicalRecordFormOpen] = useState(false);
  const [isPrescriptionFormOpen, setIsPrescriptionFormOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  console.log(data);

  const fetchMedicalRecords = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(
        `${API.URL}/api/users/medicalrecords/${patientId}`,
      );
      console.log(response.data);
      
      setMedicalRecords(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicalRecords = (patient) => {
    setViewHistory([...viewHistory, currentView]);
    setSelectedPatient(patient);
    fetchMedicalRecords(patient.patient_id);
    setCurrentView("MEDICAL RECORDS");
  };


  const handleViewPrescriptions = async (record_id) => {
    setCurrentView("PRESCRIPTIONS");
    setViewHistory([...viewHistory, currentView]);
    try {
      const response = await api.post(`${API.URL}/api/users/prescriptionrecords/${record_id}`);
      setPrescriptionRecords(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const previousView = viewHistory[viewHistory.length - 1];
      setCurrentView(previousView);
      setViewHistory(viewHistory.slice(0, -1));
    }
  };

  const togglePrescriptionDetails = (prescriptionId) => {
    setExpandedPrescription(
      expandedPrescription === prescriptionId ? null : prescriptionId,
    );
  };

  // Functions to open forms
  const openMedicalRecordForm = (record ) => {
    setCurrentRecord(record);
    setCurrentView("Medical Form");
    setIsMedicalRecordFormOpen(true);
  };

  const openPrescriptionForm = (prescription) => {
    setCurrentPrescription(prescription);
    setCurrentView("Prescription Form");
    setIsPrescriptionFormOpen(true);
  };

  const handleDeletePrescriptions = (prescription) => {
    setCurrentPrescription(prescription);
    // setIsPrescriptionFormOpen(true);
  };

  if (currentView === "PATIENT LIST") {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      );
    }
     return (
      <>
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
      </>
     )
    
  } 

  if (currentView === "MEDICAL RECORDS") {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      );
    }
     return (
      <>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center justify-center">
              <ArrowLeft onClick={goBack} className="text-black cursor-pointer mr-3" />
              <h2 className="text-2xl font-bold">Medical Records for {selectedPatient.patient_fname} {selectedPatient.patient_lname}</h2>
            </div>
            <button
              onClick={() => openMedicalRecordForm(null, selectedPatient.patient_id)} // Open form for adding a new record
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
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{record.diagnosis}</p>
                      <p className="text-sm text-gray-600">Updated Date: {new Date(record.updated_at).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-evenly items-center px-3">
                      <button
                        onClick={() => openMedicalRecordForm(record)} // Open form for editing the record
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
                        onClick={() => handleDeletePrescriptions(record.record_id)}
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
      </>
     )
    
  } 
  if (currentView === "PRESCRIPTIONS") {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      );
    }
     return (
      <>
                <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center justify-center">
              <ArrowLeft onClick={goBack} className="text-black cursor-pointer mr-3" />
              <h2 className="text-2xl font-bold">Prescriptions</h2>
            </div>
            <button
              onClick={() => openPrescriptionForm(null)} // Open form for adding a new prescription
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
                    <div className="flex justify-between">
                      <div onClick={() => togglePrescriptionDetails(prescription.prescription_id)} className="cursor-pointer w-3/4">
                        <h3 className="font-bold">{prescription.medication_name}</h3>
                        <p>Dosage : {prescription.dosage}</p>
                        <p>Duration: {prescription.duration}</p>

                      </div>
                      <div className="flex justify-evenly items-center px-3">
                        <button
                          onClick={() => openPrescriptionForm(prescription)} // Open form for editing the prescription
                          className="text-blue-500 hover:text-blue-600 transition duration-200 ease-in-out ml-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePrescriptions(prescription.prescription_id)}
                          className="text-red-500 hover:text-red-600 transition duration-200 ease-in-out ml-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
      </>
     )
    
  } 
  if (currentView === "Medical Form" && isMedicalRecordFormOpen) {
    return (
      <MedicalRecordForm
        record={currentRecord}
        patientId = {selectedPatient.patient_id}
        onClose={() => {
          setIsMedicalRecordFormOpen(false);
          setCurrentView("MEDICAL RECORDS");
        }}
        onSave={() => {
          // Logic to refresh medical records after saving
          fetchMedicalRecords(selectedPatient.patient_id);
          setCurrentRecord(null);
          setIsMedicalRecordFormOpen(false);
          setCurrentView("MEDICAL RECORDS");
        }}
      />
    );
  }
  if (currentView === "Prescription Form" && isPrescriptionFormOpen) {
    return (
      <PrescriptionForm
        prescription={currentPrescription}
        onClose={() => {
          setIsPrescriptionFormOpen(false);
          setCurrentView("PRESCRIPTIONS");
        }}
        onSave={() => {
          // Logic to refresh prescription records after saving
          setCurrentPrescription(null);
          setIsPrescriptionFormOpen(false);
          setCurrentView("PRESCRIPTIONS");
      }}
    />
    );
  }

  return null;
};

export default PatientList;

