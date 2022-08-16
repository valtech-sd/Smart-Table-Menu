import { useCallback, useEffect, useRef } from "react";
import "./App.css";

import Webcam from "react-webcam";

import { isWebcamReady } from "./utils/webcam";
import { FLIPPED_VIDEO } from "./utils/config";

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const detect = useCallback(async () => {
    if (isWebcamReady(webcamRef.current)) {
      const { video } = webcamRef.current;

      if (video) {
        // DETECT HERE
        console.log("LOADED!");
      }
    }
  }, []);

  useEffect(() => {
    detect();
  }, [detect]);

  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        muted
        mirrored={FLIPPED_VIDEO}
        imageSmoothing
        videoConstraints={videoConstraints}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          zIndex: 2,
        }}
      />
    </div>
  );
}

export default App;
