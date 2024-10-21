import { React } from "react";
import '../styles/tailwindbase.css'
import Navbar from "../components/Navbar";


export default function ContactPage() {
  const navbarItems = [
    { label: "Home", to: "/", isActive: false },
    { label: "About", to: "/About", isActive: false },
    { label: "Services", to: "/Services", isActive: false },
    { label: "Contact", to: "/Contact", isActive: true },
  ];
  return (
    <>
      <Navbar items={navbarItems}/>
      <main className="relative w-full h-full flex flex-col items-center">
        <div
          className="w-screen h-screen bg-cover bg-center object-fill"
          alt="About Us Page"
          style={{ backgroundImage: 'url("images/contact_logo.png")' }}
        >
          {/* Right Section: Image */}
          <div className="relative">
              <img style={{  Image: 'url("images/contact_map.png")' }}
                src="images/contact_map.png"
                alt="Map Location"
                className="absolute top-80 right-10 h-auto max-h-48 w-auto object-contain"
                />
            </div>
          <div id="contact-page" className="absolute top-32 z-10 text-center w-full">
            <header>
              <h1 className="text-4xl font-bold">Contact Us</h1>
              <p className="text-lg mb-8">We are waiting for your call</p>
            </header>

            {/* Content Section */}
            <div className="flex flex-col space-y-4 text-center items-center mx-auto max-w-2xl">
              {/* Intro Paragraphs */}
              <p>If you have any questions, need assistance, or would like to schedule an appointment,</p>
              <p>feel free to reach out to us through any of the following methods.</p>

              {/* Address Section */}
              <div className="space-y-2">
                <p className="text-2xl font-semibold">Address:</p>
                <p> <a href="https://www.google.com/maps/dir//6701+Fannin+St,+Houston,+TX+77030/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x8640c0723054d983:0x7b34153f4ae5eaa3?sa=X&ved=1t:707&ictx=111"
                target="_blank"
                rel="nonopener nonreferrer"
                className="text-blue-600 hover:underline"
                >
                  6701 Fannin Street
                  <p>Houston, TX 77030</p></a></p>
              </div>

              {/* Phone Section */}
              <div className="space-y-2">
                <p className="text-2xl font-semibold">Phone:</p>
                <p>Call us at: (123) 456-7890</p>
                <p>Houston, TX 77030</p>
                <p>After medical service number: (123) 456-7891 (24/7)</p>
              </div>

              {/* Emergency Services */}
              <div className="space-y-2">
                <p className="text-2xl font-semibold">Emergency Services:</p>
                <p>For medical emergencies, please call <span style={{ fontSize: '20px' }}>911</span> or visit the nearest emergency room.</p>
                <p>Our after-hours line is available for urgent concerns outside our normal business hours.</p>
                </div>
            </div>

            
          </div>
        </div>
      </main>
    </>
  );
}