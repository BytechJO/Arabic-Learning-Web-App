import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../../API/axios";
import redBalloon from "../../assets/pink.svg";
import pinkBalloon from "../../assets/pink_balloon copy.svg";
import yellowBalloon from "../../assets/yallow.svg";
import blueBalloon from "../../assets/blue_balloon copy.svg";
import vectorEnd from "../../assets/vector_end.svg";
import badegEnd from "../../assets/badeg_end.svg";
import restart from "../../assets/Repeat.svg";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";
import { GameLoadingScreen } from "./WordCatchWelcom";

/* ===================== Types ===================== */

interface Balloon {
  id: number;
  word: string;
  startsWithAlef: boolean;
  x: number;
  y: number;
  imageSrc: string;
  handled?: boolean;
  popped?: boolean;
}

interface BalloonWord {
  word: string;
  startsWithTarget: boolean;
}

interface BalloonPopConfig {
  title: string;
  instruction: string;
  targetLetter: string;
  scorePerCorrect: number;
  maxMistakes: number;
  spawn: {
    baseInterval: number;
    levelFactor: number;
    minInterval: number;
  };
  speed: {
    baseDuration: number;
    levelIncrease: number;
    minDuration: number;
  };
  words: BalloonWord[];
}

/* ===================== Constants ===================== */

const BALLOON_IMAGES = [redBalloon, pinkBalloon, yellowBalloon, blueBalloon];
const POP_DISAPPEAR_DELAY_MS = 0;

function playPopSound() {
  try {
    const audioContext = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    )();
    const bufferSize = Math.min(2 * audioContext.sampleRate, 44100);
    const buffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    const filter = audioContext.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1000;
    noise.connect(filter);
    filter.connect(audioContext.destination);
    noise.start(0);
  } catch {
    // ignore if audio fails
  }
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

