import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/tailwindbase.css'

const MOBILE_THRESHOLD = 768; // Mobile threshold in pixels

// NavbarItem component for rendering individual navbar items
const NavbarItem = ({ to, isActive, children }) => (
  <li>
    <Link
      to={to}
      className={`block py-2 px-3 ${
        isActive
          ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
          : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
      }`}
    >
      {children}
    </Link>
  </li>
);

// NavbarItems component for rendering list of navbar items
const NavbarItems = ({ isMobile }) => {
  // navbar items data with router routes
  const items = [
    { label: "Home", to: "/", isActive: true },
    { label: "About", to: "/About", isActive: false },
    { label: "Services", to: "/Services", isActive: false },
    { label: "Contact", to: "/Contact", isActive: false },
  ];

  return (
    <ul
      className={`flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ${
        isMobile ? "" : "hidden md:flex"
      }`}
    >
      {items.map((item, index) => (
        <NavbarItem key={index} to={item.to} isActive={item.isActive}>
          {item.label}
        </NavbarItem>
      ))}
    </ul>
  );
};

// Main Navbar component
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_THRESHOLD
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_THRESHOLD);
    };

    // resize event listener to trigger mobile view

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Navbar Title */}
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          {/* Replace this when we find a name for our clinic  */}
          Medical Center{" "}
        </span>

        {/* Login Portal Button with router route*/}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link
            to="/Login"
            type="div"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login Portal
          </Link>

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              {/* hamburger icon */}
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navbar Items */}
        <div
          className={`items-center justify-between ${
            // if mobile view, hide them until triggered by clicking the hamburger icon
            isMobile ? (isMobileMenuOpen ? "block" : "hidden") : "block"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <NavbarItems isMobile={isMobile} />
        </div>
      </div>
    </nav>
  );
}
