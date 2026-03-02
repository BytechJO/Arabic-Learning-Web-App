import { ClassroomManagement } from "./ClassroomManagement";
import { User } from "../types";
import { AppHeader } from "./AppHeader";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import backgroundHeader from "../assets/background_header_classroom.svg";
import tigerImg from "../assets/tiger_login.svg"
interface StudentsManagementProps {
  teacher: User;
  onHomeClick?: () => void;
  onResourcesClick?: () => void;
}

export function StudentsManagement() {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logout());

    navigate("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <div
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)",
        }}
      />
{/* عناصر زخرفية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10"
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
      {/* زر الرجوع العائم في أعلى اليمين */}

      <motion.button
        onClick={() => {
          navigate("/teacher/home");
        }}
        className="fixed top-24 right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
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
      <div className="relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex items-center justify-center">
            <img src={backgroundHeader} />
            <h1
              className="absolute top-12 text-4xl md:text-5xl mb-3 z-50"
              style={{
                color: "#652B82",
                fontFamily: "tajawal",
                fontSize: "50px",
              }}
            >
              الصفوف
            </h1>
          </div>
        </motion.div>
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
        style={{ top: "10px", left: "-5%", rotate: "50deg" }}
      >
        <img src={tigerImg} height={300} width={300} />
      </motion.div>
        {/* محتوى الصفوف */}
        <div className="px-4 md:px-6 pb-8 md:pb-10" style={{position:"relative",top:"60%",width:"100%" ,overflowY:"auto"}}>
          <div className="max-w-6xl mx-auto">
            <ClassroomManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
