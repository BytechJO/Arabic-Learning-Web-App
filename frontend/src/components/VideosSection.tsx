import {
  Play,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { ActivityFooter } from "./ActivityFooter";
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoLesson,
  clearVideo,
} from "../redux/reducers/videoLessonsSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { fetchLetters } from "../redux/reducers/lettersSlice";
import { upsertUserProgress } from "../API/userProgress";

// فيديوهات خاصة بحرف الألف
// const alifVideos = [
//   {
//     id: 1,
//     title: 'تعلم حرف الألف',
//     description: 'تعلم نطق وكتابة حرف الألف بطريقة ممتعة',
//     thumbnail: 'https://img.youtube.com/vi/9JJLkch42kY/maxresdefault.jpg',
//     videoId: '9JJLkch42kY',
//     duration: '5:30',
//   },
//   {
//     id: 2,
//     title: 'أغنية حرف الألف',
//     description: 'أغنية تعليمية لحفظ حرف الألف',
//     thumbnail: 'https://img.youtube.com/vi/JLOxiLFUlX4/maxresdefault.jpg',
//     videoId: 'JLOxiLFUlX4',
//     duration: '3:15',
//   },
//   {
//     id: 3,
//     title: 'قصة حرف الألف',
//     description: 'قصة ممتعة عن حرف الألف',
//     thumbnail: 'https://img.youtube.com/vi/stJeoh3ty1E/maxresdefault.jpg',
//     videoId: 'stJeoh3ty1E',
//     duration: '8:20',
//   },
//   {
//     id: 4,
//     title: 'كلمات تبدأ بحرف الألف',
//     description: 'تعلم كلمات مثل: أسد، أرنب، أحمد',
//     thumbnail: 'https://img.youtube.com/vi/kW5pm41Ya5I/maxresdefault.jpg',
//     videoId: 'kW5pm41Ya5I',
//     duration: '6:45',
//   },
//   {
//     id: 5,
//     title: 'تدريبات على حرف الألف',
//     description: 'تمارين ممتعة لتعلم كتابة حرف الألف',
//     thumbnail: 'https://img.youtube.com/vi/YKQVzelXmsQ/maxresdefault.jpg',
//     videoId: 'YKQVzelXmsQ',
//     duration: '7:10',
//   },
//   {
//     id: 6,
//     title: 'حرف الألف مع الحركات',
//     description: 'تعلم حرف الألف مع الفتحة والضمة والكسرة',
//     thumbnail: 'https://img.youtube.com/vi/vPKp29Luryc/maxresdefault.jpg',
//     videoId: 'vPKp29Luryc',
//     duration: '4:50',
//   },
// ];

