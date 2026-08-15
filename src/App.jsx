import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Admin from "./pages/Admin/Admin";
import AdminRoute from "./components/AdminRoute";

function App() {
  const location = useLocation();

  // Admin pages should have their own layout
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Normal website navbar */}
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* USER WEBSITE */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN WEBSITE */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>

      {/* Normal website footer */}
      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;