import { useState } from "react";
import { useCart } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal";
import "../styles/cart.css";

function CartModal({ show, onClose }) {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  // If cart modal is closed, don't display it
  if (!show) {
    return null;
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    setShowCheckout(true);
  };

  return (
    <>
      {/* Cart dark background */}
      <div
        className="cart-overlay"
        onClick={onClose}
      ></div>

      {/* Cart Modal */}
      <div className="cart-modal">

        {/* Header */}
        <div className="cart-modal-header">
          <h4>
            <i className="bi bi-cart3 me-2"></i>
            Your Cart
          </h4>

          <button
            type="button"
            className="cart-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="cart-modal-body">

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="bi bi-cart-x"></i>

              <h5>Your cart is empty</h5>

              <p>
                Add something delicious from our menu.
              </p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  className="cart-item"
                  key={item.id || item.name}
                >

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  {/* Information */}
                  <div className="cart-item-info">

                    <h6>{item.name}</h6>

                    <p>
                      $
                      {Number(item.price).toFixed(2)}
                    </p>

                    <div className="quantity-controls">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.name)
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.name)
                        }
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* Right side */}
                  <div className="cart-item-right">

                    <strong>
                      $
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </strong>

                    <button
                      type="button"
                      className="remove-cart-btn"
                      onClick={() =>
                        removeFromCart(item.name)
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </button>

                  </div>

                </div>
              ))}

              {/* Total */}
              <div className="cart-total">
                <span>Total:</span>

                <strong>
                  ${cartTotal.toFixed(2)}
                </strong>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-modal-footer">

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Continue Shopping
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCheckout}
            >
              <i className="bi bi-credit-card me-2"></i>
              Checkout
            </button>

          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        show={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}

export default CartModal;