import { motion } from "motion/react";
import { BookOpen, Users, ArrowLeft } from "lucide-react";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { useNavigate } from "react-router-dom";
interface ChooseAccountTypeProps {
  onChoose: (type: "teacher" | "student") => void;
}

export function ChooseAccountType({ onChoose }: ChooseAccountTypeProps) {
   const navigate = useNavigate();
     const handleChoose = (type: "student" | "teacher") => {
    onChoose(type);
    navigate(`/login/${type}`);
  };
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

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
        {/* الشعار والعنوان */}
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1
            className="text-5xl md:text-6xl lg:text-7xl mb-3"
            style={{ color: "#652b82" }}
          >
            مرآتي لغتي
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            رحلة تعلم اللغة العربية تبدأ هنا!
          </p>
        </motion.div>

        {/* بطاقات اختيار نوع المستخدم */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl w-full">
          {/* بطاقة الطالب */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <button
              onClick={() => handleChoose("student")}
              className="w-full h-full"
            >
              <div
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border-2 md:border-4 hover:shadow-2xl transition-all min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden"
                style={{ borderColor: "#652b82" }}
              >
                {/* زخرفة خلفية */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 rounded-full opacity-20"
                  style={{
                    backgroundColor: "#fad656",
                    transform: "translate(30%, -30%)",
                  }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-20"
                  style={{
                    backgroundColor: "#fad656",
                    transform: "translate(-30%, 30%)",
                  }}
                ></div>

                <motion.div
                  className="relative mb-4 md:mb-5"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full flex items-center justify-center shadow-xl"
                    style={{ backgroundColor: "#fad656" }}
                  >
                    <BookOpen
                      className="w-12 h-12 md:w-14 md:h-14"
                      style={{ color: "#652b82" }}
                    />
                  </div>
                </motion.div>

                <h2
                  className="text-3xl md:text-4xl mb-1"
                  style={{ color: "#652b82" }}
                >
                  طالب
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                  ابدأ رحلة التعلم الممتعة
                </p>

                <motion.div
                  className="mt-2 md:mt-3"
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowLeft
                    className="w-6 h-6 md:w-7 md:h-7"
                    style={{ color: "#652b82" }}
                  />
                </motion.div>
              </div>
            </button>
          </motion.div>

          {/* بطاقة المعلم */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <button
             onClick={() => handleChoose("teacher")}
              className="w-full h-full"
            >
              <div
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border-2 md:border-4 hover:shadow-2xl transition-all min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden"
                style={{ borderColor: "#652b82" }}
              >
                {/* زخرفة خلفية */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 rounded-full opacity-20"
                  style={{
                    backgroundColor: "#fad656",
                    transform: "translate(30%, -30%)",
                  }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-20"
                  style={{
                    backgroundColor: "#fad656",
                    transform: "translate(-30%, 30%)",
                  }}
                ></div>

                <motion.div
                  className="relative mb-4 md:mb-5"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full flex items-center justify-center shadow-xl"
                    style={{ backgroundColor: "#fad656" }}
                  >
                    <Users
                      className="w-12 h-12 md:w-14 md:h-14"
                      style={{ color: "#652b82" }}
                    />
                  </div>
                </motion.div>

                <h2
                  className="text-3xl md:text-4xl mb-1"
                  style={{ color: "#652b82" }}
                >
                  معلم
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                  ساعد طلابك على التعلم
                </p>

                <motion.div
                  className="mt-2 md:mt-3"
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowLeft
                    className="w-6 h-6 md:w-7 md:h-7"
                    style={{ color: "#652b82" }}
                  />
                </motion.div>
              </div>
            </button>
          </motion.div>
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
          className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
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
