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
      <div className="divider" />
      <ul className="cart__section">
        {items.map((item) => (
          <li key={item.id} className="cart__item">
            <span>
              {item.quantity} x {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
