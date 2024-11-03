// PaymentForm.jsx
import React, { useState } from "react";
import api, { API } from "../api.js";

const PaymentForm = ({
  selectedBillingRecord,
  onPaymentComplete,
  onCancel,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardNumber(value);
  };

  const handleExpirationDateChange = (e) => {
    const value = e.target.value.replace(/[^0-9\/]/g, "").slice(0, 5);
    setExpirationDate(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API.URL}/api/users/submit-payment`, {
        selectedBillingRecord,
        cardNumber,
        expirationDate,
        cvv,
      });
      onPaymentComplete();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Make a Payment</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div className="mb-4">
        <p>
          <strong>Date of Appointment:</strong>{" "}
          {new Date(selectedBillingRecord.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Payment Due Date:</strong>{" "}
          {new Date(selectedBillingRecord.billing_due).toLocaleDateString()}
        </p>
        <p>
          <strong>Amount Due:</strong> $
          {parseFloat(selectedBillingRecord.amount_due).toFixed(2)}
        </p>
        <p>
          <strong>Payment Status:</strong>{" "}
          {selectedBillingRecord.payment_status}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
            className="border rounded px-4 py-2 w-full"
            maxLength="16"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Expiration Date (MM/YY):
          </label>
          <input
            type="text"
            value={expirationDate}
            onChange={handleExpirationDateChange}
            required
            className="border rounded px-4 py-2 w-full"
            placeholder="MM/YY"
            maxLength="5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">CVV:</label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            required
            className="border rounded px-4 py-2 w-full"
            maxLength="3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Payment
        </button>
        <button
          type="button"
          className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;

