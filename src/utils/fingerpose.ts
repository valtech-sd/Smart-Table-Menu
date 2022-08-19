import { AnnotatedPrediction } from "@tensorflow-models/handpose";
import * as fp from "fingerpose";

export async function gestureDetect(predictions: AnnotatedPrediction[]) {
  if (predictions.length > 0) {
    const GE = new fp.GestureEstimator([fp.Gestures.ThumbsUpGesture]);

    const { gestures } = await GE.estimate(predictions[0].landmarks, 8);

    if (gestures.length) {
      return gestures[0].name;
    }
  }
}
