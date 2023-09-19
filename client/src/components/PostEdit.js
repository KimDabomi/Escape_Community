import React, { useState, useEffect } from "react";
import axios from 'axios';
import styled from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from 'html-to-draftjs';
import { stateToHTML } from 'draft-js-export-html';
import { useParams, useNavigate } from "react-router";

const EditContainer = styled.div`
width: 100%;
.edit_complete {
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

const PostEdit = () => {
    const { postId } = useParams();
    const [title, setTitle] = useState("");
    const [postView, setPostView] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:4001/api/view/${postId}`);
                setTitle(response.data.title);
                setPostView(response.data);                
                const blocksFromHtml = htmlToDraft(response.data.content);
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                setEditorState(EditorState.createWithContent(contentState));
            } catch (error) {
                console.error("Error fetching post for editing:", error);
            }
        };
        fetchData();
    }, [postId]);

    const updateTextDescription = (state) => {
        setEditorState(state);
    };




    useEffect(() => {}, [postView]);

    // 글수정
    const updatePost = async () => {
        if (!postView) {
            console.error('postView is null or undefined');
            return;
        }

        const currentContent = editorState.getCurrentContent();
        const htmlContent = stateToHTML(currentContent);

        try {
            const postData = {
                title: title,
                content: htmlContent
            };
            console.log('----------postData',postData);
            const response = await axios.put(`http://localhost:4001/api/update/${postId}`, postData);
            console.log('--------',response.data);
            setTitle(response.data.title);
            setPostView(response.data);    
            document.querySelector(".edit_complete").style.display = "block";            
        } catch (error) {
            console.error('Failed to update post:', error);
        }
    };


    


    // 팝업닫기
    const closeBox = (e) => {
        document.querySelector(".edit_complete").style.display = "none";
        navigate(`/view/${postId}`);
    };

    return (
        <EditContainer>
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
            />
            <Editor
                placeholder="게시글을 수정해주세요"
                editorState={editorState}
                onEditorStateChange={updateTextDescription}
                localization={{ locale: "ko" }}
                editorStyle={{
                    height: "400px",
                    width: "100%",
                    border: "3px solid lightgray",
                    padding: "20px",
                }}
            />
            <button onClick={updatePost}>수정</button>
            <form className="edit_complete">
                <div className="popup">
                    <p>
                        글수정이 완료되었습니다.
                    </p>
                    <button type="button" className="close" onClick={closeBox}>
                        닫기
                    </button>
                </div>
            </form>
        </EditContainer>
    );
};

export default PostEdit;
