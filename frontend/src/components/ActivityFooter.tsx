import { BookOpen, Target, FileText, Video, Gamepad2, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  { id: "learn", label: "تعلم الحرف", icon: BookOpen },
  { id: "write", label: "اكتب الحرف", icon: BookOpen },
  { id: "position", label: "مكان الحرف", icon: Target },
  { id: "tashkeel", label: "تشكيل الحرف", icon: FileText },
  { id: "videos", label: "فيديوهات", icon: Video },
  { id: "games", label: "العاب", icon: Gamepad2 },
];

// Hook: يحدد موبايل/غير موبايل
function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpointPx;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in e ? e.matches : e.matches);
    };

    handler(mq);

    if ("addEventListener" in mq) mq.addEventListener("change", handler as any);
    else mq.addListener(handler as any);

    return () => {
      if ("removeEventListener" in mq) mq.removeEventListener("change", handler as any);
      else mq.removeListener(handler as any);
    };
  }, [breakpointPx]);

  return isMobile;
}

export function ActivityFooter({ currentLetter }: ActivityFooterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentActivity = location.pathname.split("/").pop();

  const isMobile = useIsMobile(768);

  const [open, setOpen] = useState(false);

  // مهم: ref للزر نفسه عشان نطلع dropdown فوقه تمامًا
  const triggerRef = useRef<HTMLButtonElement>(null);

  // مكان dropdown (بنفس مكان زر الدروب داون)
  const [ddPos, setDdPos] = useState<{ left: number; width: number; bottom: number }>({
    left: 0,
    width: 0,
    bottom: 0,
  });

  const activeItem = useMemo(
    () => activities.find((a) => a.id === currentActivity) ?? activities[0],
    [currentActivity]
  );

  // سكّر dropdown اذا كبست برا
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;

      // إذا كبست داخل الزر أو داخل القائمة: لا تسكر
      if (triggerRef.current?.contains(t)) return;
      const menu = document.getElementById("activity-dd-menu");
      if (menu?.contains(t)) return;

      setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // إذا صار مش موبايل -> سكّر dropdown
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // احسب مكان dropdown عند الفتح + عند resize/scroll
  const computeDropdownPos = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // dropdown رح يكون fixed، فبدنا قيم viewport
    setDdPos({
      left: Math.max(12, rect.left), // padding بسيط
      width: Math.min(window.innerWidth - 24, rect.width), // لا يتجاوز الشاشة
      bottom: window.innerHeight - rect.top + 8, // يطلع فوق الزر + مسافة صغيرة
    });
  };

  useEffect(() => {
    if (!open) return;
    computeDropdownPos();

    const onResize = () => computeDropdownPos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  return (
    <>
      <footer
        className="fixed bottom-0 left-0 right-0 border-t-3 shadow-2xl z-50"
        style={{ backgroundColor: "#ffffff", borderColor: "#652b82" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* عرض الحرف على اليسار */}
            {currentLetter && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "85px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "75px",
                    height: "75px",
                    borderRadius: "50%",
                    backgroundColor: "#fad656",
                    filter: "blur(10px)",
                    opacity: 0.25,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    width: "75px",
                    height: "75px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #fad656 0%, #f5c842 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 3px 12px rgba(250, 214, 86, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "38px",
                      fontWeight: "bold",
                      color: "#652b82",
                      lineHeight: "1",
                      textShadow: "0 2px 6px rgba(101, 43, 130, 0.25)",
                      position: "relative",
                      transform: "translateY(4px)",
                    }}
                  >
                    {currentLetter}
                  </span>
                </div>
              </div>
            )}

            {/* الأنشطة */}
            <div className="flex-1">
              {isMobile ? (
                // ===== Mobile: Dropdown =====
                <button
                  ref={triggerRef}
                  onClick={() => {
                    setOpen((v) => !v);
                    // احسب فورًا قبل ما يفتح
                    requestAnimationFrame(() => computeDropdownPos());
                  }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: "#f5f3f7",
                    color: "#652b82",
                    boxShadow: open ? "0 0 0 2px rgba(250,214,86,0.9)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <activeItem.icon className="w-5 h-5" />
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {activeItem.label}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                // ===== Desktop: Grid (مثل ما هو) =====
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-6 gap-2 min-w-[420px]">
                    {activities.map((activity) => {
                      const Icon = activity.icon;
                      const isActive = currentActivity === activity.id;

                      return (
                        <button
                          key={activity.id}
                          onClick={() => navigate(`/letter/${currentLetter}/${activity.id}`)}
                          className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl transition-all ${
                            isActive ? "shadow-lg scale-105" : "hover:scale-105"
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: "#fad656", color: "#652b82" }
                              : { backgroundColor: "#f5f3f7", color: "#652b82" }
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
                </div>
              )}
            </div>

            {/* زر الحروف */}
            <button
              onClick={() => navigate("/letters")}
              className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: "#f5f3f7", color: "#652b82", minWidth: "80px" }}
            >
              <ArabicLettersIcon className="w-6 h-6" />
              <span className="text-[0.7rem] leading-tight text-center whitespace-nowrap">
                الحروف
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* ✅ Dropdown خارج الفوتر (ثابت) وبنفس مكان زر الدروب داون */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            id="activity-dd-menu"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed z-50 rounded-2xl shadow-2xl border"
            style={{
              left: ddPos.left,
              width: ddPos.width,
              bottom: ddPos.bottom, // ✅ فوق الزر تمامًا
              backgroundColor: "#ffffff",
              borderColor: "rgba(101,43,130,0.15)",
            }}
          >
            {/* “Connector” صغير يخليها تبين منسدلة من الزر */}
            <div
              style={{
                height: "10px",
                background: "linear-gradient(to bottom, rgba(245,243,247,1), rgba(255,255,255,1))",
              }}
            />

            <div className="p-2">
              {activities.map((activity) => {
                const Icon = activity.icon;
                const isActive = currentActivity === activity.id;

                return (
                  <button
                    key={activity.id}
                    onClick={() => {
                      navigate(`/letter/${currentLetter}/${activity.id}`);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                    style={
                      isActive
                        ? {
                            backgroundColor: "#fad656",
                            color: "#652b82",
                            boxShadow: "0 6px 18px rgba(250,214,86,0.35)",
                          }
                        : { backgroundColor: "#f5f3f7", color: "#652b82" }
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{activity.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
