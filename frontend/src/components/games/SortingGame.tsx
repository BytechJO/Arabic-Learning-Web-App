import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Star, Award, RotateCcw, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { saveGameResult } from "../../API/gameResult";
import { RootState } from "../../redux/store";
import { fetchLetters } from "../../redux/reducers/lettersSlice";
import { useDispatch, useSelector } from "react-redux";
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
        backgroundColor: "#ffffff",
        borderColor: "#652b82",
        color: "#652b82",
      }}
      className="px-8 py-4 rounded-2xl shadow-xl border-4 cursor-move text-2xl"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1.1 }}
    >
      {item.word}
    </motion.div>
  );
}

function DropZone({
  id,
  className,
  style,
  children,
}: {
  id: "left" | "right";
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <motion.div ref={setNodeRef} className={className} style={style}>
      {children}
    </motion.div>
  );
}

/* ------------------------------ Main Component ----------------------------- */

export function SortingGame() {
  const [items, setItems] = useState<Item[]>([]);
  const { letter } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const [config, setConfig] = useState<SortingGameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [gameLessonId, setGameLessonId] = useState<number | null>(null);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [mistakeToast, setMistakeToast] = useState<string | null>(null);

  const { letters } = useSelector((state: RootState) => state.letters);
  const dispatch = useDispatch<any>();

  const activeItem = useMemo(
    () => (activeId !== null ? items.find((i) => i.id === activeId) : null),
    [activeId, items]
  );

  const getDuration = () => Math.floor((Date.now() - startTime) / 1000);

  /* ------------------------------- Effects ------------------------------- */

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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = Number(active.id);

    if (over) {
      handleDrop(over.id as "left" | "right", itemId);
    }

    setActiveId(null);
  };

  /* -------------------------------- Logic -------------------------------- */

  const handleDrop = (side: "left" | "right", itemId: number) => {
    if (!config) return;

    const item = items.find((i) => i.id === itemId);
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
          i.id === itemId ? { ...i, placed: true, position: side } : i
        );

        if (updated.every((i) => i.placed)) {
          setTimeout(() => setGameWon(true), 500);
        }

        return updated;
      });
    } else {
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        setMistakeToast(`خطأ!  
          عدد المحاولات  ${newMistakes}/3`);
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
    setGameWon(false);
    setActiveId(null);
  };

  /* -------------------------------- Derived -------------------------------- */

  const unplacedItems = items.filter((i) => !i.placed);
  const leftItems = items.filter((i) => i.placed && i.position === "left");
  const rightItems = items.filter((i) => i.placed && i.position === "right");

  if (loading) return <div className="text-center mt-20">جاري تحميل اللعبة...</div>;
  if (!config) return <div className="text-center mt-20">لا توجد بيانات للعبة</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="h-screen relative" dir="rtl" style={{ backgroundColor: "#faf9f6" }}>
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

        <MistakeToast text={mistakeToast} />

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
                {unplacedItems.map((item) => (
                  <DraggableItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Drop Zones */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              <DropZone
                id="left"
                className="rounded-3xl border-4 border-dashed p-6 flex flex-col"
                style={{
                  borderColor: "#652b82",
                  backgroundColor: "rgba(101, 43, 130, 0.05)",
                }}
              >
                <h3 className="text-2xl md:text-3xl mb-4 text-center" style={{ color: "#652b82" }}>
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
              </DropZone>

              <DropZone
                id="right"
                className="rounded-3xl border-4 border-dashed p-6 flex flex-col"
                style={{
                  borderColor: "#fad656",
                  backgroundColor: "rgba(250, 214, 86, 0.1)",
                }}
              >
                <h3 className="text-2xl md:text-3xl mb-4 text-center" style={{ color: "#652b82" }}>
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
              </DropZone>
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
              <Award className="w-24 h-24 mx-auto mb-4" style={{ color: "#fad656" }} />
              <h2 className="text-4xl mb-3" style={{ color: "#652b82" }}>
                ممتاز!
              </h2>
              <p className="text-2xl text-gray-700 mb-2">نقاطك: {score}</p>
              <p className="text-xl text-gray-600 mb-6">عدد الأخطاء: {mistakes}</p>

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

      <DragOverlay>
        {activeItem ? (
          <motion.div
            className="px-8 py-4 rounded-2xl shadow-xl border-4 cursor-move text-2xl"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#652b82",
              color: "#652b82",
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.08, rotate: 5 }}
          >
            {activeItem.word}
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
