import React from "react";

const PatientList = ({ data  = []}) => { // Set default value to an empty array
    console.log(data);
    
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
              {/* You can add more patient details here if needed */}
            </div>
            <div className="text-sm">
              {/* Add any additional actions or information here */}
              <p>Patient ID: {patient.patient_id}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PatientList;