import { Routes, Route, Navigate } from "react-router-dom";
import { ChooseAccountType } from "../components/ChooseAccountType";
import { LoginPage } from "../components/LoginPage";
import { HomePage } from "../components/HomePage";
import { TeacherHomePage } from "../components/TeacherHomePage";
import { User } from "../types";
import { useAppSelector } from "../redux/hooks";
import { LettersDashboard } from "../components/LettersDashboard";
import { JoinClassroom } from "../components/JoinClassroom";
import { useNavigate } from "react-router-dom";
import { LetterDetails } from "../components/LetterDetails";
import { LearnLetters } from "../components/LearnLetters";
import { LearnLetters2 } from "../components/LearnLetters2";
import { LetterPosition } from "../components/LetterPosition";
import { LetterTashkeel } from "../components/LetterTashkeel";
import { VideosSection } from "../components/VideosSection";
import { GamesSection } from "../components/GamesSection";
import { BalloonPopGame } from "../components/games/BalloonPopGame";
import { MemoryMatchGame } from "../components/games/MemoryMatchGame";
import { SortingGame } from "../components/games/SortingGame";
import { WordCatchGame } from "../components/games/WordCatchGame";
interface AppRouterProps {
  onChooseType: (type: "student" | "teacher") => void;
  onLogin: (user: any) => void; // مؤقت
  selectedUserType: "student" | "teacher" | null;
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (section: string) => void;
}

export function AppRouter({
  onChooseType,
  selectedUserType,
  onLogout,
}: AppRouterProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  return (
    <Routes>
      <Route path="/" element={<ChooseAccountType onChoose={onChooseType} />} />
      <Route
        path="/login/:type"
        element={
          selectedUserType ? (
            <LoginPage userType={selectedUserType} onBack={() => {}} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      {/* طالب */}
      <Route
        path="/student/home"
        element={
          user?.type === "student" ? (
            <HomePage onLogout={onLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* معلم */}
      <Route
        path="/teacher/home"
        element={
          user?.type === "teacher" ? (
            <TeacherHomePage user={user} onLogout={onLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/letters"
        element={<LettersDashboard onLogout={onLogout} />}
      />
      <Route
        path="/my-classroom"
        element={
          <JoinClassroom
            onClose={() => {
              navigate("/student/home");
            }}
          />
        }
      />
      <Route path="/letter/:letter" element={<LetterDetails />} />
      <Route path="/letter/:letter/learn" element={<LearnLetters />} />
      <Route path="/letter/:letter/write" element={<LearnLetters2 />} />
      <Route path="/letter/:symbol/position" element={<LetterPosition />} />
      <Route path="/letter/:letter/tashkeel" element={<LetterTashkeel />} />
      <Route path="/letter/:letter/videos" element={<VideosSection />} />
      <Route path="/letter/:letter/games" element={<GamesSection />} />
      <Route
        path="/letter/:letter/games/balloon_pop"
        element={<BalloonPopGame />}
      />
      <Route
        path="/letter/:letter/games/memory_match"
        element={<MemoryMatchGame />}
      />
      <Route
        path="/letter/:letter/games/sorting"
        element={<SortingGame />}
      />
      <Route
        path="/letter/:letter/games/word_catch"
        element={<WordCatchGame />}
      />
      {/* أي مسار غلط */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
