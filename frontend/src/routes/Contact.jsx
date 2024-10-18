import React from "react";
import '../styles/tailwindbase.css'
import Navbar from "../components/Navbar";


export default function ContactPage() {
  return (
    <> <Navbar />
    <main className="container mx-auto mt-20 px-4" >
<div
  className="w-screen h-screen bg-cover bg-center "
  style={{ backgroundImage: 'url("images/about_logo.png")' }}
>
<div id="contact-page" >
          <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
          <div className="text-2xl font-semibold mb-4 text-center">
          <p>
            At WSYK Medical center, we are dedicated to providing the highest level of care to our patients. 
            </p>
          <p>If you have any questions, need assistance, or would like to schedule an appointment, </p>
          <p>feel free to reach out to us through any of the following methods.
          </p> </div>
          <div>
          <p className="text-2xl font-semibold">
          Address:
          </p>
          <p>6701 Fannin Street</p>
          <p>Houston, TX 77030</p>
          </div>
          <div>
          <p className="text-2xl font-semibold">Phone:</p>
          <p>Call us at: (123) 456-7890</p>
          <p>Houston, TX 77030</p>
          <p>After medical service number: (123) 456-7891 (24/7)</p>
          </div>
          <div>
          <p className="text-2xl font-semibold">Emergency Services:</p>
          <p>For medical emergencies, please call <span style={{ fontSize: '20px' }}> 911</span> or visit the nearest emergency room.</p>
          <p>Our after-hours line is available for urgent concerns outside our normal business hours.</p>
          </div>
        </div>
</div>

      
        
      </main>
  </>
  );
}
