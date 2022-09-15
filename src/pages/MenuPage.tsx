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

function MenuPage({
  webcam = false,
  showCameraSelector = false,
}: MenuPageProps) {
  const { isEmpty, emptyCart } = useCart();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const timeoutId = useRef<any>();
  const currentItem = useRef<string>();
  const fingerHoverSelectionTime = 1500;
  //////////////////////////
  const [deviceId, setDeviceId] = useState("");
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>();
  const [value, setValue] = useState("");
  let [x, y] = [0, 0];
  let speed = 0.4;
  let pointX = 0;
  let pointY = 0;


  const handleChange = (event: any) => {
    if (mediaDevices) {
      const device = mediaDevices.find(
        (mediaDevice) => mediaDevice.label === event.target.value
      );
      setValue(device?.label!);
      setDeviceId(device?.deviceId!);
      requestRef.current = requestAnimationFrame(app);
    }
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const filteredDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      const obsDevice = filteredDevices.find((mediaDevice) =>
        mediaDevice.label.includes("OBS")
      );

      if (obsDevice) {
        setDeviceId(obsDevice.deviceId);
        setValue(obsDevice.label);
      }

      setMediaDevices(filteredDevices);
    });
  }, []);
  //////////////////////////

  const [handposeModel, setHandposeModel] = useState<HandPose>();
  const [indexCoordinates, setIndexCoordinates] = useState<IndexCoords>();

  const { pressedElementId } = useGetElementBeingPressed(indexCoordinates);

  const [emoji, setEmoji] = useState(undefined);
  const [showToast, setShowToast] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toastClass = useMemo(() => (showToast ? "show" : "hide"), [showToast]);

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
          const canvasContext = canvasRef.current.getContext("2d");

          if (canvasContext) {
            let distX = x - pointX;
            let distY = y - pointY;
            pointX = pointX + (distX * speed);
            pointY = pointY + (distY * speed);  
            canvasContext.beginPath();
            canvasContext.arc(pointX, pointY, 10, 0, 2 * Math.PI);
            canvasContext.fillStyle = "red";
            canvasContext.fill();
          }

          if (lastFingerDot) {
             [x, y] = lastFingerDot;

            return setIndexCoordinates({ x, y });
          }
        }

        setIndexCoordinates(undefined);
      }
    }
  }, [
    webcamRef.current,
    canvasRef.current,
    handposeModel,
    isWebcamReady,
    deviceId,
  ]);

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
      {showCameraSelector && (
        <select value={value} onChange={handleChange} className="dropdown">
          {mediaDevices?.map((device) => (
            <option key={device.label} value={device.label}>
              {device.label}
            </option>
          ))}
        </select>
      )}
      <div className={`toast toast--${toastClass}`}>Order in progress!</div>
      <Menu indexCoordinates={indexCoordinates} showMenu={showMenu} />
      <Webcam
        ref={webcamRef}
        muted
        imageSmoothing
        videoConstraints={{ ...videoConstraints, deviceId }}
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
