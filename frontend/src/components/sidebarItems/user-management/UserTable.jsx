import React, { useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";

const UserTable = ({ data, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleEmergencyContact = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.employeeId && item.employeeId.toString().includes(searchTerm)),
  );

  return (
    <div className="space-y-4">
      {/* Search bar selection */}
      <div className="flex items-center gap-2 w-full md:w-96">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* table header */}
          <thead className="bg-gray-50">
            <tr>
              {/* generate table headers form data keys */}
              {Object.keys(data[0] || {}).map(
                (key) =>
                  key !== "id" && (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ),
              )}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          {/* table body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              // use fragment to group the main row and expandle emergency contact row
              <React.Fragment key={item.id}>
                <tr>
                  {Object.entries(item).map(
                    ([key, value]) =>
                      key !== "id" && (
                        <td key={key} className="px-6 py-4 whitespace-nowrap">
                          {/* handle different types of cell content */}
                          {key === "emergencyContact" ? (
                            <button
                              onClick={() => toggleEmergencyContact(index)}
                              className="text-blue-500 underline"
                            >
                              View Emergency Contacts
                            </button>
                          ) : key === "offices" ? (
                            (value = value[0])
                          ) : Array.isArray(value) ? (
                            value.join(", ")
                          ) : typeof value === "object" ? (
                            JSON.stringify(value)
                          ) : (
                            value
                          )}
                        </td>
                      ),
                  )}

                  {/* ACTION BUTTONS */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* <button */}
                    {/*   onClick={() => onEdit(item)} */}
                    {/*   className="text-indigo-600 hover:text-indigo-900 mr-4" */}
                    {/* > */}
                    {/*   <Edit className="w-5 h-5" /> */}
                    {/* </button> */}
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>

                {/* EXPANDABLE emergency contact row */}
                {expandedRow === index && item.emergencyContact && (
                  <tr>
                    <td
                      colSpan={Object.keys(item).length}
                      className="px-6 py-4"
                    >
                      <div className="p-4 border rounded bg-gray-50">
                        <h4 className="font-semibold mb-2">
                          Emergency Contact
                        </h4>
                        {(() => {
                          try {
                            const emergencyContact = JSON.parse(
                              item.emergencyContact,
                            );
                            return (
                              <>
                                <p>
                                  <strong>Name:</strong> {emergencyContact.name}
                                </p>
                                <p>
                                  <strong>Relationship:</strong>{" "}
                                  {emergencyContact.relationship}
                                </p>
                                <p>
                                  <strong>Phone:</strong>{" "}
                                  {emergencyContact.phone}
                                </p>
                              </>
                            );
                          } catch (error) {
                            console.error(
                              "Failed to parse emergencyContact JSON:",
                              error,
                            );
                            return (
                              <p>
                                Error displaying emergency contact information.
                              </p>
                            );
                          }
                        })()}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
