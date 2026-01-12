import { useNavigate } from "react-router-dom";
import { LettersDashboard } from "../components/LettersDashboard";
import { storage } from "../utils/storage";

export function LettersDashboardWrapper() {
  const navigate = useNavigate();

  // نجيب المستخدم الحالي (مثل ما App بعمل)
  const currentUser = storage.getCurrentUser();

  // حماية بسيطة
  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <LettersDashboard
      user={currentUser}
      onLetterClick={(letter, letterName) => {
        navigate(`/letters/${letter}`);
      }}
      onLogout={() => {
        storage.setCurrentUser(null);
        navigate("/");
      }}
      onBack={() => navigate("/home")}
    />
  );
}
