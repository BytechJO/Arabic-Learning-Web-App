import { useState } from "react";
import { motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
interface Item {
  id: number;
  word: string;
  startsWithAlef: boolean;
  placed: boolean;
  position: "left" | "right" | null;
}
interface SortingGameConfig {
  title: string;
  instruction: string;
  targetLetter: string;
  scorePerCorrect: number;
  maxMistakes: number;
  items: {
    word: string;
    startsWithTarget: boolean;
  }[];
}

export function SortingGame() {
  const [items, setItems] = useState<Item[]>([]);

  const { letter } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [config, setConfig] = useState<SortingGameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [gameLessonId, setGameLessonId] = useState<number | null>(null);

  const getDuration = () => {
    return Math.floor((Date.now() - startTime) / 1000);
  };
  const propLetter = letter;

  useEffect(() => {
    if (!propLetter) return;
    const letterMap: Record<string, number> = {
      أ: 1,
      ب: 2,
      ت: 3,
    };
    const letterId = letterMap[propLetter];

    const fetchGame = async () => {
      try {
        const res = await api.get(
          `/lessons/game-lesson/${letterId}/letter-id?type=sorting`
        );

        const game = res.data.data[0]; // 👈 أول لعبة
        const gameConfig: SortingGameConfig = game.data; // 👈 الداتا الحقيقية

        setGameLessonId(res.data.data?.[0].game_lesson_id);
        setConfig(gameConfig);
        const mappedItems: Item[] = gameConfig.items
          .slice(0, 10)
          .map((item, index) => ({
            id: index,
            word: item.word,
            startsWithAlef: item.startsWithTarget,
            placed: false,
            position: null,
          }))
          .sort(() => Math.random() - 0.5);

        setItems(mappedItems);
      } catch (error) {
        console.error("Error loading sorting game", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [propLetter]);

  const handleDragStart = (itemId: number) => {
    setDraggedItem(itemId);
  };
  useEffect(() => {
    if (!gameWon && !mistakes) return;

    const saveResult = async () => {
      try {
        await saveGameResult({
          games_lessons_id: gameLessonId! /* id اللعبة */,
          score: score,
          duration: getDuration(),
        });

        console.log(
          "Game result saved ✅"
        );
      } catch (error) {
        console.error("Error saving game result", error);
      }
    };

    saveResult();
  }, [gameWon, mistakes]);

  const handleDrop = (side: "left" | "right") => {
    if (draggedItem === null || !config) return;

    const item = items!.find((i) => i.id === draggedItem);
    if (!item || item.placed) return;

    const isCorrect =
      (side === "right" && item.startsWithAlef) ||
      (side === "left" && !item.startsWithAlef);

    if (isCorrect) {
      setScore((prev) => {
        const newScore = prev + 10;
        if (newScore >= config.items.length * config.scorePerCorrect)
          setGameWon(true);
        return newScore;
      });

      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === draggedItem ? { ...i, placed: true, position: side } : i
        );

        if (updated.every((i) => i.placed)) {
          setTimeout(() => setGameWon(true), 500);
        }

        return updated;
      });
    } else {
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        if (newMistakes >= 3) setGameWon(true);
        return newMistakes;
      });
    }

    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetGame = () => {
    if (!config || !config.items?.length) return;

    const resetItems: Item[] = config.items
      .slice(0, 10)
      .map((item, index) => ({
        id: index,
        word: item.word,
        startsWithAlef: item.startsWithTarget,

        placed: false,
        position: null,
      }))
      .sort(() => Math.random() - 0.5);

    setItems(resetItems);
    setScore(0);
    setMistakes(0);
    setGameWon(false);
    setDraggedItem(null);
  };

  const unplacedItems = items.filter((i) => !i.placed);
  const leftItems = items.filter((i) => i.placed && i.position === "left");
  const rightItems = items.filter((i) => i.placed && i.position === "right");
  if (loading) {
    return <div className="text-center mt-20">جاري تحميل اللعبة...</div>;
  }

  if (!config) {
    return <div className="text-center mt-20">لا توجد بيانات للعبة</div>;
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
              style={{ backgroundColor: "#ffffff" }}
            >
              <span className="text-xl" style={{ color: "#ef4444" }}>
                أخطاء: {mistakes}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-24 pb-8">
        <div className="max-w-6xl mx-auto h-full px-6 flex flex-col">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl mb-2" style={{ color: "#652b82" }}>
              {config.title}
            </h2>
            <p className="text-xl text-gray-700">{config.instruction}</p>
          </motion.div>

          {/* Unplaced Items */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 justify-center min-h-[100px]">
              {unplacedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  className="px-8 py-4 rounded-2xl shadow-xl border-4 cursor-move text-2xl"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#652b82",
                    color: "#652b82",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, rotate: 5 }}
                >
                  {item.word}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {/* Left Zone - Other letters */}
            <motion.div
              onDrop={() => handleDrop("left")}
              onDragOver={handleDragOver}
              className="rounded-3xl border-4 border-dashed p-6 flex flex-col"
              style={{
                borderColor: "#652b82",
                backgroundColor: "rgba(101, 43, 130, 0.05)",
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ backgroundColor: "rgba(101, 43, 130, 0.1)" }}
            >
              <h3
                className="text-2xl md:text-3xl mb-4 text-center"
                style={{ color: "#652b82" }}
              >
                حروف أخرى
              </h3>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                {leftItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-6 py-3 rounded-2xl shadow-lg border-4 text-xl text-center"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#652b82",
                      color: "#652b82",
                    }}
                  >
                    {item.word}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Zone - Alef */}
            <motion.div
              onDrop={() => handleDrop("right")}
              onDragOver={handleDragOver}
              className="rounded-3xl border-4 border-dashed p-6 flex flex-col"
              style={{
                borderColor: "#fad656",
                backgroundColor: "rgba(250, 214, 86, 0.1)",
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ backgroundColor: "rgba(250, 214, 86, 0.2)" }}
            >
              <h3
                className="text-2xl md:text-3xl mb-4 text-center"
                style={{ color: "#652b82" }}
              >
                حرف الألف (أ)
              </h3>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                {rightItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-6 py-3 rounded-2xl shadow-lg border-4 text-xl text-center"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#fad656",
                      color: "#652b82",
                    }}
                  >
                    {item.word}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Game Won Modal */}
      {gameWon && (
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
              ممتاز!
            </h2>

            <p className="text-2xl text-gray-700 mb-2">نقاطك: {score}</p>
            <p className="text-xl text-gray-600 mb-6">
              عدد الأخطاء: {mistakes}
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
