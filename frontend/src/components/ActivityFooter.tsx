import {
  BookOpen,
  Target,
  FileText,
  Video,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import * as React from "react";
import learn from "../assets/book_sidebar.svg";
import write from "../assets/pincle_sidebar.svg";
import location from "../assets/location_sideBar.svg";
import tashkeel from "../assets/tashkeel_sidebar.svg";
import video from "../assets/Video_sidebar.svg";
import games from "../assets/game_sidebar.svg";
import header from "../assets/header_sidbar.svg";
import buttonSidebar from "../assets/button_sidebar.svg"
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
  { id: "learn", label: "تعلم الحروف", icon: learn },
  { id: "write", label: "اكتب الحروف", icon: write },
  { id: "position", label: "مكان الحروف", icon: location },
  { id: "tashkeel", label: "تشكيل الحرف", icon: tashkeel },
  { id: "videos", label: "فيديوهات", icon: video },
  { id: "games", label: "العاب", icon: games },
];

export function ActivityFooter({
  currentLetter,
  letterName,
}: ActivityFooterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentActivity = location.pathname.split("/").pop();

  const [collapsed, setCollapsed] = React.useState(true);

  const SIDEBAR_W = 230;
  const HANDLE_W = 34;

  return (
    <>
      {/* سايدبار ثابت يشبه التصميم دائماً (موبايل و ديسكتوب) */}
      <aside
        dir="rtl"
        className="fixed z-40"
        style={{
          top: 0,
          bottom: 0,
          right: 0,
          width: collapsed ? `${HANDLE_W}px` : `${SIDEBAR_W}px`,
          transition: "width 220ms ease",
        }}
      >
        {/* Handle (الكبسة) تبقى ظاهرة دائماً */}
        <button
          type="button"
          aria-label={collapsed ? "إظهار القائمة" : "إخفاء القائمة"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((v) => !v)}
          className="absolute z-50"
          style={{
            left: 0,
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img src={buttonSidebar}/>
          {/* نقطة صغيرة مثل اللي بالصورة */}
          <span
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              borderRadius: "999px",
              backgroundColor: "#B8A1C0",
              left: "7px",
              opacity: 0.9,
            }}
          />
         
        </button>

        {/* Clipper: يمنع السايدبار من تغطية الصفحة لما يكون مخفي */}
        <div
          className="h-full relative"
          style={{
            width: "100%",
            overflow: "hidden",
            borderTopLeftRadius: "60px",
            borderBottomLeftRadius: "60px",
            boxShadow: collapsed ? "none" : "0 25px 45px rgba(0,0,0,0.18)",
          }}
        >
          {/* Panel: يتحرك يمين/يسار */}
          <div
            className="h-full flex flex-col items-stretch relative"
            style={{
              width: `${SIDEBAR_W}px`,
              backgroundColor: "#ffffff",
              transform: collapsed
                ? `translateX(${SIDEBAR_W - HANDLE_W}px)`
                : "translateX(0px)",
              transition: "transform 220ms ease",
            }}
          >
            {/* شكل الأصفر (blob) أعلى اليمين */}
            <img src={header} />

            {/* محتوى الهيدر فوق الـ blob */}
            <div
              style={{
                position: "absolute",
                padding: "32px 18px 28px",
                left: "63px",
              }}
            >
              {currentLetter && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "70px",
                      fontWeight: "700",
                      color: "#652b82",
                      lineHeight: 1,
                      fontFamily: "amiriQuran",
                    }}
                  >
                    {currentLetter}
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                     color: "#652b82",
                      fontWeight: "400",
                      fontFamily: "amiriQuran",
                    }}
                  >
               حرف ال{letterName}
                  </span>
                </div>
              )}
            </div>

            {/* خط فاصل خفيف تحت الهيدر */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to left, rgba(0,0,0,0.02), rgba(0,0,0,0.08), rgba(0,0,0,0.02))",
              }}
            />

            {/* قائمة الأنشطة عامودية */}
            <nav
              className="flex flex-col"
              style={{ backgroundColor: "#ffffff" }}
            >
              {activities.map((activity) => {
                const Icon = activity.icon;
                const isActive = currentActivity === activity.id;

                return (
                  <button
                    key={activity.id}
                    onClick={() =>
                      navigate(`/letter/${currentLetter}/${activity.id}`)
                    }
                    className="flex items-center gap-4 px-6 py-4 text-right transition-all"
                    style={{
                      backgroundColor: isActive ? "#6D6D6D40" : "#ffffff",
                      color: "#5b4d7b",
                      borderLeft: "3px solid transparent",
                      borderRight: "3px solid transparent",
                      borderBottom:"2px solid #0000000A",
                      boxShadow: isActive
                        ? "inset 4px 0 0 #f8c545"
                        : "inset 0 0 0 rgba(0,0,0,0)",
                        cursor:"pointer"
                      
                    }}
                  >
                    <img src={activity.icon}  style={{height:"40px" ,width:"40px"}}/>
                    <span className="text-sm font-medium whitespace-nowrap" style={{
                      fontSize: "18px",
                     color: "#272626",
                      fontWeight: "400",
                      fontFamily: "tajawal",
                    }}>
                      {activity.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* زر الحروف في الأسفل يشبه عنصر القائمة الأخير */}
            {/* <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.03)",
                padding: "8px 0 10px",
                marginTop: "auto",
              }}
            >
              <button
                onClick={() => navigate("/letters")}
                className="w-full flex items-center justify-between px-6 py-4 rounded-none transition-all"
                style={{ backgroundColor: "#ffffff", color: "#652b82" }}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  الحروف
                </span>
                <ArabicLettersIcon className="w-5 h-5" />
              </button>
            </div> */}
          </div>
        </div>
      </aside>
    </>
  );
}
