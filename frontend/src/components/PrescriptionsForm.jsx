// PrescriptionForm.js
import React, { useState, useEffect } from 'react';
import api, { API } from '../api.js';

const PrescriptionForm = ({ prescription, recordId, onClose, onSave }) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [frequency, setFrequency] = useState('');
  const [pharmacyDetails, setPharmacyDetails] = useState({
    pharmacy_name: '',
    pharmacy_phone: '',
    pharmacy_address: '',
  });
  console.log(prescription, "Testing the prescription record");
  

  useEffect(() => {
    if (prescription) {
      setMedicationName(prescription.medication_name);
      setDosage(prescription.dosage);
      setDuration(prescription.duration);
      setFrequency(prescription.frequency);
      
      const details = prescription.pharmacy_details || {};
      setPharmacyDetails({
        pharmacy_name: details.pharmacy_name || '',
        pharmacy_phone: details.pharmacy_phone || '',
        pharmacy_address: details.pharmacy_address || '',
      });
    }
  }, [prescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (prescription) {
        // Update existing prescription
        await api.post(`${API.URL}/api/users/editprescription/${prescription.prescription_id}`, {
          medicationName,
          frequency,
          dosage,
          duration,
          pharmacyDetails,
        });
      } else {
        // Create new prescription
        try {
          await api.post(`${API.URL}/api/users/newprescription`, {
            medical_record_id: recordId,
            medicationName,
            frequency,
            dosage,
            duration,
            pharmacyDetails,
          });
        } catch (error) {
          console.log(error);
        }
      }
      onSave(); // Notify parent to refresh data
      onClose(); // Close the form
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold">{prescription ? 'Edit' : 'Add'} Prescription</h2>
        <div>
          <label className="block">Medication Name</label>
          <input
            type="text"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Dosage</label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Frequency</label>
          <input
            type="text"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <h3 className="font-semibold">Pharmacy Details</h3>
          <label className="block">Name</label>
          <input
            type="text"
            value={pharmacyDetails.pharmacy_name}
            onChange={(e) => setPharmacyDetails({ ...pharmacyDetails, pharmacy_name: e.target.value })}
            required
            className="border rounded-md p-2 w-full"
          />
          <label className="block">Phone</label>
          <input
            type="text"
            value={pharmacyDetails.pharmacy_phone}
            onChange={(e) => setPharmacyDetails({ ...pharmacyDetails, pharmacy_phone: e.target.value })}
            required
            className="border rounded-md p-2 w-full"
          />
          <label className="block">Address</label>
          <input
            type="text"
            value={pharmacyDetails.pharmacy_address}
            onChange={(e) => setPharmacyDetails({ ...pharmacyDetails, pharmacy_address: e.target.value })}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-3 py-1 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;