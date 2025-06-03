"use client";
import { useState } from "react";
import { Calculator, HandCoins, LayoutDashboard, Settings } from "lucide-react";
import { logout } from "@/app/actions";
export default function Home() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const [expenses, setExpenses] = useState([
    { id: 1, title: "Expenses of January", category: "General", amount: 2000 },
    { id: 2, title: "Expenses of February", category: "General", amount: 2000 },
    { id: 3, title: "Expenses of March", category: "General", amount: 2000 },
    { id: 4, title: "Expense of April", category: "General", amount: 2000 },
    { id: 5, title: "Expenses of May", category: "General", amount: 1500 },
  ]);

  const handleAddAccount = () => {
    console.log("Add new account clicked");
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col justify-between ${
          isSidebarExpanded ? "w-80" : "w-16"
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
          <div className="mb-6">
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
          </div>

          {/* Navigation items */}
          <div className="space-y-2">
            <div
              className={`flex items-center gap-3 py-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
                !isSidebarExpanded && "justify-center"
              }`}
              title={!isSidebarExpanded ? "Dashboard" : ""}
            >
              {/*    <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z"
                />
              </svg> */}

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
              {/*   <svg
                className="w-5 h-5 text-gray-600 bg-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg> */}

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
              {/* <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg> */}

              <Settings className="text-gray-600" />
              {isSidebarExpanded && (
                <span className="text-gray-700">Settings</span>
              )}
            </div>
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
                <p className="text-xs text-gray-500 truncate">
                  john@example.com
                </p>
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {expense.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{expense.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-700">
                    ${expense.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
