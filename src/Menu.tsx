import { useEffect, useState } from "react";

const MENU_IDS = [
  "americano",
  "espresso",
  "capuccino",
  "latte",
  "tea",
  "croissant",
  "bagel",
  "doughnut",
  "brownie",
  "cookie",
];

interface Coords {
  [x: string]: DOMRect | undefined;
}

export const Menu = () => {
  const [coordinates, setCoordinates] = useState<Coords[]>([]);

  useEffect(() => {
    const menuCoords = MENU_IDS.map((item) => {
      const element = document.getElementById(item);
      const rect = element?.getBoundingClientRect();
      return { [item]: rect };
    });
    setCoordinates(menuCoords);
  }, []);

  return (
    <div className="menu container">
      <div>
        <>
          <div className="table title">Hot</div>
          <div className="divider" />
        </>
        <div>
          <div className="table" id="americano">
            <p>Americano</p>
            <p>$4.00</p>
          </div>
          <div className="table" id="espresso">
            <p>Espresso</p>
            <p>$4.00</p>
          </div>
          <div className="table" id="capuccino">
            <p>Capuccino</p>
            <p>$5.00</p>
          </div>
          <div className="table" id="latte">
            <p>Latte</p>
            <p>$5.00</p>
          </div>
          <div className="table" id="tea">
            <p>Tea</p>
            <p>$4.00</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 30 }}>
        <>
          <div className="table title">Desserts</div>
          <div className="divider" />
        </>
        <div>
          <div className="table" id="croissant">
            <p>Croissant</p>
            <p>$4.00</p>
          </div>
          <div className="table" id="bagel">
            <p>Bagel</p>
            <p>$4.00</p>
          </div>
          <div className="table" id="doughnut">
            <p>Doughnut</p>
            <p>$5.00</p>
          </div>
          <div className="table" id="brownie">
            <p>Brownie</p>
            <p>$5.00</p>
          </div>
          <div className="table" id="cookie">
            <p>Cookie</p>
            <p>$4.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};
