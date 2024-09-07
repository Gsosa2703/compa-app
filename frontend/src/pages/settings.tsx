import React from 'react';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-500 to-accent flex items-center justify-center animate-fadeIn">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6">Settings</h1>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold text-primary">Account Settings</h2>
            <p className="text-gray-600">Update your account information here.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold text-primary">Notifications</h2>
            <p className="text-gray-600">Manage your email and push notifications.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold text-primary">Privacy Settings</h2>
            <p className="text-gray-600">Control your privacy preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
