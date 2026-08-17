import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import OrderModal from "./OrderModal";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const orderList = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        setOrders(orderList);
      },
      (error) => {
        console.error("Error loading orders:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // OPEN DELETE MODAL
  // ==========================================

  const openDeleteModal = (orderId) => {
    setDeleteId(orderId);
    setShowDeleteModal(true);
  };

  // ==========================================
  // CLOSE DELETE MODAL
  // ==========================================

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteId(null);
    setShowDeleteModal(false);
  };

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteDoc(doc(db, "orders", deleteId));

      // onSnapshot will update the table automatically.
      setDeleteId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting order:", error);

      alert(
        error.message ||
          "Could not delete the order."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-orders-page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="orders-page-header">
        <div>
          <h2>📦 Orders</h2>
          <p>Manage and review customer orders</p>
        </div>

        <span className="orders-count">
          {orders.length} Orders
        </span>
      </div>

      {/* ==========================================
          ORDERS TABLE
      ========================================== */}

      <div className="orders-table-card">

        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {orders.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    <div className="no-orders">
                      <div className="no-orders-icon">
                        📦
                      </div>

                      <h3>No orders found</h3>

                      <p>
                        Customer orders will appear here.
                      </p>
                    </div>
                  </td>
                </tr>

              ) : (

                orders.map((order) => (

                  <tr key={order.id}>

                    {/* CUSTOMER */}
                    <td>
                      <strong>
                        {order.customer?.name ||
                          "Unknown Customer"}
                      </strong>
                    </td>

                    {/* PHONE */}
                    <td>
                      {order.customer?.phone ||
                        "No phone"}
                    </td>

                    {/* TOTAL */}
                    <td>
                      <strong>
                        $
                        {Number(
                          order.total || 0
                        ).toFixed(2)}
                      </strong>
                    </td>

                    {/* STATUS */}
                    <td>
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
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="order-actions">

                        {/* VIEW */}
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                        >
                          View
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          className="order-delete-btn"
                          onClick={() =>
                            openDeleteModal(order.id)
                          }
                          title="Delete order"
                        >
                          🗑️
                        </button>

                      </div>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==========================================
          VIEW ORDER MODAL
      ========================================== */}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      {showDeleteModal && (

        <div
          className="admin-modal-overlay"
          onClick={closeDeleteModal}
        >

          <div
            className="admin-modal confirm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* WARNING ICON */}
            <div className="delete-warning-icon">
              ⚠️
            </div>

            <h3>
              Delete Order?
            </h3>

            <p>
              Are you sure you want to
              delete this order?
            </p>

            <p className="delete-warning-text">
              This action cannot be undone.
            </p>

            {/* BUTTONS */}
            <div className="delete-modal-buttons">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Order"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Orders;