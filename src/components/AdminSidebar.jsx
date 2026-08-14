import { useState } from "react";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger - only visible on mobile/tablet */}
      <button
        type="button"
        className="admin-hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Open admin menu"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {/* Dark overlay */}
      {isOpen && (
        <div
          className="admin-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? "show" : ""}`}>
        <div className="admin-sidebar-header">
          <h2 className="logo">☕ Dictionary Café</h2>

          {/* Close button - mobile only */}
          <button
            type="button"
            className="admin-close"
            onClick={closeSidebar}
            aria-label="Close admin menu"
          >
            ×
          </button>
        </div>

        <nav className="admin-links">
          <NavLink
            to="/admin"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            🏠 Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            📦 Orders
          </NavLink>

          <NavLink
            to="/admin/menu"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            ☕ Menu
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            👥 Users
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;