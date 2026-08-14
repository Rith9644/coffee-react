import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import Es from "../../assets/images/Es.jpeg";
import CaramelLatte from "../../assets/images/Caramel Latte.jpg";
import MatchaLatte from "../../assets/images/Iced-Matcha-Latte-recipe.jpg";
import CheeseCroissant from "../../assets/images/sp_web__0004_ham_and_cheese_croissant_cmyk_small.jpg";
import IcedAmericano from "../../assets/images/Iced_Americano.jpg";
import ChocolateMuffin from "../../assets/images/featured-image-chocolate-espresso-muffins.jpg";
import cake from "../../assets/images/image.png";

import "../../styles/admin.css";

/* =========================================================
   LOCAL IMAGE MAP
========================================================= */

const imageMap = {
  "Es.jpeg": Es,

  "Caramel Latte.jpg": CaramelLatte,

  "Iced-Matcha-Latte-recipe.jpg": MatchaLatte,

  "sp_web__0004_ham_and_cheese_croissant_cmyk_small.jpg":
    CheeseCroissant,

  "Iced_Americano.jpg": IcedAmericano,

  "featured-image-chocolate-espresso-muffins.jpg":
    ChocolateMuffin,

  "image.png": cake,
};

/* =========================================================
   CHECK IF IMAGE IS A DIRECT IMAGE URL
========================================================= */

const isDirectImageUrl = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

  const url = value.trim();

  return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);
};

/* =========================================================
   GET IMAGE URL FROM A WEBPAGE
========================================================= */

const getImageFromUrl = async (value) => {
  if (!value || typeof value !== "string") {
    throw new Error("Please enter an image URL.");
  }

  const cleanUrl = value.trim();

  /* -------------------------------------------------------
     LOCAL IMAGE
  ------------------------------------------------------- */

  if (imageMap[cleanUrl]) {
    return imageMap[cleanUrl];
  }

  /* -------------------------------------------------------
     DIRECT IMAGE URL
  ------------------------------------------------------- */

  if (isDirectImageUrl(cleanUrl)) {
    return cleanUrl;
  }

  /* -------------------------------------------------------
     WEBPAGE URL
  ------------------------------------------------------- */

  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(
      cleanUrl
    )}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Could not read this webpage.");
    }

    const data = await response.json();

    console.log("Microlink response:", data);

    const image =
      data?.data?.image?.url ||
      data?.data?.image ||
      data?.data?.logo?.url ||
      data?.data?.logo ||
      "";

    if (!image || typeof image !== "string") {
      throw new Error(
        "No image was found on this webpage."
      );
    }

    return image;
  } catch (error) {
    console.error("getImageFromUrl error:", error);

    throw new Error(
      "Could not find an image from this link."
    );
  }
};

/* =========================================================
   COMPONENT
========================================================= */

