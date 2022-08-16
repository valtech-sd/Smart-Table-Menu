import { useEffect, useRef, useState } from "react";

interface AnimatedValueConfig {
  step: number;
  value: number;
}

export default function useAnimatedValue({ step, value }: AnimatedValueConfig) {
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<number>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress === value - step) {
          clearInterval(intervalRef.current);
        }

        return prevProgress + step;
      });
    }, step);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (progress * 100) / value;
}
