import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import Es from "../assets/images/Es.jpeg";
import CaramelLatte from "../assets/images/Caramel Latte.jpg";
import MatchaLatte from "../assets/images/Iced-Matcha-Latte-recipe.jpg";
import CheeseCroissant from "../assets/images/sp_web__0004_ham_and_cheese_croissant_cmyk_small.jpg";
import IcedAmericano from "../assets/images/Iced_Americano.jpg";
import ChocolateMuffin from "../assets/images/featured-image-chocolate-espresso-muffins.jpg";
import cake from "../assets/images/image.png";

import "../styles/menu.css";


// ======================================================
// LOCAL IMAGE MAP
// ======================================================

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


// ======================================================
// GET LOCAL IMAGE
// ======================================================

const getLocalImage = (image) => {
  if (!image) {
    return null;
  }

  // Make sure image is a string
  if (typeof image !== "string") {
    return null;
  }

  const value = image.trim();

  if (!value) {
    return null;
  }

  // Exact match
  if (imageMap[value]) {
    return imageMap[value];
  }

  // Decode URL
  try {
    const decoded = decodeURIComponent(value);

    if (imageMap[decoded]) {
      return imageMap[decoded];
    }
  } catch (error) {
    console.log("Could not decode image:", error);
  }

  // Get filename from path
  const filename = value.split("/").pop();

  if (imageMap[filename]) {
    return imageMap[filename];
  }

  return null;
};


// ======================================================
// NORMALIZE IMAGE VALUE
// ======================================================

const normalizeImage = (image) => {
  if (!image) {
    return "";
  }

  // Firebase may contain an object
  if (typeof image === "object") {
    if (typeof image.url === "string") {
      return image.url;
    }

    if (typeof image.src === "string") {
      return image.src;
    }

    if (typeof image.image === "string") {
      return image.image;
    }

    return "";
  }

  // Normal string
  if (typeof image === "string") {
    return image.trim();
  }

  return "";
};


// ======================================================
// IMAGE COMPONENT
// ======================================================

