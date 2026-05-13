import { useEffect, useState } from "react";
import { getAllBookings } from "../../services/api";
import { Table, Badge, Card, Container, Spinner, Row, Col, Button, Dropdown } from "react-bootstrap";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function PaymentLogs() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      if (res.data.Status === "Ok") {
        setPayments(res.data.Data || []);
      }
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  // Robust Calculation to prevent NaN
  const totalRevenue = payments
    .filter(p => p.Booking?.payment_status === "Paid")
    .reduce((acc, curr) => {
      const val = parseFloat(curr.Booking?.VehicleId_tarife) || 0;
      return acc + val;
    }, 0);

  // --- Export Functions ---
  const exportToExcel = () => {
    const data = payments.map(p => ({
      Transaction_ID: p.FirestoreId,
      Customer: p.UserDetails?.Name,
      Email: p.UserDetails?.Email,
      Date: p.Booking?.pick_date,
      Amount: p.Booking?.VehicleId_tarife,
      Method: p.Booking?.PaymentMethod,
      Status: p.Booking?.payment_status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "Financial_Logs.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Payment Logs", 14, 15);
    const tableColumn = ["Customer", "Date", "Amount", "Method", "Status"];
    const tableRows = payments.map(p => [
      p.UserDetails?.Name,
      p.Booking?.pick_date,
      `Rs. ${p.Booking?.VehicleId_tarife}`,
      p.Booking?.PaymentMethod,
      p.Booking?.payment_status
    ]);
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("Financial_Logs.pdf");
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center mb-4">
        <Col md={6}>
          <h3 className="fw-bold mb-0">💰 Financial Logs</h3>
          <p className="text-muted small">Track revenue and payment status</p>
        </Col>
        <Col md={6} className="text-end">
          <Dropdown className="d-inline-block me-2">
            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic" className="rounded-pill">
              📥 Export Data
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={exportToExcel}>Excel (.xlsx)</Dropdown.Item>
              <Dropdown.Item onClick={exportToPDF}>PDF (.pdf)</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <Card className="d-inline-block border-0 shadow-sm bg-success text-white px-4 py-2 rounded-pill">
            <span className="small opacity-75">Total Received: </span>
            <span className="fw-bold ms-2">₹{totalRevenue.toLocaleString()}</span>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <Table hover align="middle" className="mb-0">
            <thead className="bg-dark text-white">
              <tr>
                <th className="ps-4 py-3">Transaction ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
              
                <th className="text-center pe-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">No records found.</td></tr>
              ) : (
                payments.map((p) => {
                  const isPaid = p.Booking?.payment_status === "Paid";
                  return (
                    <tr key={p.FirestoreId}>
                      <td className="ps-4">
                        <code className="text-muted small" style={{ fontSize: '10px' }}>
                          {p.FirestoreId.substring(0, 16)}
                        </code>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{p.UserDetails?.Name || "Guest"}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{p.UserDetails?.Email}</div>
                      </td>
                      <td className="small text-secondary">{p.Booking?.pick_date}</td>
                      
                      {/* Amount Color Logic: Green for Paid, Red for Pending/Others */}
                      <td className={`fw-bold ${isPaid ? 'text-success' : 'text-danger'}`}>
                        ₹{parseFloat(p.Booking?.VehicleId_tarife || 0).toLocaleString()}
                      </td>

                     
                      <td className="text-center pe-4">
                        <Badge pill bg={isPaid ? "success" : "warning"} className="px-3 py-2 fw-normal">
                          {p.Booking?.payment_status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
}