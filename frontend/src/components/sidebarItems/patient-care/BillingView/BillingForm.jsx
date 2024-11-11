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
    onSubmit(appointment.appointment_id, {
      amount_due: parseFloat(billingData.amount_due),
      patient_id: appointment.patient_id,
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Bill</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BillingForm;