export function BalloonPopGame() {
  /* ---------- State ---------- */
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);

  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [nextId, setNextId] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [mistakeToastText, setMistakeToastText] = useState<string | null>(null);
  const [minLoadElapsed, setMinLoadElapsed] = useState(false);

  const [config, setConfig] = useState<BalloonPopConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameLessonId, setGameLessonId] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  /* ---------- Router / Redux ---------- */
  const { letter } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { letters } = useSelector((state: RootState) => state.letters);
  const currentLetter = letters.find((l) => l.symbol === letter);
  const letterId = currentLetter?.id;

  /* ---------- Helpers ---------- */
  const getDuration = () => Math.floor((Date.now() - startTime) / 1000);

  /* ---------- Effects ---------- */

  // Minimum loader duration (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadElapsed(true), 2000);
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

    const fetchGame = async () => {
      try {
        const res = await api.get("/lessons/games-lessons/by-letter-and-type", {
          params: {
            letter,
            gameType: "balloon_pop",
          },
        });

        const game = res.data.data;
        setGameLessonId(game.game_lesson_id);
        setConfig(game.data);
      } catch (err) {
        console.error("Error loading balloon game", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [letter, letterId]);

  // Spawn balloons
  useEffect(() => {
    if (!config || gameOver || lives <= 0 || correctCount >= 10) return;

    const spawnInterval = Math.max(
      config.spawn.baseInterval - level * config.spawn.levelFactor,
      config.spawn.minInterval,
    );

    const interval = setInterval(() => {
      const randomWord =
        config.words[Math.floor(Math.random() * config.words.length)];

      setBalloons((prev) => [
        ...prev,
        {
          id: nextId,
          word: randomWord.word,
          startsWithAlef: randomWord.startsWithTarget,
          x: Math.random() * 40 + 20,
          y: 120,
          imageSrc:
            BALLOON_IMAGES[Math.floor(Math.random() * BALLOON_IMAGES.length)],
        },
      ]);

      setNextId((prev) => prev + 1);
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [config, gameOver, lives, level, correctCount, nextId]);

  // Level up
  useEffect(() => {
    if (score >= level * 50) {
      setLevel((prev) => prev + 1);
    }
  }, [score, level]);

  // Game over condition
  useEffect(() => {
    if (lives <= 0 || correctCount >= 10) {
      setGameOver(true);
    }
  }, [lives, correctCount]);

  // Save result
  useEffect(() => {
    if (!gameOver || !gameLessonId) return;

    saveGameResult({
      games_lessons_id: gameLessonId,
      score,
      duration: getDuration(),
    }).catch(console.error);
  }, [gameOver]);

  /* ---------- Handlers ---------- */

  const showMistakeToast = (nextLives: number) => {
    if (!config) return;

    setMistakeToastText(
      `خطأ ❌ ${config.maxMistakes - nextLives} / ${config.maxMistakes}`,
    );
    setTimeout(() => setMistakeToastText(null), 1200);
  };

  const handleBalloonClick = (balloon: Balloon) => {
    if (!config || gameOver || balloon.handled) return;

    playPopSound();

    if (balloon.startsWithAlef) {
      setCorrectCount((c) => c + 1);
      setScore((s) => s + config.scorePerCorrect);
    } else {
      setLives((prev) => {
        const next = prev - 1;
        showMistakeToast(next);
        return next;
      });
    }

    setBalloons((prev) =>
      prev.map((b) =>
        b.id === balloon.id ? { ...b, handled: true, popped: true } : b,
      ),
    );

    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    }, POP_DISAPPEAR_DELAY_MS);
  };

  const handleBalloonEscape = (balloonId: number) => {
    const balloon = balloons.find((b) => b.id === balloonId);
    if (!balloon || gameOver || balloon.handled) return;

    if (balloon.startsWithAlef) {
      setLives((prev) => {
        const next = prev - 1;
        showMistakeToast(next);
        return next;
      });
    }

    setBalloons((prev) => prev.filter((b) => b.id !== balloonId));
  };

  const resetGame = () => {
    setScore(0);
    setCorrectCount(0);
    setLives(config?.maxMistakes ?? 3);
    setBalloons([]);
    setGameOver(false);
    setLevel(1);
  };

  /* ---------- Render Guards ---------- */

  if (loading || !minLoadElapsed) {
    return <GameLoadingScreen game_name={"balloon"} />;
  }

  if (!config) {
    return <div className="text-center mt-20">لا توجد بيانات للعبة</div>;
  }

  /* ---------- Render ---------- */

  return (
    <div
      className="h-screen relative overflow-hidden"
      dir="rtl"
      style={{
        background: "linear-gradient(120deg, #faf9f6 30%, #faf7e9 100%)",
      }}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-30 px-6 py-4 border-b-4"
        style={{
          background: "linear-gradient(120deg, #faf9f6 30%, #faf7e9 100%)",
          borderBottom: "10px solid white",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/letter/${letter}/games`)}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: "#FFA199",
              color: "black",
              fontSize: "25px",
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <h2
            className="text-lg md:text-xl font-medium text-center flex-1"
            style={{
              color: "#28345F",
              fontFamily: "tajawal",
              fontSize: "20px",
            }}
          >
            افرقع البالونات التي تحتوي على كلمات تبدأ بحرف الألف
          </h2>
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2"
              style={{
                color: "#652b82",
                backgroundColor: "#faf6e7",
                borderRadius: "15px",
                padding: "5px 10px",
              }}
            >
              <Star
                className="w-5 h-5"
                style={{ color: "#652b82", fill: "transparent" }}
              />
              <span
                className="text-lg"
                style={{
                  color: "#652b82",
                  fontFamily: "tajawal",
                  fontSize: "25px",
                }}
              >
                {score}
              </span>
            </div>
            <span
              className="text-lg"
              style={{
                color: "#652b82",
                backgroundColor: "#faf6e7",
                borderRadius: "15px",
                padding: "10px",
                fontFamily: "tajawal",
                fontSize: "22px",
              }}
            >
              المستوى: {level}
            </span>

            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: i < lives ? "#FC4637" : "#d1d5db",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Balloons - z-40 so they rise above the header */}
      <div className="absolute inset-0 pt-24 pb-8 overflow-hidden">
        <div className="flex justify-center items-center mx-auto h-full relative overflow-hidden">
          <AnimatePresence>
            {balloons.map((balloon) => (
              <motion.button
                key={balloon.id}
                initial={{ y: "100vh" }}
                animate={{ y: "-90vh"  }}
                exit={{ scale: 0, opacity: 0 }}
               transition={{ duration: 14 - level * 0.3, ease: "linear" }}
                onAnimationComplete={() => handleBalloonEscape(balloon.id)}
                onClick={() => handleBalloonClick(balloon)}
                className="absolute bottom-0 cursor-pointer z-0"
                style={{
                  left: `${balloon.x}%`,
                  transform: "translateX(-50%)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="relative w-full h-full">
                    <img
                      src={balloon.imageSrc}
                      alt=""
                      className="object-contain pointer-events-none select-none"
                      style={{ height: "150px", width: "150px" }}
                    />
                    <div
                      className="absolute inset-0 flex justify-center"
                      style={{
                        color: "#ffffff",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        fontSize: "20px",
                        alignItems: "flex-start",
                        paddingTop: "20px",
                      }}
                    >
                      {balloon.word}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        <MistakeToast text={mistakeToastText} />
      </AnimatePresence>

      {/* Game Over */}
      {gameOver && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
              وصلت للمستوى :{" "}
              <span
                className="font-semibold"
                style={{
                  color: "#EE0000",
                  fontFamily: "tajawal",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {level}
              </span>
            </p>
            <div className="flex gap-4 justify-center">
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
