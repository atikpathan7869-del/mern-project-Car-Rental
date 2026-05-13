import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicles, getAllUsers, getAllBookings } from "../../services/api";
import { Card, Row, Col, Table, ListGroup, Button, Spinner, Badge, ProgressBar } from "react-bootstrap";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

// Styled Components for consistent Premium Look
const DashboardWrapper = styled.div`
  background-color: #f1f5f9;
  min-height: 100vh;
  padding: 30px;
`;

const PremiumCard = styled(Card)`
  border: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCars: 0, availableCars: 0, rentedCars: 0,
    totalUsers: 0, totalBookings: 0, totalRevenue: 0, utilizationRate: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [carsRes, usersRes, bookingsRes] = await Promise.all([
        getVehicles(), getAllUsers(), getAllBookings()
      ]);

      const cars = carsRes.data?.Data || [];
      const users = usersRes.data?.Data || [];
      const bookings = bookingsRes.data?.Data || [];

      const rentedCount = cars.filter(c => c.Car?.Status === "Booked").length;
      const maintenanceCount = cars.filter(c => c.Car?.Status === "Maintenance").length;
      const availableCount = cars.length - rentedCount - maintenanceCount;

   const revenue = bookings.reduce((total, b) => {
  // 1. Check karein ki booking aur tarife exist karta hai
  const tarife = b?.Booking?.VehicleId_tarife;
  
  // 2. String se currency symbols ya commas hatayein aur number mein convert karein
  const price = typeof tarife === "string" 
    ? parseFloat(tarife.replace(/[^\d.]/g, "")) 
    : parseFloat(tarife || 0);

  // 3. Agar price valid number nahi hai toh 0 return karein
  const validPrice = isNaN(price) ? 0 : price;

  // 4. Sirf "Paid" bookings ka total karein
  return b?.Booking?.payment_status === "Paid" ? total + validPrice : total;
}, 0);
      const utilization = cars.length > 0 ? Math.round((rentedCount / cars.length) * 100) : 0;

      setStats({
        totalCars: cars.length, availableCars: availableCount, rentedCars: rentedCount,
        totalUsers: users.length, totalBookings: bookings.length, totalRevenue: revenue, utilizationRate: utilization
      });

      setRecentUsers(users.slice(-6).reverse());
      setRecentBookings(bookings.slice(-6).reverse());
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" style={{color: "#f59e0b"}} />
      </div>
    );
  }

  return (
    <DashboardWrapper>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">Executive Overview</h2>
          <p className="text-muted">Monitoring fleet performance and revenue streams.</p>
        </div>
        <div className="d-flex gap-3">
          <Button variant="outline-dark" className="rounded-pill px-4 shadow-sm bg-white" onClick={loadDashboard}>
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh
          </Button>
          <Button style={{backgroundColor: "#0f172a", border: "none"}} className="rounded-pill px-4 shadow-sm text-white" onClick={() => navigate("/admin/cars")}>
            <i className="bi bi-plus-lg me-2"></i>Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <StatCard 
          title="Gross Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon="bi-currency-exchange" 
          color="#f59e0b" // Amber Gold
          trend="Total Earnings"
          onClick={() => navigate("/admin/Adminpayments")} 
        />
        <StatCard 
          title="On Road" 
          value={stats.rentedCars} 
          icon="bi-key" 
          color="#0f172a" // Navy Blue
          trend="Currently Rented"
          onClick={() => navigate("/admin/bookings")} 
        />
        <StatCard 
          title="Fleet Size" 
          value={stats.totalCars} 
          icon="bi-car-front" 
          color="#3b82f6" 
          trend="Total Inventory"
          onClick={() => navigate("/admin/cars")} 
        />
        <StatCard 
          title="Active Clients" 
          value={stats.totalUsers} 
          icon="bi-person-badge" 
          color="#10b981" 
          trend="Registered Users"
          onClick={() => navigate("/admin/users")} 
        />
      </Row>

      <Row className="g-4">
        {/* Recent Activity Table */}
        <Col lg={8}>
          <PremiumCard>
            <Card.Header className="bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 text-dark">Live Booking Stream</h5>
              <Badge style={{backgroundColor: "#fef3c7", color: "#d97706"}} className="rounded-pill px-3 py-2">Real-time Updates</Badge>
            </Card.Header>
            <div className="table-responsive px-4 pb-4">
              <Table hover align="middle" className="mb-0 custom-table">
                <thead className="text-muted small">
                  <tr>
                    <th className="border-0">VEHICLE</th>
                    <th className="border-0">CLIENT</th>
                    <th className="border-0 text-center">PAYMENT</th>
                    <th className="border-0 text-end">FARE</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, idx) => (
                    <tr key={idx} style={{borderBottom: "1px solid #f1f5f9"}}>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3 rounded-3 bg-light p-2 text-dark">
                            <i className="bi bi-car-front-fill"></i>
                          </div>
                          <div>
                            <div className="fw-bold small">{b.CarDetails?.Brand} {b.CarDetails?.Model}</div>
                            <div className="text-muted tiny">{b.Booking?.pick_date}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small fw-semibold">{b.UserDetails?.Name}</div>
                        <div className="text-muted tiny">ID: {b.UserDetails?.id?.substring(0,8)}...</div>
                      </td>
                      <td className="text-center">
                        <Badge bg={b.Booking?.payment_status === "Paid" ? "success" : "warning"} className="rounded-pill">
                          {b.Booking?.payment_status}
                        </Badge>
                      </td>
                      <td className="text-end fw-bold">₹{b.Booking?.VehicleId_tarife}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </PremiumCard>
        </Col>

        {/* Fleet Analysis Sidebars */}
        <Col lg={4}>
          <PremiumCard className="mb-4 text-white" style={{backgroundColor: "#0f172a"}}>
            <Card.Body className="p-4">
              <h6 className="text-uppercase opacity-50 mb-4 small fw-bold">Fleet Utilization</h6>
              <div className="d-flex align-items-baseline gap-2 mb-3">
                <h1 className="mb-0 fw-bold">{stats.utilizationRate}%</h1>
                <span style={{color: "#f59e0b"}} className="small fw-bold">Active Demand</span>
              </div>
              <ProgressBar 
                now={stats.utilizationRate} 
                style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.1)' }} 
                className="mb-3"
                variant="warning"
              />
              <p className="text-white-50 small mb-0">Total of {stats.rentedCars} out of {stats.totalCars} vehicles are currently booked.</p>
            </Card.Body>
          </PremiumCard>

          <PremiumCard>
            <Card.Header className="bg-white border-0 py-4 px-4">
              <h5 className="fw-bold mb-0">Recent Clients</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {recentUsers.map((u, i) => (
                <ListGroup.Item key={i} className="px-4 py-3 border-0">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" 
                      style={{ width: '45px', height: '45px', backgroundColor: '#f1f5f9', color: '#0f172a' }}
                    >
                      {u.User?.Name?.charAt(0)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold small">{u.User?.Name}</div>
                      <div className="text-muted tiny">{u.User?.Email}</div>
                    </div>
                    <i className="bi bi-arrow-up-right text-muted small"></i>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </PremiumCard>
        </Col>
      </Row>

      <style>{`
        .tiny { font-size: 11px; }
        .custom-table tbody tr:hover { background-color: #fafafa; }
        .progress-bar { background-color: #f59e0b !important; }
      `}</style>
    </DashboardWrapper>
  );
}

function StatCard({ title, value, icon, color, trend, onClick }) {
  return (
    <Col xs={12} sm={6} lg={3}>
      <PremiumCard onClick={onClick} style={{ cursor: 'pointer' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between">
            <div>
              <p className="text-muted small fw-bold text-uppercase mb-2">{title}</p>
              <h2 className="fw-bold mb-1">{value}</h2>
              <p className="small mb-0 fw-semibold" style={{color: color}}>{trend}</p>
            </div>
            <div 
              className="rounded-4 d-flex align-items-center justify-content-center shadow-sm" 
              style={{ width: '60px', height: '60px', backgroundColor: `${color}15`, color: color }}
            >
              <i className={`bi ${icon} h3 mb-0`}></i>
            </div>
          </div>
        </Card.Body>
      </PremiumCard>
    </Col>
  );
}