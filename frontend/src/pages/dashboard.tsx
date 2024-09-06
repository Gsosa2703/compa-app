import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-1/2">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-6">Manage your account, settings, and more!</p>
        <div className="grid grid-cols-3 gap-6">
          <Link href="/profile" legacyBehavior>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              Profile
            </button>
          </Link>
          <Link href="/settings" legacyBehavior>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              Settings
            </button>
          </Link>
          <Link href="/login" legacyBehavior>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}