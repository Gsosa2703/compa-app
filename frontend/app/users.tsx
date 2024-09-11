import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users data (dummy data for now)
    const fetchUsers = async () => {
      // Fetch users from API or use mock data
      setUsers([
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
      ]);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-6">Users</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id} className="border-b py-2">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

