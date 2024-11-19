import React, { useState, useEffect } from "react";
import api, { API } from "../../api.js";
import { Search } from "lucide-react";
import MyAppointments from "./my-appointments/MyAppointments.jsx"; // Import MyAppointments

const NewAppointments = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMyAppointments, setShowMyAppointments] = useState(false); // State to control visibility of MyAppointments
  const [selectedPatientId, setSelectedPatientId] = useState(null); // State to store selected patient ID

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.post(`${API.URL}/api/users/getpatients`);
        setPatients(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleAddAppointment = (patientId) => {
    setSelectedPatientId(patientId); // Set the selected patient ID
    setShowMyAppointments(true); // Show MyAppointments when adding an appointment
  };

  const handleGoBack = () => {
    setShowMyAppointments(false); // Hide MyAppointments and go back to the patient list
    setSelectedPatientId(null); // Reset selected patient ID
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.patient_fname} ${patient.patient_lname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (showMyAppointments) {
    return (
      <MyAppointments 
        patientId={selectedPatientId} // Pass the selected patient ID to MyAppointments
        onGoBack={handleGoBack} // Pass the go back function
      />
    ); // Render MyAppointments if the state is true
  }

  return (
    <div className="p-1">
      <h1 className="text-2xl font-semibold mb-4">Patients List</h1>
      <div className="flex items-center gap-2 w-full md:w-96 mb-4">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredPatients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="flex items-start justify-between border-b pb-2">
              <div>
                <p className="font-medium">
                  {patient.patient_fname} {patient.patient_lname}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleAddAppointment(patient.patient_id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-sm shadow hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Add Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewAppointments;