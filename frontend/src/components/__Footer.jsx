import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import styled from "styled-components";

const FooterSection = styled.footer`
  background-color: #0f172a;
  color: #94a3b8;
  padding-top: 80px;
  border-top: 5px solid #f59e0b;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white !important;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #f59e0b;
    transform: translateY(-5px);
    color: #0f172a !important;
  }
`;

const FooterLink = styled.a`
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
  display: block;
  margin-bottom: 10px;

  &:hover {
    color: #f59e0b;
    padding-left: 8px;
  }
`;

const Footer = () => {
  return (
    <FooterSection>
      <div className="container">
        <div className="row g-4">
          {/* Logo + About */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-4">
              <img src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" alt="logo" style={{ height: "45px", marginRight: "12px", filter: "brightness(0) invert(1)" }} />
              <span className="h3 fw-bold text-white mb-0">CAR<span style={{ color: "#f59e0b" }}>RENTAL</span></span>
            </div>
            <p className="pe-lg-5">
              Experience the ultimate freedom of the road with our premium fleet. From luxury sedans to rugged SUVs, we provide the perfect ride for every journey.
            </p>
            <div className="d-flex gap-3 mt-4">
              <SocialIcon href="#"><FaFacebookF /></SocialIcon>
              <SocialIcon href="#"><FaTwitter /></SocialIcon>
              <SocialIcon href="#"><FaLinkedinIn /></SocialIcon>
              <SocialIcon href="#"><FaInstagram /></SocialIcon>
              <SocialIcon href="#"><FaYoutube /></SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-white fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li><FooterLink href="/">Home</FooterLink></li>
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/vehicles">Our Fleet</FooterLink></li>
              <li><FooterLink href="/deals">Special Offers</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </div>

          {/* Popular Models */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-white fw-bold mb-4">Popular Models</h5>
            <ul className="list-unstyled">
              <li><FooterLink href="#">BMW M4 Competition</FooterLink></li>
              <li><FooterLink href="#">Mercedes-Benz S-Class</FooterLink></li>
              <li><FooterLink href="#">Range Rover Sport</FooterLink></li>
              <li><FooterLink href="#">Audi RS7 Performance</FooterLink></li>
              <li><FooterLink href="#">Tesla Model S Plaid</FooterLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-white fw-bold mb-4">Get In Touch</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FaPhoneAlt className="text-warning me-3" /> +91 987 654 3210
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="text-warning me-3" /> Bharuch, Gujarat, India
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="text-warning me-3" /> support@carrental.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary mt-5 py-4 text-center">
          <p className="mb-0 small">
            &copy; {new Date().getFullYear()} <span className="text-white fw-bold">CAR RENTAL</span>. Designed with ❤️ by Atik Pathan.
          </p>
        </div>
      </div>
    </FooterSection>
  );
};

export default Footer;