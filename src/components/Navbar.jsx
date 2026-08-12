import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Logo from "../assets/images/Logo.png";
import { auth } from "../firebase/firebase";
import "../styles/Navbar.css";
import "../styles/login.css";

function Navbar() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [registerFormData, setRegisterFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [profileMessage, setProfileMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage("");
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
    if (registerMessage) setRegisterMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setMessage("Please enter both your email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      setCurrentUser(userCredential.user);
      setMessage("Login successful!");
      setFormData({ email: "", password: "" });
      setIsLoginOpen(false);
    } catch (error) {
      let errorMessage = "Login failed.";

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found for this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }

      setMessage(errorMessage);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerFormData.name.trim() || !registerFormData.email.trim() || !registerFormData.password.trim()) {
      setRegisterMessage("Please fill in your name, email, and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerFormData.email,
        registerFormData.password
      );

      await updateProfile(userCredential.user, {
        displayName: registerFormData.name.trim(),
      });

      setCurrentUser({ ...userCredential.user, displayName: registerFormData.name.trim() });
      setRegisterMessage("Account created successfully!");
      setRegisterFormData({ name: "", email: "", password: "" });
      setIsRegisterOpen(false);
    } catch (error) {
      let errorMessage = "Registration failed.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      setRegisterMessage(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setMessage("You have been signed out.");
    } catch (error) {
      setMessage("Unable to sign out right now.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = isLoginOpen || isRegisterOpen || isProfileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoginOpen, isRegisterOpen, isProfileOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid">

        {isLoginOpen && (
          <div className="custom-modal-backdrop" onClick={() => setIsLoginOpen(false)}>
            <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="custom-modal-header">
                <div>
                  <p className="modal-eyebrow">Welcome back</p>
                  <h5 className="modal-title">Sign in to Dictionary Café</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsLoginOpen(false)}
                ></button>
              </div>

              <div className="custom-modal-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="loginEmail">
                      Email address
                    </label>
                    <input
                      id="loginEmail"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="loginPassword">
                      Password
                    </label>
                    <input
                      id="loginPassword"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-check-label small-text" htmlFor="showPassword">
                      <input
                        id="showPassword"
                        className="form-check-input me-2"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword((prev) => !prev)}
                      />
                      Show password
                    </label>
                    <a href="#" className="small-text forgot-link">
                      Forgot password?
                    </a>
                  </div>

                  {message && <div className="form-message">{message}</div>}

                  <button type="submit" className="btn btn-login-submit w-100">
                    Login
                  </button>
                </form>
              </div>

              <div className="custom-modal-footer">
                <p className="mb-0 small-text">
                  New here?
                  <button
                    type="button"
                    className="ms-1 register-link btn btn-link p-0"
                    onClick={() => {
                      setIsLoginOpen(false);
                      setIsRegisterOpen(true);
                    }}
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logo */}
        <Link
          className="navbar-brand me-auto d-flex align-items-center"
          to="/"
        >
          <img
            src={Logo}
            alt="Dictionary Café"
            height={50}
            className="me-2"
          />
          <span>Dictionary Café</span>
        </Link>

        {/* Offcanvas Menu */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >

          {/* Mobile Header */}
          <div className="offcanvas-header">
            <Link
              className="navbar-brand d-flex align-items-center"
              to="/"
              data-bs-dismiss="offcanvas"
            >
              <img
                src={Logo}
                alt="Dictionary Café"
                height={50}
                className="me-2"
              />
              <span>Dictionary Café</span>
            </Link>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>

          {/* Navigation */}
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">

              {/* Home */}
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className="nav-link mx-lg-2"
                  
                >
                  Home
                </NavLink>
              </li>

              {/* About */}
              <li className="nav-item">
                <NavLink
                  to="/about"
                  className="nav-link mx-lg-2"
                  
                >
                  About
                </NavLink>
              </li>

              {/* Menu */}
              <li className="nav-item">
                <NavLink
                  to="/menu"
                  className="nav-link mx-lg-2"
                  
                >
                  Menu
                </NavLink>
              </li>

              {/* Contact */}
              <li className="nav-item">
                <NavLink
                  to="/contact"
                  className="nav-link mx-lg-2"
                  
                >
                  Contact
                </NavLink>
              </li>

            </ul>
          </div>
        </div>

        {currentUser ? (
          <div className="profile-actions">
            <div className="profile-chip">
              <button
                type="button"
                className="profile-avatar-btn"
                onClick={() => setIsProfileOpen(true)}
                aria-label="Open profile"
              >
                <div className="profile-avatar">
                  {(currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase()}
                </div>
              </button>
              <div className="profile-meta">
                <span className="profile-name">
                  {currentUser.displayName || currentUser.email?.split("@")[0] || "User"}
                </span>
                <span className="profile-email">{currentUser.email}</span>
              </div>
            </div>
            <button type="button" className="logout-button desktop-logout" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button
              type="button"
              className="login-button border-0"
              onClick={() => {
                setIsLoginOpen(true);
                setIsRegisterOpen(false);
              }}
            >
              Login
            </button>

            <button
              type="button"
              className="register-button border-0"
              onClick={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);
              }}
            >
              Register
            </button>
          </div>
        )}

        {isRegisterOpen && (
          <div className="custom-modal-backdrop" onClick={() => setIsRegisterOpen(false)}>
            <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="custom-modal-header">
                <div>
                  <p className="modal-eyebrow">Join us</p>
                  <h5 className="modal-title">Create your account</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsRegisterOpen(false)}
                ></button>
              </div>

              <div className="custom-modal-body">
                <form onSubmit={handleRegisterSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="registerName">
                      Full name
                    </label>
                    <input
                      id="registerName"
                      name="name"
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={registerFormData.name}
                      onChange={handleRegisterChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="registerEmail">
                      Email address
                    </label>
                    <input
                      id="registerEmail"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="your@email.com"
                      value={registerFormData.email}
                      onChange={handleRegisterChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="registerPassword">
                      Password
                    </label>
                    <input
                      id="registerPassword"
                      name="password"
                      type={showRegisterPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Create a password"
                      value={registerFormData.password}
                      onChange={handleRegisterChange}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-check-label small-text" htmlFor="showRegisterPassword">
                      <input
                        id="showRegisterPassword"
                        className="form-check-input me-2"
                        type="checkbox"
                        checked={showRegisterPassword}
                        onChange={() => setShowRegisterPassword((prev) => !prev)}
                      />
                      Show password
                    </label>
                  </div>

                  {registerMessage && <div className="form-message">{registerMessage}</div>}

                  <button type="submit" className="btn btn-login-submit w-100">
                    Create account
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {isProfileOpen && currentUser && (
          <div className="custom-modal-backdrop" onClick={() => setIsProfileOpen(false)}>
            <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="custom-modal-header">
                <div>
                  <p className="modal-eyebrow">Your profile</p>
                  <h5 className="modal-title">Account</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => { setIsProfileOpen(false); setIsEditingProfile(false); setPhotoFile(null); setPhotoPreview(null); setEditName(""); setProfileMessage(""); }}
                ></button>
              </div>

              <div className="custom-modal-body">
                {!isEditingProfile ? (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="profile-avatar" style={{width:60,height:60,fontSize:24}}>
                        {(currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="profile-name">{currentUser.displayName || currentUser.email?.split("@")[0]}</div>
                        <div className="profile-email">{currentUser.email}</div>
                      </div>
                    </div>

                    <p className="small-text">Manage your account details and sign out.</p>
                    <div className="d-flex gap-2 mt-3">
                      <button type="button" className="btn btn-login-submit" onClick={() => { setIsEditingProfile(true); setEditName(currentUser.displayName || currentUser.email?.split("@")[0] || ""); }}>
                        Edit profile
                      </button>
                      <button type="button" className="logout-button" onClick={() => { setIsProfileOpen(false); handleSignOut(); }}>
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">Profile picture</label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="profile-avatar" style={{width:64,height:64,fontSize:22,flex:'0 0 64px'}}>
                          {photoPreview ? (
                            <img src={photoPreview} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                          ) : (
                            (currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPhotoFile(file);
                              const url = URL.createObjectURL(file);
                              setPhotoPreview(url);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </div>

                    {profileMessage && <div className="form-message">{profileMessage}</div>}

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-login-submit"
                        onClick={async () => {
                          setProfileMessage("");
                          try {
                            let photoURL = currentUser.photoURL || null;
                            if (photoFile) {
                              const storage = getStorage();
                              const sRef = storageRef(storage, `profiles/${currentUser.uid}/${Date.now()}_${photoFile.name}`);
                              await uploadBytes(sRef, photoFile);
                              photoURL = await getDownloadURL(sRef);
                            }

                            await updateProfile(auth.currentUser, {
                              displayName: editName.trim() || undefined,
                              photoURL: photoURL || undefined,
                            });

                            // refresh currentUser state
                            setCurrentUser({ ...auth.currentUser });
                            setIsEditingProfile(false);
                            setPhotoFile(null);
                            setPhotoPreview(null);
                            setProfileMessage("Profile updated.");
                          } catch (err) {
                            setProfileMessage("Unable to update profile right now.");
                          }
                        }}
                      >
                        Save
                      </button>
                      <button type="button" className="logout-button" onClick={() => { setIsEditingProfile(false); setPhotoFile(null); setPhotoPreview(null); setEditName(""); setProfileMessage(""); }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="custom-modal-footer">
                <button type="button" className="logout-button" onClick={() => { setIsProfileOpen(false); handleSignOut(); }}>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hamburger */}
        <button
          className="navbar-toggler pe-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;