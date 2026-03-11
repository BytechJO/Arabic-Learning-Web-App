import { ArrowRight, Volume2, Pencil, MapPin, Palette } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ActivityFooter } from "./ActivityFooter";
import tigerImg from "../assets/game_tiger.svg";
import { useParams, useNavigate } from "react-router-dom";
import api from "../API/axios";
import { useEffect, useState, useRef } from "react";
import { RootState } from "../redux/store";
import { fetchLetters } from "../redux/reducers/lettersSlice";
import { useDispatch, useSelector } from "react-redux";
import { upsertUserProgress } from "../API/userProgress";
import wordCatch from "../assets/wordCatch.svg";
import wordMatch from "../assets/wordMatch.svg";
import sortWord from "../assets/sorting.svg";
import balloon from "../assets/balloon.svg";
import vectorEnd from "../assets/vector_end.svg";
import badegEnd from "../assets/badeg_end.svg";
export function GamesSection() {
  const { letter } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const progressSavedRef = useRef(false);
  const [gamesCompleted, setGamesCompleted] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [gamesProgress, setGamesProgress] = useState<Record<string, boolean>>(
    {},
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { letters } = useSelector((state: RootState) => state.letters);
  const currentLetterFromRedux = letters.find((l) => l.symbol === letter);
  const letterId = currentLetterFromRedux?.id;
  const currentLetter = letter;
  const letterName = currentLetterFromRedux?.name;
  const [availableGames, setAvailableGames] = useState<string[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);

  const games = [
    {
      id: "word_catch",
      title: `اصطد كلمات ال${currentLetterFromRedux?.name}`,
      description: `اصطد الكلمات التي تبدأ بحرف ال${currentLetterFromRedux?.name} قبل أن تختفي `,
      icon: wordCatch,
      color: "#652b82",
      iconBgColor: "#fad656",
    },
    {
      id: "memory_match",
      title: `ذاكرة ال${currentLetterFromRedux?.name}`,
      description: `اقلب البطاقات وطابق حرف ال${currentLetterFromRedux?.name} مع الكلمات`,
      icon: wordMatch,
      color: "#652b82",
      iconBgColor: "#fad656",
    },
    {
      id: "sorting",
      title: `صنف كلمات ال${currentLetterFromRedux?.name}`,
      description: `اسحب الكلمات للمكان الصحيح: ${currentLetterFromRedux?.name} أم حروف أخرى`,
      icon: sortWord,
      color: "#652b82",
      iconBgColor: "#fad656",
    },
    {
      id: "balloon_pop",
      title: `بالونات ال${currentLetterFromRedux?.name}`,
      description: ` افرقع البالونات التي تحتوي على كلمات تبدأ ب ${currentLetterFromRedux?.name}`,
      icon: balloon,
      color: "#652b82",
      iconBgColor: "#fad656",
    },
  ];

  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);

  useEffect(() => {
    if (!letterId) return;
    const fetchGames = async () => {
      try {
        const res = await api.get(`/lessons/game-lesson/${letterId}/letter-id`);
        const gameTypes = res.data.data.map((g: any) => g.game_type);
        setAvailableGames(gameTypes);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchGames();
  }, [letterId]);

  useEffect(() => {
    if (!letterId) return;

    // ✅ لا تعرض المودال للمعلم
    if (user?.type === "teacher") return;
    const checkGamesCompletion = async () => {
      try {
        const res = await api.get(`/lessons/${letterId}/games/progress`);

        const { playedGamesCount, totalGames, isCompleted } = res.data;

        const trulyCompleted =
          totalGames > 0 && playedGamesCount === totalGames;
        console.log(trulyCompleted);

        setGamesCompleted(trulyCompleted);

        const modalKey = `games_complete_modal_letter_${letterId}`;

        if (trulyCompleted) {
          localStorage.setItem(modalKey, "1");

          if (!progressSavedRef.current) {
            progressSavedRef.current = true;

            await upsertUserProgress({
              letter_id: letterId,
              lesson_id: 5,
              lesson_type: "game",
              score: 1,
              completed: true,
            });
          }

          setShowCompleteModal(true);
        }
      } catch (error) {
        console.error("Error checking games progress:", error);
      }
    };

    checkGamesCompletion();
  }, [letterId, user?.type]);


  const handleGoToNextLetter = async () => {
    try {
      // الانتقال للحرف التالي
      navigate("/letters", { state: { unlockedLetter: letters[letterId].name } });
      // أو لو عندك ترتيب:
      // navigate(`/letters/${nextLetterSymbol}`);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleStayHere = () => {
    setShowCompleteModal(false);
  };

  return (
    <div className="relative overflow-hidden" dir="rtl">
      {/* خلفية متدرجة */}
      <div
        className="fixed inset-0"
        style={{
          background: "linear-gradient(120deg, #A68BB7 75%, #FFFBE8 100%)",
        }}
      ></div>

      {/* دوائر زخرفية */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-10"
          style={{ backgroundColor: "#652b82" }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -top-20 -left-20 w-56 h-56 rounded-full opacity-10"
          style={{ backgroundColor: "#652b82" }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      {/* النمر في الزاوية اليسرى العليا */}
      <motion.div
        className="absolute hidden md:block top-2 left-2 md:-top-8 md:left-3 z-10"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.5,
        }}
      >
        <motion.img
          src={tigerImg}
          alt="نمر"
          className="w-20 h-40 md:w-48 md:h-48 lg:w-48 lg:h-48 object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 h-full flex flex-col px-6 py-6">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
          {/* العنوان */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1
              className="text-3xl md:text-4xl mb-3"
              style={{
                color: "#F9F9F9",
                fontFamily: "tajawal",
                fontSize: "30px",
                fontWeight: "700",
              }}
            >
              ألعاب حرف ال{letterName}
            </h1>
          </motion.div>
          <div style={{ marginTop: "60px" }}>
            <motion.div
              className="text-center mb-8 flex items-start"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p
                className="text-xs md:text-sm text-gray-700 px-6 md:px-0"
                style={{
                  color: "#28345F",
                  fontFamily: "tajawal",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                اختر لعبة للبدء في التعلم والمرح مع حرف ال{letterName}
              </p>
            </motion.div>
            {/* شبكة الألعاب */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.map((game, index) => {
                const Icon = game.icon;
                const isAvailable =
                  loadingGames || availableGames.includes(game.id);

                return (
                  <motion.button
                    key={game.id}
                    onClick={() =>
                      isAvailable &&
                      navigate(`/letter/${currentLetter}/games/${game.id}`)
                    }
                    className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all text-right"
                    style={{ borderColor: game.color }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    // whileHover={{ scale: 1.03, y: -5 }}
                    // whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-start gap-4 md:gap-6">
                      {/* النص */}
                      <div
                        className="flex text-right p-6"
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <h3
                            className="text-xl md:text-2xl mb-2"
                            style={{
                              fontFamily: "tajawal",
                              fontSize: "25px",
                              fontWeight: "500",
                              color: "#28345F",
                            }}
                          >
                            {game.title}
                          </h3>
                          <p
                            className="text-base md:text-lg text-gray-700 leading-relaxed mb-4"
                            style={{
                              fontFamily: "tajawal",
                              fontSize: "18px",
                              fontWeight: "500",
                              color: "#28345F",
                            }}
                          >
                            {game.description}
                          </p>
                        </div>
                        {/* زر العب الآن */}
                        <motion.div
                          className="inline-flex items-center justify-center rounded-full shadow-md"
                          style={{
                            backgroundColor: game.color,
                            color:
                              game.color === "#fad656" ? "#652b82" : "#ffffff",
                            height: "46px",
                            width: "46px",
                            cursor: "pointer",
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ArrowRight className="w-6 h-6 md:w-6 md:h-6 rotate-180" />
                        </motion.div>
                      </div>
                      {/* الأيقونة */}
                      <motion.div
                        className="relative w-full h-40 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: "#FDC333" }}
                      >
                        <img
                          className="absolute -top-12"
                          style={{ height: "134%" }}
                          src={game.icon}
                        />
                      </motion.div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCompleteModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleStayHere}
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
                أحسنت!
              </motion.h2>

              {/* الرسالة */}
              <motion.p
                className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  color: "#28345F",
                  fontFamily: "tajawal",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                لقد أنهيت جميع ألعاب حرف{" "}
                <span
                  className="font-semibold"
                  style={{
                    color: "#28345F",
                    fontFamily: "amiriQuran",
                    fontSize: "25px",
                  }}
                >
                  ال{letterName}{" "}
                </span>
                <br />
                هل تود الانتقال إلى الحرف التالي؟
              </motion.p>

              {/* الأزرار */}
              <div
                className="flex gap-4 justify-center"
                style={{ marginTop: "20px" }}
              >
                <motion.button
                  onClick={handleStayHere}
                  style={{ backgroundColor: "#652B82" }}
                  className="px-6 py-2.5 rounded-xl text-white font-medium shadow-md hover:scale-105 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  البقاء هنا
                </motion.button>

                <motion.button
                  onClick={handleGoToNextLetter}
                  style={{ backgroundColor: "#FDC333", color: "#652B82" }}
                  className="px-6 py-2.5 rounded-xl text-[#28345F] font-medium shadow-md hover:scale-105 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  الانتقال
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تذييل النشاط */}

      <ActivityFooter currentLetter={currentLetter} letterName={letterName} />
    </div>
  );
}
