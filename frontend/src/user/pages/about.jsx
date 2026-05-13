import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import styled from "styled-components";
import { FaCheckCircle, FaAward, FaUserShield, FaClock } from "react-icons/fa";

// --- Styled Components ---
const BannerSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
              url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920');
  background-size: cover;
  background-position: center;
  height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

const StepCard = styled(motion.div)`
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  height: 100%;
  &:hover {
    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    transform: translateY(-10px);
    border-color: #f59e0b;
  }
`;

const IconWrapper = styled.div`
  width: 80px; height: 80px;
  background: #fff7ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #f59e0b;
  font-size: 2rem;
`;

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div style={{ backgroundColor: "#f8fafc" }}>
      {/* 🔹 1. TOP BANNER */}
      <BannerSection>
        <div className="container" data-aos="fade-up">
          <p className="text-uppercase small fw-bold mb-2 tracking-widest text-warning">Premier Car Rental</p>
          <h1 className="display-3 fw-bold">About Our Journey</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase small">
              <li className="breadcrumb-item"><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li className="breadcrumb-item active text-warning" aria-current="page">About Us</li>
            </ol>
          </nav>
        </div>
      </BannerSection>

      {/* 🔹 2. THREE STEPS SECTION */}
      <section className="container py-5" style={{ marginTop: "-80px" }}>
        <div className="row g-4">
          {[
            { img: "/images/location.png", title: "Choose Location", desc: "Pick your preferred pickup point from our 50+ city stations." },
            { img: "/images/deal.png", title: "Select Best Deal", desc: "Browse through hundreds of luxury and budget options." },
            { img: "/images/insurance.png", title: "Reserve Your Car", desc: "Instant confirmation with secure online payment options." }
          ].map((step, i) => (
            <div className="col-md-4" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <StepCard>
                <div className="mb-4">
                  <img src={step.img} alt={step.title} style={{ width: "70px" }} />
                </div>
                <h5 className="fw-bold mb-3">{step.title}</h5>
                <p className="text-muted small lh-lg">{step.desc}</p>
              </StepCard>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 3. COMPANY PHILOSOPHY (The Image + Blue Box) */}
      <section className="container py-5 my-5">
        <div className="row align-items-stretch g-0 rounded-4 overflow-hidden shadow-lg">
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"
              alt="Premium Car"
              className="w-100 h-100"
              style={{ objectFit: "cover", minHeight: "450px" }}
            />
          </div>
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center" style={{ backgroundColor: "#0f172a", color: "white" }}>
            <h6 className="text-warning text-uppercase fw-bold mb-3">Our Mission</h6>
            <h2 className="display-6 fw-bold mb-4">Why Thousands Trust Carbook Every Day</h2>
            <p className="text-light opacity-75 mb-4 lh-lg">
              At Carbook, we don't just rent cars; we provide the freedom to explore. Since 2015, we've helped over 500,000 travelers reach their destinations with comfort and style.
            </p>
            <div className="row g-3">
              {[
                "24/7 Premium Support",
                "No Hidden Booking Fees",
                "Flexible Cancellation Policy",
                "Wide Range of Brand New Fleet"
              ].map((item, idx) => (
                <div className="col-sm-6" key={idx}>
                  <div className="d-flex align-items-center">
                    <FaCheckCircle className="text-warning me-2" />
                    <span className="small">{item}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <button className="btn btn-warning px-5 py-3 fw-bold rounded-pill">View Our Fleet</button>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 4. CORE SERVICES (Circular Icons) */}
      <section className="py-5">
        <div className="container text-center py-5">
          <span className="text-warning text-uppercase small fw-bold">Professional Services</span>
          <h2 className="display-5 fw-bold mb-5 mt-2">What We Offer</h2>
          <div className="row g-4">
            {[
              { icon: <FaAward />, title: "Wedding Ceremony", desc: "Make your special day unforgettable with our luxury bridal cars." },
              { icon: <FaUserShield />, title: "City Transfer", desc: "Safe and comfortable point-to-point transfers within the city." },
              { icon: <FaClock />, title: "Airport Transfer", desc: "On-time airport pickups and drops with professional chauffeurs." },
              { icon: <FaCheckCircle />, title: "Whole City Tour", desc: "Expertly guided city tours with our experienced local drivers." }
            ].map((s, i) => (
              <div className="col-lg-3 col-md-6" key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
                <IconWrapper>{s.icon}</IconWrapper>
                <h5 className="fw-bold mb-3">{s.title}</h5>
                <p className="text-muted small">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 5. TESTIMONIALS (Clean Design) */}
      <section className="py-5 bg-white">
        <div className="container py-5 text-center">
          <span className="text-primary text-uppercase small fw-bold">Testimonials</span>
          <h2 className="fw-bold display-6 mb-5 mt-2">What Our Clients Say</h2>
          <div className="row g-4">
            {[
              { name: "Roger Scott", role: "Marketing Manager", img: "https://i.pravatar.cc/150?u=1" },
              { name: "Jessica Doe", role: "Interface Designer", img: "https://i.pravatar.cc/150?u=2" },
              { name: "Alex Johnson", role: "System Analyst", img: "https://i.pravatar.cc/150?u=5" }
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="p-5 rounded-4 shadow-sm border border-light h-100">
                  <p className="text-muted fst-italic mb-4">"The booking process was incredibly smooth. I rented an SUV for my family trip and the car condition was top-notch. Highly recommended!"</p>
                  <div className="d-flex align-items-center justify-content-center">
                    <img src={t.img} alt={t.name} className="rounded-circle me-3" width="60" />
                    <div className="text-start">
                      <h6 className="fw-bold mb-0">{t.name}</h6>
                      <small className="text-primary">{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}