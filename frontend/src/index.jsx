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
import Registrations from "./routes/Registrations.jsx";
import api, { URL } from "./api.js";

import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

async function servicesLoader() {
  try {
    const response = await api.post(
      "http://localhost:5000/api/homepage/specialities",
    );
    return { specialties: response.data };
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return { specialties: [] };
  }
}

// NOTE: only validates now
async function portalLoader() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  if (!token || !userId || !userRole) {
    return redirect("/login");
  }
  try {
    const response = await api.post(
      URL + "/api/users/validate-session",
      { user_id: userId, user_role: userRole },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return { authenticated: true };
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      return redirect("/login");
    }
    throw error;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "about",
    element: <AboutPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "services",
    element: <ServicesPage />,
    errorElement: <ErrorPage />,
    loader: servicesLoader,
  },
  {
    path: "contact",
    element: <ContactPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "registrations/new",
    element: <Registrations />,
    errorElement: <ErrorPage />,
  },
  {
    path: "portal",
    element: <Portal />,
    errorElement: <ErrorPage />,
    loader: portalLoader,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
