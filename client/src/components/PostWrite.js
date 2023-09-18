import React, { useState } from "react";
import axios from 'axios';
import styled from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";

const WriteContainer = styled.div`
  width: 100%;
  .write_complete {
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

const PostWrite = (() => {
    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [htmlString, setHtmlString] = useState("");
  
    const updateTextDescription = async (state) => {
      await setEditorState(state);
      const html = draftjsToHtml(convertToRaw(editorState.getCurrentContent()));
      setHtmlString(html);
    };

    const uploadCallback = () => {
      console.log("이미지 업로드");
    };

    // 글쓰기 완료
    const PostSubmit = async () => {
        try {
            const postData = {
                title: title,
                content: htmlString
            };
            const response = await axios.post('http://localhost:4001/api/create', postData);
            console.log('Post created:', response.data);

            // 팝업
            document.querySelector(".write_complete").style.display = "block";            
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    // 팝업닫기
    const closeBox = (e) => {
        document.querySelector(".write_complete").style.display = "none";
    };
    
    return (
      <>
        <WriteContainer>
          <form className="write_complete">
            <div className="popup">
              <p>
                글쓰기를 완료하였습니다.
              </p>
              <button type="button" className="close" onClick={closeBox}>
                닫기
              </button>
            </div>
          </form>
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <Editor
            placeholder="게시글을 작성해주세요"
            editorState={editorState}
            onEditorStateChange={updateTextDescription}
            toolbar={{
              image: { uploadCallback: uploadCallback },
            }}
            localization={{ locale: "ko" }}
            editorStyle={{
              height: "400px",
              width: "100%",
              border: "3px solid lightgray",
              padding: "20px",
            }}
          />
          <button onClick={PostSubmit}>Submit</button>
        </WriteContainer>
      </>
    );
});

export default PostWrite;
