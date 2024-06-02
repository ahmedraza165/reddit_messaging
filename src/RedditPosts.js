import React, { useState } from 'react';
import Select from './Select'
import { Switch } from '@headlessui/react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

function RedditPosts({ posts, setPosts }) {
    const [subreddit, setSubreddit] = useState('Python');  // initial value
    const [max_pages, setLimit] = useState(10);  // initial value
    const [postType, setPostType] = useState({ id: 1, name: 'Hot', value: 'hot' });  // initial value
    const [keywords, setKeywords] = useState([]);  // initial value
    const [exactMatch, setExactMatch] = useState(false);  // initial value

    const handleSubmit = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reddit/fetch-posts`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({
                subreddit: subreddit,
                max_pages: max_pages,
                postType: postType.value,
                keywords: keywords,
                exactMatch: exactMatch
            }),
        })
        .then(response => response.json())
        .then(data => setPosts(data));
    };    

    const handleSubredditChange = (event) => {
        setSubreddit(event.target.value);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePostTypeChange = (postType) => {
        setPostType(postType);
    };

    const handleKeywordsChange = (keywords) => {
        setKeywords(keywords)
      }

    const handleExactMatchChange = (value) => {
        setExactMatch(value);
    };

    const postTypes = [
        { id: 1, name: 'Hot', value: 'hot' },
        { id: 2, name: 'New', value: 'new' },
        { id: 3, name: 'Controversial', value: 'controversial' },
        { id: 4, name: 'Rising', value: 'rising' },
        { id: 5, name: 'Top', value: 'top' },
      ];

    return (
        <div className="p-6 mx-auto rounded-xl shadow-md m-3 w-full bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100">
            <div className="flex justify-between">
                <label className="w-1/3">
                    <span className="label-text">Subreddit:&nbsp;</span>
                    <input
                        type="text"
                        value={subreddit}
                        onChange={handleSubredditChange}
                        className="w-full field"
                        title="Enter the subreddit"
                    />
                </label>
                <label className="w-1/3 ml-2">
                    <span className="label-text">&nbsp;Limit:&nbsp;</span>
                    <input
                        type="number"
                        value={max_pages}
                        onChange={handleLimitChange}
                        className="w-full field"
                        title="Number of pages to fetch or requests"
                    />
                </label>
                <label className="w-1/3 ml-2 z-10">
                    <span className="label-text">&nbsp;Post Type:&nbsp;</span>
                    <Select options={postTypes} selected={postType} onPostTypeChange={handlePostTypeChange} />
                </label>
            </div>
            <div className="flex justify-between items-end">
                <div className="pt-6 h-22 w-3/4 mr-2 text-wrap">
                    <TagsInput 
                        value={keywords}
                        onChange={handleKeywordsChange}
                        addOnBlur={true}
                        addOnPaste={true}
                        onlyUnique={true}
                        addKeys={[188, 9, 13]}
                        className="field"
                        tagProps={{className:'pill', classNameRemove: 'pill-remove'}}
                        inputProps={{className: 'w-full focus:outline-none', placeholder: 'Add a keyword'}}
                    />
                </div>
                <Switch.Group as="div" className="flex items-center space-x-4 pt-6" title="Exact or fuzzy search">
                    <Switch
                        checked={exactMatch}
                        onChange={handleExactMatchChange}
                        className={`${exactMatch ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-gray-400 to-gray-300'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exact Match Keywords</span>
                        <span
                            className={`${exactMatch ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label><span className="label-text">Exact Match Keywords</span></Switch.Label>
                </Switch.Group>
            </div>
            <div className="mt-3">
                <button onClick={handleSubmit} className="button">Submit</button>
            </div>
        </div>
    );
}

export default RedditPosts;
