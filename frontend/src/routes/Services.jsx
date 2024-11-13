import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Thermometer,
  Activity,
  Pill,
  Microscope,
  UserCheck,
  Calendar,
  ChevronLeft,
} from "lucide-react";

const specialtyToIcon = {
  "Family Medicine": Stethoscope,
  "Internal Medicine": Heart,
  Pediatrics: Baby,
  "Obstetrics and Gynecology": UserCheck,
  "General Surgery": Activity,
  Psychiatry: Brain,
  Cardiology: Heart,
  Dermatology: Eye,
  Orthopedics: Bone,
  Neurology: Brain,
  Oncology: Microscope,
  "Emergency Medicine": Activity,
  Gastroenterology: Pill,
  Endocrinology: Thermometer,
  Urology: UserCheck,
  // Default icon if specialty doesn't match
  default: Activity,
};

const ServiceCard = ({ name, desc }) => {
  const Icon = specialtyToIcon[name] || specialtyToIcon.default;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="p-2 w-12 h-12 bg-blue-50 rounded-lg mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{desc}</p>
      <Link
        to="/login"
        className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
      >
        Book Appointment
        <Calendar className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
};

const ServicesPage = () => {
  // Use the loader data
  const { specialties } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header Section */}

      <div className="container mx-auto px-6 mb-12">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          <p className="text-lg">Back to Homepage</p>
        </Link>
        <h1 className="text-4xl font-bold text-center mb-4">Our Services</h1>
        <p className="text-gray-600 text-center max-w-3xl mx-auto"></p>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <ServiceCard
              key={index}
              name={specialty.name}
              desc={specialty.desc}
            />
          ))}
        </div>
      </div>
      {/* FOOTER  */}
      <div className="container mx-auto px-6 mt-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Medical Assistance?</h2>
          <p className="mb-6">
            Our team of healthcare professionals is here to help you. Schedule
            an appointment today.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              Schedule Appointment
              <Calendar className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
