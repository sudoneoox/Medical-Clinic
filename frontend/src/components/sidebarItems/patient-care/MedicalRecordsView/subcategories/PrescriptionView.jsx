import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../../../../api.js";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../utils/Card.tsx";
import { ScrollArea } from "../../../../../utils/ScrollArea.tsx";
const PrescriptionView = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // TODO: gets the prescriptions from the medical records of the patients tied to that nurse ie current or approved appointments
        const response = await api.post("/users/portal/nurse/prescriptions", {
          nurse_id: localStorage.getItem("nurseId"),
          user_id: localStorage.getItem("userId"),
        });
        setPrescriptions(response.data.prescriptions);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <>
      <CardHeader>
        <CardTitle>Patient Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-gray-500">Loading prescriptions...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.prescription_id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {prescription.patient_fname}{" "}
                        {prescription.patient_lname}
                      </h3>
                      <span className="text-sm text-gray-500">
                        Issued:{" "}
                        {format(new Date(prescription.date_issued), "PP")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Medication: {prescription.medication_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dosage: {prescription.dosage}
                      </p>
                      <p className="text-sm text-gray-600">
                        Frequency: {prescription.frequency}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {prescription.duration}
                      </p>
                    </div>
                    {prescription.pharmacy_details && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          Pharmacy:{" "}
                          {
                            JSON.parse(prescription.pharmacy_details)
                              .pharmacy_name
                          }
                        </p>
                        <p>
                          Phone:{" "}
                          {
                            JSON.parse(prescription.pharmacy_details)
                              .pharmacy_phone
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {prescriptions.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No prescriptions found
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </>
  );
};

export default PrescriptionView;
