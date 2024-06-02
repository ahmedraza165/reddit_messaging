import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddToBlockList = () => {
  const [userName, setUserName] = useState("");
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const handleInputChange = (e) => {
    setUserName(e.target.value);
  };

  const fetchBlockedUsers = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/blocked-users`, {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setBlockedUsers(data.blocked_users || []); // Ensure default value is an array
      })
      .catch((error) => {
        console.error("Error fetching blocked users:", error);
        toast.error("Failed to fetch blocked users");
      });
  };

  const handleDeleteUser = (blockedUsername) => {
    setIsLoading(true);
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/blocked-users/${blockedUsername}`,
      {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(`Deleted user: ${blockedUsername}`);
          fetchBlockedUsers(); // Fetch the updated list of blocked users
        } else {
          toast.error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddToBlockList = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/blocked-users`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      }),
      body: JSON.stringify({ blocked_user: userName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(`Added ${userName} to block list`);
          toast.success("Added User to Block List");
          setUserName("");
          fetchBlockedUsers(); // Fetch the updated list of blocked users
        } else {
          toast.error("Failed to add user to block list");
        }
      })
      .catch((error) => {
        console.error("Error adding user to block list:", error);
        toast.error("Failed to add user to block list");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Add User to Block List
        </h2>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-3 mb-6">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-2 px-4 leading-tight focus:outline-none text-xl"
            type="text"
            placeholder="Enter username..."
            value={userName}
            onChange={handleInputChange}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-xl border-4 text-white py-2 px-4 rounded"
            type="button"
            onClick={handleAddToBlockList}
          >
            Add
          </button>
        </div>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Blocked Users
          </h3>
          <ul className="list-disc list-inside space-y-4">
            {blockedUsers.length > 0 ? (
              blockedUsers.map((user) => (
                <li
                  key={user}
                  className="flex justify-between items-center text-xl"
                >
                  <span>{user}</span>
                  <button
                    className="flex-shrink-0 bg-red-500 hover:bg-red-700 text-white text-xl py-2 px-4 rounded"
                    type="button"
                    onClick={() => handleDeleteUser(user)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center text-xl">No blocked users</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddToBlockList;
