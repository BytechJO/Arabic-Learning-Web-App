import { ArrowRight, Volume2, Pencil, MapPin, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { ActivityFooter } from './ActivityFooter';
import tigerImg from 'figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png';

interface GamesSectionProps {
  onBack: () => void;
  onGameSelect: (game: string) => void;
  currentLetter?: string;
  letterName?: string;
  onActivityChange?: (activity: string) => void;
}

const games = [
  {
    id: 'sounds',
    title: 'اصطد كلمات الألف',
    description: 'اصطد الكلمات التي تبدأ بحرف الألف قبل أن تختفي',
    icon: Volume2,
    color: '#652b82',
    iconBgColor: '#fad656',
  },
  {
    id: 'draw',
    title: 'ذاكرة الألف',
    description: 'اقلب البطاقات وطابق حرف الألف مع الكلمات',
    icon: Pencil,
    color: '#652b82',
    iconBgColor: '#fad656',
  },
  {
    id: 'position',
    title: 'صنف كلمات الألف',
    description: 'اسحب الكلمات للمكان الصحيح: ألف أم حروف أخرى',
    icon: MapPin,
    color: '#652b82',
    iconBgColor: '#fad656',
  },
  {
    id: 'color',
    title: 'بالونات الألف',
    description: 'افرقع البالونات التي تحتوي على كلمات تبدأ بالألف',
    icon: Palette,
    color: '#652b82',
    iconBgColor: '#fad656',
  },
];

export function GamesSection({ onBack, onGameSelect, currentLetter, letterName, onActivityChange }: GamesSectionProps) {
  return (
    <div className="h-screen relative overflow-hidden pb-24" dir="rtl">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-50"></div>
      
      {/* عناصر زخرفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-56 h-56 md:w-64 md:h-64 rounded-full opacity-10"
          style={{ backgroundColor: '#fad656' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10"
          style={{ backgroundColor: '#652b82' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>
      
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

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 h-full flex flex-col px-6 py-6">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
          {/* العنوان */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl mb-3" style={{ color: '#652b82' }}>
              ألعاب حرف الألف
            </h1>
            <p className="text-xs md:text-sm text-gray-700">
              اختر لعبة للبدء في التعلم والمرح مع حرف الألف
            </p>
          </motion.div>

          {/* شبكة الألعاب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.button
                  key={game.id}
                  onClick={() => onGameSelect(game.id)}
                  className="bg-white rounded-3xl p-6 md:p-8 border-4 shadow-xl hover:shadow-2xl transition-all text-right"
                  style={{ borderColor: game.color }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4 md:gap-6">
                    {/* الأيقونة */}
                    <motion.div
                      className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: game.iconBgColor }}
                      whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: '#652b82' }} />
                    </motion.div>

                    {/* النص */}
                    <div className="flex-1 text-right">
                      <h3 className="text-xl md:text-2xl mb-2" style={{ color: game.color }}>
                        {game.title}
                      </h3>
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                        {game.description}
                      </p>

                      {/* زر العب الآن */}
                      <motion.div
                        className="inline-flex items-center gap-2 px-5 py-2 md:px-6 md:py-3 rounded-2xl shadow-md"
                        style={{ backgroundColor: game.color, color: game.color === '#fad656' ? '#652b82' : '#ffffff' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-base md:text-lg">العب الآن</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180" />
                      </motion.div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
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
          delay: 0.5
        }}
      >
        <motion.img
          src={tigerImg}
          alt="نمر"
          className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
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

      {/* تذييل النشاط */}
      {onActivityChange && currentLetter && letterName && (
        <ActivityFooter
          currentActivity="games"
          onActivityChange={onActivityChange}
          onHomeClick={onBack}
          currentLetter={currentLetter}
          letterName={letterName}
        />
      )}
    </div>
  );
}