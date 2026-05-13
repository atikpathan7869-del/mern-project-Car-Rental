import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaHome, FaInfoCircle, FaCarSide, FaBook, FaUser,
  FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTools, FaCaretDown
} from "react-icons/fa";
import styled from "styled-components";
import { Dropdown } from "react-bootstrap";

const NavContainer = styled.nav`
  background: rgba(15, 23, 42, 0.98) !important;
  backdrop-filter: blur(12px);
  border-bottom: 2px solid #f59e0b;
  padding: 12px 0;
`;

const NavLinkStyled = styled(NavLink)`
  color: #cbd5e1 !important;
  display: flex;
  align-items: center;
  padding: 8px 12px !important;
  margin: 0 5px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  text-decoration: none !important;
  position: relative;

  &.active {
    color: #f59e0b !important;
    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 12px;
      right: 12px;
      height: 2px;
      background: #f59e0b;
    }
  }

  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    margin-right: 8px;
  }
`;

const UserAvatar = styled.div`
  width: 35px;
  height: 35px;
  background: #f59e0b;
  color: #0f172a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  border: 2px solid rgba(255,255,255,0.2);
`;

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        setIsLoggedIn(true);
        setRole(parsed.Role || "user");
        setUserName(parsed.Name || "User");
      } else {
        setIsLoggedIn(false);
        setRole("");
        setUserName("");
      }
    };
    checkLogin();
    window.addEventListener("userLogin", checkLogin);
    window.addEventListener("userLogout", checkLogin);
    return () => {
      window.removeEventListener("userLogin", checkLogin);
      window.removeEventListener("userLogout", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole("");
    window.dispatchEvent(new Event("userLogout"));
    navigate("/");
  };

  return (
    <NavContainer className="navbar navbar-expand-lg navbar-dark sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png"
            alt="Logo"
            style={{ height: "40px", marginRight: "10px", filter: "brightness(0) invert(1)" }}
          />
          <span className="fw-bold fs-3 text-white">
            CAR<span style={{ color: "#f59e0b" }}>RENTAL</span>
          </span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Nav Links */}
            <li className="nav-item"><NavLinkStyled to="/"><FaHome /> Home</NavLinkStyled></li>
            <li className="nav-item"><NavLinkStyled to="/about"><FaInfoCircle /> About</NavLinkStyled></li>
            <li className="nav-item"><NavLinkStyled to="/vehicles"><FaCarSide /> Vehicles</NavLinkStyled></li>
            
            {isLoggedIn && role === "user" && (
              <li className="nav-item"><NavLinkStyled to="/booking"><FaBook /> My Bookings</NavLinkStyled></li>
            )}

            {isLoggedIn && role === "admin" && (
              <li className="nav-item">
                <Link className="btn btn-outline-warning btn-sm fw-bold rounded-pill px-3 ms-2" to="/admin">
                  <FaTools className="me-1" /> Admin
                </Link>
              </li>
            )}

            {/* Auth/User Section */}
            {!isLoggedIn ? (
              <div className="d-flex align-items-center ms-lg-3">
                <NavLinkStyled to="/login"><FaSignInAlt /> Login</NavLinkStyled>
                <Link className="btn btn-warning fw-bold rounded-pill px-4 ms-2 text-dark" to="/register">
                  Register
                </Link>
              </div>
            ) : (
              <Dropdown className="ms-lg-4">
                <Dropdown.Toggle as="div" className="d-flex align-items-center cursor-pointer" style={{ cursor: 'pointer' }}>
                  <UserAvatar>{userName.charAt(0).toUpperCase()}</UserAvatar>
                  <div className="d-none d-lg-block">
                    <span className="text-white fw-semibold small d-block" style={{ lineHeight: 1 }}>{userName}</span>
                    <span className="text-warning extra-small" style={{ fontSize: '10px' }}>{role.toUpperCase()}</span>
                  </div>
                  <FaCaretDown className="text-muted ms-2" />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="shadow border-0 mt-2 bg-dark">
                  <Dropdown.Item as={Link} to="/profile" className="text-white py-2">
                    <FaUser className="me-2 text-warning" /> My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider className="bg-secondary" />
                  <Dropdown.Item onClick={handleLogout} className="text-danger py-2">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </ul>
        </div>
      </div>
    </NavContainer>
  );
}