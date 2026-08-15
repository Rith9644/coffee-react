import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import "../../styles/admin.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const snapshot = await getDocs(
        collection(db, "users")
      );

      const userList = snapshot.docs.map((userDoc) => {
        const data = userDoc.data();

        return {
          id: userDoc.id,
          name:
            data.name ||
            data.displayName ||
            "Unnamed User",
          email: data.email || "No email",
          role: data.role || "user",
          status: data.status || "active",
          createdAt: data.createdAt || null,
        };
      });

      setUsers(userList);
    } catch (error) {
      console.error("Error loading users:", error);

      setError(
        error.message || "Could not load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // DELETE USER
  // ==========================================

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteDoc(
        doc(db, "users", deleteId)
      );

      // Remove immediately from screen
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user.id !== deleteId
        )
      );

      closeDeleteModal();
    } catch (error) {
      console.error(
        "Error deleting user:",
        error
      );

      alert(
        error.message ||
          "Could not delete user."
      );
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) =>
      user.status?.toLowerCase() === "active"
  ).length;

  // Users created in the last 7 days
  const newUsers = users.filter((user) => {
    if (!user.createdAt) return false;

    try {
      let date;

      if (
        typeof user.createdAt.toDate ===
        "function"
      ) {
        date = user.createdAt.toDate();
      } else {
        date = new Date(user.createdAt);
      }

      const sevenDaysAgo =
        new Date();

      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
      );

      return date >= sevenDaysAgo;
    } catch {
      return false;
    }
  }).length;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-users-page">

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="users-page-header">

        <div>
          <h1 className="users-title">
            👥 Users
          </h1>

          <p className="users-subtitle">
            Manage café customers and registered users
          </p>
        </div>

        <button
          type="button"
          className="users-website-btn"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          🌐 Go to Website
        </button>

      </div>

      {/* ================================
          ERROR
      ================================= */}

      {error && (
        <div className="users-error">
          ❌ {error}
        </div>
      )}

      {/* ================================
          STATISTICS
      ================================= */}

      <div className="users-stats">

        <div className="user-stat-card">

          <div className="user-stat-icon">
            👥
          </div>

          <div>
            <p>Total Users</p>
            <strong>{totalUsers}</strong>
          </div>

        </div>

        <div className="user-stat-card">

          <div className="user-stat-icon">
            🟢
          </div>

          <div>
            <p>Active Users</p>
            <strong>{activeUsers}</strong>
          </div>

        </div>

        <div className="user-stat-card">

          <div className="user-stat-icon">
            🆕
          </div>

          <div>
            <p>New Users</p>
            <strong>{newUsers}</strong>
          </div>

        </div>

      </div>

      {/* ================================
          USERS TABLE
      ================================= */}

      <div className="users-card">

        <div className="users-card-header">

          <div>
            <h2>Registered Users</h2>

            <p>
              View and manage your café users
            </p>
          </div>

          <span className="users-count">
            {totalUsers}{" "}
            {totalUsers === 1
              ? "User"
              : "Users"}
          </span>

        </div>

        {loading ? (
          <div className="users-loading">
            <div className="spinner-border" />
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="users-empty">

            <div className="users-empty-icon">
              👥
            </div>

            <h3>No users found</h3>

            <p>
              Registered users will appear here.
            </p>

          </div>
        ) : (
          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="users-actions-column">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>
                      <div className="user-name">
                        <div className="user-avatar">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <strong>
                          {user.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="user-email">
                        {user.email}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`role-badge ${
                          user.role === "admin"
                            ? "admin-role"
                            : "user-role"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge">
                        <span className="status-dot" />
                        {user.status}
                      </span>
                    </td>

                    <td className="users-actions-column">

                      <button
                        type="button"
                        className="user-delete-btn"
                        onClick={() =>
                          openDeleteModal(
                            user.id
                          )
                        }
                        title="Delete user"
                      >
                        🗑️
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ================================
          DELETE MODAL
      ================================= */}

      {showDeleteModal && (

        <div className="admin-modal-overlay">

          <div className="admin-modal confirm-modal">

            <div className="delete-warning-icon">
              ⚠️
            </div>

            <h3>
              Delete User?
            </h3>

            <p>
              Are you sure you want to
              delete this user?
            </p>

            <p className="delete-warning-text">
              This will remove the user's
              Firestore record.
            </p>

            <div className="delete-modal-buttons">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Users;