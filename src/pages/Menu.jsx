import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import Es from "../assets/images/Es.jpeg";
import CaramelLatte from "../assets/images/Caramel Latte.jpg";
import MatchaLatte from "../assets/images/Iced-Matcha-Latte-recipe.jpg";
import CheeseCroissant from "../assets/images/sp_web__0004_ham_and_cheese_croissant_cmyk_small.jpg";
import IcedAmericano from "../assets/images/Iced_Americano.jpg";
import ChocolateMuffin from "../assets/images/featured-image-chocolate-espresso-muffins.jpg";

import "../styles/menu.css";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local images
  const imageMap = {
    "Es.jpeg": Es,
    "Caramel Latte.jpg": CaramelLatte,
    "Iced-Matcha-Latte-recipe.jpg": MatchaLatte,
    "sp_web__0004_ham_and_cheese_croissant_cmyk_small.jpg":
      CheeseCroissant,
    "Iced_Americano.jpg": IcedAmericano,
    "featured-image-chocolate-espresso-muffins.jpg": ChocolateMuffin,
  };

  // Get menu from Firebase
  useEffect(() => {
    const getMenuItems = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Connecting to Firestore...");

        const menuCollection = collection(db, "menu");

        const snapshot = await getDocs(menuCollection);

        console.log("Firebase documents:", snapshot.size);

        const items = snapshot.docs.map((doc) => {
          const data = doc.data();

          console.log("Menu item:", data);

          return {
            id: doc.id,
            category: data.category || "",
            description: data.description || "",
            image: data.image || "",
            name: data.name || "Unnamed item",
            price: data.price || 0,
          };
        });

        setMenuItems(items);
      } catch (error) {
        console.error("Firebase menu error:", error);

        setError(
          `Could not load menu: ${error.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    getMenuItems();
  }, []);

  // Filter menu
  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) => item.category.toLowerCase() === activeCategory
        );

  const categories = ["all", "coffee", "tea", "bakery"];

  return (
    <>
      {/* =========================
          MENU HERO
      ========================== */}
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
                From rich espresso drinks to sweet pastries,
                enjoy a perfect blend of flavor and comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MENU SECTION
      ========================== */}
      <section className="menu-section py-5">
        <div className="container">

          {/* Filter Buttons */}
          <div className="menu-filter text-center mb-4">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-btn ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() +
                  category.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <h4>Loading menu...</h4>
            </div>
          )}

          {/* Firebase Error */}
          {!loading && error && (
            <div className="text-center py-5">
              <h4 className="text-danger">
                Unable to load menu
              </h4>

              <p className="text-muted">
                {error}
              </p>

              <p className="text-muted">
                Please check your Firebase connection and
                Firestore permissions.
              </p>
            </div>
          )}

          {/* No items */}
          {!loading &&
            !error &&
            filteredItems.length === 0 && (
              <div className="text-center py-5">
                <h4>No menu items found.</h4>

                <p className="text-muted">
                  There are no items in this category.
                </p>
              </div>
            )}

          {/* Menu Items */}
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

                      {/* Image */}
                      <img
                        src={
                          imageMap[item.image] ||
                          item.image
                        }
                        alt={item.name}
                        className="menu-image"
                      />

                      {/* Price */}
                      <span className="menu-price">
                        ${Number(item.price).toFixed(2)}
                      </span>

                      {/* Name */}
                      <h5>{item.name}</h5>

                      {/* Description */}
                      <p>{item.description}</p>

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