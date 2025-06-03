"use client";
import { ArrowLeft, Key, Mail, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [error, setError] = useState("");

  const handleSendEmail = () => {
    setError("Our server is busy noW!. Try again later."!);
  };

  setTimeout(() => {
    if (error) setError("");
  }, 5000);

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center text-indigo-600 hover:text-blue-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <Key className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-center">
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
            <TriangleAlert />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500  transition-colors hover:border-gray-400"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            onClick={handleSendEmail}
          >
            Send Reset Link
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Remember your password?
              </span>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-4 inline-block text-indigo-600 hover:text-blue-800 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
