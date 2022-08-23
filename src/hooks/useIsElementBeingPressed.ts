import { useCallback, useEffect, useRef, useState } from "react";
import { IndexCoords } from "../types";
import useGetElementBeingPressed from "./useGetElementBeingPressed";

const useIsElementBeingPressed = (duration = 0, indexCoords?: IndexCoords) => {
  const currentItem = useRef<string>();
  const timeoutId = useRef<any>();

  const [isPressed, setIsPressed] = useState(false);

  const { pressedElementId } = useGetElementBeingPressed(indexCoords);

  const onSelectedItemChanged = useCallback((selectedItem?: string) => {
    currentItem.current = selectedItem;
    clearTimeout(timeoutId.current);
  }, []);

  useEffect(() => {
    if (currentItem.current !== pressedElementId) {
      setIsPressed(false);
      onSelectedItemChanged(pressedElementId);
    }

    if (pressedElementId) {
      timeoutId.current = setTimeout(() => {
        if (pressedElementId === currentItem.current) {
          setIsPressed(true);
          onSelectedItemChanged(undefined);
        }
      }, duration);
    }
  }, [pressedElementId]);

  return isPressed;
};

export default useIsElementBeingPressed;
