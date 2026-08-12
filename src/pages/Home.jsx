import { Link } from "react-router-dom";

function Home() {
  return (
    <>
  {/* Hero Section */}
  <section className="hero-section">
    <div className="container-fluid h-100 d-flex align-items-start justify-content-start">
      <div className="row w-100 mt-4">
        <div className="col-lg-7 text-white text-start">
          <p className="hero-tag">Freshly brewed every day</p>
          <h1 className="display-4 fw-bold mb-3">
            Welcome to <span>Dictionary Café</span>
          </h1>
          <p className="hero-text mb-4">
            Sip your favorite coffee, enjoy a cozy atmosphere, and discover a
            place where great taste meets conversation.
          </p>
          <div className="d-flex gap-3">
            <Link to="/menu" className="btn hero-btn explore-menu-btn">
              Explore Menu
            </Link>
            <Link to="/contact" className="btn hero-btn visit-us-btn">
              Visit Us
            </Link>
          </div>
        </div>
        <div className="col-lg-5 mt-5 mt-lg-0">
          <div className="hero-card">
            <p className="mb-1 text-muted small">Today's Special</p>
            <h4 className="fw-bold">Cinnamon Latte</h4>
            <p className="mb-3">
              A warm blend of espresso, milk, and sweet cinnamon spice.
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Open Daily</span>
              <span className="text-muted">7:00 AM - 9:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Hero Section */}
  {/* Highlights Section */}
  <section className="highlights-section py-5">
    <div className="container">
      <div className="row g-4 text-center">
        <div className="col-md-4">
          <div className="feature-card" tabIndex={0}>
            <i className="bi bi-cup-hot" />
            <h5>Premium Coffee</h5>
            <p>Freshly roasted beans brewed to perfection.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card" tabIndex={0}>
            <i className="bi bi-emoji-smile" />
            <h5>Relaxing Atmosphere</h5>
            <p>Comfortable seating and a cozy space for everyone.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card" tabIndex={0}>
            <i className="bi bi-clock-history" />
            <h5>Fast Service</h5>
            <p>Quick, friendly service for your busy day.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Highlights Section */}
</>

  );
}

export default Home;