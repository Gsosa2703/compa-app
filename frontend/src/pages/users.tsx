import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users from backend
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
