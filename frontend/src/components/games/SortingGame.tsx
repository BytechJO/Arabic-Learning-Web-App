import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";
import { useDispatch, useSelector } from "react-redux";
import vectorEnd from "../../assets/vector_end.svg";
import badegEnd from "../../assets/badeg_end.svg";
import restart from "../../assets/Repeat.svg";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { GameLoadingScreen } from "./WordCatchWelcom";

interface Item {
  id: number;
  word: string;
  startsWithAlef: boolean;
  placed: boolean;
  position: "alif" | "other" | null;
}
interface SortingGameConfig {
  title: string;
  instruction: string;
  targetLetter: string;
  scorePerCorrect: number;
  maxMistakes: number;
  items: { word: string; startsWithTarget: boolean }[];
}

/* ------------------------- UI Helpers (نفس الثيم) ------------------------- */

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

const CARD_BG = "#fef9e7";
const CARD_BORDER = "#e8c547";
const ZONE_BORDER = "#e8c547";
const TEXT_DARK = "#28345F";

function DraggableItem({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id });

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        opacity: isDragging ? 0 : 1,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        touchAction: "none",
        backgroundColor: CARD_BG,
        borderColor: CARD_BORDER,
        color: TEXT_DARK,
        // width: "90px",
        // height: "90px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "tajawal",
        // fontSize: "25px",
      }}
      className="px-6 py-3 rounded-xl border-2 cursor-move text-center text-base md:text-xl lg:text-2xl h-14 md:h-14 w-18 md:w-24"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1.1 }}
    >
      {item.word}
    </motion.div>
  );
}

