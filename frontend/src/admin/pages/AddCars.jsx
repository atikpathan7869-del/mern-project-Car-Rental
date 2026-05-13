import { useState } from "react";
import { addVehicle } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddCar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Brand: "",
    Model: "",
    Year: "",
    PricePerDay: "",
    VehicleNumber: "",
    Type: "",
    FuelType: "",
    SeatingCapacity: "",
    Color: "",
    Status: "",
    minimum_rent_km: "",
    Description: "",
    base64: "", // ✅ will store base64 string here
  });

  // Handle input + image (convert to base64)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "carImg" && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]); // convert to base64
      reader.onloadend = () => {
        setForm({ ...form, base64: reader.result }); // save base64
      };
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addVehicle(form); // send JSON with base64
      alert("Car added successfully ✅");
     navigate("/admin/cars");
    } catch (err) {
      console.error(err);
      alert("Failed to add car ❌");
    }
  };

  return (
 <div className="container mt-4">
  <h2 className="mb-4">Add New Car</h2>
  <form onSubmit={handleSubmit}>
    <div className="row">
      {/* Brand */}
      <div className="col-md-6 mb-3">
        <label className="form-label">Brand</label>
        <input
          type="text"
          name="Brand"
          className="form-control"
          value={form.Brand}
          onChange={handleChange}
          required
        />
      </div>

      {/* Model */}
      <div className="col-md-6 mb-3">
        <label className="form-label">Model</label>
        <input
          type="text"
          name="Model"
          className="form-control"
          value={form.Model}
          onChange={handleChange}
          required
        />
      </div>

      {/* Year */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Year</label>
        <input
          type="number"
          name="Year"
          className="form-control"
          value={form.Year}
          onChange={handleChange}
          required
        />
      </div>

      {/* Price Per Day */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Price Per Day (₹)</label>
        <input
          type="number"
          name="PricePerDay"
          className="form-control"
          value={form.PricePerDay}
          onChange={handleChange}
          required
        />
      </div>

      {/* Vehicle Number */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Vehicle Number</label>
        <input
          type="text"
          name="VehicleNumber"
          className="form-control"
          value={form.VehicleNumber}
          onChange={handleChange}
        />
      </div>

      {/* Type */}
      <div className="col-md-6 mb-3">
        <label className="form-label">Type</label>
        <input
          type="text"
          name="Type"
          className="form-control"
          value={form.Type}
          onChange={handleChange}
        />
      </div>

      {/* Fuel Type */}
      <div className="col-md-6 mb-3">
        <label className="form-label">Fuel Type</label>
        <input
          type="text"
          name="FuelType"
          className="form-control"
          value={form.FuelType}
          onChange={handleChange}
        />
      </div>

      {/* Seating Capacity */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Seating Capacity</label>
        <input
          type="number"
          name="SeatingCapacity"
          className="form-control"
          value={form.SeatingCapacity}
          onChange={handleChange}
        />
      </div>

      {/* Color */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Color</label>
        <input
          type="text"
          name="Color"
          className="form-control"
          value={form.Color}
          onChange={handleChange}
        />
      </div>

      {/* Status */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Status</label>
        <select
          name="Status"
          className="form-select"
          value={form.Status}
          onChange={handleChange}
        >
          <option value="">Select status</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      {/* Minimum Rent */}
      <div className="col-md-6 mb-3">
        <label className="form-label">Minimum Rent (km)</label>
        <input
          type="number"
          name="minimum_rent_km"
          className="form-control"
          value={form.minimum_rent_km}
          onChange={handleChange}
        />
      </div>

      {/* Car Image */}
      <div className="col-md-6 mb-3">
        <label className="form-label">Car Image</label>
        <input
          type="file"
          name="carImg"
          accept="image/*"
          className="form-control"
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className="col-12 mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="Description"
          className="form-control"
          value={form.Description}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>
    </div>

    <button type="submit" className="btn btn-primary">
      Add Car
    </button>
  </form>
</div>

  );
}
