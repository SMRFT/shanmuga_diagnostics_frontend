import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== LAB INDEX.JS DEBUG ===");
// console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE2NiIsImVtYWlsIjoic3Jpbml2YXNhbmdheWF0aHJpODkyMkBnbWFpbC5jb20iLCJuYW1lIjoiUiBTcmluaXZhc2FuIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELVAtUEctUlciLCJTRC1QLUxSQy1SIiwiU1QtUC1DTVQtUiIsIlNELVAtTFBJLVIiLCJTRC1QLVBGLVJXIiwiU1QtUC1ERVMtUiIsIlNULVItRU1QIiwiU1QtUC1CUkQtUiIsIlNULVAtU05PLVJXIiwiR1AtUC1HQ04tUiIsIlNELVAtTENDLVJXIiwiU0QtUC1MQk4tUiIsIlNULVAtVERMLVIiLCJTRC1BUEktUkItUlciLCJTRC1QLUxCQy1SVyIsIlNELVAtR1BELVIiLCJTRC1QLVNTVS1SVyIsIlNULUFQSS1CUkQtUlciLCJTRC1SLVNNQyIsIlNELVAtR1BCLVIiLCJTRC1BUEktVE0tUlciLCJTRC1QLUJBLVJXIiwiU0QtUC1TUy1SVyIsIlNELVAtQlRELVJXIiwiU0QtUC1TUy1SIiwiU0QtUC1MVE0tUlciLCJTRC1QLUxCTC1SVyIsIlNELVAtR1NQLVIiLCJTRC1QLUxCRi1SVyIsIlNULUFQSS1DUkQtUlciLCJTRC1BUEktU1MtUlciLCJTRC1BUEktVEQtUiIsIlNELVAtU0MtUiIsIlNELUFQSS1DTi1SVyIsIlNULVAtQ01ULVJXIiwiU0QtUC1TUC1SIiwiU1QtUC1OVEYtUlciLCJTRC1QLUJHLVJXIiwiU0QtUC1VUEItUlciLCJTRC1QLVJCLVJXIiwiU0QtUC1MR0UtUlciLCJTRC1QLVBCLVJXIiwiU0QtUC1QT1YtUlciLCJTVC1QLU5URi1SIiwiU1QtQVBJLUNSRC1SIiwiU1QtQVBJLUFNQy1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODU3NDAzNDksImV4cCI6MTc4NTgyNzM0OX0.Z53HqoQkFaZ61MQsmYVHoMNaV0ho9lH6HpMyzJf3kejMa-BbJOYDEKqsFdLhFzJ3tapyoqIFZaSL1oHFKd0oFzJ8umGeRAU8hkkHTxFRsX2yjFDzVyPBIamtLTfsA4Pyx2AZtsV4SuGIo3gPrJEnFCvZS8Jw41JxW_lmFuo3uTqmFOP3eqGRTtZF8ZGr_nyAtHAvzLeRVO5F0ogyhb_yNkCSuhKW--hoFyV0Mobt3X1rlvxNIP6UdsOx8wcZ-9BvOG2s0mzxR5Bq-wpmx3EQoXGhjeRDeCt445Xk6hyfRdiYDMwkj8RAN09-VIYGWD0KKiL3lhwVZMKY8l1PQRt9WQ";
  console.log("🔧 Development token is empty - will redirect to login");
  const selectedBranch = "SHB001";
  localStorage.setItem("selected_branch", selectedBranch);
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    // window.location.href = REDIRECT_URL;
  } else {
    console.error("❌ REDIRECT_URL not configured");
    // Even if REDIRECT_URL is not configured, don't show error - just redirect to a fallback
    // window.location.href = "https://shinova.in/login";
  }
}

// --- Validate JWT Token Locally ---
function validate(token) {
  if (!token || token.trim() === "") {
    throw new Error("Token is empty");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return "Employee"; // Default role
  }
  if (allowedActions.includes("SD-R-A")) {
    return "Admin";
  } else if (allowedActions.includes("SD-R-SMC")) {
    return "Sample Collector";
  } else if (allowedActions.includes("SD-R-LR")) {
    return "Lab Receptionist";
  } else if (allowedActions.includes("SD-R-LT")) {
    return "Lab Technician";
  } else if (allowedActions.includes("SD-R-GM")) {
    return "Diagnostics General Manager";
  } else if (allowedActions.includes("SD-R-DOC")) {
    return "Doctor";
  } else if (allowedActions.includes("SD-R-SE")) {
    return "Sales Executive";
  } else if (allowedActions.includes("SD-R-ACT")) {
    return "Accounts";
  } else if (allowedActions.includes("SD-R-CEO")) {
    return "CEO";
  } else if (allowedActions.includes("SD-R-CL")) {
    return "Clinical Reports";
  } else if (allowedActions.includes("SD-R-MAVP")) {
    return "Marketting AVP";

  } else if (allowedActions.includes("SD-R-HR")) {
    return "HR";
  } else {
    return "Accounts"; // Default role if none of the specific roles are found
  }
}

// --- Main execution ---
(function main() {
  try {
    console.log("Starting token validation...");

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log(
        "❌ No token found in localStorage, trying development token",
      );
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available, redirecting to login");
      localStorage.removeItem("access_token"); // Clean up
      redirectToLogin();
      return; // Stop execution here
    }

    // Validate the token
    const userPayload = validate(accessToken);
    console.log("✅ Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Store the valid token and user information
    localStorage.setItem("access_token", accessToken);

    // Extract user information from token payload
    const employeeId = userPayload.aud; // Using 'aud' field as ID
    const name = userPayload.name;
    const userEmail = userPayload.email;
    const userRole = getUserRole(userPayload["allowed-actions"]);

    console.log("Employee ID:", employeeId);
    console.log("Name:", name);
    console.log("Email:", userEmail);
    console.log("User Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && name);
    console.log("Is logged in:", isLoggedIn);

    if (!isLoggedIn) {
      throw new Error(
        "Missing required user data (employeeId or employeeName)",
      );
    }

    // Store user payload and extracted information for app usage
    localStorage.setItem("user_payload", JSON.stringify(userPayload));
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("name", name);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("role", userRole);

    console.log("✅ User payload and extracted data stored in localStorage");
    console.log("Stored data:", {
      employeeId,
      name,
      userEmail,
      role: userRole,
    });

    // Token is valid, render app
    console.log("✅ Rendering lab app...");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    reportWebVitals();

    // Register Service Worker for Logistics Tracking Notifications
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('❌ ServiceWorker registration failed: ', err);
          });
      });
    }
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
