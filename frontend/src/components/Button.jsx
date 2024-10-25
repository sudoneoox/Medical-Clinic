import React from "react";
import { Link } from "react-router-dom";
import "../styles/tailwindbase.css";

export default function Button({
  isMobile,
  isMobileMenuOpen,
  toggleMobileMenu,
  buttonText = "Login Portal",
  buttonLink = "/login",
  buttonClassName = "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
}) {
  return (
    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      {buttonText === "Sign Up" && !isMobile && (
        <h1 className="self-center text-1x1 font-semibold dark:text-white mr-2">
          Don't have an account?{" "}
        </h1>
      )}
      {buttonText === "Sign in" && !isMobile && (
        <h1 className="self-center text-1x1 font-semibold dark:text-white mr-2">
          Already have an account?{" "}
        </h1>
      )}

      <Link to={buttonLink} className={buttonClassName}>
        {buttonText}
      </Link>

      {buttonText !== "Sign Up" && buttonText !== "Sign in" && isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
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
  );
}

