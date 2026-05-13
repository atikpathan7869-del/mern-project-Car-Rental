import { useEffect, useState } from "react";
import {
  getVehicles,
  deleteVehicle,
  addVehicle,
  updateVehicle,
} from "../../services/api";
import Swal from "sweetalert2";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

/* ================= THEME COLORS ================= */
const theme = {
  primary: "#0f172a",    // Deep Navy
  accent: "#f59e0b",     // Amber Gold
  success: "#10b981",    // Emerald
  danger: "#ef4444",     // Rose
  bg: "#f1f5f9",         // Light Gray Blue
};

/* ================= STYLED COMPONENTS ================= */
const PageWrapper = styled.div`
  background-color: ${theme.bg};
  min-height: 100vh;
  padding: 30px;
`;

const CarTableContainer = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: none;
`;

const ActionButton = styled.button`
  padding: 6px 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: 0.2s;
  border: 1px solid transparent;
  
  &.edit-btn {
    color: ${theme.accent};
    background: rgba(245, 158, 11, 0.1);
    &:hover { background: ${theme.accent}; color: white; }
  }
  
  &.delete-btn {
    color: ${theme.danger};
    background: rgba(239, 68, 68, 0.1);
    &:hover { background: ${theme.danger}; color: white; }
  }
`;

const StatusBadge = styled.span`
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${p => 
    p.status === "Available" ? "rgba(16, 185, 129, 0.1)" : 
    p.status === "Booked" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)"};
  color: ${p => 
    p.status === "Available" ? theme.success : 
    p.status === "Booked" ? theme.danger : theme.accent};
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

