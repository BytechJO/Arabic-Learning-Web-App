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


interface TeacherResourcesProps {
  onBack?: () => void;
  onLogout?: () => void;
}

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
      icon: Image,
    },
    {
      id: 2,
      title: "أوراق عمل تتبع الحروف",
      description: "تدريبات لرسم الحروف",
      type: "PDF",
      pages: "35 صفحة",
      size: "3.2 MB",
      icon: FileText,
    },
    {
      id: 3,
      title: "أنشطة الأرقام العربية",
      description: "تعليم الأرقام بطريقة ممتعة",
      type: "PDF",
      pages: "15 صفحة",
      size: "1.8 MB",
      icon: BookOpen,
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
      icon: FileCheck,
    },
    {
      id: 2,
      title: "بطاقات الكلمات المصورة",
      description: "كلمات مع صور توضيحية",
      type: "PDF",
      pages: "50 صفحة",
      size: "4.5 MB",
      icon: Image,
    },
    {
      id: 3,
      title: "قوالب التقييم",
      description: "نماذج لتقييم الطلاب",
      type: "PDF",
      pages: "20 صفحة",
      size: "1.5 MB",
      icon: FileText,
    },
  ];

  const currentResources =
    selectedLibrary === "rawad"
      ? rawadResources
      : selectedLibrary === "miraty"
      ? miratyResources
      : [];
 const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-50"></div>

      {/* الهيدر */}
      <AppHeader
        showUserInfo={true}
        onLogout={handleLogout}
        showBackButton={false}
      />

      {/* زر الرجوع العائم في أعلى اليمين */}
      
        <motion.button
          onClick={()=>{
            navigate("/teacher/home")
          }}
          className="fixed top-24 right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: "#fad656" }}
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
          className="text-center py-8 md:py-10 px-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1
            className="text-4xl md:text-5xl mb-3"
            style={{ color: "#652b82" }}
          >
            موارد المعلم
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            {selectedLibrary
              ? selectedLibrary === "rawad"
                ? "مكتبة الرواد"
                : "مكتبة مرآتي لغتي"
              : "اختر مكتبة للوصول إلى الموارد التعليمية"}
          </p>
        </motion.div>

        {/* عرض المكتبات أو الموارد */}
        <div className="px-4 md:px-6 pb-8 md:pb-10">
          <div className="max-w-6xl mx-auto">
            {!selectedLibrary ? (
              // عرض أزرار المكتبات
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* مكتبة الرواد */}
                <motion.button
                  onClick={() => setSelectedLibrary("rawad")}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border-3"
                  style={{ borderWidth: "3px", borderColor: "#652b82" }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: "#fad656" }}
                    >
                      <Library
                        className="w-12 h-12 md:w-14 md:h-14"
                        style={{ color: "#652b82" }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-2xl md:text-3xl mb-2"
                        style={{ color: "#652b82" }}
                      >
                        مكتبة الرواد
                      </h3>
                      <p className="text-gray-600 text-sm">
                        موارد تعليمية متنوعة ومميزة
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-sm">اضغط للدخول</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                </motion.button>

                {/* مكتبة مرآتي لغتي */}
                <motion.button
                  onClick={() => setSelectedLibrary("miraty")}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all border-3"
                  style={{ borderWidth: "3px", borderColor: "#652b82" }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: "#fad656" }}
                    >
                      <Library
                        className="w-12 h-12 md:w-14 md:h-14"
                        style={{ color: "#652b82" }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-3xl md:text-4xl mb-2"
                        style={{ color: "#652b82" }}
                      >
                        مكتبة مرآتي لغتي
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg">
                        محتوى خاص بمنهج مرآتي لغتي
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-base md:text-lg">اضغط للدخول</span>
                      <ChevronLeft className="w-5 h-5" />
                    </div>
                  </div>
                </motion.button>
              </div>
            ) : (
              // عرض موارد المكتبة المختارة
              <div className="space-y-6">
                {/* زر الرجوع للمكتبات */}
                <motion.button
                  onClick={() => setSelectedLibrary(null)}
                  className="flex items-center gap-2 text-white px-5 py-3 rounded-xl hover:opacity-90 transition-all shadow-md"
                  style={{ backgroundColor: "#652b82" }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>العودة للمكتبات</span>
                </motion.button>

                {/* بانر معلومات */}
                <motion.div
                  className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border-2"
                  style={{ borderColor: "#652b82" }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{ backgroundColor: "#fad656" }}
                    >
                      <Printer
                        className="w-6 h-6 md:w-7 md:h-7"
                        style={{ color: "#652b82" }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-base md:text-lg mb-1.5"
                        style={{ color: "#652b82" }}
                      >
                        نصيحة للمعلمين
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        جميع الموارد قابلة للتحميل والطباعة. استخدمها في الصف
                        لتحسين تجربة التعلم
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* شبكة الموارد */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {currentResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button className="w-full h-full text-right">
                        <div
                          className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-full border-2"
                          style={{ borderColor: "#652b82" }}
                        >
                          {/* المحتوى */}
                          <div className="p-6 md:p-7">
                            {/* الأيقونة */}
                            <div className="flex justify-center mb-5">
                              <div
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: "#fad656" }}
                              >
                                <resource.icon
                                  className="w-8 h-8 md:w-10 md:h-10"
                                  style={{ color: "#652b82" }}
                                />
                              </div>
                            </div>

                            {/* العنوان */}
                            <h3
                              className="text-xl md:text-2xl mb-2 text-center"
                              style={{ color: "#652b82" }}
                            >
                              {resource.title}
                            </h3>

                            {/* الوصف */}
                            <p className="text-gray-600 text-base md:text-lg mb-4 text-center">
                              {resource.description}
                            </p>

                            {/* المعلومات */}
                            <div className="flex items-center justify-center gap-4 text-sm md:text-base text-gray-500 mb-5">
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>{resource.pages}</span>
                              </div>
                              <div className="h-3 w-px bg-gray-300"></div>
                              <div className="flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                <span>{resource.size}</span>
                              </div>
                            </div>

                            {/* شارة النوع */}
                            <div className="flex justify-center mb-4">
                              <div
                                className="text-sm md:text-base px-3 py-1.5 rounded-full shadow-md"
                                style={{
                                  backgroundColor: "#fad656",
                                  color: "#652b82",
                                }}
                              >
                                {resource.type}
                              </div>
                            </div>

                            {/* زر التحميل */}
                            <motion.div
                              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 shadow-md"
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
                          </div>
                        </div>
                      </button>
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
