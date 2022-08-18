import { useCart } from "react-use-cart";

export const Cart = () => {
  const { isEmpty, totalUniqueItems, items } = useCart();

  if (isEmpty)
    return (
      <div className="cart">
        <div className="cart__item cart__title">Your cart is empty</div>
      </div>
    );

  return (
    <div className="cart">
      <div className="cart__item cart__title">Cart ({totalUniqueItems})</div>

      <ul>
        {items.map((item) => (
          <li key={item.id} className="cart__item">
            {item.quantity} x {item.name} &mdash;
          </li>
        ))}
      </ul>
    </div>
  );
};
