import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  userId: string;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [csrfToken, setCsrfToken] = useState<string>(""); // CSRF token state
  const [client, setClient] = useState<ApolloClient<any> | null>(null); // Apollo client state
  const [loading, setLoading] = useState(true); // Loading state for fetching CSRF token
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Authentication state
  const router = useRouter();

  // Fetch CSRF token from cookies on initial load
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/csrf-token", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch CSRF token");
        }

        const data = await response.json();
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
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  // Initialize Apollo Client once CSRF token is retrieved
  useEffect(() => {
    if (csrfToken) {
      const newClient = new ApolloClient({
        uri: "http://localhost:5000/graphql",
        cache: new InMemoryCache(),
        headers: {
          "X-CSRF-TOKEN": csrfToken || "",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      setClient(newClient);
    }
  }, [csrfToken]);

  // JWT token validation and redirect if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        try {
          const decodedToken: DecodedToken = jwtDecode(token);
          const isTokenExpired = decodedToken.exp * 1000 < Date.now();

          if (!isTokenExpired) {
            setIsAuthenticated(true);
          } else if (router.pathname !== "/login" && router.pathname !== "/signup") {
            router.push("/login");
          }
        } catch (err) {
          console.error("Invalid token:", err);
          if (router.pathname !== "/login" && router.pathname !== "/signup") {
            router.push("/login");
          }
        }
      } else if (router.pathname !== "/login" && router.pathname !== "/signup") {
        router.push("/login");
      }
    }
  }, [router]);

  // Loading screen while fetching CSRF token or initializing Apollo client
  if (loading || !client) {
    return <div>Loading...</div>;
  }

  // Exclude login and signup pages from redirecting
  const publicPaths = ["/login", "/signup"];
  const isPublicPath = publicPaths.includes(router.pathname);

  return (
    <ApolloProvider client={client}>
      <Header />
      {isAuthenticated || isPublicPath ? (
        <Component {...pageProps} />
      ) : (
        <div>Redirecting to login...</div>
      )}
      <Footer />
    </ApolloProvider>
  );
}

export default MyApp;