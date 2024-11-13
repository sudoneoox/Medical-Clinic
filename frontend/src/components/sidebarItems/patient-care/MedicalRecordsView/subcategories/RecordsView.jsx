import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../../../../api.js";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../utils/Card.tsx";
import { ScrollArea } from "../../../../../utils/ScrollArea.tsx";
import { Badge } from "../../../../../utils/Badge.tsx";
import { Search } from "lucide-react";
import { Input } from "../../../../../utils/Input.tsx";

const RecordsView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        // TODO: fetch medical records of patient tied to that nurse
        const response = await api.post("/users/portal/nurse/medical-records", {
          user_id: localStorage.getItem("userId"),
        });
        setRecords(response.data.patientRecords);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  const filteredRecords = records.filter(
    (record) =>
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient_fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient_lname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search records by patient name or diagnosis..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-gray-500">Loading medical records...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.record_id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {record.patient_fname} {record.patient_lname}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Date: {format(new Date(record.created_at), "PPp")}
                        </p>
                      </div>
                      <Badge
                        className={
                          record.is_deleted
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {record.is_deleted ? "Deleted" : "Active"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Diagnosis:</span>
                        <p className="text-sm text-gray-700">
                          {record.diagnosis}
                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Doctor:</span>
                        <p className="text-sm text-gray-700">
                          Dr. {record.doctor_fname} {record.doctor_lname}
                        </p>
                      </div>

                      {record.appointment_id && (
                        <div>
                          <span className="text-sm font-medium">
                            Appointment ID:
                          </span>
                          <p className="text-sm text-gray-700">
                            #{record.appointment_id}
                          </p>
                        </div>
                      )}

                      {record.updated_at &&
                        record.updated_at !== record.created_at && (
                          <div>
                            <span className="text-sm font-medium">
                              Last Updated:
                            </span>
                            <p className="text-sm text-gray-700">
                              {format(new Date(record.updated_at), "PPp")}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredRecords.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {searchTerm
                    ? "No matching records found"
                    : "No medical records found"}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </>
  );
};

export default RecordsView;
