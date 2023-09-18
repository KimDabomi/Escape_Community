import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = (() => {
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4001/api/read');
                setPostList(response.data.aPost);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
       fetchData();
    }, []);
 

    return (
        <>
            <div>
                {postList && (postList.map(item => (
                    <div key={item.name}>
                        <h2>{item.title}</h2>
                        <p>{item.content}</p>
                    </div>
                )))}
            </div>
        </>
    );
      
});

export default PostList;
