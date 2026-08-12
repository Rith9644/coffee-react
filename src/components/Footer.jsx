import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-3 pb-4">
      <div className="container">
        <div className="row gy-4">

          {/* Brand */}
          <div className="col-lg-4 col-md-6 text-center text-lg-start">
            <h3 className="fw-bold mb-3 fs-4">
              ☕ Dictionary Coffee
            </h3>

            <p className="text-light mb-4 fs-6">
              Every cup has a story. Enjoy premium coffee, cozy spaces, and
              unforgettable moments.
            </p>

            <div className="d-flex justify-content-center justify-content-lg-start gap-3">
              <a href="#" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#" className="social-icon">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href="#" className="social-icon">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6 text-center">
            <h5 className="fw-bold mb-3 fs-5">
              Quick Links
            </h5>

            <ul className="list-unstyled fs-6">

              <li className="mb-2">
                <Link
                  to="/"
                  className="footer-link text-white"
                >
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/about"
                  className="footer-link text-white"
                >
                  About
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/menu"
                  className="footer-link text-white"
                >
                  Menu
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="footer-link text-white"
                >
                  Contact
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 text-center text-lg-end">
            <h5 className="fw-bold mb-3 fs-5">
              Contact Us
            </h5>

            <p className="mb-2 fs-6">
              <i className="bi bi-envelope-fill me-2"></i>
              info@dictionarycoffee.com
            </p>

            <p className="mb-2 fs-6">
              <i className="bi bi-telephone-fill me-2"></i>
              +855 96 445 154 9
            </p>

            <p className="fs-6">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Phnom Penh, Cambodia
            </p>
          </div>

        </div>

        <hr className="border-secondary my-4" />

        {/* Bottom */}
        <div className="row align-items-center gy-2">

          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 fs-6">
              © 2026 Dictionary Coffee. All Rights Reserved.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">

            <Link
              to="/privacy"
              className="footer-link-small text-white fs-6"
            >
              Privacy Policy
            </Link>

            <span className="mx-2">|</span>

            <Link
              to="/terms"
              className="footer-link-small text-white fs-6"
            >
              Terms of Service
            </Link>

          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;