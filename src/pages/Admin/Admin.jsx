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

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <AdminSidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />


      {/* =========================================
          RIGHT SIDE
      ========================================= */}
      <div className="admin-content">

        {/* =======================================
            PAGE CONTENT
        ======================================= */}
        <main className="admin-main">

          <Routes>

            {/* DASHBOARD */}
            <Route
              index
              element={<Dashboard />}
            />

            {/* ORDERS */}
            <Route
              path="orders"
              element={<Orders />}
            />

            {/* MENU */}
            <Route
              path="menu"
              element={<MenuManager />}
            />

            {/* USERS */}
            <Route
              path="users"
              element={<Users />}
            />

          </Routes>

        </main>


    
      </div>

    </div>
  );
}

export default Admin;