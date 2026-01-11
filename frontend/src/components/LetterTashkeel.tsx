import { useState } from 'react';
import { Award, ArrowRight, RotateCcw, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityFooter } from './ActivityFooter';
import tigerImg from 'figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png';

interface LetterTashkeelProps {
  currentLetter?: string;
  letterName?: string;
  onBack?: () => void;
  onActivityChange?: (activity: string) => void;
  user?: any;
  onLogout?: () => void;
}

export function LetterTashkeel({ currentLetter: propLetter, letterName, onBack, onActivityChange, user, onLogout }: LetterTashkeelProps) {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  if (!propLetter || !letterName || !onBack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-base text-gray-400">اختر حرفاً من صفحة الحروف</p>
        </div>
      </div>
    );
  }

  const getQuestionsForLetter = (letter: string) => {
    const letterQuestions: { [key: string]: any[] } = {
      'أ': [
        { letter: 'أَ', sound: 'أَ (فتحة)', word: 'أَسَد', correctAnswer: 'fatha', shakl: 'فتحة' },
        { letter: 'أُ', sound: 'أُ (ضمة)', word: 'أُذُن', correctAnswer: 'damma', shakl: 'ضمة' },
        { letter: 'إِ', sound: 'إِ (كسرة)', word: 'إِبْرة', correctAnswer: 'kasra', shakl: 'كسرة' },
        { letter: 'أْ', sound: 'أْ (سكون)', word: 'مَأْوى', correctAnswer: 'sukun', shakl: 'سكون' },
      ],
      'ب': [
        { letter: 'بَ', sound: 'بَ (فتحة)', word: 'بَطَل', correctAnswer: 'fatha', shakl: 'فتحة' },
        { letter: 'بُ', sound: 'بُ (ضمة)', word: 'بُرْتُقال', correctAnswer: 'damma', shakl: 'ضمة' },
        { letter: 'بِ', sound: 'بِ (كسرة)', word: 'بِنْت', correctAnswer: 'kasra', shakl: 'كسرة' },
        { letter: 'بْ', sound: 'بْ (سكون)', word: 'صَبْر', correctAnswer: 'sukun', shakl: 'سكون' },
      ],
    };

    return letterQuestions[letter] || [
      { letter: propLetter + 'َ', sound: propLetter + 'َ (فتحة)', word: propLetter + 'َ...', correctAnswer: 'fatha', shakl: 'فتحة' },
      { letter: propLetter + 'ُ', sound: propLetter + 'ُ (ضمة)', word: propLetter + 'ُ...', correctAnswer: 'damma', shakل: 'ضمة' },
      { letter: propLetter + 'ِ', sound: propLetter + 'ِ (كسرة)', word: propLetter + 'ِ...', correctAnswer: 'kasra', shakl: 'كسرة' },
      { letter: propLetter + 'ْ', sound: propLetter + 'ْ (سكون)', word: propLetter + 'ْ...', correctAnswer: 'sukun', shakl: 'سكون' },
    ];
  };

  const questions = getQuestionsForLetter(propLetter);
  const question = questions[currentQuestion];

  const handleAnswer = (position: string) => {
    const isCorrect = position === question.correctAnswer;
    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCurrentQuestion(0);
      }
    }, 1500);
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
        onClick={onBack}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-30 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl"
        style={{ backgroundColor: '#fad656' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowRight className="w-6 h-6 md:w-8 md:h-8" style={{ color: '#652b82' }} />
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
              <h1 className="text-xl md:text-2xl mb-1" style={{ color: '#652b82' }}>
                تشكيل حرف {letterName}
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                اختر التشكيل الصحيح للحرف
              </p>
            </motion.div>

            {/* لوحة النقاط */}
            <motion.div
              className="bg-white rounded-2xl p-4 shadow-lg border-4"
              style={{ borderColor: '#fad656' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fad656' }}>
                    <Award className="w-6 h-6" style={{ color: '#652b82' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">النقاط</p>
                    <p className="text-2xl" style={{ color: '#652b82' }}>{score}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-600">السؤال</p>
                  <p className="text-xl" style={{ color: '#652b82' }}>
                    {currentQuestion + 1} / {questions.length}
                  </p>
                </div>

                <motion.button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg text-white"
                  style={{ backgroundColor: '#652b82' }}
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
              className="bg-white rounded-3xl p-6 text-center shadow-lg border-4 relative"
              style={{ borderColor: '#fad656' }}
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
                      backgroundColor: showFeedback === 'correct' ? '#fad656' : '#ffffff',
                      borderColor: showFeedback === 'correct' ? '#fad656' : '#ef4444',
                    }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      {showFeedback === 'correct' ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6 }}
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#652b82' }}
                          >
                            <Check className="w-10 h-10 text-white" />
                          </motion.div>
                          <span className="text-2xl" style={{ color: '#652b82' }}>أحسنت!</span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ rotate: [-10, 10, -10] }}
                            transition={{ duration: 0.3, repeat: 2 }}
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#ef4444' }}
                          >
                            <X className="w-10 h-10 text-white" />
                          </motion.div>
                          <span className="text-2xl text-red-600">حاول مرة أخرى</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-base md:text-lg text-gray-600 mb-4">
                ما هو تشكيل حرف <span className="text-2xl md:text-3xl" style={{ color: '#652b82' }}>{letterName}</span> في هذه الكلمة؟
              </p>
              
              <motion.div
                className="inline-block px-8 py-6 rounded-2xl mb-3"
                style={{ backgroundColor: '#fad656' }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h2 className="text-5xl md:text-6xl" style={{ color: '#652b82' }}>
                  {question.word}
                </h2>
              </motion.div>
            </motion.div>

            {/* الخيارات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'fatha', symbol: 'َ', label: 'فتحة' },
                { id: 'damma', symbol: 'ُ', label: 'ضمة' },
                { id: 'kasra', symbol: 'ِ', label: 'كسرة' },
                { id: 'sukun', symbol: 'ْ', label: 'سكون' }
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
                    borderColor: '#fad656',
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* رمز الحركة */}
                    <div className="text-4xl md:text-5xl" style={{ color: '#652b82' }}>
                      {propLetter === 'أ' && option.id === 'kasra' ? 'إِ' : propLetter + option.symbol}
                    </div>

                    {/* النص */}
                    <h3 className="text-lg md:text-xl" style={{ color: '#652b82' }}>
                      {option.label}
                    </h3>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* النمر في الزاوية */}
        <motion.div
          className="fixed bottom-28 left-2 md:bottom-32 md:left-4 z-0"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.5
          }}
        >
          <motion.img
            src={tigerImg}
            alt="نمر"
            className="w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Footer للأنشطة */}
      {onActivityChange && (
        <ActivityFooter 
          currentActivity="tashkeel" 
          onActivityChange={onActivityChange}
          onHomeClick={onBack}
          currentLetter={propLetter}
          letterName={letterName}
        />
      )}
    </div>
  );
}