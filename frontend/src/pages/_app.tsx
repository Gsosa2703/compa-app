import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app'; 
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

function MyApp({ Component, pageProps }: AppProps) {
  const [csrfToken, setCsrfToken] = useState<string>(''); 
  const [client, setClient] = useState<ApolloClient<any> | null>(null); 
  const [loading, setLoading] = useState(true);  // Track loading state

  // useEffect for fetching CSRF token and triggering token-based client initialization
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Fetch CSRF token
        await fetch('http://localhost:5000/csrf-token', {
          credentials: 'include',
        });

        // Parse CSRF token from cookies
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];

        if (token) {
          setCsrfToken(token);  // Set token state
          console.log('Extracted CSRF Token:', token); 
        } else {
          console.log('CSRF Token not found in cookies.');
        }
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
      } finally {
        setLoading(false); // Stop loading after the fetch
      }
    };

    fetchCsrfToken();  // Call the fetch function
  }, []);

  // useEffect to initialize Apollo Client after CSRF token is set
  useEffect(() => {
    if (csrfToken) {
      const newClient = new ApolloClient({
        uri: 'http://localhost:5000/graphql',
        cache: new InMemoryCache(),
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
        },
        credentials: 'include',
      });

      setClient(newClient); // Set Apollo client
    }
  }, [csrfToken]);

  if (loading || !client) {
    return <div>Loading...</div>;  // Show loading while fetching CSRF token and initializing client
  }

  return (
    <ApolloProvider client={client}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ApolloProvider>
  );
}

export default MyApp;
