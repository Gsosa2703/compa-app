/*To connect the frontend with the backend’s GraphQL API, you need to use Apollo Client, 
  a library that helps with fetching and managing GraphQL data.*/
//In a Next.js app, _app.js is a special file that is used to initialize pages and components.
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
//ApolloClient: This is used to create a new client that connects to your GraphQL API
//InMemoryCache: This enables caching, so Apollo can cache data fetched from the API for better performance.
/*ApolloProvider: This component wraps your entire application and injects the Apollo Client into the React component tree. 
  This makes the Apollo Client available to all your components.*/
import { useEffect, useState } from "react";

// This function wraps your entire application with ApolloProvider
function MyApp({ Component, pageProps }) {
  const [csrfToken, setCsrfToken] = useState("");

  // Get the CSRF token from the cookie and store it in state
  useEffect(() => {
    // Log the entire document.cookie to see all cookies
    console.log("All Cookies:", document.cookie);

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    if (token) {
      setCsrfToken(token);
      console.log("Extracted CSRF Token:", token); // Log the extracted CSRF token
    } else {
      console.log("CSRF Token not found in cookies");
    }
  }, []);

  console.log("CSRF Token from cookie:", csrfToken);

  // Initialize Apollo Client with the backend GraphQL server URL
  const client = new ApolloClient({
    uri: "http://localhost:5000/graphql", // URL for your backend GraphQL API
    cache: new InMemoryCache(), // Enables caching for better performance
    headers: {
      "X-CSRF-TOKEN": csrfToken || "", // Send CSRF token with every request
    },
    credentials: "include", // Ensure cookies (JWT and CSRF token) are sent with requests
  });

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
