import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import "../../styles/admin.css";

function OrderModal({ order, onClose }) {
  if (!order) return null;

  const [selectedStatus, setSelectedStatus] = useState(null);

  const updateStatus = async (status) => {
    try {
      await updateDoc(doc(db, "orders", order.id), {
        status,
      });

      setSelectedStatus(null);
      onClose();
    } catch (error) {
      console.error("Update status failed:", error);
      alert(error.message);
    }
  };

  return (
    <>
      {/* Order Details Modal */}
      <div
        className="admin-modal-overlay"
        onClick={onClose}
      >
        <div
          className="admin-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Order Details</h3>

          <hr />

          <p><strong>Name:</strong> {order.customer?.name}</p>
          <p><strong>Phone:</strong> {order.customer?.phone}</p>
          <p><strong>Address:</strong> {order.customer?.address}</p>
          <p><strong>Payment:</strong> {order.payment}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`badge ${
                order.status === "Pending"
                  ? "bg-warning text-dark"
                  : order.status === "Preparing"
                  ? "bg-info"
                  : order.status === "Completed"
                  ? "bg-success"
                  : order.status === "Cancelled"
                  ? "bg-danger"
                  : "bg-secondary"
              }`}
            >
              {order.status || "Pending"}
            </span>
          </p>

          <hr />

          <h5>Items</h5>

          {order.items?.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between mb-2"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr />

          <h4>Total: ${Number(order.total).toFixed(2)}</h4>

          <div className="d-flex gap-2 mt-4 flex-wrap">
            <button
              className="btn btn-warning"
              onClick={() => setSelectedStatus("Pending")}
            >
              Pending
            </button>

            <button
              className="btn btn-info text-white"
              onClick={() => setSelectedStatus("Preparing")}
            >
              Preparing
            </button>

            <button
              className="btn btn-success"
              onClick={() => setSelectedStatus("Completed")}
            >
              Completed
            </button>

            <button
              className="btn btn-danger"
              onClick={() => setSelectedStatus("Cancelled")}
            >
              Cancelled
            </button>

            <button
              className="btn btn-secondary ms-auto"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedStatus && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Confirm Status Change</h4>

            <p className="mt-3">
              Are you sure you want to change this order status to
              <strong> {selectedStatus}</strong>?
            </p>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedStatus(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => updateStatus(selectedStatus)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderModal;