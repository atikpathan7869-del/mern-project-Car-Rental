import { useState } from "react";
import { registerUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import styled from "styled-components";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

// ================= STYLED COMPONENTS =================
const RegisterWrapper = styled.div`
  min-height: 100vh;
  /* Premium Online Car Background */
  background: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)),
    url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 30px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  color: #1e293b;
  font-weight: 800;
  text-align: center;
  margin-bottom: 5px;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: 18px;
    transform: translateY(-50%);
    color: #94a3b8;
    transition: 0.3s;
  }

  input, textarea {
    width: 100%;
    padding: 14px 15px 14px 50px;
    border-radius: 15px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    transition: all 0.3s ease;
    font-size: 0.95rem;

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

  textarea {
    padding-top: 15px;
  }
`;

const ErrorText = styled.small`
  color: #ef4444;
  font-size: 0.75rem;
  margin-left: 10px;
  font-weight: 500;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  margin-top: 15px;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ Name: "", Email: "", Password: "", Phone: "", Address: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!form.Name.trim()) temp.Name = "Full Name is required";
    if (!form.Email) temp.Email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.Email)) temp.Email = "Invalid email format";
    if (!form.Password) temp.Password = "Password is required";
    else if (form.Password.length < 5) temp.Password = "Min 5 characters required";
    if (!form.Phone) temp.Phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.Phone)) temp.Phone = "Must be 10 digits";
    if (!form.Address.trim()) temp.Address = "Address is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await registerUser(form);
      if (res.data.Status === "OK") {
        Swal.fire({
          title: "Success! 🎉",
          text: "Account created successfully",
          icon: "success",
          confirmButtonColor: "#ef4444",
        }).then(() => navigate("/login"));
      }
    } catch (error) {
      const msg = error.response?.data?.Data || "Registration failed";
      Swal.fire({ title: "Oops!", text: msg, icon: "error", confirmButtonColor: "#ef4444" });
    }
  };

  return (
    <RegisterWrapper>
      <GlassCard>
        <Title>Create Account</Title>
        <Subtitle>Join our car rental community today</Subtitle>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <FaUser className="icon" />
            <input type="text" name="Name" placeholder="Full Name" value={form.Name} onChange={handleChange} />
            {errors.Name && <ErrorText>{errors.Name}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <FaEnvelope className="icon" />
            <input type="email" name="Email" placeholder="Email Address" value={form.Email} onChange={handleChange} />
            {errors.Email && <ErrorText>{errors.Email}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <FaLock className="icon" />
            <input type="password" name="Password" placeholder="Create Password" value={form.Password} onChange={handleChange} />
            {errors.Password && <ErrorText>{errors.Password}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <FaPhone className="icon" />
            <input type="text" name="Phone" placeholder="Phone Number" value={form.Phone} onChange={handleChange} />
            {errors.Phone && <ErrorText>{errors.Phone}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <FaMapMarkerAlt className="icon" style={{ top: '25px' }} />
            <textarea name="Address" placeholder="Your Address" rows="2" value={form.Address} onChange={handleChange} />
            {errors.Address && <ErrorText>{errors.Address}</ErrorText>}
          </InputGroup>

          <RegisterButton type="submit">GET STARTED</RegisterButton>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted small">Already a member? </span>
          <Link to="/login" className="text-danger fw-bold small text-decoration-none hover-underline">
            LOGIN HERE
          </Link>
        </div>
      </GlassCard>
    </RegisterWrapper>
  );
}