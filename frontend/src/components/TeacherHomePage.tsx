import {
  BookOpen,
  Users,
  GraduationCap,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import tiger from "../assets/tiger.svg";
import rectangle from "../assets/Rectangle-teacher dashboard.svg";
import rectengle_yellow from "../assets/Rectangle-recources_teacherDashborad.svg";
import booksImg from "../assets/bookes2.png";
import laptop from "../assets/labtop_teacherDashborad.svg";
import alphabet_teacher from "../assets/alphabet teacherDashboard.svg";
import backGround from "../assets/background_teacherDashbord.svg";
import { logout } from "../redux/reducers/auth";

interface TeacherHomePageProps {
  // onNavigate: (section: string) => void;
  user: User;
  onLogout: () => void;
}

export function TeacherHomePage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const sections = [
    {
      id: "letters",
      title: "الحروف",
      icon: alphabet_teacher,
      description: "تعليم الحروف العربية",
    },
    {
      id: "students",
      title: "الصفوف",
      icon: laptop,
      description: "إدارة الصفوف والطلاب",
    },
    {
      id: "resources",
      title: "موارد المعلم",
      icon: booksImg,
      description: "نصائح ومصادر تعليمية",
    },
  ];

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* خلفية متدرجة */}
     
      <div className="relative z-10 flex flex-col justify-center items-center">
        {/* Header with Logout */}
        <div
          className="shadow-md h-56 w-full shrink-0 z-50"
          style={{
            background: "linear-gradient(120deg, #A68BB7 75%, #FFFBE8 100%)",
          }}
        >
          <div className="px-4 md:px-6 py-2 md:py-2.5 overflow-hidden">
            <div className="flex items-center justify-between" dir="rtl">
              {/* اليمين - اسم التطبيق */}
              <div className="flex items-center gap-2">
                {/* اليسار - معلومات المستخدم وتسجيل الخروج */}
                <div className="flex items-center gap-3 md:gap-4">
                  {/* زر تسجيل الخروج */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl shadow-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: "white" }}
                  >
                    <LogOut
                      className="w-3.5 h-3.5 md:w-4 md:h-4"
                      style={{ transform: "scaleX(1)", color: "#652B82" }}
                    />
                    <span
                      className="text-xs md:text-lg "
                      style={{
                        fontFamily: "poppins",
                        color: "#652B82",
                        // fontSize: "20px",
                        fontWeight: "400",
                      }}
                    >
                      تسجيل الخروج
                    </span>
                  </button>
                </div>

                {/*النمر الموجود بالهيدر */}
                <motion.div
                  className="absolute left-2 top-0"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={tiger}
                    alt="نمر"
                    className="tiger-choose-page w-56 md:w-56 lg:w-20 object-contain drop-shadow-2xl"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="flex justify-center items-center gap-3">
              <div
                style={{
                  height: "25px",
                  width: "25px",
                  borderRadius: "50%",
                  backgroundColor: "#E7E7E7",
                }}
              ></div>{" "}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#E7E7E7] font-[tajawal] mb-3"
                style={{ fontSize: "clamp(22px, 5vw, 50px)", color: "#E7E7E7" }}
              >
                مرحباً{" "}
                <span
                  className="text-xl sm:text-2xl md:text-3xl font-bold"
                  style={{ fontSize: "clamp(18px, 4vw, 35px)" }}
                >
                  {user?.username}
                </span>
              </h1>
              <div
                style={{
                  height: "25px",
                  width: "25px",
                  borderRadius: "50%",
                  backgroundColor: "#E7E7E7",
                }}
              ></div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white font-[tajawal]">
              رحلة تعليم اللغة العربية تبدأ هنا
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div
            className="h-28 bg-white flex flex-col items-center justify-center shrink-0"
        style={{
          backgroundColor: "#FFFFFF",
          zIndex: "999",
          width: "100vw",
          position: "relative",
          display:"flex"
        }}
        >
          <img src={rectangle} style={{ position: "absolute", top: "-16px" }} />
          <p
            style={{
              fontSize: "20px",
              fontFamily: "tajawal",
              fontWeight: "500",
              color: "#6E5F3B",
            }}
          >
            اختر القسم الذي تريد الانتقال إليه
          </p>
        </div>

        {/* Sections Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
          style={{
            maxHeight: "calc(100vh - 360px)",
          }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(`/teacher/${section.id}`)}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-8"
            >
              <div className="relative flex flex-col items-center text-center gap-13">
                <div className="relative flex flex-col items-center justify-center">
                  <img src={rectengle_yellow} />
                  <h2
                    className="absolute"
                    style={{
                      fontSize: "25px",
                      fontFamily: "tajawal",
                      fontWeight: "500",
                      color: "#4E4E4E",
                    }}
                  >
                    {section.title}
                  </h2>
                </div>
                {/* الأيقونة */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center">
                  <img src={backGround} className="absolute h-40" />
                  <img src={section.icon} className="z-40" />
                </div>

                {/* العنوان */}
                <div>
                  <p
                    style={{
                      fontSize: "25px",
                      fontFamily: "tajawal",
                      fontWeight: "500",
                      color: "#4E4E4E",
                    }}
                  >
                    {section.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
