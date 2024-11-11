// MedicalRecordForm.js
import React, { useState, useEffect } from 'react';
import api, { API } from '../api.js';

const MedicalRecordForm = ({ record, patientId, onClose, onSave }) => {
  
  const [diagnosis, setDiagnosis] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  console.log(record,"record details for medical rec");
  

  useEffect(() => {
    if (record) {
      setDiagnosis(record.diagnosis);
    }
  }, [record]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (record) {
        // Update existing record
        console.log("Entering edit rec");
        await api.post(`${API.URL}/api/users/editmedicalrecords/${record.record_id}`, {
          diagnosis,
          updated_at: new Date().toISOString(),
        });
        console.log(diagnosis);
        
      } else {
        // Create new record
        try {
          const res = await api.post(`${API.URL}/api/users/createmedicalrecords`, {
            diagnosis,
            patientId,
            user_id: localStorage.getItem("userId"), // user id of logged in doctor
          });
          console.log("Added medical record");
        } catch (error) {
          console.log(error);
        }
      }
      console.log("save button worked");
      
      onSave(); // Notify parent to refresh data
      onClose(); // Close the form
    } catch (error) {
      console.error('Error saving medical record:', error);
    }
  };

  return (
    
    <div className="modal">
      <form className="space-y-4">
        <h2 className="text-2xl font-bold">{record ? 'Edit' : 'Add'} Medical Record</h2>
        <div>
          <label className="block">Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        {/* <div>
          <label className="block">Updated Date</label>
          <input
            type="datetime-local"
            value={updatedAt ? updatedAt.slice(0, 16) : ''}
            onChange={(e) => setUpdatedAt(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div> */}
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-3 py-1 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;