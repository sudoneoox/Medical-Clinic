import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "../../../utils/Button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../utils/Popover.tsx";
import { Calendar as CalendarComponent } from "../../../utils/Calendar.tsx";

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const handleApply = () => {
    onDateChange(tempStartDate, tempEndDate);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[300px] justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {startDate && endDate ? (
            <span>
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-4 p-4">
          <div>
            <div className="text-sm font-medium mb-2">Start Date</div>
            <CalendarComponent
              mode="single"
              selected={tempStartDate}
              onSelect={setTempStartDate}
              initialFocus
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">End Date</div>
            <CalendarComponent
              mode="single"
              selected={tempEndDate}
              onSelect={setTempEndDate}
              initialFocus
              disabled={(date) => date < tempStartDate}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Range</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
