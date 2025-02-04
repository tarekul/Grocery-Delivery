const calculateProgress = (startTime, ms) => {
  const elapsedTime = Date.now() - startTime;
  const currentPercent = Math.min((elapsedTime / ms) * 100, 100);

  return currentPercent;
};

export default calculateProgress;
