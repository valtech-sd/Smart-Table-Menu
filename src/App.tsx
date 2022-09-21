import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MenuPage from "./pages/MenuPage";

import "./App.scss";
import CameraSelection from "./pages/CameraSelection";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<CameraSelection />} />
          <Route path="/webcam" element={<MenuPage webcam />} />
          <Route path="/nowebcam" element={<MenuPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
