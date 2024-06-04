import React, { useState, useEffect } from "react";

function ConfigUpdater() {
  const [configs, setConfigs] = useState({});
  const [users, setUsers] = useState([]);

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
        console.log("Fetched usernames:", data.users);
      })
      .catch((error) => console.error("Error fetching usernames:", error));
  };

  useEffect(() => {
    console.log("Fetching configs and usernames");

    fetchUsernames();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/configs`, {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setConfigs(data);
        console.log("Fetched configs:", data);
      })
      .catch((error) => console.error("Error fetching configs:", error));
  }, []);

  const handleValueChange = (key, event) => {
    setConfigs({
      ...configs,
      [key]: event.target.value,
    });
  };

  const handleSubmit = (key) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/configs/${key}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      }),
      body: JSON.stringify({
        value: configs[key],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Updated config ${key}:`, data);
      })
      .catch((error) => console.error(`Error updating config ${key}:`, error));
  };

  const totalMessageRateLimitPerHour =
    configs.REDDIT_MESSAGE_RATE_LIMIT_PER_HOUR
      ? configs.REDDIT_MESSAGE_RATE_LIMIT_PER_HOUR * users.length
      : 0;

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Configurations</h1>
        <div className="text-center mb-6">
          <span className="text-xl font-semibold text-blue-600">
            Total Number of Messages You Can Send Per Hour:
          </span>
          <span className="text-xl font-semibold text-green-600 ml-2">
            {totalMessageRateLimitPerHour}
          </span>
        </div>
        <div className="space-y-4">
          {Object.entries(configs).map(([key, value]) => (
            <div className="flex flex-col" key={key}>
              <label className="font-medium text-gray-700">{key}</label>
              <div className="flex space-x-2">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  type="text"
                  value={value}
                  onChange={(event) => handleValueChange(key, event)}
                />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => handleSubmit(key)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConfigUpdater;
