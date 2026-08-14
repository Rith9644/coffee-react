import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import OrderModal from "./OrderModal";

function Orders() {
  const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderList);
    }
  );

  return () => unsubscribe();
}, []);

 return (
  <div>
    <h2>Orders</h2>

    <table className="table table-striped mt-4">
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
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.customer?.name}</td>
            <td>{order.customer?.phone}</td>
            <td>${Number(order.total).toFixed(2)}</td>

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

            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedOrder(order)}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {selectedOrder && (
      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    )}
  </div>
);
}

export default Orders;