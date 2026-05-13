import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import styled from "styled-components";
import Breadcroum from "../../components/__breadcroum";
import { getVehicles } from "../../services/api";
import Swal from "sweetalert2";
import { FaCar, FaCalendarAlt, FaCheckCircle, FaStar, FaGasPump, FaUserFriends, FaShieldAlt, FaMapMarkedAlt, FaHeadset } from "react-icons/fa";

// --- NEW IMPORTS FOR COUNTER ---
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

// --- STYLED COMPONENTS ---
const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;
  h6 { color: #f59e0b; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; }
  h2 { font-size: 2.5rem; font-weight: 800; color: #0f172a; }
`;

const FeatureIconCard = styled(motion.div)`
  background: #fff;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  height: 100%;
  .icon-wrapper {
    width: 70px; height: 70px; background: #fff7ed; color: #f59e0b;
    display: flex; align-items: center; justify-content: center;
    border-radius: 18px; font-size: 1.8rem; margin: 0 auto 25px;
  }
`;

const StatsSection = styled.section`
  background: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), 
              url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920');
  background-attachment: fixed;
  background-size: cover;
  padding: 80px 0;
  color: white;
  text-align: center;
`;

const StyledCard = styled(motion.div)`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; height: 100%;
  .img-container { height: 200px; overflow: hidden; position: relative; img { transition: 0.5s; width: 100%; height: 100%; object-fit: cover; } }
  &:hover img { transform: scale(1.1); }
`;

const SearchContainer = styled.div`
  background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  padding: 30px; margin-top: -60px; position: relative; z-index: 10; border-bottom: 4px solid #f59e0b;
`;

// --- HELPER COMPONENT FOR ANIMATED NUMBERS ---
const CounterItem = ({ target, label, suffix }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div className="col-6 col-md-3" ref={ref}>
      <h2 className="display-4 fw-bold text-warning mb-1">
        {inView ? <CountUp start={0} end={target} duration={2.5} suffix={suffix} /> : "0"}
      </h2>
      <p className="text-uppercase small fw-bold mb-0">{label}</p>
    </div>
  );
};

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filters, setFilters] = useState({ type: "", from: "", to: "" });
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await getVehicles();
      if (res.data.Status !== "Ok") return;

      const cars = res.data.Data.map((v) => {
        const vehicleId = v.Id || v._id || v.Car?._id;
        return { 
          ...v.Car, 
          _id: vehicleId, 
          FirestoreId: vehicleId, 
          ExistingBookings: v.Bookings || [] 
        };
      });
      
      setVehicles(cars);
      setFilteredVehicles(cars);
    } catch (error) { 
      console.error("Error loading vehicles:", error); 
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const { type, from, to } = filters;

    if (!type && !from && !to) {
      setFilteredVehicles(vehicles);
      setIsFiltered(false);
      return;
    }

    const results = vehicles.filter((v) => {
      const matchesType = type ? v.Type?.toLowerCase() === type.toLowerCase() : true;
      let isAvailable = true;
      if (from && to) {
        const userFrom = new Date(from);
        const userTo = new Date(to);
        isAvailable = !v.ExistingBookings.some(booking => {
          const bStart = new Date(booking.FromDate);
          const bEnd = new Date(booking.ToDate);
          return (userFrom <= bEnd && userTo >= bStart);
        });
      }
      return matchesType && isAvailable;
    });

    setFilteredVehicles(results);
    setIsFiltered(true);

    if (results.length === 0) {
      Swal.fire("No Cars", "No vehicles found for selected criteria.", "warning");
    }
  };

  const handleBook = (vehicle) => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!vehicle._id) {
        console.error("Critical: Vehicle ID is missing!", vehicle);
        Swal.fire("Error", "Vehicle ID is missing. Please refresh.", "error");
        return;
    }

    if (!user) {
      Swal.fire("Login Required", "Please login to book a vehicle.", "warning")
          .then(() => navigate("/login"));
      return;
    }
    
    navigate("/booking", { 
        state: { 
            vehicle: vehicle, 
            dates: { from: filters.from, to: filters.to } 
        } 
    });
  };

  const VehicleCard = ({ v }) => (
    <StyledCard whileHover={{ y: -10 }}>
      <div className="img-container">
        <img src={`http://localhost:5000/photos/${v.carImg}`} alt={v.Model} />
        <div className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark px-3 py-2 fw-bold">₹{v.PricePerDay}/Day</div>
      </div>
      <div className="card-body p-4 text-center">
        <h5 className="fw-bold mb-3">{v.Brand} {v.Model}</h5>
        <div className="d-flex justify-content-center gap-3 mb-4 text-muted small border-top pt-3">
          <span><FaGasPump className="text-warning" /> {v.FuelType || 'Petrol'}</span>
          <span><FaUserFriends className="text-warning" /> {v.Seats || '5'} Seats</span>
          <span><FaCheckCircle className="text-warning" /> AC</span>
        </div>
        <div className="row g-2">
          <div className="col-6">
            <button className="btn btn-dark w-100 py-2 fw-bold rounded-3" onClick={() => handleBook(v)}>BOOK</button>
          </div>
          <div className="col-6">
            <button 
              className="btn btn-outline-dark w-100 py-2 fw-bold rounded-3" 
              onClick={() => navigate(`/vehicle/${v._id}`)}
            >
              DETAILS
            </button>
          </div>
        </div>
      </div>
    </StyledCard>
  );

  return (
    <div style={{ backgroundColor: "#f8fafc", overflowX: 'hidden' }}>
      <Breadcroum />

      <section className="container mb-5">
        <SearchContainer data-aos="zoom-in">
          <form className="row g-4 align-items-end" onSubmit={handleFilter}>
            <div className="col-lg-3">
              <label className="form-label fw-bold text-dark small"><FaCar className="me-2 text-warning"/> CAR TYPE</label>
              <select name="type" value={filters.type} onChange={handleInput} className="form-select form-select-lg border-0 bg-light">
                <option value="">All Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div className="col-lg-3">
              <label className="form-label fw-bold text-dark small"><FaCalendarAlt className="me-2 text-warning"/> PICKUP</label>
              <input type="date" name="from" min={today} value={filters.from} onChange={handleInput} className="form-control form-control-lg border-0 bg-light" />
            </div>
            <div className="col-lg-3">
              <label className="form-label fw-bold text-dark small"><FaCalendarAlt className="me-2 text-warning"/> RETURN</label>
              <input type="date" name="to" min={filters.from || today} value={filters.to} onChange={handleInput} className="form-control form-control-lg border-0 bg-light" />
            </div>
            <div className="col-lg-3">
              <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold shadow-sm py-3 text-dark">
                FIND AVAILABLE CARS
              </button>
            </div>
          </form>
        </SearchContainer>
      </section>

      <section className="container py-5">
        <SectionTitle data-aos="fade-up">
          <h6>{isFiltered ? "SEARCH RESULTS" : "PREMIUM COLLECTION"}</h6>
          <h2>{isFiltered ? "Available Cars" : "Explore Our Fleet"}</h2>
        </SectionTitle>

        {!isFiltered ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-5"
          >
            {filteredVehicles.map((v) => (
              <SwiperSlide key={v._id}>
                <VehicleCard v={v} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="row g-4">
            {filteredVehicles.map((v) => (
              <div className="col-lg-4 col-md-6" key={v._id}>
                <VehicleCard v={v} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- UPDATED STATS SECTION --- */}
      <StatsSection>
        <div className="container">
          <div className="row g-4 text-center">
            <CounterItem target={500} label="Happy Clients" suffix="+" />
            <CounterItem target={120} label="Luxury Cars" suffix="+" />
            <CounterItem target={15} label="City Stations" suffix="+" />
            <CounterItem target={100} label="Safe Journeys" suffix="%" />
          </div>
        </div>
      </StatsSection>

      <section className="py-5 bg-white">
        <div className="container py-5">
          <SectionTitle data-aos="fade-up">
            <h6>WHY CHOOSE US</h6>
            <h2>Modern Rental Experience</h2>
          </SectionTitle>
          <div className="row g-4 text-center">
            {[
              { icon: <FaShieldAlt />, title: "Fully Insured", desc: "Every rental comes with comprehensive insurance coverage." },
              { icon: <FaMapMarkedAlt />, title: "Anywhere Delivery", desc: "We deliver to your doorstep, airport, or hotel." },
              { icon: <FaHeadset />, title: "24/7 Roadside", desc: "Our team is available 24/7 to help with any issue." },
              { icon: <FaStar />, title: "No Hidden Fees", desc: "The price you see is the price you pay." }
            ].map((f, i) => (
              <div className="col-lg-3 col-md-6" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <FeatureIconCard>
                  <div className="icon-wrapper">{f.icon}</div>
                  <h5 className="fw-bold mb-3">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </FeatureIconCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 text-center" style={{ background: '#f59e0b' }}>
        <div className="container py-4">
          <h2 className="fw-bold text-dark mb-4">Ready to start your premium journey?</h2>
          <button className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg" onClick={() => navigate("/vehicles")}>
            EXPLORE ALL VEHICLES
          </button>
        </div>
      </section>
    </div>
  );
}