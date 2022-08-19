import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Item, useCart } from "react-use-cart";

import { IndexCoords, MenuItemCoords } from "./types";
import { isIndexOnTopOfElement } from "./utils/handpose";
import MENU from "./utils/menu";

interface MenuProps {
  indexCoordinates?: IndexCoords;
}

export const Menu = ({ indexCoordinates }: MenuProps) => {
  const [selectedItem, setSelectedItem] = useState<Item>();

  const timeoutId = useRef<number>();
  const currentItem = useRef<Item>();
  const itemsCoordinates = useRef<MenuItemCoords>({});

  const menuItems = useMemo(() => MENU.flatMap((section) => section.items), []);

  const { addItem, updateItemQuantity } = useCart();

  const onSelectedItemChanged = useCallback((selectedItem?: Item) => {
    currentItem.current = selectedItem;
    clearTimeout(timeoutId.current);
  }, []);

  useEffect(() => {
    if (indexCoordinates) {
      const entry = Object.entries(itemsCoordinates.current).find((entry) => {
        const [, { element }] = entry;

        return isIndexOnTopOfElement(indexCoordinates, element);
      });

      if (entry) {
        const hoveredItem = menuItems.find((item) => item.name === entry[0]);

        setSelectedItem(hoveredItem);
      } else {
        setSelectedItem(undefined);
      }
    }
  }, [indexCoordinates]);

  useEffect(() => {
    if (currentItem.current !== selectedItem) {
      onSelectedItemChanged(selectedItem);
    }

    if (selectedItem) {
      timeoutId.current = setTimeout(() => {
        if (selectedItem === currentItem.current) {
          addItem(selectedItem);

          onSelectedItemChanged(undefined);
        }
      }, 3000);
    }
  }, [selectedItem]);

  useEffect(() => {
    menuItems.forEach((item) => {
      const [element] = document.getElementsByClassName(item.name);
      const rect = element?.getBoundingClientRect();

      if (rect) {
        itemsCoordinates.current[item.name] = { rect, element };
      }
    });
  }, []);

  return (
    <div className="menu">
      {MENU.map((section) => (
        <div key={section.name} className="menu__section">
          <div className="menu__item menu__title">{section.name}</div>
          <div className="divider" />
          <div>
            {section.items.map((item) => (
              <div className="menu__wrapper">
                <div
                  key={item.id}
                  className={`menu__item ${item.name} ${
                    item.id === selectedItem?.id ? "selected" : ""
                  } `}
                >
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                </div>
                <div className="menu__btn__container">
                  <button
                    className="menu__control__btn"
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="menu__counter__output">{item.quantity}</span>
                  <button
                    className="menu__control__btn"
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
