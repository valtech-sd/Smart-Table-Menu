import { useEffect, useRef, useState } from "react";

interface AnimatedValueConfig {
  step: number;
  value: number;
  active: boolean;
}

export default function useAnimatedValue({
  step,
  value,
  active,
}: AnimatedValueConfig) {
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<number>();

  console.log('active: ', active);
  console.log('intervalRef: ', intervalRef);
  console.log('intervalRef.current: ', intervalRef.current);

  useEffect(() => {
    // if (active) {
    //   intervalRef.current = setInterval(() => {
    //     setProgress((prevProgress) => {
    //       if (prevProgress === value - step) {
    //         clearInterval(intervalRef.current);
    //       }

    //       return prevProgress + step;
    //     });
    //   }, step);
    // }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      clearInterval(intervalRef.current);
    }
  }, [active]);

  return (progress * 100) / value;
}
