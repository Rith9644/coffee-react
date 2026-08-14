import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AdminSidebar from "../../components/AdminSidebar";

import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Users from "./Users";
import MenuManager from "./MenuManager";

import "../../styles/admin.css";

function Admin() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="admin-layout">


      <AdminSidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      <div className="admin-main">

        <Routes>

          <Route index element={<Dashboard />} />

          <Route path="orders" element={<Orders />} />

          <Route path="menu" element={<MenuManager />} />

          <Route path="users" element={<Users />} />

        </Routes>

      </div>

    </div>
  );
}

export default Admin;