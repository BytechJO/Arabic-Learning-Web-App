import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses, fetchMyClass } from "../redux/reducers/classSlice";
import { RootState, AppDispatch } from "../redux/store";
import homeIcon from "../assets/Home.svg";
import { logout } from "../redux/reducers/auth";
import girl_img from "../assets/success_joinClass.svg";
import { clearMyClass } from "../redux/reducers/classSlice";
import { AppHeader } from "./AppHeader";
import { useAppSelector } from "../redux/hooks";
import { LogIn } from "lucide-react";

interface SuccessJoinProps {
  // onLetterClick: (letter: string, letterName: string) => void;
  onLogout: () => void;
  onBack?: () => void;
}

export function SuccessJoin({ onLogout, onBack }: SuccessJoinProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { myClass, loading } = useAppSelector((state) => state.class);
  //   console.log(myClass);

  useEffect(() => {
    console.log("JOIN CLASS COMPONENT MOUNTED");

    dispatch(fetchMyClass());
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMyClass());
    navigate("/");
  };

  return (
    <>
      <div className="h-screen relative overflow-hidden" dir="rtl">
        {/* خلفية متدرجة */}
        <div
          className="fixed inset-0"
          style={{
            background: "linear-gradient(160deg, #A68BB7 30%, #FFFBE8 100%)",
          }}
        ></div>
        {/* الهيدر - خارج أي container */}
        <AppHeader
          showUserInfo={true}
          onLogout={onLogout}
          showBackButton={false}
          onBack={onBack}
          title="إستعد لمغامرة تعليمية رائعة"
        />
        {/* عناصر زخرفية متحركة */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -bottom-20 -right-20 w-48 h-28 md:w-48 md:h-48 rounded-full opacity-10"
            style={{ backgroundColor: "#341543ff" }}
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

        <div
          className="flex justify-center gap-6"
          style={{ marginTop: "15px" }}
        >
          {/* المحتوى الرئيسي */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            <h1
              style={{
                fontFamily: "poppins",
                fontSize: "30px",
                fontWeight: "500",
                color: "#FFFFFF",
              }}
            >
              انت مسجل في صف{" "}
            </h1>
            <h1
              style={{
                fontFamily: "poppins",
                fontSize: "25px",
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              {myClass?.name}
            </h1>
            <img src={girl_img} />
            <button
              onClick={() => navigate("/welcome-page")}
              className="w-full text-white py-2 md:py-2 flex items-center justify-center gap-2 shadow-lg transition-all hover:shadow-xl hover:scale-105"
              style={{
                backgroundColor: "#FDC333",
                color: "#652B82",
                fontFamily: "poppins",
                fontSize: "25px",
                fontWeight: "700",
              }}
            >
              <span className="text-base md:text-lg">إنضم الى الصف</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
