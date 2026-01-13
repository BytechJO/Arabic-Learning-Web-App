import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";

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

export function WordCatchGame() {
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [startTime] = useState(Date.now());
  const [gameLessonId, setGameLessonId] = useState<number | null>(null);

  const getDuration = () => {
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const [config, setConfig] = useState<WordCatchConfig | null>(null);
  const MAX_MISTAKES = 3;
  const MAX_CORRECT_WORDS = 10;

  const [correctCount, setCorrectCount] = useState(0);

  const [nextId, setNextId] = useState(0);
  const { letter } = useParams();
  const navigate = useNavigate();

  const propLetter = letter;
  useEffect(() => {
    if (!propLetter) return;
    const letterMap: Record<string, number> = {
      أ: 1,
      ب: 2,
      ت: 3,
    };
    const letterId = letterMap[propLetter];
    const fetchGameConfig = async () => {
      try {
        const res = await api.get(
          `/lessons/game-lesson/${letterId}/letter-id?type=word_catch`
        );

        const gameConfig = res.data.data?.[0]?.data;
        console.log(res.data.data?.[0]);
        
        setGameLessonId(res.data.data?.[0].game_lesson_id);
        if (!gameConfig) {
          console.error("No game config found");
          return;
        }

        setConfig(gameConfig);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGameConfig();
  }, []);

  useEffect(() => {
    if (!config || gameOver) return;

    const interval = setInterval(() => {
      const allWords = [
        ...config.correctWords.map((w) => ({ word: w, startsWithAlef: true })),
        ...config.wrongWords.map((w) => ({ word: w, startsWithAlef: false })),
      ];

      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];

      setWords((prev) => [
        ...prev,
        {
          id: nextId,
          word: randomWord.word,
          startsWithAlef: randomWord.startsWithAlef,
          x: Math.random() * 80 + 10,
          speed:
            Math.random() * (config.maxSpeed - config.minSpeed) +
            config.minSpeed,
        },
      ]);

      setNextId((prev) => prev + 1);
    }, config.spawnIntervalMs);

    return () => clearInterval(interval);
  }, [config, gameOver, nextId]);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setWords((prev) =>
        prev.filter((word) => {
          // إذا وصلت الكلمة للأسفل ولم يتم النقر عليها
          return true;
        })
      );
    }, 50);

    return () => clearInterval(animationFrame);
  }, []);
  useEffect(() => {
    if (!gameOver) return;

    const saveResult = async () => {
      try {
        await saveGameResult({
          games_lessons_id: gameLessonId! /* id اللعبة */,
          score: score,
          duration: getDuration(),
        });

        console.log("Game result saved ✅");
      } catch (error) {
        console.error("Error saving game result", error);
      }
    };

    saveResult();
  }, [gameOver]);

  const handleWordClick = (word: FallingWord) => {
    if (word.startsWithAlef) {
      setScore((prev) => prev + config!.scorePerCorrect);

      setCorrectCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= MAX_CORRECT_WORDS) {
          setGameOver(true);
        }
        return newCount;
      });

      setWords((prev) => prev.filter((w) => w.id !== word.id));
    } else {
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        if (newMistakes >= MAX_MISTAKES) {
          setGameOver(true);
        }
        return newMistakes;
      });
    }
  };

  const handleWordMiss = (wordId: number) => {
    const word = words.find((w) => w.id === wordId);

    if (word && word.startsWithAlef) {
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        if (newMistakes >= MAX_MISTAKES) {
          setGameOver(true);
        }
        return newMistakes;
      });
    }

    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  const resetGame = () => {
    setScore(0);
    setMistakes(0);
    setCorrectCount(0);
    setGameOver(false);
    setWords([]);
  };

  if (!config) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>جاري تحميل اللعبة...</p>
      </div>
    );
  }

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
              style={{ backgroundColor: mistakes >= 3 ? "#ef4444" : "#ffffff" }}
            >
              <span
                className="text-xl"
                style={{ color: mistakes >= 3 ? "#ffffff" : "#ef4444" }}
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
                initial={{ y: -100, x: `${word.x}%` }}
                animate={{ y: window.innerHeight }}
                transition={{ duration: word.speed * 5, ease: "linear" }}
                onAnimationComplete={() => handleWordMiss(word.id)}
                onClick={() => handleWordClick(word)}
                className="absolute px-8 py-4 rounded-3xl shadow-2xl text-2xl cursor-pointer border-4"
                style={{
                  left: 0,
                  backgroundColor: "#ffffff",
                  borderColor: word.startsWithAlef ? "#fad656" : "#e5e5e5",
                  color: "#652b82",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {word.word}
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Instructions */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-3xl px-8 py-4 shadow-xl border-4"
            style={{ borderColor: "#652b82" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl" style={{ color: "#652b82" }}>
              {config?.instruction}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Game Over Modal */}
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

            <p className="text-2xl text-gray-700 mb-6">نقاطك: {score}</p>

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
                onClick={() => navigate(`/letter/${letter}/games`)}
                className="px-8 py-4 rounded-2xl shadow-lg text-xl"
                style={{ backgroundColor: "#fad656", color: "#652b82" }}
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
