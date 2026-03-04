import { useState } from "react";
import { Award, ArrowRight, RotateCcw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActivityFooter } from "./ActivityFooter";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { submitAnswer, calculateLessonResult } from "../API/result";
import { getLetterPositionQuestions } from "../API/questions";
import { upsertUserProgress } from "../API/userProgress";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchLetters } from "../redux/reducers/lettersSlice";
import point from "../assets/point_icon.svg";
import restart from "../assets/Icon.svg";
import vector from "../assets/vector_background.png";
import { useRef } from "react";
export function LetterPosition() {
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null,
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { symbol } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { letters } = useSelector((state: RootState) => state.letters);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const currentLetterFromRedux = letters.find((l) => l.symbol === symbol);

  const letterId = currentLetterFromRedux?.id;

  const dispatch = useDispatch<any>();
  const propLetter = symbol;

  if (!propLetter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-base text-gray-400">اختر حرفاً من صفحة الحروف</p>
        </div>
        <ActivityFooter
          currentLetter={propLetter}
          letterName={currentLetterFromRedux?.name}
        />
      </div>
    );
  }

  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);
  const saveLearnProgress = async () => {
    if (!user || !symbol) return;

    await upsertUserProgress({
      letter_id: letterId,
      lesson_id: 12, // درس التعلم
      lesson_type: "position",
      score: score,
      completed: true,
    });
  };

  useEffect(() => {
    if (!letterId) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getLetterPositionQuestions(letterId, 12);
        setQuestions(data);
        setCurrentQuestion(0);
        setScore(0);
      } catch (error) {
        console.error("Error fetching questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [letterId]);
  // const questions = getQuestionsForLetter(propLetter);
  if (!questions.length || !questions[currentQuestion]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">جاري تحميل الأسئلة...</p>
        <ActivityFooter
          currentLetter={propLetter}
          letterName={currentLetterFromRedux?.name}
        />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const parsedQuestionText = JSON.parse(question.question_text);
  const handleAnswer = async (position: string) => {
    // 🔴 امنع أي ضغط إضافي
    if (showFeedback !== null) return;

    // 🔴 نظف أي timeout قديم
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const isCorrect = position === question.correct_answer;
    setShowFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    submitAnswer(12, question.id, position).catch(console.error);

    timeoutRef.current = setTimeout(async () => {
      setShowFeedback(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const data = await calculateLessonResult(12);
        setTotalScore(data.total_score);
        await saveLearnProgress();
        setShowFinishModal(true);
      }
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowFeedback(null);
  };

  return (
    <div className="h-screen relative overflow-hidden pb-24" dir="rtl">
      {/* خلفية متدرجة */}
      <div
        className="fixed inset-0"
        style={{
          background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)",
        }}
      ></div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col px-6 py-4 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto flex flex-col gap-4">
            {/* العنوان */}
            <motion.div
              className="text-center mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl md:text-4xl mb-2"
                style={{
                  color: "#F9F9F9",
                  fontFamily: "tajawal",
                  fontSize: "30px",
                  fontWeight: "700",
                }}
              >
                حدد مكان حرف ال{currentLetterFromRedux?.name}
              </h1>
            </motion.div>
            {/* العنوان */}
            <motion.div
              className="text-center mb-2 flex items-start"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p
                className="text-xs md:text-sm text-gray-600"
                style={{
                  color: "#FDFDFD",
                  fontFamily: "tajawal",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                اختر المكان الصحيح للحرف في الكلمة
              </p>
            </motion.div>
            {/* لوحة النقاط */}
            <motion.div
              className="bg-white rounded-2xl p-4 shadow-lg"
              style={{ backgroundColor: "#FDC333" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <img src={point} style={{ width: "20px" }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className="text-xs text-gray-600"
                      style={{
                        color: "#28345F",
                        fontFamily: "tajawal",
                        fontSize: "14",
                        fontWeight: "500",
                      }}
                    >
                      النقاط
                    </p>
                    <p
                      style={{
                        color: "#28345F",
                        fontFamily: "tajawal",
                        fontSize: "14",
                        fontWeight: "500",
                      }}
                    >
                      {score}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p
                    style={{
                      color: "#28345F",
                      fontFamily: "tajawal",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    السؤال
                  </p>
                  <p
                    style={{
                      color: "#28345F",
                      fontFamily: "tajawal",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    {currentQuestion + 1} / {questions.length}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <motion.button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-2 py-2 rounded-xl shadow-lg text-white"
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: "40px",
                      width: "40px",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={restart} style={{ width: "20px" }} />
                  </motion.button>
                  <div className="flex items-center gap-2">
                    <p
                      className="text-xs text-gray-600"
                      style={{
                        color: "#28345F",
                        fontFamily: "tajawal",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      إعادة
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* بطاقة السؤال */}
            <motion.div
              key={currentQuestion}
              className="bg-white rounded-3xl p-8 text-center shadow-lg relative"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* Feedback Overlay */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl p-6 flex items-center justify-center z-10"
                    style={{
                      backgroundColor:
                        showFeedback === "correct" ? "#fad656" : "#ffffff",
                    }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      {showFeedback === "correct" ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6 }}
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#652b82" }}
                          >
                            <Check className="w-10 h-10 text-white" />
                          </motion.div>
                          <span
                            className="text-2xl"
                            style={{ color: "#652b82" }}
                          >
                            أحسنت!
                          </span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ rotate: [-10, 10, -10] }}
                            transition={{ duration: 0.3, repeat: 2 }}
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#ef4444" }}
                          >
                            <X className="w-10 h-10 text-white" />
                          </motion.div>
                          <span className="text-2xl text-red-600">
                            حاول مرة أخرى
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p
                className="text-base md:text-lg text-gray-600 mb-4"
                style={{
                  color: "#28345F",
                  fontFamily: "tajawal",
                  fontSize: "22px",
                  fontWeight: "500",
                }}
              >
                أين يقع حرف ال{currentLetterFromRedux?.name}
                 في هذه الكلمة؟
              </p>

              <motion.div
                className="inline-block px-6 py-9 rounded-2xl shadow-lg mb-4"
                style={{
                  backgroundColor: "#FFFFFF",
                  backgroundImage: `url(${vector})`,
                  backgroundRepeat: "no-repeat",
                }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h2
                  className="text-5xl md:text-6xl"
                  style={{ color: "#28345F" }}
                >
                  {parsedQuestionText?.word}
                </h2>
              </motion.div>
            </motion.div>

            {/* الخيارات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "start", label: "البداية" },
                { id: "middle", label: "الوسط" },
                { id: "end", label: "النهاية" },
              ].map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    setSelectedOption(option.id);
                    handleAnswer(option.id);
                    // بعد 1.5 ثانية يرجع طبيعي
                    setTimeout(() => {
                      setSelectedOption(null);
                    }, 1000);
                  }}
                  disabled={showFeedback !== null}
                  className="rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all py-6"
                  style={{
                    backgroundColor:
                      selectedOption === option.id ? "#FDC333" : "#EAE4ED",
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98, backgroundColor: "#FDC333" }}
                >
                  <h3
                    className="text-xl md:text-2xl"
                    style={{ color: "#28345F" }}
                  >
                    {option.label}
                  </h3>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showFinishModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFinishModal(false)}
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
                لقد أتممت حل جميع الاسئلة
                <br />
                مجموع النقاط : {score}/ 4
              </motion.p>

              {/* زر الإغلاق */}
              <motion.button
                onClick={() => {
                  setShowFinishModal(false);
                  navigate(`/letter/${propLetter}/tashkeel`);
                }}
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
      {/* Footer للأنشطة */}

      <ActivityFooter
        currentLetter={propLetter}
        letterName={currentLetterFromRedux?.name}
      />
    </div>
  );
}
