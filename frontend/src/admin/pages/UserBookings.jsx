import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllBookings } from "../../services/api";
import { Modal, Button, Badge, Pagination, Table } from "react-bootstrap";
// Saare icons jo code mein use huye hain unhe yahan import kiya gaya hai
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaInfoCircle, 
  FaHashtag, 
  FaUserCircle, 
  FaCar, 
  FaGasPump,
  FaUsers
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserBookings() {
  const { userId } = useParams();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5; 

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUserBookings();
  }, [userId]);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      if (res.data.Status === "Ok" || res.data.Status === "OK") {
        const all = res.data.Data || [];
        const userBookings = all.filter((b) => b.Booking?.CustomerId === userId);
        setBookings(userBookings);
        
        if (userBookings.length > 0) {
          setUserName(userBookings[0].UserDetails?.Name || "");
        }
      }
    } catch (err) {
      console.error("Error loading user bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= PAGINATION LOGIC =================
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  return (
    <div className="container my-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-primary mb-1">
            {userName ? `${userName}'s Bookings` : "User Bookings"}
          </h3>
          <p className="text-muted small">Managing all rental history for this customer</p>
        </div>
        <Link to="/admin/bookings" className="btn btn-outline-secondary btn-sm rounded-pill px-3 shadow-sm">
          ← Back to All Bookings
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Fetching records...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="alert alert-info text-center border-0 shadow-sm rounded-4 py-5">
          <FaCar size={40} className="mb-3 opacity-50" />
          <h4>No Bookings Found</h4>
          <p className="mb-0 text-muted">This user hasn't made any bookings yet.</p>
        </div>
      ) : (
        <>
          {/* Bookings Table */}
          <div className="table-responsive shadow-sm rounded-4 bg-white overflow-hidden border">
            <Table hover align="middle" className="mb-0">
              <thead className="table-dark text-center border-0">
                <tr>
                  <th className="py-3 fw-medium">Vehicle</th>
                  <th className="py-3 fw-medium">Pickup Date</th>
                  <th className="py-3 fw-medium">Total Price</th>
                  <th className="py-3 fw-medium">Status</th>
                  <th className="py-3 fw-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((b) => (
                  <tr key={b.FirestoreId} className="text-center">
                    <td className="ps-4 py-3 text-start">
                      <div className="d-flex align-items-center">
                        <img
                          src={`http://localhost:5000/photos/${b.CarDetails?.carImg}`}
                          alt="car"
                          style={{ width: "75px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                          className="me-3 border shadow-sm"
                        />
                        <div>
                          <strong className="d-block text-dark">{b.CarDetails?.Brand} {b.CarDetails?.Model}</strong>
                          <span className="text-muted" style={{ fontSize: '11px' }}>{b.CarDetails?.VehicleNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small fw-medium"><FaCalendarAlt className="me-1 text-muted"/> {b.Booking?.pick_date}</div>
                    </td>
                    <td className="fw-bold text-primary">₹{b.Booking?.VehicleId_tarife}</td>
                    <td>
                      <Badge bg={b.Booking?.payment_status === "Paid" ? "success" : "warning"} className="rounded-pill px-3 py-2 fw-normal text-capitalize">
                        {b.Booking?.payment_status}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="light" size="sm" className="rounded-pill border shadow-sm px-3 fw-medium" onClick={() => handleViewDetails(b)}>
                        <FaInfoCircle className="me-1 text-primary" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination UI - Iska dikhna tabhi start hoga jab total bookings 5 se zyada hongi */}
          {totalPages > 1 && (
            <div className="d-flex flex-column align-items-center mt-4">
              <Pagination className="shadow-sm">
                <Pagination.Prev disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} />
                {[...Array(totalPages).keys()].map(n => (
                  <Pagination.Item key={n+1} active={n+1 === currentPage} onClick={() => paginate(n+1)}>
                    {n+1}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} />
              </Pagination>
              <p className="text-muted small">Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, bookings.length)} of {bookings.length} results</p>
            </div>
          )}
        </>
      )}

      {/* ================= BOOKING DETAILS MODAL ================= */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="border-0 shadow-lg">
        <Modal.Header closeButton className="border-0 pb-0 bg-white">
          <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
            <FaCar className="text-primary" /> Detailed Summary
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-white">
          {selectedBooking && (
            <div className="row g-4">
              {/* Left Side */}
              <div className="col-md-5">
                <div className="position-relative mb-4">
                  <img 
                    src={`http://localhost:5000/photos/${selectedBooking.CarDetails?.carImg}`} 
                    alt="Car" 
                    className="img-fluid rounded-4 shadow-sm border" 
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  <Badge bg="dark" className="position-absolute bottom-0 end-0 m-2 px-3 py-2 opacity-75">
                    {selectedBooking.CarDetails?.Type}
                  </Badge>
                </div>
                
                <div className="card border-0 bg-light rounded-4 p-3 shadow-sm">
                  <h6 className="fw-bold border-bottom pb-2 small text-uppercase text-muted">Customer Info</h6>
                  <div className="d-flex align-items-center mb-3 mt-1">
                    <div className="bg-white rounded-circle p-1 shadow-sm me-3 border">
                      {selectedBooking.UserDetails?.ProfilePic ? (
                         <img 
                           src={`http://localhost:5000/photos/${selectedBooking.UserDetails.ProfilePic}`} 
                           width="50" height="50" className="rounded-circle" style={{objectFit: 'cover'}} alt="user"
                         />
                      ) : (
                        <FaUserCircle size={45} className="text-secondary opacity-50" />
                      )}
                    </div>
                    <div>
                      <div className="fw-bold text-dark lh-1 mb-1">{selectedBooking.UserDetails?.Name}</div>
                      <div className="text-muted" style={{fontSize: '11px'}}>{selectedBooking.UserDetails?.Email}</div>
                    </div>
                  </div>
                  <div className="small bg-white p-2 rounded-3 border-start border-primary border-4 shadow-sm">
                    <span className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>PICKUP POINT</span>
                    <span className="text-dark small"><FaMapMarkerAlt className="text-danger me-1"/> {selectedBooking.Booking?.Pic_address || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="col-md-7">
                <div className="bg-primary bg-opacity-10 p-3 rounded-4 border border-primary border-opacity-10 mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '10px' }}>Booking ID</span>
                      <h6 className="fw-bold text-primary mb-0"><FaHashtag className="me-1 small" />{selectedBooking.FirestoreId?.toUpperCase()}</h6>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                   <div className="col-6">
                      <label className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Vehicle Name</label>
                      <span className="fw-bold text-dark d-block">{selectedBooking.CarDetails?.Brand} {selectedBooking.CarDetails?.Model}</span>
                   </div>
                   <div className="col-6">
                      <label className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Registration No.</label>
                      <span className="badge bg-secondary text-white">{selectedBooking.CarDetails?.VehicleNumber}</span>
                   </div>
                   <div className="col-6">
                      <label className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}><FaGasPump className="me-1"/> Fuel Type</label>
                      <span className="text-dark fw-medium d-block">{selectedBooking.CarDetails?.FuelType || "Petrol"}</span>
                   </div>
                   <div className="col-6">
                      <label className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}><FaUsers className="me-1"/> Capacity</label>
                      <span className="text-dark fw-medium d-block">{selectedBooking.CarDetails?.SeatingCapacity || "5"} Seats</span>
                   </div>
                </div>

                <div className="p-3 bg-light rounded-4 border">
                  <h6 className="fw-bold small mb-3 text-uppercase text-muted border-bottom pb-2">Billing Details</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Daily Base Rent</span>
                    <span className="fw-bold text-dark">₹{selectedBooking.CarDetails?.PricePerDay}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Extra Distance Charges</span>
                    <span className="fw-bold text-dark">₹{selectedBooking.CarDetails?.PricePerKm}/Km</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <span className="fw-bold text-dark">Net Amount:</span>
                    <span className="fw-bold text-primary h4 mb-0">₹{selectedBooking.Booking?.VehicleId_tarife}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light p-3 justify-content-center">
          <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>
            Close Details
          </Button>
          <Button variant="primary" className="rounded-pill px-4 shadow-sm fw-bold d-flex align-items-center gap-2">
             <FaMoneyBillWave /> Mark as Paid
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .table thead th { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
        .pagination .page-item.active .page-link { background-color: #0d6efd; border-color: #0d6efd; }
        .pagination .page-link { color: #495057; border-radius: 6px; margin: 0 2px; }
        .rounded-4 { border-radius: 1rem !important; }
      `}</style>

    </div>
  );
}