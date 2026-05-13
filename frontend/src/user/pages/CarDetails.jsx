import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicles } from "../../services/api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import styled from "styled-components";
import { 
  FaGasPump, FaUserFriends, FaCogs, FaCalendarAlt, 
  FaPalette, FaIdCard, FaCheckCircle, FaChevronLeft 
} from "react-icons/fa";

const DetailWrapper = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const GlassCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const SpecItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f1f5f9;
  border-radius: 12px;
  margin-bottom: 15px;
  .icon-box {
    width: 40px; height: 40px; background: white;
    color: #f59e0b; display: flex; align-items: center;
    justify-content: center; border-radius: 10px;
    margin-right: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }
  .label { font-size: 0.8rem; color: #64748b; margin-bottom: 0; }
  .value { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin-bottom: 0; }
`;

export default function CarDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicle();
    // Jab bhi ID change ho (kisi dusre page se aayein), scroll top par jaye
    window.scrollTo(0, 0);
  }, [id]);

  const loadVehicle = async () => {
    try {
      const res = await getVehicles();
      if (res.data.Status !== "Ok") return;

      const allData = res.data.Data || [];

      // ✅ UNIVERSAL MATCHING LOGIC
      // Hum teeno places par check karenge: 
      // 1. Parent Object ki ID (_id)
      // 2. Car object ki ID (Car._id)
      // 3. Agar backend 'Id' bhej raha ho
      const foundItem = allData.find(v => 
        v._id?.toString() === id || 
        v.Car?._id?.toString() === id || 
        v.Id?.toString() === id
      );

      if (!foundItem) {
        Swal.fire({
          title: "Vehicle Not Found",
          text: "The details for this vehicle could not be loaded.",
          icon: "error"
        }).then(() => navigate("/vehicles"));
      } else {
        // Hum pure foundItem.Car ko set kar rahe hain display ke liye
        setVehicle(foundItem.Car);
      }
    } catch (error) {
      console.error("Detail Fetch Error:", error);
      Swal.fire("Error", "Something went wrong while fetching details.", "error");
    }
  };

  const handleBook = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      Swal.fire({
        title: "Login Required!",
        text: "Please login to book this vehicle.",
        icon: "info",
        confirmButtonColor: "#f59e0b",
      }).then(() => navigate("/login"));
      return;
    }
    navigate("/booking", { state: { vehicle } });
  };

  if (!vehicle) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
        <div className="spinner-grow text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <DetailWrapper>
      <section
        className="text-white d-flex align-items-end"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "40vh",
          paddingBottom: "40px"
        }}
      >
        <div className="container">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-link text-white text-decoration-none mb-3 p-0 d-flex align-items-center"
          >
            <FaChevronLeft className="me-2"/> Back
          </button>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="display-4 fw-bold"
          >
            {vehicle.Brand} {vehicle.Model}
          </motion.h1>
          <p className="text-warning fw-bold mb-0">
            <FaCheckCircle className="me-2"/> Premium Quality Verified
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: "-60px", position: "relative", zIndex: 5 }}>
        <div className="row g-4 mb-5">
          <div className="col-lg-7">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <GlassCard className="p-3">
                <img
                  src={`http://localhost:5000/photos/${vehicle.carImg}`}
                  alt={vehicle.Model}
                  className="img-fluid rounded-4 w-100"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                  onError={(e) => e.target.src = "https://via.placeholder.com/800x500?text=Car+Image"}
                />
              </GlassCard>
            </motion.div>
          </div>

          <div className="col-lg-5">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <GlassCard className="p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <span className="badge bg-warning text-dark px-3 py-2 mb-2 rounded-pill fw-bold">₹{vehicle.PricePerDay}/DAY</span>
                    <h3 className="fw-bold text-dark">{vehicle.Model}</h3>
                  </div>
                  <div className={`badge ${vehicle.Status === 'Available' ? 'bg-success' : 'bg-danger'} p-2 px-3`}>
                    {vehicle.Status}
                  </div>
                </div>

                <p className="text-muted small mb-4 lh-lg">{vehicle.Description || "Experience the perfect blend of power and elegance with this verified vehicle."}</p>

                <div className="row g-3">
                  {[
                    { icon: <FaGasPump />, label: "Fuel", value: vehicle.FuelType },
                    { icon: <FaUserFriends />, label: "Seats", value: vehicle.SeatingCapacity },
                    { icon: <FaCogs />, label: "Type", value: vehicle.Type },
                    { icon: <FaCalendarAlt />, label: "Year", value: vehicle.Year },
                    { icon: <FaPalette />, label: "Color", value: vehicle.Color || "Default" },
                    { icon: <FaIdCard />, label: "Plate", value: vehicle.VehicleNumber }
                  ].map((item, idx) => (
                    <div className="col-6" key={idx}>
                      <SpecItem>
                        <div className="icon-box">{item.icon}</div>
                        <div>
                          <p className="label">{item.label}</p>
                          <p className="value">{item.value}</p>
                        </div>
                      </SpecItem>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn btn-warning btn-lg w-100 mt-4 py-3 fw-bold rounded-3 shadow-sm"
                  onClick={handleBook}
                  disabled={vehicle.Status !== "Available"}
                >
                  {vehicle.Status === "Available" ? "RESERVE THIS CAR" : "UNAVAILABLE"}
                </button>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </DetailWrapper>
  );
}