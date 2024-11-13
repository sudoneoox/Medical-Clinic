import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../../../../api.js";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../utils/Card.tsx";
import { ScrollArea } from "../../../../../utils/ScrollArea.tsx";
import { Search } from "lucide-react";
import { Input } from "../../../../../utils/Input.tsx";

const AllergiesView = () => {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        // TODO: finish backend controller gets allergies from patients tied to that nurses appointments
        const response = await api.post("/users/portal/nurse/allergies", {
          user_id: localStorage.getItem("userId"),
        });  
        setAllergies(response.data.patientAllergies);
      } catch (error) {
        console.error("Error fetching allergies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllergies();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity.toUpperCase()) {
      case "SEVERE":
        return "text-red-600 bg-red-50 border-red-200";
      case "MODERATE":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "MILD":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getAllergyTypeIcon = (type) => {
    switch (type.toUpperCase()) {
      case "FOOD":
        return "🍽️";
      case "MEDICATION":
        return "💊";
      case "ENVIRONMENTAL":
        return "🌿";
      default:
        return "⚠️";
    }
  };

  const filteredAllergies = allergies.filter(
    (allergy) =>
      allergy.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allergy.allergen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allergy.reaction?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <CardHeader>
        <CardTitle>Patient Allergies</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search allergies by patient name or allergen..."
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
              <span className="text-gray-500">Loading allergies...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAllergies.map((allergy) => (
                <div
                  key={allergy.allergy_id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{allergy.patient_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">
                            {getAllergyTypeIcon(allergy.allergy_type)}
                            {allergy.allergy_type}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                          allergy.severity,
                        )}`}
                      >
                        {allergy.severity}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Allergen:</span>
                        <p className="text-sm text-gray-700">
                          {allergy.allergen}
                        </p>
                      </div>

                      {allergy.reaction && (
                        <div>
                          <span className="text-sm font-medium">Reaction:</span>
                          <p className="text-sm text-gray-700">
                            {allergy.reaction}
                          </p>
                        </div>
                      )}

                      {allergy.onset_date && (
                        <div>
                          <span className="text-sm font-medium">
                            Onset Date:
                          </span>
                          <p className="text-sm text-gray-700">
                            {format(new Date(allergy.onset_date), "PP")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredAllergies.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {searchTerm
                    ? "No matching allergies found"
                    : "No allergies found"}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </>
  );
};

export default AllergiesView;
