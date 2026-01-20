import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, RotateCcw, Palette } from "lucide-react";
import alifImage from "figma:asset/2e7ac05d32688660f5c4551a39ee876244594961.png";
import arnabImage from "figma:asset/03193b4780b6c1663c2c79169f20584caf8b5a9c.png";
import ibraImage from "figma:asset/3a14b59d48036b9bebd2f5231af70a8fbdaea519.png";
import ustadImage from "figma:asset/216a220785407a2bc8628b1a0d3bf85089f190e1.png";
import rasImage from "figma:asset/46c822ef74d9cc21028b51d1aa52c350af43ad74.png";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { ActivityFooter } from "./ActivityFooter";
import { User } from "../types";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchVideoLesson } from "../redux/reducers/videoLessonsSlice";
import { upsertUserProgress } from "../API/userProgress";
import { fetchLetters } from "../redux/reducers/lettersSlice";
interface LearnLetters2Props {
  currentLetter?: string;
  letterName?: string;
  onBack?: () => void;
  onBackToLetters?: () => void;
  onActivityChange?: (activity: string) => void;
  user?: User;
  onLogout?: () => void;
}

// تعريف نوع YouTube Player
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function LearnLetters2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#fad656");
  const [isDrawing, setIsDrawing] = useState(false);
  const [coloringData, setColoringData] = useState<ImageData | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const playerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letterMaskRef = useRef<ImageData | null>(null);
  const { letter } = useParams<{ letter: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { video, loading } = useSelector(
    (state: RootState) => state.videoLessons,
  );
  const { letters } = useSelector((state: RootState) => state.letters);
  const currentLetterFromRedux = letters.find((l) => l.symbol === letter);

  const letterId = currentLetterFromRedux?.id;

  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);
  const saveLearnProgress = async () => {
    if (!user || !letter) return;

    await upsertUserProgress({
      letter_id: letterId,
      lesson_id: 2, // درس التعلم
      lesson_type: "write",
      score: 1,
      completed: true,
    });
  };

  useEffect(() => {
    if (!letterId) return;
    dispatch(
      fetchVideoLesson({
        letterId,
        lessonId: 2, // ⭐ هذا الفرق الوحيد
      }),
    );
  }, [letterId, dispatch]);

  // تحميل YouTube IFrame API
  useEffect(() => {
    if (!video.length) return;
    if (!window.YT || !window.YT.Player) return;

    playerRef.current = new window.YT.Player("youtube-player-2", {
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  }, [video]);

  const onPlayerStateChange = (event: any) => {
    if (event.data === 0) {
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

  // تهيئة Canvas عند الدخول لسلايد التلوين
  // useEffect(() => {
  //   if (currentSlide === 1 && canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) return;

  //     // تعيين الأبعاد
  //     const width = canvas.offsetWidth;
  //     const height = canvas.offsetHeight;
  //     canvas.width = width;
  //     canvas.height = height;

  //     // إنشاء canvas مؤقت لرسم الحرف
  //     const tempCanvas = document.createElement("canvas");
  //     tempCanvas.width = width;
  //     tempCanvas.height = height;
  //     const tempCtx = tempCanvas.getContext("2d");
  //     if (!tempCtx) return;

  //     // رسم الحرف على Canvas المؤقت
  //     tempCtx.font = `bold ${Math.min(width, height) * 0.7}px Arial`;
  //     tempCtx.textAlign = "center";
  //     tempCtx.textBaseline = "middle";
  //     tempCtx.fillStyle = "#000000";
  //     tempCtx.fillText(currentLetter.arabic, width / 2, height / 2);

  //     // حفظ mask الحرف
  //     letterMaskRef.current = tempCtx.getImageData(0, 0, width, height);

  //     // إنشاء ImageData فارغة للتلوين
  //     setColoringData(ctx.createImageData(width, height));

  //     // رسم الحرف الأولي
  //     redrawCanvas();
  //   }
  // }, [currentSlide, currentLetter.arabic]);

  useEffect(() => {
    if (currentSlide !== 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ✅ هاي هي init
    const init = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width === 0 || height === 0) return;

      // ✅ خلي أبعاد الكانفاس مساوية لـ CSS pixels (بدون dpr)
      canvas.width = width;
      canvas.height = height;

      // temp canvas للـ mask
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCtx.clearRect(0, 0, width, height);
      const isPhone = width < 768;
      const scale = isPhone ? 0.95 : 0.7;
      tempCtx.font = `bold ${Math.min(width, height) * scale}px Arial`;

      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "alphabetic";
      tempCtx.fillStyle = "#000";

      const text = currentLetter.arabic;
      const metrics = tempCtx.measureText(text);
      const ascent =
        metrics.actualBoundingBoxAscent ?? Math.min(width, height) * 0.35;
      const descent =
        metrics.actualBoundingBoxDescent ?? Math.min(width, height) * 0.15;

      const x = width / 2;
      const y = height / 2 + (ascent - descent) / 2;

      tempCtx.fillText(text, x, y);

      // ✅ mask
      letterMaskRef.current = tempCtx.getImageData(0, 0, width, height);

      // ✅ coloringData
      const fresh = ctx.createImageData(width, height);
      setColoringData(fresh);

      // ✅ ارسم فوراً (بدون انتظار state)
      redrawCanvas(fresh, width, height);
    };

    // استنى layout يثبت
    requestAnimationFrame(() => requestAnimationFrame(init));

    // راقب تغيّر الحجم
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(init);
    });
    ro.observe(canvas);

    return () => ro.disconnect();
  }, [currentSlide, currentLetter.arabic]);

  // إعادة رسم Canvas
  const redrawCanvas = (data?: ImageData, w?: number, h?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = w ?? canvas.width;
    const height = h ?? canvas.height;
    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    const toDraw = data ?? coloringData;
    if (toDraw) ctx.putImageData(toDraw, 0, 0);

    const isPhone = width < 768; // نفس breakpoint تبع md في Tailwind
    const scale = isPhone ? 0.95 : 0.7; // كبّر على الموبايل
    ctx.font = `bold ${Math.min(width, height) * scale}px Arial`;

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.strokeStyle = "#c9b39c";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const text = currentLetter.arabic;
    const metrics = ctx.measureText(text);
    const ascent =
      metrics.actualBoundingBoxAscent ?? Math.min(width, height) * 0.35;
    const descent =
      metrics.actualBoundingBoxDescent ?? Math.min(width, height) * 0.15;

    const x = width / 2;
    const y = height / 2 + (ascent - descent) / 2;

    ctx.strokeText(text, x, y);
  };

  // الحصول على إحداثيات الماوس/اللمس
  const getCoordinates = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: Math.floor(clientX - rect.left),
      y: Math.floor(clientY - rect.top),
    };
  };

  // بداية الرسم
  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords || !letterMaskRef.current) return;

    // التحقق من أن النقطة داخل الحرف
    const maskData = letterMaskRef.current.data;
    const index = (coords.y * letterMaskRef.current.width + coords.x) * 4;
    const isInsideLetter = maskData[index + 3] > 0;

    if (!isInsideLetter) return;

    setIsDrawing(true);
    drawAtPoint(coords.x, coords.y);
  };

  // الرسم
  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    drawAtPoint(coords.x, coords.y);
  };

  // رسم نقطة بفرشاة دائرية
  const drawAtPoint = (centerX: number, centerY: number) => {
    if (!coloringData || !letterMaskRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const brushSize = Math.max(28, Math.floor(Math.min(width, height) * 0.12));
    const brushRadius = brushSize / 2;

    // تحويل اللون المحدد إلى RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    };

    const color = hexToRgb(selectedColor);
    const coloringPixels = coloringData.data;
    const maskPixels = letterMaskRef.current.data;

    // رسم دائرة
    for (let dy = -brushRadius; dy <= brushRadius; dy++) {
      for (let dx = -brushRadius; dx <= brushRadius; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > brushRadius) continue;

        const x = Math.floor(centerX + dx);
        const y = Math.floor(centerY + dy);

        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        const index = (y * width + x) * 4;

        // التحقق من أن النقطة داخل الحرف
        if (maskPixels[index + 3] === 0) continue;

        // وضع اللون مباشرة
        coloringPixels[index] = color.r;
        coloringPixels[index + 1] = color.g;
        coloringPixels[index + 2] = color.b;
        coloringPixels[index + 3] = 255; // solid تماماً
      }
    }

    // تحديث العرض
    redrawCanvas();

    // التحقق من نسبة التلوين
    checkColoringCompletion();
  };

  // التحقق من اكتمال التلوين
  const checkColoringCompletion = () => {
    if (!coloringData || !letterMaskRef.current || isComplete) return;

    const coloringPixels = coloringData.data;
    const maskPixels = letterMaskRef.current.data;

    let totalPixels = 0;
    let coloredPixels = 0;

    // حساب البكسلات الملونة
    for (let i = 0; i < maskPixels.length; i += 4) {
      // إذا كانت النقطة داخل الحرف
      if (maskPixels[i + 3] > 0) {
        totalPixels++;
        // إذا كانت ملونة
        if (coloringPixels[i + 3] > 0) {
          coloredPixels++;
        }
      }
    }

    const percentage = (coloredPixels / totalPixels) * 100;

    // إذا تم تلوين 85% أو أكثر، عرض الـ feedback
    if (percentage > 99 && !isComplete) {
      setIsComplete(true);
    }
  };

  // إنهاء الرسم
  const stopDrawing = () => {
    setIsDrawing(false);
  };
