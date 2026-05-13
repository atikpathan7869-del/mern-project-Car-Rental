import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import Breadcrumbs from "../../layout/Breadcrumbs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/* ================= PREMIUM COLOR PALETTE ================= */
const theme = {
  primary: "#0f172a",    // Deep Navy (Sidebar)
  secondary: "#1e293b",  // Lighter Navy
  accent: "#f59e0b",     // Amber/Gold (Highlight)
  success: "#10b981",    // Emerald (Available)
  danger: "#ef4444",     // Rose (Booked/Logout)
  textMain: "#f8fafc",   // Off White
  textMuted: "#94a3b8",  // Grayish
  bodyBg: "#f1f5f9",     // Light Gray Blue
};

/* ================= STYLED COMPONENTS ================= */

const Sidebar = styled.aside`
  background-color: ${theme.primary};
  width: ${p => (p.open ? "260px" : "85px")};
  height: 100vh;
  position: fixed;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
`;

const Brand = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 25px;
  background: ${theme.secondary};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  white-space: nowrap;
`;

const NavLinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 22px;
  margin: 4px 15px;
  border-radius: 12px;
  color: ${p => (p.active ? theme.accent : theme.textMuted)} !important;
  background: ${p => (p.active ? "rgba(245, 158, 11, 0.1)" : "transparent")};
  text-decoration: none !important;
  transition: 0.2s ease-in-out;

  &:hover {
    color: ${theme.textMain} !important;
    background: rgba(255, 255, 255, 0.05);
  }

  i {
    font-size: 1.25rem;
    min-width: 30px;
  }
`;

const LogoutButton = styled.button`
  width: calc(100% - 30px);
  margin: 0 15px;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(239, 68, 68, 0.1);
  color: ${theme.danger} !important;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.danger};
    color: white !important;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  i {
    font-size: 1.25rem;
    min-width: 30px;
  }
`;

const Header = styled.header`
  height: 70px;
  background: white;
  position: fixed;
  top: 0;
  right: 0;
  left: ${p => (p.open ? "260px" : "85px")};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  transition: all 0.3s ease;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 768px) { left: 0; }
`;

const MainContainer = styled.div`
  margin-top: 70px;
  margin-left: ${p => (p.open ? "260px" : "85px")};
  background-color: ${theme.bodyBg};
  min-height: calc(100vh - 70px);
  padding: 30px;
  transition: all 0.3s ease;

  @media (max-width: 768px) { margin-left: 0; }
`;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "Ready to leave the dashboard?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: theme.danger,
      confirmButtonText: "Logout Now",
      borderRadius: "15px",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: "flex", backgroundColor: theme.bodyBg }}>
      {/* SIDEBAR */}
      <Sidebar open={isSidebarOpen}>
        <Brand>
          <i className="bi bi-car-front-fill fs-3 text-warning me-3"></i>
          {isSidebarOpen && <span className="fw-bold text-white fs-5">LUXE RENTAL</span>}
        </Brand>

        <div className="mt-4 flex-grow-1">
          <MenuLink to="/admin/Deshboard" icon="bi bi-grid-1x2" label="Analytics" open={isSidebarOpen} current={location.pathname} />
          <MenuLink to="/admin/cars" icon="bi bi-truck-flatbed" label="Fleet Manager" open={isSidebarOpen} current={location.pathname} />
          <MenuLink to="/admin/bookings" icon="bi bi-calendar-event" label="Bookings" open={isSidebarOpen} current={location.pathname} />
          <MenuLink to="/admin/users" icon="bi bi-person-lines-fill" label="Customers" open={isSidebarOpen} current={location.pathname} />
          <MenuLink to="/admin/profile" icon="bi bi-sliders" label="Settings" open={isSidebarOpen} current={location.pathname} />
        </div>

        <div className="p-3 mb-3 mt-auto">
          <LogoutButton onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            {isSidebarOpen && <span>Sign Out</span>}
          </LogoutButton>
        </div>
      </Sidebar>

      {/* MAIN SECTION */}
      <div className="w-100">
        <Header open={isSidebarOpen}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light rounded-circle shadow-sm" onClick={toggleSidebar}>
              <i className={`bi ${isSidebarOpen ? "bi-chevron-left" : "bi-list"} fs-5`}></i>
            </button>
            <h5 className="m-0 fw-bold text-dark d-none d-md-block">Operations Hub</h5>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="text-end d-none d-sm-block">
              <div className="fw-bold text-dark">Atik Pathan</div>
              <div className="text-muted small">System Administrator</div>
            </div>
            <img 
              src="https://ui-avatars.com/api/?name=Atik+Pathan&background=f59e0b&color=fff" 
              alt="profile" 
              className="rounded-circle border" 
              width="45" 
            />
          </div>
        </Header>

        <MainContainer open={isSidebarOpen}>
          <div className="container-fluid p-0">
            <div className="mb-4">
              <Breadcrumbs />
            </div>
            <div className="bg-white rounded-4 shadow-sm p-4 min-vh-100">
              <Outlet />
            </div>
          </div>
          
          <footer className="text-center py-5 text-muted small">
            &copy; 2026 <b>Luxe Rental Management</b>. All rights reserved.
          </footer>
        </MainContainer>
      </div>
    </div>
  );
}

function MenuLink({ to, icon, label, open, current }) {
  const isActive = current === to;
  return (
    <NavLinkStyled to={to} active={isActive ? 1 : 0}>
      <i className={icon}></i>
      {open && <span>{label}</span>}
    </NavLinkStyled>
  );
}