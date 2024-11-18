import React, { useState, useEffect } from "react";
import api, { API } from "../api.js";

const AllergyForm = ({ allergy, recordId, onClose, onSave }) => {
  const [allergyType, setAllergyType] = useState("FOOD"); // Default type
  const [allergen, setAllergen] = useState("");
  const [severity, setSeverity] = useState("MILD"); // Default severity
  const [reaction, setReaction] = useState(""); // Default reaction

  useEffect(() => {
    if (allergy) {
      setAllergyType(allergy.type);
      setAllergen(allergy.allergen);
      setSeverity(allergy.severity);
      setReaction(allergy.reaction);
    }
  }, [allergy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (allergy) {
        // Update existing allergy
        console.log(allergy.allergy_id);
        
        await api.post(
          `${API.URL}/api/users/updateallergy/${allergy.allergy_id}`,
          {
            type: allergyType,
            allergen,
            severity,
            reaction,
          }
        );
      } else {
        // Create new allergy
        console.log("Entering new allergy");
        try {
            await api.post(`${API.URL}/api/users/newallergy`, {
                medical_record_id: recordId,
                type: allergyType,
                allergen,
                severity,
                reaction,
            });
        } catch (error) {
            console.log(error);
        }
      }
      onSave(); // Notify parent to refresh data
      onClose(); // Close the form
    } catch (error) {
      console.error("Error saving allergy:", error);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold">{allergy ? "Edit" : "Add"} Allergy</h2>
        
        <div>
          <label className="block">Allergy Type</label>
          <select
            value={allergyType}
            onChange={(e) => setAllergyType(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="FOOD">Food</option>
            <option value="MEDICATION">Medication</option>
            <option value="ENVIRONMENTAL">Environmental</option>
          </select>
        </div>

        <div>
          <label className="block">Allergen</label>
          <input
            type="text"
            value={allergen}
            onChange={(e) => setAllergen(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div>
          <label className="block">Reaction</label>
          <input
            type="text"
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div>
          <label className="block">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="MILD">Mild</option>
            <option value="MODERATE">Moderate</option>
            <option value="SEVERE">Severe</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AllergyForm;