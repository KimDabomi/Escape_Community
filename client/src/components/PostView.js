import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const ViewContainer = styled.div`
    width: 100%;
    .delete_complete {
        display: none;
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.7);
        padding-top: 120px;
        box-sizing: border-box;
        z-index: 99999;
        .popup {
            background-color: #fff;
            width: 350px;
            height: 180px;
            margin: auto;
            transform: translate(0, 50%);
            text-align: center;
            padding-top: 35px;
            box-sizing: border-box;

            // 닫기버튼
            button {
            margin-top: 25px;
            background-color: rgb(0, 148, 251);
            border: none;
            color: white;
            padding: 10px 25px;
            font-size: 15px;
            font-weight: 100;
            border-radius: 3px;
            }
        }
    }
`;

const PostView = () => {
    const [postView, setPostView] = useState(null);
    const { postId } = useParams();

    useEffect(() => {
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


    // 글삭제
    const deletePost = async () => {
        try {
            const response = await axios.delete(`http://localhost:4001/api/delete/${postId}`);
            console.log('--------',response);
            document.querySelector(".delete_complete").style.display = "block";            
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };


    // 팝업닫기
    const closeBox = (e) => {
        document.querySelector(".delete_complete").style.display = "none";
    };

    return (
        <>
            <ViewContainer>
                <div>
                    {postView && (
                        <div>
                            <h2>{postView.title}</h2>
                            <p>{postView.content}</p>
                            <Link to={`/edit/${postId}`}><button>수정</button></Link>
                            <button onClick={deletePost}>삭제</button>
                        </div>
                    )}
                    <form className="delete_complete">
                        <div className="popup">
                            <p>
                                글이 삭제되었습니다.
                            </p>
                            <button type="button" className="close" onClick={closeBox}>
                                닫기
                            </button>
                        </div>
                    </form>
                </div>
            </ViewContainer>
        </>
    );
};

export default PostView;
