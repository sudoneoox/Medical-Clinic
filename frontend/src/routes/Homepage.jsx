import { React } from "react";
import "../styles/tailwindbase.css";
import Navbar from "../components/Navbar";

export default function Homepage() {
  return (
    <>
      <Navbar />
      <div className="relative w-full h-full flex flex-col items-center">
        <img 
            src="https://img.freepik.com/free-photo/abstract-blur-hospital-clinic-interior_1203-7891.jpg?w=1800&t=st=1729190866~exp=1729191466~hmac=a1a864deb7df3908bc3e3c67ba5128c7d300aeea3bde742a6ae20ddc8a40317b" 
            alt="Hospital" 
            className="w-full object-fill overflow-hidden"
        />

        <header className="absolute top-32 w-full text-center z-10">
            <h1 className="text-4xl font-bold">Welcome to Our Medical Clinic</h1>
            <p className="text-lg">Your health is our priority</p>
        </header>

        <div className="absolute top-60 flex flex-row z-10 justify-center space-x-4"> 
            {/* Find a Doctor Box */}
            <div className="card p-6 bg-white rounded-lg shadow-md w-72">
                <h2 className="text-xl font-semibold mb-2">Find a Doctor</h2>
                <input 
                    type="text" 
                    placeholder="Search by name or specialty" 
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Search</button>
            </div>

            {/* Find a Location Box */}
            <div className="card p-6 bg-white rounded-lg shadow-md w-72">
              <h2 className="text-xl font-semibold mb-2">Find a Location</h2>
              <input 
                  type="text" 
                  placeholder="Enter your city or zip" 
                  className="w-full p-2 border border-gray-300 rounded"
              />
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Search</button>
            </div>
        </div>
      </div>
    </>
  );
}