useEffect(() => {
  redrawCanvas();
}, [coloringData]);

  // مسح التلوين
  const clearColoring = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  setColoringData(ctx.createImageData(canvas.width, canvas.height));
  setIsComplete(false);
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">جاري تحميل الفيديو...</p>
        <ActivityFooter
          currentLetter={letter}
          letterName={currentLetterFromRedux?.name}
        />
      </div>
    );
  }

  return (
    <div className="h-screen relative pb-24" dir="rtl">
      {/* خلفية متدرجة ملونة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-50"></div>

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

      {/* السلايد الأول: الفيديو فقط */}
      {currentSlide === 0 && (
        <div className="relative z-10 h-screen flex flex-col justify-evenly md:justify-start">
          {/* المحتوى الرئيسي */}
          <div className="flex-1 flex flex-col px-6 pt-4 pb-32 md:justify-start">
            {/* عنوان ترحيبي */}
            <motion.div
              className="text-center mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-xl md:text-4xl mb-2"
                style={{ color: "#652b82" }}
              >
                مرحباً بك في نشاط الرسم والتلوين
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                شاهد الفيديو ثم ابدأ في رسم وتلوين حرف{" "}
                {`ال${currentLetterFromRedux?.name} ` || "الألف"}
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
                  <iframe
                    id="youtube-player-2"
                    className="absolute top-0 left-0 w-full h-full"
                    src={
                      video.length > 0 && video[0]?.youtube_url
                        ? `${video[0].youtube_url}?enablejsapi=1`
                        : ""
                    }
                    title="فيديو تعليمي للحروف العربية"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  {loading && (
                    <p className="text-center py-6">جاري تحميل الفيديو...</p>
                  )}
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
                  onTouchEnd={async () => {
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
        </div>
      )}

      {/* السلايد الثاني: التلوين */}
      {currentSlide === 1 && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative z-10 h-screen flex flex-col"
        >
          {/* المحتوى */}
          <div className="flex-1 flex flex-col px-6 py-4 pb-28">
            <div className="max-w-5xl w-full mx-auto flex flex-col h-full">
              {/* العنوان */}
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1
                  className="text-3xl md:text-4xl mb-2"
                  style={{ color: "#652b82" }}
                >
                  اكتب حرف الألف
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  استخدم الألوان لكتابة الحرف
                </p>
              </motion.div>

              {/* بطاقة لوحة الرسم */}
              <motion.div
                className="bg-white rounded-3xl p-4 md:p-6 border-4 shadow-2xl flex-1 flex flex-col"
                style={{ borderColor: "#fad656" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid h-full gap-4 md:gap-6 grid-rows-[1fr_auto] md:grid-rows-1 md:grid-cols-4">
                  {/* ✅ لوحة التلوين فوق على الموبايل / يمين على الديسكتوب */}
                  <div className="md:col-span-3 flex flex-col order-1 md:order-2 min-h-[55vh] md:min-h-0">
                    <div
                      className="flex-1 relative rounded-3xl overflow-hidden border-2 border-gray-200"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full touch-none"
                        style={{ cursor: "crosshair" }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>
                  </div>

                  {/* ✅ الباليت تحت على الموبايل / يسار على الديسكتوب */}
                  <div className="flex flex-col items-stretch justify-start gap-4 order-2 md:order-1">
                    <h3 className="text-lg text-gray-600 mb-2">اختر لونك</h3>

                    <div className="grid grid-cols-6 md:grid-cols-2 gap-2 md:gap-3">
                      {[
                        { color: "#fad656", icon: null },
                        { color: "#652b82", icon: "star" },
                        { color: "#3b82f6", icon: null },
                        { color: "#ef4444", icon: null },
                        { color: "#f97316", icon: null },
                        { color: "#22c55e", icon: null },
                      ].map((item) => (
                        <motion.button
                          key={item.color}
                          onClick={() => setSelectedColor(item.color)}
                          className="relative w-full aspect-square rounded-2xl border-4 transition-all flex items-center justify-center"
                          style={{
                            backgroundColor: item.color,
                            borderColor:
                              selectedColor === item.color
                                ? "#ffffff"
                                : item.color,
                            boxShadow:
                              selectedColor === item.color
                                ? "0 0 0 4px #652b82"
                                : "none",
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {item.icon === "star" && (
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      onClick={clearColoring}
                      className="w-full px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-white mt-2 md:mt-auto"
                      style={{ backgroundColor: "#ef4444" }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>مسح الكل</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
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
        </motion.div>
      )}

      {/* Footer للأنشطة */}

      <ActivityFooter
        currentLetter={currentLetter.arabic}
        letterName={currentLetter.name}
      />

      {/* رسالة التهنئة عند اكتمال التلوين */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsComplete(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl text-center max-w-sm mx-4"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* أيقونة النجاح */}
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fad656" }}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10"
                  style={{ color: "#652b82" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </motion.div>

              {/* العنوان */}
              <motion.h2
                className="text-2xl md:text-3xl mb-2"
                style={{ color: "#652b82" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                أحسنت!
              </motion.h2>

              {/* الرسالة */}
              <motion.p
                className="text-sm md:text-base text-gray-600 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                لقد أتممت كتابة حرف {currentLetter.name} بنجاح
              </motion.p>

              {/* زر الإغلاق */}
              <motion.button
                onClick={() => setIsComplete(false)}
                className="px-6 py-2.5 rounded-xl text-white shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #652b82, #7d3ba0)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                متابعة
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
