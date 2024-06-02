import React, { useState, useEffect } from 'react';

const ErrorLogs = () => {
    const [logs, setLogs] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/error_logs`, {
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
              })
        })
            .then(response => response.text())
            .then(data => setLogs(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="p-6 mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
            <div>
                <div className="text-xl font-medium text-black">Errors</div>
                <p className="text-gray-500">
                    <pre className="whitespace-pre-wrap">{logs}</pre>
                </p>
            </div>
        </div>
    );
};

export default ErrorLogs;
