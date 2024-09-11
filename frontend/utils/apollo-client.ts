import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = new ApolloClient({
    uri: "http://localhost:5000/graphql",
    cache: new InMemoryCache(),
    headers: {
      "X-CSRF-TOKEN": "1puxJ4Ui-C0SyChBQTAxl53_f1QzFm8QFea8" || "",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
;

export default createApolloClient;