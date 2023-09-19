import React from 'react';
import { Routes, Route } from 'react-router';
import EscapeTable from './components/EscapeTable.js'; 
import PostWrite from './components/PostWrite.js';
import PostList from './components/PostList.js';
import PostView from './components/PostView.js';
import PostEdit from './components/PostEdit.js';

function App() {
  return (
    <div>
      <Routes>
        {/* 메인 */}
        <Route path="/" exapt={true} element={<EscapeTable />} />
        {/* 글쓰기 */}
        <Route path="/write" element={<PostWrite />} />
        {/* 글목록 */}
        <Route path="/list" element={<PostList />} />
        {/* 글보기 */}
        <Route path="/view/:postId" element={<PostView />} />
        {/* 글수정 */}
        <Route path="/edit/:postId" element={<PostEdit />} />
      </Routes>
    </div>
  );
}

export default App;
