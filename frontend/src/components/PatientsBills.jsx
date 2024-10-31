import React, { useState } from "react";
// FIX: ? were not frontend routing from the mainframe anymore its
// conditional switching to show ui if you need to switch to another sidebarItem you can make it so the
// Mainframes currentlySelected is Switched to that Item
// import { useNavigate } from "react-router-dom";

// FIX:
// WARNING: if you need a patients list similiar to Doctors Patients you can reuse the components PatientsCards.jsx
// so you dont have to rewrite code just pass the correct data that you got from the Mainframe.jsx
const PatientList = ({ data = [], onViewBills }) => {
  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        data.map((patient, index) => (
          <div
            key={index}
            className="flex items-start justify-between border-b pb-2"
          >
            <div>
              <p className="font-medium">
                {patient.patient_fname} {patient.patient_lname}
              </p>
            </div>
            <div>
              <button
                onClick={() => onViewBills(patient)}
                className="bg-blue-500 text-white px-3 py-1 rounded-sm shadow hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
              >
                View Bills
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const BillingUI = () => {
  return <></>;
};

const BillingLogic = ({ data }) => {
  // const [selectedPatient, setSelectedPatient] = useState(null);
  // const [billingRecords, setBillingRecords] = useState([]);
  // const handleViewBills = (patient) => {
  //   setSelectedPatient(patient);
  //   fetchBillingRecords(patient.patient_id);
  //   setCurrentSelected("BILLING");
  // };
  //
  // // Fetch billing records
  // const fetchBillingRecords = async (patientId) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await api.post(
  //       `${API.URL}/api/users/billing/${patientId}`,
  //     );
  //     console.log(response.data);
  //     setBillingRecords(response.data);
  //     console.log(billingRecords);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  //
  return (
    <>
      {/* ERROR: */}
      {/* do logic here from what you received in the backend the {data}  */}
      {/* or turn of api requests for this sidebar item and handle the api requets */}
      {/* inside this file */}
      {/* <div className="space-y-5"> */}
      {/*   <h2 className="text-xl font-semibold"> */}
      {/*     Billing Records for {selectedPatient.patient_fname}{" "} */}
      {/*     {selectedPatient.patient_lname} */}
      {/*   </h2> */}
      {/*   <div className="overflow-x-auto"> */}
      {/*     <table className="min-w-full bg-white border border-gray-200"> */}
      {/*       <thead> */}
      {/*         <tr className="bg-gray-100"> */}
      {/*           <th className="py-2 px-4 border-b border-gray-200 text-left"> */}
      {/*             Date of Appointment */}
      {/*           </th> */}
      {/*           <th className="py-2 px-4 border-b border-gray-200 text-left"> */}
      {/*             Payment Due Date */}
      {/*           </th> */}
      {/*           <th className="py-2 px-4 border-b border-gray-200 text-left"> */}
      {/*             Amount Due */}
      {/*           </th> */}
      {/*           <th className="py-2 px-4 border-b border-gray-200 text-left"> */}
      {/*             Payment Status */}
      {/*           </th> */}
      {/*         </tr> */}
      {/*       </thead> */}
      {/*       <tbody> */}
      {/*         {billingRecords.map((record, index) => ( */}
      {/*           <tr key={index} className="hover:bg-gray-50"> */}
      {/*             <td className="py-2 px-4 border-b border-gray-200"> */}
      {/*               {new Date(record.created_at).toLocaleDateString()}{" "} */}
      {/* Date of Appointment */}
      {/*             </td> */}
      {/*             <td className="py-2 px-4 border-b border-gray-200"> */}
      {/*               {new Date(record.billing_due).toLocaleDateString()}{" "} */}
      {/* Payment Due Date */}
      {/*             </td> */}
      {/*             <td className="py-2 px-4 border-b border-gray-200"> */}
      {/*               ${parseFloat(record.amount_due).toFixed(2)}{" "} */}
      {/* Amount Due */}
      {/*             </td> */}
      {/*             <td */}
      {/*               className={`py-2 px-4 border-b border-gray-200 font-bold ${record.payment_status === "PAID" ? "text-green-600" : "text-red-600"}`} */}
      {/*             > */}
      {/*               {record.payment_status} */}
      {/*             </td> */}
      {/*           </tr> */}
      {/*         ))} */}
      {/*       </tbody> */}
      {/*     </table> */}
      {/*   </div> */}
      {/*   <div className="flex justify-end space-x-4"> */}
      {/*     <button */}
      {/*       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50" */}
      {/*       onClick={() => { */}
      {/*         setCurrentSelected("PATIENT RECORDS"); */}
      {/*         setSelectedPatient(null); // Clear the selected patient */}
      {/*       }} */}
      {/*     > */}
      {/*       Back to Patient Records */}
      {/*     </button> */}
      {/*     <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-opacity-50"> */}
      {/*       Make a Payment */}
      {/*     </button> */}
      {/*   </div> */}
      {/* </div> */}
    </>
  );
};
export default PatientList;

