import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";

/* ===================== Types ===================== */

interface Card {
  id: number;
  content: string;
  type: "letter" | "word";
  matched: boolean;
  flipped: boolean;
}

/* ===================== Toast ===================== */

function MovesToast({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <motion.div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg border-4 text-xl"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#652b82",
        color: "#652b82",
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

export function MemoryMatchGame() {
  /* ---------- State ---------- */
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [pairs, setPairs] = useState<{ letter: string; word: string }[]>([]);

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [movesToastText, setMovesToastText] = useState<string | null>(null);

  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

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

  const getDuration = () =>
    Math.floor((Date.now() - startTime) / 1000);

  /* ---------- Effects ---------- */

  // Fetch letters if not loaded
  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);

  // Fetch game data
  useEffect(() => {
    if (!letterId) return;

    const fetchGameData = async () => {
      try {
        const res = await api.get(
          "/lessons/games-lessons/by-letter-and-type",
          {
            params: {
              letter,
              gameType: "memory_match",
            },
          }
        );

        const game = res.data.data;
        if (!game || !game.data?.pairs) return;

        const formatted = game.data.pairs.map((pair: any) => ({
          letter: pair.letter.trim(),
          word: pair.word,
        }));

        setGameLessonId(game.game_lesson_id);
        setPairs(formatted);
        initializeGame(formatted);
      } catch (error) {
        console.error("Error fetching memory match game", error);
      }
    };

    fetchGameData();
  }, [letterId]);

  // Save result on end
  useEffect(() => {
    if ((!gameWon && !gameLost) || !gameLessonId) return;

    saveGameResult({
      games_lessons_id: gameLessonId,
      score,
      duration: getDuration(),
    }).catch(console.error);
  }, [gameWon, gameLost, gameLessonId]);

  // Lose condition
  useEffect(() => {
    if (moves >= 10 && !gameWon) {
      setGameLost(true);
    }
  }, [moves, gameWon]);

  /* ---------- Game Logic ---------- */

  const initializeGame = (gamePairs = pairs) => {
    setGameLost(false);
    setGameWon(false);

    const selectedPairs = gamePairs.slice(0, 6);
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

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
  };

  const handleCardClick = (cardId: number) => {
    if (gameLost) return;
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
      setMoves((prev) => {
        const next = prev + 1;
        setMovesToastText(`حركة: ${next} / 10`);
        setTimeout(() => setMovesToastText(null), 1200);
        return next;
      });

      checkMatch(newFlipped);
    }
  };

  const checkMatch = (flipped: number[]) => {
    const [first, second] = flipped;
    const firstCard = cards.find((c) => c.id === first);
    const secondCard = cards.find((c) => c.id === second);

    if (!firstCard || !secondCard) return;

    setTimeout(() => {
      const isMatch =
        (firstCard.type === "letter" &&
          secondCard.type === "word" &&
          secondCard.content.startsWith(firstCard.content)) ||
        (secondCard.type === "letter" &&
          firstCard.type === "word" &&
          firstCard.content.startsWith(secondCard.content));

      if (isMatch) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, matched: true, flipped: true }
              : card
          )
        );
        setScore((s) => s + 10);

        const allMatched = cards
          .filter((c) => c.id !== first && c.id !== second)
          .every((c) => c.matched);

        if (allMatched) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
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

            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg bg-white">
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

      <AnimatePresence>
        <MovesToast text={movesToastText} />
      </AnimatePresence>

      {/* Game Won */}
      {gameWon && !gameLost && (
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
            <Award className="w-24 h-24 mx-auto mb-4" style={{ color: "#fad656" }} />
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
                العب مرة أخرى
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

      {/* Game Lost */}
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
                العب مرة أخرى
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
