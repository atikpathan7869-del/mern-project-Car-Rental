import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaPlayCircle } from "react-icons/fa";

const HeroWrapper = styled.div`
  height: 85vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  /* Premium Luxury Car Image */
  background: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920') center center / cover no-repeat;
  background-attachment: fixed; /* Parallax effect */

  @media (max-width: 768px) {
    height: 60vh;
    background-attachment: scroll;
  }
`;

const DarkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Gradient overlay for better text readability */
  background: linear-gradient(
    to right,
    rgba(15, 23, 42, 0.9) 0%,
    rgba(15, 23, 42, 0.4) 50%,
    rgba(15, 23, 42, 0.2) 100%
  );
  z-index: 1;
`;

const ContentBox = styled.div`
  position: relative;
  z-index: 2;
  color: white;
  max-width: 700px;
  text-align: left; /* Center se Left alignment zyada professional lagta hai hero sections mein */

  h1 {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -1px;

    span {
      color: #f59e0b;
      font-style: italic;
    }
  }

  p {
    font-size: 1.25rem;
    color: #cbd5e1;
    margin-bottom: 35px;
    line-height: 1.6;
    border-left: 4px solid #f59e0b;
    padding-left: 20px;
  }

  @media (max-width: 768px) {
    text-align: center;
    h1 { font-size: 2.5rem; }
    p { border-left: none; padding-left: 0; }
  }
`;

const ActionButton = styled(Link)`
  background: #f59e0b;
  color: #0f172a !important;
  font-weight: 700;
  padding: 15px 35px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid #f59e0b;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  text-decoration: none;

  &:hover {
    background: transparent;
    color: #f59e0b !important;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
  }

  svg {
    margin-right: 10px;
    font-size: 1.5rem;
  }
`;

export default function Breadcroum() {
  return (
    <HeroWrapper>
      <DarkOverlay />
      <div className="container">
        <ContentBox>
          <h1 className="animate__animated animate__fadeInLeft">
            Fast & Easy Way <br /> 
            To <span>Rent A Car</span>
          </h1>
          <p className="animate__animated animate__fadeInLeft animate__delay-1s">
            Experience the thrill of the open road with our premium fleet. 
            From luxury sedans to high-performance sports cars, we make 
            every journey unforgettable.
          </p>
          <div className="animate__animated animate__fadeInUp animate__delay-2s">
            <ActionButton to="/vehicles">
              <FaPlayCircle /> Start Booking Now
            </ActionButton>
          </div>
        </ContentBox>
      </div>
    </HeroWrapper>
  );
}