export default function AdminCarPanel() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const emptyForm = {
    Brand: "", Model: "", Year: "", PricePerDay: "", PricePerKm: "",
    VehicleNumber: "", Type: "SUV", FuelType: "Diesel",
    SeatingCapacity: "", Color: "", Status: "Available",
    minimum_rent_km: "", Description: "", base64: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadCars(); }, []);

  const loadCars = async () => {
    try {
      const res = await getVehicles();
      const vehicles = res.data.Data.map((v) => ({
        ...v.Car,
        firestoreId: v.Id,
        _id: v.Car._id
      }));
      setCars(vehicles);
    } catch {
      Swal.fire("Error", "Failed to load cars", "error");
    }
  };

  const toggleStatus = async (car) => {
    const newStatus = car.Status === "Available" ? "Booked" : "Available";
    const updatedCars = cars.map(c => c._id === car._id ? { ...c, Status: newStatus } : c);
    setCars(updatedCars);
    try {
      await updateVehicle(car._id, { ...car, Status: newStatus });
    } catch {
      Swal.fire("Error", "Status update failed", "error");
      loadCars();
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Confirm Disposal?",
      text: "This vehicle will be removed from the fleet.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.danger,
      confirmButtonText: "Yes, Delete"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteVehicle(id);
        loadCars();
      }
    });
  };

  const openAddPopup = () => { setIsEdit(false); setForm(emptyForm); setShowPopup(true); };

  const openEditPopup = (car) => {
    setIsEdit(true); setEditId(car._id);
    setForm({ ...car, base64: "" });
    setShowPopup(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "carImg" && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => setForm({ ...form, base64: reader.result });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) await updateVehicle(editId, form);
      else await addVehicle(form);
      setShowPopup(false);
      loadCars();
      Swal.fire({ icon: "success", title: "Fleet Updated", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Operation failed", "error");
    }
  };

  // Logic for filtering and pagination
  const filteredCars = cars.filter(car =>
    car.Brand?.toLowerCase().includes(search.toLowerCase()) ||
    car.Model?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <PageWrapper>
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">Fleet Management</h2>
          <p className="text-muted small">Manage and track your vehicle inventory here.</p>
        </div>
        <div className="d-flex gap-3">
          <input
            className="form-control border-0 shadow-sm px-4"
            placeholder="Search fleet..."
            style={{ width: "280px", borderRadius: "12px", height: "45px" }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <button 
            className="btn px-4 shadow-sm fw-bold text-white d-flex align-items-center gap-2" 
            style={{ backgroundColor: theme.primary, borderRadius: "12px" }}
            onClick={openAddPopup}
          >
            <i className="bi bi-plus-lg"></i> Add Vehicle
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <CarTableContainer>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th className="ps-4 py-3 text-muted small fw-bold">VEHICLE</th>
                <th className="py-3 text-muted small fw-bold">SPECIFICATIONS</th>
                <th className="py-3 text-muted small fw-bold">RATES</th>
                <th className="py-3 text-muted small fw-bold text-center">STATUS</th>
                <th className="py-3 text-muted small fw-bold text-end pe-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((car) => (
                  <tr key={car.firestoreId || car._id}>
                    <td className="ps-4 py-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={`http://localhost:5000/photos/${car.carImg}`}
                          width="100" height="60"
                          className="rounded-3 shadow-sm border"
                          style={{ objectFit: "cover" }}
                          alt="car"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/100x60?text=No+Img"; }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{car.Brand} {car.Model}</div>
                          <div className="text-muted tiny">{car.VehicleNumber} • {car.Year} • {car.Color}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small fw-semibold">{car.Type}</div>
                      <div className="text-muted tiny">{car.FuelType} • {car.SeatingCapacity} Seater</div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">₹{car.PricePerDay}/Day</div>
                      <div className="text-muted tiny">₹{car.PricePerKm}/Km • Min: {car.minimum_rent_km}Km</div>
                    </td>
                    <td className="text-center">
                      <StatusBadge status={car.Status} onClick={() => toggleStatus(car)}>
                        {car.Status}
                      </StatusBadge>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex gap-2 justify-content-end">
                        <ActionButton className="edit-btn" onClick={() => openEditPopup(car)}>
                          <i className="bi bi-pencil-square"></i>
                        </ActionButton>
                        <ActionButton className="delete-btn" onClick={() => handleDelete(car._id)}>
                          <i className="bi bi-trash3"></i>
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-5 text-muted">No vehicles found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION UI */}
        {totalPages > 1 && (
          <PaginationWrapper>
            <div className="text-muted small">
              Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredCars.length)}</strong> of <strong>{filteredCars.length}</strong> vehicles
            </div>
            <nav>
              <ul className="pagination mb-0 gap-1">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link border-0 rounded-3 shadow-sm" onClick={() => paginate(currentPage - 1)}>Prev</button>
                </li>
                {[...Array(totalPages).keys()].map(n => (
                  <li key={n+1} className={`page-item ${currentPage === n+1 ? 'active' : ''}`}>
                    <button 
                      className="page-link border-0 rounded-3 shadow-sm mx-1" 
                      style={currentPage === n+1 ? { backgroundColor: theme.primary, color: 'white' } : { color: theme.primary }}
                      onClick={() => paginate(n+1)}
                    >
                      {n+1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link border-0 rounded-3 shadow-sm" onClick={() => paginate(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </PaginationWrapper>
        )}
      </CarTableContainer>

      {/* MODAL POPUP */}
      {showPopup && (
        <div className="modal fade show d-block" style={{ background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(8px)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-4 pb-0">
                <h4 className="fw-bold text-dark mb-0">{isEdit ? "Update Vehicle Details" : "New Vehicle Registration"}</h4>
                <button className="btn-close" onClick={() => setShowPopup(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Brand & Model */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Brand & Model</label>
                      <div className="input-group">
                        <input name="Brand" className="form-control border-light bg-light" placeholder="Brand (e.g. Toyota)" value={form.Brand} onChange={handleChange} required />
                        <input name="Model" className="form-control border-light bg-light" placeholder="Model (e.g. Fortuner)" value={form.Model} onChange={handleChange} required />
                      </div>
                    </div>

                    {/* Year & Color */}
                    <div className="col-md-3">
                      <label className="form-label small fw-bold text-muted">Year</label>
                      <input type="number" name="Year" className="form-control border-light bg-light" value={form.Year} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold text-muted">Color</label>
                      <input name="Color" className="form-control border-light bg-light" placeholder="White" value={form.Color} onChange={handleChange} />
                    </div>

                    {/* Rates */}
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Daily Rate (₹)</label>
                      <input type="number" name="PricePerDay" className="form-control border-light bg-light" value={form.PricePerDay} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Price Per Km (₹)</label>
                      <input type="number" name="PricePerKm" className="form-control border-light bg-light" value={form.PricePerKm} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Min Rent Km</label>
                      <input type="number" name="minimum_rent_km" className="form-control border-light bg-light" value={form.minimum_rent_km} onChange={handleChange} />
                    </div>

                    {/* Specs */}
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Vehicle Type</label>
                      <select name="Type" className="form-select border-light bg-light" value={form.Type} onChange={handleChange}>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Fuel Type</label>
                      <select name="FuelType" className="form-select border-light bg-light" value={form.FuelType} onChange={handleChange}>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted">Seating Capacity</label>
                      <input type="number" name="SeatingCapacity" className="form-control border-light bg-light" value={form.SeatingCapacity} onChange={handleChange} />
                    </div>

                    {/* Numbers & Status */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Plate Number</label>
                      <input name="VehicleNumber" className="form-control border-light bg-light" placeholder="GJ-16-AB-2025" value={form.VehicleNumber} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">Current Status</label>
                      <select name="Status" className="form-select border-light bg-light" value={form.Status} onChange={handleChange}>
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    {/* Description & Image */}
                    <div className="col-md-12">
                      <label className="form-label small fw-bold text-muted">Description</label>
                      <textarea name="Description" className="form-control border-light bg-light" rows="2" placeholder="Luxury SUV for rental..." value={form.Description} onChange={handleChange}></textarea>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold text-muted">Vehicle Image</label>
                      <input type="file" name="carImg" className="form-control border-light bg-light" onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4">
                  <button type="button" className="btn btn-light px-4" style={{ borderRadius: "10px" }} onClick={() => setShowPopup(false)}>Discard</button>
                  <button type="submit" className="btn text-white px-5 shadow-sm" style={{ backgroundColor: theme.primary, borderRadius: "10px" }}>
                    {isEdit ? "Update Assets" : "Confirm Addition"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .tiny { font-size: 11px; }
        .form-control:focus, .form-select:focus, textarea:focus { 
          background-color: white !important; 
          border-color: ${theme.accent} !important; 
          box-shadow: none; 
        }
        .pagination .page-link { color: ${theme.primary}; }
        .pagination .page-item.active .page-link { background-color: ${theme.primary}; border-color: ${theme.primary}; }
      `}</style>
    </PageWrapper>
  );
}