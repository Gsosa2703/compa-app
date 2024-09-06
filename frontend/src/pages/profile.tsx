import React from 'react';
import Link from 'next/link';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <p className="text-gray-700 mb-6">
          Welcome to your profile! Here you can view and manage your details.
        </p>
        <Link href="/settings" passHref>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
}

  