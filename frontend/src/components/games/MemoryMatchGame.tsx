import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";
import backImg from "../../assets/background_imgMatch.svg";
import frontImg from "../../assets/frontImg_match.svg";
import vectorEnd from "../../assets/vector_end.svg";
import badegEnd from "../../assets/badeg_end.svg";
import restart from "../../assets/Repeat.svg";
import { GameLoadingScreen } from "./WordCatchWelcom";
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
  return <img className="" src={backImg} />;
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
        className="relative h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        style={{
          transformStyle: "preserve-3d",
          width: "95%",
        }}
      >
        {/* Back of card (ظهر الورقة - question mark) */}
        <div
          className="inset-0 rounded-3xl overflow-hidden flex items-center justify-center"
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
          className="absolute inset-0 rounded-3xl overflow-hidden flex items-center justify-center"
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
  const [minLoadElapsed, setMinLoadElapsed] = useState(false);
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

  const getDuration = () => Math.floor((Date.now() - startTime) / 1000);

  /* ---------- Effects ---------- */
  // Minimum loader duration (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadElapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);
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
        const res = await api.get("/lessons/games-lessons/by-letter-and-type", {
          params: {
            letter,
            gameType: "memory_match",
          },
        });

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
        card.id === cardId ? { ...card, flipped: true } : card,
      ),
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
              : card,
          ),
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
              : card,
          ),
        );
      }

      setFlippedCards([]);
    }, 1000);
  };

  /* ---------- Loading ---------- */

  const isGameReady = pairs.length > 0;
  if (!isGameReady || !minLoadElapsed) {
    return <GameLoadingScreen game_name={"wordMatch"} />;
  }

  /* ---------- Render ---------- */

  return (
    <div
      className="h-screen relative"
      dir="rtl"
      style={{
        background: "linear-gradient(120deg, #faf9f6 30%, #faf7e9 100%)",
      }}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 z-30 px-4 py-3"
        style={{
          background: "linear-gradient(120deg, #faf9f6 30%, #faf7e9100%)",
          borderBottom: "10px solid white",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/letter/${letter}/games`)}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
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
            اقلب البطاقات وطابق الألف مع الكلمات
          </h2>

          <div className="flex items-center gap-4 shrink-0">
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
              حركة: {moves}/10
            </span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-20 pb-8 flex items-center justify-center mt-30">
        <div
          className="max-w-4xl w-full px-4"
          style={{ marginTop: "40px", marginBottom: "40px" }}
        >
          <div
            className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"
            style={{
              backgroundColor: "#FAF6E7",
              marginTop: "90px",
              marginBottom: "40px",
            }}
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
              احسنت
            </motion.h2>
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
              عدد الحركات: {moves}
            </p>

            <div
              className="flex gap-4 justify-center"
              style={{ marginTop: "20px" }}
            >
              <button
                onClick={() => initializeGame()}
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

      {/* Game Lost */}
      {gameLost && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
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
            <p
              className="mb-2"
              style={{
                color: "#28345fae",
                fontFamily: "tajawal",
                fontSize: "20px",
                fontWeight: "400",
              }}
            >
              وصلت إلى الحد الأقصى من المحاولات
            </p>
            <p
              className="text-[#28345F] text-base mb-4"
              style={{
                color: "#EE0000",
                fontFamily: "tajawal",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              عدد الحركات: {moves}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => initializeGame()}
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
