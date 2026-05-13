import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import styled from "styled-components";
import { Table, Spinner, Card, InputGroup, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

/* ================= THEME STYLES ================= */
const PageWrapper = styled.div`
  background-color: #f1f5f9;
  min-height: 100vh;
  padding: 30px;
`;

const UserCard = styled(Card)`
  border: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const AvatarCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.bg || "#0f172a"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const ActionBtn = styled(Button)`
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  transition: all 0.2s;
  
  &.view-btn {
    background: rgba(15, 23, 42, 0.05);
    color: #0f172a;
    border: 1px solid rgba(15, 23, 42, 0.1);
    &:hover { background: #0f172a; color: white; }
  }
  
  &.delete-btn {
    background: rgba(239, 68, 68, 0.05);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.1);
    &:hover { background: #ef4444; color: white; }
  }
`;

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res.data.Status === "OK") {
        setUsers(res.data.Data);
        setFilteredUsers(res.data.Data);
      } else {
        setUsers([]); setFilteredUsers([]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Confirm Deletion?",
      text: "This user profile and history will be permanently erased.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Remove User",
      cancelButtonText: "Discard"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteUser(id);
        if (res.data.Status === "OK") {
          Swal.fire("Deleted!", "User record updated.", "success");
          loadUsers();
        } else {
          Swal.fire("Error", res.data.Data, "error");
        }
      }
    });
  };

  useEffect(() => {
    let result = users;
    if (search.trim() !== "") {
      result = users.filter((u) =>
        u.User?.Name?.toLowerCase().includes(search.toLowerCase()) ||
        u.User?.Email?.toLowerCase().includes(search.toLowerCase()) ||
        u.User?.Phone?.includes(search)
      );
    }
    setFilteredUsers(result);
  }, [search, users]);

  // UI Helpers
  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  const colors = ["#0f172a", "#f59e0b", "#10b981", "#6366f1", "#ec4899"];

  return (
    <PageWrapper>
      {/* HEADER AREA */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">User Directory</h2>
          <p className="text-muted mb-0">Manage your verified customer base and their profiles.</p>
        </div>
        <div className="d-flex gap-3">
          <InputGroup className="bg-white rounded-pill px-3 shadow-sm border-0" style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-white border-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              placeholder="Search by name, email..."
              className="border-0 shadow-none bg-transparent py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button variant="white" className="rounded-circle shadow-sm border-0" onClick={loadUsers}>
            <i className="bi bi-arrow-clockwise text-primary"></i>
          </Button>
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-semibold">Accessing Records...</p>
        </div>
      ) : (
        <UserCard>
          <div className="table-responsive">
            <Table hover align="middle" className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-muted small fw-bold">CLIENT IDENTITY</th>
                  <th className="py-3 text-muted small fw-bold">CONTACT INFO</th>
                  <th className="py-3 text-muted small fw-bold">LOCATION</th>
                  <th className="py-3 text-end pe-4 text-muted small fw-bold">MANAGEMENT</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">No client profiles found.</td></tr>
                ) : (
                  filteredUsers.map((u, index) => (
                    <tr key={u.Id} className="border-bottom border-light">
                      <td className="ps-4 py-4">
                        <div className="d-flex align-items-center gap-3">
                          <AvatarCircle bg={colors[index % colors.length]}>
                            {getInitials(u.User?.Name)}
                          </AvatarCircle>
                          <div>
                            <div className="fw-bold text-dark">{u.User?.Name || "Anonymous User"}</div>
                            <div className="text-muted tiny">UID: {u.Id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small fw-semibold text-dark">{u.User?.Email || "N/A"}</div>
                        <div className="text-muted tiny"><i className="bi bi-phone me-1"></i>{u.User?.Phone || "N/A"}</div>
                      </td>
                      <td>
                        <div className="text-dark small" style={{ maxWidth: "200px" }}>
                          <i className="bi bi-geo-alt text-muted me-1"></i>
                          {u.User?.Address || "No address provided"}
                        </div>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex gap-2 justify-content-end">
                          <Link to={`/admin/users/${u.Id}`}>
                            <ActionBtn className="view-btn">
                              <i className="bi bi-eye me-1"></i> Bookings
                            </ActionBtn>
                          </Link>
                          <ActionBtn className="delete-btn" onClick={() => handleDelete(u.Id)}>
                            <i className="bi bi-trash"></i>
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          
          <div className="p-3 bg-white border-top text-center">
            <span className="text-muted tiny">Total Active Members: <b>{filteredUsers.length}</b></span>
          </div>
        </UserCard>
      )}

      <style>{`
        .tiny { font-size: 11px; }
        .table tbody tr { transition: 0.2s; }
        .table tbody tr:hover { background-color: #f8fafc; }
        .form-control:focus { background-color: transparent !important; }
      `}</style>
    </PageWrapper>
  );
}