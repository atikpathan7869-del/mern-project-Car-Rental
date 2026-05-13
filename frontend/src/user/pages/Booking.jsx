import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { saveBooking } from "../../services/api";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FaCalendarAlt, FaMapMarkerAlt, FaCar, FaInfoCircle, FaChevronRight, FaArrowLeft } from "react-icons/fa";

// --- Styled Components for Premium Look ---
const BookingWrapper = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 50px;
`;

const HeroSection = styled.div`
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1500');
  background-size: cover;
  background-position: center;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const PriceTag = styled.div`
  background: #2563eb;
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  display: inline-block;
`;

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;
  const userId = localStorage.getItem("userId");
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    pickupLocation: "",
    dropoffLocation: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!vehicle) navigate("/vehicles");
  }, [vehicle, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (form.fromDate && form.toDate) {
      const from = new Date(form.fromDate);
      const to = new Date(form.toDate);
      if (to < from) {
        setForm((prev) => ({ ...prev, toDate: form.fromDate }));
      }
    }
  }, [form.fromDate, form.toDate]);

  useEffect(() => {
    if (form.fromDate && form.toDate && vehicle?.PricePerDay) {
      const start = new Date(form.fromDate);
      const end = new Date(form.toDate);
      if (end >= start) {
        const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
        setTotalPrice(days * vehicle.PricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  }, [form.fromDate, form.toDate, vehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire({ title: "Login Required", text: "Please login first", icon: "warning" }).then(() => navigate("/login"));
      return;
    }

    const bookingData = {
      VehicleId: Number(vehicle._id),
      CustomerId: userId,
      pick_date: form.fromDate,
      Pic_address: form.pickupLocation,
      VehicleId_tarife: Number(totalPrice),
      payment_status: "Pending",
      remark: form.dropoffLocation,
    };

    try {
      const res = await saveBooking(bookingData);
      if (res.data.Status === "Ok") {
        const bookingId = res.data.FirestoreId;
        Swal.fire({
          title: "Booking Confirmed 🎉",
          html: `<b>${vehicle.Brand} ${vehicle.Model}</b><br/>Total: ₹${totalPrice}`,
          icon: "success",
        }).then(() => {
          navigate(`/payment/${bookingId}`, { state: { vehicle, booking: bookingData } });
        });
      } else {
        Swal.fire("Booking Failed", res.data.Data, "error");
      }
    } catch (err) {
      Swal.fire("Server Error", err.response?.data?.Data || "Something went wrong", "error");
    }
  };

  if (!vehicle) return null;

  return (
    <BookingWrapper>
      {/* 🔹 HERO & BREADCRUMBS */}
      <HeroSection>
        <div className="container text-center">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center mb-3">
                    <li className="breadcrumb-item"><Link to="/" className="text-white opacity-75 text-decoration-none">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/vehicles" className="text-white opacity-75 text-decoration-none">Fleet</Link></li>
                    <li className="breadcrumb-item active text-white fw-bold" aria-current="page">Booking</li>
                </ol>
            </nav>
          <motion.h1 initial={{y: 20, opacity: 0}} animate={{y:0, opacity:1}} className="fw-bold display-4">Secure Your Ride</motion.h1>
          <p className="lead opacity-75">Premium car rental for your next great adventure</p>
        </div>
      </HeroSection>

      <div className="container" style={{ marginTop: "-50px" }}>
        <div className="row g-4">
          {/* 🔹 LEFT SIDE: VEHICLE SUMMARY */}
          <div className="col-lg-4">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <img 
                src={`http://localhost:5000/photos/${vehicle.carImg}`} 
                className="img-fluid" 
                alt="car"
                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"}
              />
              <div className="card-body p-4">
                <h4 className="fw-bold text-dark">{vehicle.Brand} {vehicle.Model}</h4>
                <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-light text-primary border">{vehicle.Type}</span>
                    <span className="badge bg-light text-muted border">{vehicle.FuelType}</span>
                </div>
                <hr className="text-muted opacity-25" />
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">Vehicle ID</span>
                  <span className="fw-bold">{vehicle.VehicleNumber}</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Daily Rate</span>
                  <span className="fw-bold text-primary">₹{vehicle.PricePerDay} / day</span>
                </div>
              </div>
            </motion.div>

            <div className="mt-4 p-4 bg-white rounded-4 shadow-sm border border-primary border-opacity-10">
                <div className="d-flex align-items-center text-primary mb-2">
                    <FaInfoCircle className="me-2"/>
                    <span className="fw-bold small">Booking Summary</span>
                </div>
                <p className="text-muted small mb-0">Your total amount is calculated based on the selected dates including taxes.</p>
            </div>
          </div>

          {/* 🔹 RIGHT SIDE: BOOKING FORM */}
          <div className="col-lg-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Booking Information</h3>
                <button className="btn btn-link text-muted text-decoration-none d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
                   <FaArrowLeft size={12}/> Back
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">PICKUP DATE</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-primary"><FaCalendarAlt/></span>
                      <input type="date" name="fromDate" className="form-control border-start-0 bg-light" min={today} value={form.fromDate} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">RETURN DATE</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-primary"><FaCalendarAlt/></span>
                      <input type="date" name="toDate" className="form-control border-start-0 bg-light" min={form.fromDate || today} value={form.toDate} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">PICKUP ADDRESS</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-danger"><FaMapMarkerAlt/></span>
                      <input type="text" name="pickupLocation" className="form-control border-start-0 bg-light" placeholder="Hotel name, airport, or city area" value={form.pickupLocation} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">DROP-OFF NOTES / ADDRESS</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FaCar/></span>
                      <input type="text" name="dropoffLocation" className="form-control border-start-0 bg-light" placeholder="Drop-off location details (optional)" value={form.dropoffLocation} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-light rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
                  <div>
                    <h6 className="text-muted mb-1 fw-bold">ESTIMATED TOTAL</h6>
                    <h2 className="fw-bold text-dark mb-0">₹{totalPrice}</h2>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center gap-3">
                    Confirm & Pay <FaChevronRight size={14}/>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </BookingWrapper>
  );
}