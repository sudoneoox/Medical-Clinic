// PrescriptionForm.js
import React, { useState, useEffect } from 'react';
import api, { API } from '../api.js';

const PrescriptionForm = ({ prescription, onClose, onSave }) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [pharmacyDetails, setPharmacyDetails] = useState({
    pharmacyName: '',
    pharmacyPhone: '',
    pharmacyAddress: '',
  });
  console.log(prescription, "Testing the prescription record");
  

  useEffect(() => {
    if (prescription) {
      setMedicationName(prescription.medication_name);
      setDosage(prescription.dosage);
      setDuration(prescription.duration);
      setPharmacyDetails(prescription.pharmacy_details);
    }
  }, [prescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (prescription) {
        // Update existing prescription
        await api.put(`${API.URL}/api/users/prescriptions/${prescription.prescription_id}`, {
          medication_name: medicationName,
          dosage,
          duration,
          pharmacy_details: pharmacyDetails,
        });
      } else {
        // Create new prescription
        await api.post(`${API.URL}/api/users/prescriptions`, {
          medication_name: medicationName,
          dosage,
          duration,
          pharmacy_details: pharmacyDetails,
        });
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
          <h3 className="font-semibold">Pharmacy Details</h3>
          <label className="block">Name</label>
          <input
            type="text"
            value={pharmacyDetails.pharmacyName}
            onChange={(e) => setPharmacyDetails({ ...pharmacyDetails, pharmacyName: e.target.value })}
            required
            className="border rounded-md p-2 w-full"
          />
          <label className="block">Phone</label>
          <input
            type="text"
            value={pharmacyDetails.pharmacyPhone}
            onChange={(e) => setPharmacyDetails({ ...pharmacyDetails, pharmacyPhone: e.target.value })}
            required
            className="border rounded-md p-2 w-full"
          />
          <label className="block">Address</label>
          <input
            type="text"
            value={pharmacyDetails.pharmacyAddress}
            onChange={(e) => setPharmacyDetails({ ...pharmacyDetails, pharmacyAddress: e.target.value })}
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