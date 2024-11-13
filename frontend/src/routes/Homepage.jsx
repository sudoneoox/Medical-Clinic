import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Phone, MapPin, ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px]  bg-blue-800 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-6 py-16 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            WSYK, Your Health, Our Priority
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Providing comprehensive medical care with a patient-centered
            approach. Schedule your appointment today.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
              <p className="text-gray-600">
                Mon - Fri: 8:00 AM - 8:00 PM
                <br />
                Sat - Sun: 9:00 AM - 5:00 PM
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Phone className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Emergency Contact</h3>
              <p className="text-gray-600">
                24/7 Emergency Line:
                <br />
                911
                <br />
                General Inquiries: (111) 123-4568
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <MapPin className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Locations</h3>
              <p className="text-gray-600">
                Main Clinic: 123 Medical Ave
                <br />
                North Branch: 456 Health St
                <br />
                South Branch: 789 Care Rd
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Primary Care",
              "Specialty Care",
              "Prescription Services",
              "Lab Services",
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-4">{service}</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive healthcare services tailored to your needs.
                </p>
                <Link
                  to="/services"
                  className="text-blue-600 flex items-center hover:text-blue-800"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Schedule Your Visit?
          </h2>
          <br />
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
