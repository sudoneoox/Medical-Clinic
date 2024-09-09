import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals.js";
import "./styles/tailwindbase.css";

import Homepage from "./routes/Homepage.jsx";
import ErrorPage from "./components/Error-Page.jsx";
import AboutPage from "./routes/About.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import ServicesPage from "./routes/Services.jsx";
import ContactPage from "./routes/Contact.jsx";
import Portal from "./routes/Portal.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "About",
    element: <AboutPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "Login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "Services",
    element: <ServicesPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "Contact",
    element: <ContactPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "Portal/:userID",
    element: <Portal />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
