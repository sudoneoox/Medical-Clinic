import React, { useRef, useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import "../styles/tailwindbase.css";

export default function AboutPage() {
  const sectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const thirdSectionRef = useRef(null);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [secondSectionHeight, setSecondSectionHeight] = useState(0);
  const [thirdSectionHeight, setThirdSectionHeight] = useState(0);

  const navbarItems = [
    { label: "Home", to: "/", isActive: false },
    { label: "About", to: "/About", isActive: true },
    { label: "Services", to: "/Services", isActive: false },
    { label: "Contact", to: "/Contact", isActive: false },
  ];

  useEffect(() => {
    if (sectionRef.current) {
      setSectionHeight(sectionRef.current.offsetHeight);
    }
    if (secondSectionRef.current) {
      setSecondSectionHeight(secondSectionRef.current.offsetHeight);
    }
    if (thirdSectionRef.current) {
      setThirdSectionHeight(thirdSectionRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <Navbar items={navbarItems} />
      
      {/* Main content starts here with the background applied directly to the container */}
      <main
        className="relative w-full h-screen pt-24"
        style={{
          backgroundImage: "url('https://img.freepik.com/free-photo/abstract-blur-hospital-clinic-interior_1203-7891.jpg?w=1800&t=st=1729190866~exp=1729191466~hmac=a1a864deb7df3908bc3e3c67ba5128c7d300aeea3bde742a6ae20ddc8a40317b')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div id="about-page" className="container mx-auto px-4 relative z-10">

          {/* Top Intro */}
          <div className="flex justify-between mb-8 items-center">
            <div className="w-3/5 bg-white dark:bg-gray-800 dark:text-white p-6 rounded-md">
              <h1 className="text-3xl font-bold mb-4">About WSYK Clinic</h1>
              <p>
                Solving the world's toughest medical problems — one patient at a time, one tuple at a time
              </p>
            </div>
          </div>

          {/* First Section (Image on the right, text left) */}
          <div className="flex justify-between mb-8 items-center" ref={sectionRef}>
            <div className="w-2/3 bg-white dark:bg-gray-800 dark:text-white p-6 rounded-md">
              <h1 className="text-3xl font-bold mb-2">Transforming health care (and database management)</h1>
              <p>
                WSYK Clinic is the largest integrated, not-for-profit medical group practice in our college's 
                Computer Science building. We're building the future, one where the best possible care is available 
                to everyone. Our relentless database querying turns into earlier diagnoses and new ways to organize 
                patient data. That's how we inspire hope in those who need it most (and fear in those who don't back 
                up their databases).
              </p>
            </div>
            <div className="w-1/3 ml-4">
              <img
                src="/images/Picture1.png"
                alt="WSYK Clinic"
                className="object-contain w-full"
                style={{ height: `${sectionHeight}px` }}
              />
            </div>
          </div>

          {/* Second Section (Image on the left, text right) */}
          <div className="flex justify-between mb-8 items-center" ref={secondSectionRef}>
            <div className="w-1/3 mr-4">
              <img
                src="/images/Picture2.png"
                alt="WSYK Clinic"
                className="object-contain w-full"
                style={{ height: `${secondSectionHeight}px` }}
              />
            </div>
            <div className="w-2/3 bg-white dark:bg-gray-800 dark:text-white p-6 rounded-md text-right">
              <h1 className="text-3xl font-bold mb-4">Innovating for new solutions</h1>
              <p>
              At WSYK Clinic, experts work together to solve the most challenging unmet needs of patients and database 
              normalization. Our history of innovation dates back almost 3 weeks, when roommates Diego and Kelsey (no 
              relation to any famous medical families) pioneered an integrated, team-based approach to medical database 
              management. Today, that trailblazing spirit drives innovations like WSYK Clinic Platform — which powers 
              new technologies to change how care is delivered to all.
              </p>
            </div>
          </div>

          {/* Third Section (Image on the right, text left) */}
          <div className="flex justify-between items-center" ref={thirdSectionRef}>
            <div className="w-2/3 bg-white dark:bg-gray-800 dark:text-white p-6 rounded-md">
              <h1 className="text-3xl font-bold mb-4">Top rankings for quality care (and data integrity)</h1>
              <p>
              Our unwavering drive to create better medical care and maintain ACID compliance has earned WSYK Clinic more 
              top rankings for high-quality patient care than any other imaginary health care organization. In fact, WSYK 
              Clinic has more No. 1 rankings than any other hospital according to U.S. News & World Report's "Best Fictional 
              Hospitals Created for Database Projects" list.
              </p>
            </div>
            <div className="w-1/3 ml-4">
              <img
                src="/images/Picture3.png"
                alt="WSYK Clinic"
                className="object-contain w-full"
                style={{ height: `${thirdSectionHeight}px` }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}