import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  const fetchMenu = async () => {
    try {
      const snapshot = await getDocs(collection(db, "menu"));

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMenuItems(items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "menu", id));
      fetchMenu();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Menu Management</h2>

        <button className="btn btn-primary">
          + Add Item
        </button>
      </div>

      <table className="table table-hover align-middle">

        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>

          {menuItems.map((item) => (
            <tr key={item.id}>

              <td>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </td>

              <td>{item.name}</td>

              <td>{item.category}</td>

              <td>${Number(item.price).toFixed(2)}</td>

              <td>

                <button className="btn btn-warning btn-sm me-2">
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Menu;