function MenuManager() {
  /* =======================================================
     MENU STATE
  ======================================================= */

  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     SUCCESS MODAL
  ======================================================= */

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =======================================================
     DELETE MODAL
  ======================================================= */

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deleteId, setDeleteId] = useState(null);

  /* =======================================================
     ADD / EDIT MODAL
  ======================================================= */

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  /* =======================================================
     IMAGE PREVIEW
  ======================================================= */

  const [imagePreview, setImagePreview] =
    useState("");

  const [loadingImage, setLoadingImage] =
    useState(false);

  /* =======================================================
     FORM
  ======================================================= */

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: "",
  });

  /* =======================================================
     GET IMAGE FOR TABLE
  ======================================================= */

  const getImage = (image) => {
    /* No image */
    if (!image) {
      return cake;
    }

    /* If Firebase accidentally contains an object */
    if (typeof image === "object") {
      if (
        typeof image.url === "string" &&
        image.url.trim()
      ) {
        return image.url;
      }

      if (
        typeof image.src === "string" &&
        image.src.trim()
      ) {
        return image.src;
      }

      return cake;
    }

    const imageString = String(image).trim();

    /* Internet URL */
    if (
      imageString.startsWith("http://") ||
      imageString.startsWith("https://") ||
      imageString.startsWith("data:")
    ) {
      return imageString;
    }

    /* Local imported image */
    if (imageMap[imageString]) {
      return imageMap[imageString];
    }

    /* Try decoded filename */
    try {
      const decoded = decodeURIComponent(imageString);

      if (imageMap[decoded]) {
        return imageMap[decoded];
      }
    } catch (error) {
      console.log("Could not decode image name.");
    }

    /* Try only filename */
    const filename = imageString
      .split("/")
      .pop()
      .trim();

    if (imageMap[filename]) {
      return imageMap[filename];
    }

    /* Last fallback */
    return cake;
  };

  /* =======================================================
     FETCH MENU FROM FIREBASE
  ======================================================= */

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Connecting to Firestore...");

      const menuCollection = collection(db, "menu");

      const snapshot = await getDocs(menuCollection);

      console.log(
        "Firebase documents:",
        snapshot.size
      );

      const items = snapshot.docs.map((menuDoc) => {
        const data = menuDoc.data();

        let image = data.image || "";

        /* ---------------------------------------------------
           FIX IMAGE OBJECT
        --------------------------------------------------- */

        if (
          typeof image === "object" &&
          image !== null
        ) {
          if (typeof image.url === "string") {
            image = image.url;
          } else if (
            typeof image.src === "string"
          ) {
            image = image.src;
          } else {
            image = "";
          }
        }

        /* ---------------------------------------------------
           ALWAYS MAKE IMAGE A STRING
        --------------------------------------------------- */

        if (
          image !== "" &&
          typeof image !== "string"
        ) {
          image = String(image);
        }

        const menuItem = {
          id: menuDoc.id,

          name: data.name || "Unnamed item",

          category: data.category || "",

          description:
            data.description || "",

          price: Number(data.price) || 0,

          image,
        };

        console.log(
          "Menu item:",
          menuItem
        );

        return menuItem;
      });

      console.log(
        "Final menu items:",
        items
      );

      setMenuItems(items);
    } catch (error) {
      console.error(
        "Error fetching menu:",
        error
      );

      setError(
        `Could not load menu: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD FIREBASE DATA ONCE
  ======================================================= */

  useEffect(() => {
    fetchMenu();
  }, []);

  /* =======================================================
     NORMAL INPUT CHANGE
  ======================================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     IMAGE URL INPUT
  ======================================================= */

  const handleImageUrlChange = async (e) => {
    const url = e.target.value;

    setFormData((previous) => ({
      ...previous,
      image: url,
    }));

    setImagePreview("");

    if (!url.trim()) {
      setLoadingImage(false);
      return;
    }

    /* -----------------------------------------------------
       LOCAL IMAGE
    ----------------------------------------------------- */

    const cleanUrl = url.trim();

    if (imageMap[cleanUrl]) {
      setImagePreview(imageMap[cleanUrl]);
      setLoadingImage(false);
      return;
    }

    /* -----------------------------------------------------
       DIRECT IMAGE
    ----------------------------------------------------- */

    if (isDirectImageUrl(cleanUrl)) {
      setImagePreview(cleanUrl);
      setLoadingImage(false);
      return;
    }

    /* -----------------------------------------------------
       WEBPAGE
    ----------------------------------------------------- */

    try {
      setLoadingImage(true);

      const imageUrl =
        await getImageFromUrl(cleanUrl);

      setImagePreview(imageUrl);
    } catch (error) {
      console.error(
        "Image lookup failed:",
        error
      );

      setImagePreview("");
    } finally {
      setLoadingImage(false);
    }
  };

  /* =======================================================
     OPEN ADD MODAL
  ======================================================= */

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      image: "",
    });

    setImagePreview("");

    setLoadingImage(false);

    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  const openEditModal = (item) => {
    setEditingId(item.id);

    setFormData({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      price: item.price ?? "",
      image: item.image || "",
    });

    /* Show existing image */

    const existingImage = getImage(
      item.image
    );

    setImagePreview(existingImage);

    setLoadingImage(false);

    setShowModal(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setShowModal(false);

    setEditingId(null);

    setImagePreview("");

    setLoadingImage(false);
  };

  /* =======================================================
     ADD / UPDATE MENU ITEM
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.description.trim() ||
      formData.price === "" ||
      !formData.image.trim()
    ) {
      alert(
        "Please fill in all fields, including the image."
      );

      return;
    }

    try {
      let finalImage = formData.image.trim();

      /* ---------------------------------------------------
         LOCAL IMAGE
      --------------------------------------------------- */

      if (imageMap[finalImage]) {
        /*
         * Keep the filename in Firebase.
         * Your getImage() function will resolve it.
         */
        finalImage = finalImage;
      }

      /* ---------------------------------------------------
         DIRECT IMAGE URL
      --------------------------------------------------- */

      else if (isDirectImageUrl(finalImage)) {
        finalImage = finalImage;
      }

      /* ---------------------------------------------------
         WEBPAGE URL
      --------------------------------------------------- */

      else {
        finalImage =
          await getImageFromUrl(
            finalImage
          );
      }

      /* ---------------------------------------------------
         FIREBASE DATA
      --------------------------------------------------- */

      const menuData = {
        name: formData.name.trim(),

        category:
          formData.category.trim(),

        description:
          formData.description.trim(),

        price: Number(formData.price),

        image: finalImage,
      };

      console.log(
        "Saving menu data:",
        menuData
      );

      /* ---------------------------------------------------
         UPDATE
      --------------------------------------------------- */

      if (editingId) {
        await updateDoc(
          doc(db, "menu", editingId),
          menuData
        );

        setMenuItems((previous) =>
          previous.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...menuData,
                }
              : item
          )
        );

        setSuccessMessage(
          "Menu item updated successfully!"
        );

        setShowSuccessModal(true);
      }

      /* ---------------------------------------------------
         ADD
      --------------------------------------------------- */

      else {
        const newDocument =
          await addDoc(
            collection(db, "menu"),
            menuData
          );

        const newItem = {
          id: newDocument.id,
          ...menuData,
        };

        setMenuItems((previous) => [
          ...previous,
          newItem,
        ]);

        setSuccessMessage(
          "Menu item added successfully!"
        );

        setShowSuccessModal(true);
      }

      closeModal();
    } catch (error) {
      console.error(
        "Error saving menu item:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while saving the menu item."
      );
    }
  };

  /* =======================================================
     DELETE MENU ITEM
  ======================================================= */

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "menu", deleteId)
      );

      setMenuItems((previous) =>
        previous.filter(
          (item) =>
            item.id !== deleteId
        )
      );

      setShowDeleteModal(false);

      setDeleteId(null);

      setSuccessMessage(
        "Menu item deleted successfully!"
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error(
        "Error deleting menu item:",
        error
      );

      alert(
        "Delete failed. Please try again."
      );
    }
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="container-fluid">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="mb-1">
            ☕ Menu Manager
          </h2>

          <p className="text-muted mb-0">
            Manage your café menu items
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          + Add Item
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="alert alert-danger">
          <strong>
            Error loading menu:
          </strong>

          <div>{error}</div>

          <button
            type="button"
            className="btn btn-danger mt-2"
            onClick={fetchMenu}
          >
            Try Again
          </button>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="text-center py-5">

          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h4 className="mt-3">
            Loading menu...
          </h4>

        </div>
      ) : !error &&
        menuItems.length === 0 ? (

        /* =================================================
           NO ITEMS
        ================================================= */

        <div className="text-center py-5">

          <h4>
            No menu items found.
          </h4>

          <p className="text-muted">
            Add your first menu item.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            + Add Item
          </button>

        </div>
      ) : !error ? (

        /* =================================================
           TABLE
        ================================================= */

        <div className="table-responsive">

          <table className="table table-hover table-bordered align-middle bg-white">

            <thead className="table-dark">

              <tr>

                <th>
                  Image
                </th>

                <th>
                  Name
                </th>

                <th>
                  Description
                </th>

                <th className="hide-mobile">
                  Category
                </th>

                <th className="hide-mobile">
                  Price
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {menuItems.map((item) => (

                <tr key={item.id}>

                  {/* IMAGE */}

                  <td>

                    <img
                      src={getImage(item.image)}
                      alt={item.name}
                      className="menu-admin-image"
                      onError={(e) => {
                        e.currentTarget.onerror =
                          null;

                        e.currentTarget.src =
                          cake;
                      }}
                    />

                  </td>

                  {/* NAME */}

                  <td>
                    <strong>
                      {item.name}
                    </strong>
                  </td>

                  {/* DESCRIPTION */}

                  <td>
                    {item.description ||
                      "No description"}
                  </td>

                  {/* CATEGORY */}

                  <td className="hide-mobile">

                    <span className="badge bg-secondary">
                      {item.category}
                    </span>

                  </td>

                  {/* PRICE */}

                  <td className="hide-mobile">

                    <strong>
                      $
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </strong>

                  </td>

                  {/* ACTIONS */}

                  <td>

                    <div className="menu-action-buttons">

                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          openEditModal(item)
                        }
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setDeleteId(
                            item.id
                          );

                          setShowDeleteModal(
                            true
                          );
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      ) : null}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="admin-modal-overlay">

          <div className="admin-modal">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h3>
                {editingId
                  ? "Edit Menu Item"
                  : "Add Menu Item"}
              </h3>

              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              />

            </div>

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="mb-3">

                <label className="form-label">
                  Item Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Example: Rainbow Cake"
                  value={formData.name}
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              {/* CATEGORY */}

              <div className="mb-3">

                <label className="form-label">
                  Category
                </label>

                <select
                  name="category"
                  className="form-select"
                  value={
                    formData.category
                  }
                  onChange={
                    handleInputChange
                  }
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Coffee">
                    Coffee
                  </option>

                  <option value="Tea">
                    Tea
                  </option>

                  <option value="Dessert">
                    Dessert
                  </option>

                  <option value="Bakery">
                    Bakery
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* DESCRIPTION */}

              <div className="mb-3">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Enter item description"
                  rows="3"
                  value={
                    formData.description
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              {/* PRICE */}

              <div className="mb-3">

                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="10.00"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              {/* IMAGE */}

              <div className="mb-4">

                <label className="form-label">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  className="form-control"
                  placeholder="Paste image or webpage URL"
                  value={formData.image}
                  onChange={
                    handleImageUrlChange
                  }
                />

                <small className="text-muted">
                  You can paste a direct image URL
                  or a webpage URL.
                </small>

                {/* IMAGE PREVIEW */}

                <div className="text-center mt-3">

                  {loadingImage && (
                    <div>

                      <div
                        className="spinner-border"
                        role="status"
                      />

                      <p className="text-muted mt-2">
                        Finding image...
                      </p>

                    </div>
                  )}

                  {imagePreview &&
                    !loadingImage && (

                    <div>

                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="menu-admin-preview"
                        onError={() => {
                          setImagePreview("");
                        }}
                      />

                      <p className="text-success mt-2">
                        ✓ Image found
                      </p>

                    </div>
                  )}

                  {!loadingImage &&
                    formData.image &&
                    !imagePreview && (

                    <p className="text-danger mt-2">
                      ❌ Could not find an
                      image from this link.
                    </p>
                  )}

                </div>

              </div>

              {/* BUTTONS */}

              <div className="d-flex justify-content-end gap-2">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loadingImage}
                >
                  {editingId
                    ? "Save Changes"
                    : "Add Item"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          SUCCESS MODAL
      ================================================= */}

      {showSuccessModal && (

        <div className="admin-modal-overlay">

          <div className="admin-modal confirm-modal">

            <div className="success-icon">
              ✓
            </div>

            <h4>
              Success
            </h4>

            <p>
              {successMessage}
            </p>

            <button
              type="button"
              className="btn btn-success"
              onClick={() =>
                setShowSuccessModal(
                  false
                )
              }
            >
              OK
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {showDeleteModal && (

        <div className="admin-modal-overlay">

          <div className="admin-modal confirm-modal">

            <div
              style={{
                fontSize: "60px",
                marginBottom: "10px",
              }}
            >
              ⚠️
            </div>

            <h4>
              Delete Menu Item?
            </h4>

            <p>
              Are you sure you want to
              delete this menu item?
            </p>

            <div className="d-flex justify-content-center gap-3">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteModal(
                    false
                  );

                  setDeleteId(null);
                }}
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

export default MenuManager;