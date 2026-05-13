import { useEffect, useState } from "react";
import { getAdminById, updateAdmin } from "../../services/api";
import axios from "axios"; // Password change ke liye direct call ya api.js mein add karein
import Swal from "sweetalert2";
import styled from "styled-components";
import { Card, Button, Form, Spinner, Row, Col, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/* ================= THEME STYLES ================= */
const ProfileWrapper = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 50px 20px;
`;

const GlassCard = styled(Card)`
  border: none;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
  overflow: hidden;
  background: #ffffff;
`;

const ProfileSidebar = styled.div`
  background: #0f172a;
  color: white;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  
  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 30px;
    border: 4px solid rgba(255, 255, 255, 0.2);
  }

  label {
    position: absolute;
    bottom: -10px;
    right: -10px;
    background: #f59e0b;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    &:hover { background: #d97706; }
  }
`;

export default function AdminProfile() {
  const [admin, setAdmin] = useState({ Name: "", Email: "", Role: "Administrator", ProfileImg: "", _id: "", FirestoreId: "" });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => { loadAdminProfile(); }, []);

  // AdminProfile.jsx ke loadAdminProfile mein ye logic verify karein:

  const loadAdminProfile = async () => {
    try {
      setLoading(true);
      const storedId = localStorage.getItem("adminFirestoreId");

      if (!storedId) {
        // Agar yahan error aata hai, iska matlab Login mein storage sahi nahi hua
        Swal.fire("Session Error", "Please login again", "error");
        setLoading(false);
        return;
      }

      const res = await getAdminById(storedId);
      if (res.data?.Status === "Ok") {
        // Agar backend { Data: { Admin: { ... }, FirestoreId: '...' } } bhej raha hai
        const resultData = res.data.Data;
        const finalAdmin = resultData.Admin ? resultData.Admin : resultData;

        setAdmin({
          ...finalAdmin,
          FirestoreId: resultData.FirestoreId || storedId
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setAdmin((prev) => ({ ...prev, ProfileImg: event.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!/^[A-Za-z ]{3,30}$/.test(admin.Name)) return Swal.fire("Invalid Name", "Please enter a valid name.", "warning");

    try {
      const res = await updateAdmin(admin.FirestoreId, admin);
      if (res.data.Status === "Ok") {
        Swal.fire("Success", "Profile Updated Successfully", "success");
        setEditing(false);
      }
    } catch (err) {
      Swal.fire("Error", "Update Failed", "error");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPass || !newPass || !confirmPass) return Swal.fire("Fields Missing", "Fill all passwords", "warning");
    if (newPass !== confirmPass) return Swal.fire("Error", "Confirm password mismatch", "error");

    try {
      // Backend Change Password Endpoint ko hit karein
      const res = await axios.put(`http://localhost:5000/admin/change-password/${admin._id}`, {
        oldPassword: oldPass,
        newPassword: newPass
      });

      if (res.data.Status === "Ok") {
        Swal.fire("Secured", "Password changed successfully", "success");
        setOldPass(""); setNewPass(""); setConfirmPass("");
      } else {
        Swal.fire("Failed", res.data.Data, "error");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.Data || "Server Error", "error");
    }
  };

  if (loading) return (
    <ProfileWrapper className="d-flex align-items-center justify-content-center">
      <Spinner animation="grow" variant="primary" />
    </ProfileWrapper>
  );

  return (
    <ProfileWrapper>
      <div className="container">
        <GlassCard className="mx-auto" style={{ maxWidth: "900px" }}>
          <Row className="g-0">
            <Col md={5}>
              <ProfileSidebar>
                <ImageWrapper>
                  <img
                    src="https://ui-avatars.com/api/?name=Atik+Pathan&background=f59e0b&color=fff"
                    alt="Admin"
                  />                  {editing && (
                    <label htmlFor="file-input">
                      <i className="bi bi-camera-fill text-white"></i>
                      <input id="file-input" type="file" hidden onChange={handleImageChange} accept="image/*" />
                    </label>
                  )}
                </ImageWrapper>
                <h3 className="fw-bold mb-1">{admin.Name || "Atik Pathan"}</h3>
                <Badge bg="warning" className="text-dark mb-4 px-3 py-2 rounded-pill">
                  <i className="bi bi-shield-check me-2"></i>{admin.Role}
                </Badge>
                <p className="opacity-50 small px-4">Authorized access only. All changes are logged for security audits.</p>
              </ProfileSidebar>
            </Col>

            <Col md={7}>
              <Card.Body className="p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold text-dark mb-0">Account Settings</h4>
                  {!editing ? (
                    <Button variant="outline-primary" className="btn-sm rounded-pill px-3" onClick={() => setEditing(true)}>
                      <i className="bi bi-pencil-square me-2"></i>Edit Profile
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                      <Button variant="success" className="btn-sm rounded-pill px-3" onClick={handleSave}>Save</Button>
                      <Button variant="light" className="btn-sm rounded-pill px-3" onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                  )}
                </div>

                <Row className="mb-4">
                  <Col sm={6} className="mb-3">
                    <label className="text-muted small fw-bold text-uppercase">Full Name</label>
                    <div className="fw-semibold py-2">Atik Pathan</div>
                  </Col>
                  <Col sm={6} className="mb-3">
                    <label className="text-muted small fw-bold text-uppercase">Email Address</label>
                    <div className="fw-semibold py-2">{admin.Email}</div>
                  </Col>
                </Row>

                <hr className="my-4 opacity-10" />

                <h6 className="fw-bold text-dark mb-3"><i className="bi bi-key me-2 text-warning"></i>Security Credentials</h6>
                <Row className="g-2">
                  <Col md={12}>
                    <Form.Control
                      type="password"
                      placeholder="Current Password"
                      className="bg-light border-0 mb-2"
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="password"
                      placeholder="New Password"
                      className="bg-light border-0"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="password"
                      placeholder="Confirm New"
                      className="bg-light border-0"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </Col>
                </Row>
                <Button variant="dark" className="w-100 mt-3 rounded-3 py-2 fw-bold shadow-sm" onClick={handlePasswordChange}>
                  Update Security Credentials
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </GlassCard>
      </div>
    </ProfileWrapper>
  );
}