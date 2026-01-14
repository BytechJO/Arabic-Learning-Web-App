import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import alifImage from "figma:asset/2e7ac05d32688660f5c4551a39ee876244594961.png";
import arnabImage from "figma:asset/03193b4780b6c1663c2c79169f20584caf8b5a9c.png";
import ibraImage from "figma:asset/3a14b59d48036b9bebd2f5231af70a8fbdaea519.png";
import ustadImage from "figma:asset/216a220785407a2bc8628b1a0d3bf85089f190e1.png";
import rasImage from "figma:asset/46c822ef74d9cc21028b51d1aa52c350af43ad74.png";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { ActivityFooter } from "./ActivityFooter";
import { upsertUserProgress } from "../API/userProgress";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { fetchLetters } from "../redux/reducers/lettersSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoLesson,
  clearVideo,
} from "../redux/reducers/videoLessonsSlice";

// تعريف نوع YouTube Player
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function LearnLetters() {
  const [currentSlide, setCurrentSlide] = useState(0); // 0 = فيديو، 1 = محتوى الحرف
  const [videoEnded, setVideoEnded] = useState(false);
  const playerRef = useRef<any>(null);
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<any>();
  const { video, loading } = useSelector(
    (state: RootState) => state.videoLessons
  );

  const { letters } = useSelector((state: RootState) => state.letters);
  const currentLetterFromRedux = letters.find((l) => l.symbol === letter);

  const letterId = currentLetterFromRedux?.id;
console.log(letterId);

  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);
  const saveLearnProgress = async () => {
    if (!user || !letter) return;

    await upsertUserProgress({
      letter_id: letterId,
      lesson_id: 1, // درس التعلم
      lesson_type: "learn",
      score: 1,
      completed: true,
    });
  };

  useEffect(() => {
    if (!letterId) return;

    dispatch(clearVideo()); // 🔥 مهم جداً

    dispatch(
      fetchVideoLesson({
        letterId: letterId,
        lessonId: 1,
      })
    );
  }, [letterId, dispatch]);

  const getVideoId = (url: string) => {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  };
  useEffect(() => {
    if (window.YT && window.YT.Player) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  useEffect(() => {
   if (!video.length) return;
    if (!window.YT || !window.YT.Player) return;

    const videoId = getVideoId(video[0].youtube_url);
    if (!videoId) return;

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("youtube-player", {
      videoId,
      events: {
        onStateChange: onPlayerStateChange,
      },
    });

    setVideoEnded(false);
  }, [video]);

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      setVideoEnded(true);
    }
  };

  const lettersComp = [
    {
      arabic: "أ",
      name: "ألف",
      sound: "أ",
      example: "أسد",
      emoji: "🦁",
      image: alifImage,
      extraImages: [
        { img: arnabImage, label: "أرنب" },
        { img: ibraImage, label: "إبرة" },
        { img: ustadImage, label: "أستاذ" },
        { img: rasImage, label: "رأس" },
      ],
    },
    { arabic: "ب", name: "باء", sound: "ب", example: "بطة", emoji: "🦆" },
    { arabic: "ت", name: "تاء", sound: "ت", example: "تفاح", emoji: "🍎" },
    { arabic: "ث", name: "ثاء", sound: "ث", example: "ثعلب", emoji: "🦊" },
    { arabic: "ج", name: "جيم", sound: "ج", example: "جمل", emoji: "🐪" },
    { arabic: "ح", name: "حاء", sound: "ح", example: "حصان", emoji: "🐴" },
    { arabic: "خ", name: "خاء", sound: "خ", example: "خروف", emoji: "🐑" },
    { arabic: "د", name: "دال", sound: "د", example: "دب", emoji: "🐻" },
    { arabic: "ذ", name: "ذال", sound: "ذ", example: "ذئب", emoji: "🐺" },
    { arabic: "ر", name: "راء", sound: "ر", example: "رمان", emoji: "🍊" },
    { arabic: "ز", name: "زاي", sound: "ز", example: "زهرة", emoji: "🌸" },
    { arabic: "س", name: "سين", sound: "س", example: "سمكة", emoji: "🐠" },
    { arabic: "ش", name: "شين", sound: "ش", example: "شمس", emoji: "☀️" },
    { arabic: "ص", name: "صاد", sound: "ص", example: "صقر", emoji: "🦅" },
    { arabic: "ض", name: "ضاد", sound: "ض", example: "ضفدع", emoji: "🐸" },
    { arabic: "ط", name: "طاء", sound: "ط", example: "طائر", emoji: "🐦" },
    { arabic: "ظ", name: "ظاء", sound: "ظ", example: "ظرف", emoji: "✉️" },
    { arabic: "ع", name: "عين", sound: "ع", example: "عصفور", emoji: "🐤" },
    { arabic: "غ", name: "غين", sound: "غ", example: "غراب", emoji: "🦅" },
    { arabic: "ف", name: "فاء", sound: "ف", example: "فيل", emoji: "🐘" },
    { arabic: "ق", name: "قاف", sound: "ق", example: "قطة", emoji: "🐱" },
    { arabic: "ك", name: "كاف", sound: "ك", example: "كلب", emoji: "🐕" },
    { arabic: "ل", name: "لام", sound: "ل", example: "ليمون", emoji: "🍋" },
    { arabic: "م", name: "ميم", sound: "م", example: "موز", emoji: "🍌" },
    { arabic: "ن", name: "نون", sound: "ن", example: "نمر", emoji: "🐯" },
    { arabic: "ه", name: "هاء", sound: "ه", example: "هدهد", emoji: "🦜" },
    { arabic: "و", name: "واو", sound: "و", example: "وردة", emoji: "🌹" },
    { arabic: "ي", name: "ياء", sound: "ي", example: "يد", emoji: "✋" },
  ];

  const currentLetter =
    lettersComp.find((l) => l.arabic === letter) || lettersComp[0];

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };


  if (loading) {
    return <div className="text-center mt-20">جاري تحميل الفيديو...</div>;
  }

  return (
    <div className="h-screen relative overflow-hidden pb-24" dir="rtl">
      {/* زر الرجوع */}
      <motion.button
        onClick={() => navigate(`/letter/${currentLetter.arabic}`)}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-30 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl"
        style={{ backgroundColor: "#fad656" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowRight
          className="w-6 h-6 md:w-8 md:h-8"
          style={{ color: "#652b82" }}
        />
      </motion.button>

      {/* دوائر ملونة في الخلفية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: "#fad656" }}
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
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
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

      {/* السلايد الأول: الفيديو فقط */}
      {currentSlide === 0 && (
        <div className="relative z-10 h-screen flex flex-col">
          {/* المحتوى الرئيسي */}
          <div className="flex-1 flex flex-col px-6 pt-4 pb-32">
            {/* عنوان ترحيبي */}
            <motion.div
              className="text-center mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl md:text-3xl mb-1"
                style={{ color: "#652b82" }}
              >
                مرحباً بك في درس حرف {currentLetterFromRedux?.name|| "الألف"}
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                شاهد الفيديو ثم ابدأ التعلم التفاعلي
              </p>
            </motion.div>

            {/* بطاقة الفيديو */}
            <motion.div
              className="w-full max-w-[52rem] mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-4"
                style={{ borderColor: "#fad656" }}
              >
                {/* الفيديو */}
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  {loading && (
                    <p className="text-center">جاري تحميل الفيديو...</p>
                  )}
                  <div
                    id="youtube-player"
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>

              {/* زر ابدأ التعلم */}
              <motion.div
                initial={{ opacity: 1, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mt-4"
              >
                <motion.button
                  onClick={async () => {
                    if (!videoEnded) return;
                    await saveLearnProgress(); // ✅ هون المكان الصح

                    setCurrentSlide(1);
                  }}
                  disabled={!videoEnded}
                  className="px-10 py-4 rounded-2xl shadow-2xl text-white text-xl transition-all"
                  style={{
                    background: videoEnded
                      ? "linear-gradient(135deg, #652b82, #7d3ba0)"
                      : "linear-gradient(135deg, #d1d5db, #9ca3af)",
                    cursor: videoEnded ? "pointer" : "not-allowed",
                    opacity: videoEnded ? 1 : 0.6,
                  }}
                  whileHover={videoEnded ? { scale: 1.08, y: -3 } : {}}
                  whileTap={videoEnded ? { scale: 0.95 } : {}}
                  animate={
                    videoEnded
                      ? {
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 10px 40px rgba(101, 43, 130, 0.3)",
                            "0 15px 50px rgba(101, 43, 130, 0.5)",
                            "0 10px 40px rgba(101, 43, 130, 0.3)",
                          ],
                        }
                      : {}
                  }
                  transition={
                    videoEnded
                      ? {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                >
                  <span>ابدأ التعلم الآن</span>
                </motion.button>

                {videoEnded && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 text-sm text-gray-600"
                  >
                    انقر للانتقال إلى الأنشطة التفاعلية
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* النمر في الزاوية */}
          <motion.div
            className="fixed bottom-2 left-2 md:bottom-4 md:left-4 z-20"
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
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      )}

      {/* السلايد الثاني: محتوى الحرف */}
      {currentSlide === 1 && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative z-10 h-screen flex flex-col"
        >
          {/* المحتوى */}
          <div className="flex-1 flex flex-col px-6 py-4">
            <div className="max-w-5xl w-full mx-auto flex flex-col h-full">
              {/* العنوان */}
              <motion.div
                className="text-center mb-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1
                  className="text-3xl md:text-4xl mb-1"
                  style={{ color: "#652b82" }}
                >
                  تعلم حرف {currentLetter.name}
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  اضغط على الأزرار للاستماع إلى النطق
                </p>
              </motion.div>

              {/* بطاقة الحرف الرئيسية */}
              <motion.div
                className="bg-white rounded-3xl p-6 md:p-8 border-4 shadow-2xl flex-1 flex items-center"
                style={{ borderColor: "#fad656" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center w-full">
                  {/* الحرف */}
                  <div className="text-center">
                    {currentLetter.arabic === "أ" && currentLetter.image ? (
                      <motion.img
                        src={currentLetter.image}
                        alt={currentLetter.name}
                        className="w-72 h-72 md:w-96 md:h-96 object-contain mx-auto mb-4"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    ) : (
                      <motion.div
                        className="w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full flex items-center justify-center mb-4 shadow-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #fad656, #f5c842)",
                        }}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span
                          className="text-7xl md:text-8xl"
                          style={{ color: "#652b82" }}
                        >
                          {currentLetter.arabic}
                        </span>
                      </motion.div>
                    )}

                    <h2
                      className="text-2xl md:text-3xl"
                      style={{ color: "#652b82" }}
                    >
                      {currentLetter.arabic === "أ" && currentLetter.image ? (
                        <span>حرف الألف</span>
                      ) : (
                        <span>حرف {currentLetter.name}</span>
                      )}
                    </h2>
                  </div>

                  {/* الأمثلة */}
                  <div>
                    {currentLetter.arabic === "أ" &&
                    currentLetter.extraImages ? (
                      <div className="grid grid-cols-2 gap-4">
                        {currentLetter.extraImages.map((item, index) => (
                          <motion.button
                            key={index}
                            onClick={() => speak(item.label)}
                            className="cursor-pointer rounded-2xl overflow-hidden transition-all"
                            whileHover={{ scale: 1.08, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                          >
                            <img
                              src={item.img}
                              alt={item.label}
                              className="w-full h-48 md:h-56 object-contain"
                            />
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="text-7xl md:text-8xl mb-4 text-center">
                          {currentLetter.emoji}
                        </div>

                        <h3
                          className="text-3xl md:text-4xl mb-3 text-center"
                          style={{ color: "#652b82" }}
                        >
                          {currentLetter.example}
                        </h3>
                        <p className="text-gray-600 mb-4 text-lg text-center">
                          مثال على الحرف
                        </p>

                        <motion.button
                          onClick={() => speak(currentLetter.example)}
                          className="px-8 py-4 rounded-2xl border-4 flex items-center gap-3 mx-auto shadow-xl text-lg"
                          style={{
                            borderColor: "#652b82",
                            color: "#652b82",
                            backgroundColor: "white",
                          }}
                          whileHover={{ scale: 1.08, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #fad656, #f5c842)";
                            e.currentTarget.style.borderColor = "#fad656";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.borderColor = "#652b82";
                          }}
                        >
                          <span className="text-2xl">🔉</span>
                          <span>انطق المثال</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* رسالة تحفيزية */}
              <motion.div
                className="text-center mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div
                  className="bg-white rounded-3xl p-4 shadow-xl border-4"
                  style={{ borderColor: "#fad656" }}
                >
                  <p className="text-lg md:text-xl text-gray-700">
                    ✨ أحسنت! الآن جرّب الأنشطة الأخرى لتتعلم أكثر ✨
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* النمر في الزاوية */}
          <motion.div
            className="fixed bottom-2 left-2 md:bottom-4 md:left-4 z-0"
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
              className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Footer للأنشطة */}

      <ActivityFooter
        currentLetter={currentLetter.arabic}
        letterName={currentLetter.name}
      />
    </div>
  );
}
