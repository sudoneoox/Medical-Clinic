import React from "react";
import "../styles/tailwindbase.css";
import Navbar from "../components/Navbar";
// import {useNavigate} from 'react-router-dom';
export default function Services() {
  const navbarItems = [
    { label: "Home", to: "/", isActive: false },
    { label: "About", to: "/About", isActive: false },
    { label: "Services", to: "/Services", isActive: true },
    { label: "Contact", to: "/Contact", isActive: false },
  ];
  const DepartmentCard = ({ title, description, image }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  };
  return (
    <>
      <Navbar items={navbarItems}/>
      <div>
      {/* Banner Section */}
      <div className="mt-16 h-auto bg-gradient-to-b from-blue-400 to-teal-600">
        <div className="container mx-auto p-4 md:p-6 lg:p-20">
          <h1 className="text-4xl font-bold text-white text-center">Services</h1>
        </div>
      </div>

      {/* Departments Section */}
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
        <h2 className="text-2xl font-bold mb-4 text-center">OUR DEPARTMENTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DepartmentCard
            title="Cardiology"
            description="Our cardiology department provides comprehensive care for heart conditions."
            image="https://picsum.photos/200/300"
          />
          <DepartmentCard
            title="Neurology"
            description="Our neurology department specializes in the diagnosis and treatment of brain and nervous system disorders."
            image="https://picsum.photos/200/301"
          />
          <DepartmentCard
            title="Orthopedics"
            description="Our orthopedics department provides expert care for musculoskeletal conditions and injuries."
            image="https://picsum.photos/200/302"
          />
          {/* Add more department cards here */}
        </div>
      </div>
    </div>
    </>
  );
}