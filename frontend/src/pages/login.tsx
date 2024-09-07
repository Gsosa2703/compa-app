import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import LOGIN_MUTATION from "../graphql/mutations/login";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          console.log("CSRF Token not found.");
        }
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    fetchCsrfToken();
  }, []);

  // Perform login when the form is submitted
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Execute the GraphQL mutation for login with CSRF token
      const response = await loginMutation({
        variables: { email, password },
        context: {
          headers: {
            "X-CSRF-TOKEN": csrfToken, // Attach CSRF token
          },
        },
      });

      if (response.data.login) {
        console.log("Login successful:", response.data.login);
        router.push("/dashboard"); // Redirect to dashboard on successful login
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Login;


