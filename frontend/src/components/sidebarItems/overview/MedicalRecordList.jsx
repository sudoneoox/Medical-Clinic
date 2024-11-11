const MedicalRecordList = ({ records }) => (
  <div className="space-y-4">
    {records.map((record, i) => (
      <div key={i} className="flex items-center justify-between border-b pb-2">
        <div>
          <p className="font-medium">{record.diagnosis}</p>
          <p className="text-sm text-gray-500">
            Dr. {record.doctor?.doctor_fname} {record.doctor?.doctor_lname}
          </p>
        </div>
        <div className="text-sm">
          {new Date(record.created_at).toLocaleDateString()}
        </div>
      </div>
    ))}
  </div>
);

export default MedicalRecordList;
