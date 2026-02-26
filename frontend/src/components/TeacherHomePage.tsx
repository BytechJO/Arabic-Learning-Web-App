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
import tiger from "../assets/tiger.svg"
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
      icon: BookOpen,
      description: "تعليم الحروف العربية",
    },
    {
      id: "students",
      title: "الصفوف",
      icon: Users,
      description: "إدارة الصفوف والطلاب",
    },
    {
      id: "resources",
      title: "موارد المعلم",
      icon: GraduationCap,
      description: "نصائح ومصادر تعليمية",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0"  style={{
       background: "white",
    }}></div>

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

      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        {/* Header with Logout */}
        <div
          className="fixed top-0 left-0 right-0 shadow-md z-50 h-56"
          style={{ borderBottom: "3px solid #fad656",background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)" }}
        >
          <div className="px-4 md:px-6 py-2 md:py-2.5">
            <div className="flex items-center justify-between" dir="rtl">
              {/* اليمين - اسم التطبيق */}
              <div className="flex items-center gap-2">
                {/* اليسار - معلومات المستخدم وتسجيل الخروج */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* زر تسجيل الخروج */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white px-3 md:px-4 py-2 rounded-xl shadow-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: "white" }}
                  
                >
                  <LogOut
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                    style={{ transform: "scaleX(1)" ,color:"#652B82"}}
                  />
                  <span className="text-xs md:text-sm" style={{
                    fontFamily:"poppins",color:"#652B82",fontSize:"20px",fontWeight:"400"
                  }}>تسجيل الخروج</span>
                  
                </button>
              </div>
               
               {/*النمر الموجود بالنص */}
                           <motion.div
                             className="absolute left-2 top-0"
                             
                             initial={{ scale: 0.8, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             transition={{ duration: 0.5 }}
                           >
                             <motion.img
                               src={tiger}
                               alt="نمر"
                               className="w-56 md:w-56 lg:w-20 object-contain drop-shadow-2xl"
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
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-12 mt-20">
          <h1
            className="text-4xl md:text-5xl mb-3"
            style={{ color: "#652b82" }}
          >
            مرحباً {user?.username}
          </h1>
          <p className="text-[10px] md:text-xs text-gray-600">
            اختر القسم الذي تريد الانتقال إليه
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(`/teacher/${section.id}`)}
              className="group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-8"
              style={{
                border: "3px solid #652b82",
              }}
            >
              {/* دوائر ديكور في الخلفية */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
                style={{
                  backgroundColor: "#fad656",
                  transform: "translate(30%, -30%)",
                }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20"
                style={{
                  backgroundColor: "#fad656",
                  transform: "translate(-30%, 30%)",
                }}
              ></div>

              <div className="relative flex flex-col items-center text-center gap-4">
                {/* الأيقونة */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: "#fad656",
                  }}
                >
                  <section.icon
                    className="w-10 h-10 md:w-12 md:h-12"
                    style={{ color: "#652b82" }}
                  />
                </div>

                {/* العنوان */}
                <div>
                  <h2
                    className="text-2xl md:text-3xl mb-2"
                    style={{
                      color: "#652b82",
                    }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    {section.description}
                  </p>
                </div>

                {/* السهم */}
                <div className="mt-2">
                  <ArrowLeft className="w-6 h-6" style={{ color: "#652b82" }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
