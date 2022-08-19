import { useEffect, useRef } from "react";

export default function useGetAllPressableElements() {
  const pressableElements = useRef<Element[]>([]);

  useEffect(() => {
    pressableElements.current = [...document.querySelectorAll(".pressable")];
  }, []);

  return pressableElements;
}
