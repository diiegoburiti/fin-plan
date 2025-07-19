"use client";

import { useState } from "react";
import { logout } from "@/actions";
import NavLinks from "./nav-links";

export default function SideNav() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isSidebarExpanded ? "w-60" : "w-16"
      }`}
    >
      <div className="p-4">
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-6">
          {isSidebarExpanded && (
            <h2 className="text-xl font-semibold text-gray-800">Fin Plan</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isSidebarExpanded ? "rotate-0" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Add button */}
        {/*         <div className="mb-6">
          <button
            onClick={handleAddAccount}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
              isSidebarExpanded ? "py-3 px-4" : "p-3"
            }`}
            title={!isSidebarExpanded ? "Add Account" : ""}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>

            {isSidebarExpanded && <span>Add</span>}
          </button>
        </div> */}

        {/* Navigation items */}
        <div className="space-y-2">
          <NavLinks isSidebarExpanded={isSidebarExpanded} />

          {/*  


          <div
            className={`flex items-center gap-3 py-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
              !isSidebarExpanded && "justify-center"
            }`}
            title={!isSidebarExpanded ? "Dashboard" : ""}
          >
            <LayoutDashboard className="text-gray-600" />
            {isSidebarExpanded && (
              <span className="text-gray-700">Dashboard</span>
            )}
          </div>
          <div
            className={`flex items-center gap-3 py-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
              !isSidebarExpanded && "justify-center"
            }`}
            title={!isSidebarExpanded ? "Expenses" : ""}
          >
            <HandCoins className="text-gray-600" />
            {isSidebarExpanded && (
              <span className="text-gray-700">Expenses</span>
            )}
          </div>

          <div
            className={`flex items-center gap-3 py-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
              !isSidebarExpanded && "justify-center"
            }`}
            title={!isSidebarExpanded ? "Settings" : ""}
          >
            <Settings className="text-gray-600" />
            {isSidebarExpanded && (
              <span className="text-gray-700">Settings</span>
            )}
          </div> */}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        {/* User Profile */}
        <div
          className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mb-2 ${
            !isSidebarExpanded && "justify-center"
          }`}
        >
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          {isSidebarExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <form
          action={async () => {
            await logout();
          }}
        >
          <button
            className={`w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              !isSidebarExpanded && "justify-center"
            }`}
            title={!isSidebarExpanded ? "Sign Out" : ""}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isSidebarExpanded && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
