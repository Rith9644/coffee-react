import { Link } from "react-router-dom";
import "../styles/login.css";

function Register() {
  return (
    <section className="login-section">
      <div className="container">
        <div className="login-card">
          <h2>Create an account</h2>
          <p>Join Dictionary Café for fresh updates and offers.</p>

          <form>
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input type="text" className="form-control" placeholder="Enter your name" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Create a password" />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Create account
            </button>
          </form>

          <p className="auth-link mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
