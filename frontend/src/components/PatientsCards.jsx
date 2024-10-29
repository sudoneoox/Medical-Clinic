import React from "react";

const PatientList = ({ data = [] }) => { // Set default value to an empty array
  console.log(data);
  
  const handleViewMedicalRecords = (patientId) => {
    // Add your logic to view medical records here
    console.log(`Viewing medical records for patient ID: ${patientId}`);
  };

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
                onClick={() => handleViewMedicalRecords(patient.medicalRecords[0].diagnosis)} 
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
};

export default PatientList;