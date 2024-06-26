import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import { XCircleIcon } from '@heroicons/react/24/solid';

function RedditAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [inputUsername, setInputUsername] = useState("");
  const [usersPasswords, setUsersPasswords] = useState({});
  const [selectedUsername, setSelectedUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUsernames();
    const intervalId = setInterval(fetchUsernames, 5000); // Fetch user data every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const total = users.reduce((sum, user) => sum + user.message_count, 0);
    setTotalMessages(total);
  }, [users]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/usernames-passwords`, {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch usernames and passwords");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => setUsersPasswords(data))
      .catch((error) =>
        console.error("Error fetching usernames and passwords:", error)
      );
  }, []);

  const fetchUsernames = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reddit/usernames`, {
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
      })
      .catch((error) => console.error("Error fetching usernames:", error));
  };

  const handleUserSelect = (username) => {
    setInputUsername(username);
    setPassword(usersPasswords[username] || "");
  };

  const handleDeleteUser = (username) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/delete-userpassword`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ username }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setUsersPasswords((prev) => {
                    const newUsersPasswords = { ...prev };
                    delete newUsersPasswords[username];
                    return newUsersPasswords;
                });
                if (username === selectedUsername) {
                    setSelectedUsername("");
                    setPassword("");
                }
            }
        })
        .catch((error) => console.error("Error deleting user:", error));
};
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = toast.loading("Logging in...");
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reddit/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      credentials: "include",
      body: JSON.stringify({ username: inputUsername }),
    })

      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers([...users, { username: inputUsername, message_count: 0 }]);
          setInputUsername("");
          setPassword("");
          setShowLoginForm(false);
          setIsAuthenticated(true);
          setUsername(inputUsername);
          window.location.href = data.authUrl;
        } else {
          toast.error("Login failed");
        }
      })
      .finally(() => {
        setIsLoading(false);
        toast.dismiss(loadingToastId);
      });
  };

  const revokeAuth = (username , message_count) => {
    if (
      window.confirm(
        `Are you sure you want to revoke reddit authentication for ${username}?`
      )
    ) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reddit/revoke-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        credentials: "include",
        body: JSON.stringify({ username  ,"message_count": message_count }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUsers(users.filter((user) => user.username !== username));
            if (users.length === 1) {
              setIsAuthenticated(false);
              setUsername(null);
            }
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => {
          toast.error("Failed to revoke authentication");
          console.error("Error during revocation:", error);
        });
    }
  };

  const handleAddAnotherUser = () => {
    setShowLoginForm(true);
    setInputUsername("");
    setPassword("");
  };

  const createInstance = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/create-instance`, {
      method: "POST",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error("Error creating instance");
        console.error("Error creating instance:", error);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        {users.length > 0 && !showLoginForm ? (
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Authenticated Users
            </h2>
            <p className="text-center text-gray-700 mb-4">
              Note: First add all the users, then click on "Create Instance".
            </p>
            {users.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <span className="font-medium text-gray-700">
                    {user.username}
                  </span>
                  <span className="text-gray-500 text-sm block">
                    <span className="text-blue-600">Processed Messages:</span>{" "}
                    <span className="text-green-600">{user.message_count}</span>
                  </span>
                </div>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => revokeAuth(user.username , user.message_count)}
                >
                  Revoke
                </button>
              </div>
            ))}
            <button
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddAnotherUser}
            >
              Add Another User
            </button>
            <button
              className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={createInstance}
            >
              Create Instance
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Previous User:
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedUsername}
                  onChange={(e) => handleUserSelect(e.target.value)}
                >
                  <option value="">Select User</option>
                  {Object.keys(usersPasswords).map((username) => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
                {Object.keys(usersPasswords).map((username) => (
                  <div key={username} className="flex items-center mt-2">
                    <span className="mr-2">{username}</span>
                    <button
                      onClick={() => handleDeleteUser(username)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form
              className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
              onSubmit={handleLogin}
            >
              <h2 className="text-2xl font-bold text-center mb-4">
                Login to Reddit
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Add User"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default RedditAuth;
