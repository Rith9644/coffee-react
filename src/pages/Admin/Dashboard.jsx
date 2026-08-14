import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "../../styles/admin.css";

function Dashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMenu, setTotalMenu] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      // Orders
      const orderSnapshot = await getDocs(collection(db, "orders"));

      const orders = orderSnapshot.docs.map((doc) => doc.data());

      setTotalOrders(orders.length);

      const revenue = orders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
      );


      setTotalRevenue(revenue);

      // Users
      const userSnapshot = await getDocs(collection(db, "users"));
      setTotalUsers(userSnapshot.size);

      // Menu
      const menuSnapshot = await getDocs(collection(db, "menu"));
      setTotalMenu(menuSnapshot.size);
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-content">
      <h2>Dashboard</h2>

      <p className="dashboard-subtitle">
        Welcome back, Admin 👋
      </p>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon orders-icon">
          <i className="bi bi-bag-check-fill"></i>
        </div>
          <h3>Orders</h3>

          <h1>{totalOrders}</h1>

          <p>Total Orders</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon revenue-icon">
          <i className="bi bi-cash-stack"></i>
      </div>

          <h3>Revenue</h3>

          <h1>${totalRevenue.toFixed(2)}</h1>

          <p>Total Revenue</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon users-icon">
          <i className="bi bi-people-fill"></i>
      </div>

          <h3>Users</h3>

          <h1>{totalUsers}</h1>

          <p>Registered Users</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon menu-icon">
          <i className="bi bi-cup-hot-fill"></i>
      </div>

          <h3>Menu</h3>

          <h1>{totalMenu}</h1>

          <p>Coffee Items</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;