import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Award, RotateCcw, X } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
interface BalloonPopGameProps {
  onBack: () => void;
}

interface Balloon {
  id: number;
  word: string;
  startsWithAlef: boolean;
  x: number;
  y: number;
  color: string;
}

const alefWords = ['أسد', 'أرنب', 'أذن', 'أنف', 'إصبع', 'أزرق', 'أحمر', 'أخضر'];
const otherWords = ['بطة', 'تفاح', 'جمل', 'دب', 'حصان', 'زهرة', 'سمكة', 'قطة'];

const balloonColors = ['#ef4444', '#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899'];

export function BalloonPopGame() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [nextId, setNextId] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const { letter } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameOver || lives <= 0) return;

    const spawnInterval = Math.max(1500 - level * 100, 800);
    
    const interval = setInterval(() => {
      const allWords = [...alefWords, ...otherWords];
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      const startsWithAlef = alefWords.includes(randomWord);
      
      setBalloons(prev => [...prev, {
        id: nextId,
        word: randomWord,
        startsWithAlef,
        x: Math.random() * 85 + 5,
        y: 120,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)]
      }]);
      setNextId(prev => prev + 1);
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [nextId, gameOver, lives, level]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  useEffect(() => {
    if (score >= level * 50) {
      setLevel(prev => prev + 1);
    }
  }, [score, level]);

  const handleBalloonClick = (balloon: Balloon) => {
    if (balloon.startsWithAlef) {
      setScore(prev => prev + 10);
      setBalloons(prev => prev.filter(b => b.id !== balloon.id));
    } else {
      setLives(prev => prev - 1);
      setBalloons(prev => prev.filter(b => b.id !== balloon.id));
    }
  };

  const handleBalloonEscape = (balloonId: number) => {
    const balloon = balloons.find(b => b.id === balloonId);
    if (balloon && balloon.startsWithAlef) {
      setLives(prev => prev - 1);
    }
    setBalloons(prev => prev.filter(b => b.id !== balloonId));
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setBalloons([]);
    setGameOver(false);
    setLevel(1);
  };

  return (
    <div className="h-screen relative overflow-hidden" dir="rtl" style={{ backgroundColor: '#87CEEB' }}>
      {/* Clouds Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-70"
            style={{
              width: `${Math.random() * 100 + 80}px`,
              height: `${Math.random() * 40 + 30}px`,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [-50, window.innerWidth + 50],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-4 border-b-4" style={{ borderColor: '#652b82', backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/letter/${letter}/games`)}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg" style={{ backgroundColor: '#fad656' }}>
              <Star className="w-6 h-6" style={{ color: '#652b82' }} />
              <span className="text-xl" style={{ color: '#652b82' }}>{score}</span>
            </div>
            
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg" style={{ backgroundColor: '#ffffff' }}>
              <span className="text-xl" style={{ color: '#652b82' }}>
                المستوى: {level}
              </span>
            </div>

            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full"
                  style={{
                    backgroundColor: i < lives ? '#ef4444' : '#d1d5db'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 pt-24 pb-8">
        <div className="max-w-6xl mx-auto h-full relative">
          <AnimatePresence>
            {balloons.map(balloon => (
              <motion.button
                key={balloon.id}
                initial={{ y: '120%', x: `${balloon.x}%` }}
                animate={{ y: '-20%' }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 6 - level * 0.3, ease: 'linear' }}
                onAnimationComplete={() => handleBalloonEscape(balloon.id)}
                onClick={() => handleBalloonClick(balloon)}
                className="absolute cursor-pointer"
                style={{ left: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
              >
                {/* Balloon */}
                <div className="relative">
                  <svg width="100" height="120" viewBox="0 0 100 120">
                    {/* Balloon shape */}
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="40"
                      ry="50"
                      fill={balloon.color}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    {/* Balloon shine */}
                    <ellipse
                      cx="35"
                      cy="35"
                      rx="15"
                      ry="20"
                      fill="rgba(255,255,255,0.4)"
                    />
                    {/* String */}
                    <line
                      x1="50"
                      y1="100"
                      x2="50"
                      y2="110"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                  </svg>
                  
                  {/* Word on balloon */}
                  <div
                    className="absolute top-8 left-1/2 -translate-x-1/2 text-2xl px-2 py-1 rounded-lg"
                    style={{
                      color: '#ffffff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      backgroundColor: 'rgba(0,0,0,0.2)'
                    }}
                  >
                    {balloon.word}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Instructions */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-3xl px-8 py-4 shadow-xl border-4"
            style={{ borderColor: '#652b82' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl" style={{ color: '#652b82' }}>
              افرقع البالونات التي تحتوي على كلمات تبدأ بالألف!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-12 shadow-2xl border-4 max-w-md mx-4 text-center"
            style={{ borderColor: '#fad656' }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            <Award className="w-24 h-24 mx-auto mb-4" style={{ color: '#fad656' }} />
            
            <h2 className="text-4xl mb-3" style={{ color: '#652b82' }}>
              انتهت اللعبة!
            </h2>
            
            <p className="text-2xl text-gray-700 mb-2">
              نقاطك: {score}
            </p>
            <p className="text-xl text-gray-600 mb-6">
              وصلت للمستوى: {level}
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl shadow-lg text-white text-xl"
                style={{ backgroundColor: '#652b82' }}
              >
                <RotateCcw className="w-6 h-6" />
                <span>العب مرة أخرى</span>
              </button>
              
              <button
               onClick={() => navigate(`/letter/${letter}/games`)}
                className="px-8 py-4 rounded-2xl shadow-lg text-xl"
                style={{ backgroundColor: '#fad656', color: '#652b82' }}
              >
                رجوع
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
