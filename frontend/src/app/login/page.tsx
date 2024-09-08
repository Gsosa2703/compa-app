"use client";  // Ensures the component is treated as a Client Component

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";  // Use `next/navigation` for App Router
import LOGIN_MUTATION from "../../graphql/login";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [csrfToken, setCsrfToken] = useState<string>("");

  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  // Fetch the CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];

        if (token) {
          setCsrfToken(token);
        } else {
          console.error("CSRF Token not found.");
        }
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    fetchCsrfToken();
  }, []);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Execute GraphQL mutation for login with CSRF token
      const response = await loginMutation({
        variables: { email, password },
        context: {
          headers: {
            "X-CSRF-TOKEN": csrfToken, // Attach CSRF token to headers
          },
        },
      });

      if (response.data?.login) {
        console.log("Login successful:", response.data.login);
        router.push("/dashboard"); // Redirect to dashboard on successful login
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default Login;

