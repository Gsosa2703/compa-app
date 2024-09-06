import { useEffect } from "react";

export const useGraphQLErrorHandler = (error: any) => {
  useEffect(() => {
    if (error) {
      console.error("GraphQL Error:", error);
      // Add additional error handling logic (e.g., notifications) here
    }
  }, [error]);
};