function MenuImage({ image, name }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      setLoadingImage(true);
      setImageError(false);
      setImageUrl("");

      const normalized = normalizeImage(image);

      if (!normalized) {
        if (!cancelled) {
          setLoadingImage(false);
          setImageError(true);
        }

        return;
      }


      // ==================================================
      // LOCAL IMAGE
      // ==================================================

      const localImage = getLocalImage(normalized);

      if (localImage) {
        if (!cancelled) {
          setImageUrl(localImage);
          setLoadingImage(false);
        }

        return;
      }


      // ==================================================
      // DIRECT IMAGE URL
      // ==================================================

      const isDirectImage =
        /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(
          normalized
        );

      if (isDirectImage) {
        if (!cancelled) {
          setImageUrl(normalized);
          setLoadingImage(false);
        }

        return;
      }


      // ==================================================
      // DATA URL
      // ==================================================

      if (normalized.startsWith("data:image/")) {
        if (!cancelled) {
          setImageUrl(normalized);
          setLoadingImage(false);
        }

        return;
      }


      // ==================================================
      // WEBPAGE URL
      // ==================================================

      if (
        normalized.startsWith("http://") ||
        normalized.startsWith("https://")
      ) {
        try {
          const apiUrl =
            `https://api.microlink.io/?url=${encodeURIComponent(
              normalized
            )}`;

          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(
              "Could not read webpage"
            );
          }

          const result = await response.json();

          const foundImage =
            result?.data?.image?.url ||
            result?.data?.image ||
            result?.data?.logo?.url ||
            result?.data?.logo;

          if (foundImage) {
            if (!cancelled) {
              setImageUrl(foundImage);
              setLoadingImage(false);
            }

            return;
          }

        } catch (error) {
          console.error(
            "Could not find webpage image:",
            error
          );
        }
      }


      // ==================================================
      // FAILED
      // ==================================================

      if (!cancelled) {
        setLoadingImage(false);
        setImageError(true);
      }
    };

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [image]);


  // ====================================================
  // LOADING
  // ====================================================

  if (loadingImage) {
    return (
      <div className="menu-image-placeholder">
        <span>Loading...</span>
      </div>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (imageError || !imageUrl) {
    return (
      <div className="menu-image-placeholder">
        <span>☕</span>
      </div>
    );
  }


  // ====================================================
  // IMAGE
  // ====================================================

  return (
    <img
      src={imageUrl}
      alt={name}
      className="menu-image"
      onError={() => {
        setImageError(true);
        setImageUrl("");
      }}
    />
  );
}


// ======================================================
// MENU COMPONENT
// ======================================================

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const { addToCart } = useCart();


  // ====================================================
  // GET MENU FROM FIREBASE
  // ====================================================

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Connecting to Firestore..."
        );

        const menuCollection =
          collection(db, "menu");

        const snapshot =
          await getDocs(menuCollection);

        console.log(
          "Firebase documents:",
          snapshot.size
        );


        const items =
          snapshot.docs.map((firebaseDoc) => {
            const data =
              firebaseDoc.data();

            console.log(
              "Menu item:",
              data
            );


            return {
              id: firebaseDoc.id,

              name:
                data.name ||
                "Unnamed item",

              category:
                data.category ||
                "",

              description:
                data.description ||
                "",

              image:
                data.image ||
                "",

              price:
                data.price ?? 0,
            };
          });


        setMenuItems(items);

      } catch (firebaseError) {
        console.error(
          "Firebase menu error:",
          firebaseError
        );

        setError(
          `Could not load menu: ${firebaseError.message}`
        );

      } finally {
        setLoading(false);
      }
    };


    getMenuItems();
  }, []);


  // ====================================================
  // FILTER MENU
  // ====================================================

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => {
          const category =
            String(item.category || "")
              .trim()
              .toLowerCase();

          return category === activeCategory;
        });


  // ====================================================
  // CATEGORIES
  // ====================================================

  const categories = [
    "all",
    "coffee",
    "tea",
    "bakery",
    "dessert",
    "other",
  ];


  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart = (item) => {
    addToCart({
      ...item,
      image: normalizeImage(item.image),
    });
  };


  // ====================================================
  // PAGE
  // ====================================================

  return (
    <>
      {/* ==================================================
          MENU HERO
      ================================================== */}

      <section className="menu-hero">

        <div className="container h-100 d-flex align-items-start justify-content-start">

          <div className="row w-100 mt-4">

            <div className="col-lg-7 text-white text-start">

              <p className="menu-tag">
                Our Signature Collection
              </p>

              <h1 className="display-5 fw-bold mb-3">
                Discover Our Menu
              </h1>

              <p className="menu-text">
                From rich espresso drinks to sweet
                pastries, enjoy a perfect blend of
                flavor and comfort.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          MENU SECTION
      ================================================== */}

      <section className="menu-section py-5">

        <div className="container">


          {/* ==================================================
              FILTER BUTTONS
          ================================================== */}

          <div className="menu-filter text-center mb-4">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                className={`filter-btn ${
                  activeCategory === category
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category
                  .charAt(0)
                  .toUpperCase() +
                  category.slice(1)}
              </button>

            ))}

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="text-center py-5">

              <h4>
                Loading menu...
              </h4>

            </div>

          )}


          {/* ==================================================
              FIREBASE ERROR
          ================================================== */}

          {!loading && error && (

            <div className="text-center py-5">

              <h4 className="text-danger">
                Unable to load menu
              </h4>

              <p className="text-muted">
                {error}
              </p>

            </div>

          )}


          {/* ==================================================
              NO ITEMS
          ================================================== */}

          {!loading &&
            !error &&
            filteredItems.length === 0 && (

              <div className="text-center py-5">

                <h4>
                  No menu items found.
                </h4>

                <p className="text-muted">
                  There are no items in this
                  category.
                </p>

              </div>

            )}


          {/* ==================================================
              MENU ITEMS
          ================================================== */}

          {!loading &&
            !error &&
            filteredItems.length > 0 && (

              <div className="row g-4">

                {filteredItems.map((item) => (

                  <div
                    className="col-md-6 col-lg-4 menu-item"
                    key={item.id}
                  >

                    <div className="menu-card">


                      {/* ======================================
                          IMAGE
                      ====================================== */}

                      <MenuImage
                        image={item.image}
                        name={item.name}
                      />


                      {/* ======================================
                          PRICE
                      ====================================== */}

                      <span className="menu-price">

                        $
                        {Number(
                          item.price || 0
                        ).toFixed(2)}

                      </span>


                      {/* ======================================
                          NAME
                      ====================================== */}

                      <h5>
                        {item.name}
                      </h5>


                      {/* ======================================
                          DESCRIPTION
                      ====================================== */}

                      <p>
                        {item.description ||
                          "No description available."}
                      </p>


                      {/* ======================================
                          ADD TO CART
                      ====================================== */}

                      <button
                        type="button"
                        className="btn btn-primary w-100 mt-2"
                        onClick={() =>
                          handleAddToCart(item)
                        }
                      >

                        <i className="bi bi-cart-plus me-2"></i>

                        Add to Cart

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </div>

      </section>
    </>
  );
}

export default Menu;