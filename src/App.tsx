import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MenuPage from "./pages/MenuPage";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/webcam" element={<MenuPage webcam />} />
          <Route
            path="/webcam&showCameraSelector"
            element={<MenuPage webcam showCameraSelector />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
