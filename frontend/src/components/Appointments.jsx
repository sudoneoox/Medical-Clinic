import React, { useState } from "react";
import { Calendar, X, Plus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../utils/Card.tsx";
import { Alert, AlertDescription } from "../utils/Alerts.tsx";
import { render } from "preact/compat";

// WARNING: only works with patient need to modify appointment cards for the various
// json responses from the backend
const AppointmentCard = ({ appointment, onCancel }) => {
  const userRole = localStorage.getItem("userRole");
  console.log(userRole);
  const renderContent = (userRole) => {
    switch (userRole) {
      case "PATIENT":
        return (
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Dr. {appointment.doctor.doctor_lname}
              </h3>
              {/* <p className="text-sm text-gray-500"> */}
              {/*   {appointment.doctor.specialties[0].specialty_name} */}
              {/* </p> */}
              <p className="text-sm text-gray-500">
                {new Date(appointment.appointment_datetime).toLocaleString()}
              </p>
            </div>
            {onCancel && (
              <button
                onClick={() => onCancel(appointment.appointment_id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        );
      case "DOCTOR":
        break;
      default:
        break;
    }
  };
  console.log(appointment);
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">{renderContent(userRole)}</CardContent>
    </Card>
  );
};

const DoctorSearchForm = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    specialty: "",
    date: "",
    time: "",
  });

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "General Surgery",
    "Internal Medicine",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Urology",
  ];

  return (
    <div className="space-y-4">
      <select
        value={filters.specialty}
        onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Specialty</option>
        {specialties.map((specialty) => (
          <option key={specialty} value={specialty}>
            {specialty}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        value={filters.time}
        onChange={(e) => setFilters({ ...filters, time: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={() => onSearch(filters)}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Search Available Doctors
      </button>
    </div>
  );
};

const Appointments = ({ data }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const userData = {
    user_role: localStorage.getItem("userRole"),
  };

  const handleCancelAppointment = (appointmentId) => {
    // TODO: backend api cancel appointment ie set that appointment to CANCELLED status
    console.log(`Canceling appointment ${appointmentId}`);
  };

  const handleSearchDoctors = (filters) => {
    // TODO: backend api search doctors through specialties
    const mockResults = [
      {
        id: 1,
        name: "Dr. Smith",
        specialty: filters.specialty || "Cardiology",
        availableSlots: ["09:00", "10:00", "14:00"],
      },
      {
        id: 2,
        name: "Dr. Johnson",
        specialty: filters.specialty || "Cardiology",
        availableSlots: ["11:00", "13:00", "15:00"],
      },
    ];
    setSearchResults(mockResults);
  };

  const renderContent = () => {
    switch (userData.user_role) {
      case "PATIENT":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Appointments</h2>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Book New Appointment
              </button>
            </div>

            {showSearch ? (
              <Card>
                <CardHeader>
                  <CardTitle>Find Available Doctors</CardTitle>
                </CardHeader>
                <CardContent>
                  <DoctorSearchForm onSearch={handleSearchDoctors} />

                  {searchResults.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Available Doctors</h3>
                      {searchResults.map((doctor) => (
                        <Card key={doctor.id} className="mb-4">
                          <CardContent className="pt-6">
                            <h4 className="font-semibold">{doctor.name}</h4>
                            <p className="text-sm text-gray-500">
                              {doctor.specialty}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {doctor.availableSlots.map((slot) => (
                                <button
                                  key={slot}
                                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "DOCTOR":
        console.log("INSIDE SWITCH STATEMENT", data);
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.todaysAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "RECEPTIONIST":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="p-2 border rounded"
                  />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Search
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.todaysAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.pendingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <Alert>
            <AlertDescription>Unknown user role</AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* <h1 className="text-2xl font-bold">Appointments</h1> */}
      {renderContent()}
    </div>
  );
};

export default Appointments;
