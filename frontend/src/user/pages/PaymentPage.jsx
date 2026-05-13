import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { savePayment } from "../../services/api"; 

export default function PaymentPage() {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  // WORKING LOGIC: Extracting FirestoreId and objects from state
  const { booking, vehicle, FirestoreId } = location.state || {};
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!booking || !vehicle) {
      navigate("/profile");
    }
  }, [booking, vehicle, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    Swal.fire({
      title: paymentMode === "Cash" ? "Confirming Booking..." : "Verifying Transaction",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      /**
       * WORKING LOGIC: Firestore ID Validation
       */
      const finalFirebaseId = FirestoreId || booking?.FirestoreId || (id?.length > 5 ? id : null);

      if (!finalFirebaseId) {
        throw new Error("Firestore Document ID missing. Please go back to Profile and click Pay again.");
      }

      const paymentData = {
        BookingId: String(finalFirebaseId), 
        UserId: booking?.CustomerId || localStorage.getItem("userId") || "Guest_User",
        Amount: Number(booking?.VehicleId_tarife) || 0,
        PaymentMethod: paymentMode,
        PaymentStatus: paymentMode === "Cash" ? "Pending" : "Paid", 
        UpiId: paymentMode === "UPI" ? "user@upi" : "" 
      };

      console.log("Final Payload to Backend:", paymentData);

      const res = await savePayment(paymentData);
      
      if (res.data.Status === "OK") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: paymentMode === "Cash" ? "Booking confirmed with Pay on Delivery." : "Payment successful!",
          confirmButtonColor: "#0d6efd",
        }).then(() => navigate("/profile"));
      } else {
        throw new Error(res.data.Data || "Transaction Failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message || "Connection error.",
      });
      setIsProcessing(false);
    }
  };

  if (!booking || !vehicle) return null;

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row g-4">
          
          {/* LEFT COLUMN: PREMIUM DESIGN SUMMARY */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="position-relative">
                <img 
                  src={`http://localhost:5000/photos/${vehicle.carImg}`} 
                  className="img-fluid w-100" 
                  alt="vehicle"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="position-absolute bottom-0 start-0 p-3 bg-dark text-white bg-opacity-75 w-100">
                  <h4 className="mb-0">{vehicle.Brand} {vehicle.Model}</h4>
                  <small>{vehicle.Type} • {vehicle.FuelType}</small>
                </div>
              </div>

              <div className="card-body p-4">
                <h6 className="fw-bold text-uppercase small text-muted mb-3">Trip Summary</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pickup Date</span>
                  <span className="fw-bold">{booking.pick_date}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Location</span>
                  <span className="fw-bold text-end" style={{maxWidth: '150px'}}>{booking.Pic_address}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                  <span className="h5 fw-bold">Total Amount</span>
                  <span className="h4 fw-bold text-primary">₹{booking.VehicleId_tarife}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PAYMENT OPTIONS WITH WORKING LOGIC */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-4">Choose Payment Method</h4>
              
              <form onSubmit={handlePayment}>
                {/* UPI */}
                <div 
                  className={`p-3 border rounded-3 mb-3 d-flex align-items-center ${paymentMode === 'UPI' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                  onClick={() => setPaymentMode('UPI')}
                  style={{ cursor: 'pointer' }}
                >
                  <input className="form-check-input" type="radio" checked={paymentMode === 'UPI'} readOnly />
                  <div className="ms-3 flex-grow-1">
                    <div className="fw-bold">Online UPI</div>
                    <small className="text-muted">Instant payment using PhonePe, GPay</small>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="upi" width="45" />
                </div>

                {/* CASH */}
                <div 
                  className={`p-3 border rounded-3 mb-4 d-flex align-items-center ${paymentMode === 'Cash' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                  onClick={() => setPaymentMode('Cash')}
                  style={{ cursor: 'pointer' }}
                >
                  <input className="form-check-input" type="radio" checked={paymentMode === 'Cash'} readOnly />
                  <div className="ms-3 flex-grow-1">
                    <div className="fw-bold">Pay on Delivery (Cash)</div>
                    <small className="text-muted">Pay at the time of pickup</small>
                  </div>
                  <div className="h3 mb-0">💵</div>
                </div>

                <div className="row g-2">
                  <div className="col-md-8">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${booking.VehicleId_tarife} Securely`}
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="button" 
                      className="btn btn-light btn-lg w-100 py-3 text-muted border"
                      onClick={() => navigate("/profile")}
                      disabled={isProcessing}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

