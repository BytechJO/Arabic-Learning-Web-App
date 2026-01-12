import { useParams, useNavigate } from "react-router-dom";
import { LetterDetails } from "../components/LetterDetails";

export function LetterDetailsWrapper() {
  const { letter } = useParams();
  const navigate = useNavigate();

  if (!letter) return null;

  return (
    <LetterDetails
      letter={letter}
      letterName={letter} // لاحقًا نربطه بالاسم الحقيقي
      onBack={() => navigate("/letters")}
      onSectionClick={(section) =>
        navigate(`/letters/${letter}/${section}`)
      }
    />
  );
}
