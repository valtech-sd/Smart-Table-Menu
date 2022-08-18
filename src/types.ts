import { Item } from "react-use-cart";

export type IndexCoords = {
  x: number;
  y: number;
};

export interface MenuItemCoords {
  [key: string]: { rect: DOMRect; element: Element };
}

export type MenuSection = {
  name: string;
  items: Item[];
};

export type Menu = MenuSection[];
