import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../utils/Dialog.tsx";
import { Button } from "../../../../utils/Button.tsx";
import { getDayOfWeek, formatTimeSlots } from "../utils/timeFormatters";

const DateTimePickerModal = ({
  open,
  onOpenChange,
  doctor,
  selectedDateTime,
  setSelectedDateTime,
  selectedOffice,
  setSelectedOffice,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Appointment Date & Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            {/* office selection  */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Location
              </label>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => setSelectedOffice(e.target.value)}
                value={selectedOffice || ""}
              >
                <option value="">Select an office</option>
                {doctor.availability &&
                  JSON.parse(doctor.availability)
                    .filter(
                      (slot, index, self) =>
                        index ===
                        self.findIndex(
                          (s) => s.office_name === slot.office_name,
                        ),
                    )
                    .map((slot, idx) => (
                      <option key={idx} value={slot.office_name}>
                        {slot.office_name}
                      </option>
                    ))}
              </select>
            </div>
            {/* date selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    setSelectedDateTime(date);
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                value={
                  selectedDateTime
                    ? selectedDateTime.toISOString().split("T")[0]
                    : ""
                }
              />
            </div>

            {/*   time selection  */}
            {selectedDateTime && selectedOffice && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Time
                </label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const date = new Date(selectedDateTime);
                    date.setHours(parseInt(hours), parseInt(minutes), 0);
                    setSelectedDateTime(date);
                  }}
                >
                  <option value="">Select a time</option>
                  {doctor.availability &&
                    JSON.parse(doctor.availability)
                      .filter(
                        (slot) =>
                          slot.office_name === selectedOffice &&
                          slot.day === getDayOfWeek(selectedDateTime),
                      )
                      .flatMap((slot) => slot.time_slots)
                      .map((timeSlot, idx) => (
                        <option key={idx} value={timeSlot.start_time}>
                          {formatTimeSlots([timeSlot])}
                        </option>
                      ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedOffice(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!selectedDateTime || !selectedOffice}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateTimePickerModal;
