import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import "../styles/checkout.css";

function CheckoutModal({ show, onClose }) {
  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // NEW
  const [payment, setPayment] = useState("Cash on Delivery");

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "orders"), {
        customer,
        items: cartItems,
        total: cartTotal,
        payment,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      clearCart();

      setShowSuccess(true);
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order.");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);

    onClose();

    setCustomer({
      name: "",
      phone: "",
      address: "",
    });

    setPayment("Cash on Delivery");

    navigate("/menu");
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="checkout-overlay"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="checkout-modal">

        <div className="checkout-header">
          <h4>
            <i className="bi bi-bag-check me-2"></i>
            Checkout
          </h4>

          <button
            type="button"
            className="checkout-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="checkout-body">

          <h5 className="mb-3">Your Order</h5>

          <div className="checkout-items">

            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item.id || item.name}
              >
                <div>
                  <strong>{item.name}</strong>

                  <small>
                    {item.quantity} × $
                    {Number(item.price).toFixed(2)}
                  </small>
                </div>

                <strong>
                  $
                  {(Number(item.price) * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}

          </div>

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ${cartTotal.toFixed(2)}
            </strong>
          </div>

          <hr />

          <h5 className="mb-3">
            Customer Information
          </h5>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={customer.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Enter your phone number"
                value={customer.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Delivery Address
              </label>

              <textarea
                name="address"
                className="form-control"
                rows="3"
                placeholder="Enter your address"
                value={customer.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Payment */}
            <div className="mb-4">
              <label className="form-label">
                Payment Method
              </label>

              <select
                className="form-select"
                value={payment}
                onChange={(e) =>
                  setPayment(e.target.value)
                }
              >
                <option value="Cash on Delivery">
                  Cash on Delivery
                </option>

                <option value="Pay at Café">
                  Pay at Café
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 checkout-submit"
            >
              <i className="bi bi-check-circle me-2"></i>
              Confirm Order
            </button>

          </form>

        </div>
      </div>

      {/* Success */}
      {showSuccess && (
        <div className="checkout-success-overlay">

          <div className="checkout-success">

            <div className="success-icon">
              <i className="bi bi-check-lg"></i>
            </div>

            <h3>Order Confirmed!</h3>

            <p>
              Thank you, {customer.name}.
            </p>

            <p className="text-muted">
              Your order has been successfully placed.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCloseSuccess}
            >
              Done
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default CheckoutModal;