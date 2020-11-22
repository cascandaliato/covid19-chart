import clamp from "lodash/clamp";
import { useCallback, useEffect, useState } from "react";

const useAutoIncrementingCounter = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1);
  const [count, setCount] = useState(min);
  const [delayMs, setDelayMs] = useState(1000);
  const [playing, setPlaying] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerId);
      setTimerId(null);
    };

    if (!playing) return resetTimer();
    if (timerId !== null) return;

    if (count < max) {
      setCount((c) => c + 1);
      setTimerId(setTimeout(resetTimer, delayMs));
    }
  }, [count, timerId, delayMs, max, playing]);

  return {
    count,
    setCount: useCallback((c) => setCount(clamp(c, min, max)), [min, max]),
    min,
    setMin: useCallback((n) => {
      setMin(n);
      setCount(n);
    }, []),
    max,
    setMax,
    delayMs,
    setDelayMs,
    playing,
    play: useCallback(
      () =>
        min !== null && max !== null && delayMs !== null && setPlaying(true),
      [min, max, delayMs]
    ),
    pause: useCallback(() => setPlaying(false), []),
  };
};

export default useAutoIncrementingCounter;
