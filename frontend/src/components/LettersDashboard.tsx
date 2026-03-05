import { motion } from "motion/react";
import { AppHeader } from "./AppHeader";
import { use, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchLetters } from "../redux/reducers/lettersSlice";
import api from "../API/axios";
import drops from "../assets/drops_login.svg";
import lock from "../assets/lockIcon.svg"
import checkIcon from "../assets/check_icon.svg"
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
  const [showLockedMessage, setShowLockedMessage] = useState(false);
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
      <div
        className="fixed inset-0"
        style={{
          background: "linear-gradient(120deg, #A68BB7 75%, #FFFBE8 100%)",
        }}
      ></div>

      {/* الهيدر - خارج أي container */}
      <div className="relative top-0 w-full">
        <div style={{ backgroundColor: "white", marginTop: "-20px" }}>
          <AppHeader
            showUserInfo={true}
            onLogout={onLogout}
            showBackButton={false}
            onBack={onBack}
            title={" الحروف العربية"}
          />
        </div>
        <img className="w-full" src={drops} />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative -top-26 z-10">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center py-8 md:py-10 px-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p
            className="text-xs md:text-sm text-gray-600"
            style={{
              fontFamily: "tajawal",
              fontSize: "25px",
              fontWeight: "700",
              color: "white",
            }}
          >
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
                  (l) => l.id === item.id,
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
                        if (isLocked && !isTeacher) {
                          setShowLockedMessage(true);
                          return;
                        }

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
                          {!isTeacher && (isCompleted || isLocked) && (
                            <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/90 shadow text-[10px] md:text-xl leading-none">
                              {isCompleted ? <img src={checkIcon} /> : <img src={lock} />}
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
      {showLockedMessage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-[90%] text-center"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* أيقونة لطيفة */}
            <div className="text-5xl mb-3">🔒</div>

            {/* النص */}
            <h2 className="text-xl mb-2" style={{ color: "#652b82" }}>
              لحظة يا بطل! 🌟
            </h2>

            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              لا يمكنك فتح هذا الحرف الآن 😊
              <br />
              أكمل الحرف الحالي وتعلّم كتابته
              <br />
              ثم ستُفتح لك باقي الحروف 🎉
            </p>

            {/* زر */}
            <button
              onClick={() => setShowLockedMessage(false)}
              className="px-6 py-2 rounded-full text-white shadow-md transition hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #652b82, #7d3ba0)",
              }}
            >
              حسناً 👍
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
