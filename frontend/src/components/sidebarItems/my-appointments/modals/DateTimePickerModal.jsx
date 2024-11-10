import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../utils/Dialog.tsx";
import { Button } from "../../../../utils/Button.tsx";

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
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const availabilityData = useMemo(() => {
    if (!doctor?.availability) return [];

    try {
      // Parse the availability string if it's a string
      const parsed =
        typeof doctor.availability === "string"
          ? JSON.parse(doctor.availability)
          : doctor.availability;

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing availability:", error);
      return [];
    }
  }, [doctor?.availability]);

  const officeOptions = useMemo(() => {
    if (!availabilityData.length) return [];

    // Get unique offices
    const uniqueOffices = Array.from(
      new Set(
        availabilityData.map((slot) =>
          JSON.stringify({
            name: slot.office_name,
            address: slot.office_address,
          }),
        ),
      ),
    ).map((str) => JSON.parse(str));

    return uniqueOffices;
  }, [availabilityData]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedOffice || !selectedDay || !availabilityData.length) return [];

    const slots = availabilityData
      .filter(
        (slot) =>
          slot.office_name === selectedOffice && slot.day === selectedDay,
      )
      .flatMap((slot) => slot.time_slots || [])
      .sort((a, b) => {
        // Sort by start time
        return a.start_time.localeCompare(b.start_time);
      });

    return slots;
  }, [availabilityData, selectedOffice, selectedDay]);

  // Handlers
  const handleTimeSelection = (timeSlot) => {
    setSelectedTime(timeSlot);
    const today = new Date();
    const daysMap = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    let targetDate = new Date();
    const currentDay = today.getDay();
    const targetDay = daysMap[selectedDay];
    let daysToAdd = targetDay - currentDay;

    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }

    targetDate.setDate(today.getDate() + daysToAdd);
    const [hours, minutes] = timeSlot.start_time.split(":");
    targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    setSelectedDateTime(targetDate);
  };

  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const handleConfirm = () => {
    if (selectedDateTime && selectedOffice) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Office Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Location</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedOffice || ""}
                onChange={(e) => {
                  setSelectedOffice(e.target.value);
                  setSelectedDay(null);
                  setSelectedTime(null);
                }}
              >
                <option value="">Choose an office</option>
                {officeOptions.map((office, idx) => (
                  <option key={idx} value={office.name}>
                    {office.name} - {office.address}
                  </option>
                ))}
              </select>
            </div>
            {/* Day Selection */}
            {selectedOffice && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Day</label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      className="p-2 text-sm"
                      onClick={() => {
                        setSelectedDay(day);
                        setSelectedTime(null);
                      }}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* Time Selection */}
            {selectedDay && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots.map((timeSlot, idx) => (
                    <Button
                      key={idx}
                      variant={
                        selectedTime?.start_time === timeSlot.start_time
                          ? "default"
                          : "outline"
                      }
                      className="p-2 text-sm"
                      onClick={() => handleTimeSelection(timeSlot)}
                    >
                      {timeSlot.start_time.slice(0, 5)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedDateTime && (
              <p className="text-sm text-gray-600 mt-4">
                Selected: {selectedDateTime.toLocaleString()}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedOffice(null);
                setSelectedDay(null);
                setSelectedTime(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDateTime || !selectedOffice}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateTimePickerModal;
