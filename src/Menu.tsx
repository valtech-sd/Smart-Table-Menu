import { useEffect, useRef, useState } from "react";
import { IndexCoords, MenuItemCoords } from "./types";

const MENU_IDS = [
  {
    name: "Hot",
    items: ["americano", "espresso", "capuccino", "latte", "tea"],
  },
  {
    name: "Desserts",
    items: ["croissant", "bagel", "doughnut", "brownie", "cookie"],
  },
];

interface MenuProps {
  indexCoordinates?: IndexCoords;
}

export const Menu = ({ indexCoordinates }: MenuProps) => {
  const [selectedItem, setSelectedItem] = useState<string>();
  const itemsCoordinates = useRef<MenuItemCoords>({});

  useEffect(() => {
    if (indexCoordinates) {
      const entry = Object.entries(itemsCoordinates.current).find((entry) => {
        const [, coordinates] = entry;

        return (
          coordinates.left < indexCoordinates.x &&
          coordinates.right > indexCoordinates.x &&
          coordinates.top < indexCoordinates.y &&
          coordinates.bottom > indexCoordinates.y
        );
      });

      if (entry) {
        setSelectedItem(entry[0]);
      }
    }
  }, [indexCoordinates]);

  useEffect(() => {
    const items = MENU_IDS.flatMap((section) => section.items);

    items.forEach((item) => {
      const [element] = document.getElementsByClassName(item);
      const rect = element?.getBoundingClientRect();

      if (rect) {
        itemsCoordinates.current[item] = rect;
      }
    });
  }, []);

  return (
    <div className="menu">
      {MENU_IDS.map((section) => (
        <div key={section.name} className="menu__section">
          <div className="menu__item menu__title">{section.name}</div>
          <div className="divider" />
          <div>
            {section.items.map((item) => (
              <div
                key={item}
                className={`menu__item ${item} ${
                  item === selectedItem ? "selected" : ""
                } `}
              >
                <p>{item}</p>
                <p>$4.00</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
