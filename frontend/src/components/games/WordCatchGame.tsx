import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import tigerImg from "../../assets/catch_tiger.svg";
import stars from "../../assets/Star.svg";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";
import { GameLoadingScreen } from "./WordCatchWelcom";
import vectorEnd from "../../assets/vector_end.svg";
import badegEnd from "../../assets/badeg_end.svg";
import restart from "../../assets/Repeat.svg"
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

function FallingBubble({
  word,
  onComplete,
  onClick,
}: {
  word: FallingWord;
  onComplete: () => void;
  onClick: () => void;
}) {
  const duration = word.speed * 10;

  const fallHeight =
    typeof window !== "undefined" ? window.innerHeight + 100 : 900;

  return (
    <div
      className="absolute top-0"
      style={{
        left: `${word.x}%`,
        transform: "translateX(-50%)",
      }}
    >
      <motion.button
        initial={{ y: -60, scale: 1.15, opacity: 1 }}
        animate={{
          y: fallHeight,
          scale: 0,
          opacity: 0,
        }}
        transition={{
          duration,
          ease: "linear",
        }}
        onAnimationComplete={onComplete}
        onClick={onClick}
        className="flex items-center justify-center cursor-pointer rounded-full border-2 aspect-square min-w-[5rem] min-h-[5rem] p-3 shadow-sm"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#FFB600",
          color: "#28345F",
          fontSize: "clamp(1rem, 2.5vw, 1.75rem)",
          fontFamily: "inherit",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {word.word}
      </motion.button>
    </div>
  );
}

// function MistakeToast({ text }: { text: string | null }) {
//   if (!text) return null;

//   return (
//     <motion.div
//       className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg border-4 text-xl"
//       style={{
//         backgroundColor: "#ffffff",
//         borderColor: "#ef4444",
//         color: "#ef4444",
//       }}
//       initial={{ opacity: 0, y: -10, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: -10, scale: 0.95 }}
//     >
//       {text}
//     </motion.div>
//   );
// }

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
  const [minLoadElapsed, setMinLoadElapsed] = useState(false);
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

  const getDuration = () => Math.floor((Date.now() - startTime) / 1000);

  const getSpeedMultiplier = (count: number) => {
    if (count < 3) return 1;
    if (count < 6) return 1.2;
    if (count < 9) return 1.4;
    return 1.6;
  };

  const triggerMistake = () => {
    setMistakes((prev) => {
      if (prev >= MAX_MISTAKES) return prev;
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
  // Minimum loader duration (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadElapsed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

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
        const res = await api.get("/lessons/games-lessons/by-letter-and-type", {
          params: { letter, gameType: "word_catch" },
        });

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

      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];

      const multiplier = getSpeedMultiplier(correctCount);

      setWords((prev) => [
        ...prev,
        {
          id: nextId,
          word: randomWord.word,
          startsWithAlef: randomWord.startsWithAlef,
          x: Math.random() * 80 + 10,
          speed:
            (Math.random() * (config.maxSpeed - config.minSpeed) +
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

  if (!config || !minLoadElapsed) {
    return <GameLoadingScreen  game_name={"catchWord"}/>;
  }

  /* ---------- Render ---------- */

  return (
    <div
      className="h-screen relative overflow-hidden"
      dir="rtl"
      style={{
        background: "linear-gradient(120deg, #FAF6E6 30%, #FAF9F6 100%)",
      }}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-30 px-4 py-3"
        style={{
          background: "linear-gradient(120deg, #FAF6E6 30%, #FAF9F6 100%)",
          borderBottom: "10px solid white",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Close */}
          <button
            onClick={() => navigate(`/letter/${letter}/games`)}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#FFA199", color: "black" }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Instruction */}
          <p
            className="flex-1 text-center text-lg px-4 truncate max-md:text-base"
            style={{
              color: "#28345F",
              fontFamily: "tajawal",
              fontSize: "25px",
              fontWeight: "500",
            }}
          >
            {config.instruction}
          </p>

          {/* Score */}
          <div
            className="flex items-center gap-2 px-5 py-2 rounded-2xl shrink-0"
            style={{ backgroundColor: "#652b82", color: "#ffffff" }}
          >
            <img src={stars} className="w-6 h-6" />

            <span
              className="text-xl font-medium"
              style={{
                color: "#F9F9F9",
                fontFamily: "tajawal",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-20 pb-24">
        <div className="h-full relative">
          <AnimatePresence>
            {words.map((word) => (
              <FallingBubble
                key={word.id}
                word={word}
                onComplete={() => handleWordMiss(word.id)}
                onClick={() => handleWordClick(word)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Errors - bottom left */}
      <div
        className="absolute bottom-6 left-6 z-20 text-xl font-medium"
        style={{
          color: "#EE0000",
          fontFamily: "tajawal",
          fontSize: "25px",
          fontWeight: "500",
        }}
      >
        أخطاء {mistakes}/{config.maxMistakes}
      </div>

      {/* Tiger - bottom right */}
      <div className="absolute bottom-0 right-0 z-10 w-48 h-48 md:w-64 md:h-64 pointer-events-none">
        <img
          src={tigerImg}
          alt=""
          className="w-full h-full object-contain object-bottom"
        />
      </div>

      {/* Mistake Toast
      <AnimatePresence>
        <MistakeToast text={mistakeText} />
      </AnimatePresence> */}

      {/* Game Over */}
      {gameOver && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-[28px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-center max-w-md w-full mx-4 relative overflow-hidden"
            initial={{ scale: 0.7, y: 80 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 80 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: "20px" }}
            dir="rtl"
          >
            {/* الزخرفة الصفراء */}
            <img className="absolute top-0 left-0" src={vectorEnd} />

            {/* أيقونة الوسام */}
            <div className="relative z-10 flex justify-center mb-4">
              <div className="text-[#FDC333] text-5xl">
                <img src={badegEnd} />
              </div>
            </div>

            {/* العنوان */}
            <motion.h2
              className="text-2xl md:text-3xl mb-2"
              style={{
                color: "#28345F",
                fontFamily: "tajawal",
                fontSize: "30px",
                fontWeight: "500",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              انتهت اللعبه
            </motion.h2>
            {/* التفاصيل */}
            <p
              className="text-[#28345F] text-base mb-1"
              style={{
                color: "#28345F",
                fontFamily: "tajawal",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              نقاطك:{" "}
              <span
                className="font-semibold"
                style={{
                  color: "#28345F",
                  fontFamily: "tajawal",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {score} 
              </span>
            </p>
            <p
              className="text-[#28345F] text-base mb-1"
              style={{
                color: "#EE0000",
                fontFamily: "tajawal",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              عددالاخطاء :{" "}
              <span
                className="font-semibold"
                style={{
                  color: "#EE0000",
                  fontFamily: "tajawal",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {mistakes}
              </span>
            </p>
            <div
              className="flex gap-4 justify-center"
              style={{ marginTop: "20px" }}
            >
              <button
                onClick={resetGame}
                style={{ backgroundColor: "#652B82" }}
                className="px-6 py-4 flex rounded-xl text-white font-medium shadow-md hover:scale-105 transition"
              >
                <img src={restart} className="w-6 h-6" />
                <span>العب مرة أخرى</span>
              </button>

              <button
                onClick={() => navigate(`/letter/${letter}/games`)}
                style={{ backgroundColor: "#FDC333", color: "#652B82" }}
                className="px-6 py-2.5 rounded-xl text-[#28345F] font-medium shadow-md hover:scale-105 transition"
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
