import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app'; 
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

function MyApp({ Component, pageProps }: AppProps) {
  const [csrfToken, setCsrfToken] = useState<string>(''); 
  const [client, setClient] = useState<ApolloClient<any> | null>(null); 

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (token) {
      setCsrfToken(token); 
      console.log('Extracted CSRF Token:', token); 
    } else {
      console.log('CSRF Token not found in cookies.');
    }
  }, []);

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

      setClient(newClient); 
    }
  }, [csrfToken]);

  if (!client) {
    return <div>Loading...</div>;
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

