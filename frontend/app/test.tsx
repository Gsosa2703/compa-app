import { useQuery, gql } from "@apollo/client";

// Define a simple GraphQL query to get users
const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

export default function TestPage() {
  // Use Apollo's useQuery hook to send the GraphQL query
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Users</h1>
      {data.users.map((user: any) => (
        <div key={user.id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
}
