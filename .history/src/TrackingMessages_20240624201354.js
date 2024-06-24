import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';

const Metrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [posts, setPosts] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [averageReachoutTime, setAverageReachoutTime] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalDeletedMessages, setTotalDeletedMessages] = useState(0);

  useEffect(() => {
    fetchMetrics();
    fetchPosts();
    fetchTimestamps();
    fetchUsernames();
    fetchDeletedMessages();
    const intervalId = setInterval(fetchUsernames, 5000); // Fetch user data every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const total = users.reduce((sum, user) => sum + user.message_count, 0);
    setTotalMessages(total);
  }, [users]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/metrics`, {
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      const consolidatedMetrics = consolidateMetrics(data);
      setMetrics(consolidatedMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const consolidateMetrics = (metrics) => {
    const metricsMap = {};

    metrics.forEach(metric => {
      const key = `${metric[1]}_${metric[7]}`; // Concatenate username and tracking period as the key
      metricsMap[key] = [...metric]; // Always replace the existing metric with the latest one
    });

    return Object.values(metricsMap);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/db/allposts`, {
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchTimestamps = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/db/message_timestamps`, {
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch message timestamps');
      }
      const data = await response.json();
      setTimestamps(data);
    } catch (error) {
      console.error('Error fetching message timestamps:', error);
    }
  };

  const fetchUsernames = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reddit/usernames`, {
      credentials: 'include',
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
      })
      .catch((error) => console.error('Error fetching usernames:', error));
  };

  
  const fetchDeletedMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/deleted-messages`,
        {
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch deleted messages");
      }
      const data = await response.json();
      setTotalDeletedMessages(data.total_deleted_messages);
    } catch (error) {
      console.error("Error fetching deleted messages:", error);
    }
  };


  useEffect(() => {
    if (posts.length && timestamps.length) {
      calculateAverageReachoutTime();
    }
  }, [posts, timestamps]);

  const calculateAverageReachoutTime = () => {
    let totalDifference = 0;
    let count = 0;

    timestamps.forEach((timestamp) => {
      const post = posts.find((post) => post.post_id === timestamp[0]);
      if (post) {
        const messageTime = new Date(timestamp[1]).getTime();
        const postTime = new Date(post.created_at).getTime();
        totalDifference += (messageTime - postTime);
        count++;
      }
    });

    if (count > 0) {
      setAverageReachoutTime(totalDifference / count);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold">Total Messages Sent</h2>
            <p className="text-2xl text-green-600">
              {totalMessages + totalDeletedMessages}
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold">Total Posts Fetched</h2>
            <p className="text-2xl text-green-600">{posts.length}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold">Average Reachout Time</h2>
            <p className="text-2xl text-green-600">{averageReachoutTime ? (averageReachoutTime / 1000 / 60).toFixed(2) : 'N/A'} minutes</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Metrics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Total Messages</th>
                  
                  <th className="px-4 py-2">Replied Messages</th>
                  <th className="px-4 py-2">Replied Percentage</th>
                  <th className="px-4 py-2">Tracking Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.map((metric, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{metric[1]}</td>
                    <td className="px-4 py-2">{metric[2]}</td>
                    <td className="px-4 py-2">{metric[5]}</td>
                    <td className="px-4 py-2">{metric[6]}%</td>
                    <td className="px-4 py-2">{metric[7].replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
