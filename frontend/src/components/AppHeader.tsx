import { motion } from "motion/react";
import { LogOut, User, GraduationCap, ArrowLeft } from "lucide-react";
// import { User as UserType } from '../types';
import { useAppSelector } from "../redux/hooks";
import homeIcon from "../assets/Home.svg";
import logOut from "../assets/Log out.svg";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/reducers/auth";
import { clearMyClass } from "../redux/reducers/classSlice";

interface AppHeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  showUserInfo?: boolean;
  // user?: UserType;
  onLogout?: () => void;
  currentLetter?: string;
  showLetter?: boolean;
  title: string;
  showLogout: boolean;
}

export function AppHeader({
  showBackButton,
  onBack,
  showUserInfo = true,
  // user,
  onLogout,
  showLogout,
  title,
}: AppHeaderProps) {
  const user = useAppSelector((state) => state.auth.user);
  const userType = user?.type || "student";
  const userName = user?.username || "المستخدم";
  // console.log(userName);
  const navigate = useNavigate();
  if (!user && showUserInfo) {
    return null;
  }
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMyClass());
    navigate("/");
  };
  return (
    <header className="sticky top-0 w-full">
      <div
        className="px-4 md:px-6 py-2 md:py-2.5"
        style={{ marginTop: "20px" }}
      >
        <div className="flex items-center justify-between" dir="rtl">
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

                {/* اسم الحساب ونوعه */}
                <div className="text-right flex justify-center items-center">
                  {onLogout && (
                    <motion.button
                      onClick={onLogout}
                      className="flex items-center gap-2 text-white px-3 md:px-4 py-2 rounded-xl transition-all"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div>
                        <motion.button
                          whileHover={{
                            scale: 1.02,
                            y: -2,
                            boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255, 255, 255, 0)
    `,
                          }}
                          whileTap={{
                            scale: 0.97,
                            boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255, 255, 255, 0)
    `,
                          }}
                          type="button"
                          onClick={() => handleLogout}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: `
        inset 6px 6px 12px rgba(0, 0, 0, 0.07),
        inset -6px -6px 12px rgba(255, 255, 255, 0.01)`,
                          }}
                        >
                          {" "}
                          <img
                            src={logOut}
                            style={{ width: "30px", height: "30px" }}
                          />
                        </motion.button>
                      </div>
                    </motion.button>
                  )}
                  <p
                    className="text-base md:text-sm lg:text-2xl"
                    style={{
                      color: "#652b82",
                      fontFamily: "poppins",
                      // fontSize: "20px",
                      fontWeight: "400",
                    }}
                  >
                    {userName}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {showLogout && onLogout && (
            <motion.button
              onClick={onLogout}
              className="flex items-center gap-2 text-white px-3 md:px-4 py-2 rounded-xl transition-all"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255, 255, 255, 0)
    `,
                  }}
                  whileTap={{
                    scale: 0.97,
                    boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255, 255, 255, 0)
    `,
                  }}
                  type="button"
                  onClick={() => handleLogout}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: `
        inset 6px 6px 12px rgba(0, 0, 0, 0.07),
        inset -6px -6px 12px rgba(255, 255, 255, 0.01)`,
                  }}
                >
                  {" "}
                  <img src={logOut} style={{ width: "30px", height: "30px" }} />
                </motion.button>
              </div>
            </motion.button>
          )}
          {/* اليمين - اسم التطبيق */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center" style={{ color: "#652b82" }}>
              <span
                className="text-base md:text-xl lg:text-2xl text-center"
                style={{
                  fontFamily: "tajawal",
                  // fontSize: "25px",
                  fontWeight: "700",
                  textAlign:"center"
                }}
              >
                {title}
              </span>
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
                style={{ backgroundColor: "#652b82" }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">رجوع</span>
              </motion.button>
            </motion.div>
          )}

          <motion.button
            onClick={() => {
              navigate("/");
            }}
            className="flex items-center gap-2 text-white px-3 md:px-4 py-2 rounded-xl transition-all"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255, 255, 255, 0)
    `,
                }}
                whileTap={{
                  scale: 0.97,
                  boxShadow: `
      inset 10px 10px 18px rgba(0, 0, 0, 0.15),
      inset -10px -10px 18px rgba(255, 255, 255, 0)
    `,
                }}
                type="button"
                onClick={() => handleLogout}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: `
        inset 6px 6px 12px rgba(0, 0, 0, 0.07),
        inset -6px -6px 12px rgba(255, 255, 255, 0.01)`,
                }}
              >
                <img src={homeIcon} style={{ width: "30px", height: "30px" }} />
              </motion.button>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
}

function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
