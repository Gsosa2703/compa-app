"use client"; // Ensure that the file is treated as a Client Component

import { ApolloProvider } from "@apollo/client";
import { useEffect,  useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // useRouter has been replaced with useNavigation in the App Router
//import { jwtDecode } from "jwt-decode";
import { Inter } from "next/font/google";
import "./globals.css"; // Adjust the path if necessary
import apolloClient from '../utils/apollo-client'
const inter = Inter({ subsets: ["latin"] });

interface DecodedToken {
  exp: number;
  userId: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //const [csrfToken, setCsrfToken] = useState<string>(""); // CSRF token state
  //const [loading, setLoading] = useState(true); // Loading state for fetching CSRF token
  //const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Authentication state
  //const router = useRouter();
 // const pathname = usePathname() ?? ""; // Get the current pathname


  // Define public paths that don't require authentication
  // const publicPaths = ["/login", "/signup"];
  // const isPublicPath = publicPaths.includes(pathname);

  return (
    <ApolloProvider client={apolloClient}>
      <html lang="en">
        <body className={inter.className}>
            <main>{children}</main>

            {/* {isAuthenticated || isPublicPath ? (
              <main>{children}</main>
            ) : (
              <div>Redirecting to login...</div>
            )} */}
        </body>
      </html>
    </ApolloProvider>

  );
}
