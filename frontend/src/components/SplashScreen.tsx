import { motion } from 'motion/react';
import { useEffect } from 'react';
import tigerImg from 'figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden" dir="rtl">
      {/* خلفية متدرجة هادئة */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: 'linear-gradient(135deg, #f8f4ff 0%, #fff9e6 50%, #fef5e7 100%)' }}
      />

      {/* المحتوى */}
      <div className="relative z-10 text-center px-4 md:px-6">
        {/* النمر المتحرك */}
        <motion.div
          initial={{ scale: 0, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 150,
            damping: 12,
            duration: 1
          }}
          className="mb-6 md:mb-8"
        >
          <motion.img
            src={tigerImg}
            alt="نمر"
            className="w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 object-contain drop-shadow-2xl mx-auto"
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* العنوان */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl mb-3" style={{ color: '#652b82' }}>
            مرآتي لغتي
          </h1>
          <motion.p 
            className="text-lg md:text-xl"
            style={{ color: '#652b82', opacity: 0.7 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.7 }}
          >
            رحلة تعلم اللغة العربية
          </motion.p>
        </motion.div>

        {/* مؤشر التحميل */}
        <motion.div
          className="mt-8 md:mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center gap-1.5">
            <motion.div
              className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
              style={{ backgroundColor: '#fad656' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
              style={{ backgroundColor: '#fad656' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
              style={{ backgroundColor: '#fad656' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.4,
              }}
            />
          </div>
        </motion.div>

        {/* رسالة ترحيبية */}
        <motion.div
          className="mt-6 md:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div className="inline-block rounded-xl md:rounded-2xl px-4 py-2 md:px-5 md:py-2.5" style={{ backgroundColor: '#fad656', opacity: 0.3 }}>
            <p className="text-sm md:text-base" style={{ color: '#652b82' }}>
              ✨ استعد لمغامرة تعليمية رائعة ✨
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}