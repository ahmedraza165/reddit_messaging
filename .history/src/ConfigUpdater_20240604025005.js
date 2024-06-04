import React, { useState, useEffect } from 'react';

function ConfigUpdater() {
    const [configs, setConfigs] = useState({});
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
    

    useEffect(() => {
        console.log('fetching configs'); // nothing is happening here. why useeffect is  not working
        fetchUsernames();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/configs`, {
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
              })
        })
            .then(response => response.json())
            .then(data => setConfigs(data));
    }, []);

    const handleValueChange = (key, event) => {
        setConfigs({
            ...configs,
            [key]: event.target.value,
        });
    };

    const handleSubmit = (key) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/configs/${key}`, {
            method: 'PUT',
            headers: new Headers ({
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "69420",
            }),
            body: JSON.stringify({
                value: configs[key],
            }),
        });
    };

    return (
        <div className="flex items-center">
            <div className="w-[90vw] mx-auto">
                <h1 className="text-lg">Configs</h1>
                {Object.entries(configs).map(([key, value]) => (
                    <div className="flex flex-col" key={key}>
                        <label>{key}</label>
                        <div>
                            <input className="inline-block w-[75vw] field" type="text" value={value} onChange={(event) => handleValueChange(key, event)} />
                            <button className="inline-block w-[14vw] button" onClick={() => handleSubmit(key)}>Update</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConfigUpdater;
