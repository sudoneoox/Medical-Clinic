import React, { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../utils/Card.tsx";
import { Input } from "../../../../utils/Input.tsx";
import { Button } from "../../../../utils/Button.tsx";

const BillingForm = ({ appointment, onSubmit, onCancel }) => {
  const [billingData, setBillingData] = useState({
    amount_due: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment, {
      amount_due: parseFloat(billingData.amount_due),
      notes: billingData.notes,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Bill</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">
              Patient: {appointment.patient_fname} {appointment.patient_lname}
            </h3>
            <p className="text-sm text-gray-500">
              Appointment Date:{" "}
              {format(new Date(appointment.appointment_datetime), "PPp")}
            </p>
            <p className="text-sm text-gray-500">
              Service: {appointment.reason}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Due ($)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                required
                value={billingData.amount_due}
                onChange={(e) =>
                  setBillingData({
                    ...billingData,
                    amount_due: e.target.value,
                  })
                }
                placeholder="Enter amount"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                value={billingData.notes}
                onChange={(e) =>
                  setBillingData({
                    ...billingData,
                    notes: e.target.value,
                  })
                }
                placeholder="Add any billing notes..."
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out">
            Cancel
          </Button>
          <Button type="submit" className="px-4 py-2 text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-md shadow-md hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out">
            Create Bill
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BillingForm;
