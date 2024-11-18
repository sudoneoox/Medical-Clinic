import React, { useState, useEffect } from "react";
import api, { API } from "../api.js";
import { Alert, AlertTitle, AlertDescription } from "../utils/Alerts.tsx"; // Adjust the import based on your file structure
import {
  Search,
  Pencil,
  Plus,
  PillBottle,
  Trash2,
  ArrowLeft,
  SquareActivity,
} from "lucide-react";
import MedicalRecordForm from "./MedicalRecordForm.jsx"; // Import the MedicalRecordForm
import PrescriptionForm from "./PrescriptionsForm.jsx"; // Import the PrescriptionForm
import AllergyForm from "./AllergyForm.jsx"; // Import the PrescriptionForm

const PatientList = ({ data = [], userRole }) => {
  const initialView =
    userRole === "Patient" ? "MEDICAL RECORDS" : "PATIENT LIST";
  const patientId = userRole === "Patient" ? data[0].patient_id : null;

  const [currentView, setCurrentView] = useState(initialView);
  const [viewHistory, setViewHistory] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(patientId);
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

  const [allergyRecords, setAllergyRecords] = useState([]);
  const [isAllergyFormOpen, setIsAllergyFormOpen] = useState(false);
  const [currentAllergy, setCurrentAllergy] = useState(null);

  // State for alerts
  const [alert, setAlert] = useState({ visible: false, message: "" });

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

  const fetchAllergyRecords = async (recordId) => {
    setIsLoading(true);
    setError(null);
    console.log(recordId);
    try {
      const response = await api.post(
        `${API.URL}/api/users/getallergyrecords/${recordId}`
      );
      setAllergyRecords(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllergy = (record) => {
    setViewHistory([...viewHistory, currentView]); // Store current view before changing
    fetchAllergyRecords(record.record_id);
    setCurrentView("ALLERGIES");
    setCurrentRecord(record);
  };

  const handleMedicalRecords = (patient) => {
    setViewHistory([...viewHistory, currentView]);
    setSelectedPatient(patient);
    fetchMedicalRecords(patient.patient_id);
    setCurrentView("MEDICAL RECORDS");
  };

  const handleViewPrescriptions = async (record) => {
    setViewHistory([...viewHistory, currentView]);
    setCurrentRecord(record);
    try {
      const response = await api.post(
        `${API.URL}/api/users/prescriptionrecords/${record.record_id}`,
      );
      setPrescriptionRecords(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
    setCurrentView("PRESCRIPTIONS");
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const previousView = viewHistory[viewHistory.length - 1];
      setCurrentView(previousView);
      setViewHistory(viewHistory.slice(0, -1));
    }
  };

  // Functions to open forms
  const openMedicalRecordForm = (record) => {
    setCurrentRecord(record);
    setCurrentView("Medical Form");
    setIsMedicalRecordFormOpen(true);
  };

  const openPrescriptionForm = (prescription) => {
    setCurrentPrescription(prescription);
    setCurrentView("Prescription Form");
    setIsPrescriptionFormOpen(true);
  };

  const openAllergyForm = (allergy) => {
    setCurrentAllergy(allergy);
    setCurrentView("Allergy Form");
    setIsAllergyFormOpen(true);
  };

  const handleDeleteMedicalRecord = async (record) => {
    try {
      console.log("Deleting record", record.record_id);

      const response = await api.post(
        `${API.URL}/api/users/deletemedicalrecord/${record.record_id}`,
      );
      fetchMedicalRecords(selectedPatient.patient_id);
      setAlert({
        visible: true,
        message: "Medical Record deleted successfully!",
      });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 2500);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeletePrescriptions = async (prescription) => {
    setCurrentPrescription(prescription);
    try {
      const response = await api.post(
        `${API.URL}/api/users/deleteprescriptionrecord/${prescription.prescription_id}`,
      );
      handleViewPrescriptions(currentRecord);
      setAlert({
        visible: true,
        message: "Prescription deleted successfully!",
      });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 2500);
      if (response.data.success) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (userRole === "Patient" && patientId) {
      fetchMedicalRecords(patientId);
    }
  }, [userRole, patientId]);

  const handlePrescriptionSave = (isEdit) => {
    setAlert({
      visible: true,
      message: isEdit ? "Prescription updated successfully!" : "Prescription added successfully!",
    });
    setTimeout(() => {
      setAlert({ visible: false, message: "" });
    }, 2500);
    setTimeout(() => {
      window.location.reload();
    }, 3000)
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
    );
  }

  if (userRole === "Patient") {
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
                <h2 className="text-2xl font-bold">Medical Records</h2>
              </div>
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
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{record.diagnosis}</p>
                        <p className="text-sm text-gray-600">
                          Updated Date:{" "}
                          {new Date(record.updated_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-evenly items-center px-3">
                        <button
                          onClick={() => handleViewPrescriptions(record)}
                          className="text-green-500 hover:text-green-600 transition duration-200 ease-in-out ml-2"
                        >
                          <PillBottle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      );
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
                <ArrowLeft
                  onClick={goBack}
                  className="text-black cursor-pointer mr-3"/>
                <h2 className="text-2xl font-bold">Prescriptions</h2>
              </div>
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
                    <div
                      key={prescription.prescription_id}
                      className="border rounded-md p-4 mb-2"
                    >
                      <div className="flex justify-between">
                        <div className="cursor-pointer w-3/4">
                          <h3 className="font-bold">
                            {prescription.medication_name}
                          </h3>
                          <p>Dosage : {prescription.dosage}</p>
                          <p>Duration: {prescription.duration}</p>
                          <p>Frequency: {prescription.frequency}</p>
                        </div>
                      </div>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedPrescription === prescription.prescription_id ? "max-h-40" : "max-h-0"}`}
                      >
                        {expandedPrescription ===
                          prescription.prescription_id && (
                          <div className="mt-2">
                            <h4 className="font-semibold">Pharmacy Details:</h4>
                            <p>
                              Name:{" "}
                              {prescription.pharmacy_details.pharmacy_name}
                            </p>
                            <p>
                              Phone:{" "}
                              {prescription.pharmacy_details.pharmacy_phone}
                            </p>
                            <p>
                              Address:{" "}
                              {prescription.pharmacy_details.pharmacy_address}
                            </p>
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
      );
    }
  } else {
    if (currentView === "MEDICAL RECORDS") {
      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        );
      }
      return (
        <>          {alert.visible && (
          <Alert className="mb-4">
            <AlertTitle className="font-bold text-xl">Success</AlertTitle>
            <AlertDescription className="text-lg">{alert.message}</AlertDescription>
          </Alert>
        )}
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center justify-center">
                <ArrowLeft
                  onClick={goBack}
                  className="text-black cursor-pointer mr-3"
                />
                <h2 className="text-2xl font-bold">
                  Medical Records for {selectedPatient.patient_fname}{" "}
                  {selectedPatient.patient_lname}
                </h2>
              </div>
              <button
                onClick={() =>
                  openMedicalRecordForm(null, selectedPatient.patient_id)
                } // Open form for adding a new record
                className="text-lg font-medium text-black px-3 py-2 rounded-sm hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 flex justify-between items-center"
              >
                <Plus className="inline-block w-4 h-4 mr-1" />
                <p>Medical Record</p>
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
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{ record.diagnosis}</p>
                        <p className="text-sm text-gray-600">
                          Updated Date:{" "}
                          {new Date(record.updated_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-evenly items-center px-3">
                        <button
                          onClick={() => openMedicalRecordForm(record)} // Open form for editing the record
                          className="text-blue-500 hover:text-blue-600 transition duration-200 ease-in-out ml-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleViewPrescriptions(record)}
                          className="text-green-500 hover:text-green-600 transition duration-200 ease-in-out ml-2"
                        >
                          <PillBottle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleViewAllergy(record)}
                          className="text-black hover:text-gray-600 transition duration-200 ease-in-out ml-2"
                        >
                          <SquareActivity className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedicalRecord(record)}
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
      );
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
          {alert.visible && (
            <Alert className="mb-4">
              <AlertTitle className="font-bold text-xl">Success</AlertTitle>
              <AlertDescription className="text-lg">{alert.message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center justify-center">
                <ArrowLeft
                  onClick={goBack}
                  className="text-black cursor-pointer mr-3"
                />
                <h2 className="text-2xl font-bold">Prescriptions</h2>
              </div>
              <button
                onClick={() => openPrescriptionForm(null)} // Open form for adding a new prescription
                className="text-lg font-medium text-black px-3 py-2 rounded-sm hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 flex justify-between items-center"
              >
                <Plus className="inline-block w-4 h-4 mr-1" />
                <p>Prescriptions</p>
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
                    <div
                      key={prescription.prescription_id}
                      className="border rounded-md p-4 mb-2"
                    >
                      <div className="flex justify-between">
                        <div className="cursor-pointer w-3/4">
                          <h3 className="font-bold">
                            {prescription.medication_name}
                          </h3>
                          <p>Dosage : {prescription.dosage}</p>
                          <p>Duration: {prescription.duration}</p>
                          <p>Frequency: {prescription.frequency}</p>
                        </div>
                        <div className="flex justify-evenly items-center px-3">
                          <button
                            onClick={() => openPrescriptionForm(prescription)} // Open form for editing the prescription
                            className="text-blue-500 hover:text-blue-600 transition duration-200 ease-in-out ml-2"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePrescriptions(prescription)
                            }
                            className="text-red-500 hover:text-red-600 transition duration-200 ease-in-out ml-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedPrescription === prescription.prescription_id ? "max-h-40" : "max-h-0"}`}
                      >
                        {expandedPrescription ===
                          prescription.prescription_id && (
                          <div className="mt-2">
                            <h4 className="font-semibold">Pharmacy Details:</h4>
                            <p>
                              Name: {prescription.pharmacy_details.pharmacy_name}
                            </p>
                            <p>
                              Phone:{" "}
                              {prescription.pharmacy_details.pharmacy_phone}
                            </p>
                            <p>
                              Address:{" "}
                              {prescription.pharmacy_details.pharmacy_address}
                            </p>
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
      );
    }
    if (currentView === "ALLERGIES") {
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
                <h2 className="text-2xl font-bold">Allergies</h2>
              </div>
              <button
                onClick={() => {
                  openAllergyForm(null);
                }} // Open form for adding a new allergy
                className="text-lg font-medium text-black px-3 py-2 rounded-sm hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 flex justify-between items-center"
              >
                <Plus className="inline-block w-4 h-4 mr-1" />
                <p>Add Allergy</p>
              </button>
            </div>
    
            {error ? (
              <p>Error fetching allergies: {error}</p>
            ) : (
              <div>
                {allergyRecords.length === 0 ? (
                  <p>No allergies found for this patient.</p>
                ) : (
                  allergyRecords.map((allergy, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{allergy.allergen}</p>
                        <p className="text-sm text-gray-600">
                          Reaction: {allergy.reaction}
                        </p>
                      </div>
                      <div className="flex justify-evenly items-center px-3">
                        <button
                          onClick={() => {
                            openAllergyForm(allergy)
                          }} // Open form for editing the allergy
                          className="text-blue-500 hover:text-blue-600 transition duration-200 ease-in-out ml-2"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      );
    }
    if (currentView === "Medical Form" && isMedicalRecordFormOpen) {
      return (
        <MedicalRecordForm
          record={currentRecord}
          patientId={selectedPatient.patient_id}
          onClose={() => {
            setIsMedicalRecordFormOpen(false);
            setCurrentView("MEDICAL RECORDS");
          }}
          onSave={() => {
            fetchMedicalRecords(selectedPatient.patient_id);
            // setCurrentRecord(null);
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
          recordId={currentRecord.record_id}
          onClose={() => {
            setIsPrescriptionFormOpen(false);
            setCurrentView("PRESCRIPTIONS");
          }}
          onSave={() => {
            handleViewPrescriptions(currentRecord);
            setCurrentPrescription(null);
            setIsPrescriptionFormOpen(false);
            setCurrentView("PRESCRIPTIONS");
            handlePrescriptionSave(!!currentPrescription); // Pass true if editing, false if adding
          }}
        />
      );
    }
    if (currentView === "Allergy Form" && isAllergyFormOpen) {
      console.log("Opening", currentRecord);
      
      return (
        <AllergyForm
          allergy={currentAllergy}
          recordId={currentRecord.record_id}
          onClose={() => {
            setIsAllergyFormOpen(false);
            setCurrentView("ALLERGIES");
          }}
          onSave={() => {
            fetchAllergyRecords(currentRecord.record_id);
            setCurrentAllergy(null);
            setIsAllergyFormOpen(false);
            setCurrentView("ALLERGIES");
          }}
        />
      );
    }
  }

  return null;
};

export default PatientList;