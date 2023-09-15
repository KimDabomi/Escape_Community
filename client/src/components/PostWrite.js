import React, { useState } from "react";
import axios from 'axios';
import styled from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";

const WriteContainer = styled.div`
  width: 100%;
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
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };
  
    return (
      <>
        <WriteContainer>
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
