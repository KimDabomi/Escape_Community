import React from 'react';
import { Routes, Route } from 'react-router';
import EscapeTable from './components/EscapeTable.js'; 
import PostWrite from './components/PostWrite.js';

function App() {
  return (
    <div>
      <Routes>
        {/* 메인 */}
        <Route path="/" exapt={true} element={<EscapeTable />} />
        {/* 글쓰기 */}
        <Route path="/write" element={<PostWrite />} />
      </Routes>
    </div>
  );
}

export default App;
