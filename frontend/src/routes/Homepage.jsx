import { React } from "react";
import "../styles/tailwindbase.css";
import Navbar from "../components/Navbar";

export default function Homepage() {
  return (
    <>
      <Navbar />
      <div className="relative w-full h-screen flex flex-col items-center bg-gray-100">
        <img 
          src="https://img.freepik.com/premium-photo/medical-technology-medical-network_488220-34701.jpg" 
          alt="Hospital" 
          className="w-full h-full opacity-70"
        />

        <header className="absolute top-1/4 w-full text-center z-10">
          <h1 className="text-5xl font-bold mb-2">Welcome to Our Medical Clinic</h1>
          <p className="text-xl mb-4">Your health is our priority</p>
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
            Book an Appointment
          </button>
        </header>

        {/* View Services Section */}
        <section className="absolute top-1/2 w-full flex flex-col items-center z-10 p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-6">Health Resources</h2>
          <p className="text-center mb-4">
            Explore our collection of articles and guides to help you manage your health better. 
            <a href="/services" className="text-blue-200 underline"> Learn More</a>
          </p>
        </section>

        <section className="absolute top-1/2 w-full flex flex-col items-center z-10 p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-6">Explore Our Services</h2>
          <p className="text-center mb-4">
            Discover the full range of services we offer to meet your healthcare needs&nbsp;
            <a href="/services" className="text-blue-500 underline">
              here
            </a>
            .
          </p>
        </section>

        {/* Testimonials Section */}
        <section className="absolute top-3/4 w-full p-6 z-10 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-4">What Our Patients Say</h2>
          <blockquote className="italic text-gray-600 text-center">
            "The staff is always friendly and attentive. I feel well cared for every time I visit!" - Jane D.
          </blockquote>
        </section>
      </div>
    </>
  );
}
