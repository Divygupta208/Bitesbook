import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://my-api.zapto.org/bitesbook/admin/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/admin/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://my-api.zapto.org/bitesbook/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.role}</td>
              <td className="py-2 px-4 space-x-2">
                {!user.isAdmin && (
                  <button
                    onClick={() => handleRoleChange(user.id, "admin")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Promote to Admin
                  </button>
                )}
                {user.isAdmin && (
                  <button
                    onClick={() => handleRoleChange(user.id, "user")}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Demote to User
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
