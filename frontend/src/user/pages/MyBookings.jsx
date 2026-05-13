import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserBookings } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  FaCar, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, 
  FaChevronRight, FaClock, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaTimes
} from "react-icons/fa";

// --- Styled Components ---
const PageContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 60px;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 40px 0 20px 0;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 30px;
`;

const BookingCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  margin-bottom: 25px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  
  .img-wrapper {
    cursor: zoom-in;
    overflow: hidden;
    border-radius: 16px;
    img { transition: transform 0.5s ease; }
    &:hover img { transform: scale(1.05); }
  }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.status === "Paid" ? "#ecfdf5" : props.status === "Cancelled" ? "#fef2f2" : "#fffbeb"};
  color: ${props => props.status === "Paid" ? "#10b981" : props.status === "Cancelled" ? "#ef4444" : "#f59e0b"};
`;

// --- Image Modal Popup Styles ---
const ImageOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null); // For Popup
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUserBookings(user._id);
      if (res.data.Status === "Ok") setBookings(res.data.Data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  return (
    <PageContainer>
      {/* 🔹 BREADCRUMB & HEADER */}
      <HeaderSection>
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/profile" className="text-decoration-none text-muted">Profile</Link></li>
              <li className="breadcrumb-item active fw-bold text-primary">My Bookings</li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold m-0">Trips Dashboard</h2>
            <button className="btn btn-outline-dark rounded-pill px-4 btn-sm fw-bold" onClick={() => navigate("/profile")}>
              <FaArrowLeft className="me-2"/> Back
            </button>
          </div>
        </div>
      </HeaderSection>

      <div className="container">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-grow text-primary" role="status"></div>
            <p className="mt-3 text-muted">Fetching your journey details...</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <AnimatePresence>
                {bookings.map((b, index) => (
                  <BookingCard
                    key={b.FirestoreId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-4">
                      <div className="row align-items-center">
                        {/* 📸 Image with Popup Trigger */}
                        <div className="col-md-3">
                          <div className="img-wrapper" onClick={() => setSelectedImg(`http://localhost:5000/photos/${b.CarDetails?.carImg}`)}>
                            <img 
                              src={`http://localhost:5000/photos/${b.CarDetails?.carImg}`} 
                              className="w-100 rounded-4 shadow-sm"
                              style={{ height: '160px', objectFit: 'cover' }}
                              alt="car"
                              onError={(e) => e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop"}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <StatusBadge status={b.Booking?.payment_status} className="mb-3">
                            {b.Booking?.payment_status === "Paid" ? <FaCheckCircle/> : b.Booking?.payment_status === "Cancelled" ? <FaTimesCircle/> : <FaClock/>}
                            {b.Booking?.payment_status || "Pending"}
                          </StatusBadge>
                          
                          <h3 className="fw-bold mb-2">{b.CarDetails?.Brand} <span className="text-primary">{b.CarDetails?.Model}</span></h3>
                          
                          <div className="d-flex flex-column gap-2 mt-3">
                            <div className="d-flex align-items-center text-muted small">
                              <FaCalendarAlt className="me-3 text-primary"/> 
                              <span>Pickup: <strong>{b.Booking?.pick_date}</strong></span>
                            </div>
                            <div className="d-flex align-items-center text-muted small">
                              <FaMapMarkerAlt className="me-3 text-danger"/> 
                              <span className="text-truncate">{b.Booking?.Pic_address}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3 text-md-end border-start-md ps-md-4">
                          <p className="text-muted small mb-1">Grand Total</p>
                          <h2 className="fw-bold mb-4">₹{b.Booking?.VehicleId_tarife}</h2>
                          
                          <div className="d-grid gap-2">
                            {b.Booking?.payment_status !== "Paid" && b.Booking?.payment_status !== "Cancelled" && (
                              <button className="btn btn-primary rounded-3 fw-bold py-2 shadow-sm"
                                onClick={() => navigate(`/payment/${b.FirestoreId}`, { state: { booking: b.Booking, vehicle: b.CarDetails } })}>
                                <FaCreditCard className="me-2"/> Pay Now
                              </button>
                            )}
                            <button className="btn btn-light rounded-3 btn-sm py-2 border">
                              Manage Booking <FaChevronRight size={10} className="ms-1"/>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BookingCard>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 REALISTIC IMAGE MODAL POPUP */}
      <AnimatePresence>
        {selectedImg && (
          <ImageOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div 
              className="position-relative"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="btn btn-white bg-white rounded-circle position-absolute" 
                style={{ top: '-20px', right: '-20px', width: '40px', height: '40px', zIndex: 10 }}
                onClick={() => setSelectedImg(null)}
              >
                <FaTimes />
              </button>
              <img 
                src={selectedImg} 
                className="img-fluid rounded-4 shadow-lg" 
                style={{ maxHeight: '85vh', maxWidth: '100%', border: '5px solid white' }}
                alt="Enlarged Car"
              />
            </motion.div>
          </ImageOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}