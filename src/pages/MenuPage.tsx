import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import { HandPose } from "@tensorflow-models/handpose";
import { useCart } from "react-use-cart";

import { loadHandposeModel } from "../utils/handpose";
import { isWebcamReady } from "../utils/webcam";
import { gestureDetect } from "../utils/fingerpose";
import useGetElementBeingPressed from "../hooks/useGetElementBeingPressed";

import { IndexCoords } from "../types";

import { Menu } from "../components/Menu";
import { Cart } from "../components/Cart";

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
};

interface MenuPageProps {
  webcam?: boolean;
  showCameraSelector?: boolean;
}

function MenuPage({ webcam = false }: MenuPageProps) {
  const { isEmpty, emptyCart } = useCart();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const timeoutId = useRef<any>();
  const currentItem = useRef<string>();
  const fingerHoverSelectionTime = 1000;

  const [handposeModel, setHandposeModel] = useState<HandPose>();
  const [indexCoordinates, setIndexCoordinates] = useState<IndexCoords>();

  const { pressedElementId } = useGetElementBeingPressed(indexCoordinates);

  const [emoji, setEmoji] = useState(undefined);
  const [showToast, setShowToast] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  let arrayX = [0];
  let arrayY = [0];
  let windowSize = 15;

  const toastClass = useMemo(() => (showToast ? "show" : "hide"), [showToast]);

  const getHashQueryStringParam = (paramName: string) => {
    const params = new URLSearchParams(window.location.hash.substr(1));

    return params.get(paramName) || "";
  };

  const onSelectedItemChanged = useCallback((selectedItem?: string) => {
    currentItem.current = selectedItem;
    clearTimeout(timeoutId.current);
  }, []);

  function calculateRMS(inputArray: number[]) {
    let square = 0;
    let mean = 0;
    for (var i = 0; i < windowSize; i++) {
      square += Math.pow(inputArray[i], 2);
    }
    // Calculate Mean.
    mean = square / windowSize;
    // Calculate Root.
    return Math.sqrt(mean);
  }

  useEffect(() => {
    if (currentItem.current !== emoji) {
      onSelectedItemChanged(emoji);
    }

    if (emoji) {
      timeoutId.current = setTimeout(() => {
        if (emoji === currentItem.current && !isEmpty) {
          setShowToast(true);
          emptyCart();
          setShowMenu(false);

          onSelectedItemChanged(undefined);
        }
      }, fingerHoverSelectionTime);
    }
  }, [emoji]);

  useEffect(() => {
    if (pressedElementId === "open-menu") {
      setShowMenu(true);
    }

    if (pressedElementId === "close-menu") {
      setShowMenu(false);
    }
  }, [pressedElementId]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(false), fingerHoverSelectionTime);
    }
  }, [showToast]);

  const detect = useCallback(async () => {
    if (isWebcamReady(webcamRef.current)) {
      const { video } = webcamRef.current;

      if (video && handposeModel) {
        // console.log('import.meta.env.VITE_FLIPPED_VIDEO as boolean: ', import.meta.env.VITE_FLIPPED_VIDEO as boolean);
        const predictions = await handposeModel.estimateHands(
          video,
          import.meta.env.VITE_FLIPPED_VIDEO as boolean
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
              let rmsX = 0;
              let rmsY = 0;
              if (arrayX.length == windowSize) {
                rmsX = calculateRMS(arrayX);
              }
              if (arrayY.length == windowSize) {
                rmsY = calculateRMS(arrayY);
              }

              canvasContext.beginPath();
              canvasContext.arc(rmsX, rmsY, 10, 0, 2 * Math.PI);
              canvasContext.fillStyle = "#B8C5CB4D";
              canvasContext.fill();
            }

            arrayX.push(x);
            arrayY.push(y);
            if (arrayX.length > windowSize) {
              arrayX.shift();
            }
            if (arrayY.length > windowSize) {
              arrayY.shift();
            }
            return setIndexCoordinates({ x, y });
          }
        }

        setIndexCoordinates(undefined);
      }
    }
  }, [webcamRef.current, canvasRef.current, handposeModel, isWebcamReady]);

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
      <Menu indexCoordinates={indexCoordinates} showMenu={showMenu} />
      <Webcam
        ref={webcamRef}
        muted
        imageSmoothing
        videoConstraints={{
          ...videoConstraints,
          deviceId: getHashQueryStringParam("camera"),
        }}
        style={{ opacity: Number(webcam), objectFit: "cover" }}
        // style={{ display: Number(webcam) ? 'block' : 'none' }}
      />

      <canvas ref={canvasRef} />
      <div className="menu-buttons">
        <button
          className="pressable menu-button menu-button__open"
          data-pressable-id="open-menu"
        >
          OPEN MENU
        </button>
        <button
          className="pressable menu-button menu-button__close"
          data-pressable-id="close-menu"
        >
          CLOSE MENU
        </button>
      </div>
      {!isEmpty && <Cart />}
    </div>
  );
}

export default MenuPage;
