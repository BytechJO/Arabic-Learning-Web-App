import { motion } from 'motion/react';
import { LogOut, User, GraduationCap, ArrowLeft } from 'lucide-react';
// import { User as UserType } from '../types';
import { useAppSelector  } from "../redux/hooks";

interface AppHeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  showUserInfo?: boolean;
  // user?: UserType;
  onLogout?: () => void;
  currentLetter?: string;
  showLetter?: boolean;
}

export function AppHeader({ 
  showBackButton, 
  onBack, 
  showUserInfo = true,
  // user,
  onLogout,

}: AppHeaderProps) {
  const user = useAppSelector((state) => state.auth.user);
  const userType = user?.type || 'student';
  const userName = user?.username || 'المستخدم';
// console.log(userName);

if (!user && showUserInfo) {
  return null;
}

  return (
    <header className="bg-white shadow-md sticky top-0 w-full" style={{ borderBottom: '3px solid #fad656' }}>
      <div className="px-4 md:px-6 py-2 md:py-2.5">
        <div className="flex items-center justify-between" dir="rtl">
          {/* اليمين - اسم التطبيق */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xl md:text-2xl" style={{ color: '#652b82' }}>
              <span className="font-bold">مرآتي لغتي</span>
            </div>
          </motion.div>
          
          {/* الوسط - معلومات الحرف أو زر الرجوع */}
          {showBackButton && onBack && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-lg transition-all"
                style={{ backgroundColor: '#652b82' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">رجوع</span>
              </motion.button>
            </motion.div>
          )}
          
          {/* اليسار - معلومات المستخدم وتسجيل الخروج */}
          {showUserInfo && user && (
            <motion.div 
              className="flex items-center gap-3 md:gap-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* معلومات الحساب */}
              <div className="flex items-center gap-2">
                {/* أيقونة الحساب */}
                <div 
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #fad656, #f5c842)' }}
                >
                  {userType === 'teacher' ? (
                    <GraduationCap className="w-5 h-5 md:w-5 md:h-5" style={{ color: '#652b82' }} />
                  ) : (
                    <User className="w-5 h-5 md:w-5 md:h-5" style={{ color: '#652b82' }} />
                  )}
                </div>
                
                {/* اسم الحساب ونوعه */}
                <div className="text-right">
                  <p className="text-sm md:text-base font-medium" style={{ color: '#652b82' }}>
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userType === 'teacher' ? 'معلم' : 'طالب'}
                  </p>
                </div>
              </div>
              
              {/* زر تسجيل الخروج */}
              {onLogout && (
                <motion.button
                  onClick={onLogout}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-white px-3 md:px-4 py-2 rounded-xl shadow-lg transition-all"
                  style={{ backgroundColor: '#652b82' }}
                >
                  <span className="text-xs md:text-sm">تسجيل الخروج</span>
                  <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ transform: 'scaleX(-1)' }} />
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}