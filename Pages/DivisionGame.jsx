import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, RotateCcw, ArrowRight, PartyPopper, HelpCircle, Divide } from "lucide-react";

// ─── Problem Generator ───────────────────────────────────────────────

function generateProblem(level) {
  // level 1: 2-digit ÷ 1-digit, no remainders, divisor 2-5
  // level 2: 2-digit ÷ 1-digit, no remainders, divisor 2-9
  // level 3: 3-digit ÷ 1-digit, no remainders, divisor 2-9
  let divisor, quotient, dividend;

  if (level === 1) {
    divisor = randomInt(2, 5);
    quotient = randomInt(11, 33);
    dividend = divisor * quotient;
    // ensure 2-digit
    while (dividend < 10 || dividend > 99) {
      quotient = randomInt(11, 33);
      dividend = divisor * quotient;
    }
  } else if (level === 2) {
    divisor = randomInt(2, 9);
    quotient = randomInt(11, Math.floor(99 / divisor));
    dividend = divisor * quotient;
    while (dividend < 10 || dividend > 99) {
      quotient = randomInt(11, Math.floor(99 / divisor));
      dividend = divisor * quotient;
    }
  } else {
    divisor = randomInt(2, 9);
    quotient = randomInt(101, Math.floor(999 / divisor));
    dividend = divisor * quotient;
    while (dividend < 100 || dividend > 999) {
      quotient = randomInt(101, Math.floor(999 / divisor));
      dividend = divisor * quotient;
    }
  }

  return { dividend, divisor, quotient };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Compute the step-by-step working for bus stop method ────────────

function computeSteps(dividend, divisor) {
  const digits = String(dividend).split("").map(Number);
  const steps = [];
  let carry = 0;

  for (let i = 0; i < digits.length; i++) {
    const working = carry * 10 + digits[i];
    const result = Math.floor(working / divisor);
    const remainder = working - result * divisor;
    steps.push({
      digitIndex: i,
      digit: digits[i],
      carry,
      working,       // the number we divide into
      result,        // the answer digit
      remainder,     // what's left over
    });
    carry = remainder;
  }
  return steps;
}

// ─── Encouragement messages ──────────────────────────────────────────

const PRAISE = [
  "Brilliant!",
  "Well done!",
  "You got it!",
  "Superstar!",
  "Amazing!",
  "Fantastic!",
  "Great job!",
  "Perfect!",
];

function randomPraise() {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)];
}

// ─── Main Component ──────────────────────────────────────────────────

