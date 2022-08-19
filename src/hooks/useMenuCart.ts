import { useCallback } from "react";
import { useCart } from "react-use-cart";

export default function useMenuCart() {
  const { addItem, items, updateItemQuantity } = useCart();

  const removeItem = useCallback(
    (id: string) => {
      const cartItem = items.find((item) => item.id === id);

      if (cartItem) {
        return updateItemQuantity(cartItem.id, (cartItem.quantity || 1) - 1);
      }
    },
    [items]
  );

  return { addItem, removeItem };
}
