"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left side: Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-semibold text-gray-800 hover:text-purple-600 transition-colors"
            >
              Fin Plan
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className={`hover:text-purple-600 transition-colors ${
                  isActiveRoute("/dashboard")
                    ? "text-purple-600 font-bold"
                    : "text-gray-700 font-medium"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/records"
                className={`hover:text-purple-600 transition-colors ${
                  isActiveRoute("/records")
                    ? "text-purple-600 font-bold"
                    : "text-gray-700 font-medium"
                }`}
              >
                Records
              </Link>
            </nav>
          </div>

          {/* Right side: User Menu */}
          <div className="hidden md:flex items-center ml-auto">
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors focus:outline-none"
              >
                John Doe
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <form
                    action={async () => {
                      await logout();
                    }}
                  >
                    <button
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile burger menu overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          ></div>

          {/* Slide-in menu */}
          <div
            className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/" className="text-xl font-semibold text-gray-800">
                Fin Plan
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col justify-between h-full">
              {/* Navigation Links */}
              <div className="p-4">
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                      isActiveRoute("/dashboard")
                        ? "text-purple-600 font-bold bg-purple-50"
                        : "text-gray-700"
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/records"
                    className={`block px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                      isActiveRoute("/records")
                        ? "text-purple-600 font-bold bg-purple-50"
                        : "text-gray-700"
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    Records
                  </Link>
                </div>
              </div>

              {/* User Section at Bottom */}
              <div className="p-4 border-t border-gray-200">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 mb-2">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      john@example.com
                    </p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <form
                  action={async () => {
                    await logout();
                  }}
                >
                  <button className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Close user menu when clicking outside */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}
    </header>
  );
}
