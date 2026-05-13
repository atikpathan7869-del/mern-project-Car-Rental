import { useState } from "react";
import { loginUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import styled from "styled-components";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

// ================= STYLED COMPONENTS =================
const LoginWrapper = styled.div`
  min-height: 100vh;
  /* Online High-Quality Car Image */
  background: linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)),
    url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  padding: 45px 35px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const BrandTitle = styled.h2`
  color: #0f172a;
  font-weight: 800;
  text-align: center;
  margin-bottom: 5px;
  letter-spacing: -1px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: 18px;
    transform: translateY(-50%);
    color: #94a3b8;
    transition: 0.3s;
  }

  input {
    width: 100%;
    padding: 14px 15px 14px 50px;
    border-radius: 15px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    transition: all 0.3s ease;
    font-size: 1rem;

    &:focus {
      border-color: #ef4444;
      background: white;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
      outline: none;
      & + .icon {
        color: #ef4444;
      }
    }
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Login() {
  const [form, setForm] = useState({ Email: "", Password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      if (res.data.Status === "OK") {
        const userData = {
          _id: res.data.Data.Id,
          ...res.data.Data.User
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userId", userData._id);
        window.dispatchEvent(new Event("userLogin"));
        
        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          timer: 1500,
          showConfirmButton: false
        });
        navigate("/");
      } else {
        Swal.fire("Error", res.data.Data || "Login failed", "error");
      }
    } catch (error) {
      const msg = error.response?.status === 401 ? "Invalid email or password" : "Server Error";
      Swal.fire("Login Failed", msg, "error");
    }
  };

  return (
    <LoginWrapper>
      <GlassCard>
        <BrandTitle>Welcome Back</BrandTitle>
        <p className="text-center text-muted mb-4 small">Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="Email"
              placeholder="Email Address"
              value={form.Email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <FaLock className="icon" />
            <input
              type="password"
              name="Password"
              placeholder="Password"
              value={form.Password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <LoginButton type="submit">
            LOGIN <FaArrowRight size={14} />
          </LoginButton>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted small">New to our platform? </span>
          <Link to="/register" className="text-danger fw-bold small text-decoration-none">
            CREATE ACCOUNT
          </Link>
        </div>
      </GlassCard>
    </LoginWrapper>
  );
}