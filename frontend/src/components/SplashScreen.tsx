import { motion } from "motion/react";
import { useEffect } from "react";
import tigerImg from "../assets/tiger.svg";
import alphabet from "../assets/Group 46.svg";
import "./SplashScreen.css";
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
    <div
      className="min-h-screen relative flex flex-col item-center justify-center overflow-hidden"
      dir="rtl"
    >
      {/* خلفية متدرجة هادئة */}
      <div
        className="fixed inset-0"
        style={{
          background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)",
        }}
      ></div>

      {/* عناصر زخرفية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-56 h-56 md:w-64 md:h-64 rounded-full opacity-10"
          style={{ backgroundColor: "#ffffff" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10"
          style={{ backgroundColor: "#652b82" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-30 -right-20 w-56 h-56 md:w-64 md:h-64 rounded-full opacity-10"
          style={{ backgroundColor: "#000000ff" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>
      {/* المحتوى */}
      <div className="content-container-loading-page relative z-10 text-center px-4 flex flex-row items-center justify-center gap-4">
        <div className="right-side-container-loading-page"
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {/* العنوان */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1
              className="title-container-loading-page text-4xl md:text-5xl mb-3"
              style={{
                color: "#FFFFFF",
                fontFamily: "tajawal",
                fontWeight: "700",
                fontSize: "70px",
              }}
            >
              مرآتي لغتي
            </h1>
            <motion.p
              className="subtitle1-container-loading-page text-lg md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                color: "#FFFFFF",
                fontFamily: "tajawal",
                fontWeight: "500",
                fontSize: "30px",
              }}
            >
              رحلة تعلم اللغة العربية
            </motion.p>
            <motion.p
              className="subtitle1-container-loading-page text-lg md:text-xl"
              style={{
                color: "#FFFFFF",
                fontFamily: "tajawal",
                fontWeight: "400",
                fontSize: "30px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              إستعد لمغامرة تعليمية رائعة
            </motion.p>
          </motion.div>

          {/* رسالة ترحيبية */}
          <motion.div
            className="mt-6 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <div className="inline-block rounded-xl md:rounded-2xl px-4 py-2 md:px-5 md:py-2.5">
              <img src={alphabet} />
            </div>
          </motion.div>
        </div>
        <div>
          {/* النمر المتحرك */}
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 12,
              duration: 1,
            }}
            className="mb-6 md:mb-8 flex items-left justify-center"
          >
            <motion.img
              src={tigerImg}
              alt="نمر"
              // className="w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 object-contain drop-shadow-2xl mx-auto"
              style={{ height: "70%", width: "60%" }}
              animate={{
                y: [0, -12, 0],
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
      </div>
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
            style={{ backgroundColor: "#ffcf20ff" }}
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
            style={{ backgroundColor: "#fad656" }}
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
            style={{ backgroundColor: "#fad656" }}
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
    </div>
  );
}
