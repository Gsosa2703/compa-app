import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Initialize Apollo Client with the backend GraphQL server URL
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', // URL for your backend GraphQL API
  cache: new InMemoryCache(), // Enables caching for better performance
});

// This function wraps your entire application with ApolloProvider
function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;

