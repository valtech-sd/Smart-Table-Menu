import { MenuSection } from "../types";

const MENU: MenuSection[] = [
  {
    name: "Hot",
    items: [
      {
        id: "1",
        name: "americano",
        price: 9900,
        quantity: 0,
      },
      {
        id: "2",
        name: "espresso",
        price: 16500,
        quantity: 0,
      },
      {
        id: "3",
        name: "capuccino",
        price: 4500,
        quantity: 0,
      },
    ],
  },
  {
    name: "Desserts",
    items: [
      {
        id: "4",
        name: "croissant",
        price: 9900,
        quantity: 0,
      },
      {
        id: "5",
        name: "bagel",
        price: 16500,
        quantity: 0,
      },
      {
        id: "6",
        name: "brownie",
        price: 4500,
        quantity: 0,
      },
    ],
  },
];

export default MENU;
