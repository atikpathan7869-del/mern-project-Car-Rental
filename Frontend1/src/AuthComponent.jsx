import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../Fairbase_Config";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* INLINE CSS */}
      <style>{`
        body {
          background: linear-gradient(135deg, #0d6efd, #6610f2);
        }
        .auth-card {
          border-radius: 12px;
        }
        .profile-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 3px solid #0d6efd;
        }
        .google-btn img {
          width: 18px;
          margin-right: 10px;
        }
      `}</style>

      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="card auth-card shadow p-4" style={{ width: "360px" }}>
          {user ? (
            <div className="text-center">
              <img
                src={user.photoURL}
                alt="profile"
                className="profile-img mb-3"
              />
              <h5 className="mb-1">Welcome, {user.displayName}</h5>
              <p className="text-muted">{user.email}</p>

              <button
                className="btn btn-danger w-100 mt-3"
                onClick={signOutUser}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h4 className="mb-2">Welcome Back</h4>
              <p className="text-muted mb-4">
                Sign in to continue
              </p>

              <button
                className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center google-btn"
                onClick={signInWithGoogle}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                />
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
