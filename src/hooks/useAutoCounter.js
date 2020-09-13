import clamp from 'lodash/clamp';
import { useCallback, useEffect, useRef, useState } from 'react';

export default () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1);
  const [count, setCount] = useState(min);
  const [delayMs, setDelayMs] = useState(1000);
  const [playing, setPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    setTimeElapsed(false);

    if (playing) {
      setCount((c) => c + 1);
      setTimeElapsed(true);
    }
  }, [playing]);

  useEffect(() => {
    if (playing && timeElapsed && count < max) {
      setTimeElapsed(false);

      timerRef.current = setTimeout(() => {
        setCount((c) => c + 1);
        setTimeElapsed(true);
      }, delayMs);
    }
  }, [count, delayMs, max, playing, timeElapsed]);

  const play = useCallback(
    () => min !== null && max !== null && delayMs !== null && setPlaying(true),
    [min, max, delayMs],
  );
  const pause = useCallback(() => setPlaying(false), []);

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
    play,
    pause,
  };
};
