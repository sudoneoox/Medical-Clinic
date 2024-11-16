import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "../../../utils/Button.tsx";
// fix found on github for calendar
import { autoPlacement, offset } from "@floating-ui/dom";

// NOTE:
// The calendar from shadcn-ui was giving me issues so a custom one using another library!!!
// but it needs to be customized so its in a seperate file
//
//
const CustomInput = forwardRef(({ value, onClick, onClear }, ref) => (
  <div className="relative w-[300px]">
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start text-left font-normal"
      onClick={onClick}
      ref={ref}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value || "Select date range"}
    </Button>
    {value && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
));
CustomInput.displayName = "CustomInput";

const DateRangePicker = ({ onChange, startDate, endDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState([startDate, endDate]);

  const handleDateChange = (update) => {
    setDateRange(update);

    // Only close and update parent when both dates are selected
    if (update[0] && update[1]) {
      setIsOpen(false);
      onChange({ startDate: update[0], endDate: update[1] });
    }
  };

  const handleClear = () => {
    setDateRange([null, null]);
    setIsOpen(false);
    onChange(null);
  };

  const formatDateRange = () => {
    const [start, end] = dateRange;

    if (!start && !end) return "";
    if (start && !end) return `${start.toLocaleDateString()} - Select end date`;
    if (start && end)
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    return "Select date range";
  };

  return (
    <DatePicker
      selected={dateRange[0]}
      onChange={handleDateChange}
      startDate={dateRange[0]}
      endDate={dateRange[1]}
      selectsRange
      monthsShown={2}
      open={isOpen}
      onInputClick={() => setIsOpen(true)}
      onClickOutside={() => {
        // Only close if both dates are selected or no dates are selected
        if (
          (dateRange[0] && dateRange[1]) ||
          (!dateRange[0] && !dateRange[1])
        ) {
          setIsOpen(false);
        }
      }}
      customInput={
        <CustomInput value={formatDateRange()} onClear={handleClear} />
      }
      showPopperArrow={false}
      className="z-50"
      wrapperClassName="w-full"
      calendarClassName="shadow-lg border border-gray-200 rounded-lg"
      popperClassName="z-50"
      popperModifiers={[
        autoPlacement({
          alignment: "start",
          autoAlignment: false,
        }),
        offset({ mainAxis: 8, crossAxis: 0 }),
      ]}
      isClearable={false}
    />
  );
};
export default DateRangePicker;
