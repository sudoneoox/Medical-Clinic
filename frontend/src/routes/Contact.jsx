import React from "react";
import '../styles/tailwindbase.css'
import Navbar from "../components/Navbar";

export default function ContactPage() {
  return (
    <> <Navbar />
    <main className="container mx-auto mt-20 px-4">
      
        <div id="contact-page" >
          <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
          <p className="text-center">
            !!!We are a medical clinic that provides a variety of services to our patients.
          </p>
          <p className="text-center">
          Texas Children's Hospital
Texas Children's Hospital Wallace Tower
Texas Medical Center
6701 Fannin Street
Houston, TX 77030

Tel. 832-824-1000
          </p>
        </div>
      </main>
  </>
  );
}
