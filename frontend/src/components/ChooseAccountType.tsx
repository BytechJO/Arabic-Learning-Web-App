import { motion } from "motion/react";
import { BookOpen, Users, ArrowLeft, ArrowRight } from "lucide-react";
import tigerImg from "../assets/tiger.svg";
import { useNavigate } from "react-router-dom";
import arrowBack from "../assets/arrowBack.svg";
import teacher from "../assets/teacher.svg";
import student from "../assets/student.svg";
import "./ChooseAccountType.css";
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
      <div
        className="fixed inset-0"
        style={{
          background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)",
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center  p-4 md:p-6">
        {/* الشعار والعنوان */}
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div className="flex items-center">
            <div
              style={{
                height: "25px",
                width: "25px",
                backgroundColor: "#FDC333",
                borderRadius: "50%",
              }}
            ></div>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-3"
              style={{
                color: "#FAF9FA",
                fontFamily: "tajawal",
                fontWeight: "700",
                fontSize: "50px",
              }}
            >
              مرآتي لغتي
            </h1>{" "}
            <div
              style={{
                height: "25px",
                width: "25px",
                backgroundColor: "#FDC333",
                borderRadius: "50%",
              }}
            ></div>
          </div>
          <p
            className="text-sm md:text-base text-gray-600"
            style={{
              color: "#FAF9FA",
              fontFamily: "tajawal",
              fontWeight: "500",
              fontSize: "30px",
            }}
          >
            رحلة تعلم اللغة العربية تبدأ هنا!
          </p>
        </motion.div>

        {/* بطاقات اختيار نوع المستخدم */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl w-full">
          {/* بطاقة الطالب */}
          <motion.div
            className="relative"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
          >
            {/* 1. الحاوية الأساسية للبطاقة (البنفسجية مع المثلثات) */}
            <div
              style={{
                background: `linear-gradient(40deg, #d9d9d974 50%, transparent 50%)`,
                height: "88%",
              }}
            >
              {/* 2. صورة الشخص (يجب أن تكون شفافة PNG) */}
              <img
                src={student}
                alt="طالب"
                className="w-full h-80 object-contain z-10 scale-110 group-hover:scale-115 transition-transform duration-300"
              />
            </div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative bottom-10 w-full max-w-[300px] aspect-[3/4] flex flex-col justify-end group cursor-pointer"
            >
              {/* 3. الشريط الأصفر السفلي */}
              <div
                className="z-10 w-full p-4 md:p-4 flex items-center justify-between"
                style={{
                  backgroundColor: "#fad656",
                  borderRadius: "30px",
                }}
                onClick={() => handleChoose("student")}
              >
                {/* السهم الأيسر بتصميم "Blob" */}

                {/* النصوص */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute"
                    animate={{ x: [-3, 3, -3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-[#333]" />
                  </motion.div>
                  <img src={arrowBack} height={70} width={70} />
                </div>
                <div className="title-text-choose-page">
                  <h2
                    className="text-2xl md:text-3xl font-bold"
                    style={{
                      color: "#3E3E3E",
                      fontFamily: "tajawal",
                      fontWeight: "700",
                      fontSize: "30px",
                    }}
                  >
                    طالب
                  </h2>
                  <p
                    className="text-sm md:text-base opacity-80 font-medium"
                    style={{
                      color: "#3E3E3E",
                      fontFamily: "tajawal",
                      fontWeight: "400",
                      fontSize: "20px",
                    }}
                  >
                    إبدأ رحلة التعلم الممتعة{" "}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* بطاقة المعلم */}
          <motion.div
            className="relative"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
          >
            {/* 1. الحاوية الأساسية للبطاقة (البنفسجية مع المثلثات) */}
            <div
              style={{
                background: `linear-gradient(135deg, transparent 50%, transparent 50%),linear-gradient(320deg, #d9d9d974 50%, transparent 50%)`,
                height: "88%",
              }}
            >
              {/* 2. صورة الشخص (يجب أن تكون شفافة PNG) */}
              <img
                src={teacher}
                alt="معلم"
                className="w-full h-80 object-contain z-10 scale-110 group-hover:scale-115 transition-transform duration-300"
              />
            </div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="relative bottom-10 w-full max-w-[300px] aspect-[3/4] flex flex-col justify-end group cursor-pointer"
            >
              {/* 3. الشريط الأصفر السفلي */}
              <div
                className="z-10 w-full p-4 md:p-4 flex items-center justify-between"
                style={{
                  backgroundColor: "#fad656",
                  borderRadius: "30px",
                }}
                onClick={() => handleChoose("teacher")}
              >
                {/* السهم الأيسر بتصميم "Blob" */}

                {/* النصوص */}
                <div className="title-text-choose-page">
                  <h2
                    className="text-2xl md:text-3xl font-bold"
                    style={{
                      color: "#3E3E3E",
                      fontFamily: "tajawal",
                      fontWeight: "700",
                      fontSize: "30px",
                    }}
                  >
                    معلم
                  </h2>
                  <p
                    className="text-sm md:text-base opacity-80 font-medium"
                    style={{
                      color: "#3E3E3E",
                      fontFamily: "tajawal",
                      fontWeight: "400",
                      fontSize: "20px",
                    }}
                  >
                    ساعد طلابك على التعلم
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <img src={arrowBack} height={70} width={70} />
                  <motion.div
                    className="absolute"
                    animate={{ x: [-3, 3, -3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowLeft className="w-6 h-6 text-[#333]" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* صورة النمر في الأسفل على اليسار */}
    <motion.div
  className="tiger-choose-page absolute z-20"
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1, rotate: "50deg" }}
  transition={{
    type: "spring",
    stiffness: 100,
    damping: 15,
    delay: 0.5,
  }}
  style={{ top: "100px", left: "-3%", rotate: "50deg" }}
>
  <img src={tigerImg} height={150} width={150} />
</motion.div>
    </div>
  );
}
