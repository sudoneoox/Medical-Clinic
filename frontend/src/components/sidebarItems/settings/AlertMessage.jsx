import React from "react";
import { Alert, AlertDescription } from "../../../utils/Alerts.tsx";

const AlertMessage = ({ message }) => (
  <Alert variant={message.type === "error" ? "destructive" : "default"}>
    <AlertDescription>{message.text}</AlertDescription>
  </Alert>
);

export default AlertMessage;
