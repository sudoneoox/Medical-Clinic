import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, UserRound } from "lucide-react";

// TODO: change <LINK> to a button were no
// longer routing to a different frontend page but make it send a request to the backend
// make button select also change currentselected state

// sidebar component for navigation links and other information
const Sidebar = ({ items }) => {
  const [selected, setSelected] = useState("OVERVIEW");

  return (
    // container holding everything
    <div className="w-64 bg-gray-100 h-screen p-4 flex flex-col justify-between border-r border-gray-200">
      <div>
        {/* image in the top left corner (logo) */}
        <div className="mb-8">
          <img src="images/logo.png" alt="Logo" className="h-12 w-auto" />
        </div>

        <nav className="space-y-1">
          {/* iterate through dictonary and place them as links */}
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {/* if account seperator add a horizontal line */}
              {item.section === "account" && (
                <div className="border-t border-gray-200 my-4 pt-4"></div>
              )}

              <button className="flex items-center py-2 px-4 hover:bg-gray-200 rounded-lg transition duration-150 ease-in-out">
                {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
                {item.label.toUpperCase() === selected ? (
                  <span
                    style={{ color: "blue", fontWeight: "bold" }}
                    classname="text-sm bg-white font-medium text-red-900"
                  >
                    {item.label}
                  </span>
                ) : (
                  <span classname="text-sm font-medium text-gray-700 ">
                    {item.label}
                  </span>
                )}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>
      <div className="mt-auto">
        <div className="bg-blue-100 text-blue-800 p-3 rounded-sm">
          <h3 className="font-bold text-sm mb-1">Emergency Hotline: 911</h3>
          {/* <p className="text-md">911</p> */}
        </div>
      </div>
    </div>
  );
};

// Header component to display user details and quick actions
const Header = ({ userFullName, userRole }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {/* TODO: change username to user First name and Last name */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome {userFullName},
        </h1>
        <p className="text-2xl ml-2 text-gray-500 font-bold">
          How're you feeling today?
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Bell className="rounded-full" />
        </button>
        <div className="flex items-center">
          <UserRound className="h-8 w-8 mr-3 rounded-full" />
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {userFullName}
            </p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// MainFrame component that wraps the entire layout
const MainFrame = ({ children, userFullName, userRole, sidebarItems }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userFullName={userFullName} userRole={userRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainFrame;
