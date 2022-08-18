import { useEffect, useRef, useState } from "react";
import { useCart } from "react-use-cart";

import { IndexCoords, MenuItemCoords } from "./types";

const MENU_IDS = [
  {
    name: "Hot",
    items: [
      {
        id: 1,
        name: "americano",
        price: 9900,
        quantity: 1,
      },
      {
        id: 2,
        name: "espresso",
        price: 16500,
        quantity: 5,
      },
      {
        id: 3,
        name: "capuccino",
        price: 4500,
        quantity: 1,
      },
    ],
  },
  {
    name: "Desserts",
    items: [
      {
        id: 1,
        name: "croissant",
        price: 9900,
        quantity: 1,
      },
      {
        id: 2,
        name: "bagel",
        price: 16500,
        quantity: 5,
      },
      {
        id: 3,
        name: "brownie",
        price: 4500,
        quantity: 1,
      },
    ],
  },
];

interface MenuProps {
  indexCoordinates?: IndexCoords;
}

export const Menu = ({ indexCoordinates }: MenuProps) => {
  const [selectedItem, setSelectedItem] = useState<string>();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const itemsCoordinates = useRef<MenuItemCoords>({});
  const { addItem } = useCart();

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
      const [element] = document.getElementsByClassName(item.name);
      const rect = element?.getBoundingClientRect();

      if (rect) {
        itemsCoordinates.current[item.name] = rect;
      }
    });
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const items = MENU_IDS.flatMap((section) => section.items);
      const selected = items.find(item => item.name === selectedItem);
      
      addItem(selected);
    }
  }, [selectedItem]);

  return (
    <div className="menu">
      {MENU_IDS.map((section) => (
        <div key={section.name} className="menu__section">
          <div className="menu__item menu__title">{section.name}</div>
          <div className="divider" />
          <div>
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`menu__item ${item.name} ${
                  item.name === selectedItem ? "selected" : ""
                } `}
              >
                <p>{item.name}</p>
                <p>${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
