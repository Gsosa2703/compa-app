import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app'; // Import types for Next.js

// This function wraps your entire application with ApolloProvider
function MyApp({ Component, pageProps }: AppProps) {
  const [csrfToken, setCsrfToken] = useState<string>(''); // Explicitly type the state as string
  const [client, setClient] = useState<ApolloClient<any> | null>(null); // Type the Apollo Client

  // Get the CSRF token from the cookie and store it in state
  useEffect(() => {
    // Get the XSRF token from the browser cookies
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (token) {
      setCsrfToken(token); // Set the token to state
      console.log('Extracted CSRF Token:', token); // Log to check if it's extracted correctly
    } else {
      console.log('CSRF Token not found in cookies.');
    }
  }, []);

  // Initialize Apollo Client after the CSRF token is fetched
  useEffect(() => {
    if (csrfToken) {
      const newClient = new ApolloClient({
        uri: 'http://localhost:5000/graphql', // URL for your backend GraphQL API
        cache: new InMemoryCache(), // Enables caching for better performance
        headers: {
          'X-CSRF-TOKEN': csrfToken || '', // Send CSRF token with every request
        },
        credentials: 'include', // Ensure cookies (JWT and CSRF token) are sent with requests
      });

      setClient(newClient); // Set the Apollo Client after initialization
    }
  }, [csrfToken]);

  // If Apollo Client is not ready yet, don't render the app
  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
