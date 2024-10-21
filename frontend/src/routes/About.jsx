import React from 'react';
import Navbar from "../components/Navbar";
import "../styles/tailwindbase.css";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import image1 from "../public/images/Picture1.png"

export default function AboutPage() {
  return (
    <> 
      <Navbar />
      <main className="container mx-auto mt-20 px-4">
        <div id="about-page">
          <h1 className="text-2xl font-bold mb-2">About WSYK Clinic</h1>
          <p>
            Solving the world's toughest medical problems — one patient at a time, one tuple at a time
          </p>
          <div className="mb-8"></div>
          <h1 className="text-2xl font-bold mb-4">Who we are</h1>
          <h1 className="text-1xl font-bold mb-2">Transforming health care (and database management)</h1>
          <p>
          WSYK Clinic is the largest integrated, 
          not-for-profit medical group practice 
          in our college's Computer Science building. 
          We're building the future, one where the 
          best possible care is available to everyone. 
          Our relentless database querying turns into 
          earlier diagnoses and new ways to organize 
          patient data. That's how we inspire hope in 
          those who need it most (and fear in those 
          who don't back up their databases).
          </p>
        </div>
      </main>
    </>
  );

}

/*
import React, { useRef, useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import "../styles/tailwindbase.css";
import api from "../api.js";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
const textRef = useRef(null);
const [textHeight, setTextHeight] = useState(0);

useEffect(() => {
// Update the image height based on the text container's height
if (textRef.current) {
setTextHeight(textRef.current.offsetHeight);
}
}, []);

return (
<>
<Navbar />
<main className="container mx-auto mt-20 px-4">
<div className="flex justify-between" id="about-page">
{/* Text block */}
<div className="w-2/3" ref={textRef}>
<h1 className="text-3xl font-bold mb-2">About WSYK Clinic</h1>
<p>
Solving the world's toughest medical problems — one patient at a time, one tuple at a time.
</p>
<div className="mb-8"></div>
<h1 className="text-3xl font-bold mb-4">Who we are</h1>
<h1 className="text-3xl font-bold mb-2">Transforming health care (and database management)</h1>
<p>
WSYK Clinic is the largest integrated,
not-for-profit medical group practice
in our college's Computer Science building.
We're building the future, one where the
best possible care is available to everyone.
Our relentless database querying turns into
earlier diagnoses and new ways to organize
patient data. That's how we inspire hope in
those who need it most (and fear in those
who don't back up their databases).
</p>
</div>

{/* Image block */}
<div className="w-1/3 ml-4">
<img
src="/path/to/your/image.jpg"
alt="WSYK Clinic"
className="object-cove