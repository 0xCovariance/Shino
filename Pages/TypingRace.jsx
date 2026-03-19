
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Keyboard, RotateCcw, Home, Trophy, Zap, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const WORD_LISTS = {
  easy: [
    "cat", "dog", "sun", "run", "hat", "big", "red", "cup", "top", "hop",
    "bat", "map", "pig", "log", "bug", "net", "van", "zip", "jam", "pan",
    "bed", "ten", "fox", "mix", "box", "hug", "mud", "fun", "sit", "win"
  ],
  medium: [
    "apple", "robot", "tiger", "lemon", "beach", "cloud", "happy", "dance",
    "piano", "candy", "green", "flame", "truck", "smile", "world", "grape",
    "magic", "storm", "brave", "light", "melon", "jolly", "crisp", "bloom",
    "swift", "charm", "frost", "glow", "ocean", "train"
  ],
  hard: [
    "dolphin", "rainbow", "penguin", "volcano", "giraffe", "lantern",
    "picture", "blanket", "chicken", "problem", "kitchen", "monster",
    "balloon", "thunder", "captain", "diamond", "feather", "harvest",
    "compass", "mystery", "journey", "quarter", "library", "pumpkin",
    "shuttle", "unicorn", "pretzel", "whistle", "crystal", "chapter"
  ]
};

const GAME_DURATION = 60;
const SPAWN_INTERVAL_BASE = 2200;
const WORD_SPEED_BASE = 0.4;

