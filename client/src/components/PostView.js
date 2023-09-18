import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostView = () => {
    const [postView, setPostView] = useState(null);
    const { postId } = useParams();

    useEffect(() => {
        console.log("postId:", postId);
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:4001/api/view/${postId}`);
                setPostView(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
       fetchData();
    }, [postId]);

    return (
        <>
            <div>
                {postView && (
                    <div>
                        <h2>{postView.title}</h2>
                        <p>{postView.content}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default PostView;
