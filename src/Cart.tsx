import { useCart } from "react-use-cart";

export const Cart = () => {
  const { isEmpty, totalUniqueItems, updateItemQuantity, items } = useCart();

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

            <div className="cart__btn__container">
                <button className="cart__control__btn" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                <span className="cart__counter__output">{item.quantity}</span>
                <button className="cart__control__btn" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