function DroppableZone({
  id,
  title,
  children,
}: {
  id: "alif" | "other";
  title: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col min-h-[200px]">
      <h3
        className="text-center text-base md:text-xl lg:text-2xl mb-4 text-center font-bold"
        style={{
          color: TEXT_DARK,
          fontFamily: "tajawal",
          // , fontSize: "25px"
        }}
      >
        {title}
      </h3>
      <div
        ref={setNodeRef}
        className="rounded-2xl border-2 p-6 flex flex-col h-full overflow-y-auto"
        style={{
          borderColor: ZONE_BORDER,
          backgroundColor: "#ffffff",
        }}
      >
        <div
          className="flex-1 flex flex-col gap-3 justify-start items-start min-h-[120px]"
          dir="rtl"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Main Component ----------------------------- */

export function SortingGame() {
  const [items, setItems] = useState<Item[]>([]);
  const { letter } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const [config, setConfig] = useState<SortingGameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [minLoadElapsed, setMinLoadElapsed] = useState(false);
  const [startTime] = useState(Date.now());
  const [gameLessonId, setGameLessonId] = useState<number | null>(null);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [mistakeToast, setMistakeToast] = useState<string | null>(null);

  const { letters } = useSelector((state: RootState) => state.letters);
  const dispatch = useDispatch<any>();
  const currentLetterFromRedux = letters.find((l) => l.symbol === letter);

  const activeItem = useMemo(
    () => (activeId !== null ? items.find((i) => i.id === activeId) : null),
    [activeId, items],
  );

  const getDuration = () => Math.floor((Date.now() - startTime) / 1000);

  /* ------------------------------- Effects ------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadElapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!letters.length) dispatch(fetchLetters());
  }, [dispatch, letters.length]);

  useEffect(() => {
    if (!letter) return;

    const fetchGame = async () => {
      try {
        const res = await api.get(`/lessons/games-lessons/by-letter-and-type`, {
          params: { letter, gameType: "sorting" },
        });

        const game = res.data.data;
        setGameLessonId(game.game_lesson_id);
        setConfig(game.data);

        const mappedItems: Item[] = game.data.items
          .slice(0, 10)
          .map((item: any, index: number) => ({
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
  }, [letter]);

  useEffect(() => {
    if (!mistakeToast) return;
    const t = setTimeout(() => setMistakeToast(null), 1500);
    return () => clearTimeout(t);
  }, [mistakeToast]);

  useEffect(() => {
    if (!gameWon && !mistakes) return;

    const saveResult = async () => {
      try {
        await saveGameResult({
          games_lessons_id: gameLessonId!,
          score,
          duration: getDuration(),
        });
      } catch (error) {
        console.error("Error saving game result", error);
      }
    };

    saveResult();
  }, [gameWon, mistakes]);

  /* ------------------------------- DnD Setup ------------------------------ */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = Number(active.id);

    if (over && (over.id === "alif" || over.id === "other")) {
      handleDrop(over.id, itemId);
    }

    setActiveId(null);
  };

  /* -------------------------------- Logic -------------------------------- */

  const handleDrop = (zoneId: "alif" | "other", itemId: number) => {
    if (!config) return;

    const item = items.find((i) => i.id === itemId);
    if (!item || item.placed) return;

    setMoves((prev) => prev + 1);

    const isCorrect =
      (zoneId === "alif" && item.startsWithAlef) ||
      (zoneId === "other" && !item.startsWithAlef);

    if (isCorrect) {
      setScore((prev) => {
        const newScore = prev + config.scorePerCorrect;
        if (newScore >= config.items.length * config.scorePerCorrect)
          setGameWon(true);
        return newScore;
      });

      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === itemId ? { ...i, placed: true, position: zoneId } : i,
        );
        if (updated.every((i) => i.placed))
          setTimeout(() => setGameWon(true), 500);
        return updated;
      });
    } else {
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        setMistakeToast(`خطأ! عدد المحاولات ${newMistakes}/3`);
        if (newMistakes >= 3) setGameWon(true);
        return newMistakes;
      });
    }
  };

  const resetGame = () => {
    if (!config?.items?.length) return;

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
    setMoves(0);
    setGameWon(false);
    setActiveId(null);
  };

  /* -------------------------------- Derived -------------------------------- */

  const unplacedItems = items.filter((i) => !i.placed);
  const alifItems = items.filter((i) => i.placed && i.position === "alif");
  const otherItems = items.filter((i) => i.placed && i.position === "other");

  if (loading || !minLoadElapsed)
    return <GameLoadingScreen game_name={"sorting"} />;
  if (!config)
    return <div className="text-center mt-20">لا توجد بيانات للعبة</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div
        className="h-screen relative"
        dir="rtl"
        style={{
          background: "linear-gradient(120deg, #FAF6E6 30%, #FAF9F6 100%)",
        }}
      >
        {/* Header */}
        <div
          className="absolute top-0 left-0 right-0 z-30 px-6 py-4 border-b-4"
          style={{
            background: "linear-gradient(120deg, #FAF6E6 30%, #FAF9F6 100%)",
            borderBottom: "10px solid white",
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate(`/letter/${letter}/games`)}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "#FFA199",
                color: "black",
                fontSize: "25px",
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2
                className="text-xs md:text-xl lg:text-2xl"
                style={{
                  color: TEXT_DARK,
                  fontFamily: "tajawal",
                  // fontSize: "20px",
                }}
              >
                صنف الكلمات اسحب الكلمات إلى المكان الصحيح
              </h2>
            </motion.div>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: "#fbf2d1ff",
                  color: TEXT_DARK,
                  borderRadius: "15px",
                }}
              >
                <Star
                  className="w-4 md:w-5 h-4 md:h-5"
                  style={{ color: TEXT_DARK }}
                />
                <span className="text-center text-xs md:text-xl lg:text-2xl">
                  {config.items.length * config.scorePerCorrect}
                </span>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: "#fbf2d1ff",
                  color: TEXT_DARK,
                  borderRadius: "15px",
                }}
              >
                <span className="text-xs md:text-xl lg:text-2xl">
                  حركات: {moves}
                </span>
              </div>
            </div>
          </div>
        </div>

        <MistakeToast text={mistakeToast} />

        {/* Game Area */}
        <div className="absolute inset-0 pt-24 pb-8">
          <div className="max-w-6xl mx-auto h-full px-6 flex flex-col mt-8 gap-4">
            {/* Unplaced Items */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {unplacedItems.map((item) => (
                  <DraggableItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Drop Zones - جدول فاضي بدون خطوط */}
            <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
              <DroppableZone
                id="alif"
                title={`حرف ال${currentLetterFromRedux?.name}`}
              >
                {alifItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-6 py-3 rounded-xl border-2 text-xl shrink-0"
                    style={{
                      backgroundColor: CARD_BG,
                      borderColor: CARD_BORDER,
                      color: TEXT_DARK,
                      width: "100%",
                      fontFamily: "tajawal",
                      fontSize: "20px",
                    }}
                  >
                    {item.word}
                  </div>
                ))}
              </DroppableZone>
              <DroppableZone id="other" title="حروف أخرى">
                {otherItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-6 py-3 rounded-xl border-2 text-xl shrink-0"
                    style={{
                      backgroundColor: CARD_BG,
                      borderColor: CARD_BORDER,
                      color: TEXT_DARK,
                      width: "100%",
                      fontFamily: "tajawal",
                      fontSize: "20px",
                    }}
                  >
                    {item.word}
                  </div>
                ))}
              </DroppableZone>
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

      <DragOverlay>
        {activeItem ? (
          <motion.div
            className="px-6 py-3 rounded-xl border-2 cursor-move text-xl shadow-lg"
            style={{
              backgroundColor: CARD_BG,
              borderColor: CARD_BORDER,
              color: TEXT_DARK,
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
          >
            {activeItem.word}
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
