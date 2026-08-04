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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NiIsImVtYWlsIjoiY2hhbmRyYXNtcmZ0QGdtYWlsLmNvbSIsIm5hbWUiOiJjaGFuZHJhIiwiYWxsb3dlZC1hY3Rpb25zIjpbIkVSLVAtRVJQLVIiLCJGRS1QLUZHTC1SIiwiRkUtUi1GQSIsIkZFLVAtRlVTLVJXIiwiU1QtUC1DTVQtUiIsIlNJTi1BUEktT1JSLVIiLCJFUi1QLUVSVkItUlciLCJTRC1QLVRELVIiLCJTSU4tQVBJLVNGLVIiLCJTVC1QLURFUy1SIiwiU0lOLVItQURNIiwiU1QtUC1CUkQtUiIsIlNELVAtUEQtUiIsIlNULVAtU05PLVJXIiwiU0QtUC1ERi1SIiwiR1AtUC1HQ04tUiIsIlNELVAtQ0hDLVIiLCJTSU4tUC1DRi1SIiwiU1QtUC1UREwtUiIsIlNJTi1QLUNIRS1SVyIsIkVSLVAtRVJTRC1SVyIsIkVSLVAtRVJHUFItUlciLCJTRC1QLUdQRC1SIiwiU0QtUC1QT1YtUiIsIlNELVAtU1NVLVJXIiwiU1QtQVBJLUJSRC1SVyIsIlNJTi1BUEktR0lDLVIiLCJFUi1QLUVSVVMtUlciLCJGRS1QLUZTLVJXIiwiU1QtUC1UREwtUlciLCJTSU4tQVBJLUlGLVJXIiwiU0lOLVAtR0RMLVJXIiwiU1QtQVBJLUVNUC1SIiwiU1QtUi1BIiwiU0QtUC1CVEQtUlciLCJTRC1QLVNTLVJXIiwiU0QtUC1TUy1SIiwiU0QtUC1CRy1SIiwiU0QtQVBJLVJCLVIiLCJTRC1QLVBMLVIiLCJTSU4tUC1SVC1SVyIsIlNELVAtREYtUlciLCJGRS1QLUZBTC1SIiwiU0QtUC1TU1UtUiIsIlNULUFQSS1DUkQtUlciLCJTRC1QLUJURC1SIiwiU0QtQVBJLVRELVIiLCJTRC1BUEktVE0tUiIsIlNELVAtTUlTLVIiLCJTRC1QLVRELVJXIiwiU0QtQVBJLVRWLVIiLCJTRC1SLUNFTyIsIkVSLVAtRVJHQVMtUlciLCJGRS1QLUZHRi1SIiwiRkUtUC1GRi1SVyIsIlNULVAtQ01ULVJXIiwiU0lOLVAtUlRBLVJXIiwiU0QtQVBJLUNOLVIiLCJTVC1QLU5URi1SVyIsIkZFLVAtRkctUlciLCJFUi1SLUVSUCIsIlNJTi1BUEktRlUtUlciLCJTRC1QLUNIQy1SVyIsIlNJTi1BUEktT1ItUlciLCJTRC1QLVNDVS1SVyIsIkZFLVAtRlItUlciLCJTVC1BUEktQU1DLVJXIiwiU0lOLVAtRU5RLVJXIiwiU0QtUC1QT1YtUlciLCJTVC1QLU5URi1SIiwiU1QtUC1ERVMtUlciLCJTSU4tUC1DSEVBLVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbXSwiYWxsb3dlZC1vdXRsZXRzIjpbXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODU4MTIyNjMsImV4cCI6MTc4NTg5OTI2M30.QEaL7UxtbPMlZdw07tZ8SsojA6vPqLVW4j4lenojQN3lBrwkim_9A9vwucEmUqihwRKcLNLGFfOy8hEzRqiXuf0xvqJ84hLefeDzDsYVT7fJ_hdrc2TvRI3MexTae5inyMoo7YpMWOl5KAfm-d7wZfCJ_cIc90c2y6O3YZwiu5Gc8yfeOsk8YdOPza6MeV_8HfVfMBE5vRR-YSmO7OCA8a2V7IVKXqUsa4UwDvg_B8jhHJmUP2v_He-Pizpm2pMIHmH0DpubqdahLSYo1BFtTdjvVw0DYYSUsafTEI_JdVCTXG-sRMdRq7C8d4wxG-mKWte1oPksPDeF5HC_3Hul2A";
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
