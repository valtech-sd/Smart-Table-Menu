import { useCart } from "react-use-cart";

export const Cart = () => {
  const { items, cartTotal } = useCart();

  return (
    <div className="cart">
      <div className="cart__item cart__title">Cart - ${cartTotal}</div>
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
      <div className="divider" />
      <div className="cart__footer">
        When ready to place your order, do a 👍 sign to the camera
      </div>
    </div>
  );
};
