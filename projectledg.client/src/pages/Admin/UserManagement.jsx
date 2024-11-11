import React, { useState, useEffect } from 'react';
import axios from './axiosconfig';  // Axios instance with token authorization

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error('Fetch error:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 border-b">Name</th>
            <th className="py-2 border-b">Email</th>
            <th className="py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 border-b">{user.firstName} {user.lastName}</td>
              <td className="py-2 border-b">{user.email}</td>
              <td className="py-2 border-b">
                {/* Add buttons for Edit and Delete */}
                <button onClick={() => handleEdit(user.id)} className="text-blue-500 hover:underline mx-2">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
