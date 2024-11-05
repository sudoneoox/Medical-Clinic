import React from "react";
import "../styles/tailwindbase.css";
import Navbar from "../components/UI/Navbar.jsx";
import { useLoaderData } from "react-router-dom";

const DepartmentCard = ({ title, description, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-contain rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

function Services() {
  // Fetch data when component mounts
  const { specialties } = useLoaderData();

  const navbarItems = [
    { label: "Home", to: "/", isActive: false },
    { label: "About", to: "/About", isActive: false },
    { label: "Services", to: "/Services", isActive: true },
    { label: "Contact", to: "/Contact", isActive: false },
  ];

  return (
    <>
      <Navbar items={navbarItems} />
      <div>
        {/* Banner Section */}
        <div className="mt-16 h-auto bg-gradient-to-b from-blue-400 to-teal-600">
          <div className="container mx-auto p-4 md:p-6 lg:p-20">
            <h1 className="text-4xl font-bold text-white text-center">
              Services
            </h1>
          </div>
        </div>

        {/* Departments Section */}
        <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
            OUR DEPARTMENTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map((specialty) => (
              <DepartmentCard
                key={specialty.code} // Use a unique key for each card
                title={specialty.name}
                description={specialty.desc} // You can customize this description
                image={`images/${specialty.name}.jpeg`} // Assuming image names are based on specialty codes
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
