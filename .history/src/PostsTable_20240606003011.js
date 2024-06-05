import React, { useState, useEffect } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

const PostsTable = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/db/posts`, {
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
            })
        })
            .then(response => response.json())
            .then(data => setPosts(data));

        console.log(posts);
    }, []);

    const truncate = (str, n) => (str.length > n) ? str.substr(0, n - 1) + '...' : str;

    return (
        <div className="p-6 mx-auto bg-white rounded-xl shadow-md space-y-4">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subreddit</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chats on Assistant</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chats on Reddit</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link to the post</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Creation Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="border px-4 py-2 text-sm">{index + 1}</td>
                                <td className="border px-4 py-2 text-sm">{post.title}</td>
                                <td className="border px-4 py-2 text-sm text-blue-500">u/{post.author}</td>
                                <td className="border px-4 py-2 text-sm text-blue-500">r/{post.subreddit}</td>
                                <td className="border px-4 py-2 text-sm text-blue-500">u/{post.admin}</td>
                                <td className="border px-4 py-2 text-sm">{truncate(post.text, 100)}</td>
                                <td className="border px-4 py-2 text-sm">
                                    <a href={`https://platform.openai.com/threads/${post.openai_thread_id}`} target="_blank" rel="noopener noreferrer">
                                        <ArrowTopRightOnSquareIcon className="h-6 w-6 text-gray-500" />
                                    </a>
                                </td>
                                <td className="border px-4 py-2 text-sm">
                                    <a href={`https://www.reddit.com/message/messages/${post.reddit_message_id}`} target="_blank" rel="noopener noreferrer">
                                        <ArrowTopRightOnSquareIcon className="h-6 w-6 text-gray-500" />
                                    </a>
                                </td>
                                <td className="border px-4 py-2 text-sm">
                                    <a href={`${post.post_url}`} target="_blank" rel="noopener noreferrer">
                                        <ArrowTopRightOnSquareIcon className="h-6 w-6 text-gray-500" />
                                    </a>
                                </td>
                                <td className="border px-4 py-2 text-sm">{post.message_status}</td>
                                <td className="border px-4 py-2 text-sm">{post.post_timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostsTable;
