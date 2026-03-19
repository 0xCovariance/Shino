import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Layout from "../Layout.jsx";
import DivisionGame from "../Pages/DivisionGame.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/divisiongame"
          element={
            <Layout currentPageName="DivisionGame">
              <DivisionGame />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/divisiongame" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
