import { useState } from "react";
import { Award, ArrowRight, RotateCcw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActivityFooter } from "./ActivityFooter";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getLetterPositionQuestions } from "../API/questions";
import { submitAnswer, calculateLessonResult } from "../API/result";
import { fetchLetters } from "../redux/reducers/lettersSlice";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { upsertUserProgress } from "../API/userProgress";
import point from "../assets/point_icon.svg";
import restart from "../assets/Icon.svg";
import vector from "../assets/vector_background.png";
import vectorEnd from "../assets/vector_end.svg";
import badegEnd from "../assets/badeg_end.svg";

export function LetterTashkeel() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null,
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { letter } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState<any>(null);
  const [totalScore, setTotalScore] = useState(0);
  const { letters } = useSelector((state: RootState) => state.letters);
  const dispatch = useDispatch<any>();
  const currentLetterFromRedux = letters.find((l) => l.symbol === letter);

  const letterId = currentLetterFromRedux?.id;

  const propLetter = letter;

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

  const saveLearnProgress = async () => {
    if (!user || !letter) return;

    await upsertUserProgress({
      letter_id: letterId,
      lesson_id: 3, // درس التعلم
      lesson_type: "tashkeel",
      score: score,
      completed: true,
    });
  };

  useEffect(() => {
    if (!letters.length) {
      dispatch(fetchLetters());
    }
  }, [dispatch, letters.length]);
  useEffect(() => {
    if (!letterId) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);

        const data = await getLetterPositionQuestions(letterId, 3);
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
  const handleAnswer = async (answer: string) => {
    if (showFeedback !== null) return; // 🔒 حماية

    try {
      const result = await submitAnswer(3, question.id, answer);

      setShowFeedback(result.is_correct ? "correct" : "wrong");

      if (result.is_correct) {
        setScore((prev) => prev + result.score);
      }

      setTimeout(async () => {
        setShowFeedback(null);

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          const data = await calculateLessonResult(3);
          setTotalScore(data.total_score);
          await saveLearnProgress();
          setShowFinishModal(true);
        }
      }, 800);
    } catch (err) {
      console.error(err);
      setShowFeedback("wrong");
    }
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
          background: "linear-gradient(120deg, #A68BB7 75%, #FFFBE8 100%)",
        }}
      ></div>

      <div className="relative z-10 h-screen flex flex-col" dir="rtl">
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
                تشكيل حرف ال{currentLetterFromRedux?.name}
              </h1>
            </motion.div>
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
                اختر التشكيل الصحيح للحرف
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
              className="bg-white rounded-3xl p-6 text-center shadow-lg relative"
              
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
                        showFeedback === "correct" ? "#FDC333" : "#ffffff",
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
                ما هو تشكيل حرف ال{currentLetterFromRedux?.name}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "fatha", symbol: "َ", label: "فتحة" },
                { id: "damma", symbol: "ُ", label: "ضمة" },
                { id: "kasra", symbol: "ِ", label: "كسرة" },
                { id: "sukun", symbol: "ْ", label: "سكون" },
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
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor:
                      selectedOption === option.id ? "#FDC333" : "#EAE4ED",
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* رمز الحركة */}
                    <div
                      className="text-4xl md:text-5xl"
                      style={{ color: "#28345F" }}
                    >
                      {propLetter === "أ" && option.id === "kasra"
                        ? "إِ"
                        : propLetter + option.symbol}
                    </div>

                    {/* النص */}
                    <h3
                      className="text-lg md:text-xl"
                      style={{ color: "#28345F" }}
                    >
                      {option.label}
                    </h3>
                  </div>
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
                    <img  src={badegEnd} />
                  </div>
                </div>
    
                {/* العنوان */}
                <h2 style={{
                      color: "#28345F",
                      fontFamily: "tajawal",
                      fontSize: "30px",
                      fontWeight: "500",
                    }}>ممتاز!</h2>
    
                {/* التفاصيل */}
                <p className="text-[#28345F] text-base mb-1" style={{
                      color: "#28345F",
                      fontFamily: "tajawal",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}>
                  نقاطك: <span className="font-semibold" style={{
                      color: "#28345F",
                      fontFamily: "tajawal",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}>{score} - 4</span>
                </p>
                {/* الأزرار */}
                <div className="flex gap-4 justify-center" style={{marginTop:"20px"}}>
    
                  <button
                    onClick={() => {
                      setShowFinishModal(false);
                      navigate(`/letter/${propLetter}/videos`);
                    }}
                    style={{backgroundColor:"#652B82"}}
                    className="px-6 py-2.5 rounded-xl text-white font-medium shadow-md hover:scale-105 transition"
                  >
                    التالي 
                  </button>
                  {/* <button
                     style={{backgroundColor:"#FDC333",color:"#652B82"}}
                    onClick={() => setShowFinishModal(false)}
                    className="px-6 py-2.5 rounded-xl text-[#28345F] font-medium shadow-md hover:scale-105 transition"
                  >
                    رجوع
                  </button> */}
                </div>
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
