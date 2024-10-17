import React from 'react';
import Navbar from "../components/Navbar";
import "../styles/tailwindbase.css";
import api from "../api.js";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  return (
    <> 
      <Navbar />
      <main className="container mx-auto mt-20 px-4">
        <div id="about-page">
          <h1 className="text-3x1 font-bold mb-4">About WSYK Clinic</h1>
          <p>
            Solving the world's toughest medical problems — one patient at a time, one tuple at a time
          </p>
        </div>
      </main>
    </>
  );

}

// Who we are
// Transforming health care (and database management)
// WSYK Clinic is the largest integrated, not-for-profit medical group practice in our college's Computer Science building. We're building the future, one where the best possible care is available to everyone. Our relentless database querying turns into earlier diagnoses and new ways to organize patient data. That's how we inspire hope in those who need it most (and fear in those who don't back up their databases).