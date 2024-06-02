import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
// Import your page components
import Home from './Home';
import About from './About';
import PostsTable from './PostsTable';
import RedditCallback from './RedditCallback';
import RedditAuth from './RedditAuth';
import TestComponent from './TestComponent';
import ConfigUpdater from './ConfigUpdater';
import AdminSubReddits from './AdminSubReddits';
import InfoLogs from './InfoLogs';
import ErrorLogs from './ErrorLogs';
import AddToBlockList from './BlackList'
import Metrics from './TrackingMessages';

function App() {
  return (
    <Router>
      <div className="min-h-[100vh] bg-gradient-to-r from-gray-200 to-gray-100">
      <ToastContainer />
        <nav className="px-4">
          <ul className="flex space-x-4 p-4 font-bold">
            <li>
              <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-blue-600 hover:text-blue-800">About</Link>
            </li>
            <li>
              <Link to="/posts" className="text-blue-600 hover:text-blue-800">Posts</Link>
            </li>
            <li>
              <Link to="/configs" className="text-blue-600 hover:text-blue-800">Configs</Link>
            </li>
            <li>
              <Link to="/admin-subreddits" className="text-blue-600 hover:text-blue-800">Admin SubReddits</Link>
            </li>
            <li>
              <Link to="/reddit_auth" className="text-blue-600 hover:text-blue-800">Add Multiple Reddit Users</Link>
            </li>
            <li>
              <Link to="/blacklist" className="text-blue-600 hover:text-blue-800">Black List Users</Link>
            </li>
            <li>
              <Link to="/tracking" className="text-blue-600 hover:text-blue-800">Tracking Messages</Link>
            </li>
            <li>
              <Link to="/info" className="text-blue-600 hover:text-blue-800">Info</Link>
            </li>
            <li>
              <Link to="/errors" className="text-blue-600 hover:text-blue-800">Errors</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/posts" element={<PostsTable />} />
          <Route path="/reddit_callback" element={<RedditCallback />} />
          <Route path="/configs" element={<ConfigUpdater />} /> 
          <Route path="/admin-subreddits" element={<AdminSubReddits />} />
          <Route path="/test" element={<TestComponent />} />
          <Route path="/reddit_auth" element={<RedditAuth />} /> 
          <Route path="/info" element={<InfoLogs />} /> 
          <Route path="/errors" element={<ErrorLogs />} /> 
          <Route path="/blacklist" element={<AddToBlockList />} />
          <Route path="/tracking" element={<Metrics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
