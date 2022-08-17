import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Progress from "react-circle-progress-bar";
import Webcam from "react-webcam";

import { render } from "./utils/canvas";
import { loadHandposeModel } from "./utils/handpose";
import { isWebcamReady } from "./utils/webcam";
import { FLIPPED_VIDEO } from "./utils/config";
import useAnimatedValue from "./hooks/useAnimatedValue";

import victory from "./images/victory.png";
import thumbs_up from "./images/thumbs_up.png";

import "./App.css";
import { gestureDetect } from "./utils/fingerpose";

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

const images = { thumbs_up, victory };

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [handposeModel, setHandposeModel] = useState<any>();

  const [active, setActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [emoji, setEmoji] = useState(null);

  const progress = useAnimatedValue({ value: 3000, step: 100, active });

  const toastClass = useMemo(() => (showToast ? "show" : "hide"), [showToast]);

  useEffect(() => {
    if (progress === 100) {
      setShowToast(true);
      setTimeout(() => setActive(false), 500);
    }
  }, [progress]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(false), 2000);
    }
  }, [showToast]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setActive(false), 500);
    }
  }, [progress]);

  const detect = useCallback(async () => {
    if (isWebcamReady(webcamRef.current)) {
      const { video } = webcamRef.current;

      if (video) {
        const predictions = await handposeModel.estimateHands(video);
        const canvasContext = canvasRef.current;

        if (canvasContext) {
          canvasContext.width = video?.videoWidth;
          canvasContext.height = video?.videoHeight;

          render(canvasContext?.getContext("2d"), predictions);

          const emoji = await gestureDetect(predictions);
          setEmoji(emoji);
        }
      }
    }
  }, [webcamRef.current, canvasRef.current]);

  useEffect(() => {
    loadHandposeModel().then(setHandposeModel);
  }, []);

  useEffect(() => {
    if (canvasRef.current && handposeModel) {
      setInterval(() => {
        detect();
      }, 10);
    }
  }, [canvasRef.current, handposeModel]);

  return (
    <div className="App">
      <button
        className="progress-button"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        TRIGGER PROGRESS
      </button>
      <div className={`toast ${toastClass}`}>Item was added to cart</div>
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
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          zIndex: 2,
        }}
      />
      {emoji !== null && (
        <img
          src={images[emoji]}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 400,
            bottom: 500,
            right: 0,
            textAlign: "center",
            height: 100,
          }}
        />
      )}
    </div>
  );
}

export default App;
