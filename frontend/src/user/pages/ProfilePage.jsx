import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserBookings, deleteBooking } from "../../services/api";
import Swal from "sweetalert2";
import { Modal, Button, Table, Badge, Pagination, Card, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaCar, FaClock, FaCheckCircle, FaExclamationTriangle, 
  FaShieldAlt, FaSignOutAlt, FaHistory, FaMapMarkerAlt, 
  FaCalendarAlt, FaPrint, FaQrcode 
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  // 🎨 Professional Developer Theme
  const colors = {
    primary: "#2563eb",
    darkBlue: "#0f172a",
    lightBg: "#f8fafc",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444"
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchBookings(parsedUser._id);
  }, [navigate]);

  const fetchBookings = async (userId) => {
    try {
      setLoadingBookings(true);
      const res = await getUserBookings(userId);
      if (res.data.Status === "Ok") {
        setBookings(res.data.Data);
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  // 🖨️ Handle Print Logic
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice_${selectedBooking?.FirestoreId?.substring(0, 8)}`,
  });

  // ================= PAGINATION LOGIC =================
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  };

  const handleCancelBooking = (bookingId) => {
    Swal.fire({
      title: "Cancel Trip?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.danger,
      confirmButtonText: "Yes, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteBooking(bookingId);
        if (res.data.Status === "Ok") {
          Swal.fire("Cancelled", "Booking removed.", "success");
          fetchBookings(user._id);
        }
      }
    });
  };

  if (!user) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div style={{ backgroundColor: colors.lightBg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🔹 ENHANCED HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.primary} 100%)`, padding: "100px 0 120px 0" }}>
        <div className="container">
          <div className="d-flex align-items-center gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="position-relative">
              <div style={{ width: "100px", height: "100px", borderRadius: "25px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }} className="d-flex align-items-center justify-content-center text-white display-5 fw-bold shadow-lg border border-white border-opacity-25">
                {user.Name.charAt(0)}
              </div>
              <span className="position-absolute bottom-0 end-0 bg-success border border-white border-3 rounded-circle p-2" title="Active Account"></span>
            </motion.div>
            <div className="text-white">
              <h1 className="fw-bold mb-1">Hello, {user.Name}!</h1>
              <div className="d-flex gap-3 opacity-75 small">
                <span><FaCheckCircle className="me-1"/> Professional Profile</span>
                <span><FaCalendarAlt className="me-1"/> Member since 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "-60px" }}>
        {/* 🔹 QUICK STATS CARDS */}
        <Row className="mb-4 text-center">
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="border-0 shadow-sm rounded-4 p-3">
              <div className="text-primary mb-1 fw-bold small text-uppercase">Total Bookings</div>
              <h3 className="fw-bold mb-0">{bookings.length}</h3>
            </Card>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="border-0 shadow-sm rounded-4 p-3">
              <div className="text-success mb-1 fw-bold small text-uppercase">Paid Trips</div>
              <h3 className="fw-bold mb-0">{bookings.filter(b => b.Booking.payment_status === "Paid").length}</h3>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-3">
              <div className="text-warning mb-1 fw-bold small text-uppercase">Pending Payments</div>
              <h3 className="fw-bold mb-0">{bookings.filter(b => b.Booking.payment_status !== "Paid").length}</h3>
            </Card>
          </Col>
        </Row>

        <div className="row g-4">
          {/* 🔹 SIDEBAR */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{top: '20px'}}>
              <div className="p-4 bg-white">
                <div className="mb-4">
                   <h6 className="fw-bold text-muted small text-uppercase mb-3">Menu</h6>
                   <button className={`btn w-100 text-start rounded-3 mb-2 py-2 d-flex align-items-center gap-2 ${activeTab === 'bookings' ? 'bg-primary text-white shadow-sm' : 'btn-light'}`} onClick={() => setActiveTab('bookings')}>
                    <FaHistory /> My Bookings
                  </button>
                  <button className={`btn w-100 text-start rounded-3 mb-2 py-2 d-flex align-items-center gap-2 ${activeTab === 'password' ? 'bg-primary text-white shadow-sm' : 'btn-light'}`} onClick={() => setActiveTab('password')}>
                    <FaShieldAlt /> Security Settings
                  </button>
                </div>
                <div className="border-top pt-4">
                   <button className="btn btn-outline-danger w-100 rounded-3 d-flex align-items-center justify-content-center gap-2" onClick={() => { localStorage.clear(); navigate("/login"); }}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 MAIN CONTENT */}
          <div className="col-lg-9">
            {activeTab === "password" ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                <div className="bg-primary bg-opacity-10 text-primary mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
                    <FaShieldAlt size={35} />
                </div>
                <h4 className="fw-bold">Security Settings</h4>
                <div className="mx-auto mt-4" style={{maxWidth: '400px'}}>
                  <input type="password" Name="current" className="form-control rounded-3 mb-3" placeholder="Current Password" />
                  <input type="password" Name="new" className="form-control rounded-3 mb-4" placeholder="New Password" />
                  <Button variant="primary" className="w-100 rounded-3 py-2 fw-bold shadow-sm">Update Password</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="px-4 py-4 border-bottom d-flex justify-content-between align-items-center bg-white">
                  <h5 className="fw-bold mb-0">Booking History</h5>
                </div>
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light text-muted small text-uppercase">
                      <tr>
                        <th className="ps-4 border-0">Vehicle</th>
                        <th className="border-0 text-center">Date</th>
                        <th className="border-0 text-center">Total</th>
                        <th className="border-0 text-center">Status</th>
                        <th className="border-0 text-end pe-4">Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingBookings ? (
                        <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                      ) : currentBookings.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-5">No trips found.</td></tr>
                      ) : (
                        currentBookings.map((b) => (
                          <tr key={b.FirestoreId}>
                            <td className="ps-4 py-3">
                              <div className="d-flex align-items-center">
                                <img src={`http://localhost:5000/photos/${b.CarDetails?.carImg}`} width="75" height="50" className="rounded-3 shadow-sm me-3 object-fit-cover" alt="car" />
                                <div><div className="fw-bold text-dark">{b.CarDetails?.Brand}</div><small className="text-muted">{b.CarDetails?.Model}</small></div>
                              </div>
                            </td>
                            <td className="text-center fw-medium small">{b.Booking.pick_date}</td>
                            <td className="text-center fw-bold text-primary">₹{b.Booking.VehicleId_tarife}</td>
                            <td className="text-center">
                              <Badge bg={b.Booking.payment_status === "Paid" ? "success" : "warning"} className="rounded-pill px-3 py-2 fw-medium">
                                {b.Booking.payment_status}
                              </Badge>
                            </td>
                            <td className="text-end pe-4">
                              <div className="d-flex gap-2 justify-content-end">
                                <Button variant="light" size="sm" className="rounded-3 border px-3" onClick={() => { setSelectedBooking(b); setShowModal(true); }}>Details</Button>
                                {b.Booking.payment_status !== "Paid" && (
                                    <Button variant="primary" size="sm" className="rounded-3 px-3 shadow-sm fw-bold" onClick={() => navigate(`/payment/${b.FirestoreId}`, { state: { booking: b.Booking, vehicle: b.CarDetails, FirestoreId: b.FirestoreId } })}>Pay</Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* ================= UPDATED PAGINATION UI ================= */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center py-4 px-4 border-top bg-light">
                    <div className="text-muted small">
                      Showing <strong>{indexOfFirstBooking + 1}</strong> to{" "}
                      <strong>{Math.min(indexOfLastBooking, bookings.length)}</strong> of{" "}
                      <strong>{bookings.length}</strong>
                    </div>
                    <Pagination className="mb-0">
                      <Pagination.Prev disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} />
                      {[...Array(totalPages).keys()].map(n => (
                        <Pagination.Item key={n+1} active={n+1 === currentPage} onClick={() => paginate(n+1)}>
                          {n+1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} />
                    </Pagination>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 TRIP DETAILS & INVOICE MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="border-0">
        <Modal.Header closeButton className="border-0 px-4 pt-4 bg-white">
          <Modal.Title className="fw-bold text-dark">Reservation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-white">
          <div ref={invoiceRef}>
            <div className="p-5 bg-white mx-auto" style={{ width: "100%", color: "#1e293b" }}>
              <style type="text/css" media="print">
                {`
                  @page { size: A4; margin: 15mm; }
                  body { -webkit-print-color-adjust: exact; background: white !important; }
                  .modal-header, .modal-footer, .no-print { display: none !important; }
                `}
              </style>
              
              <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                <div>
                  <h2 className="fw-bold text-primary mb-1">INVOICE</h2>
                  <p className="text-muted small mb-0">Booking Reference: <strong>#{selectedBooking?.FirestoreId?.substring(0,8).toUpperCase()}</strong></p>
                  <p className="text-muted small">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-end">
                  <h4 className="fw-bold text-dark mb-0">LUX Car Rental </h4>
                  <p className="small text-muted mb-0">Premium Vehicle Rentals</p>
                  <p className="small text-muted mb-0">Bharuch, Gujarat, IN</p>
                </div>
              </div>

              <Row className="mb-4">
                <Col xs={7}>
                  <h6 className="text-muted small text-uppercase fw-bold mb-3">Customer Information</h6>
                  <p className="mb-1 fw-bold h6">{user?.Name}</p>
                  <p className="small text-muted mb-1">{user?.Email}</p>
                  <p className="small text-muted">{selectedBooking?.Booking?.Pic_address}</p>
                </Col>
                <Col xs={5} className="text-end">
                  <div className="p-3 rounded-4 bg-light text-center border">
                    <FaQrcode size={60} className="text-dark mb-2" />
                    <p className="small text-muted mb-0" style={{fontSize: '10px'}}>Scan to verify booking</p>
                  </div>
                </Col>
              </Row>

              <Table borderless className="mb-4">
                <thead className="bg-light border-bottom border-top">
                  <tr>
                    <th className="py-3 ps-3">Vehicle Details</th>
                    <th className="py-3 text-center">Pickup Date</th>
                    <th className="py-3 text-end pe-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-bottom">
                    <td className="py-4 ps-3">
                      <h6 className="fw-bold mb-1">{selectedBooking?.CarDetails?.Brand} {selectedBooking?.CarDetails?.Model}</h6>
                      <div className="small text-muted">No: {selectedBooking?.CarDetails?.VehicleNumber}</div>
                      <div className="small text-muted">Fuel: {selectedBooking?.CarDetails?.FuelType} | {selectedBooking?.CarDetails?.Type}</div>
                    </td>
                    <td className="py-4 text-center align-middle">{selectedBooking?.Booking?.pick_date}</td>
                    <td className="py-4 text-end pe-3 align-middle fw-bold">₹{selectedBooking?.Booking?.VehicleId_tarife}</td>
                  </tr>
                </tbody>
              </Table>

              <div className="d-flex justify-content-end">
                <div className="col-md-5">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Status:</span>
                    <span className={`fw-bold ${selectedBooking?.Booking?.payment_status === "Paid" ? 'text-success' : 'text-warning'}`}>{selectedBooking?.Booking?.payment_status}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2">
                    <h5 className="fw-bold">Total Fair:</h5>
                    <h5 className="fw-bold text-primary">₹{selectedBooking?.Booking?.VehicleId_tarife}</h5>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 text-center border-top">
                <p className="small text-muted">Thank you for choosing Global Collection. Have a safe journey!</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4 bg-white">
          <Button variant="primary" className="rounded-3 px-4 d-flex align-items-center gap-2 fw-bold" onClick={handlePrint}>
            <FaPrint /> Download Invoice (A4)
          </Button>
          <Button variant="danger" className="rounded-3 px-4 d-flex align-items-center gap-2" disabled={selectedBooking?.Booking?.payment_status === "Paid"} onClick={() => { setShowModal(false); handleCancelBooking(selectedBooking.FirestoreId); }}>
            <FaExclamationTriangle /> Cancel Trip
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}