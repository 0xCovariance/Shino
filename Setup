import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Palette, ArrowRight, Plus, Minus } from "lucide-react";

export default function Setup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState([{ name: "" }]);
  const [theme, setTheme] = useState("");

  const difficulties = [
    { 
      id: "easy", 
      name: "Easy", 
      cards: 10, 
      description: "Simple words", 
      color: "from-green-400 to-green-500",
      bg: "from-green-100 to-green-200",
      emoji: "🟢"
    },
    { 
      id: "medium", 
      name: "Medium", 
      cards: 20, 
      description: "Medium complexity", 
      color: "from-yellow-400 to-orange-500",
      bg: "from-yellow-100 to-orange-200",
      emoji: "🟡"
    },
    { 
      id: "hard", 
      name: "Hard", 
      cards: 30, 
      description: "Complex words", 
      color: "from-red-400 to-red-500",
      bg: "from-red-100 to-red-200",
      emoji: "🔴"
    }
  ];

  const themes = [
    { id: "colors", name: "Colors", emoji: "🎨", bg: "from-pink-100 to-purple-200" },
    { id: "animals", name: "Animals", emoji: "🐾", bg: "from-green-100 to-blue-200" },
    { id: "flags", name: "Flags", emoji: "🏁", bg: "from-red-100 to-blue-200" },
    { id: "food", name: "Food", emoji: "🍕", bg: "from-yellow-100 to-orange-200" },
    { id: "sport", name: "Sports", emoji: "⚽", bg: "from-blue-100 to-green-200" },
    { id: "brands", name: "Brands", emoji: "🏢", bg: "from-purple-100 to-pink-200" }
  ];

  const updatePlayerCount = (newCount) => {
    setPlayerCount(newCount);
    const newPlayers = [...players];
    
    if (newCount > players.length) {
      for (let i = players.length; i < newCount; i++) {
        newPlayers.push({ name: "" });
      }
    } else {
      newPlayers.splice(newCount);
    }
    
    setPlayers(newPlayers);
  };

  const updatePlayerName = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = { name };
    setPlayers(newPlayers);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return difficulty !== "";
      case 2: return players.every(p => p.name.trim() !== "");
      case 3: return theme !== "";
      default: return false;
    }
  };

  const startGame = () => {
    const gameConfig = {
      difficulty,
      players,
      theme
    };
    
    navigate(`${createPageUrl("Game")}?config=${encodeURIComponent(JSON.stringify(gameConfig))}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-center mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step === stepNumber 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white' 
                  : step > stepNumber 
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                  step > stepNumber ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="text-center text-gray-600">
          Step {step} of 3: {step === 1 ? "Choose Difficulty" : step === 2 ? "Add Players" : "Select Theme"}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Difficulty Selection */}
        {step === 1 && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="clay-card p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Difficulty</h2>
              <p className="text-gray-600">Select the challenge level that's right for you</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {difficulties.map((diff) => (
                <motion.div
                  key={diff.id}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    difficulty === diff.id 
                      ? `bg-gradient-to-br ${diff.color} text-white shadow-lg` 
                      : `bg-gradient-to-br ${diff.bg} hover:shadow-md`
                  }`}
                  onClick={() => setDifficulty(diff.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{diff.emoji}</div>
                    <h3 className="text-xl font-bold mb-2">{diff.name}</h3>
                    <p className="text-sm opacity-90 mb-2">{diff.cards} cards</p>
                    <p className="text-sm opacity-75">{diff.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Player Setup */}
        {step === 2 && (
          <motion.div
            key="players"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="clay-card p-8"
          >
            <div className="text-center mb-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Add Players</h2>
              <p className="text-gray-600">Enter names for all players (1-4 players)</p>
            </div>

            {/* Player Count Selector */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                onClick={() => updatePlayerCount(Math.max(1, playerCount - 1))}
                disabled={playerCount <= 1}
                className="clay-button w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl">
                <span className="text-lg font-bold text-purple-700">{playerCount} Player{playerCount > 1 ? 's' : ''}</span>
              </div>
              
              <Button
                onClick={() => updatePlayerCount(Math.min(4, playerCount + 1))}
                disabled={playerCount >= 4}
                className="clay-button w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Player Name Inputs */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {players.map((player, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Player {index + 1} Name
                  </label>
                  <Input
                    placeholder={`Enter player ${index + 1} name`}
                    value={player.name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    className="clay-element border-0 bg-gradient-to-r from-white to-gray-50 text-center text-lg font-medium"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Theme Selection */}
        {step === 3 && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="clay-card p-8"
          >
            <div className="text-center mb-8">
              <Palette className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Theme</h2>
              <p className="text-gray-600">Pick a category for your word-picture pairs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {themes.map((themeOption) => (
                <motion.div
                  key={themeOption.id}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    theme === themeOption.id 
                      ? 'bg-gradient-to-br from-purple-400 to-blue-400 text-white shadow-lg' 
                      : `bg-gradient-to-br ${themeOption.bg} hover:shadow-md`
                  }`}
                  onClick={() => setTheme(themeOption.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{themeOption.emoji}</div>
                    <h3 className="text-xl font-bold">{themeOption.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="clay-button bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-700 px-6 py-3 disabled:opacity-50"
        >
          Previous
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="clay-button bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 disabled:opacity-50 flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={startGame}
            disabled={!canProceed()}
            className="clay-button bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white px-8 py-3 disabled:opacity-50 flex items-center gap-2 text-lg font-semibold"
          >
            Start Game!
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
