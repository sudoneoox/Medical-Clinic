import React from 'react';
import { Link } from 'react-router-dom';

// sidebar component for navigation links and other information 
const Sidebar = ({ items }) => (
  <div className="w-64 bg-gray-100 h-screen p-4 flex flex-col justify-between border-r border-gray-200">
    <div>
      <div className="mb-8">
        <img src="images/logo.png" alt="Logo" className="h-12 w-auto" />
      </div>
      <nav className="space-y-1">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.section === 'account' && (
              <div className="border-t border-gray-200 my-4 pt-4"></div>
            )}
            <Link 
              to={item.path} 
              className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-150 ease-in-out"
            >
              {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          </React.Fragment>
        ))}
      </nav>
    </div>
    <div className="mt-auto">
      <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mb-4">
        <h3 className="font-bold text-sm mb-1">Emergency Hotline:</h3>
        <p className="text-xs">911</p>
      </div>
    </div>
  </div>
);


// Header component to display user details and quick actions
const Header = ({ userName, userRole }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {/* TODO: change username to user First name and Last name */}
        <h1 className="text-2xl font-semibold text-gray-800">Welcome {userName},</h1>
        <p className="text-2xl ml-2 text-gray-500 font-bold">How're you feeling today?</p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="flex items-center">
          <img src="images/User_Icon.png" alt={userName} className="h-8 w-8 rounded-full mr-2" />
          <div>
            <p className="font-semibold text-sm text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);


// MainFrame component that wraps the entire layout
const MainFrame = ({ children, userName, userRole, sidebarItems }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainFrame;
