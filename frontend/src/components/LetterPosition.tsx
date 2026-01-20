import { useState } from "react";
import { Award, ArrowRight, RotateCcw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActivityFooter } from "./ActivityFooter";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { submitAnswer, calculateLessonResult } from "../API/result";
import { getLetterPositionQuestions } from "../API/questions";
import { upsertUserProgress } from "../API/userProgress";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchLetters } from "../redux/reducers/lettersSlice";

export function LetterPosition() {
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { letters } = useSelector((state: RootState) => state.letters);
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
  // ✅ 1. تحقق فوري
  const isCorrect = position === question.correct_answer;

  // ✅ 2. عرض النتيجة فورًا
  setShowFeedback(isCorrect ? "correct" : "wrong");

  if (isCorrect) {
    setScore((prev) => prev + 1); // أو result.score
  }

  // ✅ 3. أرسل للباك إند بدون انتظار
  submitAnswer(12, question.id, position).catch((err) =>
    console.error("Submit answer error:", err)
  );

  // ✅ 4. انتقل للسؤال التالي
  setTimeout(async () => {
    setShowFeedback(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const data = await calculateLessonResult(12);
      setTotalScore(data.total_score);

      await saveLearnProgress();
      setShowFinishModal(true);
    }
  }, 1000); // ⬅️ أسرع من قبل
};


  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowFeedback(null);
  };

  return (
    <div className="h-screen relative overflow-hidden pb-24" dir="rtl">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-50"></div>

      {/* زر الرجوع */}
      <motion.button
        onClick={() => navigate("/letters")}
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

      <div className="relative z-10 h-screen flex flex-col">
        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col px-6 py-4 pb-32 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto flex flex-col gap-4">
            {/* العنوان */}
            <motion.div
              className="text-center mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl md:text-4xl mb-2"
                style={{ color: "#652b82" }}
              >
              حدد مكان حرف  ال{currentLetterFromRedux?.name}
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                اختر المكان الصحيح للحرف في الكلمة
              </p>
            </motion.div>

            {/* لوحة النقاط */}
            <motion.div
              className="bg-white rounded-2xl p-4 shadow-lg border-4"
              style={{ borderColor: "#fad656" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#fad656" }}
                  >
                    <Award className="w-6 h-6" style={{ color: "#652b82" }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">النقاط</p>
                    <p className="text-2xl" style={{ color: "#652b82" }}>
                      {score}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600">السؤال</p>
                  <p className="text-xl" style={{ color: "#652b82" }}>
                    {currentQuestion + 1} / {questions.length}
                  </p>
                </div>

                <motion.button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg text-white"
                  style={{ backgroundColor: "#652b82" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">إعادة</span>
                </motion.button>
              </div>
            </motion.div>

            {/* بطاقة السؤال */}
            <motion.div
              key={currentQuestion}
              className="bg-white rounded-3xl p-8 text-center shadow-lg border-4 relative"
              style={{ borderColor: "#fad656" }}
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
                      borderColor:
                        showFeedback === "correct" ? "#fad656" : "#ef4444",
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

              <p className="text-base md:text-lg text-gray-600 mb-4">
                أين يقع حرف{" "}
                <span
                  className="text-2xl md:text-3xl"
                  style={{ color: "#652b82" }}
                >
                  ال{currentLetterFromRedux?.name}
                </span>{" "}
                في هذه الكلمة؟
              </p>

              <motion.div
                className="inline-block px-8 py-6 rounded-2xl mb-4"
                style={{ backgroundColor: "#fad656" }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h2
                  className="text-5xl md:text-6xl"
                  style={{ color: "#652b82" }}
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
                  onClick={() => handleAnswer(option.id)}
                  disabled={showFeedback !== null}
                  className="rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all py-6 border-4 bg-white"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    borderColor: "#fad656",
                  }}
                >
                  <h3
                    className="text-xl md:text-2xl"
                    style={{ color: "#652b82" }}
                  >
                    {option.label}
                  </h3>
                </motion.button>
              ))}
            </div>
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
