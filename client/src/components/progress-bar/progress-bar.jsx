import { useEffect } from "react";
import "./progress-bar.styles.css";

const ProgressiveBar = ({
  isOrderPlaced,
  setOrderStartTime,
  setIsProgressBarComplete,
  isMini = false,
}) => {
  useEffect(() => {
    const bar = isMini
      ? document.querySelector(".mini-bar")
      : document.querySelector(".bar");
    let intervalId;
    if (isOrderPlaced) {
      const fillBar = (ms) => {
        const startTime =
          parseInt(localStorage.getItem("startTime")) || Date.now();

        setOrderStartTime(startTime);

        if (!localStorage.getItem("startTime")) {
          localStorage.setItem("startTime", startTime);
        }

        const calculateProgress = () => {
          const elapsedTime = Date.now() - startTime;
          const currentPercent = Math.min((elapsedTime / ms) * 100, 100);

          bar.style.width = `${currentPercent}%`;

          if (currentPercent >= 100) {
            clearInterval(intervalId);
            setIsProgressBarComplete && setIsProgressBarComplete(true);
            localStorage.removeItem("startTime");
          }
        };

        // Update progress immediately
        calculateProgress();

        // Update progress periodically
        intervalId = setInterval(() => {
          calculateProgress();
        }, ms / 100);
      };

      fillBar(180000);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      clearInterval(intervalId);
      localStorage.removeItem("startTime");
      bar.style.width = "0%";
    }
  }, [isOrderPlaced]);

  if (!isMini) {
    return (
      <div className="bar-container">
        <div className="bar-text">
          {isOrderPlaced ? "Order processing..." : ""}
        </div>
        <div className="bar"></div>
      </div>
    );
  }

  return (
    <div className="mini-bar-container">
      <div className="mini-bar"></div>
    </div>
  );
};

export default ProgressiveBar;
