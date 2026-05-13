  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { loginAdmin } from "../../services/api";

  export default function AdminLogin() {
    const [form, setForm] = useState({ Email: "", Password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

 // AdminLogin.jsx ke handleSubmit function mein ye change karein:

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await loginAdmin(form);
    console.log("Login Response:", res.data);

    if (res.data.Status === "Ok") { 
      // 1. Pura data save karein backup ke liye
      localStorage.setItem("adminData", JSON.stringify(res.data)); 
      
      // 2. CRITICAL FIX: Profile component isi key ko dhoond raha hai
      // Agar aapka backend 'FirestoreId' bhej raha hai to wahi use karein
      localStorage.setItem("adminFirestoreId", res.data.FirestoreId); 
      
      console.log("Login Success, navigating to /admin");
      navigate("/admin");
    } else {
      alert(res.data.Data || "Invalid admin credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please check your backend.");
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

    {/* Form Card */}
    <div
      className="card shadow-lg p-4 rounded-4"
      style={{
        position: "relative",
        zIndex: 1,
        width: "380px",
        margin: "0 auto",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(255,255,255,0.95)",
      }}
    >
      <h3 className="text-center text-danger fw-bold mb-2">Admin Login</h3>
      <p className="text-center text-muted mb-4">Secure access </p>

      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="btn btn-danger w-100 rounded-3 fw-semibold"
        >
          Login
        </button>
      </form>
      {/* <p className="text-center mt-3 mb-0">
        Don’t have an Admin account?{" "}
        <a href="/admin/register" className="text-danger fw-semibold">
          Register
        </a>
      </p> */}
    </div>
  </div>



    );
  }
