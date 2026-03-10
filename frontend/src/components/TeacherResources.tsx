import {
  Download,
  FileText,
  Image,
  BookOpen,
  Printer,
  FileCheck,
  ArrowRight,
  Library,
  ChevronLeft,
} from "lucide-react";
import { motion } from "motion/react";
import { AppHeader } from "./AppHeader";
// import { User } from '../types';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/reducers/auth";
import tiger from "../assets/tiger.svg";
import rectangle from "../assets/Rectangle-teacher dashboard.svg";
import bookLaibrary from "../assets/books_laibrarey.svg";
import rectengle_yellow from "../assets/Rectangle-recources_teacherDashborad.svg";
import backGround from "../assets/PDF_background.svg";
import backgroundMain from "../assets/background_teacherDashbord.svg";
import alphabet_Card from "../assets/alphabet Card.svg";
import cheatsheet from "../assets/cheatsheet.svg";
import activeties from "../assets/activeties.svg";
import evaluation from "../assets/evaluation.svg";
import wordCard from "../assets/Word_card.svg";
import planImg from "../assets/Plan_img.svg";
export function TeacherResources() {
  const [selectedLibrary, setSelectedLibrary] = useState<
    "rawad" | "miraty" | null
  >(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const rawadResources = [
    {
      id: 1,
      title: "بطاقات الحروف العربية",
      description: "بطاقات ملونة لجميع الحروف",
      type: "PDF",
      pages: "28 صفحة",
      size: "2.5 MB",
      icon: cheatsheet,
    },
    {
      id: 2,
      title: "أوراق عمل تتبع الحروف",
      description: "تدريبات لرسم الحروف",
      type: "PDF",
      pages: "35 صفحة",
      size: "3.2 MB",
      icon: alphabet_Card,
    },
    {
      id: 3,
      title: "أنشطة الأرقام العربية",
      description: "تعليم الأرقام بطريقة ممتعة",
      type: "PDF",
      pages: "15 صفحة",
      size: "1.8 MB",
      icon: activeties,
    },
  ];

  const miratyResources = [
    {
      id: 1,
      title: "خطة الدرس: الأسبوع 1-4",
      description: "خطة شاملة للأسابيع الأولى",
      type: "PDF",
      pages: "20 صفحة",
      size: "2.1 MB",
      icon: planImg,
    },
    {
      id: 2,
      title: "بطاقات الكلمات المصورة",
      description: "كلمات مع صور توضيحية",
      type: "PDF",
      pages: "50 صفحة",
      size: "4.5 MB",
      icon: wordCard,
    },
    {
      id: 3,
      title: "قوالب التقييم",
      description: "نماذج لتقييم الطلاب",
      type: "PDF",
      pages: "20 صفحة",
      size: "1.5 MB",
      icon: evaluation,
    },
  ];

  const currentResources =
    selectedLibrary === "rawad"
      ? rawadResources
      : selectedLibrary === "miraty"
        ? miratyResources
        : [];
 
  return (
    <div
      className="min-h-screen relative flex flex-col overflow-hidden"
      dir="rtl"
    >
      {/* الهيدر */}
      <div
        className="shadow-md h-56 shrink-0"
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
                {currentResources.length === 0 ?  (
                  <motion.button
                    onClick={() => {
                      navigate("/teacher/home");
                    }}
                    className="fixed top-4 right-6 z-30 w-12 h-12 md:w-12 md:h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
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
                ) :(
                  <motion.button
                    onClick={() => setSelectedLibrary(null)}
                    className="fixed top-4 right-6 z-30 w-12 h-12 md:w-12 md:h-12 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
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
                ) }
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
              style={{ fontSize: "clamp(22px, 5vw, 50px)", color: "#FAF9FA" }}
            >
              موارد المعلم
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
      {/*subheader */}
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
       
          {selectedLibrary ? (
            <p
              style={{
                fontSize: "20px",
                fontFamily: "tajawal",
                fontWeight: "500",
                color: "#6E5F3B",
              alignSelf:"flex-start",
              marginRight:"20px"
              }}
            >
              جميع المواد قابلة للتحميل والطباعة، استخدمها في الصف لتحسين تجربة
              التعلم
            </p>
          ) : (
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
          )}
    
      </div>
      {/* المحتوى الرئيسي */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-10">
        {/* عرض المكتبات أو الموارد */}
        <div className="px-4 md:px-6 pb-8 md:pb-10">
          <div className="max-w-2xl mx-auto">
            {!selectedLibrary ? (
              // عرض أزرار المكتبات
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* مكتبة الرواد */}
                <motion.button
                  onClick={() => setSelectedLibrary("rawad")}
                  className="bg-white rounded-3xl shadow-2xl hover:shadow-xl transition-all"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                        مكتبة الرواد
                      </h2>
                    </div>
                    {/* الأيقونة */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center">
                      <img src={backgroundMain} className="absolute h-40" />
                      <img src={bookLaibrary} className="z-50" />
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
                        مواد تعليمية متنوعة ومميزة{" "}
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* مكتبة مرآتي لغتي */}
                <motion.button
                  onClick={() => setSelectedLibrary("miraty")}
                  className="bg-white rounded-3xl p-2 shadow-lg hover:shadow-xl transition-all"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                        مكتبة مرآتي لغتي
                      </h2>
                    </div>
                    {/* الأيقونة */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center">
                      <img src={backgroundMain} className="absolute h-40" />
                      <img src={bookLaibrary} className="z-50" />
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
                        محتوى خاص بمنهج مرآتي لغتي{" "}
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            ) : (
              // عرض موارد المكتبة المختارة
              <div className="space-y-6">
                {/* شبكة الموارد */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  style={{ marginBottom: "-36px" }}
                >
                  {currentResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      style={{height:"400px",width:"330px",justifyContent:"center"}}
                    >
                      <button className="w-full h-ful" >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                          <div className="relative flex flex-col items-center text-center">
                            <div className="relative flex items-center" style={{width:"100%",justifyContent:"space-between"}}>
                              <h2
                                // className="absolute"
                                style={{
                                  fontSize: "18px",
                                  fontFamily: "tajawal",
                                  fontWeight: "500",
                                  color: "#4E4E4E",
                                  marginRight:"20px"
                                }}
                              >
                                {resource.title}
                              </h2>

                              {/* شارة النوع */}
                              <div className="relative flex justify-center items-center left-0 top-0">
                                <img src={backGround} />
                                <div
                                  className="absolute text-sm md:text-base px-3 py-1.5"
                                  style={{
                                    color: "#4E4E4E",
                                    fontFamily: "tajawal",
                                    fontSize: "25px",
                                  }}
                                >
                                  {resource.type}
                                </div>
                              </div>
                            </div>

                            {/* العنوان */}
                            <div className="flex flex-col justify-center items-center">
                              <img
                                src={resource.icon}
                                style={{ height: "200px" }}
                              />
                              <p
                                style={{
                                  fontSize: "20px",
                                  fontFamily: "tajawal",
                                  fontWeight: "500",
                                  color: "#4E4E4E",
                                }}
                              >
                                {resource.description}
                              </p>
                            </div>
                            {/* المعلومات */}
                            <div
                              className="flex items-center justify-between gap-4 text-sm md:text-base text-gray-500 mb-5"
                              style={{
                                width: "100%",
                                justifyContent: "space-evenly",
                              }}
                            >
                              <div className="flex items-center gap-1">
                                <span>{resource.pages}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <Download className="w-4 h-4" color="#652B82" />
                                <span>{resource.size}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* زر التحميل */}
                      <motion.div
                        className="w-full py-3 rounded flex items-center justify-center gap-2 shadow-md"
                        style={{
                          backgroundColor: "#652b82",
                          color: "white",
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Download className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-base md:text-lg">
                          تحميل المورد
                        </span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
