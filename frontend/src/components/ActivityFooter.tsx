import { BookOpen, Target, FileText, Video, Gamepad2 } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
// أيقونة الحروف العربية المخصصة
const ArabicLettersIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <text 
      x="50%" 
      y="50%" 
      dominantBaseline="middle" 
      textAnchor="middle" 
      fontSize="14" 
      fontWeight="bold"
      fill="currentColor"
      stroke="none"
    >
      أ ب
    </text>
  </svg>
);

interface ActivityFooterProps {

  currentLetter?: string;
  letterName?: string;
}
const activities = [
  { id: 'learn', label: 'تعلم الحرف', icon: BookOpen },
  { id: 'write', label: 'اكتب الحرف', icon: BookOpen },
  { id: 'position', label: 'مكان الحرف', icon: Target },
  { id: 'tashkeel', label: 'تشكيل الحرف', icon: FileText },
  { id: 'videos', label: 'فيديوهات', icon: Video },
  { id: 'games', label: 'العاب', icon: Gamepad2 },
];

export function ActivityFooter({currentLetter}: ActivityFooterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentActivity = location.pathname.split("/").pop();

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 border-t-3 shadow-2xl z-50"
      style={{ 
        backgroundColor: '#ffffff',
        borderColor: '#652b82'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* عرض الحرف على اليسار */}
          {currentLetter && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '85px',
              position: 'relative'
            }}>
              {/* الظل الخارجي */}
              <div 
                style={{
                  position: 'absolute',
                  width: '75px',
                  height: '75px',
                  borderRadius: '50%',
                  backgroundColor: '#fad656',
                  filter: 'blur(10px)',
                  opacity: 0.25
                }}
              />
              
              {/* الدائرة الرئيسية */}
              <div 
                style={{
                  position: 'relative',
                  width: '75px',
                  height: '75px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fad656 0%, #f5c842 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 12px rgba(250, 214, 86, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3)'
                }}
              >
                {/* تأثير لمعة */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* الحرف */}
                <span style={{ 
                  fontSize: '38px',
                  fontWeight: 'bold',
                  color: '#652b82',
                  lineHeight: '1',
                  textShadow: '0 2px 6px rgba(101, 43, 130, 0.25)',
                  position: 'relative',
                  transform: 'translateY(4px)'
                }}>
                  {currentLetter}
                </span>
              </div>
            </div>
          )}
          
          {/* أزرار الأنشطة */}
          <div className="flex-1 grid grid-cols-6 gap-2">
            {activities.map((activity) => {
              const Icon = activity.icon;
             const isActive = currentActivity === activity.id;

              
              return (
                <button
                  key={activity.id}
                  onClick={() => navigate(`/letter/${currentLetter}/${activity.id}`)}

                  className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl transition-all ${
                    isActive ? 'shadow-lg scale-105' : 'hover:scale-105'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: '#fad656', color: '#652b82' }
                      : { backgroundColor: '#f5f3f7', color: '#652b82' }
                  }
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[0.7rem] leading-tight text-center whitespace-nowrap">
                    {activity.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* زر العودة إلى صفحة الحروف */}
       
            <button
               onClick={() => navigate("/letters")}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: '#f5f3f7', color: '#652b82', minWidth: '80px' }}
            >
              <ArabicLettersIcon className="w-6 h-6" />
              <span className="text-[0.7rem] leading-tight text-center whitespace-nowrap">
                الحروف
              </span>
            </button>
         
        </div>
      </div>
    </footer>
  );
}