import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import "../../styles/admin.css";

function Users() {


  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleChangeUser, setRoleChangeUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [changingRole, setChangingRole] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal
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

          email:
            data.email ||
            "No email",

          role:
            data.role ||
            "user",

          status:
            data.status ||
            "active",

          createdAt:
            data.createdAt ||
            null,
        };
      });

      setUsers(userList);
    } catch (error) {
      console.error(
        "Error loading users:",
        error
      );

      setError(
        error.message ||
          "Could not load users."
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
      setError("");

      // Delete user document from Firestore
      await deleteDoc(
        doc(db, "users", deleteId)
      );

      // Remove user immediately from screen
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            user.id !== deleteId
        )
      );

      // Close modal
      closeDeleteModal();

    } catch (error) {
      console.error(
        "Error deleting user:",
        error
      );

      setError(
        error.message ||
          "Could not delete user."
      );
    }
  };

  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  const openRoleModal = (user, role) => {
  // If they selected the same role, do nothing
  if (user.role === role) {
    return;
  }

  setRoleChangeUser(user);
  setNewRole(role);
  setShowRoleModal(true);
};

const closeRoleModal = () => {
  if (changingRole) return;

  setShowRoleModal(false);
  setRoleChangeUser(null);
  setNewRole("");
};

const confirmRoleChange = async () => {
  if (!roleChangeUser || !newRole) return;

  try {
    setChangingRole(true);

    await updateDoc(
      doc(db, "users", roleChangeUser.id),
      {
        role: newRole,
      }
    );

    // Update UI immediately
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === roleChangeUser.id
          ? {
              ...user,
              role: newRole,
            }
          : user
      )
    );

    closeRoleModal();

  } catch (error) {
    console.error(
      "Error updating user role:",
      error
    );

    alert(
      error.message ||
        "Could not update user role."
    );
  } finally {
    setChangingRole(false);
  }
};
  // ==========================================
  // STATISTICS
  // ==========================================

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (user) =>
        user.status?.toLowerCase() ===
        "active"
    ).length;

  // Users created in the last 7 days
  const newUsers =
    users.filter((user) => {
      if (!user.createdAt) {
        return false;
      }

      try {
        let date;

        if (
          typeof user.createdAt.toDate ===
          "function"
        ) {
          date =
            user.createdAt.toDate();
        } else {
          date =
            new Date(user.createdAt);
        }

        const sevenDaysAgo =
          new Date();

        sevenDaysAgo.setDate(
          sevenDaysAgo.getDate() - 7
        );

        return (
          date >= sevenDaysAgo
        );
      } catch {
        return false;
      }
    }).length;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-users-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

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

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="users-error">
          ❌ {error}
        </div>
      )}

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="users-stats">

        {/* TOTAL USERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            👥
          </div>

          <div>
            <p>Total Users</p>

            <strong>
              {totalUsers}
            </strong>
          </div>

        </div>


        {/* ACTIVE USERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            🟢
          </div>

          <div>
            <p>Active Users</p>

            <strong>
              {activeUsers}
            </strong>
          </div>

        </div>


        {/* NEW USERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon">
            🆕
          </div>

          <div>
            <p>New Users</p>

            <strong>
              {newUsers}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================
          USERS TABLE CARD
      ====================================== */}

      <div className="users-table-card">

        {/* TABLE HEADER */}

        <div className="users-table-header">

          <div>
            <h3>
              Registered Users
            </h3>

            <p>
              View and manage your café users
            </p>
          </div>

          <span className="users-count">
            {users.length}{" "}
            {users.length === 1
              ? "User"
              : "Users"}
          </span>

        </div>


        {/* ===================================
            LOADING
        ==================================== */}

        {loading ? (

          <div className="users-loading">
            <div className="loading-spinner"></div>

            <p>
              Loading users...
            </p>
          </div>

        ) : (

          <div className="users-table-wrapper">

            <table className="users-table">

              {/* COLUMN WIDTHS */}

              <colgroup>
                <col className="user-col" />
                <col className="email-col" />
                <col className="role-col" />
                <col className="status-col" />
                <col className="actions-col" />
              </colgroup>


              {/* TABLE HEADER */}

              <thead>
                <tr>
                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>


              {/* TABLE BODY */}

              <tbody>

                {/* NO USERS */}

                {users.length === 0 ? (

                  <tr>

                    <td colSpan="5">

                      <div className="no-users">

                        <div className="no-users-icon">
                          👥
                        </div>

                        <h4>
                          No users found
                        </h4>

                        <p>
                          Registered users will appear here.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  /* USERS */

                  users.map((user) => (

                    <tr
                      key={user.id}
                    >

                      {/* =================
                          USER
                      ================== */}

                      <td>

                        <div className="user-info">

                          <div className="user-avatar">
                            {user.name
                              ? user.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>

                          <strong>
                            {user.name ||
                              "Unknown User"}
                          </strong>

                        </div>

                      </td>


                      {/* =================
                          EMAIL
                      ================== */}

                      <td>

                        <span className="user-email">
                          {user.email}
                        </span>

                      </td>


                      {/* =================
                          ROLE
                      ================== */}

                      <td>

                        <select
                          value={
                            user.role ||
                            "user"
                          }
                            value={user.role || "user"}
                            onChange={(e) =>
                              openRoleModal(
                                user,
                                e.target.value
                              )
                            }
                            className={`role-select ${
                              user.role === "admin"
                                ? "role-admin-select"
                                : "role-user-select"
                            }`}
                          >
                            <option value="user">
                              User
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>
                      </td>


                      {/* =================
                          STATUS
                      ================== */}

                      <td>

                        <span className="status-badge">

                          <span className="status-dot"></span>

                          {user.status
                            ? user.status
                                .charAt(0)
                                .toUpperCase() +
                              user.status.slice(
                                1
                              )
                            : "Active"}

                        </span>

                      </td>


                      {/* =================
                          ACTIONS
                      ================== */}

                      <td>

                        <div className="user-actions">

                          <button
                            type="button"
                            className="user-delete-btn"
                            onClick={() =>
                              openDeleteModal(
                                user.id
                              )
                            }
                            title="Delete user"
                            aria-label={`Delete ${user.name}`}
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

        )}

      </div>


      {/* =====================================
          DELETE CONFIRMATION MODAL
      ====================================== */}

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


            {/* TITLE */}

            <h3>
              Delete User?
            </h3>


            {/* MESSAGE */}

            <p>
              Are you sure you want to
              delete this user?
            </p>

            <p className="delete-warning-text">
              This will remove the user's
              Firestore record.
            </p>


            {/* BUTTONS */}

            <div className="delete-modal-buttons">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={
                  closeDeleteModal
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={
                  handleDelete
                }
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ==========================================
    ROLE CHANGE CONFIRMATION MODAL
========================================== */}

{showRoleModal && roleChangeUser && (
  <div className="admin-modal-overlay">

    <div className="admin-modal confirm-modal">

      <div className="role-warning-icon">
        🔐
      </div>

      <h3>
        Change User Role?
      </h3>

      <p>
        You are about to change the role of:
      </p>

      <strong className="role-user-name">
        {roleChangeUser.name}
      </strong>

      <div className="role-change-display">

        <span
          className={
            roleChangeUser.role === "admin"
              ? "role-badge admin-role"
              : "role-badge user-role"
          }
        >
          {roleChangeUser.role === "admin"
            ? "Admin"
            : "User"}
        </span>

        <span className="role-arrow">
          →
        </span>

        <span
          className={
            newRole === "admin"
              ? "role-badge admin-role"
              : "role-badge user-role"
          }
        >
          {newRole === "admin"
            ? "Admin"
            : "User"}
        </span>

      </div>

      {newRole === "admin" ? (
        <p className="role-warning-text">
          ⚠️ This user will receive administrator
          permissions.
        </p>
      ) : (
        <p className="role-warning-text">
          ℹ️ This user will no longer have
          administrator permissions.
        </p>
      )}

      <div className="delete-modal-buttons">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={closeRoleModal}
          disabled={changingRole}
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={confirmRoleChange}
          disabled={changingRole}
        >
          {changingRole
            ? "Changing..."
            : "Confirm Change"}
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}

export default Users;