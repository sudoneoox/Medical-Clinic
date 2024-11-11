const AppointmentList = ({ appointments = [] }) => (
  <div className="space-y-4">
    {appointments.length === 0 ? (
      <p>No appointments found.</p>
    ) : (
      appointments.map((apt, i) => (
        <div key={i} className="flex items-start justify-between border-b pb-2">
          <div>
            <p className="font-medium">
              {apt.patient?.patient_fname} {apt.patient?.patient_lname}
              {apt.doctor?.doctor_fname} {apt.doctor?.doctor_lname}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(apt.appointment_datetime).toLocaleString()}
            </p>
          </div>
          <div className="text-sm">
            <p>{apt.office?.office_name}</p>
          </div>
        </div>
      ))
    )}
  </div>
);

export default AppointmentList;
