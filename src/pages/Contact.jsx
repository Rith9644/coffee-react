import "../styles/contact.css";

function Contact() {
  return (
    <section id="contact" className="contact-section py-5 mt-5">
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

        {/* Contact Panel */}
        <div className="contact-panel shadow-sm">
          <div className="row g-0">

            {/* Contact Information */}
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

            {/* Contact Form */}
            <div className="col-lg-7 contact-form-area">

              <h4 className="fw-bold mb-4">
                Send a message
              </h4>

              <form className="row g-3">

                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Subject */}
                <div className="col-12">
                  <label className="form-label">
                    Subject
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Subject"
                  />
                </div>

                {/* Message */}
                <div className="col-12">
                  <label className="form-label">
                    Message
                  </label>

                  <textarea
                    className="form-control"
                    rows="6"
                    placeholder="Write your message..."
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="col-12 d-flex gap-2 flex-wrap">

                  <button
                    type="submit"
                    className="btn btn-primary contact-btn"
                  >
                    <i className="bi bi-send"></i>{" "}
                    Send Message
                  </button>

                  <button
                    type="reset"
                    className="btn btn-outline-secondary contact-btn"
                  >
                    <i className="bi bi-eraser"></i>{" "}
                    Reset
                  </button>

                </div>

              </form>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Contact;