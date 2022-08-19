// Points for fingers
const fingerJoints: FingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export type FingerJoints = {
  thumb: number[];
  indexFinger: number[];
  middleFinger: number[];
  ringFinger: number[];
  pinky: number[];
};

// Infinity Gauntlet Style
const style = {
  0: { color: "yellow", size: 15 },
  1: { color: "gold", size: 6 },
  2: { color: "green", size: 10 },
  3: { color: "gold", size: 6 },
  4: { color: "gold", size: 6 },
  5: { color: "purple", size: 10 },
  6: { color: "gold", size: 6 },
  7: { color: "gold", size: 6 },
  8: { color: "gold", size: 6 },
  9: { color: "blue", size: 10 },
  10: { color: "gold", size: 6 },
  11: { color: "gold", size: 6 },
  12: { color: "gold", size: 6 },
  13: { color: "red", size: 10 },
  14: { color: "gold", size: 6 },
  15: { color: "gold", size: 6 },
  16: { color: "gold", size: 6 },
  17: { color: "orange", size: 10 },
  18: { color: "gold", size: 6 },
  19: { color: "gold", size: 6 },
  20: { color: "gold", size: 6 },
};

// export const render = (
//   canvasContext: CanvasRenderingContext2D | null | undefined,
//   predictions: any,
// ) => {
//   if (canvasContext) {
//     // Check if we have predictions
//     if (predictions.length > 0) {
//       // Loop through each prediction
//       predictions.forEach((prediction: { landmarks: any }) => {
//         // Grab landmarks
//         const landmarks = prediction.landmarks;

//         // Loop through fingers
//         for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
//           let finger = Object.keys(fingerJoints)[j];
//           console.log('finger: ', finger);
//           console.log('ingerJoints[finger]: ', fingerJoints[finger]);
//           //  Loop through pairs of joints
//           for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
//             // Get pairs of joints
//             const firstJointIndex = fingerJoints[finger][k];
//             const secondJointIndex = fingerJoints[finger][k + 1];

//             // Draw path
//             canvasContext.beginPath();
//             canvasContext.moveTo(
//               landmarks[firstJointIndex][0],
//               landmarks[firstJointIndex][1]
//             );
//             canvasContext.lineTo(
//               landmarks[secondJointIndex][0],
//               landmarks[secondJointIndex][1]
//             );
//             canvasContext.strokeStyle = "plum";
//             canvasContext.lineWidth = 4;
//             canvasContext.stroke();
//           }
//         }

//         // Loop through landmarks and draw em
//         for (let i = 0; i < landmarks.length; i++) {
//           // Get x point
//           const x = landmarks[i][0];
//           // Get y point
//           const y = landmarks[i][1];
//           // Start drawing
//           canvasContext.beginPath();
//           canvasContext.arc(x, y, style[i]["size"], 0, 3 * Math.PI);

//           // Set line color
//           canvasContext.fillStyle = style[i]["color"];
//           canvasContext.fill();
//         }
//       });
//     }
//   }
// };
