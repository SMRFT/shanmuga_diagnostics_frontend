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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDE1NyIsImVtYWlsIjoibWFuaWJhbGFuc21yZnRAZ21haWwuY29tIiwibmFtZSI6IlN1bmRhciBNIiwiYWxsb3dlZC1hY3Rpb25zIjpbIlNELUFQSS1URC1SIiwiU0QtQVBJLUNOLVJXIiwiU0QtUC1TU1UtUiIsIlNELUFQSS1UTS1SVyIsIlNULVAtTlRGLVIiLCJTVC1QLURFUy1SIiwiU0QtUC1URC1SIiwiU0QtUC1NQkRGLVJXIiwiRkUtUC1GUy1SVyIsIlNELUFQSS1UVi1SIiwiU0QtUC1MUkMtUiIsIlNELVAtTEJGLVJXIiwiU0QtUC1TSVItUlciLCJTRC1QLUxCQy1SVyIsIlNELUFQSS1JVk0tUlciLCJTRC1QLVNTLVJXIiwiU0QtUC1CRy1SIiwiU0QtUC1QTC1SIiwiU0QtUC1QRi1SIiwiU0QtUC1URS1SIiwiU0QtUC1TUC1SIiwiU0QtUC1TQ1UtUlciLCJTRC1BUEktUFItUiIsIlNELVAtR1BELVJXIiwiU0QtQVBJLVJCLVJXIiwiU0QtQVBJLUdPUi1SVyIsIlNELUFQSS1NQlRELVJXIiwiRkUtUC1GQUwtUlciLCJTRC1QLUJURC1SVyIsIlNELUFQSS1UTS1SIiwiU0QtUC1TVkYtUlciLCJTRC1QLVNIRi1SIiwiU0QtUC1DSEMtUlciLCJTRC1QLVNIRi1SVyIsIlNELVAtQkJBLVJXIiwiU1QtQVBJLUNSRC1SVyIsIkdQLVAtR0NOLVIiLCJTRC1QLVRTLVJXIiwiU0QtUC1TU1UtUlciLCJTRC1QLVBCLVJXIiwiU0QtUC1QRy1SVyIsIlNELVAtR1BELVIiLCJTRC1QLVNHRS1SIiwiU0QtQVBJLVZDLVJXIiwiRkUtUC1GVUItUlciLCJTRC1QLUxCTi1SIiwiU1QtUC1UREwtUiIsIlNULUFQSS1BTUMtUlciLCJTRC1QLU1JUy1SIiwiU0QtUC1MR0UtUlciLCJTRC1QLVJELVJXIiwiU0QtUC1DSEMtUiIsIlNULVAtREVTLVJXIiwiU0QtUC1MR0QtUlciLCJTRC1QLVBCLVIiLCJTRC1QLUxTUi1SVyIsIlNULVItSE9EIiwiU0QtUC1NQlBELVIiLCJGRS1QLUZSLVJXIiwiU0QtUC1TR0FDLVIiLCJTRC1QLVVQQi1SIiwiU1QtQVBJLUJSRC1SVyIsIlNELVAtTEQtUlciLCJTRC1BUEktR0MtUlciLCJTRC1QLVRELVJXIiwiU0QtUC1TQy1SIiwiU0QtUC1ERi1SIiwiU0QtUC1TUy1SIiwiU0QtQVBJLUdSLVJXIiwiU0QtUC1MVEEtUlciLCJTVC1BUEktRU1QLVIiLCJTRC1BUEktTUlTLVJXIiwiU0QtUC1VUEItUlciLCJTRC1QLU9ELVIiLCJTVC1QLUNNVC1SIiwiU1QtUC1UREwtUlciLCJTRC1QLURGLVJXIiwiU1QtUC1CUkQtUiIsIkZFLVAtRkctUlciLCJTRC1QLVNHQUMtUlciLCJTRC1QLUdQQi1SVyIsIlNELVAtUEQtUiIsIlNELVAtVEUtUlciLCJTRC1QLVBHLVIiLCJTRC1QLVNWRC1SVyIsIlNELVAtUEYtUlciLCJTRC1QLUJURC1SIiwiU0QtUC1HU1AtUiIsIlNELVAtQ0wtUlciLCJGRS1SLUZBIiwiU0QtUC1MU0wtUlciLCJTRC1SLUdNIiwiRkUtUC1GU0ItUlciLCJTRC1QLUxQSS1SIiwiU1QtUC1DTVQtUlciLCJTRC1BUEktVlAtUlciLCJTRC1BUEktR0QtUiIsIkZFLVAtRkYtUlciLCJTRC1BUEktUkNMLVJXIiwiU1QtUC1TTk8tUlciLCJTRC1QLVBPVi1SVyIsIlNELVAtTFRNLVJXIiwiU0QtQVBJLUdPQy1SVyIsIlNELVAtQkEtUlciLCJGRS1QLUZVUy1SVyIsIlNELVAtU1ZGLVIiLCJTRC1QLUxUUi1SVyIsIlNELVAtR1BULVJXIiwiRkUtUC1GR0wtUiIsIkZFLVItRkEtUlciLCJTRC1QLU1CVFYtUiIsIlNELVAtU09SLVJXIiwiRkUtUC1GR0YtUiIsIlNULVAtTlRGLVJXIiwiU0QtQVBJLUlWTS1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODM3NTc0ODcsImV4cCI6MTc4Mzg0NDQ4N30.EYLI1vToOFUW7fbfxighNFwFq7quWkSoAAnvveemWhywceBAUJy-47-DIeeu8HCCD_Xc8OxQRixNbZB0FFadoy41_kB5MrwETQI48AENYzFlTS4-8L0dmVD1eP3cQVcGFAiVhEyZEcsqM2UUeJWHjRkK6ccJOk8cAmnuNF8nVzZfz1yIOkNG6h6O_rvIqMMreJERMdSOdK5ZCBssFJP3vn2iIyfbNtHjErAh6zJcde-U9p4sdPb8BeIPC2B3iJWRqt4Jaw80qoHMaIjGSNZmmLN6nLZ91Kcos-AmNciXiUu9oPCZkBphjH_KiVPuYVe_n_30qVv9IReHgKsKoJf4UA";
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
  } else if (allowedActions.includes("SD-R-PH")) {
    return "PH";
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
