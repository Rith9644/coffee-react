import { Routes, Route } from "react-router-dom";

import AdminSidebar from "../../components/AdminSidebar";

import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Users from "./Users";
import MenuManager from "./MenuManager";

import "../../styles/admin.css";

function Admin() {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <Routes>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="menu"
            element={<MenuManager />}
          />

        </Routes>

      </div>

    </div>
  );
}

export default Admin;