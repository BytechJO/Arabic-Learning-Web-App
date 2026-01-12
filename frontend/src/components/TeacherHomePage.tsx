import { BookOpen, Users, GraduationCap, LogOut, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { User } from "../types";

interface TeacherHomePageProps {
  // onNavigate: (section: string) => void;
  user: User;
  onLogout: () => void;
}

export function TeacherHomePage({  user, onLogout }: TeacherHomePageProps) {
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
      id: "teachers",
      title: "موارد المعلم",
      icon: GraduationCap,
      description: "نصائح ومصادر تعليمية",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متدرجة */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-50"></div>
      
      {/* عناصر زخرفية متحركة */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-56 h-56 md:w-64 md:h-64 rounded-full opacity-10"
          style={{ backgroundColor: '#fad656' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-10"
          style={{ backgroundColor: '#652b82' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        {/* Header with Logout */}
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50" style={{ borderBottom: '3px solid #fad656' }}>
          <div className="px-4 md:px-6 py-2 md:py-2.5">
            <div className="flex items-center justify-between" dir="rtl">
              {/* اليمين - اسم التطبيق */}
              <div className="flex items-center gap-2">
                <div className="text-xl md:text-2xl" style={{ color: '#652b82' }}>
                  <span className="font-bold">مرآتي لغتي</span>
                </div>
              </div>
              
              {/* اليسار - معلومات المستخدم وتسجيل الخروج */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* معلومات الحساب */}
                <div className="flex items-center gap-2">
                  {/* أيقونة الحساب */}
                  <div 
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #fad656, #f5c842)' }}
                  >
                    <GraduationCap className="w-5 h-5 md:w-5 md:h-5" style={{ color: '#652b82' }} />
                  </div>
                </div>
                
                {/* زر تسجيل الخروج */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-white px-3 md:px-4 py-2 rounded-xl shadow-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: '#652b82' }}
                >
                  <span className="text-xs md:text-sm">تسجيل الخروج</span>
                  <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ transform: 'scaleX(-1)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-5xl mb-3" style={{ color: '#652b82' }}>
            مرحباً {user.name}
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
              onClick={() => onNavigate(section.id)}
              className="group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-8"
              style={{ 
                border: '3px solid #652b82',
              }}
            >
              {/* دوائر ديكور في الخلفية */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: '#fad656', transform: 'translate(30%, -30%)' }}></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: '#fad656', transform: 'translate(-30%, 30%)' }}></div>
              
              <div className="relative flex flex-col items-center text-center gap-4">
                {/* الأيقونة */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: '#fad656',
                  }}
                >
                  <section.icon className="w-10 h-10 md:w-12 md:h-12" style={{ color: '#652b82' }} />
                </div>

                {/* العنوان */}
                <div>
                  <h2
                    className="text-2xl md:text-3xl mb-2"
                    style={{
                      color: '#652b82',
                    }}
                  >
                    {section.title}
                  </h2>
                  <p
                    className="text-sm md:text-base text-gray-600"
                  >
                    {section.description}
                  </p>
                </div>

                {/* السهم */}
                <div className="mt-2">
                  <ArrowLeft className="w-6 h-6" style={{ color: '#652b82' }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}