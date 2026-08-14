import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="custom-modal-backdrop" onClick={() => navigate(-1)}>
      <div className="custom-modal-card login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <div>
            <p className="modal-eyebrow">Welcome back</p>
            <h5 className="modal-title">Login to Dictionary Café</h5>
          </div>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => navigate(-1)} />
        </div>

        <div className="custom-modal-body">
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
        </div>

        <div className="custom-modal-footer">
          <p className="auth-link mt-0 mb-0">New here? <Link to="/register" onClick={() => navigate(-1)}>Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
