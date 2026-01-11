import { ClassroomManagement } from './ClassroomManagement';
import { User } from '../types';
import { AppHeader } from './AppHeader';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface StudentsManagementProps {
  teacher: User;
  onHomeClick?: () => void;
  onResourcesClick?: () => void;
}

export function StudentsManagement({ teacher, onHomeClick, onResourcesClick }: StudentsManagementProps) {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* الهيدر - نفس تصميم صفحة الحروف */}
      <AppHeader 
        showUserInfo={true}
        user={teacher}
        onLogout={onHomeClick}
        showBackButton={false}
      />

      {/* زر الرجوع العائم في أعلى اليمين */}
      {onHomeClick && (
        <motion.button
          onClick={onHomeClick}
          className="fixed top-24 right-6 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: '#fad656' }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ArrowRight className="w-6 h-6 md:w-7 md:h-7" style={{ color: '#652b82' }} />
        </motion.button>
      )}

      {/* المحتوى الرئيسي */}
      <div className="relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div 
          className="text-center py-8 md:py-10 px-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl mb-3" style={{ color: '#652b82' }}>
            الصفوف
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            اختر صفاً لإدارة الطلاب ومتابعة التقدم
          </p>
        </motion.div>

        {/* محتوى الصفوف */}
        <div className="px-4 md:px-6 pb-8 md:pb-10">
          <div className="max-w-6xl mx-auto">
            <ClassroomManagement teacher={teacher} onClose={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}