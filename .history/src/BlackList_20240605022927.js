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
    if (!userName || userName.trim() === "") {
      toast.error("Username cannot be empty");
      return;
    }
  
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
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Add User to Block List
        </h2>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2 mb-4">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none text-lg"
            type="text"
            placeholder="Enter username..."
            value={userName}
            onChange={handleInputChange}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-lg border-4 text-white py-1 px-2 rounded"
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
          <ul className="list-disc list-inside space-y-2 max-h-40 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #f1f1f1" }}>
            {blockedUsers.length > 0 ? (
              blockedUsers.map((user) => (
                <li
                  key={user}
                  className="flex justify-between items-center text-lg"
                >
                  <span>{user}</span>
                  <button
                    className="flex-shrink-0 bg-red-500 hover:bg-red-700 text-white text-lg py-1 px-2 rounded"
                    type="button"
                    onClick={() => handleDeleteUser(user)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center text-lg">No blocked users</li>
            )}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
          border: 3px solid #f1f1f1;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default AddToBlockList;
