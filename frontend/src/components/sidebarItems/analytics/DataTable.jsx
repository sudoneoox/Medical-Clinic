import React from "react";

const DataTable = ({
  data,
  expandedRow,
  detailedData,
  onRowClick,
  analyticType,
  subCategory,
  totals,
}) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const renderDetailHeaders = (details, analyticType) => {
    if (!details || details.length === 0) return null;

    let headers;
    switch (analyticType) {
      case "DEMOGRAPHICS":
        headers = ["Role", "First Name", "Last Name"];
        if (subCategory === "AGE") headers.push("Date of Birth");
        else if (subCategory === "GENDER") headers.push("Gender");
        else if (subCategory === "ETHNICITY") headers.push("Ethnicity");
        break;

      case "STAFF":
        headers = [
          "Role",
          "Employee ID",
          "First Name",
          "Last Name",
          "Offices",
          "Schedules",
        ];
        break;

      case "APPOINTMENTS":
        headers = [
          "Appointment ID",
          "Status",
          "Office",
          "Patient Name",
          "Doctor Name",
          "Date/Time",
        ];
        break;

      case "BILLING":
        if (subCategory === "PAYMENT_STATUS") {
          headers = [
            "Billing ID",
            "Patient Name",
            "Amount Due",
            "Amount Paid",
            "Status",
            "Handled By",
            "Date",
          ];
        } else {
          headers = ["Billing ID", "Patient Name", "Amount", "Date"];
        }
        break;

      default:
        headers = Object.keys(details[0]);
    }

    return headers.map((header) => (
      <th
        key={header}
        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        {header}
      </th>
    ));
  };

  const renderDetailRow = (detail, analyticType) => {
    let values;
    switch (analyticType) {
      case "DEMOGRAPHICS":
        values = [detail.user_role, detail.first_name, detail.last_name];
        if (subCategory === "AGE")
          values.push(new Date(detail.dob).toLocaleDateString());
        else if (subCategory === "GENDER") values.push(detail.gender_id);
        else if (subCategory === "ETHNICITY") values.push(detail.ethnicity_id);
        break;

      case "STAFF":
        values = [
          detail.role,
          detail.employee_id,
          detail.first_name,
          detail.last_name,
          detail.offices,
          detail.schedules,
        ];
        break;

      case "APPOINTMENTS":
        values = [
          detail.appointment_id,
          detail.status,
          detail.office_name,
          `${detail.patient_fname} ${detail.patient_lname}`,
          `${detail.doctor_fname} ${detail.doctor_lname}`,
          new Date(detail.appointment_datetime).toLocaleString(),
        ];
        break;

      case "BILLING":
        if (subCategory === "PAYMENT_STATUS") {
          values = [
            detail.billing_id,
            `${detail.patient_fname} ${detail.patient_lname}`,
            `$${detail.amount_due.toFixed(2)}`,
            `$${detail.amount_paid.toFixed(2)}`,
            detail.payment_status,
            `${detail.handled_by_fname || ""} ${detail.handled_by_lname || ""}`,
            new Date(detail.created_at).toLocaleDateString(),
          ];
        } else {
          values = [
            detail.billing_id,
            `${detail.patient_fname} ${detail.patient_lname}`,
            `$${detail.amount_paid.toFixed(2)}`,
            new Date(detail.created_at).toLocaleDateString(),
          ];
        }
        break;

      default:
        values = Object.values(detail);
    }

    return values.map((value, i) => (
      <td key={i} className="px-4 py-2 text-sm text-gray-900">
        {value}
      </td>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
              {analyticType === "BILLING" &&
                subCategory === "PAYMENT_STATUS" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  onClick={() => onRowClick(item, index)}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    expandedRow === index ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </td>
                  {analyticType === "BILLING" &&
                    subCategory === "PAYMENT_STATUS" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.amount?.toFixed(2) || "0.00"}
                      </td>
                    )}
                </tr>
                {expandedRow === index && detailedData && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 bg-gray-50">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>{renderDetailHeaders(detailedData)}</tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {detailedData.map((detail, detailIndex) => (
                              <tr key={detailIndex}>
                                {renderDetailRow(detail)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          {analyticType === "BILLING" &&
            subCategory === "REVENUE" &&
            totals && (
              <tfoot className="bg-gray-100">
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Revenue Total
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    Amount Paid: ${totals.totalPaid?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tfoot>
            )}
        </table>
      </div>
    </div>
  );
};

export default DataTable;
