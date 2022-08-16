import { useCallback, useEffect, useRef, useState } from "react";
import Progress from "react-circle-progress-bar";

import Webcam from "react-webcam";

import { isWebcamReady } from "./utils/webcam";
import { FLIPPED_VIDEO } from "./utils/config";
import useAnimatedValue from "./hooks/useAnimatedValue";

import "./App.css";

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [active, setActive] = useState(false);

  const progress = useAnimatedValue({ value: 3000, step: 100, active });

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setActive(false), 500);
    }
  }, [progress]);

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
      <button
        className="progress-button"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        TRIGGER PROGRESS
      </button>
      {active && (
        <Progress
          className="progress-bar"
          gradient={[{ stop: 1, color: "#00bc9b" }]}
          background="#fff"
          progress={progress}
          strokeWidth={15}
          reduction={0}
          hideBall
          hideValue
        />
      )}
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
