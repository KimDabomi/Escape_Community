import React from 'react';
import { Routes, Route } from 'react-router';
import EscapeTable from './components/EscapeTable.js'; 
import PostWrite from './components/PostWrite.js';
import PostList from './components/PostList.js';

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
      </Routes>
    </div>
  );
}

export default App;
