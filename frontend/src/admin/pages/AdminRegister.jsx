import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../../services/api"; 

export default function AdminRegister() {
  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.Password !== form.ConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await registerAdmin(form);
      console.log("Register Response:", res.data);

      if (res.data.Status === "OK") {
        localStorage.setItem("adminData", JSON.stringify(res.data.Data));
        alert("✅ Registration Successful!");
        navigate("/admin/login");    // redirect after success
      } else {
        alert(res.data.Result || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Registration failed. Please check your backend.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/images/car-6.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      ></div>

      {/* Form Container */}
      <div
        className="p-4 rounded shadow-lg"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "400px",
          margin: "0 auto",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <h3 className="text-center text-danger fw-bold mb-3">Admin Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="Name"
              placeholder="Name"
              value={form.Name}
              onChange={handleChange}
              className="form-control rounded-3"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={form.Email}
              onChange={handleChange}
              className="form-control rounded-3"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="Password"
              placeholder="Password"
              value={form.Password}
              onChange={handleChange}
              className="form-control rounded-3"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="ConfirmPassword"
              placeholder="Confirm Password"
              value={form.ConfirmPassword}
              onChange={handleChange}
              className="form-control rounded-3"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-danger w-100 rounded-3 fw-semibold"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
      Already have an account?{" "}
      <a href="/admin/login" className="text-danger fw-semibold">
        Login
      </a>
    </p>
      </div>
    </div>
  );
}
