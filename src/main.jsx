import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Layout from "../Layout.jsx";
import Tutorial from "../Pages/Tutorial.jsx";
import Setup from "../Pages/Setup.jsx";
import Leaderboard from "../Pages/Leaderboard.jsx";
import TypingRace from "../Pages/TypingRace.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/Tutorial"
          element={
            <Layout currentPageName="Tutorial">
              <Tutorial />
            </Layout>
          }
        />
        <Route
          path="/Setup"
          element={
            <Layout currentPageName="Setup">
              <Setup />
            </Layout>
          }
        />
        <Route
          path="/Leaderboard"
          element={
            <Layout currentPageName="Leaderboard">
              <Leaderboard />
            </Layout>
          }
        />
        <Route
          path="/TypingRace"
          element={
            <Layout currentPageName="TypingRace">
              <TypingRace />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/Tutorial" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