function FallingWord({ word, x, y, isActive, isCompleted }) {
  return (
    <motion.div
      className={`absolute px-4 py-2 rounded-2xl font-bold text-lg md:text-xl whitespace-nowrap select-none
        ${isCompleted
          ? "bg-gradient-to-r from-green-300 to-emerald-300 text-green-800 scale-110"
          : isActive
            ? "bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 ring-4 ring-orange-300 ring-opacity-60"
            : "bg-gradient-to-r from-purple-200 to-blue-200 text-purple-800"
        }`}
      style={{
        left: `${x}%`,
        top: `${y}px`,
        boxShadow: isActive
          ? "0 8px 25px rgba(251, 146, 60, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
          : "0 6px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: isCompleted ? 1.3 : 1 }}
      exit={{ opacity: 0, scale: 0.3, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {word.text.split("").map((char, i) => (
        <span
          key={i}
          className={
            i < word.typedCount
              ? "text-green-600 font-extrabold"
              : ""
          }
        >
          {char}
        </span>
      ))}
    </motion.div>
  );
}

export default function TypingRace() {
  const [gameState, setGameState] = useState("menu"); // menu, playing, finished
  const [difficulty, setDifficulty] = useState("easy");
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wordsMissed, setWordsMissed] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [showComboPopup, setShowComboPopup] = useState(false);

  const inputRef = useRef(null);
  const gameAreaRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const wordIdRef = useRef(0);
  const wordsRef = useRef(words);
  const gameStateRef = useRef(gameState);
  const difficultyRef = useRef(difficulty);
  const timeLeftRef = useRef(timeLeft);

  wordsRef.current = words;
  gameStateRef.current = gameState;
  difficultyRef.current = difficulty;
  timeLeftRef.current = timeLeft;

  const getRandomWord = useCallback(() => {
    const list = WORD_LISTS[difficultyRef.current];
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  const spawnWord = useCallback(() => {
    const text = getRandomWord();
    const id = wordIdRef.current++;
    const x = 5 + Math.random() * 70;
    return {
      id,
      text,
      x,
      y: -40,
      typedCount: 0,
      completed: false,
      speed: WORD_SPEED_BASE + (GAME_DURATION - timeLeftRef.current) * 0.005
    };
  }, [getRandomWord]);

  const gameLoop = useCallback((timestamp) => {
    if (gameStateRef.current !== "playing") return;

    const elapsed = GAME_DURATION - timeLeftRef.current;
    const spawnInterval = Math.max(800, SPAWN_INTERVAL_BASE - elapsed * 20);

    if (timestamp - lastSpawnRef.current > spawnInterval) {
      lastSpawnRef.current = timestamp;
      const newWord = spawnWord();
      setWords(prev => [...prev, newWord]);
    }

    const gameHeight = gameAreaRef.current?.clientHeight || 500;

    setWords(prev => {
      let missed = 0;
      const updated = prev
        .map(w => ({
          ...w,
          y: w.completed ? w.y : w.y + w.speed
        }))
        .filter(w => {
          if (w.y > gameHeight + 20 && !w.completed) {
            missed++;
            return false;
          }
          if (w.completed && w.y < -50) return false;
          return true;
        });

      if (missed > 0) {
        setWordsMissed(prev => prev + missed);
        setCombo(0);
      }
      return updated;
    });

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [spawnWord]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing") {
      animFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const startGame = (diff) => {
    setDifficulty(diff);
    difficultyRef.current = diff;
    setWords([]);
    setInput("");
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(GAME_DURATION);
    setWordsTyped(0);
    setWordsMissed(0);
    setTotalChars(0);
    wordIdRef.current = 0;
    lastSpawnRef.current = 0;
    setGameState("playing");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInput = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setInput(value);

    if (!value) {
      setWords(prev => prev.map(w => ({ ...w, typedCount: 0 })));
      return;
    }

    setWords(prev => {
      const updated = prev.map(w => {
        if (w.completed) return w;
        if (w.text.startsWith(value)) {
          return { ...w, typedCount: value.length };
        }
        return { ...w, typedCount: 0 };
      });

      const completedWord = updated.find(
        w => !w.completed && w.text === value
      );

      if (completedWord) {
        const newCombo = combo + 1;
        const comboBonus = Math.floor(newCombo / 3) * 5;
        const wordPoints = completedWord.text.length * 10 + comboBonus;

        setScore(prev => prev + wordPoints);
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));
        setWordsTyped(prev => prev + 1);
        setTotalChars(prev => prev + completedWord.text.length);
        setInput("");

        if (newCombo > 0 && newCombo % 3 === 0) {
          setShowComboPopup(true);
          setTimeout(() => setShowComboPopup(false), 1000);
        }

        return updated.map(w =>
          w.id === completedWord.id
            ? { ...w, completed: true, typedCount: w.text.length }
            : w
        );
      }

      return updated;
    });
  };

  const accuracy = wordsTyped + wordsMissed > 0
    ? Math.round((wordsTyped / (wordsTyped + wordsMissed)) * 100)
    : 0;

  const wpm = GAME_DURATION - timeLeft > 0
    ? Math.round((totalChars / 5) / ((GAME_DURATION - timeLeft) / 60))
    : 0;

  // MENU SCREEN
  if (gameState === "menu") {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⌨️ Typing Race
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Type the falling words before they reach the bottom!
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              level: "easy",
              label: "Easy",
              emoji: "🐣",
              desc: "Short 3-letter words",
              colors: "from-green-300 to-emerald-300",
              hoverColors: "hover:from-green-400 hover:to-emerald-400",
              textColor: "text-green-800"
            },
            {
              level: "medium",
              label: "Medium",
              emoji: "🔥",
              desc: "5-letter words",
              colors: "from-yellow-300 to-orange-300",
              hoverColors: "hover:from-yellow-400 hover:to-orange-400",
              textColor: "text-orange-800"
            },
            {
              level: "hard",
              label: "Hard",
              emoji: "🚀",
              desc: "7-letter words",
              colors: "from-red-300 to-pink-300",
              hoverColors: "hover:from-red-400 hover:to-pink-400",
              textColor: "text-red-800"
            }
          ].map((opt, i) => (
            <motion.div
              key={opt.level}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <button
                onClick={() => startGame(opt.level)}
                className={`w-full clay-card p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95`}
              >
                <div className="text-5xl mb-4">{opt.emoji}</div>
                <h3 className={`text-2xl font-bold mb-2 ${opt.textColor}`}>{opt.label}</h3>
                <p className="text-gray-600 mb-4">{opt.desc}</p>
                <div className={`clay-button bg-gradient-to-r ${opt.colors} ${opt.hoverColors} px-6 py-3 ${opt.textColor} font-bold inline-block rounded-2xl`}>
                  Play!
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="clay-card p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-bold text-gray-700 mb-3">How to Play</h3>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            <span>⬇️ Words fall down</span>
            <span>⌨️ Type them fast</span>
            <span>🔥 Build combos</span>
            <span>⭐ Beat your score!</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (gameState === "finished") {
    const grade =
      score >= 500 ? { emoji: "🏆", label: "Typing Champion!", color: "from-yellow-400 to-orange-400" } :
      score >= 300 ? { emoji: "🌟", label: "Super Typer!", color: "from-purple-400 to-blue-400" } :
      score >= 150 ? { emoji: "👍", label: "Nice Job!", color: "from-green-400 to-teal-400" } :
      { emoji: "💪", label: "Keep Practicing!", color: "from-blue-400 to-indigo-400" };

    return (
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          className="clay-card p-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {grade.emoji}
          </motion.div>
          <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${grade.color} bg-clip-text text-transparent`}>
            {grade.label}
          </h1>
          <p className="text-gray-500 mb-8">Time's up! Here's how you did:</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Score", value: score, icon: "⭐" },
              { label: "Words Typed", value: wordsTyped, icon: "✅" },
              { label: "Words Missed", value: wordsMissed, icon: "❌" },
              { label: "Accuracy", value: `${accuracy}%`, icon: "🎯" },
              { label: "Best Combo", value: `${maxCombo}x`, icon: "🔥" },
              { label: "Speed (WPM)", value: wpm, icon: "⚡" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="clay-card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => startGame(difficulty)}
              className="clay-button bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </Button>
            <Button
              onClick={() => setGameState("menu")}
              className="clay-button bg-gradient-to-r from-purple-300 to-blue-300 hover:from-purple-400 hover:to-blue-400 text-purple-800 px-8 py-4 text-lg font-semibold flex items-center gap-2"
            >
              <Keyboard className="w-5 h-5" />
              Change Difficulty
            </Button>
            <Link to={createPageUrl("Tutorial")}>
              <Button className="clay-button bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-8 py-4 text-lg font-semibold flex items-center gap-2 w-full">
                <Home className="w-5 h-5" />
                Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // GAME SCREEN
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="clay-card px-5 py-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-xl font-bold text-gray-800">{score}</span>
          </div>
          <div className="clay-card px-5 py-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className={`text-xl font-bold ${combo >= 3 ? "text-orange-600" : "text-gray-800"}`}>
              {combo}x
            </span>
          </div>
        </div>
        <div className={`clay-card px-5 py-3 flex items-center gap-2 ${timeLeft <= 10 ? "ring-2 ring-red-300" : ""}`}>
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? "text-red-500" : "text-blue-500"}`} />
          <span className={`text-xl font-bold ${timeLeft <= 10 ? "text-red-600" : "text-gray-800"}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="clay-card relative overflow-hidden mb-4"
        style={{ height: "400px" }}
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {words.map(word => (
            <FallingWord
              key={word.id}
              word={word}
              x={word.x}
              y={word.y}
              isActive={!word.completed && word.typedCount > 0}
              isCompleted={word.completed}
            />
          ))}
        </AnimatePresence>

        {/* Combo popup */}
        <AnimatePresence>
          {showComboPopup && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-orange-500 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 2, y: -40 }}
              style={{ textShadow: "0 4px 12px rgba(251, 146, 60, 0.4)" }}
            >
              🔥 {combo}x COMBO!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom danger zone */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-300 via-red-400 to-red-300 opacity-60 rounded-b-3xl" />
      </div>

      {/* Input */}
      <div className="clay-card p-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type the words here..."
          autoFocus
          className="w-full text-center text-2xl font-bold bg-transparent outline-none text-gray-800 placeholder-gray-400"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
