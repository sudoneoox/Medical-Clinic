import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import "../../styles/tailwindbase.css";

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
const NavbarItems = ({ isMobile, isMenuOpen, items }) => {
  // navbar items data with router routes
  const defaultItems = [
    { label: "Home", to: "/", isActive: true },
    { label: "About", to: "/About", isActive: false },
    { label: "Services", to: "/Services", isActive: false },
    { label: "Contact", to: "/Contact", isActive: false },
  ];

  const navItems = items || defaultItems;

  return (
    <ul
      className={`flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ${
        isMobile ? (isMenuOpen ? "block" : "hidden") : "flex"
      }`}
    >
      {navItems.map((item, index) => (
        <NavbarItem key={index} to={item.to} isActive={item.isActive}>
          {item.label}
        </NavbarItem>
      ))}
    </ul>
  );
};

// Main Navbar component

export default function Navbar({ items = null, customButtonProps = {} }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_THRESHOLD,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_THRESHOLD);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* /* Navbar Title */}
        {customButtonProps["buttonText"] === "Sign in" ||
        customButtonProps["buttonText"] === "Sign Up" ? (
          <Link
            to={`/`}
            className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >
            WSYK Clinic
          </Link>
        ) : (
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            WSYK Clinic
          </span>
        )}

        {/* /* Login Portal Button with router route */}
        <Button
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          {...customButtonProps}
        />

        {/* Navbar Items */}
        <div
          className="items-center justify-between w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <NavbarItems
            isMobile={isMobile}
            isMenuOpen={isMobileMenuOpen}
            items={items}
          />
        </div>
      </div>
    </nav>
  );
}
