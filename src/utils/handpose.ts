import("@tensorflow/tfjs-backend-webgl"); // handpose does not itself require a backend, so you must explicitly install one.
import * as handpose from "@tensorflow-models/handpose";

export async function loadHandposeModel() {
  return await handpose.load();
}
