import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/tailwindbase.css";

export default function LoginPage() {
  const navbaritems = [];

  const userSignupButton = {
    buttonText: "Sign Up",
    buttonLink: "/registrations/new",
    buttonClassName:
    "text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:underline",
  };

  return (
    <>
      <Navbar items={navbaritems} customButtonProps={userSignupButton} />
      <>
        <div className="flex min-h-screen bg-gray-100">
          <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <img
                  className="h-12 w-auto"
                  src="images/logo.png"
                  alt="MedicalClinicLogo"
                />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Log in to your account
                </h2>
              </div>

              <div className="mt-8">
                <div className="mt-6">
                  <form action="#" method="POST" className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        email
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        password
                      </label>
                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your password"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <a
                      href="/forgot_password"
                      className="text-blue-800 dark:text-blue-500 hover:underline"
                    >
                      Forgot Your password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative w-0 flex-1">
            <div className="absolute inset-0 h-full w-full bg-purple-600 flex flex-col justify-center items-center text-white p-12">
              <img src="images/" alt="ImageAlt" className="mb-4" />
              <h2 className="text-3xl font-bold mb-4">PlaceHolder</h2>
              <p className="text-lg mb-4">PlaceHolder</p>
              <p className="text-lg">PlaceHolder</p>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
