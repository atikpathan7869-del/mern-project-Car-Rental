import { useEffect, useState } from "react";
import { getAllBookings, deleteBooking, updateBooking } from "../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Table, Badge, Button, Form, InputGroup, Pagination, Card, Spinner } from "react-bootstrap";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

/* ================= THEME STYLES ================= */
const PageWrapper = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 30px;
`;

const PremiumCard = styled(Card)`
  border: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  overflow: hidden;
`;

const LuxuryBadge = styled(Badge)`
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { opacity: 0.8; transform: scale(1.05); }
  
  background-color: ${props => 
    props.status === "Paid" ? "#10b981" : 
    props.status === "Pending" ? "#f59e0b" : 
    props.status === "Cancelled" ? "#ef4444" : 
    props.status === "Completed" ? "#2563eb" : "#64748b"} !important;
`;

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      if (res.data.Status === "Ok") {
        const formatted = res.data.Data.map((b) => ({
          ...b.Booking,
          FirestoreId: b.FirestoreId,
          CarDetails: b.CarDetails,
          UserDetails: b.UserDetails
        }));
        setBookings(formatted);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ✅ Calculation: Ensures numeric conversion to fix "26000" stuck issue
  const totalRevenue = bookings
    .filter(b => b.payment_status === "Paid" || b.payment_status === "Completed")
    .reduce((acc, curr) => acc + (Number(curr.VehicleId_tarife) || 0), 0);

  const pendingCount = bookings.filter(b => b.payment_status === "Pending").length;

  // ✅ Status Change Logic (Fixed for UI sync)
  const handleStatusChange = async (booking) => {
    const { value: newStatus } = await Swal.fire({
      title: "Update Payment Status",
      text: `Currently: ${booking.payment_status}`,
      input: "select",
      inputOptions: { 
        Pending: "Pending", 
        Paid: "Paid", 
        Completed: "Completed", 
        Cancelled: "Cancelled" 
      },
      inputValue: booking.payment_status,
      confirmButtonColor: "#0f172a",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You must select a status!";
      }
    });

    if (newStatus && newStatus !== booking.payment_status) {
      try {
        Swal.fire({ title: "Updating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        // Call API
        const response = await updateBooking(booking.FirestoreId, { payment_status: newStatus });
        
        if (response.data.Status === "Ok") {
          Swal.fire({ icon: "success", title: "Status Updated", timer: 1000, showConfirmButton: false });
          // 🔄 Reload all data to refresh Revenue & Stats
          loadBookings();
        } else {
          Swal.fire("Error", "Could not update status", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Server connection failed", "error");
      }
    }
  };

  const filtered = bookings.filter((b) => {
    const searchStr = `${b.UserDetails?.Name} ${b.CarDetails?.Brand} ${b.CarDetails?.Model} ${b.FirestoreId}`.toLowerCase();
    return searchStr.includes(search.toLowerCase()) && (statusFilter === "All" || b.payment_status === statusFilter);
  });

  const currentRecords = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  return (
    <PageWrapper>
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">Reservation Ledger</h2>
          <p className="text-muted mb-0">Overview of all active and past vehicle rentals.</p>
        </div>
        <Link to="/admin/Adminpayments" 
          className="btn text-white px-4 py-2 rounded-pill shadow-sm fw-bold d-flex align-items-center" 
          style={{ backgroundColor: "#0f172a", border: "none" }}>
          <i className="bi bi-receipt-cutoff me-2"></i> Audit Payments
        </Link>
      </div>

      {/* STATS ROW */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <PremiumCard className="bg-white border-start border-4 border-success">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted small fw-bold text-uppercase">Total Revenue (Paid)</h6>
                  <h2 className="fw-bold mb-0">₹{totalRevenue.toLocaleString()}</h2>
                </div>
                <div className="rounded-circle bg-success bg-opacity-10 p-3">
                  <i className="bi bi-cash-stack text-success h3 mb-0"></i>
                </div>
              </div>
            </Card.Body>
          </PremiumCard>
        </div>
        <div className="col-md-4">
          <PremiumCard className="bg-dark text-white">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-white-50 small fw-bold text-uppercase">Pending Orders</h6>
                  <h2 className="fw-bold mb-0 text-warning">{pendingCount}</h2>
                </div>
                <div className="rounded-circle bg-white bg-opacity-10 p-3">
                  <i className="bi bi-hourglass-split text-white h3 mb-0"></i>
                </div>
              </div>
            </Card.Body>
          </PremiumCard>
        </div>
        <div className="col-md-4">
          <PremiumCard className="bg-white">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted small fw-bold text-uppercase">Total Fleet Usage</h6>
                  <h2 className="fw-bold mb-0 text-dark">{bookings.length}</h2>
                </div>
                <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                  <i className="bi bi-calendar-check text-primary h3 mb-0"></i>
                </div>
              </div>
            </Card.Body>
          </PremiumCard>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <PremiumCard className="mb-4 bg-white">
        <Card.Body className="p-3">
          <div className="row align-items-center">
            <div className="col-md-7">
              <InputGroup className="bg-light rounded-3 overflow-hidden border-0">
                <InputGroup.Text className="bg-light border-0"><i className="bi bi-search text-muted"></i></InputGroup.Text>
                <Form.Control
                  className="bg-light border-0 shadow-none py-2"
                  placeholder="Search client, car brand, or ID..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </InputGroup>
            </div>
            <div className="col-md-5 d-flex gap-2">
              <Form.Select
                className="rounded-3 border-light shadow-none"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
              <Button onClick={loadBookings} variant="light" className="rounded-3 border"><i className="bi bi-arrow-clockwise"></i></Button>
            </div>
          </div>
        </Card.Body>
      </PremiumCard>

      {/* DATA TABLE */}
      <PremiumCard>
        <div className="table-responsive">
          <Table hover align="middle" className="mb-0 custom-table">
            <thead style={{ backgroundColor: "#f1f5f9" }}>
              <tr>
                <th className="ps-4 py-3 text-muted small fw-bold">VEHICLE</th>
                <th className="py-3 text-muted small fw-bold">CLIENT</th>
                <th className="py-3 text-muted small fw-bold">SCHEDULE</th>
                <th className="py-3 text-muted small fw-bold">FARE</th>
                <th className="py-3 text-center text-muted small fw-bold">STATUS (Click to Edit)</th>
                <th className="py-3 text-end pe-4 text-muted small fw-bold">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><Spinner animation="grow" variant="warning" /></td></tr>
              ) : currentRecords.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">No reservations found.</td></tr>
              ) : (
                currentRecords.map((b) => (
                  <tr key={b.FirestoreId} className="border-bottom border-light">
                    <td className="ps-4 py-4">
                      <div className="d-flex align-items-center">
                        <img
                          src={`http://localhost:5000/photos/${b.CarDetails?.carImg}`}
                          width="80" height="50"
                          className="rounded-3 object-fit-cover me-3 shadow-sm border border-light"
                          alt="car"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80x50?text=No+Img"; }}
                        />
                        <div>
                          <div className="fw-bold text-dark small">{b.CarDetails?.Brand}</div>
                          <div className="text-muted tiny">{b.CarDetails?.Model}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark small">{b.UserDetails?.Name || "Guest"}</div>
                      <div className="text-muted tiny">{b.UserDetails?.Email}</div>
                    </td>
                    <td>
                      <div className="small fw-semibold text-dark">{b.pick_date}</div>
                      <div className="text-muted tiny"><i className="bi bi-clock me-1"></i>Standard Booking</div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">₹{(Number(b.VehicleId_tarife) || 0).toLocaleString()}</div>
                      <div className="text-muted tiny text-uppercase">Gross Amount</div>
                    </td>
                    <td className="text-center">
                      <LuxuryBadge status={b.payment_status} onClick={() => handleStatusChange(b)}>
                        {b.payment_status}
                      </LuxuryBadge>
                    </td>
                    <td className="text-end pe-4">
                      <Button
                        variant="outline-danger"
                        className="btn-sm rounded-pill px-3 border-0 bg-danger bg-opacity-10"
                        onClick={() => {
                          Swal.fire({
                            title: 'Terminate Booking?',
                            text: "This will permanently remove the record.",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#ef4444',
                            confirmButtonText: 'Yes, Delete'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              deleteBooking(b.FirestoreId).then(loadBookings);
                            }
                          })
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 bg-white d-flex justify-content-between align-items-center border-top">
          <span className="text-muted tiny">Showing <b>{currentRecords.length}</b> of {filtered.length} entries</span>
          <Pagination className="mb-0 custom-pagination">
            <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
          </Pagination>
        </div>
      </PremiumCard>

      <style>{`
        .tiny { font-size: 11px; font-weight: 500; }
        .custom-table tbody tr { transition: all 0.2s ease; }
        .custom-table tbody tr:hover { background-color: #f8fafc; }
        .pagination .page-link { border: none; color: #64748b; font-size: 13px; font-weight: 600; margin: 0 2px; border-radius: 8px !important; }
        .pagination .page-item.active .page-link { background-color: #0f172a; color: #fff; }
      `}</style>
    </PageWrapper>
  );
}