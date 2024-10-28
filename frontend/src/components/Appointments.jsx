import React, { useState } from "react";

const Appointments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const openModal = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMessage("A field cannot be empty");
    } else {
      setErrorMessage("");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      openModal();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <h1 className="text-2xl font-bold mb-4">Appointments Page</h1>
      <p>This is where the receptionist can view and change appointments.</p>

      <div className="flex items-center space-x-4 mt-6">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="border p-2 rounded w-full max-w-xs"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="border p-2 rounded w-full max-w-xs"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="border p-2 rounded w-full max-w-xs"
        />
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold">Patient information </h2>
            <p>
              {" "}
              {formData.firstName} {formData.lastName} {formData.email}
            </p>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
