import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Brain, Trophy, Home } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-50">
      <style>
        {`
          :root {
            --clay-lavender: #E8D5FF;
            --clay-mint: #B8F2D0;
            --clay-blue: #AED6F1;
            --clay-peach: #FFD6CC;
            --clay-cream: #FFF8E7;
            --clay-purple: #D4B6FF;
            --clay-shadow: rgba(0, 0, 0, 0.1);
            --clay-inner-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            --clay-outer-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          }
          
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .clay-element {
            border-radius: 20px;
            box-shadow: var(--clay-outer-shadow), var(--clay-inner-shadow);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .clay-button {
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
            border: none;
            position: relative;
            overflow: hidden;
          }
          
          .clay-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
          
          .clay-button:active {
            transform: translateY(0px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .clay-card {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
            backdrop-filter: blur(10px);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
      
      {/* Navigation Header */}
      <nav className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl("Tutorial")} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center clay-element">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Memory Match
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            {currentPageName !== "Tutorial" && (
              <Link 
                to={createPageUrl("Tutorial")} 
                className="clay-button bg-gradient-to-r from-purple-200 to-blue-200 hover:from-purple-300 hover:to-blue-300 px-6 py-3 flex items-center gap-2 text-purple-700 font-medium"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            )}
            {currentPageName !== "Leaderboard" && (
              <Link 
                to={createPageUrl("Leaderboard")} 
                className="clay-button bg-gradient-to-r from-yellow-200 to-orange-200 hover:from-yellow-300 hover:to-orange-300 px-6 py-3 flex items-center gap-2 text-orange-700 font-medium"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="pb-8">
        {children}
      </main>
    </div>
  );
}
