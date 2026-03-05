import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";
import backImg from "../../assets/background_imgMatch.svg"
import frontImg from "../../assets/frontImg_match.svg"
/* ===================== Types ===================== */

interface Card {
  id: number;
  content: string;
  type: "letter" | "word";
  matched: boolean;
  flipped: boolean;
}

/* ===================== Card Back Decoration ===================== */

function CardBackDecoration() {
  return (
    <img
      className=""
     src={backImg}
      
 />
 
  );
}
function CardFrontDecoration() {
  return (
    <img
      className=""
     src={frontImg}
      
 />
 
  );
}
/* ===================== Flip Card ===================== */

function GameCard({
  card,
  index,
  onClick,
  disabled,
}: {
  card: Card;
  index: number;
  onClick: () => void;
  disabled?: boolean;
}) {
  const isFlipped = card.flipped || card.matched;
  const canClick = !disabled && !card.matched && !card.flipped;

  return (
    <motion.div
      className={`aspect-square ${canClick ? "cursor-pointer" : "cursor-default"}`}
      style={{ perspective: "800px" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={canClick ? onClick : undefined}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Back of card (ظهر الورقة - question mark) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
           
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <CardBackDecoration />
         
        </div>

        {/* Front of card (واجهة الورقة - content) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid",
            borderColor: card.matched ? "#fad656" : "",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardFrontDecoration />
          <span
            className="relative z-10 text-2xl md:text-3xl font-bold"
            style={{ color: "#652b82" }}
          >
            {card.content}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
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
        className="absolute top-0 left-0 right-0 z-30 px-4 py-3 border-b"
        style={{
          borderColor: "#e5e5e5",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/letter/${letter}/games`)}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#fce7f3", color: "#ec4899" }}
          >
            <X className="w-5 h-5" />
          </button>

          <h2
            className="text-lg md:text-xl font-medium text-center flex-1"
            style={{ color: "#652b82" }}
          >
            اقلب البطاقات وطابق الألف مع الكلمات
          </h2>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-lg" style={{ color: "#652b82" }}>
              حركة: {moves}/10
            </span>
            <div className="flex items-center gap-1">
              <Star
                className="w-5 h-5"
                style={{ color: "#652b82", fill: "transparent" }}
              />
              <span className="text-lg" style={{ color: "#652b82" }}>
                {score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-20 pb-8 flex items-center justify-center">
        <div className="max-w-4xl w-full px-4">
          <div
            className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"
            style={{ backgroundColor: "#faf9f6" }}
          >
            {cards.map((card, index) => (
              <GameCard
                key={card.id}
                card={card}
                index={index}
                disabled={gameLost || flippedCards.length >= 2}
                onClick={() => handleCardClick(card.id)}
              />
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
