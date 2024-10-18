import React, { useEffect, useState } from "react";
import "../styles/tailwindbase.css";
import Navbar from "../components/Navbar";
import api from "../api";
// import {useNavigate} from 'react-router-dom';
export default function Services() {

  const DepartmentCard = ({ title, description, image }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <img src={image} alt={title} className="w-full h-48 object-contain rounded-t-lg" />
        <div className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  };
  const [specialties, setSpecialties] = useState([]);
  useEffect(() => {
    // Fetch data when component mounts
    async function fetchData() {
      try {
        const response = await api.post("http://localhost:5000/api/homepage/specialities");
        // setSpecialties(response.data); // Update state with fetched data
        // response.data.forEach(specialty => {
        //   console.log(`Code: ${specialty.code}, Name: ${specialty.name}`);
        // });
        setSpecialties(response.data);
      } catch (error) {
        console.error("Error fetching specialties:123", error);
      }
    }
  fetchData(); // Call the function to fetch data
  },);

  const navbarItems = [
    { label: "Home", to: "/", isActive: false },
    { label: "About", to: "/About", isActive: false },
    { label: "Services", to: "/Services", isActive: true },
    { label: "Contact", to: "/Contact", isActive: false },
  ];

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
          {specialties.map(specialty => (
            <DepartmentCard
              key={specialty.code} // Use a unique key for each card
              title={specialty.name}
              description={specialty.desc} // You can customize this description
              image={`images/${specialty.name}.jpeg`} // Assuming image names are based on specialty codes
            />
          ))}
          {/* <DepartmentCard
            title="Cardiology"
            description="Our cardiology department provides comprehensive care for heart conditions."
            image="images/Cardiology.jpg"
          />
          <DepartmentCard
            title="Neurology"
            description="Our neurology department specializes in the diagnosis and treatment of brain and nervous system disorders."
            image="images/Neurology.jpg"
          />
          <DepartmentCard
            title="Orthopedics"
            description="Our orthopedics department provides expert care for musculoskeletal conditions and injuries."
            image="images/Orthopedics.jpg"
          /> */}
          {/* Add more department cards here */}
        </div>
      </div>
    </div>
    </>
  );
}