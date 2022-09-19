import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CameraSelection() {
  const [deviceId, setDeviceId] = useState("");
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>();
  const [value, setValue] = useState("");

  const handleChange = (event: any) => {
    if (mediaDevices) {
      const device = mediaDevices.find(
        (mediaDevice) => mediaDevice.label === event.target.value
      );
      setValue(device?.label!);
      setDeviceId(device?.deviceId!);
    }
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const filteredDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setDeviceId(filteredDevices[0].deviceId);
      setValue(filteredDevices[0].label);

      setMediaDevices(filteredDevices);
    });
  }, []);

  return (
    <div className="selection-container">
      <select value={value} onChange={handleChange} className="dropdown">
        {mediaDevices?.map((device) => (
          <option key={device.label} value={device.label}>
            {device.label}
          </option>
        ))}
      </select>
      <Link className="link" to={`/webcam/${deviceId}`}>
        Webcam
      </Link>
      <Link className="link" to={`/nowebcam/${deviceId}`}>
        No Webcam
      </Link>
    </div>
  );
}

export default CameraSelection;
