import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
interface Card {
  id: number;
  content: string;
  type: "letter" | "word";
  matched: boolean;
  flipped: boolean;
}

const alefPairs = [
  { letter: "أ", word: "أسد" },
  { letter: "أ", word: "أرنب" },
  { letter: "أ", word: "أذن" },
  { letter: "أ", word: "إصبع" },
  { letter: "أ", word: "أزرق" },
  { letter: "أ", word: "أنف" },
];

export function MemoryMatchGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [startTime] = useState(Date.now());
  const [gameLessonId, setGameLessonId] = useState<number | null>(null);

  const getDuration = () => {
    return Math.floor((Date.now() - startTime) / 1000);
  };
  const { letter } = useParams();
  const navigate = useNavigate();
  const [pairs, setPairs] = useState<{ letter: string; word: string }[]>([]);
  const propLetter = letter;
  useEffect(() => {
    if (!propLetter) return;
    const letterMap: Record<string, number> = {
      أ: 1,
      ب: 2,
      ت: 3,
    };
    const letterId = letterMap[propLetter];
    const fetchGameData = async () => {
      try {
        const res = await api.get(
          `/lessons/game-lesson/${letterId}/letter-id?type=memory_match`
        );

        const game = res.data.data?.[0]; // العنصر الوحيد

        if (!game || !game.data?.pairs) return;

        const formatted = game.data.pairs.map((pair: any) => ({
          letter: pair.letter.trim(), // مهم 👈
          word: pair.word,
        }));
        setGameLessonId(res.data.data?.[0].game_lesson_id);
        setPairs(formatted);
        initializeGame(formatted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameData();
  }, [letter]);

 useEffect(() => {
  if (!gameWon && !gameLost) return;
  if (!gameLessonId) return;

  const saveResult = async () => {
    try {
      const res = await saveGameResult({
        games_lessons_id: gameLessonId,
        score: score,
        duration: getDuration(),
      });

      console.log("Game result saved ✅", res);
    } catch (error) {
      console.error("Error saving game result", error);
    }
  };

  saveResult();
}, [gameWon, gameLost, gameLessonId]);

  useEffect(() => {
    if (moves >= 10 && !gameWon) {
      setGameLost(true);
    }
  }, [moves, gameWon]);

  const initializeGame = (gamePairs = pairs) => {
    setGameLost(false);

    const selectedPairs = gamePairs.slice(0, 6); // عدد الأزواج
    const gameCards: Card[] = [];

    selectedPairs.forEach((pair, index) => {
      gameCards.push({
        id: index * 2,
        content: pair.letter,
        type: "letter",
        matched: false,
        flipped: false,
      });

      gameCards.push({
        id: index * 2 + 1,
        content: pair.word,
        type: "word",
        matched: false,
        flipped: false,
      });
    });

    const shuffled = gameCards.sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    if (gameLost) return; // 👈 مهم
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards.find((c) => c.id === cardId)?.matched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, flipped: true } : card
      )
    );

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      checkMatch(newFlipped);
    }
  };

  const checkMatch = (flipped: number[]) => {
    const [first, second] = flipped;
    const firstCard = cards.find((c) => c.id === first);
    const secondCard = cards.find((c) => c.id === second);

    if (!firstCard || !secondCard) return;

    setTimeout(() => {
      if (
        (firstCard.type === "letter" &&
          secondCard.type === "word" &&
          secondCard.content.startsWith(firstCard.content)) ||
        (secondCard.type === "letter" &&
          firstCard.type === "word" &&
          firstCard.content.startsWith(secondCard.content))
      ) {
        // Match found!
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, matched: true, flipped: true }
              : card
          )
        );
        setScore((prev) => prev + 10);

        // Check if game is won
        const allMatched = cards
          .filter((c) => c.id !== first && c.id !== second)
          .every((c) => c.matched);
        if (allMatched) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        // No match
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, flipped: false }
              : card
          )
        );
      }
      setFlippedCards([]);
    }, 1000);
  };

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
              <span className="text-xl" style={{ color: "#652b82" }}>
                حركات: {moves}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-24 pb-8 flex items-center justify-center">
        <div className="max-w-5xl w-full px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl mb-2" style={{ color: "#652b82" }}>
              طابق حرف الألف مع الكلمات
            </h2>
            <p className="text-xl text-gray-700">
              اقلب البطاقات وطابق الحرف مع الكلمة التي تبدأ به
            </p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="aspect-square rounded-2xl shadow-xl border-4 flex items-center justify-center text-3xl md:text-4xl"
                style={{
                  backgroundColor:
                    card.flipped || card.matched ? "#ffffff" : "#652b82",
                  borderColor: card.matched ? "#fad656" : "#652b82",
                  color: card.flipped || card.matched ? "#652b82" : "#ffffff",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {card.flipped || card.matched ? card.content : "؟"}
              </motion.button>
            ))}
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
              أحسنت!
            </h2>

            <p className="text-2xl text-gray-700 mb-2">نقاطك: {score}</p>
            <p className="text-xl text-gray-600 mb-6">عدد الحركات: {moves}</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => initializeGame()}
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
      {gameLost && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-12 shadow-2xl border-4 max-w-md mx-4 text-center"
            style={{ borderColor: "#ef4444" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-4xl mb-4" style={{ color: "#ef4444" }}>
              حظاً أوفر 😔
            </h2>

            <p className="text-xl text-gray-700 mb-6">
              وصلت إلى الحد الأقصى من المحاولات
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => initializeGame()}
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
