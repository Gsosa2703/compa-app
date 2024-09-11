"use client";  // This ensures the component is treated as a Client Component
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-secondary p-10 animate-fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-custom-dark max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-primary mb-8 text-center">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-100 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-600">
              Check your activity, stats, and other important details here.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Recent Orders</h2>
            <p className="text-gray-600">
              View your latest orders and purchase history.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Messages</h2>
            <p className="text-gray-600">
              Check new messages from sellers or customers.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Account Settings</h2>
            <p className="text-gray-600">
              Update your account settings and manage subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}