import { Link } from "react-router-dom";
import storyImage from "../assets/images/story.jpg";

function About() {
  return (
    <main className="about-page">

      {/* About Hero */}
      <section className="about-hero">
        <div className="container h-100 d-flex align-items-start justify-content-start">
          <div className="row w-100 mt-4">

            <div className="col-lg-7 text-white text-start">

              <p className="about-tag">
                About Dictionary Café
              </p>

              <h1 className="display-4 fw-bold mb-2 ">
                A cozy place where coffee meets conversation.
              </h1>

              <p className="about-text mb-4">
                We believe every cup should bring comfort, flavor,
                and a little moment of joy. From sunrise espresso
                to evening desserts, we serve a space that feels
                like home.
              </p>

              <div className="d-flex gap-3">

                <Link
                  to="/menu"
                  className="btn hero-btn explore-menu-btn"
                >
                  Explore Menu
                </Link>

                <Link
                  to="/contact"
                  className="btn hero-btn visit-us-btn"
                >
                  Visit Us
                </Link>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* Story Section */}
      <section className="story-section py-5">

        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <div className="story-image-wrap">

                <img
                  src={storyImage}
                  alt="Coffee"
                  className="story-image"
                />

              </div>

            </div>


            <div className="col-lg-6">

              <p className="section-label">
                Our Story
              </p>

              <h2 className="section-title">
                Made with love, brewed with passion
              </h2>

              <p className="section-text">
                Dictionary Café began as a small dream to create
                a warm gathering spot where people can pause,
                connect, and enjoy handcrafted drinks made from
                carefully selected ingredients.
              </p>

              <p className="section-text">
                Today, we are proud to serve fresh coffee,
                seasonal treats, and a welcoming atmosphere that
                keeps guests coming back for more.
              </p>

              <ul className="story-points">

                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Premium ingredients every day
                </li>

                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  Friendly service and cozy seating
                </li>

                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  A space for work, relaxation, and friendship
                </li>

              </ul>

            </div>

          </div>

        </div>

      </section>


      {/* Stats Section */}
      <section className="stats-section py-5">

        <div className="container">

          <div className="row g-4 text-center">

            <div className="col-md-3 col-6">
              <div className="stat-card">
                <h3>10+</h3>
                <p>Years of service</p>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="stat-card">
                <h3>25+</h3>
                <p>Signature drinks</p>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="stat-card">
                <h3>1K+</h3>
                <p>Happy customers</p>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="stat-card">
                <h3>4.9</h3>
                <p>Average rating</p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* Values Section */}
      <section className="values-section py-5">

        <div className="container">

          <div className="text-center mb-5">

            <p className="section-label">
              Why choose us
            </p>

            <h2 className="section-title">
              What makes Dictionary Café special
            </h2>

          </div>


          <div className="row g-4">

            {/* Value 1 */}
            <div className="col-md-4">

              <div className="value-card">

                <i className="bi bi-cup-hot"></i>

                <h4>
                  Freshly brewed
                </h4>

                <p>
                  Every drink is made with freshly roasted coffee
                  and carefully balanced flavors.
                </p>

              </div>

            </div>


            {/* Value 2 */}
            <div className="col-md-4">

              <div className="value-card">

                <i className="bi bi-heart-fill"></i>

                <h4>
                  Warm atmosphere
                </h4>

                <p>
                  Soft lighting, cozy seating, and a calming vibe
                  make every visit memorable.
                </p>

              </div>

            </div>


            {/* Value 3 */}
            <div className="col-md-4">

              <div className="value-card">

                <i className="bi bi-people-fill"></i>

                <h4>
                  Community focus
                </h4>

                <p>
                  We love creating a welcoming place for students,
                  friends, and families alike.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default About;