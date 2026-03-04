import { motion } from "motion/react";
import {
  BookOpen,
  MapPin,
  Video,
  BookText,
  Gamepad2,
  Pen,
  ArrowRight,
} from "lucide-react";
import tigerImg from "../assets/tiger_alphabet.svg";
import { useParams, useNavigate } from "react-router-dom";
import alphabet_card from "../assets/container_alphabet.svg";
import learn from "../assets/learn_alphabet.svg";
import write from "../assets/write_alphabet.svg";
import tashkeel from "../assets/tashkeel_alphabet.svg";
import location from "../assets/location_alphabet.svg";
import videos from "../assets/videos_alphabet.svg";
import games from "../assets/games_alphabet.svg";
import alphabet_svg from "../assets/alphabet_svg.svg";
const sections = [
  {
    id: "learn",
    title: "تعلم الحرف",
    description: "تعرف على الحرف",
    bgColor: "#652b82",
    icon: learn,
  },
  {
    id: "write",
    title: "اكتب الحرف",
    description: "تعرف على الحرف",
    bgColor: "#fad656",
    icon: write,
  },
  {
    id: "position",
    title: "مكان الحرف",
    description: "حدد موقع الحرف",
    bgColor: "#fad656",
    icon: location,
  },
  {
    id: "tashkeel",
    title: "تشكيل الحرف",
    description: "تعلم الحركات",
    bgColor: "#652b82",
    icon: tashkeel,
  },
  {
    id: "videos",
    title: "فيديوهات",
    description: "شاهد وتعلم",
    bgColor: "#fad656",
    icon: videos,
  },
  {
    id: "games",
    title: "ألعاب",
    description: "العب وتعلم",
    bgColor: "#652b82",
    icon: games,
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
      <div
        className="fixed inset-0"
        style={{
          background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)",
        }}
      ></div>

      {/* دوائر زخرفية */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full opacity-10"
          style={{ backgroundColor: "#652b82" }}
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
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-10"
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
      {/*زر الرجوع للخلف العائم في الاعلى  */}
      <motion.button
        onClick={() => {
          navigate("/letters");
        }}
        className="fixed top-8 right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: "#FCFCFC" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ArrowRight
          className="w-6 h-6 md:w-7 md:h-7"
          style={{ color: "#652b82" }}
        />
      </motion.button>

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
              <img src={alphabet_card} />
              <div className="absolute top-12 left-13">
                <h1
                  style={{
                    color: "#652B82",
                    fontSize: "80px",
                    fontFamily: "amiriQuran",lineHeight:"1"
                  }}
                >
                  {letter}
                </h1>
                <h1
                  className="text-xl md:text-2xl"
                  style={{
                    color: "#652B82",
                    fontFamily: "amiriQuran",
                    fontSize: "20px",
                    fontWeight: "400",
                  }}
                >
                  حرف {letterName}
                </h1>
              </div>
            </motion.div>

            {/* اسم الحرف */}
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
                      <img src={section.icon} />
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
        className="hidden md:block fixed -top-8 left-2 md:-top-8 md:left-3 z-10"
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
          // animate={{
          //   y: [0, -8, 0],
          //   rotate: [0, 3, -3, 0],
          // }}
          // transition={{
          //   duration: 3,
          //   repeat: Infinity,
          //   ease: "easeInOut",
          // }}
        />
      </motion.div>

      <motion.div
        className="hidden md:block fixed -bottom-20 left-0 md:-bottom-20 md:left-0 z-10"
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
          src={alphabet_svg}
          alt="حروف"
          className="w-20 h-48 md:w-48 md:h-48 lg:w-48 lg:h-80 object-contain drop-shadow-2xl"
          // animate={{
          //   y: [0, -8, 0],
          //   rotate: [0, 3, -3, 0],
          // }}
          // transition={{
          //   duration: 3,
          //   repeat: Infinity,
          //   ease: "easeInOut",
          // }}
        />
      </motion.div>
    </div>
  );
}
