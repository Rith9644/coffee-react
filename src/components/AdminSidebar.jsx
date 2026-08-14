import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="admin-sidebar">

      <h2 className="logo">
        ☕ Dictionary Café
      </h2>

      <Link to="/admin">🏠 Dashboard</Link>

      <Link to="/admin/orders">
        📦 Orders
      </Link>

      <Link to="/admin/menu">
        ☕ Menu
      </Link>

      <Link to="/admin/users">
        👥 Users
      </Link>

    </div>
  );
}

export default AdminSidebar;