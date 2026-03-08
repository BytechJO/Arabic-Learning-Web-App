/* ===================== Loading ===================== */

import { useEffect, useState } from "react";
import background_catchWord from "../../assets/background_catchLoader.svg";
import background_wordMatch from "../../assets/background_wordMatch.svg";
import background_sorting from "../../assets/background_sorting.svg";
import background_balloon from "../../assets/background_balloon.svg";

export function GameLoadingScreen({ game_name }: any) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const backgrounds: any = {
    catchWord: background_catchWord,
    wordMatch: background_wordMatch,
    sorting: background_sorting,
    balloon: background_balloon,
  };

  const backgroundimg = backgrounds[game_name] || background_catchWord;

  return (
    <div
      className="h-screen w-full flex items-end justify-center pb-24"
      dir="rtl"
      style={{
        backgroundColor: "#faf9f6",
        backgroundImage: `url(${backgroundimg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        backgroundSize: "contain",
      }}
    >
      <p
        className="text-lg md:text-2xl"
        style={{
          color: "#374151",
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        جاري تحميل اللعبة{dots}
      </p>
    </div>
  );
}