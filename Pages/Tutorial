
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Play, SkipForward, Lightbulb, Target, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLE_PAIRS = [
  { word: "Apple", image: "🍎", matched: false },
  { word: "Dog", image: "🐕", matched: false },
  { word: "Heart", image: "❤️", matched: false },
];

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [exampleCards, setExampleCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matches, setMatches] = useState(0);

  const steps = [
    {
      title: "Welcome to Memory Match! 🧠",
      content: "A fun word-picture matching game where you flip cards to find pairs!",
      icon: Lightbulb
    },
    {
      title: "How to Play 🎯",
      content: "Flip two cards at a time. If the word matches the picture, you score points! If not, they flip back.",
      icon: Target
    },
    {
      title: "Multiplayer Fun 👥",
      content: "Play with 1-4 players! Take turns and compete for the highest score.",
      icon: Users
    },
    {
      title: "Scoring System 🏆",
      content: "Earn points for each match, bonus points for winning, but lose points for wrong guesses!",
      icon: Trophy
    }
  ];

  const initializeExample = () => {
    const shuffled = [...EXAMPLE_PAIRS, ...EXAMPLE_PAIRS]
      .map((card, index) => ({
        ...card,
        id: index,
        isWord: index < 3,
        flipped: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setExampleCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setShowExample(true);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (exampleCards.find(c => c.id === cardId)?.matched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setExampleCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    ));

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = exampleCards.find(c => c.id === first);
      const secondCard = exampleCards.find(c => c.id === second);

      setTimeout(() => {
        if (firstCard.word === secondCard.word) {
          setExampleCards(prev => prev.map(card => 
            (card.id === first || card.id === second) 
              ? { ...card, matched: true } 
              : card
          ));
          setMatches(prev => prev + 1);
        } else {
          setExampleCards(prev => prev.map(card => 
            (card.id === first || card.id === second) 
              ? { ...card, flipped: false } 
              : card
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-12">
        <motion.h1 
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Memory Match Game
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Match words with pictures in this brain-training adventure!
        </motion.p>
      </div>

      {!showExample ? (
        <div className="space-y-8">
          {/* Tutorial Steps */}
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="clay-card p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button
              onClick={initializeExample}
              className="clay-button bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 text-lg font-semibold flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Try Example Game
            </Button>
            <Link to={createPageUrl("Setup")}>
              <Button className="clay-button bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white px-8 py-4 text-lg font-semibold flex items-center gap-3 w-full">
                <SkipForward className="w-5 h-5" />
                Start Playing
              </Button>
            </Link>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="clay-card p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Try the Example!</h2>
            <p className="text-gray-600">Click cards to flip them and find matching word-picture pairs</p>
            <div className="mt-4 text-lg font-semibold text-purple-600">
              Matches Found: {matches}/3
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-2xl mx-auto mb-8">
            {exampleCards.map((card) => (
              <motion.div
                key={card.id}
                className={`aspect-square clay-element cursor-pointer flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  card.matched 
                    ? 'bg-gradient-to-br from-green-200 to-green-300 cursor-default' 
                    : card.flipped 
                      ? 'bg-gradient-to-br from-blue-200 to-purple-200' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
                onClick={() => handleCardClick(card.id)}
                whileHover={{ scale: card.matched ? 1 : 1.05 }}
                whileTap={{ scale: card.matched ? 1 : 0.95 }}
              >
                {card.flipped || card.matched ? (
                  card.isWord ? card.word : card.image
                ) : (
                  "?"
                )}
              </motion.div>
            ))}
          </div>

          {matches === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-600 mb-4">
                Great job! You found all the pairs!
              </h3>
            </motion.div>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowExample(false)}
              className="clay-button bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-700 px-6 py-3"
            >
              Back to Tutorial
            </Button>
            <Link to={createPageUrl("Setup")}>
              <Button className="clay-button bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white px-6 py-3">
                Start Real Game
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
