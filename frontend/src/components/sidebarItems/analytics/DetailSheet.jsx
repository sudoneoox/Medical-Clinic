import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../utils/Sheet.tsx";

const DetailSheet = ({
  isOpen,
  onOpenChange,
  title,
  analyticType,
  detailedData,
}) => {
  const getFieldsConfig = () => {
    switch (analyticType) {
      case "DEMOGRAPHICS":
        return [
          { key: "user_username", label: "Username" },
          { key: "user_email", label: "Email" },
          { key: "dob", label: "Date of Birth" },
        ];
      case "BILLING":
        return [
          { key: "billing_id", label: "Bill ID" },
          { key: "amount_due", label: "Amount Due" },
          { key: "payment_status", label: "Status" },
          { key: "created_at", label: "Date" },
        ];
      case "APPOINTMENTS":
        return [
          { key: "appointment_id", label: "Appointment ID" },
          { key: "appointment_datetime", label: "Date/Time" },
          { key: "status", label: "Status" },
          { key: "reason", label: "Reason" },
        ];
      case "STAFF":
        return [
          { key: "employee_id", label: "Employee ID" },
          { key: "name", label: "Name" },
          { key: "office_name", label: "Office" },
          { key: "specialization", label: "Specialization" },
        ];
      default:
        return [{ key: "name", label: "Name" }];
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <div className="space-y-4">
            {detailedData?.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex flex-col gap-2">
                  {getFieldsConfig().map((field) => (
                    <div key={field.key} className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        {field.label}:
                      </span>
                      <span className="font-medium">
                        {field.key.includes("amount")
                          ? `$${parseFloat(item[field.key]).toFixed(2)}`
                          : field.key.includes("date")
                            ? new Date(item[field.key]).toLocaleDateString()
                            : item[field.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailSheet;
