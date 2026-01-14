import { LetterCard } from "./LetterCard";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { AppHeader } from "./AppHeader";
import { use, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchLetters } from "../redux/reducers/lettersSlice";
import api from "../API/axios";

import { useNavigate } from "react-router-dom";
interface LettersDashboardProps {
  // onLetterClick: (letter: string, letterName: string) => void;
  onLogout: () => void;
  onBack?: () => void;
}

// const arabicLetters = [
//   { letter: 'أ', name: 'ألف', emoji: '🦁' },
//   { letter: 'ب', name: 'باء', emoji: '🦆' },
//   { letter: 'ت', name: 'تاء', emoji: '🍎' },
//   { letter: 'ث', name: 'ثاء', emoji: '🦊' },
//   { letter: 'ج', name: 'جيم', emoji: '🐪' },
//   { letter: 'ح', name: 'حاء', emoji: '🐴' },
//   { letter: 'خ', name: 'خاء', emoji: '🐑' },
//   { letter: 'د', name: 'دال', emoji: '🐻' },
//   { letter: 'ذ', name: 'ذال', emoji: '🐺' },
//   { letter: 'ر', name: 'راء', emoji: '🍊' },
//   { letter: 'ز', name: 'زاي', emoji: '🌸' },
//   { letter: 'س', name: 'سين', emoji: '🐠' },
//   { letter: 'ش', name: 'شين', emoji: '☀️' },
//   { letter: 'ص', name: 'صاد', emoji: '🦅' },
//   { letter: 'ض', name: 'ضاد', emoji: '🐸' },
//   { letter: 'ط', name: 'طاء', emoji: '🐦' },
//   { letter: 'ظ', name: 'ظاء', emoji: '✉️' },
//   { letter: 'ع', name: 'عين', emoji: '🐤' },
//   { letter: 'غ', name: 'غين', emoji: '🦅' },
//   { letter: 'ف', name: 'فاء', emoji: '🐘' },
//   { letter: 'ق', name: 'قاف', emoji: '🐱' },
//   { letter: 'ك', name: 'كاف', emoji: '🐕' },
//   { letter: 'ل', name: 'لام', emoji: '🍋' },
//   { letter: 'م', name: 'ميم', emoji: '🍌' },
//   { letter: 'ن', name: 'نون', emoji: '🐯' },
//   { letter: 'ه', name: 'هاء', emoji: '🦜' },
//   { letter: 'و', name: 'واو', emoji: '🌹' },
//   { letter: 'ي', name: 'ياء', emoji: '✋' },
// ];

export function LettersDashboard({ onLogout, onBack }: LettersDashboardProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [lettersStatus, setLettersStatus] = useState<any[]>([]);

  const dispatch = useAppDispatch();
  const { letters, loading } = useAppSelector((state) => state.letters);
  const navigate = useNavigate();

  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);

  useEffect(() => {
    const fetchLettersStatus = async () => {
      try {
        const res = await api.get("/progress/user-status");
        console.log(res.data);

        setLettersStatus(res.data.letters);
      } catch (err) {
        console.error("Failed to fetch letters status", err);
      }
    };

    fetchLettersStatus();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">جاري تحميل الحروف...</p>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
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

      {/* الهيدر - خارج أي container */}
      <AppHeader
        showUserInfo={true}
        onLogout={onLogout}
        showBackButton={false}
        onBack={onBack}
      />

      {/* زر الرجوع العائم في أعلى اليمين */}

      <motion.button
        onClick={() => navigate(`/${user?.type}/home`)}
        className="fixed top-24 right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: "#fad656" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ArrowRight
          className="w-6 h-6 md:w-7 md:h-7"
          style={{ color: "#652b82" }}
        />
      </motion.button>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center py-8 md:py-10 px-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1
            className="text-4xl md:text-5xl mb-3"
            style={{ color: "#652b82" }}
          >
            الحروف العربية
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            اختر حرفاً لتبدأ رحلة التعلم الممتعة
          </p>
        </motion.div>

        {/* شبكة الحروف */}
        <div className="px-4 md:px-6 pb-8 md:pb-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {letters.map((item, index) => {
                const isTeacher = user?.type === "teacher";
                const letterStatus = lettersStatus.find(
                  (l) => l.id === item.id
                )?.status;

                const isLocked = letterStatus === "locked";
                const isCompleted = letterStatus === "completed";
                return (
                  <motion.div
                    key={item.symbol}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: index * 0.015,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => {
                        // if (isTeacher) return; // المعلم: عرض فقط
                        if (isLocked && !isTeacher) return;

                        navigate(`/letter/${item.symbol}`, {
                          state: { name: item.name },
                        });
                      }}
                      // disabled={isDisabled}
                      className={`w-full aspect-square relative group ${
                        isLocked || isTeacher
                          ? "cursor-default"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="absolute inset-0 bg-white rounded-lg md:rounded-xl shadow-sm group-hover:shadow-lg transition-all border border-gray-100">
                        {/* خلفية ملونة */}
                        <div
                          className="absolute inset-0 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background:
                              "linear-gradient(135deg, #fad656, #f5c842)",
                          }}
                        />

                        {/* المحتوى */}
                        <div className="relative h-full flex flex-col items-center justify-center">
                          {/* الحرف */}
                          <div
                            className="text-3xl md:text-4xl transition-colors leading-none"
                            style={{
                              color: "#652b82",
                            }}
                          >
                            {item.symbol}
                          </div>

                          {/* الاسم */}
                          <div className="text-[9px] md:text-[11px] text-gray-600 group-hover:text-white transition-colors mt-1">
                            {item.name}
                          </div>
                          {isCompleted && !isTeacher && (
                            <div className="absolute top-0 left-1 text-green-500 text-sm">
                              ✅
                            </div>
                          )}

                          {isLocked&& !isTeacher && (
                            <div className="absolute top-0 left-1 text-gray-400 text-sm">
                              🔒
                            </div>
                          )}
                        </div>

                        {/* نجمة صغيرة في الزاوية */}
                        <motion.div
                          className="absolute top-0.5 right-0.5 text-[10px] opacity-0 group-hover:opacity-100"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          ✨
                        </motion.div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* صورة النمر في الأسفل على اليسار */}
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
  );
}
