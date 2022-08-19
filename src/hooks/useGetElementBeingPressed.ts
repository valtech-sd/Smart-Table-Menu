import { useEffect, useMemo, useState } from "react";
import { Item } from "react-use-cart";

import { IndexCoords } from "../types";
import { isIndexOnTopOfElement } from "../utils/handpose";
import useGetAllPressableElements from "./useGetAllPressableElements";

export default function useGetElementBeingPressed(indexCoords?: IndexCoords) {
  const elements = useGetAllPressableElements();
  const [pressedElement, setPressedElement] = useState<HTMLElement>();

  useEffect(() => {
    const element = elements.current.find((element) =>
      isIndexOnTopOfElement(indexCoords, element)
    );

    setPressedElement(element as HTMLElement);
  }, [indexCoords]);

  const pressedElementId = useMemo(() => {
    if (pressedElement) {
      return pressedElement.dataset.pressableId ?? "";
    }

    return "";
  }, [pressedElement]);

  const pressedElementProduct = useMemo(() => {
    if (pressedElement && pressedElement.dataset.product) {
      return JSON.parse(pressedElement.dataset.product) as Item;
    }

    return undefined;
  }, [pressedElement]);

  return { pressedElement, pressedElementId, pressedElementProduct };
}
