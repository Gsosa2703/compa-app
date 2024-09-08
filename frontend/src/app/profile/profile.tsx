"use client";  // This ensures the component is treated as a Client Component
import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_USER_QUERY = gql`
  query GetUser {
    user {
      id
      name
      email
    }
  }
`;

export default function Profile() {
  const { data, loading, error } = useQuery(GET_USER_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  const { user } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <div className="mb-4">
          <p className="font-bold text-gray-800">Name:</p>
          <p className="text-gray-600">{user.name}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold text-gray-800">Email:</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

  