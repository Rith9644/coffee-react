import { Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
  return (
    <section className="login-section">
      <div className="container">
        <div className="login-card">
          <h2>Welcome back</h2>
          <p>Login to your Dictionary Café account.</p>

          <form>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Enter your password" />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="auth-link mt-3 mb-0">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
