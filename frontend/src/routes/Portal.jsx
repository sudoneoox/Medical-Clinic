import React from "react";
import "../styles/tailwindbase.css";

// use components to fill the dashboard instead of making different pages for each
// each component would need to be filled with the respective data received from the backend ie so calendar 
// component for patient should be called in within the patient function return (<Calendar data={}/>) etc
const Doctor = () => {
  return (
    <div>
      <h1>Provider Portal</h1>
      <p>Provider Portal</p>
    </div>
  );
};

const Receptionist = () => {
  return <></>;
};

const Nurse = () => {
  return <></>;
};

const Patient = () => {
  return (
    <div>
      <h1>Patient Portal</h1>
      <p>Patient Portal</p>
    </div>
  );
};

// maybe implement?
const Admin = () => {
  return (
    <div>
      <h1>Admin Portal</h1>
      <p>Admin Portal</p>
    </div>
  );
};

// this function will be used to render the components inside the mainframe portal page based on the user type
// i.e. users will have different views/privalages compared to the admin which will have a db web portal
export default function Portal() {
  const userType = null; // change with handling logic provided by the user login db api

  let portalComponent;
  switch (userType) {
    case "docotr":
      portalComponent = <Doctor />;
      break;
    case "nurse":
      portalComponent = <Nurse />;
      break;
    case "receptionist":
      portalComponent = <Receptionist />;
      break;
    case "patient":
      portalComponent = <Patient />;
      break;
    case "admin":
      portalComponent = <Admin />;
      break;
    default:
      portalComponent = <></>; // send back incorrect login or maybe handle that within the login page ? or send an error page
  }

  return <div>{portalComponent}</div>;
}
