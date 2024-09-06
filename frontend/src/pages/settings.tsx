import React, { useState } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('john.doe@example.com');

  const handleSave = () => {
    alert('Settings Saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Settings</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Save Changes
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/profile" legacyBehavior>
            <a className="text-blue-500 hover:text-blue-700 transition duration-300">Go back to Profile</a>
          </Link>
        </div>
      </div>
    </div>
  );
}