import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";

/* ===================== Types ===================== */

interface FallingWord {
  id: number;
  word: string;
  startsWithAlef: boolean;
  x: number;
  speed: number;
}

interface WordCatchConfig {
  correctWords: string[];
  wrongWords: string[];
  maxMistakes: number;
  scorePerCorrect: number;
  spawnIntervalMs: number;
  minSpeed: number;
  maxSpeed: number;
  instruction: string;
}

/* ===================== Toast ===================== */

function MistakeToast({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <motion.div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg border-4 text-xl"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#ef4444",
        color: "#ef4444",
      }}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
    >
      {text}
    </motion.div>
  );
}

/* ===================== Game ===================== */

export function WordCatchGame() {
  /* ---------- State ---------- */
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [words, setWords] = useState<FallingWord[]>([]);
  const [nextId, setNextId] = useState(0);

  const [mistakeText, setMistakeText] = useState<string | null>(null);
  const [config, setConfig] = useState<WordCatchConfig | null>(null);
  const [gameLessonId, setGameLessonId] = useState<number | null>(null);

  const [startTime] = useState(Date.now());

  /* ---------- Constants ---------- */
  const MAX_MISTAKES = 3;
  const MAX_CORRECT_WORDS = 10;

  /* ---------- Router / Redux ---------- */
  const { letter } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { letters } = useSelector((state: RootState) => state.letters);
  const currentLetter = letters.find((l) => l.symbol === letter);
  const letterId = currentLetter?.id;

  /* ---------- Helpers ---------- */

  const getDuration = () =>
    Math.floor((Date.now() - startTime) / 1000);

  const getSpeedMultiplier = (count: number) => {
    if (count < 3) return 1;
    if (count < 6) return 1.2;
    if (count < 9) return 1.4;
    return 1.6;
  };

  const triggerMistake = () => {
    setMistakes((prev) => {
      const next = prev + 1;

      setMistakeText(`خطأ ❌ ${next} / ${MAX_MISTAKES}`);
      setTimeout(() => setMistakeText(null), 1200);

      if (next >= MAX_MISTAKES) {
        setGameOver(true);
      }

      return next;
    });
  };

  const resetGame = () => {
    setScore(0);
    setMistakes(0);
    setCorrectCount(0);
    setWords([]);
    setNextId(0);
    setGameOver(false);
  };

  /* ---------- Effects ---------- */

  // Fetch letters
  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);

  // Fetch game config
  useEffect(() => {
    if (!letter || !letterId) return;

    const fetchConfig = async () => {
      try {
        const res = await api.get(
          "/lessons/games-lessons/by-letter-and-type",
          {
            params: { letter, gameType: "word_catch" },
          }
        );

        setGameLessonId(res.data.data.game_lesson_id);
        setConfig(res.data.data.data);
      } catch (err) {
        console.error("Error fetching game config", err);
      }
    };

    fetchConfig();
  }, [letter, letterId]);

  // Spawn words
  useEffect(() => {
    if (!config || gameOver) return;

    const interval = setInterval(() => {
      const allWords = [
        ...config.correctWords.map((w) => ({
          word: w,
          startsWithAlef: true,
        })),
        ...config.wrongWords.map((w) => ({
          word: w,
          startsWithAlef: false,
        })),
      ];

      const randomWord =
        allWords[Math.floor(Math.random() * allWords.length)];

      const multiplier = getSpeedMultiplier(correctCount);

      setWords((prev) => [
        ...prev,
        {
          id: nextId,
          word: randomWord.word,
          startsWithAlef: randomWord.startsWithAlef,
          x: Math.random() * 80 + 10,
          speed:
            (Math.random() *
              (config.maxSpeed - config.minSpeed) +
              config.minSpeed) /
            multiplier,
        },
      ]);

      setNextId((id) => id + 1);
    }, config.spawnIntervalMs);

    return () => clearInterval(interval);
  }, [config, gameOver, correctCount, nextId]);

  // Save result on game over
  useEffect(() => {
    if (!gameOver || !gameLessonId) return;

    saveGameResult({
      games_lessons_id: gameLessonId,
      score,
      duration: getDuration(),
    }).catch(console.error);
  }, [gameOver, gameLessonId]);

  /* ---------- Handlers ---------- */

  const handleWordClick = (word: FallingWord) => {
    if (word.startsWithAlef) {
      setScore((s) => s + config!.scorePerCorrect);

      setCorrectCount((c) => {
        const next = c + 1;
        if (next >= MAX_CORRECT_WORDS) setGameOver(true);
        return next;
      });

      setWords((prev) => prev.filter((w) => w.id !== word.id));
    } else {
      triggerMistake();
    }
  };

  const handleWordMiss = (wordId: number) => {
    const missed = words.find((w) => w.id === wordId);

    if (missed?.startsWithAlef) {
      triggerMistake();
    }

    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  /* ---------- Loading ---------- */

  if (!config) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>جاري تحميل اللعبة...</p>
      </div>
    );
  }

  /* ---------- Render ---------- */

  return (
    <div
      className="h-screen relative overflow-hidden"
      dir="rtl"
      style={{ backgroundColor: "#faf9f6" }}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-30 px-6 py-4 border-b-4"
        style={{ borderColor: "#652b82", backgroundColor: "#ffffff" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/letter/${letter}/games`)}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg"
              style={{ backgroundColor: "#fad656" }}
            >
              <Star className="w-6 h-6" style={{ color: "#652b82" }} />
              <span className="text-xl" style={{ color: "#652b82" }}>
                {score}
              </span>
            </div>

            <div
              className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg"
              style={{
                backgroundColor: mistakes >= 3 ? "#ef4444" : "#ffffff",
              }}
            >
              <span
                className="text-xl"
                style={{
                  color: mistakes >= 3 ? "#ffffff" : "#ef4444",
                }}
              >
                أخطاء: {mistakes}/{config.maxMistakes}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-24 pb-8">
        <div className="max-w-6xl mx-auto h-full relative">
          <AnimatePresence>
            {words.map((word) => (
              <motion.button
                key={word.id}
                initial={{ y: -100 }}
                animate={{ y: window.innerHeight }}
                transition={{ duration: word.speed * 5, ease: "linear" }}
                onAnimationComplete={() => handleWordMiss(word.id)}
                onClick={() => handleWordClick(word)}
                className="absolute px-8 py-4 rounded-3xl shadow-2xl text-2xl cursor-pointer border-4"
                style={{
                  left: `${word.x}%`,
                  transform: "translateX(-50%)",
                  backgroundColor: "#ffffff",
                  borderColor: word.startsWithAlef
                    ? "#fad656"
                    : "#e5e5e5",
                  color: "#652b82",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {word.word}
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Instruction */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-3xl px-8 py-4 shadow-xl border-4"
            style={{ borderColor: "#652b82" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl" style={{ color: "#652b82" }}>
              {config.instruction}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mistake Toast */}
      <AnimatePresence>
        <MistakeToast text={mistakeText} />
      </AnimatePresence>

      {/* Game Over */}
      {gameOver && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-12 shadow-2xl border-4 max-w-md mx-4 text-center"
            style={{ borderColor: "#fad656" }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            <Award
              className="w-24 h-24 mx-auto mb-4"
              style={{ color: "#fad656" }}
            />

            <h2 className="text-4xl mb-3" style={{ color: "#652b82" }}>
              انتهت اللعبة!
            </h2>

            <p className="text-2xl text-gray-700 mb-6">
              نقاطك: {score}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl shadow-lg text-white text-xl"
                style={{ backgroundColor: "#652b82" }}
              >
                <RotateCcw className="w-6 h-6" />
                <span>العب مرة أخرى</span>
              </button>

              <button
                onClick={() =>
                  navigate(`/letter/${letter}/games`)
                }
                className="px-8 py-4 rounded-2xl shadow-lg text-xl"
                style={{
                  backgroundColor: "#fad656",
                  color: "#652b82",
                }}
              >
                رجوع
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
