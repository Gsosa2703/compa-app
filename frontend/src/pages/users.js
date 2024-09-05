import { gql, useQuery } from '@apollo/client';

// GraphQL query to fetch users
const GET_USERS = gql`
  query GetUsers {
    users {
      name
      email
    }
  }
`;

// React component that uses the query
function Users() {
  const { loading, error, data } = useQuery(GET_USERS); //This query fetches the list of users with their names and emails from your backend.

  // Add console logs to track what's happening
  console.log({ loading, error, data });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {data.users.map((user, index) => (
          <li key={index}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
