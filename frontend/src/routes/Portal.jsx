import React from "react";
import "../styles/tailwindbase.css";

const Provider = () => {
  return (
    <div>
      <h1>Provider Portal</h1>
      <p>Provider Portal</p>
    </div>
  );
};

const Patient = () => {
  return (
    <div>
      <h1>Patient Portal</h1>
      <p>Patient Portal</p>
    </div>
  );
};

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
    case "provider":
      portalComponent = <Provider />;
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
