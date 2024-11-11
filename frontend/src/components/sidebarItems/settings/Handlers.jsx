// TODO: move Settings.jsx handlers here later

// const handleInputChange = (section, field, value) => {
//   setFormData((prev) => ({
//     ...prev,
//     [section]: {
//       ...prev[section],
//       [field]: value,
//     },
//   }));
// };
//
// const handleEmergencyContactChange = (index, field, value) => {
//   const updatedContacts = [...formData.emergency.contacts];
//   updatedContacts[index] = {
//     ...updatedContacts[index],
//     [field]: value,
//   };
//   setFormData((prev) => ({
//     ...prev,
//     emergency: {
//       contacts: updatedContacts,
//     },
//   }));
// };
//
// const addEmergencyContact = () => {
//   setFormData((prev) => ({
//     ...prev,
//     emergency: {
//       contacts: [
//         ...prev.emergency.contacts,
//         { name: "", relationship: "", phone: "" },
//       ],
//     },
//   }));
// };
//
// const removeEmergencyContact = (index) => {
//   const updatedContacts = formData.emergency.contacts.filter(
//     (_, i) => i !== index,
//   );
//   setFormData((prev) => ({
//     ...prev,
//     emergency: {
//       contacts: updatedContacts,
//     },
//   }));
// };
