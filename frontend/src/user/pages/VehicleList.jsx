import { useEffect, useState } from "react";
import { getVehicles } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Swal from "sweetalert2"; // ✅ SweetAlert import kiya
import { FaGasPump, FaCarSide, FaSearch, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";

// --- Styled Components for Premium UI ---
const FilterBar = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.08);
  margin-top: -60px;
  position: relative;
  z-index: 10;
  padding: 30px;
  border: 1px solid #f1f5f9;
`;

const VehicleCard = styled(motion.div)`
  .card {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    background: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.04);
  }
  &:hover .card {
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    transform: translateY(-8px);
  }
  .card-img-container {
    height: 220px;
    overflow: hidden;
    position: relative;
  }
  .price-badge {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background: rgba(15, 23, 42, 0.9);
    color: #fbbf24;
    padding: 5px 15px;
    border-radius: 50px;
    font-weight: 700;
  }
`;

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [filters, setFilters] = useState({ type: "", fuel: "", minPrice: "", maxPrice: "" });
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await getVehicles();
      const cars = (res.data.Data || []).map((v) => v.Car);
      setVehicles(cars);
      setFilteredVehicles(cars);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // ✅ AUTH CHECK FUNCTION
  const handleBook = (vehicle) => {
    const user = JSON.parse(localStorage.getItem("user")); // User check karein

    if (!user) {
      // Agar user login nahi hai
      Swal.fire({
        title: "Login Required!",
        text: "Please login to book your favorite vehicle.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login"); // Login page par bhejein
        }
      });
      return;
    }

    // Agar login hai, toh booking page par bhejein
    navigate("/booking", { state: { vehicle } });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    let result = vehicles.filter((v) => {
      const matchesType = !filters.type || v.Type?.toLowerCase() === filters.type.toLowerCase();
      const matchesFuel = !filters.fuel || v.FuelType?.toLowerCase() === filters.fuel.toLowerCase();
      const matchesMin = !filters.minPrice || Number(v.PricePerDay) >= Number(filters.minPrice);
      const matchesMax = !filters.maxPrice || Number(v.PricePerDay) <= Number(filters.maxPrice);
      return matchesType && matchesFuel && matchesMin && matchesMax;
    });
    setFilteredVehicles(result);
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* 🔹 HERO BANNER */}
      <section
        className="d-flex align-items-center text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "45vh",
        }}
      >
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-warning fw-bold text-uppercase tracking-widest mb-2">Explore Our Fleet</p>
            <h1 className="display-4 fw-bold">Find Your Perfect Drive</h1>
          </motion.div>
        </div>
      </section>

      {/* 🔹 FILTER BAR */}
      <div className="container">
        <FilterBar>
          <form onSubmit={applyFilters} className="row g-3">
            <div className="col-lg-3">
              <label className="small fw-bold text-muted mb-2">VEHICLE TYPE</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><FaCarSide className="text-primary"/></span>
                <select name="type" className="form-select border-0 bg-light" onChange={handleInput}>
                  <option value="">All Types</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3">
              <label className="small fw-bold text-muted mb-2">FUEL TYPE</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><FaGasPump className="text-primary"/></span>
                <select name="fuel" className="form-select border-0 bg-light" onChange={handleInput}>
                  <option value="">All Fuels</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>
            <div className="col-lg-4">
              <label className="small fw-bold text-muted mb-2">PRICE RANGE (₹/DAY)</label>
              <div className="d-flex gap-2">
                <input type="number" name="minPrice" placeholder="Min" className="form-control border-0 bg-light" onChange={handleInput} />
                <input type="number" name="maxPrice" placeholder="Max" className="form-control border-0 bg-light" onChange={handleInput} />
              </div>
            </div>
            <div className="col-lg-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-3">
                <FaSearch className="me-2"/> Search
              </button>
            </div>
          </form>
        </FilterBar>
      </div>

      {/* 🔹 VEHICLE LIST */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold m-0">Available <span className="text-primary">Vehicles</span></h2>
          <span className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-sm">
            Showing {filteredVehicles.length} results
          </span>
        </div>

        <div className="row">
          <AnimatePresence>
            {filteredVehicles.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
                <img src="/images/no-results.png" alt="No results" style={{ width: '150px', opacity: 0.5 }} />
                <h4 className="text-muted mt-3">No cars match your criteria.</h4>
              </motion.div>
            ) : (
              filteredVehicles.map((v, idx) => (
                <div key={v._id} className="col-lg-4 col-md-6 mb-4">
                  <VehicleCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="card h-100">
                      <div className="card-img-container">
                        <img
                          src={`http://localhost:5000/photos/${v.carImg}`}
                          className="w-100 h-100 object-fit-cover"
                          alt={v.Model}
                          onError={(e) => e.target.src = "https://via.placeholder.com/400x250?text=Car+Image"}
                        />
                        <div className="price-badge">₹{v.PricePerDay}/day</div>
                      </div>

                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold mb-0 text-dark">{v.Brand} {v.Model}</h5>
                          <span className="small text-muted"><FaCalendarAlt className="me-1"/> {v.Year}</span>
                        </div>
                        
                        <div className="d-flex gap-3 mb-4 text-muted small fw-medium">
                          <span className="bg-light px-2 py-1 rounded">● {v.Type}</span>
                          <span className="bg-light px-2 py-1 rounded">● {v.FuelType}</span>
                        </div>

                        <div className="row g-2">
                          <div className="col-8">
                            {/* ✅ Updated Click Handler */}
                            <button 
                              className="btn btn-primary w-100 fw-bold rounded-3"
                              onClick={() => handleBook(v)}
                            >
                              Book Now
                            </button>
                          </div>
                          <div className="col-4">
                            <button 
                              className="btn btn-outline-dark w-100 rounded-3"
                              onClick={() => navigate(`/vehicle/${v._id}`)}
                            >
                              <FaInfoCircle />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VehicleCard>
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}