import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import { HandPose } from "@tensorflow-models/handpose";

import { loadHandposeModel } from "./utils/handpose";
import { isWebcamReady } from "./utils/webcam";
import { FLIPPED_VIDEO } from "./utils/config";
import useAnimatedValue from "./hooks/useAnimatedValue";

import { IndexCoords } from "./types";

import { Menu } from "./Menu";

import "./App.scss";

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [handposeModel, setHandposeModel] = useState<HandPose>();
  const [indexCoordinates, setIndexCoordinates] = useState<IndexCoords>();

  const [active, setActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);

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

      if (video && handposeModel) {
        const predictions = await handposeModel.estimateHands(video);

        if (predictions.length && canvasRef.current) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;

          const indexFinger = predictions[0].annotations.indexFinger;
          const lastFingerDot = indexFinger.at(-1);

          if (lastFingerDot) {
            const [x, y] = lastFingerDot;

            const canvasContext = canvasRef.current.getContext("2d");

            if (canvasContext) {
              canvasContext.beginPath();
              canvasContext.arc(x, y, 10, 0, 2 * Math.PI);
              canvasContext.stroke();
            }

            return setIndexCoordinates({ x, y });
          }
        }

        setIndexCoordinates(undefined);
      }
    }
  }, [webcamRef.current, canvasRef.current, handposeModel]);

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

  useEffect(() => {
    const element = document.getElementById("openMenu");
    const coordinates = element?.getBoundingClientRect();

    if (indexCoordinates && coordinates) {
      const hoverCondition =
        coordinates.left <= indexCoordinates.x &&
        coordinates.right >= indexCoordinates.x &&
        coordinates.top <= indexCoordinates.y &&
        coordinates.bottom >= indexCoordinates.y;

      if (hoverCondition) {
        setHoverOpen(true);
        setShowMenu(true);
      } else {
        setHoverOpen(false);
      }
    }
  }, [indexCoordinates]);

  useEffect(() => {
    const element = document.getElementById("closeMenu");
    const coordinates = element?.getBoundingClientRect();

    if (indexCoordinates && coordinates) {
      const hoverCondition =
        coordinates.left <= indexCoordinates.x &&
        coordinates.right >= indexCoordinates.x &&
        coordinates.top <= indexCoordinates.y &&
        coordinates.bottom >= indexCoordinates.y;

      if (hoverCondition) {
        setHoverClose(true);
        setShowMenu(false);
      } else {
        setHoverClose(false);
      }
    }
  }, [indexCoordinates]);

  return (
    <div className="App">
      <div className={`toast toast--${toastClass}`}>Item added to cart</div>

      {showMenu && <Menu indexCoordinates={indexCoordinates} />}
      <Webcam
        ref={webcamRef}
        muted
        mirrored={FLIPPED_VIDEO}
        imageSmoothing
        videoConstraints={videoConstraints}
      />
      <canvas ref={canvasRef} />
      <button
        id="openMenu"
        className={`menu-button open ${hoverOpen ? "hovered" : ""}`}
      >
        OPEN MENU
      </button>
      <button
        id="closeMenu"
        className={`menu-button close ${hoverClose ? "hovered" : ""}`}
      >
        CLOSE MENU
      </button>
    </div>
  );
}

export default App;
