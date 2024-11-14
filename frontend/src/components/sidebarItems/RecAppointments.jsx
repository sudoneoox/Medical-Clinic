import React, { useState } from "react";
import api, { API } from "../../api.js";
import { Search } from "lucide-react";

const AppointmentsList = ({ data = [] }) => {
  const [currentView, setCurrentView] = useState("PATIENT_LIST");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentRecords, setAppointmentsRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAppointmentsFormVisible, setAppointmentsFormVisible] =
    useState(false);
  console.log(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false); // For delete confirmation modal
  const [recordToDelete, setRecordToDelete] = useState(null); // Track which record to delete
  const filteredPatients = data.filter(
    (patient) =>
      patient.patient.patient_fname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.patient.patient_lname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (
        patient.patient.patient_fname.toLowerCase() +
        " " +
        patient.patient.patient_lname.toLowerCase()
      ).includes(searchTerm.toLowerCase()) ||
      (patient.patient.patient_id &&
        patient.patient.patient_id.toString().includes(searchTerm)),
  );

  // Fetch appointments records
  const fetchAppointmentsRecords = async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(
        API.URL + "/api/users/portal/recappointments/forpatient",
        {
          patient_id: patientId,
          user_id: localStorage.getItem("userId"),
        },
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
    fetchAppointmentsRecords(patient.patient_id);
    setCurrentView("AppointmentSet");
  };

  // Handle delete button click to show modal
  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowConfirmModal(true);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    console.log("Record to delete:", recordToDelete);
    // Add delete logic here, e.g., api call to delete appointment

    // Close modal after deletion
    setShowConfirmModal(false);
    setRecordToDelete(null);
  };

  // Close modal without deleting
  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setRecordToDelete(null);
  };

  return (
    <div>
      {currentView === "PATIENT_LIST" && (
        <div className="space-y-4">
          <p className="text-2xl font-bold">Find Patient Appointments</p>
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
                    {patient.patient.patient_fname}{" "}
                    {patient.patient.patient_lname}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleViewAppointments(patient.patient)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-sm shadow hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    View Appointments
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {currentView === "AppointmentSet" && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold">
            Upcoming appointments of {selectedPatient?.patient_fname} {}
            {selectedPatient?.patient_lname}
          </h2>
          <p>Add, Delete or View Appointments.</p>

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
                    Reason
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 text-left">
                    Status
                  </th>
                  {/* <th className="py-2 px-4 border-b border-gray-200 text-left"> */}
                  {/*   Actions */}
                  {/* </th> */}
                </tr>
              </thead>
              <tbody>
                {appointmentRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200">
                      {new Date(
                        record.appointment_datetime,
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {record.doctor.doctor_lname}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {record.reason}
                    </td>
                    <td
                      className={`py-2 px-4 border-b border-gray-200 font-bold ${
                        record.status === "COMPLETED" ||
                        record.status === "CONFIRMED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {record.status}
                    </td>
                    <td>
                      {/* <button */}
                      {/*   onClick={() => handleDeleteClick(record)} */}
                      {/*   className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-200" */}
                      {/* > */}
                      {/*   Delete */}
                      {/* </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-4">
            {/* <button */}
            {/*   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50" */}
            {/*   onClick={() => { */}
            {/*     //setCurrentView("PATIENT_LIST"); */}
            {/*     //setSelectedPatient(null); */}
            {/*   }} */}
            {/* > */}
            {/*   Add an Appointment. */}
            {/* </button> */}
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
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p>Do you really want to delete this appointment?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
