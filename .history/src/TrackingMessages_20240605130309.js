import React, { useState, useEffect } from 'react';

const Metrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [averageReachoutTime, setAverageReachoutTime] = useState(null);

  useEffect(() => {
    fetchMetrics();
    fetchTimestamps();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/db/allposts`);
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchTimestamps = async () => {
    try {
      const response = await fetch(`/api/db/message_timestamps`);
      if (!response.ok) {
        throw new Error('Failed to fetch message timestamps');
      }
      const data = await response.json();
      setTimestamps(data);
    } catch (error) {
      console.error('Error fetching message timestamps:', error);
    }
  };

  useEffect(() => {
    if (metrics.length && timestamps.length) {
      calculateAverageReachoutTime();
    }
  }, [metrics, timestamps]);

  const calculateAverageReachoutTime = () => {
    let totalDifference = 0;
    let count = 0;

    timestamps.forEach((timestamp) => {
      const post = metrics.find((metric) => metric.id === timestamp.post_id);
      if (post) {
        const messageTime = new Date(timestamp.message_sent_at).getTime();
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Tracking Messages</h1>
      <div className="mb-4">
        <h2 className="text-2xl">Average Message Reachout Time: {averageReachoutTime ? (averageReachoutTime / 1000 / 60).toFixed(2) : 'N/A'} minutes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Total Messages</th>
              <th className="px-4 py-3">Opened Messages</th>
              <th className="px-4 py-3">Opened Percentage</th>
              <th className="px-4 py-3">Replied Messages</th>
              <th className="px-4 py-3">Replied Percentage</th>
              <th className="px-4 py-3">Tracking Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {metrics.map((metric, index) => (
              <tr key={index} className="transition-all hover:bg-gray-100">
                <td className="px-4 py-3">{metric.username}</td>
                <td className="px-4 py-3">{metric.total_messages}</td>
                <td className="px-4 py-3">{metric.opened_messages}</td>
                <td className="px-4 py-3">{metric.opened_percentage}%</td>
                <td className="px-4 py-3">{metric.replied_messages}</td>
                <td className="px-4 py-3">{metric.replied_percentage}%</td>
                <td className="px-4 py-3">{metric.tracking_period.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Metrics;
