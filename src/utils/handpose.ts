import("@tensorflow/tfjs-backend-webgl"); // handpose does not itself require a backend, so you must explicitly install one.
import * as handpose from "@tensorflow-models/handpose";
import { IndexCoords } from "../types";

export async function loadHandposeModel() {
  return await handpose.load();
}

export function isIndexOnTopOfElement(
  indexCoords: IndexCoords | undefined,
  element: Element | null
) {
  if (!element || !indexCoords) {
    return false;
  }

  const elementCoordinates = element.getBoundingClientRect();

  return (
    indexCoords &&
    elementCoordinates.left <= indexCoords.x &&
    elementCoordinates.right >= indexCoords.x &&
    elementCoordinates.top <= indexCoords.y &&
    elementCoordinates.bottom >= indexCoords.y
  );
}