export function VideosSection() {
  const [currentPage, setCurrentPage] = useState(0);
  // const [progressSaved, setProgressSaved] = useState(false);
  const [videosPerPage, setVideosPerPage] = useState(3);

  const { letter } = useParams();
  const navigate = useNavigate();
  const progressSavedRef = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  const { letters } = useSelector((state: RootState) => state.letters);
  const currentLetterFromRedux = letters.find((l) => l.symbol === letter);
  const letterId = currentLetterFromRedux?.id;
  const { video, loading } = useSelector(
    (state: RootState) => state.videoLessons,
  );
  const propLetter = letter;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVideosPerPage(1); // موبايل
      } else if (window.innerWidth < 1024) {
        setVideosPerPage(2); // تابلت
      } else {
        setVideosPerPage(3); // ديسكتوب
      }
    };

    handleResize(); // تشغيل أول مرة
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchLetters());
  }, [dispatch]);

  useEffect(() => {
    if (!letterId) return;

    dispatch(clearVideo());

    dispatch(
      fetchVideoLesson({
        letterId,
        lessonId: 4,
      }),
    );
  }, [letterId, dispatch]);

  useEffect(() => {
    const saveProgress = async () => {
      if (!video || video.length === 0) return;
      if (!letterId) return;
      if (progressSavedRef.current) return;

      await upsertUserProgress({
        letter_id: letterId,
        lesson_id: 4,
        lesson_type: "video",
        score: 1,
        completed: true,
      });

      progressSavedRef.current = true;
    };

    saveProgress();
  }, [video, letterId, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl" style={{ color: "#652b82" }}>
          جاري تحميل الفيديو...
        </p>
        <ActivityFooter
          currentLetter={propLetter}
          letterName={currentLetterFromRedux?.name}
        />
      </div>
    );
  }
  if (!video || video.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">لا يوجد فيديو لهذا الدرس</p>
        <ActivityFooter
          currentLetter={propLetter}
          letterName={currentLetterFromRedux?.name}
        />
      </div>
    );
  }

  const currentLetter = letter;
  const letterName = currentLetterFromRedux?.name;
  // const videosPerPage = 3;
  const totalPages = Math.ceil(video.length / videosPerPage);
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  const currentVideos = video.slice(
    currentPage * videosPerPage,
    (currentPage + 1) * videosPerPage,
  );

  return (
    <div className="relative overflow-hidden pb-24" dir="rtl">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-50"></div>

      {/* عناصر زخرفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-56 h-56 md:w-64 md:h-64 rounded-full opacity-10"
          style={{ backgroundColor: "#fad656" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10"
          style={{ backgroundColor: "#652b82" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* زر الرجوع */}
      <motion.button
        onClick={() => navigate(`/letters`)}
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

      <div className="relative z-10 max-h-screen flex flex-col">
        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex items-center justify-center px-6 py-6">
          <div className="max-w-7xl w-full">
            {/* العنوان */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl md:text-4xl mb-2"
                style={{ color: "#652b82" }}
              >
                فيديوهات حرف ال{letterName || "ألف"}
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                شاهد وتعلم حرف الألف بطريقة ممتعة
              </p>
            </motion.div>

            {/* السلايدر للفيديوهات */}
            <div className="relative px-12">
              {/* أزرار التنقل */}
              <button
                onClick={handleNext}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                style={{ backgroundColor: "#fad656" }}
              >
                <ChevronLeft className="w-6 h-6" style={{ color: "#652b82" }} />
              </button>

              <button
                onClick={handlePrev}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                style={{ backgroundColor: "#fad656" }}
              >
                <ChevronRight
                  className="w-6 h-6"
                  style={{ color: "#652b82" }}
                />
              </button>

              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`grid gap-4 ${
                  videosPerPage === 1
                    ? "grid-cols-1"
                    : videosPerPage === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-3"
                }`}
              >
                {currentVideos.map((video, index) => {
                  const videoId = video.youtube_url.includes("embed")
                    ? video.youtube_url.split("/embed/")[1]
                    : video.youtube_url.split("v=")[1];

                  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border-2 border-white">
                          {/* صورة الفيديو */}
                          <div className="relative aspect-video overflow-hidden bg-gray-100">
                            <img
                              src={thumbnail}
                              alt={video.video_title}
                              className="w-full h-full object-cover"
                            />

                            {/* تراكب عند التمرير */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 group">
                              <motion.div
                                className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: "#fad656" }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <Play
                                  className="w-6 h-6"
                                  style={{ color: "#652b82" }}
                                  fill="#652b82"
                                />
                              </motion.div>
                            </div>

                            {/* مدة الفيديو */}
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 px-2 py-1 rounded-lg flex items-center gap-1">
                              <Clock className="w-3 h-3 text-white" />
                              <span className="text-white text-xs">
                                {video.duration}
                              </span>
                            </div>
                          </div>

                          {/* معلومات الفيديو */}
                          <div className="p-4">
                            <h3
                              className="text-base mb-1"
                              style={{ color: "#652b82" }}
                            >
                              {video.video_title}
                            </h3>
                            <p className="text-gray-600 text-xs line-clamp-2">
                              {video.description}
                            </p>

                            {/* زر المشاهدة */}
                            <div className="mt-3">
                              <div
                                className="w-full py-2 rounded-lg text-white text-center flex items-center justify-center gap-2 shadow-md text-sm"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #652b82, #7d3ba0)",
                                }}
                              >
                                <Play className="w-4 h-4" fill="white" />
                                <span>شاهد الآن</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  );
                })}
              </motion.div>

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
                  className="w-20 h-48 md:w-48 md:h-48 lg:w-48 lg:h-80 object-contain drop-shadow-2xl"
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
              {/* مؤشرات الصفحات */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className="w-3 h-3 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          currentPage === index ? "#652b82" : "#d1d5db",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer للأنشطة */}

      <ActivityFooter currentLetter={currentLetter} letterName={letterName} />
    </div>
  );
}
