import { motion } from "motion/react";
import { BookOpen, MapPin, Video, BookText, Gamepad2, Pen } from "lucide-react";
import tigerImg from "figma:asset/d844153878e904df36a1b42e94cd19505b2fa01b.png";
import { useParams, useNavigate } from "react-router-dom";

const sections = [
  {
    id: "learn",
    title: "تعلم الحرف",
    description: "تعرف على الحرف",
    bgColor: "#652b82",
    icon: BookOpen,
  },
  {
    id: "write",
    title: "اكتب الحرف",
    description: "تعرف على الحرف",
    bgColor: "#fad656",
    icon: Pen,
  },
  {
    id: "position",
    title: "مكان الحرف",
    description: "حدد موقع الحرف",
    bgColor: "#fad656",
    icon: MapPin,
  },
  {
    id: "tashkeel",
    title: "تشكيل الحرف",
    description: "تعلم الحركات",
    bgColor: "#652b82",
    icon: BookText,
  },
  {
    id: "videos",
    title: "فيديوهات",
    description: "شاهد وتعلم",
    bgColor: "#fad656",
    icon: Video,
  },
  {
    id: "games",
    title: "ألعاب",
    description: "العب وتعلم",
    bgColor: "#652b82",
    icon: Gamepad2,
  },
];

export function LetterDetails() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const letterName = letter === "أ" ? "ألف" : "";
console.log(letter);

  return (
    <div className="h-screen relative" dir="rtl">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-yellow-50 to-purple-50"></div>

      {/* دوائر زخرفية */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: "#fad656" }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "#652b82" }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: "#fad656" }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 h-full flex flex-col pt-6">
        {/* العنوان والحرف */}
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* الحرف */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* دائرة الحرف */}
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* الظل الخارجي */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{ backgroundColor: "#fad656" }}
              />

              {/* الدائرة الرئيسية */}
              <div
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #fad656 0%, #f5c842 100%)",
                }}
              >
                {/* تأثير لمعة */}
                <div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, white 0%, transparent 60%)",
                  }}
                />

                {/* الحرف */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-7xl md:text-8xl leading-none"
                    style={{
                      color: "#652b82",
                      textShadow: "0 2px 10px rgba(101, 43, 130, 0.3)",
                      transform: "translateY(12px)",
                    }}
                  >
                    {letter}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* اسم الحرف */}
            <h1
              className="text-xl md:text-2xl mt-2"
              style={{ color: "#8B7355" }}
            >
              حرف {letterName}
            </h1>
          </motion.div>
        </motion.div>

        {/* شبكة الأقسام */}
        <div className="flex-1 px-6 flex items-start justify-center pb-24">
          <div className="w-full max-w-5xl mx-auto">
            {/* البطاقات */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {sections.map((section, index) => (
                <div key={section.id} className="flex justify-center">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full max-w-[220px]"
                  >
                    <button
                      onClick={() =>
                        navigate(`/letter/${letter}/${section.id}`)
                      }
                      className="w-full group"
                    >
                      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all bg-white aspect-square">
                        {/* خلفية ألوان ناعمة */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #fef9e7, #fffbf0)",
                          }}
                        />

                        {/* دائرة ديكورية خفيفة */}
                        <div
                          className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
                          style={{
                            backgroundColor: "#fce8a3",
                          }}
                        />

                        {/* المحتوى */}
                        <div className="relative h-full flex flex-col items-center justify-center text-center gap-3 p-4">
                          {/* دائرة الأيقونة */}
                          <motion.div
                            whileHover={{
                              scale: 1.1,
                              rotate: 5,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <div
                              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                              style={{
                                backgroundColor: "#ffe082",
                              }}
                            >
                              <section.icon
                                className="w-10 h-10"
                                style={{
                                  color: "#652b82",
                                }}
                              />
                            </div>
                          </motion.div>

                          {/* العنوان */}
                          <h3
                            className="text-lg leading-tight"
                            style={{
                              color: "#652b82",
                            }}
                          >
                            {section.title}
                          </h3>

                          {/* سهم متجه لليسار */}
                          <div
                            className="text-xl opacity-60"
                            style={{
                              color: "#652b82",
                            }}
                          >
                            ←
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* النمر في الزاوية اليسرى السفلى */}
      <motion.div
        className="hidden md:block fixed bottom-2 left-2 md:bottom-3 md:left-3 z-10"
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

      {/* زر العودة للحروف في أسفل يمين الشاشة */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-20"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.6,
        }}
      >
        <motion.button
          onClick={() => navigate("/letters")}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* توهج خارجي */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl opacity-60"
            style={{ backgroundColor: "#fad656" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* الزر الرئيسي */}
          <div
            className="relative flex flex-col items-center justify-center gap-2 w-24 h-24 md:w-28 md:h-28 rounded-full shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #fad656 0%, #f5c842 100%)",
            }}
          >
            {/* تأثير لمعة متحركة */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
              }}
              animate={{
                x: ["-200%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* الأيقونة */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <BookText
                className="w-8 h-8 relative"
                style={{ color: "#652b82" }}
              />
            </motion.div>

            {/* النص */}
            <span
              className="relative text-base md:text-lg"
              style={{ color: "#652b82" }}
            >
              الحروف
            </span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
