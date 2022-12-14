import { useMemo } from "react";
import { Item, useCart } from "react-use-cart";

interface MenuEntryProps {
  item: Item;
  isSelected: boolean;
  showQuantityMenu: boolean;
}

export default function MenuEntry({
  item,
  showQuantityMenu,
  isSelected,
}: MenuEntryProps) {
  const { items: cartItems } = useCart();

  const cartItem = useMemo(
    () => cartItems.find((cartItem) => cartItem.id === item.id),
    [cartItems]
  );

  return (
    <div className="menu__item-wrapper">
      <div className="menu__item">
        <h2>{item.name}</h2>
        <p>${item.price}</p>
      </div>
      <div className={`menu__btn__container show`}>
        <button
          className="menu__control__btn pressable"
          data-pressable-id="remove-from-cart"
          data-product={JSON.stringify(item)}
        >
          -
        </button>

        <span className="menu__counter__output">{cartItem?.quantity || 0}</span>

        <button
          className="menu__control__btn pressable"
          data-pressable-id="add-to-cart"
          data-product={JSON.stringify(item)}
        >
          +
        </button>
      </div>
    </div>
  );
}
