// import * as fp from "fingerpose";

// export async function gestureDetect(predictions: any) {
//   if (predictions.length > 0) {
//     const GE = new fp.GestureEstimator([
//       fp.Gestures.VictoryGesture,
//       fp.Gestures.ThumbsUpGesture,
//     ]);

//     const { gestures } = await GE.estimate(predictions[0].landmarks, 8);

//     console.log('gestures: ', gestures);

//     if (gestures && gestures.length > 0) {
//       const confidence = gestures.map(({ score }) => score);
//       const maxConfidence = confidence.indexOf(
//         Math.max.apply(null, confidence)
//       );

//       return gestures[maxConfidence].name;
//     }
//   }
// }



export {}