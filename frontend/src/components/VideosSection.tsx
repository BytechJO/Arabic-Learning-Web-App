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
import youtubeIcon from "../assets/youtoub_icon.svg";
import videoVector from "../assets/vector_video.svg";
import { SplashScreen } from "./SplashScreen";

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
  const [showSplash, setShowSplash] = useState(true);
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
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
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
  const currentVideos = video.slice(
    currentPage * videosPerPage,
    (currentPage + 1) * videosPerPage,
  );

  return (
    <div className="relative overflow-hidden pb-24" dir="rtl">
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
      <div
        className="relative z-10 flex flex-col gap-10"
        style={{ marginTop: "30px" }}
      >
        {/* المحتوى الرئيسي */}
        <div className="flex items-center justify-center ">
          <div className="flex flex-col gap-6" style={{ width: "80%" }}>
            {/* العنوان */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-base md:text-2xl lg:text-3xl mb-2"
                style={{
                  color: "#F9F9F9",
                  fontFamily: "tajawal",
                  // fontSize: "30px",
                  fontWeight: "700",
                }}
              >
                فيديوهات حرف ال{letterName || "ألف"}
              </h1>
            </motion.div>
            <div style={{ marginTop: "30px" }}>
              <motion.div
                className="text-center mb-6 flex items-start"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p
                  className="text-base md:text-xl lg:text-2xl "
                  style={{
                    color: "#FDFDFD",
                    fontFamily: "tajawal",
                    // fontSize: "25px",
                    fontWeight: "500",
                  }}
                >
                  شاهد وتعلم حرف الألف بطريقة ممتعة
                </p>
              </motion.div>
              {/* السلايدر للفيديوهات */}
              <div className="relative px-0 md:px-12">
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
                        className="h-full"
                      >
                        <a
                          href={`https://www.youtube.com/watch?v=${videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                          <div className="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl h-full transition-all">
                            {/* الزاوية الصفراء */}

                            <img
                              src={videoVector}
                              className="absolute top-0 left-0"
                            />
                            {/* القسم العلوي */}
                            <div className="flex items-center justify-center h-56">
                              <div className="bg-red-600 rounded-xl p-4">
                                <img src={youtubeIcon} />
                              </div>
                            </div>

                            {/* الخط الفاصل */}
                            <div
                              className="border-t border-gray-300"
                              style={{ color: "#0000001C" }}
                            ></div>

                            {/* القسم السفلي */}
                            <div className="p-4 text-start">
                              <h3
                                style={{
                                  color: "#28345F",
                                  fontFamily: "tajawal",
                                  fontSize: "20px",
                                  fontWeight: "500",
                                }}
                              >
                                {video.video_title}
                              </h3>

                              <p
                                style={{
                                  color: "#28345F9E",
                                  fontFamily: "tajawal",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                }}
                              >
                                {video.description}
                              </p>
                            </div>
                          </div>
                        </a>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* مؤشرات الصفحات */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-8">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`rounded-full transition-all duration-300 ${
                          currentPage === index
                            ? "w-4 h-4"
                            : "w-3 h-3 opacity-60"
                        }`}
                        style={{
                          backgroundColor:
                            currentPage === index ? "#FAD656" : "#FAD656",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer للأنشطة */}

      <ActivityFooter currentLetter={currentLetter} letterName={letterName} />
    </div>
  );
}
