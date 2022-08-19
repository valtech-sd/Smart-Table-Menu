import { useEffect, useState } from "react";

import useGetElementBeingPressed from "../../hooks/useGetElementBeingPressed";
import useIsElementBeingPressed from "../../hooks/useIsElementBeingPressed";
import MENU from "../../utils/menu";
import useMenuCart from "../../hooks/useMenuCart";

import MenuEntry from "./MenuEntry";

import { IndexCoords } from "../../types";

interface MenuProps {
  indexCoordinates?: IndexCoords;
  showMenu: boolean;
}

export const Menu = ({ indexCoordinates, showMenu }: MenuProps) => {
  const [showQuantityMenu, setShowQuantityMenu] = useState("");

  const { addItem, removeItem } = useMenuCart();

  const { pressedElementId, pressedElementProduct } =
    useGetElementBeingPressed(indexCoordinates);
  const isPressedAfter3Secs = useIsElementBeingPressed(3000, indexCoordinates);

  useEffect(() => {
    if (isPressedAfter3Secs && pressedElementId && pressedElementProduct) {
      switch (pressedElementId) {
        case "add-to-cart":
          return addItem(pressedElementProduct);

        case "remove-from-cart":
          return removeItem(pressedElementProduct.id);

        case "menu-item":
          return setShowQuantityMenu(pressedElementProduct.id);
      }
    }
  }, [isPressedAfter3Secs, pressedElementId, pressedElementProduct]);

  return (
    <div className={`menu ${showMenu ? "show" : ""}`}>
      {MENU.map((section) => (
        <div key={section.name} className="menu__section">
          <div className="menu__item menu__title">{section.name}</div>
          {section.items.map((item) => (
            <MenuEntry
              key={item.id}
              item={item}
              isSelected={
                pressedElementId === "menu-item" &&
                pressedElementProduct?.id === item.id
              }
              showQuantityMenu={showQuantityMenu === item.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
