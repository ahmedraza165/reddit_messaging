import React, { useState } from 'react';
import FetchPosts from './RedditPosts';
import DisplayPosts from './DisplayPosts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';

function Home() {
    const [posts, setPosts] = useState([]);

    const handleDeleteAndSetup = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/delete-and-setup`, {
                headers: new Headers({
                  "ngrok-skip-browser-warning": "69420",
                }),
              }

            );
            if (!response.ok) {
                throw new Error('Failed to delete database and run setup.');
            }
            toast.success('Database deleted and setup executed successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting database and running setup.');
        }
    };

    return (
        <div className="flex items-center">
            <div className="w-[55vw] mx-auto">
                <div className="text-white rounded-xl shadow-md px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600">
                    <h1 className="text-xl font-semibold">Welcome to Our App</h1>
                    <p className="text-gray-200">This is the main page of our app. Here, you can input your keywords and select the subreddits you want to search in.</p>
                </div>
                <FetchPosts className="bg-white rounded-xl shadow-md" setPosts={setPosts} />
                <DisplayPosts className="bg-white rounded-xl shadow-md" posts={posts} />
            </div>
        </div>
    );
}

export default Home;
