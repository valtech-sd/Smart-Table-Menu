import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import { HandPose } from "@tensorflow-models/handpose";

import { isIndexOnTopOfElement, loadHandposeModel } from "./utils/handpose";
import { gestureDetect } from "./utils/fingerpose";
import { isWebcamReady } from "./utils/webcam";
import { FLIPPED_VIDEO } from "./utils/config";
import useAnimatedValue from "./hooks/useAnimatedValue";

import { IndexCoords } from "./types";
import thumbs_up from "./images/thumbs_up.png";

import { Menu } from "./Menu";
import { Cart } from "./Cart";

import "./App.scss";
import { useCart } from "react-use-cart";

const images = { thumbs_up };

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

function App() {
  const { isEmpty, emptyCart } = useCart();

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const timeoutId = useRef<number>();
  const currentItem = useRef<string>();

  const [handposeModel, setHandposeModel] = useState<HandPose>();
  const [indexCoordinates, setIndexCoordinates] = useState<IndexCoords>();

  const [active, setActive] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [emoji, setEmoji] = useState(undefined);
  const [showToast, setShowToast] = useState(false);

  const toastClass = useMemo(() => (showToast ? "show" : "hide"), [showToast]);

  const progress = useAnimatedValue({ value: 3000, step: 100, active });

  const onSelectedItemChanged = useCallback((selectedItem?: string) => {
    currentItem.current = selectedItem;
    clearTimeout(timeoutId.current);
  }, []);

  useEffect(() => {
    if (currentItem.current !== emoji) {
      onSelectedItemChanged(emoji);
    }

    if (emoji) {
      timeoutId.current = setTimeout(() => {
        if (emoji === currentItem.current && !isEmpty) {
          setShowToast(true);
          emptyCart();

          onSelectedItemChanged(undefined);
        }
      }, 3000);
    }
  }, [emoji]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setActive(false), 500);
    }
  }, [progress]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [showToast]);

  useEffect(() => {
    const [element] = document.getElementsByClassName("menu-button__open");

    if (isIndexOnTopOfElement(indexCoordinates, element)) {
      setShowMenu(true);
    }
  }, [indexCoordinates]);

  useEffect(() => {
    const [element] = document.getElementsByClassName("menu-button__close");

    if (isIndexOnTopOfElement(indexCoordinates, element)) {
      setShowMenu(false);
    }
  }, [indexCoordinates]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setActive(false), 500);
    }
  }, [progress]);

  const detect = useCallback(async () => {
    if (isWebcamReady(webcamRef.current)) {
      const { video } = webcamRef.current;

      if (video && handposeModel) {
        const predictions = await handposeModel.estimateHands(
          video,
          FLIPPED_VIDEO
        );

        if (predictions.length && canvasRef.current) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;

          const emoji = await gestureDetect(predictions);

          setEmoji(emoji);

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

  const app = useCallback(() => {
    detect();

    requestRef.current = requestAnimationFrame(app);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [detect]);

  useEffect(() => {
    loadHandposeModel().then(setHandposeModel);

    if (canvasRef.current) {
      requestRef.current = requestAnimationFrame(app);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [canvasRef.current]);

  return (
    <div className="App">
      <div className={`toast toast--${toastClass}`}>Order in progress!</div>

      {showMenu && <Menu indexCoordinates={indexCoordinates} />}
      <Webcam
        ref={webcamRef}
        muted
        mirrored={FLIPPED_VIDEO}
        imageSmoothing
        videoConstraints={videoConstraints}
      />
      <canvas ref={canvasRef} />
      <div className="menu-buttons">
        <button className="menu-button menu-button__open">OPEN MENU</button>
        <button className="menu-button menu-button__close">CLOSE MENU</button>
      </div>
      {!isEmpty && <Cart />}
      {emoji !== null && showToast && (
        <img src={images[emoji]} className="emoji" />
      )}
    </div>
  );
}

export default App;