export default function DivisionGame() {
  const [screen, setScreen] = useState("menu"); // menu | playing | done
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState("ask"); // ask | feedback
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // { correct, message }
  const [totalProblems] = useState(5);
  const [problemIndex, setProblemIndex] = useState(0);
  const inputRef = useRef(null);

  // Start a new problem
  const startProblem = useCallback((lvl) => {
    const p = generateProblem(lvl);
    const s = computeSteps(p.dividend, p.divisor);
    setProblem(p);
    setSteps(s);
    setCurrentStep(0);
    setSubStep("ask");
    setUserInput("");
    setFeedback(null);
    setShowHint(false);
  }, []);

  const startGame = useCallback((lvl) => {
    setLevel(lvl);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setProblemIndex(0);
    setScreen("playing");
    startProblem(lvl);
  }, [startProblem]);

  // Focus input when step changes
  useEffect(() => {
    if (inputRef.current && subStep === "ask") {
      inputRef.current.focus();
    }
  }, [currentStep, subStep]);

  // The current step data
  const step = steps[currentStep] || null;
  const digits = problem ? String(problem.dividend).split("").map(Number) : [];

  // Build the answer row so far
  const answeredDigits = useMemo(() => {
    if (!steps.length) return [];
    return steps.slice(0, currentStep).map((s) => s.result);
  }, [steps, currentStep]);

  // Handle answer submission
  const handleSubmit = useCallback(() => {
    if (!step) return;
    const parsed = parseInt(userInput, 10);
    const correct = parsed === step.result;

    if (correct) {
      const newStreak = streak + 1;
      const bonus = newStreak >= 3 ? 2 : 1;
      setScore((s) => s + bonus);
      setStreak(newStreak);
      setFeedback({ correct: true, message: randomPraise() + (bonus > 1 ? " Streak bonus!" : "") });
    } else {
      setStreak(0);
      setFeedback({
        correct: false,
        message: `Not quite! ${step.working} \u00F7 ${problem.divisor} = ${step.result}`,
      });
    }
    setSubStep("feedback");
  }, [step, userInput, streak, problem]);

  // Move to next step or next problem
  const handleNext = useCallback(() => {
    if (currentStep + 1 < steps.length) {
      setCurrentStep((c) => c + 1);
      setSubStep("ask");
      setUserInput("");
      setFeedback(null);
      setShowHint(false);
    } else {
      // Problem complete
      const nextIdx = problemIndex + 1;
      setQuestionsAnswered((q) => q + 1);
      if (nextIdx >= totalProblems) {
        setScreen("done");
      } else {
        setProblemIndex(nextIdx);
        startProblem(level);
      }
    }
  }, [currentStep, steps, problemIndex, totalProblems, startProblem, level]);

  // Key handler for input
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (subStep === "ask" && userInput.trim() !== "") {
          handleSubmit();
        } else if (subStep === "feedback") {
          handleNext();
        }
      }
    },
    [subStep, userInput, handleSubmit, handleNext]
  );

  // ─── Render: Menu ────────────────────────────────────────────────
  if (screen === "menu") {
    return (
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 clay-element">
            <Divide className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-3">
            Bus Stop Division
          </h1>
          <p className="text-gray-600 text-lg">
            Learn long division step by step!
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clay-card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">How does the bus stop method work?</h2>
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 mb-4">
            <div className="font-mono text-2xl text-center text-gray-800 leading-relaxed">
              <div className="flex items-center justify-center gap-1">
                <span className="text-gray-400 text-lg mr-2">answer goes here →</span>
                <span className="inline-block w-8 text-center border-b-0">3</span>
                <span className="inline-block w-8 text-center border-b-0">2</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-purple-600 font-bold mr-1">3</span>
                <span className="text-gray-400 mx-1">)</span>
                <span className="inline-block w-8 text-center border-t-4 border-gray-800">9</span>
                <span className="inline-block w-8 text-center border-t-4 border-gray-800">6</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-gray-700 text-sm">
            <p><strong>Step 1:</strong> How many times does 3 go into 9? → <strong>3</strong> (write it on top)</p>
            <p><strong>Step 2:</strong> How many times does 3 go into 6? → <strong>2</strong> (write it on top)</p>
            <p>Answer: <strong>96 ÷ 3 = 32</strong></p>
          </div>
        </motion.div>

        {/* Level selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clay-card p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pick your level</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                lvl: 1,
                name: "Starter",
                desc: "2 digits ÷ small numbers",
                example: "e.g. 84 ÷ 4",
                color: "from-green-400 to-emerald-500",
                bg: "from-green-100 to-emerald-200",
                emoji: "🌱",
              },
              {
                lvl: 2,
                name: "Explorer",
                desc: "2 digits ÷ any single digit",
                example: "e.g. 72 ÷ 8",
                color: "from-blue-400 to-indigo-500",
                bg: "from-blue-100 to-indigo-200",
                emoji: "🚀",
              },
              {
                lvl: 3,
                name: "Champion",
                desc: "3 digits ÷ any single digit",
                example: "e.g. 432 ÷ 6",
                color: "from-purple-400 to-pink-500",
                bg: "from-purple-100 to-pink-200",
                emoji: "🏆",
              },
            ].map((opt) => (
              <motion.button
                key={opt.lvl}
                onClick={() => startGame(opt.lvl)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${opt.bg} hover:shadow-lg transition-all duration-300 text-left`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="text-3xl mb-3">{opt.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{opt.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{opt.desc}</p>
                <p className="text-xs text-gray-500 italic">{opt.example}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Render: Playing ─────────────────────────────────────────────
  if (screen === "playing" && problem && step) {
    const isLastStep = currentStep === steps.length - 1;
    const isLastProblem = problemIndex === totalProblems - 1;

    return (
      <div className="max-w-3xl mx-auto px-6">
        {/* Top bar: score + progress */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="clay-card px-4 py-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-700">{score}</span>
            </div>
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full text-sm font-bold"
              >
                {streak}x streak!
              </motion.div>
            )}
          </div>
          <div className="text-gray-500 text-sm font-medium">
            Problem {problemIndex + 1} of {totalProblems}
          </div>
        </div>

        {/* Bus stop visual */}
        <motion.div
          key={`problem-${problemIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-card p-8 mb-6"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="font-mono text-4xl md:text-5xl select-none">
              {/* Answer row */}
              <div className="flex items-end justify-center" style={{ marginLeft: "3rem" }}>
                {digits.map((_, i) => {
                  const answered = i < currentStep;
                  const isCurrent = i === currentStep && subStep === "feedback" && feedback?.correct;
                  const showDigit = answered || isCurrent;
                  return (
                    <motion.span
                      key={i}
                      className="inline-block w-12 md:w-14 text-center"
                      initial={isCurrent ? { scale: 1.4, color: "#22c55e" } : {}}
                      animate={isCurrent ? { scale: 1, color: "#1f2937" } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {showDigit ? steps[i].result : (
                        <span className="text-gray-300">_</span>
                      )}
                    </motion.span>
                  );
                })}
              </div>

              {/* Divisor ) dividend row */}
              <div className="flex items-center justify-center">
                <span className="text-purple-600 font-bold mr-1">
                  {problem.divisor}
                </span>
                <span className="text-gray-400 mx-1">)</span>
                {digits.map((d, i) => (
                  <span
                    key={i}
                    className={`inline-block w-12 md:w-14 text-center border-t-4 ${
                      i === currentStep
                        ? "border-orange-400 text-orange-600 font-bold"
                        : "border-gray-800 text-gray-800"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Working-out area */}
          <AnimatePresence mode="wait">
            {subStep === "ask" && (
              <motion.div
                key="ask"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-lg text-gray-700 mb-4">
                  {step.carry > 0 ? (
                    <>
                      We carry <strong className="text-purple-600">{step.carry}</strong> from before, so we have{" "}
                      <strong className="text-orange-600">{step.working}</strong>.
                      <br />
                      How many times does <strong className="text-purple-600">{problem.divisor}</strong> go
                      into <strong className="text-orange-600">{step.working}</strong>?
                    </>
                  ) : (
                    <>
                      How many times does <strong className="text-purple-600">{problem.divisor}</strong> go
                      into <strong className="text-orange-600">{step.working}</strong>?
                    </>
                  )}
                </p>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <input
                    ref={inputRef}
                    type="number"
                    min="0"
                    max="9"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-20 h-16 text-3xl text-center font-bold rounded-2xl border-3 border-purple-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all bg-white"
                    autoFocus
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={userInput.trim() === ""}
                    className="clay-button bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-4 text-lg disabled:opacity-50"
                  >
                    Check
                  </Button>
                </div>

                {/* Hint button */}
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
                >
                  <HelpCircle className="w-4 h-4" />
                  {showHint ? "Hide hint" : "Need a hint?"}
                </button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-3 bg-yellow-50 rounded-xl text-sm text-yellow-800"
                  >
                    Think: {problem.divisor} × ? = {step.working}
                    <br />
                    Try counting up: {problem.divisor}, {problem.divisor * 2}, {problem.divisor * 3}...
                    What gets you closest to {step.working} without going over?
                  </motion.div>
                )}
              </motion.div>
            )}

            {subStep === "feedback" && feedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div
                  className={`inline-block px-6 py-3 rounded-2xl mb-4 text-lg font-bold ${
                    feedback.correct
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {feedback.message}
                </div>

                {/* Show the working */}
                <div className="text-gray-600 text-sm mb-4">
                  {step.working} ÷ {problem.divisor} = <strong>{step.result}</strong>
                  {step.remainder > 0 && (
                    <> remainder <strong className="text-purple-600">{step.remainder}</strong> (carry it to the next digit)</>
                  )}
                </div>

                <Button
                  onClick={handleNext}
                  onKeyDown={handleKeyDown}
                  className="clay-button bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white px-6 py-3 flex items-center gap-2 mx-auto"
                  autoFocus
                >
                  {isLastStep
                    ? isLastProblem
                      ? "See results!"
                      : "Next problem"
                    : "Next digit"
                  }
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalProblems }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < problemIndex
                  ? "bg-green-400"
                  : i === problemIndex
                  ? "bg-purple-400 scale-125"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── Render: Done ────────────────────────────────────────────────
  if (screen === "done") {
    const maxScore = totalProblems * 3; // rough max (with streaks)
    const percentage = Math.round((score / (totalProblems * 2)) * 100);
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;

    return (
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="clay-card p-10 text-center"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {stars === 3 ? "🏆" : stars === 2 ? "🌟" : "👏"}
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {stars === 3 ? "Amazing work!" : stars === 2 ? "Great effort!" : "Good try!"}
          </h2>

          <p className="text-gray-600 mb-6">
            You completed {totalProblems} division problems!
          </p>

          {/* Stars display */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + s * 0.2 }}
              >
                <Star
                  className={`w-12 h-12 ${
                    s <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Score breakdown */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Points earned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500">
                  {["Starter", "Explorer", "Champion"][level - 1]}
                </div>
                <div className="text-sm text-gray-600">Level played</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => startGame(level)}
              className="clay-button bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play again
            </Button>
            <Button
              onClick={() => setScreen("menu")}
              className="clay-button bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-3"
            >
              Change level
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
