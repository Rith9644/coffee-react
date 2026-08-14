import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link } from "react-router-dom";
import "../styles/contact.css";

function Contact() {
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });


  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginMessage, setLoginMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Error message
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open confirmation modal
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      setErrorMessage("Please log in to send a message.");
      return;
    }

    // Check if all fields are filled
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Check email
    if (!formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    setShowConfirm(true);
  };

  // Send message to Firebase
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      await addDoc(collection(db, "contacts"), {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
      });

      // Close confirmation modal
      setShowConfirm(false);

      // Show success modal
      setShowSuccess(true);

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);

      setShowConfirm(false);
      setErrorMessage(
        "Failed to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      message: "",
    });

    setErrorMessage("");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* =========================
          CONTACT SECTION
      ========================== */}
      <section
        id="contact"
        className="contact-section py-5 mt-5"
      >
        <div className="container">

          {/* Page Header */}
          <div className="text-center mb-5">
            <p className="contact-eyebrow">
              Get in touch
            </p>

            <h2 className="display-5 fw-bold contact-title">
              Contact Dictionary Café
            </h2>

            <p className="contact-subtitle">
              We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              {errorMessage}

              <button
                type="button"
                className="btn-close"
                onClick={() => setErrorMessage("")}
              ></button>
            </div>
          )}

          {/* Contact Panel */}
          <div className="contact-panel shadow-sm">
            <div className="row g-0">

              {/* =========================
                  CONTACT INFORMATION
              ========================== */}
              <div className="col-lg-5 contact-sidebar">

                <div>
                  <p className="sidebar-label">
                    Visit us
                  </p>

                  <h3>
                    We're always happy to welcome you
                  </h3>
                </div>

                <div className="sidebar-info">

                  {/* Location */}
                  <div className="info-item">
                    <i className="bi bi-geo-alt-fill"></i>

                    <div>
                      <h6>Location</h6>
                      <p>Phnom Penh, Cambodia</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="info-item">
                    <i className="bi bi-telephone-fill"></i>

                    <div>
                      <h6>Phone</h6>
                      <p>+855 96 445 154 9</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="info-item">
                    <i className="bi bi-envelope-fill"></i>

                    <div>
                      <h6>Email</h6>
                      <p>info@dictionarycoffee.com</p>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="info-item">
                    <i className="bi bi-clock-fill"></i>

                    <div>
                      <h6>Opening Hours</h6>
                      <p>
                        Mon - Fri: 7:00 AM - 9:00 PM
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* =========================
                  CONTACT FORM
              ========================== */}
              <div className="col-lg-7 contact-form-area">

                <h4 className="fw-bold mb-4">
                  Send a message
                </h4>

                <form
                  className="row g-3"
                  onSubmit={handleFormSubmit}
                >

                  {/* Full Name */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label className="form-label">
                      Message
                    </label>

                    <textarea
                      name="message"
                      className="form-control"
                      rows="6"
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Buttons */}
                  <div className="col-12 d-flex gap-2 flex-wrap">

                    {!currentUser && (
                      <div className="w-100 alert alert-info">
                        Please <button type="button" className="btn btn-link p-0" onClick={() => setIsLoginOpen(true)}>log in</button> to send a message.
                      </div>
                    )}

                    {/* Send */}
                    <button
                      type="submit"
                      className="btn btn-primary contact-btn"
                      disabled={!currentUser}
                      title={!currentUser ? "Log in to send a message" : "Send message"}
                    >
                      <i className="bi bi-send me-1"></i>
                      Send Message
                    </button>

                    {/* Reset */}
                    <button
                      type="button"
                      className="btn btn-outline-secondary contact-btn"
                      onClick={handleReset}
                    >
                      <i className="bi bi-eraser me-1"></i>
                      Reset
                    </button>

                  </div>
                </form>
              </div>
            </div>
          </div>

          {isLoginOpen && (
            <div className="custom-modal-backdrop" onClick={() => setIsLoginOpen(false)}>
              <div className="custom-modal-card login-modal" onClick={(e) => e.stopPropagation()}>
                <div className="custom-modal-header">
                  <div>
                    <p className="modal-eyebrow">Welcome back</p>
                    <h5 className="modal-title">Sign in to Dictionary Café</h5>
                  </div>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsLoginOpen(false)} />
                </div>

                <div className="custom-modal-body">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoginMessage("");
                    setLoginLoading(true);
                    try {
                      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
                      setIsLoginOpen(false);
                    } catch (err) {
                      setLoginMessage(err.message || "Unable to sign in.");
                    } finally {
                      setLoginLoading(false);
                    }
                  }}>
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <input type="email" className="form-control" value={loginForm.email} onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input type="password" className="form-control" value={loginForm.password} onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))} required />
                    </div>

                    {loginMessage && <div className="form-message">{loginMessage}</div>}

                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setIsLoginOpen(false)} disabled={loginLoading}>Cancel</button>
                      <button type="submit" className="btn btn-login-submit ms-2" disabled={loginLoading}>{loginLoading ? 'Signing in...' : 'Sign in'}</button>
                    </div>
                  </form>
                </div>

                <div className="custom-modal-footer">
                  <p className="mb-0 small-text">New here? <Link to="/register" onClick={() => setIsLoginOpen(false)}>Create an account</Link></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          CONFIRMATION MODAL
      ========================== */}
      {showConfirm && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(2px)",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-envelope-check me-2"></i>
                  Confirm Message
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">

                <div className="text-center mb-4">
                  <i
                    className="bi bi-question-circle-fill"
                    style={{ 
                      fontSize: "60px",
                      color: "#82470d",
                    }}
                  ></i>
                </div>

                <h5 className="text-center">
                  Are you sure?
                </h5>

                <p className="text-center mb-0">
                  Do you want to send this message to
                  <br />
                  <strong>Dictionary Café</strong>?
                </p>

              </div>

              {/* Modal Footer */}
              <div className="modal-footer justify-content-center">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  <i className="bi bi-x-lg me-1"></i>
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    background: "#28a745",
                    border: "none",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-1"></i>
                      Confirm & Send
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          SUCCESS MODAL
      ========================== */}
      {showSuccess && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(2px)",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              {/* Success Header */}
              <div className="modal-header bg-success text-white">

                <h5 className="modal-title">
                  <i className="bi bi-check-circle me-2"></i>
                  Message Sent
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowSuccess(false)}
                  aria-label="Close"
                ></button>

              </div>

              {/* Success Body */}
              <div className="modal-body text-center py-5">

                <i
                  className="bi bi-check-circle-fill"
                  style={{ 
                    fontSize: "65px",
                    color: "#28a745",
                  }}
                ></i>

                <h4 className="mt-4 mb-2">
                  Thank You!
                </h4>

                <p className="mb-0">
                  Your message has been sent successfully to Dictionary Café.
                  <br />
                  We'll get back to you as soon as possible.
                </p>

              </div>

              {/* Success Footer */}
              <div className="modal-footer justify-content-center">

                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={() => setShowSuccess(false)}
                  style={{
                    background: "#28a745",
                    border: "none",
                  }}
                >
                  <i className="bi bi-check-lg me-1"></i>
                  Done
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Contact;