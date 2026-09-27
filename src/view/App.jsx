import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainTemplate from "./MainTemplate";
import Home from "./Home";

function App() {
  return (
    <Router>
      <MainTemplate>
        <Routes>
          <Route path="/" element={<Navigate to="/HomeWhite" replace />} />
          <Route path="/HomeWhite" element={<Home />} />
        </Routes>
      </MainTemplate>
    </Router>
  );
}

export default App;